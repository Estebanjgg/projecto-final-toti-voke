import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI, calculateCartTotals } from '../services/cartAPI';
import { useAlert } from './AlertContext';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Estados del carrito
const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CART_ITEMS: 'SET_CART_ITEMS',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_ERROR: 'SET_ERROR'
};

// Estado inicial del carrito
const initialState = {
  items: [],
  loading: false,
  error: null,
  totals: {
    subtotal: 0,
    totalDiscount: 0,
    total: 0,
    itemCount: 0,
    isEmpty: true
  }
};

// Reducer del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case CART_ACTIONS.SET_CART_ITEMS:
      const totals = calculateCartTotals(action.payload);
      return {
        ...state,
        items: action.payload,
        totals: totals,
        loading: false,
        error: null
      };

    case CART_ACTIONS.ADD_ITEM:
      const newItems = [...state.items, action.payload];
      const newTotals = calculateCartTotals(newItems);
      return {
        ...state,
        items: newItems,
        totals: newTotals
      };

    case CART_ACTIONS.UPDATE_ITEM:
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id ? { ...item, ...action.payload } : item
      );
      const updatedTotals = calculateCartTotals(updatedItems);
      return {
        ...state,
        items: updatedItems,
        totals: updatedTotals
      };

    case CART_ACTIONS.REMOVE_ITEM:
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      const filteredTotals = calculateCartTotals(filteredItems);
      return {
        ...state,
        items: filteredItems,
        totals: filteredTotals
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        totals: {
          subtotal: 0,
          totalDiscount: 0,
          total: 0,
          itemCount: 0,
          isEmpty: true
        }
      };

    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    default:
      return state;
  }
};

// Provider del contexto del carrito
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { showSuccess, showError } = useAlert();
  const { isAuthenticated } = useAuth();

  // Cargar carrito al inicializar
  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  // Cargar carrito desde el servidor
  const loadCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await cartAPI.getCart();
      
      if (response.success) {
        dispatch({ type: CART_ACTIONS.SET_CART_ITEMS, payload: response.data || [] });
      }
    } catch (error) {
      console.error('Error cargando carrito:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Agregar producto al carrito
  const addToCart = async (productId, quantity = 1) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await cartAPI.addToCart(productId, quantity);
      
      if (response.success) {
        // Recargar el carrito completo para obtener datos actualizados
        await loadCart();
        showSuccess('Produto adicionado ao carrinho!');
        return true;
      }
    } catch (error) {
      console.error('Error agregando al carrito:', error);
      showError(error.message || 'Erro ao adicionar produto ao carrinho');
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      return false;
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Actualizar cantidad de producto
  const updateQuantity = async (cartItemId, quantity) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
      if (quantity === 0) {
        return await removeFromCart(cartItemId);
      }

      const response = await cartAPI.updateQuantity(cartItemId, quantity);
      
      if (response.success) {
        await loadCart();
        return true;
      }
    } catch (error) {
      console.error('Error actualizando cantidad:', error);
      showError(error.message || 'Erro ao atualizar quantidade');
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      return false;
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Eliminar producto del carrito
  const removeFromCart = async (cartItemId) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await cartAPI.removeFromCart(cartItemId);
      
      if (response.success) {
        dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: cartItemId });
        showSuccess('Produto removido do carrinho!');
        return true;
      }
    } catch (error) {
      console.error('Error eliminando del carrito:', error);
      showError(error.message || 'Erro ao remover produto do carrinho');
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      return false;
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Limpiar todo el carrito
  const clearCart = async (silent = false) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await cartAPI.clearCart();
      
      if (response.success) {
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
        if (!silent) {
          showSuccess('Carrinho limpo!');
        }
        return true;
      }
    } catch (error) {
      console.error('Error limpiando carrito:', error);
      if (!silent) {
        showError(error.message || 'Erro ao limpar carrinho');
      }
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      return false;
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Refresh silencioso do carrito (para quando o backend já processou)
  const refreshCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      await loadCart();
    } catch (error) {
      console.error('Error refreshing cart:', error);
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return state.items.some(item => item.productId === productId || item.product_id === productId);
  };

  // Obtener cantidad de un producto en el carrito
  const getProductQuantity = (productId) => {
    const item = state.items.find(item => item.productId === productId || item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    // Estado
    ...state,
    
    // Mapeos explícitos para compatibilidad
    cartItems: state.items,
    
    // Totales calculados
    totalItems: state.totals.itemCount,
    cartTotal: state.totals.total,
    cartItemsCount: state.items.length,
    
    // Acciones
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    loadCart,
    
    // Utilidades
    isInCart,
    getProductQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export default CartContext;

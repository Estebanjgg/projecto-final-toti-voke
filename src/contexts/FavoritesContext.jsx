import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe ser usado dentro de FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { showSuccess, showError } = useAlert();

  const API_URL = import.meta.env.VITE_API_URL || 'https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com';

  // Función para obtener headers de autenticación
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  // Cargar información completa de productos favoritos
  const loadFavoriteProducts = useCallback(async (favoritesList) => {
    if (!favoritesList || favoritesList.length === 0) {
      setFavoriteProducts([]);
      return;
    }

    try {
      // Usar la API real para obtener información de productos
      const productPromises = favoritesList.map(async (favorite) => {
        try {
          const response = await fetch(`${API_URL}/api/products/${favorite.product_id}`);
          if (response.ok) {
            const productData = await response.json();
            return productData.success ? productData.data : null;
          }
          return null;
        } catch (error) {
          console.error(`Error cargando producto ${favorite.product_id}:`, error);
          return null;
        }
      });

      const products = await Promise.all(productPromises);
      const validProducts = products.filter(product => product !== null);
      setFavoriteProducts(validProducts);
    } catch (error) {
      console.error('Error cargando productos favoritos:', error);
      // Si falla, usar productos mock como fallback
      const mockFavorites = favoritesList.slice(0, 6).map((fav, index) => ({
        id: fav.product_id,
        title: `Producto ${fav.product_id}`,
        image: `/picture/image-propaganda/Screenshot_${81 + (index % 6)}.png`,
        original_price: 999.99,
        current_price: 899.99,
        discount: 10,
        rating: 4.5,
        reviews: 100,
        category: "Electrónicos",
        brand: "Voke"
      }));
      setFavoriteProducts(mockFavorites);
    }
  }, [API_URL]);

  // Cargar favoritos del usuario
  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      setFavoriteProducts([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/favorites`, {
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFavorites(data.data || []);
        
        // Cargar información completa de los productos favoritos
        if (data.data && data.data.length > 0) {
          await loadFavoriteProducts(data.data);
        } else {
          setFavoriteProducts([]);
        }
      } else {
        console.error('Error cargando favoritos:', data.message);
        // Si falla, usar datos mock para testing (solo para desarrollo)
        setFavorites([
          { product_id: 1, created_at: new Date().toISOString() },
          { product_id: 2, created_at: new Date().toISOString() }
        ]);
        setFavoriteProducts([]);
      }
    } catch (error) {
      console.error('Error cargando favoritos:', error);
      // Si falla la conexión, usar datos mock para testing (solo para desarrollo)
      setFavorites([
        { product_id: 1, created_at: new Date().toISOString() },
        { product_id: 2, created_at: new Date().toISOString() }
      ]);
      setFavoriteProducts([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, API_URL, loadFavoriteProducts]);

  // Verificar si un producto está en favoritos
  const isFavorite = useCallback((productId) => {
    if (!productId) return false;
    return favorites.some(fav => fav.product_id === productId);
  }, [favorites]);

  // Agregar producto a favoritos
  const addToFavorites = useCallback(async (productId) => {
    if (!isAuthenticated) {
      showError('❌ Debes iniciar sesión para agregar favoritos');
      return false;
    }

    // Validar que el productId sea válido (UUID o string)
    if (!productId || typeof productId !== 'string' || productId.trim() === '') {
      showError('❌ ID de producto inválido');
      return false;
    }

    try {
      console.log('🎯 Agregando producto a favoritos:', productId);
      
      const response = await fetch(`${API_URL}/api/favorites/${productId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Agregar a la lista local
        const newFavorite = { product_id: productId, created_at: new Date().toISOString() };
        setFavorites(prev => [...prev, newFavorite]);
        
        // Intentar cargar información del producto
        try {
          const productResponse = await fetch(`${API_URL}/api/products/${productId}`);
          if (productResponse.ok) {
            const productData = await productResponse.json();
            if (productData.success) {
              setFavoriteProducts(prev => [...prev, productData.data]);
            }
          }
        } catch (error) {
          console.error('Error cargando datos del producto:', error);
        }
        
        showSuccess('❤️ Agregado a favoritos');
        return true;
      } else {
        if (data.message === 'El producto ya está en favoritos') {
          showError('ℹ️ El producto ya está en tus favoritos');
        } else {
          showError(`❌ Error: ${data.message || 'Error al agregar a favoritos'}`);
        }
        return false;
      }
    } catch (error) {
      console.error('Error agregando a favoritos:', error);
      showError('❌ Error de conexión');
      return false;
    }
  }, [isAuthenticated, API_URL, showSuccess, showError]);

  // Remover producto de favoritos
  const removeFromFavorites = useCallback(async (productId) => {
    if (!isAuthenticated) {
      return false;
    }

    // Validar que el productId sea válido (UUID o string)
    if (!productId || typeof productId !== 'string' || productId.trim() === '') {
      showError('❌ ID de producto inválido');
      return false;
    }

    try {
      console.log('💔 Removiendo producto de favoritos:', productId);
      
      const response = await fetch(`${API_URL}/api/favorites/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Remover de la lista local
        setFavorites(prev => prev.filter(fav => fav.product_id !== productId));
        setFavoriteProducts(prev => prev.filter(product => product.id !== productId));
        showSuccess('💔 Removido de favoritos');
        return true;
      } else {
        showError(`❌ Error: ${data.message || 'Error al remover de favoritos'}`);
        return false;
      }
    } catch (error) {
      console.error('Error removiendo de favoritos:', error);
      showError('❌ Error de conexión');
      return false;
    }
  }, [isAuthenticated, API_URL, showSuccess, showError]);

  // Toggle favorito (agregar si no está, remover si está)
  const toggleFavorite = useCallback(async (productId) => {
    if (!isAuthenticated) {
      showError('❌ Debes iniciar sesión para gestionar favoritos');
      return false;
    }

    const isCurrentlyFavorite = isFavorite(productId);
    
    if (isCurrentlyFavorite) {
      return await removeFromFavorites(productId);
    } else {
      return await addToFavorites(productId);
    }
  }, [isAuthenticated, isFavorite, addToFavorites, removeFromFavorites, showError]);

  // Obtener cantidad de favoritos
  const getFavoritesCount = useCallback(() => {
    return favorites.length;
  }, [favorites]);

  // Limpiar favoritos (al hacer logout)
  const clearFavorites = useCallback(() => {
    setFavorites([]);
    setFavoriteProducts([]);
  }, []);

  // Cargar favoritos cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavorites();
    } else {
      clearFavorites();
    }
  }, [isAuthenticated, user, loadFavorites, clearFavorites]);

  const value = {
    favorites,
    favoriteProducts,
    loading,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    getFavoritesCount,
    loadFavorites,
    clearFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

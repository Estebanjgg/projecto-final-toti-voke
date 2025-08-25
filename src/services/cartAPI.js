import { API_BASE_URL } from './api';

// Función auxiliar para manejar respuestas de la API
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Función auxiliar para hacer peticiones
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Obtener token de autenticación si existe (usando la misma clave que AuthContext)
  const token = localStorage.getItem('token');
  
  // Obtener o generar session_id para usuarios no autenticados
  let sessionId = localStorage.getItem('sessionId');
  if (!token && !sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(sessionId && !token && { 'x-session-id': sessionId }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Si el servidor devuelve un nuevo session_id, guardarlo
    const newSessionId = response.headers.get('x-session-id');
    if (newSessionId && !token) {
      localStorage.setItem('sessionId', newSessionId);
    }
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error en petición a ${url}:`, error);
    throw error;
  }
};

// API del carrito de compras
export const cartAPI = {
  // Obtener carrito actual
  getCart: async () => {
    return apiRequest('/cart');
  },

  // Obtener resumen del carrito
  getSummary: async () => {
    return apiRequest('/cart/summary');
  },

  // Agregar producto al carrito
  addToCart: async (productId, quantity = 1) => {
    return apiRequest('/cart/add', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity
      }),
    });
  },

  // Actualizar cantidad de un producto
  updateQuantity: async (cartItemId, quantity) => {
    return apiRequest(`/cart/update/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({
        quantity: quantity
      }),
    });
  },

  // Eliminar producto del carrito
  removeFromCart: async (cartItemId) => {
    return apiRequest(`/cart/remove/${cartItemId}`, {
      method: 'DELETE',
    });
  },

  // Limpiar todo el carrito
  clearCart: async () => {
    return apiRequest('/cart/clear', {
      method: 'DELETE',
    });
  },

  // Migrar carrito de sesión a usuario (cuando se autentica)
  migrateCart: async (sessionId) => {
    return apiRequest('/cart/migrate', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId
      }),
    });
  },
};

// Hook para calcular totales del carrito
export const calculateCartTotals = (cartItems = []) => {
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.products?.current_price || item.price || 0);
    const quantity = parseInt(item.quantity || 0);
    return sum + (price * quantity);
  }, 0);

  const itemCount = cartItems.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);

  // Calculamos descuentos si hay productos con precio original
  const totalDiscount = cartItems.reduce((sum, item) => {
    const currentPrice = parseFloat(item.products?.current_price || item.price || 0);
    const originalPrice = parseFloat(item.products?.original_price || currentPrice);
    const quantity = parseInt(item.quantity || 0);
    return sum + ((originalPrice - currentPrice) * quantity);
  }, 0);

  const total = subtotal;

  return {
    subtotal: subtotal,
    totalDiscount: totalDiscount,
    total: total,
    itemCount: itemCount,
    isEmpty: itemCount === 0
  };
};

// Función para formatear precios
export const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export default cartAPI;

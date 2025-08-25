import { API_BASE_URL } from '../config/api-config';

// Función para obtener headers con autenticación
const getHeaders = () => {
  const token = localStorage.getItem('token'); // Cambiar de 'authToken' a 'token'
  const sessionId = localStorage.getItem('session_id'); // Cambiar de 'sessionId' a 'session_id'
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(sessionId && { 'x-session-id': sessionId })
  };
};

// Función para manejar respuestas de la API
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Error en la solicitud');
  }
  
  return data;
};

export const checkoutAPI = {
  // Validar datos de checkout
  validateCheckout: async (checkoutData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/validate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(checkoutData)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error validando checkout:', error);
      throw error;
    }
  },

  // Crear orden
  createOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/create-order`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creando orden:', error);
      throw error;
    }
  },

  // Obtener orden por número
  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/order/${orderNumber}`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo orden:', error);
      throw error;
    }
  },

  // Obtener órdenes del usuario
  getUserOrders: async (page = 1, limit = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/orders?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo órdenes:', error);
      throw error;
    }
  },

  // Actualizar estado de pago
  updatePaymentStatus: async (orderId, paymentStatus, paymentId = null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/order/${orderId}/payment`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ payment_status: paymentStatus, payment_id: paymentId })
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error actualizando pago:', error);
      throw error;
    }
  },

  // Obtener opciones de envío
  getShippingOptions: async (postalCode, totalWeight = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/shipping-options?postal_code=${postalCode}&total_weight=${totalWeight}`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo opciones de envío:', error);
      throw error;
    }
  },

  // Obtener métodos de pago
  getPaymentMethods: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/payment-methods`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo métodos de pago:', error);
      throw error;
    }
  }
};

export default checkoutAPI;
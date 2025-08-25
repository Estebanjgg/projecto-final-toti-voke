// ordersAPI.js - Servicio para manejar las órdenes del usuario
import { API_BASE_URL } from '../config/api-config';

// Use the configured API base URL

// Función helper para manejar respuestas de la API
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Función helper para obtener headers con autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const ordersAPI = {
  // Obtener todas las órdenes del usuario autenticado
  getUserOrders: async (page = 1, limit = 10, status = null) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status })
      });
      
      const response = await fetch(`${API_BASE_URL}/orders?${params}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener órdenes del usuario:', error);
      throw error;
    }
  },

  // Obtener una orden específica por ID
  getOrderById: async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener orden por ID:', error);
      throw error;
    }
  },

  // Obtener una orden por número de orden
  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/number/${orderNumber}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener orden por número:', error);
      throw error;
    }
  },

  // Obtener estadísticas de órdenes del usuario
  getOrderStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/stats`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener estadísticas de órdenes:', error);
      throw error;
    }
  },

  // Cancelar una orden (solo si está en estado pending o confirmed)
  cancelOrder: async (orderId, reason = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason })
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al cancelar orden:', error);
      throw error;
    }
  },

  // Solicitar reembolso para una orden
  requestRefund: async (orderId, reason, items = []) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/refund`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason, items })
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al solicitar reembolso:', error);
      throw error;
    }
  },

  // Rastrear una orden
  trackOrder: async (orderNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/track/${orderNumber}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al rastrear orden:', error);
      throw error;
    }
  },

  // Obtener items de una orden específica
  getOrderItems: async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/items`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener items de la orden:', error);
      throw error;
    }
  },

  // Descargar factura de una orden
  downloadInvoice: async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/invoice`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al descargar factura');
      }
      
      // Retornar el blob para descarga
      return await response.blob();
    } catch (error) {
      console.error('Error al descargar factura:', error);
      throw error;
    }
  },

  // Reordenar items de una orden anterior
  reorderItems: async (orderId, items = []) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/reorder`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ items })
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al reordenar items:', error);
      throw error;
    }
  },

  // Actualizar dirección de envío (solo para órdenes no enviadas)
  updateShippingAddress: async (orderId, shippingAddress) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/shipping-address`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ shippingAddress })
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al actualizar dirección de envío:', error);
      throw error;
    }
  },

  // Confirmar recepción de la orden
  confirmDelivery: async (orderId, rating = null, review = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/confirm-delivery`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rating, review })
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al confirmar entrega:', error);
      throw error;
    }
  },

  // Buscar órdenes por criterios
  searchOrders: async (searchTerm, filters = {}) => {
    try {
      const params = new URLSearchParams({
        q: searchTerm,
        ...filters
      });
      
      const response = await fetch(`${API_BASE_URL}/orders/search?${params}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al buscar órdenes:', error);
      throw error;
    }
  }
};

export default ordersAPI;
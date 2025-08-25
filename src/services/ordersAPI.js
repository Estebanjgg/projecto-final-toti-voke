// ordersAPI.js - Servicio para manejar las órdenes del usuario
import { apiClient } from './api';

export const ordersAPI = {
  // Obtener pedidos del usuario
  getUserOrders: async (params = {}) => {
    try {
      const { page = 1, limit = 10, status } = params;
      const queryParams = new URLSearchParams({ page, limit });
      
      if (status) {
        queryParams.append('status', status);
      }
      
      const response = await apiClient.get(`/orders?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo pedidos:', error);
      throw error;
    }
  },

  // Obtener pedido específico por número
  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await apiClient.get(`/orders/${orderNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo pedido:', error);
      throw error;
    }
  },

  // Cancelar pedido
  cancelOrder: async (orderId, reason = '') => {
    try {
      const response = await apiClient.post(`/orders/${orderId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error cancelando pedido:', error);
      throw error;
    }
  },

  // Obtener información de seguimiento
  getOrderTracking: async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}/tracking`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo seguimiento:', error);
      throw error;
    }
  },

  // Obtener resumen/estadísticas de pedidos del usuario
  getOrdersSummary: async () => {
    try {
      const response = await apiClient.get('/orders/summary/stats');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo resumen de pedidos:', error);
      throw error;
    }
  },

  // Obtener orden por ID
  getOrderById: async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo orden por ID:', error);
      throw error;
    }
  },

  // Rastrear orden por número
  trackOrder: async (orderNumber) => {
    try {
      const response = await apiClient.get(`/orders/${orderNumber}/tracking`);
      return response.data;
    } catch (error) {
      console.error('Error rastreando orden:', error);
      throw error;
    }
  }
};

export default ordersAPI;
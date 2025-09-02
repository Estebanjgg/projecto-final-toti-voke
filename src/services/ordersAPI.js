// ordersAPI.js - Servicio para manejar las órdenes del usuario
import { apiClient } from './api';

export const ordersAPI = {
  // Obtener pedidos del usuario
  getUserOrders: async (page = 1, limit = 10, status = null) => {
    try {
      const queryParams = new URLSearchParams({ page, limit });
      
      if (status) {
        queryParams.append('status', status);
      }
      
      const response = await apiClient.get(`/checkout/orders?${queryParams}`);
      return {
        orders: response.data.data || [],
        page: response.data.pagination?.page || page,
        limit: response.data.pagination?.limit || limit,
        total: response.data.pagination?.total || 0,
        totalPages: response.data.pagination?.pages || 0
      };
    } catch (error) {
      console.error('Error obteniendo pedidos:', error);
        throw error;
    }
  },

  // Obtener un pedido específico por ID
  getOrderById: async (orderId) => {
    try {
      const response = await apiClient.get(`/checkout/orders/${orderId}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo pedido por ID:', error);
        throw error;
    }
  },

  // Obtener estadísticas de órdenes del usuario
  getOrderStats: async () => {
    try {
      // Por ahora retornamos estadísticas simuladas ya que no existe esta endpoint
      return {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalSpent: 0
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalSpent: 0
      };
    }
  },

  // Buscar órdenes
  searchOrders: async (searchTerm, filters = {}) => {
    try {
      const queryParams = new URLSearchParams({ 
        search: searchTerm,
        page: 1,
        limit: 10
      });
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      
      const response = await apiClient.get(`/checkout/orders?${queryParams}`);
      return {
        orders: response.data.data || [],
        total: response.data.pagination?.total || 0
      };
    } catch (error) {
      console.error('Error buscando pedidos:', error);
        throw error;
    }
  },

  // Obtener pedido específico por número
  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await apiClient.get(`/checkout/order/${orderNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo pedido:', error);
        throw error;
    }
  },

  // Cancelar pedido (por ahora simulado)
  cancelOrder: async (orderId, reason = '') => {
    try {
      // Esta funcionalidad necesitaría ser implementada en el backend
      throw new Error('Funcionalidad de cancelación no implementada aún');
    } catch (error) {
      console.error('Error cancelando pedido:', error);
        throw error;
    }
  },

  // Reordenar items (agregar al carrito)
  reorderItems: async (orderId, items) => {
    try {
      // Esta funcionalidad necesitaría ser implementada
      throw new Error('Funcionalidad de reorden no implementada aún');
    } catch (error) {
      console.error('Error reordenando:', error);
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
      const response = await apiClient.get(`/checkout/order-by-id/${orderId}`);
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
  },

  // Descargar factura (simulado por ahora)
  downloadInvoice: async (orderId) => {
    try {
      // Por ahora simulamos la generación de factura
      const pdfContent = `Factura - Orden #${orderId}\nTotal: R$ 100.00\nFecha: ${new Date().toLocaleDateString()}`;
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      return blob;
    } catch (error) {
      console.error('Error descargando factura:', error);
        throw error;
    }
  }
};

export default ordersAPI;
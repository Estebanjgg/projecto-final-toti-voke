import { apiClient } from './api';

export const paymentsAPI = {
  // Procesar pago
  processPayment: async (paymentData) => {
    try {
      const response = await apiClient.post('/payments/process', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error procesando pago:', error);
      throw error;
    }
  },

  // Verificar estado del pago
  getPaymentStatus: async (transactionId) => {
    try {
      const response = await apiClient.get(`/payments/status/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('Error verificando estado del pago:', error);
      throw error;
    }
  },

  // Confirmar pago PIX (simulación)
  confirmPixPayment: async (transactionId) => {
    try {
      const response = await apiClient.post(`/payments/pix/${transactionId}/confirm`);
      return response.data;
    } catch (error) {
      console.error('Error confirmando pago PIX:', error);
      throw error;
    }
  },

  // Confirmar pago Boleto (simulación)
  confirmBoletoPayment: async (transactionId) => {
    try {
      const response = await apiClient.post(`/payments/boleto/${transactionId}/confirm`);
      return response.data;
    } catch (error) {
      console.error('Error confirmando pago boleto:', error);
      throw error;
    }
  },

  // Descargar boleto
  downloadBoleto: async (boletoNumber) => {
    try {
      const response = await apiClient.get(`/payments/boleto/${boletoNumber}/download`);
      return response.data;
    } catch (error) {
      console.error('Error descargando boleto:', error);
      throw error;
    }
  }
};

export default paymentsAPI;

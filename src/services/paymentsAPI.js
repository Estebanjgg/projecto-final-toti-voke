import { apiClient } from './api';

export const paymentsAPI = {
  // Procesar pago
  processPayment: async (paymentData) => {
    try {
      const response = await apiClient.post('/payments/process', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error procesando pago:', error);
      
      // Criar erro personalizado com base no tipo de problema
      const enhancedError = new Error(error.message || 'Erro no processamento do pagamento');
      enhancedError.status = error.status;
      enhancedError.originalError = error;
      
      // Tratar erros específicos de pagamento
      if (error.message) {
        if (error.message.includes('cartão') || error.message.includes('card')) {
          enhancedError.isCardError = true;
        }
        if (error.message.includes('Stock insuficiente') || error.message.includes('estoque')) {
          enhancedError.isStockError = true;
        }
        if (error.message.includes('expired') || error.message.includes('vencido')) {
          enhancedError.isExpiredError = true;
        }
      }
      
      throw enhancedError;
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

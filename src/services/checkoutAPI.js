import { API_BASE_URL } from '../config/api-config';

// Função para obter headers com autenticação
const getHeaders = () => {
  const token = localStorage.getItem('token'); // Mudança de 'authToken' para 'token'
  const sessionId = localStorage.getItem('session_id'); // Mudança de 'sessionId' para 'session_id'
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(sessionId && { 'x-session-id': sessionId })
  };
};

// Função para tratar respostas da API
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro na solicitação');
  }
  
  return data;
};

export const checkoutAPI = {
  // Validar dados de checkout
  validateCheckout: async (checkoutData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/validate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(checkoutData)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erro validando checkout:', error);
      throw error;
    }
  },

  // Criar pedido
  createOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/create-order`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erro criando pedido:', error);
      throw error;
    }
  },

  // Obter pedido por número
  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/order/${orderNumber}`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erro obtendo pedido:', error);
      throw error;
    }
  },

  // Obter pedidos do usuário
  getUserOrders: async (page = 1, limit = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/orders?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erro obtendo pedidos:', error);
      throw error;
    }
  },

  // Atualizar status de pagamento
  updatePaymentStatus: async (orderId, paymentStatus, paymentId = null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/order/${orderId}/payment`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ payment_status: paymentStatus, payment_id: paymentId })
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erro atualizando pagamento:', error);
      throw error;
    }
  },

  // Obter opções de envio
  getShippingOptions: async (postalCode, totalWeight = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/shipping-options?postal_code=${postalCode}&total_weight=${totalWeight}`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erro obtendo opções de envio:', error);
      throw error;
    }
  },

  // Obter métodos de pagamento
  getPaymentMethods: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/payment-methods`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erro obtendo métodos de pagamento:', error);
      throw error;
    }
  }
};

export default checkoutAPI;
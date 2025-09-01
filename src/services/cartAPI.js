import { API_BASE_URL } from './api';

// Função auxiliar para tratar respostas da API
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Função auxiliar para fazer requisições
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Obter token de autenticação se existir (usando a mesma chave que AuthContext)
  const token = localStorage.getItem('token');
  
  // Obter ou gerar session_id para usuários não autenticados
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
    
    // Se o servidor retornar um novo session_id, salvá-lo
    const newSessionId = response.headers.get('x-session-id');
    if (newSessionId && !token) {
      localStorage.setItem('sessionId', newSessionId);
    }
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`Erro na requisição para ${url}:`, error);
    throw error;
  }
};

// API do carrinho de compras
export const cartAPI = {
  // Obter carrinho atual
  getCart: async () => {
    return apiRequest('/cart');
  },

  // Obter resumo do carrinho
  getSummary: async () => {
    return apiRequest('/cart/summary');
  },

  // Adicionar produto ao carrinho
  addToCart: async (productId, quantity = 1) => {
    return apiRequest('/cart/add', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity
      }),
    });
  },

  // Atualizar quantidade de um produto
  updateQuantity: async (cartItemId, quantity) => {
    return apiRequest(`/cart/update/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({
        quantity: quantity
      }),
    });
  },

  // Remover produto do carrinho
  removeFromCart: async (cartItemId) => {
    return apiRequest(`/cart/remove/${cartItemId}`, {
      method: 'DELETE',
    });
  },

  // Limpar todo o carrinho
  clearCart: async () => {
    return apiRequest('/cart/clear', {
      method: 'DELETE',
    });
  },

  // Migrar carrinho de sessão para usuário (quando se autentica)
  migrateCart: async (sessionId) => {
    return apiRequest('/cart/migrate', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId
      }),
    });
  },
};

// Hook para calcular totais do carrinho
export const calculateCartTotals = (cartItems = []) => {
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.products?.current_price || item.price || 0);
    const quantity = parseInt(item.quantity || 0);
    // Verificar se price e quantity são válidos
    if (isNaN(price) || isNaN(quantity)) {
      return sum;
    }
    return sum + (price * quantity);
  }, 0);

  const itemCount = cartItems.reduce((sum, item) => {
    const quantity = parseInt(item.quantity || 0);
    return sum + (isNaN(quantity) ? 0 : quantity);
  }, 0);

  // Calculamos descontos se houver produtos com preço original
  const totalDiscount = cartItems.reduce((sum, item) => {
    const currentPrice = parseFloat(item.products?.current_price || item.price || 0);
    const originalPrice = parseFloat(item.products?.original_price || currentPrice);
    const quantity = parseInt(item.quantity || 0);
    // Verificar se os valores são válidos
    if (isNaN(currentPrice) || isNaN(originalPrice) || isNaN(quantity)) {
      return sum;
    }
    return sum + ((originalPrice - currentPrice) * quantity);
  }, 0);

  const total = isNaN(subtotal) ? 0 : subtotal;

  return {
    subtotal: isNaN(subtotal) ? 0 : subtotal,
    totalDiscount: isNaN(totalDiscount) ? 0 : totalDiscount,
    total: total,
    itemCount: isNaN(itemCount) ? 0 : itemCount,
    isEmpty: itemCount === 0
  };
};

// Função para formatar preços
export const formatPrice = (price) => {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice) || numPrice === null || numPrice === undefined) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numPrice);
};

export default cartAPI;

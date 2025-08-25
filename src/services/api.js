// Configuración de la API
// Siempre usa la API de Heroku para evitar compartir credenciales locales
export const API_BASE_URL = 'https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/api';

// Para desarrollo local con backend propio, descomenta la línea siguiente:
// export const API_BASE_URL = 'http://localhost:3001/api';

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
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error en petición a ${url}:`, error);
    throw error;
  }
};

// API de productos
export const productsAPI = {
  // Obtener todos los productos
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  // Obtener un producto por ID
  getById: async (id) => {
    return apiRequest(`/products/${id}`);
  },

  // Crear un nuevo producto
  create: async (productData) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Actualizar un producto
  update: async (id, productData) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Eliminar un producto
  delete: async (id) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Obtener productos destacados
  getFeatured: async (limit = 10) => {
    return apiRequest(`/products?featured=true&limit=${limit}`);
  },

  // Obtener ofertas
  getOffers: async (limit = 10) => {
    return apiRequest(`/products?offer=true&limit=${limit}`);
  },

  // Obtener productos más vendidos
  getBestSellers: async () => {
    return apiRequest('/products?bestseller=true');
  },

  // Buscar productos
  search: async (searchTerm, filters = {}) => {
    return apiRequest('/products', {
      ...filters,
      search: searchTerm,
    });
  },

  // Obtener marcas disponibles
  getBrands: async () => {
    return apiRequest('/products/meta/brands');
  },

  // Obtener condiciones disponibles
  getConditions: async () => {
    return apiRequest('/products/meta/conditions');
  },
};

// API de categorías
export const categoriesAPI = {
  // Obtener todas las categorías
  getAll: async () => {
    return apiRequest('/categories');
  },

  // Obtener categorías destacadas
  getFeatured: async () => {
    return apiRequest('/categories/featured');
  },

  // Obtener productos de una categoría
  getProducts: async (category, filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/categories/${category}/products${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },
};

// API de salud del servidor
export const healthAPI = {
  check: async () => {
    return apiRequest('/health');
  },
};

// Función para formatear precios brasileños
export const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

// Función para formatear precios sin símbolo de moneda
export const formatPriceNumber = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Función helper para obtener productos por categoría (para TechOffers)
export const getProductsByCategory = async (category) => {
  return categoriesAPI.getProducts(category);
};

// Hook personalizado para manejar estados de carga
export const useApiState = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  const execute = async (apiCall) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  return { loading, error, execute };
};

export default {
  products: productsAPI,
  categories: categoriesAPI,
  health: healthAPI,
};
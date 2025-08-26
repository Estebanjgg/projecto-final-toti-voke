import api from './api';

// ===== GESTIÓN DE ÓRDENES =====

// Obtener todas las órdenes con filtros
export const getOrders = async (params = {}) => {
  try {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    throw error;
  }
};

// Obtener orden específica
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/admin/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo orden:', error);
    throw error;
  }
};

// Actualizar estado de orden
export const updateOrderStatus = async (orderId, status, notes = '') => {
  try {
    const response = await api.put(`/admin/orders/${orderId}/status`, {
      status,
      notes
    });
    return response.data;
  } catch (error) {
    console.error('Error actualizando estado de orden:', error);
    throw error;
  }
};

// Actualizar estado de pago
export const updatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    const response = await api.put(`/admin/orders/${orderId}/payment-status`, {
      payment_status: paymentStatus
    });
    return response.data;
  } catch (error) {
    console.error('Error actualizando estado de pago:', error);
    throw error;
  }
};

// Obtener estadísticas de órdenes
export const getOrderStats = async (period = '30d') => {
  try {
    const response = await api.get('/admin/orders/stats', {
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo estadísticas de órdenes:', error);
    throw error;
  }
};

// ===== GESTIÓN DE PRODUCTOS =====

// Obtener todos los productos (admin)
export const getAdminProducts = async (params = {}) => {
  try {
    const response = await api.get('/admin/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    throw error;
  }
};

// Crear nuevo producto
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/admin/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creando producto:', error);
    throw error;
  }
};

// Actualizar producto
export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/admin/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando producto:', error);
    throw error;
  }
};

// Eliminar producto
export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando producto:', error);
    throw error;
  }
};

// ===== GESTIÓN DE USUARIOS =====

// Obtener todos los usuarios
export const getUsers = async (params = {}) => {
  try {
    const response = await api.get('/admin/users', { params });
    return response.data; // response.data já contém {success: true, data: [...], pagination: {...}}
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw error;
  }
};

// Actualizar rol de usuario
export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error('Error actualizando rol de usuario:', error);
    throw error;
  }
};

// ===== DASHBOARD Y ANALYTICS =====

// Obtener datos del dashboard
export const getDashboardData = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo datos del dashboard:', error);
    throw error;
  }
};

// Verificar si el usuario es administrador
export const checkAdminStatus = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.status === 200;
  } catch (error) {
    console.error('Error verificando status admin:', error);
    if (error.message && error.message.includes('403')) {
      return false; // No es admin
    }
    return false; // Error general
  }
};

const adminAPI = {
  // Órdenes
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderStats,
  
  // Productos
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Usuarios
  getUsers,
  updateUserRole,
  
  // Dashboard
  getDashboardData,
  checkAdminStatus
};

export default adminAPI;
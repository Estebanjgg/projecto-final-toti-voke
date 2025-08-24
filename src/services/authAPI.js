import { API_BASE_URL } from './api';

class AuthAPI {
  constructor() {
    this.baseURL = `${API_BASE_URL}/auth`;
  }

  // Método auxiliar para hacer requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const config = {
      ...defaultOptions,
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      return data.data || data;
    } catch (error) {
      console.error(`Error en ${endpoint}:`, error);
      throw error;
    }
  }

  // Obtener token del localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Obtener headers de autenticación
  getAuthHeaders() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Registro de usuario
  async register(userData) {
    try {
      const response = await this.makeRequest('/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      return response;
    } catch (error) {
      // Manejar errores específicos
      if (error.message.includes('ya está registrado')) {
        throw new Error('Este email ya está registrado. Intenta iniciar sesión.');
      }
      throw error;
    }
  }

  // Login de usuario
  async login(credentials) {
    try {
      const response = await this.makeRequest('/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      return response;
    } catch (error) {
      // Manejar errores específicos
      if (error.message.includes('Credenciales inválidas')) {
        throw new Error('Email o contraseña incorrectos.');
      }
      if (error.message.includes('Demasiados intentos')) {
        throw new Error('Demasiados intentos de login. Intenta de nuevo en 15 minutos.');
      }
      throw error;
    }
  }

  // Logout de usuario
  async logout() {
    try {
      await this.makeRequest('/logout', {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      // No fallar el logout por errores de red
      console.warn('Error en logout:', error);
    }
  }

  // Obtener perfil del usuario actual
  async getProfile() {
    try {
      const response = await this.makeRequest('/me', {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return response.user;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar perfil del usuario
  async updateProfile(profileData) {
    try {
      console.log('🌐 authAPI.updateProfile - Datos originales recibidos:', profileData);
      
      // Enviar solo los campos que realmente se quieren actualizar
      const cleanData = {};
      
      // Solo incluir campos que tienen valores válidos
      if (profileData.first_name && profileData.first_name.trim().length > 0) {
        cleanData.first_name = profileData.first_name.trim();
      }
      
      if (profileData.last_name && profileData.last_name.trim().length > 0) {
        cleanData.last_name = profileData.last_name.trim();
      }
      
      // Para phone, siempre incluir (puede ser string vacío para eliminarlo)
      if (profileData.hasOwnProperty('phone')) {
        cleanData.phone = profileData.phone ? profileData.phone.trim() : '';
      }
      
      console.log('🌐 authAPI.updateProfile - Datos limpiados a enviar:', cleanData);
      console.log('🌐 authAPI.updateProfile - JSON que se enviará:', JSON.stringify(cleanData));
      
      const response = await this.makeRequest('/profile', {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(cleanData)
      });

      return response;
    } catch (error) {
      console.error('Error en authAPI.updateProfile:', error);
      throw error;
    }
  }

  // Cambiar contraseña
  async changePassword(passwordData) {
    try {
      const response = await this.makeRequest('/change-password', {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(passwordData)
      });

      return response;
    } catch (error) {
      if (error.message.includes('Contraseña actual incorrecta')) {
        throw new Error('La contraseña actual es incorrecta.');
      }
      throw error;
    }
  }

  // Desactivar cuenta
  async deactivateAccount(password) {
    try {
      const response = await this.makeRequest('/account', {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ password })
      });

      return response;
    } catch (error) {
      if (error.message.includes('Contraseña incorrecta')) {
        throw new Error('Contraseña incorrecta.');
      }
      throw error;
    }
  }

  // Solicitar recuperación de contraseña
  async forgotPassword(email) {
    try {
      const response = await this.makeRequest('/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      return response;
    } catch (error) {
      if (error.message.includes('Usuario no encontrado')) {
        throw new Error('No existe una cuenta con este email.');
      }
      throw error;
    }
  }

  // Verificar token de recuperación
  async verifyResetToken(token) {
    try {
      const response = await this.makeRequest(`/verify-reset-token/${token}`, {
        method: 'GET'
      });

      return response;
    } catch (error) {
      if (error.message.includes('Token inválido') || error.message.includes('expirado')) {
        throw new Error('El enlace de recuperación es inválido o ha expirado.');
      }
      throw error;
    }
  }

  // Restablecer contraseña con token
  async resetPassword(data) {
    try {
      const response = await this.makeRequest('/reset-password', {
        method: 'POST',
        body: JSON.stringify(data)
      });

      return response;
    } catch (error) {
      if (error.message.includes('Token inválido') || error.message.includes('expirado')) {
        throw new Error('El enlace de recuperación es inválido o ha expirado.');
      }
      throw error;
    }
  }

  // Verificar si un token es válido
  async verifyToken(token = null) {
    try {
      const tokenToVerify = token || this.getToken();
      
      if (!tokenToVerify) {
        return false;
      }

      const response = await this.makeRequest('/verify-token', {
        method: 'POST',
        body: JSON.stringify({ token: tokenToVerify })
      });

      return response.user || true;
    } catch (error) {
      console.warn('Token inválido:', error);
      return false;
    }
  }

  // Migrar carrito de sesión a usuario (usado internamente)
  async migrateCart(sessionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/migrate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({ session_id: sessionId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error migrando carrito');
      }

      return data;
    } catch (error) {
      console.warn('Error migrando carrito:', error);
      // No fallar por esto
      return null;
    }
  }

  // Validar formato de email
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validar fortaleza de contraseña
  static validatePassword(password) {
    const errors = [];
    
    if (password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }
    
    if (!/[A-Za-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Obtener información de usuario desde token (sin hacer request)
  static getUserFromToken(token) {
    try {
      if (!token) return null;
      
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      
      // Verificar si el token no ha expirado
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        return null;
      }
      
      return {
        id: decoded.id,
        email: decoded.email,
        first_name: decoded.first_name,
        last_name: decoded.last_name
      };
    } catch (error) {
      console.warn('Error decodificando token:', error);
      return null;
    }
  }
}

// Crear instancia singleton
export const authAPI = new AuthAPI();
export default authAPI;
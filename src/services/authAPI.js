import { API_BASE_URL } from '../config/api-config.js';

class AuthAPI {
  constructor() {
    this.baseURL = `${API_BASE_URL}/auth`;
  }

  // Método auxiliar para fazer requisições
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json'
    };

    const config = {
      headers: {
        ...defaultHeaders,
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro ${response.status}`);
      }

      return data.data || data;
    } catch (error) {
      console.error(`Erro em ${endpoint}:`, error);
      throw error;
    }
  }

  // Obter token do localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Obter headers de autenticação
  getAuthHeaders() {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Registro de usuário
  async register(userData) {
    try {
      const response = await this.makeRequest('/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      return response;
    } catch (error) {
      // Tratar erros específicos
      if (error.message.includes('ya está registrado')) {
        throw new Error('Este email já está registrado. Tente fazer login.');
      }
      throw error;
    }
  }

  // Login de usuário
  async login(credentials) {
    try {
      const response = await this.makeRequest('/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      return response;
    } catch (error) {
      // Tratar erros específicos
      if (error.message.includes('Credenciales inválidas')) {
        throw new Error('Email ou senha incorretos.');
      }
      if (error.message.includes('Demasiados intentos')) {
        throw new Error('Muitas tentativas de login. Tente novamente em 15 minutos.');
      }
      throw error;
    }
  }

  // Logout de usuário
  async logout() {
    try {
      await this.makeRequest('/logout', {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      // Não falhar o logout por erros de rede
      console.warn('Erro no logout:', error);
    }
  }

  // Obter perfil do usuário atual
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

  // Atualizar perfil do usuário
  async updateProfile(profileData) {
    try {
      // Enviar apenas os campos que realmente se quer atualizar
      const cleanData = {};
      
      // Incluir apenas campos que têm valores válidos
      if (profileData.first_name && profileData.first_name.trim().length > 0) {
        cleanData.first_name = profileData.first_name.trim();
      }
      
      if (profileData.last_name && profileData.last_name.trim().length > 0) {
        cleanData.last_name = profileData.last_name.trim();
      }
      
      // Para phone, sempre incluir (pode ser string vazia para removê-lo)
      if (profileData.hasOwnProperty('phone')) {
        cleanData.phone = profileData.phone ? profileData.phone.trim() : '';
      }
      
      const response = await this.makeRequest('/profile', {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(cleanData)
      });

      return response;
    } catch (error) {
      console.error('Erro em authAPI.updateProfile:', error);
      throw error;
    }
  }

  // Alterar senha
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
        throw new Error('A senha atual está incorreta.');
      }
      throw error;
    }
  }

  // Desativar conta
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
        throw new Error('Senha incorreta.');
      }
      throw error;
    }
  }

  // Solicitar recuperação de senha
  async forgotPassword(email) {
    try {
      const response = await this.makeRequest('/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      return response;
    } catch (error) {
      if (error.message.includes('Usuario no encontrado')) {
        throw new Error('Não existe uma conta com este email.');
      }
      throw error;
    }
  }

  // Verificar token de recuperação
  async verifyResetToken(token) {
    try {
      const response = await this.makeRequest(`/verify-reset-token/${token}`, {
        method: 'GET'
      });

      return response;
    } catch (error) {
      if (error.message.includes('Token inválido') || error.message.includes('expirado')) {
        throw new Error('O link de recuperação é inválido ou expirou.');
      }
      throw error;
    }
  }

  // Redefinir senha com token
  async resetPassword(data) {
    try {
      const response = await this.makeRequest('/reset-password', {
        method: 'POST',
        body: JSON.stringify(data)
      });

      return response;
    } catch (error) {
      if (error.message.includes('Token inválido') || error.message.includes('expirado')) {
        throw new Error('O link de recuperação é inválido ou expirou.');
      }
      throw error;
    }
  }

  // Verificar se um token é válido
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

  // Migrar carrinho de sessão para usuário (usado internamente)
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
        throw new Error(data.message || 'Erro migrando carrinho');
      }

      return data;
    } catch (error) {
      console.warn('Erro migrando carrinho:', error);
      // Não falhar por isso
      return null;
    }
  }

  // Validar formato de email
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validar força da senha
  static validatePassword(password) {
    const errors = [];
    
    if (password.length < 6) {
      errors.push('A senha deve ter pelo menos 6 caracteres');
    }
    
    if (!/[A-Za-z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('A senha deve conter pelo menos um número');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Obter informações de usuário do token (sem fazer requisição)
  static getUserFromToken(token) {
    try {
      if (!token) return null;
      
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      
      // Verificar se o token não expirou
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
      console.warn('Erro decodificando token:', error);
      return null;
    }
  }
}

// Criar instância singleton
export const authAPI = new AuthAPI();
export default authAPI;
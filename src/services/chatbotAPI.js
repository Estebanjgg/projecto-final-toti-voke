const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/api';

class ChatBotService {
  constructor() {
    this.conversationId = null;
  }

  // Crear nueva conversación
  async createConversation() {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error creating conversation');
      }

      const data = await response.json();
      this.conversationId = data.conversationId;
      return data.conversationId;
    } catch (error) {
      console.error('Error creating conversation:', error);
      // Generar ID local como fallback
      this.conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return this.conversationId;
    }
  }

  // Procesar mensaje del usuario
  async processMessage(message, user = null) {
    try {
      // Crear conversación si no existe
      if (!this.conversationId) {
        await this.createConversation();
      }

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/chatbot/message`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message,
          conversationId: this.conversationId
        }),
      });

      if (!response.ok) {
        throw new Error('Error processing message');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        success: false,
        response: 'Desculpe, ocorreu um erro. Tente novamente em alguns instantes.',
        error: error.message
      };
    }
  }

  // Obtener historial de conversaciones (requiere autenticación)
  async getConversationHistory(limit = 50, offset = 0) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/chatbot/conversations?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching conversation history');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      return {
        success: false,
        conversations: [],
        error: error.message
      };
    }
  }

  // Limpiar conversación actual
  clearConversation() {
    this.conversationId = null;
  }
}

// Instancia singleton del servicio
const chatBotService = new ChatBotService();

export default chatBotService;
export { ChatBotService };
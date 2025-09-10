import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import chatBotService from '../services/chatbotAPI';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Olá! Sou o VokeBot, seu assistente virtual. Como posso ajudá-lo hoje?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const [isWaitingForName, setIsWaitingForName] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !userName) {
      // Pedir nombre al abrir el chat por primera vez
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: 'Para oferecer um atendimento personalizado, qual é o seu nome?',
          sender: 'bot',
          timestamp: new Date()
        }]);
        setIsWaitingForName(true);
      }, 500);
    }
  };

  const resetConversation = () => {
    // Resetear todos los estados a su valor inicial
    setMessages([
      {
        id: 1,
        text: 'Olá! Sou o VokeBot, seu assistente virtual. Como posso ajudá-lo hoje?',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setInputMessage('');
    setIsTyping(false);
    setUserName('');
    setIsWaitingForName(false);
    setShowQuickMenu(false);
    
    // Resetear el servicio del chatbot
    chatBotService.conversationId = null;
  };

  const handleQuickAction = (action) => {
    setShowQuickMenu(false);
    handleSendMessage(action);
  };

  const handleSendMessage = async (quickMessage = null) => {
    // Asegurar que quickMessage sea una string válida
    const messageText = (typeof quickMessage === 'string' ? quickMessage : inputMessage.trim());
    if (!messageText || typeof messageText !== 'string') return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    // Solo limpiar input si no es un mensaje rápido
    if (!quickMessage) {
      setInputMessage('');
    }

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Si estamos esperando el nombre
    if (isWaitingForName) {
      setUserName(inputMessage.trim());
      setIsWaitingForName(false);
      
      setTimeout(() => {
        const welcomeMessage = {
          id: Date.now() + 1,
          text: `Prazer em conhecê-lo, ${inputMessage.trim()}! Estou aqui para ajudá-lo com:\n\n• Informações sobre produtos\n• Status de pedidos\n• Suporte com compras\n• Dúvidas gerais\n\nComo posso ajudá-lo hoje?`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, welcomeMessage]);
        setIsTyping(false);
        setShowQuickMenu(true); // Mostrar menú rápido después del saludo
      }, 1000);
      return;
    }

    // Procesar mensaje con el servicio de AI
    try {
      const response = await chatBotService.processMessage(
        messageText,
        user
      );
      
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: response.text || response.response,
          sender: 'bot',
          timestamp: new Date(),
          intent: response.intent,
          quickReplies: response.quickReplies
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        setShowQuickMenu(false); // Ocultar menú rápido cuando hay quickReplies
      }, 1000);
    } catch (error) {
      console.error('Error processing message:', error);
      setTimeout(() => {
        const errorMessage = {
          id: Date.now() + 1,
          text: 'Desculpe, ocorreu um erro. Tente novamente em alguns instantes.',
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  // Función para manejar clicks en quickReplies
  const handleQuickReply = (reply) => {
    sendMessage(reply, true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Botón flotante */}
      <button 
        className="chatbot-button" 
        onClick={toggleChat}
        title="Olá, tem alguma pergunta? Vamos conversar."
        aria-label="Olá, tem alguma pergunta? Vamos conversar."
      >
        <div className="chatbot-icon-container">
          <svg 
            focusable="false" 
            aria-hidden="true" 
            viewBox="0 0 100 100" 
            className="chatbot-icon"
          >
            <path d="M50 0c27.614 0 50 20.52 50 45.833S77.614 91.667 50 91.667c-8.458 0-16.425-1.925-23.409-5.323-13.33 6.973-21.083 9.839-23.258 8.595-2.064-1.18.114-8.436 6.534-21.767C3.667 65.54 0 56.08 0 45.833 0 20.52 22.386 0 50 0zm4.583 61.667H22.917a2.917 2.917 0 000 5.833h31.666a2.917 2.917 0 000-5.833zm12.5-15.834H22.917a2.917 2.917 0 000 5.834h44.166a2.917 2.917 0 000-5.834zM79.583 30H22.917a2.917 2.917 0 000 5.833h56.666a2.917 2.917 0 000-5.833z"></path>
          </svg>
        </div>
      </button>

      {/* Ventana de chat */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">VB</div>
              <div className="chatbot-header-text">
                <h4>VokeBot Enhanced Version</h4>
                <span className="chatbot-status">Online • {formatTime(new Date())}</span>
              </div>
            </div>
            <div className="chatbot-header-buttons">
              <button 
                className="chatbot-reset" 
                onClick={resetConversation}
                aria-label="Resetar conversa"
                title="Resetar conversa"
              >
                🔄
              </button>
              <button 
                className="chatbot-close" 
                onClick={toggleChat}
                aria-label="Fechar chat"
              >
                ×
              </button>
            </div>
          </div>

          <div className="chatbot-schedule">
            <p>
              <strong>Horário de Atendimento:</strong><br/>
              Segunda a quinta das 08:30h às 17:30h e Sexta-feira das 08:30h às 16:30h (exceto feriados). Seja bem-vindo(a) à Voke!
            </p>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={message.id}>
                <div className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                  <div className="message-content">
                    <p>{typeof message.text === 'string' ? message.text : 'Erro ao exibir mensagem'}</p>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                </div>
                
                {/* Renderizar quickReplies se existirem e for a última mensagem do bot */}
                {message.sender === 'bot' && message.quickReplies && index === messages.length - 1 && (
                  <div className="quick-replies">
                    <div className="quick-replies-container">
                      {message.quickReplies.map((reply, replyIndex) => (
                        <button
                          key={replyIndex}
                          className="quick-reply-button"
                          onClick={() => handleQuickReply(reply)}
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot-message">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Menú de opciones rápidas */}
          {showQuickMenu && (
            <div className="quick-menu">
              <div className="quick-menu-title">
                <span>Escolha uma opção:</span>
              </div>
              <div className="quick-menu-buttons">
                <button 
                  className="quick-button"
                  onClick={() => handleQuickAction('Status de pedidos')}
                >
                  📦 Status de pedidos
                </button>
                <button 
                  className="quick-button"
                  onClick={() => handleQuickAction('Informações sobre produtos')}
                >
                  🛍️ Informações sobre produtos
                </button>
                <button 
                  className="quick-button"
                  onClick={() => handleQuickAction('Suporte com compras')}
                >
                  🛒 Suporte com compras
                </button>
                <button 
                  className="quick-button"
                  onClick={() => handleQuickAction('Dúvidas gerais')}
                >
                  ❓ Dúvidas gerais
                </button>
              </div>
            </div>
          )}

          <div className="chatbot-input">
            <div className="input-container">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                rows="1"
                className="message-input"
              />
              <button 
                onClick={handleSendMessage}
                className="send-button"
                disabled={!inputMessage.trim()}
                aria-label="Enviar mensagem"
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
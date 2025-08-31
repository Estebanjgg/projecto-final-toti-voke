import React from 'react';
import { Link } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = ({ order, paymentResult, onContinueShopping, onViewOrder, onViewMyOrders }) => {
  if (!order) {
    return (
      <div className="order-confirmation">
        <div className="error-state">
          <h2>Erro</h2>
          <p>Não foi possível carregar as informações do pedido.</p>
          <Link to="/" className="btn btn-primary">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation" style={{ 
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: '9999',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'auto'
    }}>
      <div style={{ 
        padding: '40px', 
        backgroundColor: '#ffffff', 
        border: '3px solid #28a745', 
        borderRadius: '15px',
        maxWidth: '600px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ 
          color: '#28a745', 
          fontSize: '2.5rem', 
          margin: '0 0 20px 0' 
        }}>🎉 ¡PEDIDO CREADO EXITOSAMENTE!</h1>
        
        <h2 style={{ 
          color: '#333', 
          fontSize: '1.8rem',
          margin: '0 0 15px 0'
        }}>Número do pedido: #{order.order_number}</h2>
        
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#666',
          margin: '0 0 30px 0'
        }}>
          ¡Obrigado por sua compra! Seu pedido foi criado com sucesso.<br/>
          Você pode acompanhar o status do seu pedido na página "Meus Pedidos".
        </p>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={onViewMyOrders} 
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Ver Meus Pedidos
          </button>
          
          <button 
            onClick={onContinueShopping} 
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
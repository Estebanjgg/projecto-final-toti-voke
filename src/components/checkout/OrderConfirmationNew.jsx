import React from 'react';
import { Link } from 'react-router-dom';

function OrderConfirmation({ order, paymentResult, onContinueShopping, onViewOrder, onViewMyOrders }) {
  // Forzar que este componente tenga prioridad absoluta
  React.useEffect(() => {
    // Forzar scroll al top y bloquear scroll
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  if (!order) {
    return (
      <div className="order-confirmation order-confirmation-modal">
        <div className="error-state">
          <h2>Erro</h2>
          <p>Não foi possível carregar as informações do pedido.</p>
          <Link to="/" className="btn btn-primary">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="order-confirmation order-confirmation-modal" 
      id="order-confirmation-modal-unique"
      style={{ 
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '10000',
        visibility: 'visible',
        opacity: '1'
      }}
    >
      <div style={{ 
        padding: '2.5rem', 
        backgroundColor: '#ffffff', 
        border: '2px solid #E5E7EB',
        borderRadius: '16px',
        maxWidth: '450px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)',
        position: 'relative',
        animation: 'fadeInScale 0.4s ease-out'
      }}>
        {/* Icono de éxito */}
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#10B981',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          fontSize: '2.5rem'
        }}>
          ✅
        </div>
        
        <h1 style={{ 
          color: '#1F2937',
          fontSize: '1.8rem', 
          margin: '0 0 1rem 0',
          fontWeight: '600',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>¡Pedido Confirmado!</h1>
        
        <div style={{
          backgroundColor: '#F3F4F6',
          color: '#374151',
          padding: '1rem',
          margin: '0 0 1.5rem 0',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '500'
        }}>
          Pedido #{order.order_number}
        </div>
        
        <p style={{ 
          fontSize: '1rem', 
          color: '#6B7280',
          margin: '0 0 2rem 0',
          lineHeight: '1.5'
        }}>
          Obrigado por sua compra! Seu pedido foi criado com sucesso.<br/>
          Você pode acompanhar o status na página "Meus Pedidos".
        </p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => {
              if (onViewMyOrders) onViewMyOrders();
            }}
            style={{
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2563EB'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3B82F6'}
          >
            Ver Meus Pedidos
          </button>
          
          <button 
            onClick={() => {
              if (onContinueShopping) onContinueShopping();
            }}
            style={{
              backgroundColor: '#10B981',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10B981'}
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;

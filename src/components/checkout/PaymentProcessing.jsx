import React from 'react';
import './PaymentProcessing.css';

const PaymentProcessing = ({ paymentMethod, orderNumber }) => {
  const getPaymentMethodName = (method) => {
    const methods = {
      credit_card: 'Tarjeta de Crédito',
      debit_card: 'Tarjeta de Débito',
      pix: 'PIX',
      boleto: 'Boleto Bancário'
    };
    return methods[method] || method;
  };

  const getPaymentIcon = (method) => {
    const icons = {
      credit_card: '💳',
      debit_card: '💳',
      pix: '📱',
      boleto: '🧾'
    };
    return icons[method] || '💳';
  };

  return (
    <div className="payment-processing">
      <div className="processing-container">
        <div className="processing-icon">
          <div className="spinner"></div>
        </div>
        
        <h2>Procesando tu pago</h2>
        
        <div className="processing-info">
          <p>Estamos procesando tu pedido...</p>
          {orderNumber && (
            <p className="order-number">
              <strong>Número de pedido:</strong> {orderNumber}
            </p>
          )}
        </div>
        
        <div className="payment-method-info">
          <span className="payment-icon">{getPaymentIcon(paymentMethod)}</span>
          <span className="payment-name">{getPaymentMethodName(paymentMethod)}</span>
        </div>
        
        <div className="processing-steps">
          <div className="step active">
            <span className="step-icon">✓</span>
            <span className="step-text">Orden creada</span>
          </div>
          <div className="step active">
            <span className="step-icon">
              <div className="mini-spinner"></div>
            </span>
            <span className="step-text">Procesando pago</span>
          </div>
          <div className="step">
            <span className="step-icon">⏳</span>
            <span className="step-text">Confirmación</span>
          </div>
        </div>
        
        <div className="processing-message">
          <p>Por favor no cierres esta ventana ni hagas clic en el botón "Atrás" del navegador.</p>
          <p>Este proceso puede tomar unos segundos...</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;

import React from 'react';
import './PaymentProcessing.css';

const PaymentProcessing = ({ paymentMethod, orderNumber }) => {
  const getPaymentMethodName = (method) => {
    const methods = {
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
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
        
        <h2>Processando seu pagamento</h2>
        
        <div className="processing-info">
          <p>Estamos processando seu pedido...</p>
          {orderNumber && (
            <p className="order-number">
              <strong>Número do pedido:</strong> {orderNumber}
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
            <span className="step-text">Pedido criado</span>
          </div>
          <div className="step active">
            <span className="step-icon">
              <div className="mini-spinner"></div>
            </span>
            <span className="step-text">Processando pagamento</span>
          </div>
          <div className="step">
            <span className="step-icon">⏳</span>
            <span className="step-text">Confirmação</span>
          </div>
        </div>
        
        <div className="processing-message">
          <p>Por favor, não feche esta janela nem clique no botão "Voltar" do navegador.</p>
          <p>Este processo pode levar alguns segundos...</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;

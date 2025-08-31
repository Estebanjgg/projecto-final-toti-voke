import React from 'react';
import { Link } from 'react-router-dom';

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

  const getPaymentMethodName = (method) => {
    const methods = {
      'credit_card': 'Cartão de Crédito',
      'debit_card': 'Cartão de Débito',
      'pix': 'PIX',
      'boleto': 'Boleto Bancário'
    };
    return methods[method] || method;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#f39c12',
      'confirmed': '#27ae60',
      'processing': '#3498db',
      'shipped': '#9b59b6',
      'delivered': '#2ecc71',
      'cancelled': '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  const getStatusText = (status) => {
    const statuses = {
      'pending': 'Pendente',
      'confirmed': 'Confirmado',
      'processing': 'Processando',
      'shipped': 'Enviado',
      'delivered': 'Entregue',
      'cancelled': 'Cancelado'
    };
    return statuses[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="order-confirmation">
      {/* Header de confirmação */}
      <div className="confirmation-header">
        <div className="success-icon">✅</div>
        <h1>Pedido Confirmado!</h1>
        <p className="order-number">Número do pedido: <strong>#{order.order_number || 'Não disponível'}</strong></p>
        <p className="confirmation-message">
          Obrigado por sua compra. Recebemos seu pedido e estamos processando.
        </p>
      </div>

      {/* Estado do pedido */}
      <div className="order-status">
        <div className="status-badge" style={{ backgroundColor: getStatusColor(order.status || 'pending') }}>
          {getStatusText(order.status || 'pending')}
        </div>
        <p className="status-date">
          Pedido realizado em {formatDate(order.created_at)}
        </p>
      </div>

      {/* Informações do pedido */}
      <div className="order-details">
        <div className="details-section">
          <h3>Resumo do Pedido</h3>
          <div className="order-summary">
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>R$ {(order.subtotal || 0).toFixed(2)}</span>
            </div>
            {(order.discount || 0) > 0 && (
              <div className="summary-line discount">
                <span>Desconto:</span>
                <span>-R$ {(order.discount || 0).toFixed(2)}</span>
              </div>
            )}
            <div className="summary-line">
              <span>Entrega:</span>
              <span>R$ {(order.shipping || 0).toFixed(2)}</span>
            </div>
            {(order.tax || 0) > 0 && (
              <div className="summary-line">
                <span>Impostos:</span>
                <span>R$ {(order.tax || 0).toFixed(2)}</span>
              </div>
            )}
            <div className="summary-line total">
              <span>Total:</span>
              <span>R$ {(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Informações de pagamento */}
        <div className="details-section">
          <h3>Informações de Pagamento</h3>
          <div className="payment-info">
            <p><strong>Método:</strong> {getPaymentMethodName(order.payment_method || 'N/A')}</p>
            <p><strong>Status:</strong> 
              <span className={`payment-status ${order.payment_status || 'pending'}`}>
                {(order.payment_status || 'pending') === 'pending' ? 'Pendente' : 
                 (order.payment_status || 'pending') === 'paid' ? 'Pago' : 
                 (order.payment_status || 'pending') === 'failed' ? 'Falhou' : (order.payment_status || 'pending')}
              </span>
            </p>
            
            {/* Mostrar informações específicas conforme o resultado do pagamento */}
            {paymentResult && paymentResult.payment_result && (
              <div className="payment-details">
                {paymentResult.payment_result.transaction_id && (
                  <p><strong>ID da Transação:</strong> {paymentResult.payment_result.transaction_id}</p>
                )}
                
                {/* PIX específico */}
                {order.payment_method === 'pix' && paymentResult.payment_result.qr_code && (
                  <div className="pix-instructions">
                    <p><strong>Instruções PIX:</strong></p>
                    <p>Use o código QR ou a chave PIX para completar o pagamento.</p>
                    <div className="pix-details">
                      <p><strong>Chave PIX:</strong> <code>{paymentResult.payment_result.pix_key}</code></p>
                      <p><strong>Valor:</strong> R$ {(paymentResult.payment_result.amount || 0).toFixed(2)}</p>
                      <p><strong>Vence em:</strong> 15 minutos</p>
                    </div>
                    <button 
                      className="btn btn-outline"
                      onClick={() => {
                        // Simular confirmação de PIX depois de 5 segundos
                        setTimeout(() => {
                          alert('PIX confirmado! (Simulação)');
                          window.location.reload();
                        }, 5000);
                      }}
                    >
                      Simular Pagamento PIX
                    </button>
                  </div>
                )}
                
                {/* Boleto específico */}
                {order.payment_method === 'boleto' && paymentResult.payment_result.boleto_number && (
                  <div className="boleto-instructions">
                    <p><strong>Instruções Boleto:</strong></p>
                    <div className="boleto-details">
                      <p><strong>Número:</strong> {paymentResult.payment_result.boleto_number}</p>
                      <p><strong>Código de barras:</strong></p>
                      <code className="barcode">{paymentResult.payment_result.barcode}</code>
                      <p><strong>Vencimento:</strong> {formatDate(paymentResult.payment_result.due_date)}</p>
                    </div>
                    <div className="boleto-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          if (paymentResult.payment_result.download_url) {
                            window.open(paymentResult.payment_result.download_url, '_blank');
                          }
                        }}
                      >
                        Baixar Boleto
                      </button>
                      <button 
                        className="btn btn-outline"
                        onClick={() => {
                          // Simular confirmação de boleto
                          setTimeout(() => {
                            alert('Pagamento do boleto confirmado! (Simulação)');
                            window.location.reload();
                          }, 3000);
                        }}
                      >
                        Simular Pagamento Boleto
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Tarjeta específico */}
                {(order.payment_method === 'credit_card' || order.payment_method === 'debit_card') && (
                  <div className="card-payment-details">
                    {paymentResult.payment_result.authorization_code && (
                      <p><strong>Código de autorização:</strong> {paymentResult.payment_result.authorization_code}</p>
                    )}
                    {paymentResult.payment_result.last_four_digits && (
                      <p><strong>Cartão terminado em:</strong> ***{paymentResult.payment_result.last_four_digits}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Informações de entrega */}
        <div className="details-section">
          <h3>Informações de Entrega</h3>
          <div className="shipping-info">
            {order.shipping_address && (
              <div className="address">
                <p><strong>Endereço:</strong></p>
                <p>{order.shipping_address.street}, {order.shipping_address.number}</p>
                {order.shipping_address.complement && (
                  <p>{order.shipping_address.complement}</p>
                )}
                <p>{order.shipping_address.neighborhood}</p>
                <p>{order.shipping_address.city} - {order.shipping_address.state}</p>
                <p>CEP: {order.shipping_address.postal_code}</p>
              </div>
            )}
            
            {order.estimated_delivery && (
              <p><strong>Entrega estimada:</strong> {formatDate(order.estimated_delivery)}</p>
            )}
          </div>
        </div>

        {/* Informações de contato */}
        <div className="details-section">
          <h3>Informações de Contato</h3>
          <div className="contact-info">
            <p><strong>Email:</strong> {order.customer_email || 'Não disponível'}</p>
            {order.customer_phone && (
              <p><strong>Telefone:</strong> {order.customer_phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Próximos passos */}
      <div className="next-steps">
        <h3>Próximos Passos</h3>
        <div className="steps-list">
          <div className="step">
            <span className="step-number">1</span>
            <div className="step-content">
              <h4>Confirmação por Email</h4>
              <p>Você receberá um email de confirmação com todos os detalhes do seu pedido.</p>
            </div>
          </div>
          
          {(order.payment_status || 'pending') === 'pending' && (
            <div className="step">
              <span className="step-number">2</span>
              <div className="step-content">
                <h4>Completar Pagamento</h4>
                <p>Complete o pagamento seguindo as instruções enviadas para seu email.</p>
              </div>
            </div>
          )}
          
          <div className="step">
            <span className="step-number">{(order.payment_status || 'pending') === 'pending' ? '3' : '2'}</span>
            <div className="step-content">
              <h4>Preparação do Pedido</h4>
              <p>Assim que o pagamento for confirmado, prepararemos seu pedido para o envio.</p>
            </div>
          </div>
          
          <div className="step">
            <span className="step-number">{(order.payment_status || 'pending') === 'pending' ? '4' : '3'}</span>
            <div className="step-content">
              <h4>Envio e Entrega</h4>
              <p>Notificaremos você quando seu pedido for enviado com o código de rastreamento.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="confirmation-actions">
        <button onClick={onViewMyOrders} className="btn btn-primary">
          Ver Meus Pedidos
        </button>
        <button onClick={onContinueShopping} className="btn btn-secondary">
          Continuar Comprando
        </button>
        <button 
          onClick={onViewOrder}
          className="btn btn-outline"
        >
          Ver Detalhes do Pedido
        </button>
        <button 
          className="btn btn-outline"
          onClick={() => window.print()}
        >
          Imprimir Confirmação
        </button>
      </div>

      {/* Informações de suporte */}
      <div className="support-info">
        <h4>Precisa de Ajuda?</h4>
        <p>
          Se você tiver alguma dúvida sobre seu pedido, não hesite em nos contatar:
        </p>
        <div className="support-contacts">
          <p>📧 Email: suporte@loja.com</p>
          <p>📞 Telefone: (11) 1234-5678</p>
          <p>💬 Chat ao vivo disponível 24/7</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
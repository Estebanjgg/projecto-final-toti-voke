import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { ordersAPI } from '../../services/ordersAPI';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showError, showSuccess } = useAlert();
  
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    
    loadOrderDetails();
  }, [orderId, isAuthenticated, navigate]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrderById(orderId);
      setOrder(response);
    } catch (error) {
      console.error('Erro carregando detalhes do pedido:', error);
      showError('Pedido não encontrado');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const loadTrackingInfo = async () => {
    if (!order) return;
    
    try {
      const response = await ordersAPI.getOrderTracking(order.id);
      setTracking(response.data);
      setShowTrackingModal(true);
    } catch (error) {
      showError('Erro ao carregar informações de rastreamento');
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Tem certeza de que deseja cancelar este pedido?')) {
      return;
    }

    try {
      const reason = prompt('Por favor, informe um motivo para o cancelamento (opcional):') || '';
      await ordersAPI.cancelOrder(order.id, reason);
      showSuccess('Pedido cancelado com sucesso');
      loadOrderDetails(); // Recarregar dados
    } catch (error) {
      showError(error.message || 'Erro ao cancelar o pedido');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Pendente', class: 'status-pending' },
      confirmed: { text: 'Confirmado', class: 'status-confirmed' },
      processing: { text: 'Processando', class: 'status-processing' },
      shipped: { text: 'Enviado', class: 'status-shipped' },
      delivered: { text: 'Entregue', class: 'status-delivered' },
      cancelled: { text: 'Cancelado', class: 'status-cancelled' }
    };

    const config = statusConfig[status] || { text: status, class: 'status-default' };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const statusConfig = {
      pending: { text: 'Pendente', class: 'payment-pending' },
      paid: { text: 'Pago', class: 'payment-paid' },
      failed: { text: 'Falhou', class: 'payment-failed' },
      refunded: { text: 'Reembolsado', class: 'payment-refunded' }
    };

    const config = statusConfig[paymentStatus] || { text: paymentStatus, class: 'payment-default' };
    return <span className={`payment-badge ${config.class}`}>{config.text}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canCancelOrder = () => {
    return order && ['pending', 'confirmed'].includes(order.status);
  };

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando detalhes do pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-page">
        <div className="error-container">
          <h2>Pedido não encontrado</h2>
          <p>Não foi possível encontrar o pedido #{orderId}</p>
          <Link to="/orders" className="btn btn-primary">
            Voltar aos Meus Pedidos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="breadcrumb">
              <Link to="/orders">Meus Pedidos</Link>
              <span> / </span>
              <span>#{order.order_number}</span>
            </div>
            <h1>Pedido #{order.order_number}</h1>
            <div className="order-meta">
              <p>Realizado em {formatDate(order.created_at)}</p>
              <div className="status-badges">
                {getStatusBadge(order.status)}
                {getPaymentStatusBadge(order.payment_status)}
              </div>
            </div>
          </div>
          
          <div className="header-actions">
            {order.status === 'shipped' && (
              <button onClick={loadTrackingInfo} className="btn btn-primary">
                Rastrear Pedido
              </button>
            )}
            {canCancelOrder() && (
              <button onClick={handleCancelOrder} className="btn btn-danger">
                Cancelar Pedido
              </button>
            )}
            <button onClick={() => window.print()} className="btn btn-outline">
              Imprimir
            </button>
          </div>
        </div>

        <div className="order-content">
          {/* Itens do pedido */}
          <div className="order-section">
            <h2>Produtos Pedidos</h2>
            <div className="order-items">
              {order.order_items && order.order_items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    {item.product_image ? (
                      <img src={item.product_image} alt={item.product_title} />
                    ) : (
                      <div className="no-image">📦</div>
                    )}
                  </div>
                  
                  <div className="item-details">
                    <h3>{item.product_title}</h3>
                    {item.product_brand && (
                      <p className="item-brand">Marca: {item.product_brand}</p>
                    )}
                    <p className="item-quantity">Quantidade: {item.quantity}</p>
                  </div>
                  
                  <div className="item-pricing">
                    <p className="item-unit-price">R$ {item.unit_price.toFixed(2)} c/u</p>
                    <p className="item-total-price">R$ {item.total_price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo de custos */}
          <div className="order-section">
            <h2>Resumo de Custos</h2>
            <div className="cost-summary">
              <div className="cost-line">
                <span>Subtotal:</span>
                <span>R$ {order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="cost-line discount">
                  <span>Desconto:</span>
                  <span>-R$ {order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="cost-line">
                <span>Frete:</span>
                <span>R$ {order.shipping.toFixed(2)}</span>
              </div>
              {order.tax > 0 && (
                <div className="cost-line">
                  <span>Impostos:</span>
                  <span>R$ {order.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="cost-line total">
                <span>Total:</span>
                <span>R$ {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Informações de pagamento */}
          <div className="order-section">
            <h2>Informações de Pagamento</h2>
            <div className="payment-info">
              <div className="info-grid">
                <div className="info-item">
                  <label>Método de Pagamento:</label>
                  <span>{order.payment_method === 'credit_card' ? 'Cartão de Crédito' :
                         order.payment_method === 'debit_card' ? 'Cartão de Débito' :
                         order.payment_method === 'pix' ? 'PIX' :
                         order.payment_method === 'boleto' ? 'Boleto Bancário' :
                         order.payment_method}</span>
                </div>
                <div className="info-item">
                  <label>Status do Pagamento:</label>
                  {getPaymentStatusBadge(order.payment_status)}
                </div>
                
                {order.payment_details && (
                  <>
                    <div className="info-item">
                      <label>ID da Transação:</label>
                      <span>{order.payment_details.transaction_id}</span>
                    </div>
                    
                    {order.payment_details.payment_data && order.payment_details.payment_data.authorization_code && (
                      <div className="info-item">
                        <label>Código de Autorização:</label>
                        <span>{order.payment_details.payment_data.authorization_code}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Informações específicas de métodos de pagamento */}
              {order.payment_status === 'pending' && order.payment_method === 'pix' && (
                <div className="payment-instructions">
                  <h4>Instruções PIX</h4>
                  <p>Seu pagamento está pendente. Use o código QR ou chave PIX enviado ao seu email.</p>
                </div>
              )}
              
              {order.payment_status === 'pending' && order.payment_method === 'boleto' && (
                <div className="payment-instructions">
                  <h4>Instruções Boleto</h4>
                  <p>O boleto foi enviado ao seu email. Você pode pagá-lo em qualquer banco ou lotérica.</p>
                </div>
              )}
            </div>
          </div>

          {/* Informações de envio */}
          <div className="order-section">
            <h2>Informações de Envio</h2>
            <div className="shipping-info">
              <div className="info-grid">
                <div className="info-item">
                  <label>Nome:</label>
                  <span>{order.customer_name}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{order.customer_email}</span>
                </div>
                {order.customer_phone && (
                  <div className="info-item">
                    <label>Telefone:</label>
                    <span>{order.customer_phone}</span>
                  </div>
                )}
              </div>
              
              {order.shipping_address && (
                <div className="address-info">
                  <h4>Endereço de Entrega</h4>
                  <address>
                    {order.shipping_address.street}, {order.shipping_address.number}<br/>
                    {order.shipping_address.complement && (
                      <>{order.shipping_address.complement}<br/></>
                    )}
                    {order.shipping_address.neighborhood}<br/>
                    {order.shipping_address.city} - {order.shipping_address.state}<br/>
                    CEP: {order.shipping_address.postal_code}
                  </address>
                </div>
              )}
              
              {order.tracking_number && (
                <div className="tracking-info">
                  <h4>Informações de Envio</h4>
                  <p><strong>Código de Rastreamento:</strong> {order.tracking_number}</p>
                  {order.shipping_company && (
                    <p><strong>Transportadora:</strong> {order.shipping_company}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Notas adicionais */}
          {(order.notes || order.admin_notes) && (
            <div className="order-section">
              <h2>Observações</h2>
              <div className="notes-info">
                {order.notes && (
                  <div className="note-item">
                    <h4>Observações do Cliente:</h4>
                    <p>{order.notes}</p>
                  </div>
                )}
                {order.admin_notes && (
                  <div className="note-item">
                    <h4>Observações Administrativas:</h4>
                    <p>{order.admin_notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal de rastreamento */}
        {showTrackingModal && tracking && (
          <div className="modal-overlay" onClick={() => setShowTrackingModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Rastreamento do Pedido</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowTrackingModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="tracking-timeline">
                {tracking.timeline.map((event, index) => (
                  <div key={index} className={`timeline-item ${event.completed ? 'completed' : 'pending'}`}>
                    <div className="timeline-marker">
                      {event.completed ? '✓' : '○'}
                    </div>
                    <div className="timeline-content">
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>
                      {event.date && (
                        <span className="timeline-date">
                          {formatDate(event.date)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {tracking.estimated_delivery && (
                <div className="estimated-delivery">
                  <p><strong>Entrega estimada:</strong> {formatDate(tracking.estimated_delivery)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;

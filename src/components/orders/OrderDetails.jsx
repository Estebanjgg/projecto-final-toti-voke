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
      console.error('Error cargando detalles del pedido:', error);
      showError('Pedido no encontrado');
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
      showError('Error al cargar información de seguimiento');
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
      return;
    }

    try {
      const reason = prompt('Por favor ingresa una razón para la cancelación (opcional):') || '';
      await ordersAPI.cancelOrder(order.id, reason);
      showSuccess('Pedido cancelado exitosamente');
      loadOrderDetails(); // Recargar datos
    } catch (error) {
      showError(error.message || 'Error al cancelar el pedido');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Pendiente', class: 'status-pending' },
      confirmed: { text: 'Confirmado', class: 'status-confirmed' },
      processing: { text: 'Procesando', class: 'status-processing' },
      shipped: { text: 'Enviado', class: 'status-shipped' },
      delivered: { text: 'Entregado', class: 'status-delivered' },
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
          <p>Cargando detalles del pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-page">
        <div className="error-container">
          <h2>Pedido no encontrado</h2>
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
              <p>Realizado el {formatDate(order.created_at)}</p>
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
          {/* Items del pedido */}
          <div className="order-section">
            <h2>Productos Pedidos</h2>
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
                    <p className="item-quantity">Cantidad: {item.quantity}</p>
                  </div>
                  
                  <div className="item-pricing">
                    <p className="item-unit-price">R$ {item.unit_price.toFixed(2)} c/u</p>
                    <p className="item-total-price">R$ {item.total_price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen de costos */}
          <div className="order-section">
            <h2>Resumen de Costos</h2>
            <div className="cost-summary">
              <div className="cost-line">
                <span>Subtotal:</span>
                <span>R$ {order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="cost-line discount">
                  <span>Descuento:</span>
                  <span>-R$ {order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="cost-line">
                <span>Envío:</span>
                <span>R$ {order.shipping.toFixed(2)}</span>
              </div>
              {order.tax > 0 && (
                <div className="cost-line">
                  <span>Impuestos:</span>
                  <span>R$ {order.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="cost-line total">
                <span>Total:</span>
                <span>R$ {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Información de pago */}
          <div className="order-section">
            <h2>Información de Pago</h2>
            <div className="payment-info">
              <div className="info-grid">
                <div className="info-item">
                  <label>Método de Pago:</label>
                  <span>{order.payment_method === 'credit_card' ? 'Cartão de Crédito' :
                         order.payment_method === 'debit_card' ? 'Cartão de Débito' :
                         order.payment_method === 'pix' ? 'PIX' :
                         order.payment_method === 'boleto' ? 'Boleto Bancário' :
                         order.payment_method}</span>
                </div>
                <div className="info-item">
                  <label>Estado del Pago:</label>
                  {getPaymentStatusBadge(order.payment_status)}
                </div>
                
                {order.payment_details && (
                  <>
                    <div className="info-item">
                      <label>ID de Transacción:</label>
                      <span>{order.payment_details.transaction_id}</span>
                    </div>
                    
                    {order.payment_details.payment_data && order.payment_details.payment_data.authorization_code && (
                      <div className="info-item">
                        <label>Código de Autorización:</label>
                        <span>{order.payment_details.payment_data.authorization_code}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Información específica de métodos de pago */}
              {order.payment_status === 'pending' && order.payment_method === 'pix' && (
                <div className="payment-instructions">
                  <h4>Instrucciones PIX</h4>
                  <p>Tu pago está pendiente. Usa el código QR o clave PIX enviado a tu email.</p>
                </div>
              )}
              
              {order.payment_status === 'pending' && order.payment_method === 'boleto' && (
                <div className="payment-instructions">
                  <h4>Instrucciones Boleto</h4>
                  <p>El boleto fue enviado a tu email. Puedes pagarlo en cualquier banco o lotérica.</p>
                </div>
              )}
            </div>
          </div>

          {/* Información de envío */}
          <div className="order-section">
            <h2>Información de Envío</h2>
            <div className="shipping-info">
              <div className="info-grid">
                <div className="info-item">
                  <label>Nombre:</label>
                  <span>{order.customer_name}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{order.customer_email}</span>
                </div>
                {order.customer_phone && (
                  <div className="info-item">
                    <label>Teléfono:</label>
                    <span>{order.customer_phone}</span>
                  </div>
                )}
              </div>
              
              {order.shipping_address && (
                <div className="address-info">
                  <h4>Dirección de Envío</h4>
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
                  <h4>Información de Envío</h4>
                  <p><strong>Código de Rastreo:</strong> {order.tracking_number}</p>
                  {order.shipping_company && (
                    <p><strong>Transportadora:</strong> {order.shipping_company}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Notas adicionales */}
          {(order.notes || order.admin_notes) && (
            <div className="order-section">
              <h2>Notas</h2>
              <div className="notes-info">
                {order.notes && (
                  <div className="note-item">
                    <h4>Notas del Cliente:</h4>
                    <p>{order.notes}</p>
                  </div>
                )}
                {order.admin_notes && (
                  <div className="note-item">
                    <h4>Notas Administrativas:</h4>
                    <p>{order.admin_notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal de seguimiento */}
        {showTrackingModal && tracking && (
          <div className="modal-overlay" onClick={() => setShowTrackingModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Seguimiento del Pedido</h3>
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

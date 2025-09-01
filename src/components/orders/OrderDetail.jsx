import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { ordersAPI } from '../../services/ordersAPI';
// LoadingSpinner component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Carregando...</p>
  </div>
);
import './OrderDetail.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrderDetail();
  }, [orderId, user, navigate]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ordersAPI.getOrderById(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
      setError('Erro ao carregar os detalhes do pedido');
      showAlert('Erro ao carregar os detalhes do pedido', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Pendente',
      'confirmed': 'Confirmado',
      'preparing': 'Preparando',
      'shipped': 'Enviado',
      'delivered': 'Entregue',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'pending': '#ffc107',
      'confirmed': '#17a2b8',
      'preparing': '#fd7e14',
      'shipped': '#6f42c1',
      'delivered': '#28a745',
      'cancelled': '#dc3545'
    };
    return colorMap[status] || '#6c757d';
  };

  if (!user) {
    return (
      <div className="order-detail-container">
        <div className="unauthenticated-message">
          <h2>Acceso Restringido</h2>
          <p>Debes iniciar sesión para ver los detalles del pedido.</p>
          <button 
            onClick={() => navigate('/login')} 
            className="btn btn-primary"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="order-detail-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-detail-container">
        <div className="error-message">
          <h2>Erro</h2>
          <p>{error || 'Pedido não encontrado'}</p>
          <button 
            onClick={() => navigate('/orders')} 
            className="btn btn-primary"
          >
            Voltar aos Pedidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <button 
          onClick={() => navigate('/orders')} 
          className="back-button"
        >
          ← Voltar aos Pedidos
        </button>
        <h1>Detalhes do Pedido #{order.id}</h1>
      </div>

      <div className="order-detail-content">
        {/* Información General */}
        <div className="detail-section">
          <h2>Informações Gerais</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Número do Pedido:</span>
              <span className="info-value">#{order.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Data:</span>
              <span className="info-value">
                {new Date(order.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span 
                className="status-badge-large"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {getStatusText(order.status)}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Total:</span>
              <span className="info-value total-amount">
                R$ {parseFloat(order.total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Productos Comprados */}
        <div className="detail-section">
          <h2>Produtos Comprados ({order.order_items?.length || 0})</h2>
          <div className="products-list">
            {order.order_items && order.order_items.length > 0 ? (
              order.order_items.map((item, index) => (
                <div key={index} className="product-item">
                  <div className="product-info">
                    <h3 className="product-name">
                      {item.product_title || item.name || 'Producto'}
                    </h3>
                    {item.product_image && (
                      <img src={item.product_image} alt={item.product_title} className="product-image" />
                    )}
                  </div>
                  <div className="product-details">
                    <div className="quantity-price">
                      <span className="quantity">Quantidade: {item.quantity}</span>
                      <span className="subtotal">
                        Total: R$ {parseFloat(item.total_price || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-items">Não há produtos neste pedido.</p>
            )}
          </div>
        </div>

        {/* Información de Pago */}
        {order.payment_method && (
          <div className="detail-section">
            <h2>Informações de Pagamento</h2>
            <div className="payment-details">
              <div className="info-item">
                <span className="info-label">Método de Pagamento:</span>
                <span className="info-value">{order.payment_method}</span>
              </div>
              {order.payment_status && (
                <div className="info-item">
                <span className="info-label">Status do Pagamento:</span>
                <span className="info-value">{order.payment_status}</span>
              </div>
              )}
            </div>
          </div>
        )}

        {/* Información de Envío */}
        {order.shipping_address && (
          <div className="detail-section">
            <h2>Informações de Envio</h2>
            <div className="shipping-details">
              <div className="address-info">
                <p>{order.shipping_address.street} {order.shipping_address.number}</p>
                {order.shipping_address.complement && <p>{order.shipping_address.complement}</p>}
                <p>{order.shipping_address.neighborhood}</p>
                <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                <p>{order.shipping_address.postal_code}</p>
                <p>{order.shipping_address.country}</p>
              </div>
              {order.tracking_number && (
                <div className="info-item">
                  <span className="info-label">Número de Rastreamento:</span>
                  <span className="info-value">{order.tracking_number}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Historial de Estado */}
        <div className="detail-section">
          <h2>Histórico do Pedido</h2>
          <div className="status-timeline">
            <div className="timeline-item active">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Pedido Criado</h4>
                <p>{new Date(order.created_at).toLocaleDateString('es-ES')}</p>
              </div>
            </div>
            {order.status !== 'pending' && (
              <div className="timeline-item active">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Status Atual: {getStatusText(order.status)}</h4>
                  <p>Atualizado recentemente</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
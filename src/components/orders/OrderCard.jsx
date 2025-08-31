import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../../services/ordersAPI';
import { useAlert } from '../../contexts/AlertContext';

const OrderCard = ({ order, onCancel, onReorder }) => {
  const { addAlert } = useAlert();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [loading, setLoading] = useState(false);

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obter cor do status
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

  // Obter texto do status
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

  // Verificar se pode cancelar
  const canCancel = () => {
    return ['pending', 'confirmed'].includes(order.status);
  };

  // Verificar se pode refazer pedido
  const canReorder = () => {
    return ['delivered', 'cancelled'].includes(order.status);
  };

  // Gerenciar cancelamento
  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      addAlert('Por favor, forneça um motivo para o cancelamento', 'warning');
      return;
    }

    try {
      setLoading(true);
      await onCancel(order.id, cancelReason);
      setShowCancelModal(false);
      setCancelReason('');
    } catch (error) {
      console.error('Erro ao cancelar:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gerenciar refazer pedido
  const handleReorder = async () => {
    try {
      setLoading(true);
      await onReorder(order.id, order.order_items || order.items || []);
    } catch (error) {
      console.error('Erro ao refazer pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  // Baixar nota fiscal
  const handleDownloadInvoice = async () => {
    try {
      setLoading(true);
      const blob = await ordersAPI.downloadInvoice(order.id);
      
      // Criar URL para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nota-fiscal-${order.order_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      addAlert('Nota fiscal baixada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao baixar nota fiscal:', error);
      addAlert('Erro ao baixar a nota fiscal', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="order-card">
        {/* Header do pedido */}
        <div className="order-header">
          <div className="order-info">
            <div className="order-number">
              <strong>#{order.order_number}</strong>
            </div>
            <div className="order-date">
              {formatDate(order.created_at)}
            </div>
          </div>
          
          <div className="order-status">
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(order.status) }}
            >
              {getStatusText(order.status)}
            </span>
          </div>
        </div>

        {/* Conteúdo do pedido */}
        <div className="order-content">
          {/* Itens do pedido */}
          <div className="order-items">
            {(order.order_items || order.items) && (order.order_items || order.items).length > 0 ? (
              <>
                {(order.order_items || order.items).slice(0, 3).map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      <img 
                        src={item.product_image || '/placeholder.jpg'} 
                        alt={item.product_title}
                      />
                    </div>
                    <div className="item-details">
                      <div className="item-title">{item.product_title}</div>
                      {item.product_brand && (
                        <div className="item-brand">{item.product_brand}</div>
                      )}
                      <div className="item-quantity">Quantidade: {item.quantity}</div>
                    </div>
                    <div className="item-price">
                      R$ {(item.total_price || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
                
                {(order.order_items || order.items).length > 3 && (
                  <div className="more-items">
                    +{(order.order_items || order.items).length - 3} produtos a mais
                  </div>
                )}
              </>
            ) : (
              <div className="no-items">
                <p>Não foi possível carregar os itens deste pedido</p>
              </div>
            )}
          </div>

          {/* Informações de envio e pagamento */}
          <div className="order-details">
            <div className="detail-section">
              <h4>Informações de Envio</h4>
              {order.shipping_address ? (
                <div className="address">
                  <p>{order.shipping_address.street}, {order.shipping_address.number}</p>
                  <p>{order.shipping_address.city} - {order.shipping_address.state}</p>
                  <p>CEP: {order.shipping_address.postal_code}</p>
                </div>
              ) : (
                <p>Endereço não disponível</p>
              )}
            </div>
            
            <div className="detail-section">
              <h4>Informações de Pagamento</h4>
              <p><strong>Método:</strong> {order.payment_method}</p>
              <p><strong>Status:</strong> 
                <span className={`payment-status ${order.payment_status}`}>
                  {order.payment_status === 'pending' ? 'Pendente' : 
                   order.payment_status === 'paid' ? 'Pago' : 
                   order.payment_status === 'failed' ? 'Falhou' : order.payment_status}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer do pedido */}
        <div className="order-footer">
          <div className="order-total">
            <span className="total-label">Total:</span>
            <span className="total-amount">R$ {(order.total || 0).toFixed(2)}</span>
          </div>
          
          <div className="order-actions">
            <Link 
              to={`/orders/${order.id}`} 
              className="btn btn-outline btn-sm"
            >
              Ver Detalhes
            </Link>
            
            {order.status === 'shipped' && (
              <Link 
                to={`/orders/track/${order.order_number}`} 
                className="btn btn-outline btn-sm"
              >
                Rastrear
              </Link>
            )}
            
            {['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) && (
              <button 
                className="btn btn-outline btn-sm"
                onClick={handleDownloadInvoice}
                disabled={loading}
              >
                {loading ? 'Baixando...' : 'Nota Fiscal'}
              </button>
            )}
            
            {canReorder() && (
              <button 
                className="btn btn-primary btn-sm"
                onClick={handleReorder}
                disabled={loading}
              >
                {loading ? 'Adicionando...' : 'Refazer Pedido'}
              </button>
            )}
            
            {canCancel() && (
              <button 
                className="btn btn-danger btn-sm"
                onClick={() => setShowCancelModal(true)}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de cancelamento */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Cancelar Pedido</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCancelModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <p>Tem certeza de que deseja cancelar o pedido #{order.order_number}?</p>
              
              <div className="form-group">
                <label htmlFor="cancelReason">Motivo do cancelamento:</label>
                <textarea
                  id="cancelReason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Por favor, explique por que deseja cancelar este pedido..."
                  rows="4"
                  required
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-outline"
                onClick={() => setShowCancelModal(false)}
                disabled={loading}
              >
                Manter Pedido
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleCancel}
                disabled={loading || !cancelReason.trim()}
              >
                {loading ? 'Cancelando...' : 'Confirmar Cancelamento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderCard;
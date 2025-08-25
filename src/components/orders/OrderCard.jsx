import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../../services/ordersAPI';
import { useAlert } from '../../contexts/AlertContext';

const OrderCard = ({ order, onCancel, onReorder }) => {
  const { addAlert } = useAlert();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [loading, setLoading] = useState(false);

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener color del estado
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

  // Obtener texto del estado
  const getStatusText = (status) => {
    const statuses = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmado',
      'processing': 'Procesando',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return statuses[status] || status;
  };

  // Verificar si se puede cancelar
  const canCancel = () => {
    return ['pending', 'confirmed'].includes(order.status);
  };

  // Verificar si se puede reordenar
  const canReorder = () => {
    return ['delivered', 'cancelled'].includes(order.status);
  };

  // Manejar cancelación
  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      addAlert('Por favor, proporciona una razón para la cancelación', 'warning');
      return;
    }

    try {
      setLoading(true);
      await onCancel(order.id, cancelReason);
      setShowCancelModal(false);
      setCancelReason('');
    } catch (error) {
      console.error('Error al cancelar:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar reorden
  const handleReorder = async () => {
    try {
      setLoading(true);
      await onReorder(order.id, order.order_items || order.items || []);
    } catch (error) {
      console.error('Error al reordenar:', error);
    } finally {
      setLoading(false);
    }
  };

  // Descargar factura
  const handleDownloadInvoice = async () => {
    try {
      setLoading(true);
      const blob = await ordersAPI.downloadInvoice(order.id);
      
      // Crear URL para descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `factura-${order.order_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      addAlert('Factura descargada exitosamente', 'success');
    } catch (error) {
      console.error('Error al descargar factura:', error);
      addAlert('Error al descargar la factura', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="order-card">
        {/* Header de la orden */}
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

        {/* Contenido de la orden */}
        <div className="order-content">
          {/* Items de la orden */}
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
                      <div className="item-quantity">Cantidad: {item.quantity}</div>
                    </div>
                    <div className="item-price">
                      R$ {(item.total_price || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
                
                {(order.order_items || order.items).length > 3 && (
                  <div className="more-items">
                    +{(order.order_items || order.items).length - 3} productos más
                  </div>
                )}
              </>
            ) : (
              <div className="no-items">
                <p>No se pudieron cargar los items de esta orden</p>
              </div>
            )}
          </div>

          {/* Información de envío y pago */}
          <div className="order-details">
            <div className="detail-section">
              <h4>Información de Envío</h4>
              {order.shipping_address ? (
                <div className="address">
                  <p>{order.shipping_address.street}, {order.shipping_address.number}</p>
                  <p>{order.shipping_address.city} - {order.shipping_address.state}</p>
                  <p>CEP: {order.shipping_address.postal_code}</p>
                </div>
              ) : (
                <p>Dirección no disponible</p>
              )}
            </div>
            
            <div className="detail-section">
              <h4>Información de Pago</h4>
              <p><strong>Método:</strong> {order.payment_method}</p>
              <p><strong>Estado:</strong> 
                <span className={`payment-status ${order.payment_status}`}>
                  {order.payment_status === 'pending' ? 'Pendiente' : 
                   order.payment_status === 'paid' ? 'Pagado' : 
                   order.payment_status === 'failed' ? 'Falló' : order.payment_status}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer de la orden */}
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
              Ver Detalles
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
                {loading ? 'Descargando...' : 'Factura'}
              </button>
            )}
            
            {canReorder() && (
              <button 
                className="btn btn-primary btn-sm"
                onClick={handleReorder}
                disabled={loading}
              >
                {loading ? 'Agregando...' : 'Reordenar'}
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

      {/* Modal de cancelación */}
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
              <p>¿Estás seguro de que deseas cancelar el pedido #{order.order_number}?</p>
              
              <div className="form-group">
                <label htmlFor="cancelReason">Razón de la cancelación:</label>
                <textarea
                  id="cancelReason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Por favor, explica por qué deseas cancelar este pedido..."
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
                Mantener Pedido
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleCancel}
                disabled={loading || !cancelReason.trim()}
              >
                {loading ? 'Cancelando...' : 'Confirmar Cancelación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderCard;
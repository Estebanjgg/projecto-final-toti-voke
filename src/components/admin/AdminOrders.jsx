import React, { useState, useEffect } from 'react';
import { useAlert } from '../../contexts/AlertContext';
import adminAPI from '../../services/adminAPI';

const AdminOrders = () => {
  const { showSuccess, showError } = useAlert();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: '',
    payment_status: '',
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  useEffect(() => {
    loadOrders();
  }, [filters]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getOrders(filters);
      setOrders(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      showError('Error cargando órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset page when other filters change
    }));
  };

  const handleStatusUpdate = async (orderId, newStatus, notes = '') => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus, notes);
      showSuccess('Estado de orden actualizado exitosamente');
      loadOrders();
      setShowOrderModal(false);
    } catch (error) {
      console.error('Error actualizando estado:', error);
      showError('Error actualizando estado de orden');
    }
  };

  const handlePaymentStatusUpdate = async (orderId, paymentStatus) => {
    try {
      await adminAPI.updatePaymentStatus(orderId, paymentStatus);
      showSuccess('Estado de pago actualizado exitosamente');
      loadOrders();
    } catch (error) {
      console.error('Error actualizando estado de pago:', error);
      showError('Error actualizando estado de pago');
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await adminAPI.getOrderById(orderId);
      setSelectedOrder(response.data);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Error obteniendo detalles de orden:', error);
      showError('Error obteniendo detalles de orden');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'primary',
      shipped: 'success',
      delivered: 'success',
      cancelled: 'danger'
    };
    return colors[status] || 'secondary';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      paid: 'success',
      failed: 'danger',
      refunded: 'info'
    };
    return colors[status] || 'secondary';
  };

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h1>Gestión de Órdenes</h1>
        <p>Administra todas las órdenes de la tienda</p>
      </div>

      {/* Filtros */}
      <div className="orders-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label>Buscar:</label>
            <input
              type="text"
              placeholder="Número de orden, email, nombre..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Estado:</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-select"
            >
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="processing">Procesando</option>
              <option value="shipped">Enviada</option>
              <option value="delivered">Entregada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Estado de Pago:</label>
            <select
              value={filters.payment_status}
              onChange={(e) => handleFilterChange('payment_status', e.target.value)}
              className="form-select"
            >
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="paid">Pagado</option>
              <option value="failed">Fallido</option>
              <option value="refunded">Reembolsado</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Ordenar por:</label>
            <select
              value={`${filters.sort_by}-${filters.sort_order}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sort_by', sortBy);
                handleFilterChange('sort_order', sortOrder);
              }}
              className="form-select"
            >
              <option value="created_at-desc">Fecha (Más reciente)</option>
              <option value="created_at-asc">Fecha (Más antigua)</option>
              <option value="total-desc">Total (Mayor a menor)</option>
              <option value="total-asc">Total (Menor a mayor)</option>
              <option value="order_number-asc">Número de orden</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de órdenes */}
      {loading ? (
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Cargando órdenes...</p>
        </div>
      ) : (
        <>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Pago</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.order_number}</strong>
                    </td>
                    <td>
                      <div className="customer-info">
                        <div>{order.customer_name}</div>
                        <small>{order.customer_email}</small>
                      </div>
                    </td>
                    <td>{formatDate(order.created_at)}</td>
                    <td><strong>{formatCurrency(order.total)}</strong></td>
                    <td>
                      <span className={`status-badge status-${getStatusColor(order.status)}`}>
                        {order.status === 'pending' && 'Pendiente'}
                        {order.status === 'confirmed' && 'Confirmada'}
                        {order.status === 'processing' && 'Procesando'}
                        {order.status === 'shipped' && 'Enviada'}
                        {order.status === 'delivered' && 'Entregada'}
                        {order.status === 'cancelled' && 'Cancelada'}
                      </span>
                    </td>
                    <td>
                      <span className={`payment-badge payment-${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status === 'pending' && 'Pendiente'}
                        {order.payment_status === 'paid' && 'Pagado'}
                        {order.payment_status === 'failed' && 'Fallido'}
                        {order.payment_status === 'refunded' && 'Reembolsado'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => viewOrderDetails(order.id)}
                          className="btn btn-sm btn-outline"
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handleFilterChange('page', pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="btn btn-outline"
              >
                Anterior
              </button>
              
              <span className="pagination-info">
                Página {pagination.page} de {pagination.pages}
              </span>
              
              <button
                onClick={() => handleFilterChange('page', pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="btn btn-outline"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal de detalles de orden */}
      {showOrderModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setShowOrderModal(false)}
          onStatusUpdate={handleStatusUpdate}
          onPaymentStatusUpdate={handlePaymentStatusUpdate}
        />
      )}
    </div>
  );
};

// Componente del modal de detalles
const OrderDetailsModal = ({ order, onClose, onStatusUpdate, onPaymentStatusUpdate }) => {
  const [newStatus, setNewStatus] = useState(order.status);
  const [newPaymentStatus, setNewPaymentStatus] = useState(order.payment_status);
  const [notes, setNotes] = useState('');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles de Orden #{order.order_number}</h2>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="order-details-grid">
            {/* Información general */}
            <div className="detail-section">
              <h3>Información General</h3>
              <div className="detail-item">
                <label>Fecha de Creación:</label>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className="detail-item">
                <label>Cliente:</label>
                <span>{order.customer_name}</span>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>{order.customer_email}</span>
              </div>
              <div className="detail-item">
                <label>Teléfono:</label>
                <span>{order.customer_phone}</span>
              </div>
            </div>

            {/* Estados */}
            <div className="detail-section">
              <h3>Estados</h3>
              <div className="detail-item">
                <label>Estado de Orden:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="processing">Procesando</option>
                  <option value="shipped">Enviada</option>
                  <option value="delivered">Entregada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
              <div className="detail-item">
                <label>Estado de Pago:</label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="pending">Pendiente</option>
                  <option value="paid">Pagado</option>
                  <option value="failed">Fallido</option>
                  <option value="refunded">Reembolsado</option>
                </select>
              </div>
            </div>

            {/* Totales */}
            <div className="detail-section">
              <h3>Totales</h3>
              <div className="detail-item">
                <label>Subtotal:</label>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="detail-item">
                <label>Envío:</label>
                <span>{formatCurrency(order.shipping)}</span>
              </div>
              <div className="detail-item">
                <label>Descuento:</label>
                <span>{formatCurrency(order.discount)}</span>
              </div>
              <div className="detail-item">
                <label><strong>Total:</strong></label>
                <span><strong>{formatCurrency(order.total)}</strong></span>
              </div>
            </div>
          </div>

          {/* Productos */}
          {order.order_items && order.order_items.length > 0 && (
            <div className="detail-section">
              <h3>Productos</h3>
              <div className="order-items">
                {order.order_items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.product_image} alt={item.product_title} />
                    <div className="item-details">
                      <h4>{item.product_title}</h4>
                      <p>Cantidad: {item.quantity}</p>
                      <p>Precio: {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notas */}
          <div className="detail-section">
            <h3>Notas Administrativas</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agregar notas sobre esta orden..."
              className="form-textarea"
              rows="3"
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-outline">
            Cancelar
          </button>
          <button
            onClick={() => onPaymentStatusUpdate(order.id, newPaymentStatus)}
            className="btn btn-secondary"
            disabled={newPaymentStatus === order.payment_status}
          >
            Actualizar Pago
          </button>
          <button
            onClick={() => onStatusUpdate(order.id, newStatus, notes)}
            className="btn btn-primary"
            disabled={newStatus === order.status}
          >
            Actualizar Estado
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
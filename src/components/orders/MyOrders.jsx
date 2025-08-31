import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { ordersAPI } from '../../services/ordersAPI';
import './MyOrders.css';

const MyOrders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showError, showSuccess } = useAlert();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [ordersSummary, setOrdersSummary] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    
    loadOrders();
    loadOrdersSummary();
  }, [currentPage, selectedStatus, isAuthenticated, navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getUserOrders({
        page: currentPage,
        limit: 10,
        status: selectedStatus || undefined
      });
      
      setOrders(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Erro carregando pedidos:', error);
      showError('Erro ao carregar os pedidos');
    } finally {
      setLoading(false);
    }
  };

  const loadOrdersSummary = async () => {
    try {
      const response = await ordersAPI.getOrdersSummary();
      setOrdersSummary(response.data);
    } catch (error) {
      console.error('Erro carregando resumo:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Tem certeza de que deseja cancelar este pedido?')) {
      return;
    }

    try {
      const reason = prompt('Por favor, informe um motivo para o cancelamento (opcional):') || '';
      await ordersAPI.cancelOrder(orderId, reason);
      showSuccess('Pedido cancelado com sucesso');
      loadOrders();
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
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canCancelOrder = (order) => {
    return ['pending', 'confirmed'].includes(order.status) && order.payment_status !== 'paid';
  };

  if (loading && orders.length === 0) {
    return (
      <div className="my-orders-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando seus pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Meus Pedidos</h1>
          <p>Gerencie e rastreie todos os seus pedidos em um só lugar</p>
        </div>

        {/* Resumo de pedidos */}
        {ordersSummary && (
          <div className="orders-summary">
            <div className="summary-card">
              <h3>Total de Pedidos</h3>
              <p className="summary-number">{ordersSummary.total_orders}</p>
            </div>
            <div className="summary-card">
              <h3>Total Gasto</h3>
              <p className="summary-number">R$ {ordersSummary.total_spent.toFixed(2)}</p>
            </div>
            <div className="summary-card">
              <h3>Por Status</h3>
              <div className="status-breakdown">
                {Object.entries(ordersSummary.orders_by_status).map(([status, count]) => (
                  <div key={status} className="status-item">
                    {getStatusBadge(status)} <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="orders-filters">
          <div className="filter-group">
            <label htmlFor="statusFilter">Filtrar por status:</label>
            <select
              id="statusFilter"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="confirmed">Confirmado</option>
              <option value="processing">Processando</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Lista de pedidos */}
        <div className="orders-list">
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>Você ainda não tem pedidos</h3>
              <p>Quando fizer sua primeira compra, aparecerá aqui.</p>
              <Link to="/" className="btn btn-primary">
                Explorar Produtos
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-number">
                    <h3>#{order.order_number}</h3>
                    <p className="order-date">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="order-status">
                    {getStatusBadge(order.status)}
                    {getPaymentStatusBadge(order.payment_status)}
                  </div>
                </div>

                <div className="order-body">
                  <div className="order-items">
                    <p className="items-count">
                      {order.items_count} {order.items_count === 1 ? 'produto' : 'produtos'}
                    </p>
                    
                    {/* Mostrar alguns produtos */}
                    {order.order_items && order.order_items.slice(0, 3).map((item) => (
                      <div key={item.id} className="order-item-preview">
                        {item.product_image && (
                          <img 
                            src={item.product_image} 
                            alt={item.product_title}
                            className="item-image"
                          />
                        )}
                        <div className="item-info">
                          <p className="item-title">{item.product_title}</p>
                          <p className="item-quantity">Quantidade: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    
                    {order.order_items && order.order_items.length > 3 && (
                      <p className="more-items">
                        +{order.order_items.length - 3} produtos a mais
                      </p>
                    )}
                  </div>

                  <div className="order-total">
                    <p className="total-amount">R$ {order.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="order-actions">
                  <Link 
                    to={`/orders/${order.order_number}`}
                    className="btn btn-primary"
                  >
                    Ver Detalhes
                  </Link>
                  
                  {order.status === 'shipped' && (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => navigate(`/orders/${order.id}/tracking`)}
                    >
                      Rastrear
                    </button>
                  )}
                  
                  {canCancelOrder(order) && (
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancelar
                    </button>
                  )}
                  
                  {order.status === 'delivered' && (
                    <button 
                      className="btn btn-outline"
                      onClick={() => {
                        // Funcionalidade para refazer pedido
                        showSuccess('Funcionalidade de refazer pedido em breve');
                      }}
                    >
                      Refazer Pedido
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="btn btn-secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Anterior
            </button>
            
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`btn ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button 
              className="btn btn-secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

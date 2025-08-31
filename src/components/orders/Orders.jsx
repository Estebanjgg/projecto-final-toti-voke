import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { ordersAPI } from '../../services/ordersAPI';
import { Link } from 'react-router-dom';
import './Orders.css';

// Componente Loading Spinner simple
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const { addAlert } = useAlert();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Cargar órdenes del usuario
  const loadOrders = async (page = 1) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await ordersAPI.getUserOrders(page, pagination.limit);
      
      setOrders(response.orders || []);
      setPagination({
        page: response.page || 1,
        limit: response.limit || 10,
        total: response.total || 0,
        totalPages: response.totalPages || 0
      });
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setError('Error al cargar el historial de pedidos');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de página
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    loadOrders(newPage);
  };

  // Efectos
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  // Renderizado condicional para usuarios no autenticados
  if (!isAuthenticated) {
    return (
      <div className="orders-container">
        <div className="auth-required">
          <div className="auth-message">
            <h2>Faça Login para Ver seus Pedidos</h2>
            <p>Para acessar seu histórico de pedidos, você precisa fazer login em sua conta.</p>
            <div className="auth-actions">
              <Link to="/login" className="btn btn-primary">
                Fazer Login
              </Link>
              <Link to="/register" className="btn btn-outline">
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      {/* Header */}
      <div className="orders-header">
        <div className="header-content">
          <h1>Meus Pedidos</h1>
          <p>Histórico completo de suas compras</p>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="orders-content">
        {loading && (
          <div className="loading-container">
            <LoadingSpinner />
            <p>Carregando pedidos...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
              <button 
                className="retry-btn"
                onClick={() => loadOrders()}
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>Você ainda não tem pedidos</h3>
            <p>Quando fizer sua primeira compra, aparecerá aqui.</p>
            <div className="empty-actions">
              <Link to="/" className="btn btn-primary">
                Explorar Produtos
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <>
            {/* Lista de pedidos */}
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Pedido #{order.id}</h3>
                      <p className="order-date">
                        {new Date(order.created_at).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="order-status">
                      <span className={`status-badge status-${order.status}`}>
                        {order.status === 'pending' && 'Pendente'}
                        {order.status === 'confirmed' && 'Confirmado'}
                        {order.status === 'preparing' && 'Preparando'}
                        {order.status === 'shipped' && 'Enviado'}
                        {order.status === 'delivered' && 'Entregue'}
                        {order.status === 'cancelled' && 'Cancelado'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="order-details">
                    <div className="order-amount">
                      <strong>Total: R$ {parseFloat(order.total_amount || 0).toFixed(2)}</strong>
                    </div>
                    
                    {order.items && order.items.length > 0 && (
                      <div className="order-items">
                        <h4>Itens ({order.items.length}):</h4>
                        <ul>
                          {order.items.slice(0, 3).map((item, index) => (
                            <li key={index}>
                              {item.quantity}x {item.product_name || item.name || 'Produto'}
                              {item.price && ` - R$ ${parseFloat(item.price).toFixed(2)}`}
                            </li>
                          ))}
                          {order.items.length > 3 && (
                            <li>... e {order.items.length - 3} produtos a mais</li>
                          )}
                        </ul>
                      </div>
                    )}
                    
                    {order.payment_method && (
                      <div className="payment-info">
                        <p><strong>Método de pagamento:</strong> {order.payment_method}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  ← Anterior
                </button>
                
                <div className="pagination-info">
                  <span>
                    Página {pagination.page} de {pagination.totalPages}
                  </span>
                  <span className="total-items">
                    ({pagination.total} pedidos no total)
                  </span>
                </div>
                
                <button
                  className="pagination-btn"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
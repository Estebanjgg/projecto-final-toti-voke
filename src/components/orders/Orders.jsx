import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../contexts/AuthContext';
import { ordersAPI } from '../../services/ordersAPI';
import OrderCard from './OrderCard';
import OrderFilters from './OrderFilters';
import OrderStats from './OrderStats';
import { Link } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Cargar órdenes del usuario
  const loadOrders = async (page = 1, newFilters = filters) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await ordersAPI.getUserOrders(
        page,
        pagination.limit,
        newFilters.status || null
      );
      
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

  // Cargar estadísticas de órdenes
  const loadStats = async () => {
    if (!isAuthenticated) return;
    
    try {
      const statsData = await ordersAPI.getOrderStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  // Buscar órdenes
  const searchOrders = async (term = searchTerm) => {
    if (!isAuthenticated || !term.trim()) {
      loadOrders(1, filters);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await ordersAPI.searchOrders(term, {
        ...filters,
        sortBy,
        sortOrder
      });
      
      setOrders(response.orders || []);
      setPagination({
        page: 1,
        limit: pagination.limit,
        total: response.total || 0,
        totalPages: Math.ceil((response.total || 0) / pagination.limit)
      });
    } catch (err) {
      console.error('Error al buscar órdenes:', err);
      setError('Error al buscar pedidos');
      addAlert('Error al buscar pedidos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en filtros
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    loadOrders(1, newFilters);
  };

  // Manejar cambio de página
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    if (searchTerm.trim()) {
      searchOrders(searchTerm);
    } else {
      loadOrders(newPage, filters);
    }
  };

  // Manejar cancelación de orden
  const handleCancelOrder = async (orderId, reason) => {
    try {
      await ordersAPI.cancelOrder(orderId, reason);
      addAlert('Pedido cancelado exitosamente', 'success');
      loadOrders(pagination.page, filters);
      loadStats();
    } catch (err) {
      console.error('Error al cancelar orden:', err);
      addAlert('Error al cancelar el pedido', 'error');
    }
  };

  // Manejar reorden
  const handleReorder = async (orderId, items) => {
    try {
      await ordersAPI.reorderItems(orderId, items);
      addAlert('Items agregados al carrito exitosamente', 'success');
    } catch (err) {
      console.error('Error al reordenar:', err);
      addAlert('Error al agregar items al carrito', 'error');
    }
  };

  // Efectos
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
      loadStats();
    }
  }, [isAuthenticated]);

  // Renderizado condicional para usuarios no autenticados
  if (!isAuthenticated) {
    return (
      <div className="orders-container">
        <div className="auth-required">
          <div className="auth-message">
            <h2>Inicia Sesión para Ver tus Pedidos</h2>
            <p>Para acceder a tu historial de pedidos, necesitas iniciar sesión en tu cuenta.</p>
            <div className="auth-actions">
              <Link to="/login" className="btn btn-primary">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-outline">
                Crear Cuenta
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
          <h1>Mis Pedidos</h1>
          <p>Gestiona y rastrea todos tus pedidos</p>
        </div>
      </div>

      {/* Estadísticas */}
      {stats && <OrderStats stats={stats} />}

      {/* Barra de búsqueda y filtros */}
      <div className="orders-controls">
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por número de pedido, producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchOrders()}
            />
            <button 
              className="search-btn"
              onClick={() => searchOrders()}
            >
              🔍
            </button>
          </div>
          
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => {
                setSearchTerm('');
                loadOrders(1, filters);
              }}
            >
              Limpiar búsqueda
            </button>
          )}
        </div>

        <OrderFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortBy(field);
            setSortOrder(order);
            loadOrders(pagination.page, filters);
          }}
        />
        
        {stats && <OrderStats stats={stats} />}
      </div>

      {/* Contenido principal */}
      <div className="orders-content">
        {loading && (
          <div className="loading-container">
            <LoadingSpinner />
            <p>Cargando pedidos...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
              <button 
                className="retry-btn"
                onClick={() => loadOrders(pagination.page, filters)}
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No tienes pedidos aún</h3>
            <p>
              {searchTerm || Object.values(filters).some(f => f) 
                ? 'No se encontraron pedidos con los criterios de búsqueda.'
                : 'Cuando realices tu primera compra, aparecerá aquí.'
              }
            </p>
            <div className="empty-actions">
              {searchTerm || Object.values(filters).some(f => f) ? (
                <button 
                  className="btn btn-outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({
                      status: '',
                      dateFrom: '',
                      dateTo: '',
                      minAmount: '',
                      maxAmount: ''
                    });
                    loadOrders(1);
                  }}
                >
                  Limpiar filtros
                </button>
              ) : (
                <Link to="/" className="btn btn-primary">
                  Explorar Productos
                </Link>
              )}
            </div>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <>
            {/* Lista de órdenes */}
            <div className="orders-list">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onCancel={handleCancelOrder}
                  onReorder={handleReorder}
                />
              ))}
            </div>

            {/* Paginación */}
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
                    ({pagination.total} pedidos en total)
                  </span>
                </div>
                
                <button
                  className="pagination-btn"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Siguiente →
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
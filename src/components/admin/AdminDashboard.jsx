import React, { useState, useEffect, useContext } from 'react';
import AlertContext from '../../contexts/AlertContext';
import adminAPI from '../../services/adminAPI';

const AdminDashboard = () => {
  const { addAlert } = useContext(AlertContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardData();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
      addAlert('Error cargando datos del dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('pt-BR').format(number);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="admin-error">
        <p>Error cargando datos del dashboard</p>
        <button onClick={loadDashboardData} className="btn btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  const { orders, users, products } = dashboardData;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard de Administración</h1>
        <p>Resumen general de la tienda</p>
      </div>

      {/* Métricas principales */}
      <div className="dashboard-metrics">
        <div className="metric-card">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <h3>{formatNumber(orders.totalOrders)}</h3>
            <p>Total de Órdenes</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>{formatCurrency(orders.totalRevenue)}</h3>
            <p>Ingresos Totales</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>{formatNumber(users.total)}</h3>
            <p>Total de Usuarios</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🛍️</div>
          <div className="metric-content">
            <h3>{formatNumber(products.total)}</h3>
            <p>Total de Productos</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Estadísticas de órdenes */}
        <div className="dashboard-card">
          <h3>Estado de Órdenes</h3>
          <div className="stats-list">
            {Object.entries(orders.ordersByStatus || {}).map(([status, count]) => (
              <div key={status} className="stat-item">
                <span className={`status-badge status-${status}`}>
                  {status === 'pending' && 'Pendiente'}
                  {status === 'confirmed' && 'Confirmada'}
                  {status === 'processing' && 'Procesando'}
                  {status === 'shipped' && 'Enviada'}
                  {status === 'delivered' && 'Entregada'}
                  {status === 'cancelled' && 'Cancelada'}
                </span>
                <span className="stat-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas de pagos */}
        <div className="dashboard-card">
          <h3>Estado de Pagos</h3>
          <div className="stats-list">
            {Object.entries(orders.ordersByPaymentStatus || {}).map(([status, count]) => (
              <div key={status} className="stat-item">
                <span className={`payment-badge payment-${status}`}>
                  {status === 'pending' && 'Pendiente'}
                  {status === 'paid' && 'Pagado'}
                  {status === 'failed' && 'Fallido'}
                  {status === 'refunded' && 'Reembolsado'}
                </span>
                <span className="stat-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas de usuarios */}
        <div className="dashboard-card">
          <h3>Usuarios</h3>
          <div className="stats-grid">
            <div className="stat-box">
              <h4>{formatNumber(users.new_this_month)}</h4>
              <p>Nuevos este mes</p>
            </div>
            <div className="stat-box">
              <h4>{formatNumber(users.active)}</h4>
              <p>Usuarios activos</p>
            </div>
          </div>
          
          <div className="stats-list">
            <h4>Por Rol:</h4>
            {Object.entries(users.by_role || {}).map(([role, count]) => (
              <div key={role} className="stat-item">
                <span className={`role-badge role-${role}`}>
                  {role === 'user' && 'Usuario'}
                  {role === 'admin' && 'Administrador'}
                  {role === 'moderator' && 'Moderador'}
                </span>
                <span className="stat-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas de productos */}
        <div className="dashboard-card">
          <h3>Productos</h3>
          <div className="stats-grid">
            <div className="stat-box">
              <h4>{formatNumber(products.active)}</h4>
              <p>Productos activos</p>
            </div>
            <div className="stat-box">
              <h4>{formatNumber(products.out_of_stock)}</h4>
              <p>Sin stock</p>
            </div>
            <div className="stat-box">
              <h4>{formatNumber(products.low_stock)}</h4>
              <p>Stock bajo</p>
            </div>
          </div>
          
          <div className="stats-list">
            <h4>Por Categoría:</h4>
            {Object.entries(products.by_category || {}).slice(0, 5).map(([category, count]) => (
              <div key={category} className="stat-item">
                <span className="category-name">{category}</span>
                <span className="stat-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Métricas adicionales */}
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Valor Promedio de Orden</h3>
          <p className="summary-value">{formatCurrency(orders.averageOrderValue || 0)}</p>
        </div>
        
        <div className="summary-card">
          <h3>Productos con Stock Bajo</h3>
          <p className="summary-value warning">{products.low_stock}</p>
          <small>Requieren atención</small>
        </div>
        
        <div className="summary-card">
          <h3>Productos sin Stock</h3>
          <p className="summary-value danger">{products.out_of_stock}</p>
          <small>Necesitan reposición</small>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
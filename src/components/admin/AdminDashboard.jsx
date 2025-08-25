import React, { useState, useEffect, useContext } from 'react';
import AlertContext from '../../contexts/AlertContext';
import adminAPI from '../../services/adminAPI';
import './AdminDashboard.css';

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
        <div className="header-content">
          <h2 className="dashboard-title">
            <i className="fas fa-chart-line"></i>
            Dashboard de Administración
          </h2>
          <div className="period-selector">
            <label htmlFor="period">Período:</label>
            <select
              id="period"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-select"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="1y">Último año</option>
            </select>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="metrics-grid">
        <div className="metric-card orders">
          <div className="metric-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="metric-content">
            <h3>Órdenes Totales</h3>
            <p className="metric-value">{formatNumber(orders.totalOrders)}</p>
            <span className="metric-label">Pedidos procesados</span>
          </div>
        </div>
        <div className="metric-card revenue">
          <div className="metric-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="metric-content">
            <h3>Ingresos Totales</h3>
            <p className="metric-value">{formatCurrency(orders.totalRevenue)}</p>
            <span className="metric-label">Facturación total</span>
          </div>
        </div>
        <div className="metric-card users">
          <div className="metric-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="metric-content">
            <h3>Usuarios Totales</h3>
            <p className="metric-value">{formatNumber(users.total)}</p>
            <span className="metric-label">Clientes registrados</span>
          </div>
        </div>
        <div className="metric-card products">
          <div className="metric-icon">
            <i className="fas fa-box"></i>
          </div>
          <div className="metric-content">
            <h3>Productos Totales</h3>
            <p className="metric-value">{formatNumber(products.total)}</p>
            <span className="metric-label">Artículos en catálogo</span>
          </div>
        </div>
      </div>

      {/* Estadísticas detalladas */}
      <div className="dashboard-sections">
        {/* Sección de Órdenes */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3><i className="fas fa-chart-bar"></i> Estado de Órdenes</h3>
          </div>
          <div className="stats-grid">
            <div className="stat-card pending">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.ordersByStatus?.pending || 0}</span>
                <span className="stat-label">Pendientes</span>
              </div>
            </div>
            <div className="stat-card processing">
              <div className="stat-icon">
                <i className="fas fa-cog"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.ordersByStatus?.processing || 0}</span>
                <span className="stat-label">Procesando</span>
              </div>
            </div>
            <div className="stat-card shipped">
              <div className="stat-icon">
                <i className="fas fa-truck"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.ordersByStatus?.shipped || 0}</span>
                <span className="stat-label">Enviadas</span>
              </div>
            </div>
            <div className="stat-card delivered">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.ordersByStatus?.delivered || 0}</span>
                <span className="stat-label">Entregadas</span>
              </div>
            </div>
            <div className="stat-card cancelled">
              <div className="stat-icon">
                <i className="fas fa-times-circle"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.ordersByStatus?.cancelled || 0}</span>
                <span className="stat-label">Canceladas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Pagos */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3><i className="fas fa-credit-card"></i> Estado de Pagos</h3>
          </div>
          <div className="stats-grid">
            <div className="stat-card payment-pending">
              <div className="stat-icon">
                <i className="fas fa-hourglass-half"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.ordersByPaymentStatus?.pending || 0}</span>
                <span className="stat-label">Pendientes</span>
              </div>
            </div>
            <div className="stat-card payment-paid">
              <div className="stat-icon">
                <i className="fas fa-check"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.ordersByPaymentStatus?.paid || 0}</span>
                <span className="stat-label">Pagados</span>
              </div>
            </div>
            <div className="stat-card payment-failed">
              <div className="stat-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.ordersByPaymentStatus?.failed || 0}</span>
                <span className="stat-label">Fallidos</span>
              </div>
            </div>
            <div className="stat-card payment-refunded">
              <div className="stat-icon">
                <i className="fas fa-undo"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.ordersByPaymentStatus?.refunded || 0}</span>
                <span className="stat-label">Reembolsados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Usuarios */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3><i className="fas fa-users"></i> Estadísticas de Usuarios</h3>
          </div>
          <div className="stats-grid">
            <div className="stat-card users-new">
              <div className="stat-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{formatNumber(users.new_this_month)}</span>
                <span className="stat-label">Nuevos este mes</span>
              </div>
            </div>
            <div className="stat-card users-active">
              <div className="stat-icon">
                <i className="fas fa-user-check"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{formatNumber(users.active)}</span>
                <span className="stat-label">Usuarios activos</span>
              </div>
            </div>
            <div className="stat-card users-admin">
              <div className="stat-icon">
                <i className="fas fa-user-shield"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{users.by_role?.admin || 0}</span>
                <span className="stat-label">Administradores</span>
              </div>
            </div>
            <div className="stat-card users-regular">
              <div className="stat-icon">
                <i className="fas fa-user"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{users.by_role?.user || 0}</span>
                <span className="stat-label">Usuarios regulares</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Productos */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3><i className="fas fa-box"></i> Estadísticas de Productos</h3>
          </div>
          <div className="stats-grid">
            <div className="stat-card products-active">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{formatNumber(products.active)}</span>
                <span className="stat-label">Productos activos</span>
              </div>
            </div>
            <div className="stat-card products-out-stock">
              <div className="stat-icon">
                <i className="fas fa-exclamation-circle"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{formatNumber(products.out_of_stock)}</span>
                <span className="stat-label">Sin stock</span>
              </div>
            </div>
            <div className="stat-card products-low-stock">
              <div className="stat-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{formatNumber(products.low_stock)}</span>
                <span className="stat-label">Stock bajo</span>
              </div>
            </div>
          </div>
          
          <div className="category-stats">
            <h4><i className="fas fa-tags"></i> Top Categorías:</h4>
            <div className="category-list">
              {Object.entries(products.by_category || {}).slice(0, 5).map(([category, count]) => (
                <div key={category} className="category-item">
                  <span className="category-name">{category}</span>
                  <span className="category-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resumen ejecutivo */}
      <div className="executive-summary">
        <div className="summary-header">
          <h3><i className="fas fa-chart-pie"></i> Resumen Ejecutivo</h3>
        </div>
        <div className="summary-grid">
          <div className="summary-card revenue">
            <div className="summary-icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="summary-content">
              <h4>Valor Promedio de Orden</h4>
              <p className="summary-value">{formatCurrency(orders.averageOrderValue || 0)}</p>
              <span className="summary-trend">Por pedido</span>
            </div>
          </div>
          
          <div className="summary-card warning">
            <div className="summary-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="summary-content">
              <h4>Productos con Stock Bajo</h4>
              <p className="summary-value">{products.low_stock}</p>
              <span className="summary-trend">Requieren atención</span>
            </div>
          </div>
          
          <div className="summary-card danger">
            <div className="summary-icon">
              <i className="fas fa-times-circle"></i>
            </div>
            <div className="summary-content">
              <h4>Productos sin Stock</h4>
              <p className="summary-value">{products.out_of_stock}</p>
              <span className="summary-trend">Necesitan reposición urgente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
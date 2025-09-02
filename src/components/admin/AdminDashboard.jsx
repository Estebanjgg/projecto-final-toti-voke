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
      setDashboardData(response.data || response);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      addAlert('Erro carregando dados do dashboard', 'error');
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
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="admin-error">
        <p>Erro carregando dados do dashboard</p>
        <button onClick={loadDashboardData} className="btn btn-primary">
          Tentar novamente
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
            Dashboard de Administração
          </h2>
          <div className="period-selector">
            <label htmlFor="period">Período:</label>
            <select
              id="period"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-select"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Último ano</option>
            </select>
          </div>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="metrics-grid">
        <div className="metric-card orders">
          <div className="metric-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="metric-content">
            <h3 className="metric-title">Pedidos Totais</h3>
            <p className="metric-value">{formatNumber(orders.total_orders || 0)}</p>
            <span className="metric-label">Pedidos processados</span>
          </div>
        </div>
        
        <div className="metric-card revenue">
          <div className="metric-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="metric-content">
            <h3 className="metric-title">Receita Total</h3>
            <p className="metric-value">{formatCurrency(orders.total_revenue || 0)}</p>
            <span className="metric-label">Faturamento total</span>
          </div>
        </div>
        
        <div className="metric-card users">
          <div className="metric-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="metric-content">
            <h3 className="metric-title">Usuários Totais</h3>
            <p className="metric-value">{formatNumber(users.total || 0)}</p>
            <span className="metric-label">Clientes registrados</span>
          </div>
        </div>
        
        <div className="metric-card products">
          <div className="metric-icon">
            <i className="fas fa-box"></i>
          </div>
          <div className="metric-content">
            <h3 className="metric-title">Produtos Totais</h3>
            <p className="metric-value">{formatNumber(products.total || 0)}</p>
            <span className="metric-label">Artigos no catálogo</span>
          </div>
        </div>
      </div>

      {/* Estadísticas detalladas */}
      <div className="dashboard-sections">
        {/* Seção de Pedidos */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3><i className="fas fa-chart-bar"></i> Status dos Pedidos</h3>
          </div>
          <div className="stats-grid">
            <div className="stat-card pending">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.orders_by_status?.pending || 0}</span>
                <span className="stat-label">Pendentes</span>
              </div>
            </div>
            <div className="stat-card processing">
              <div className="stat-icon">
                <i className="fas fa-cog"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.orders_by_status?.processing || 0}</span>
                <span className="stat-label">Processando</span>
              </div>
            </div>
            <div className="stat-card shipped">
              <div className="stat-icon">
                <i className="fas fa-truck"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.orders_by_status?.shipped || 0}</span>
                <span className="stat-label">Enviados</span>
              </div>
            </div>
            <div className="stat-card delivered">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.orders_by_status?.delivered || 0}</span>
                <span className="stat-label">Entregues</span>
              </div>
            </div>
            <div className="stat-card cancelled">
              <div className="stat-icon">
                <i className="fas fa-times-circle"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.orders_by_status?.cancelled || 0}</span>
                <span className="stat-label">Cancelados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Pagamentos */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3><i className="fas fa-credit-card"></i> Status dos Pagamentos</h3>
          </div>
          <div className="stats-grid">
            <div className="stat-card payment-pending">
              <div className="stat-icon">
                <i className="fas fa-hourglass-half"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.orders_by_payment_status?.pending || 0}</span>
                <span className="stat-label">Pendentes</span>
              </div>
            </div>
            <div className="stat-card payment-paid">
              <div className="stat-icon">
                <i className="fas fa-check"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.orders_by_payment_status?.paid || 0}</span>
                <span className="stat-label">Pagos</span>
              </div>
            </div>
            <div className="stat-card payment-failed">
              <div className="stat-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.orders_by_payment_status?.failed || 0}</span>
                <span className="stat-label">Falharam</span>
              </div>
            </div>
            <div className="stat-card payment-refunded">
              <div className="stat-icon">
                <i className="fas fa-undo"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{orders.orders_by_payment_status?.refunded || 0}</span>
                <span className="stat-label">Reembolsados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Usuários */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3><i className="fas fa-users"></i> Estatísticas de Usuários</h3>
          </div>
          <div className="stats-grid">
            <div className="stat-card users-new">
              <div className="stat-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{formatNumber(users.new_this_month || 0)}</span>
                <span className="stat-label">Novos este mês</span>
              </div>
            </div>
            <div className="stat-card users-active">
              <div className="stat-icon">
                <i className="fas fa-user-check"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{formatNumber(users.active || 0)}</span>
                <span className="stat-label">Usuários ativos</span>
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
                <span className="stat-label">Usuários regulares</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Produtos */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3><i className="fas fa-box"></i> Estatísticas de Produtos</h3>
          </div>
          <div className="stats-grid">
            <div className="stat-card products-active">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{formatNumber(products.active || 0)}</span>
                <span className="stat-label">Produtos ativos</span>
              </div>
            </div>
            <div className="stat-card products-out-stock">
              <div className="stat-icon">
                <i className="fas fa-exclamation-circle"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{formatNumber(products.out_of_stock || 0)}</span>
                <span className="stat-label">Sem estoque</span>
              </div>
            </div>
            <div className="stat-card products-low-stock">
              <div className="stat-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{formatNumber(products.low_stock || 0)}</span>
                <span className="stat-label">Estoque baixo</span>
              </div>
            </div>
          </div>
          
          <div className="category-stats">
            <h4><i className="fas fa-tags"></i> Top Categorias:</h4>
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

      {/* Resumo executivo */}
      <div className="executive-summary">
        <div className="summary-header">
          <h3><i className="fas fa-chart-pie"></i> Resumo Executivo</h3>
        </div>
        <div className="summary-grid">
          <div className="summary-card revenue">
            <div className="summary-icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="summary-content">
              <h4>Valor Médio do Pedido</h4>
              <p className="summary-value">{formatCurrency(orders.average_order_value || 0)}</p>
              <span className="summary-trend">Por pedido</span>
            </div>
          </div>
          
          <div className="summary-card warning">
            <div className="summary-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="summary-content">
              <h4>Produtos com Estoque Baixo</h4>
              <p className="summary-value">{products.low_stock || 0}</p>
              <span className="summary-trend">Requerem atenção</span>
            </div>
          </div>
          
          <div className="summary-card danger">
            <div className="summary-icon">
              <i className="fas fa-times-circle"></i>
            </div>
            <div className="summary-content">
              <h4>Produtos sem Estoque</h4>
              <p className="summary-value">{products.out_of_stock || 0}</p>
              <span className="summary-trend">Necessitam reposição urgente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
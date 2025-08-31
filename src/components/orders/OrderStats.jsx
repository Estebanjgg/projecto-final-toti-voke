import React from 'react';

const OrderStats = ({ stats }) => {
  if (!stats) return null;

  // Formatar números grandes
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Formatar moeda
  const formatCurrency = (amount) => {
    return `R$ ${amount.toFixed(2)}`;
  };

  // Calcular porcentagem de pedidos completados
  const completionRate = stats.totalOrders > 0 
    ? ((stats.deliveredOrders || 0) / stats.totalOrders * 100).toFixed(1)
    : 0;

  // Calcular ticket médio
  const averageTicket = stats.totalOrders > 0 
    ? (stats.totalSpent || 0) / stats.totalOrders
    : 0;

  return (
    <div className="order-stats">
      <div className="stats-header">
        <h3>Resumo de Pedidos</h3>
        <p>Estatísticas do seu histórico de compras</p>
      </div>
      
      <div className="stats-grid">
        {/* Total de pedidos */}
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{formatNumber(stats.totalOrders || 0)}</div>
            <div className="stat-label">Total de Pedidos</div>
          </div>
        </div>

        {/* Total gasto */}
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.totalSpent || 0)}</div>
            <div className="stat-label">Total Gasto</div>
          </div>
        </div>

        {/* Ticket médio */}
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(averageTicket)}</div>
            <div className="stat-label">Ticket Médio</div>
          </div>
        </div>

        {/* Taxa de finalização */}
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{completionRate}%</div>
            <div className="stat-label">Pedidos Entregues</div>
          </div>
        </div>
      </div>

      {/* Estatísticas detalhadas por status */}
      <div className="detailed-stats">
        <h4>Distribuição por Status</h4>
        <div className="status-stats">
          {stats.ordersByStatus && Object.entries(stats.ordersByStatus).map(([status, count]) => {
            const statusLabels = {
              'pending': 'Pendentes',
              'confirmed': 'Confirmados',
              'processing': 'Processando',
              'shipped': 'Enviados',
              'delivered': 'Entregues',
              'cancelled': 'Cancelados'
            };
            
            const statusColors = {
              'pending': '#f39c12',
              'confirmed': '#27ae60',
              'processing': '#3498db',
              'shipped': '#9b59b6',
              'delivered': '#2ecc71',
              'cancelled': '#e74c3c'
            };
            
            const percentage = stats.totalOrders > 0 
              ? (count / stats.totalOrders * 100).toFixed(1)
              : 0;

            return (
              <div key={status} className="status-stat">
                <div className="status-info">
                  <div 
                    className="status-indicator"
                    style={{ backgroundColor: statusColors[status] }}
                  ></div>
                  <span className="status-label">{statusLabels[status] || status}</span>
                </div>
                <div className="status-values">
                  <span className="status-count">{count}</span>
                  <span className="status-percentage">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estatísticas adicionais */}
      {(stats.favoriteCategory || stats.lastOrderDate || stats.averageDeliveryTime) && (
        <div className="additional-stats">
          <h4>Informações Adicionais</h4>
          <div className="additional-stats-grid">
            {stats.favoriteCategory && (
              <div className="additional-stat">
                <span className="stat-icon">🏷️</span>
                <div className="stat-info">
                  <div className="stat-label">Categoria Favorita</div>
                  <div className="stat-value">{stats.favoriteCategory}</div>
                </div>
              </div>
            )}
            
            {stats.lastOrderDate && (
              <div className="additional-stat">
                <span className="stat-icon">📅</span>
                <div className="stat-info">
                  <div className="stat-label">Último Pedido</div>
                  <div className="stat-value">
                    {new Date(stats.lastOrderDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            )}
            
            {stats.averageDeliveryTime && (
              <div className="additional-stat">
                <span className="stat-icon">🚚</span>
                <div className="stat-info">
                  <div className="stat-label">Tempo Médio de Entrega</div>
                  <div className="stat-value">{stats.averageDeliveryTime} dias</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progresso para benefícios */}
      {stats.loyaltyPoints !== undefined && (
        <div className="loyalty-progress">
          <h4>Programa de Fidelidade</h4>
          <div className="loyalty-info">
            <div className="points-info">
              <span className="points-icon">⭐</span>
              <span className="points-text">
                Você tem <strong>{stats.loyaltyPoints}</strong> pontos de fidelidade
              </span>
            </div>
            
            {stats.nextRewardThreshold && (
              <div className="next-reward">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{
                      width: `${Math.min((stats.loyaltyPoints / stats.nextRewardThreshold) * 100, 100)}%`
                    }}
                  ></div>
                </div>
                <p className="progress-text">
                  {stats.nextRewardThreshold - stats.loyaltyPoints > 0 
                    ? `${stats.nextRewardThreshold - stats.loyaltyPoints} pontos para sua próxima recompensa`
                    : 'Parabéns! Você alcançou o próximo nível'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStats;
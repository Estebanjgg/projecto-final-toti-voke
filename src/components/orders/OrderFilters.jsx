import React, { useState } from 'react';

const OrderFilters = ({ filters, onFilterChange, sortBy, sortOrder, onSortChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  // Opções de status
  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'pending', label: 'Pendente' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'processing', label: 'Processando' },
    { value: 'shipped', label: 'Enviado' },
    { value: 'delivered', label: 'Entregue' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  // Opções de ordenação
  const sortOptions = [
    { value: 'created_at', label: 'Data do pedido' },
    { value: 'total', label: 'Valor total' },
    { value: 'status', label: 'Status' },
    { value: 'order_number', label: 'Número do pedido' }
  ];

  // Gerenciar mudanças em filtros temporários
  const handleTempFilterChange = (field, value) => {
    setTempFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Aplicar filtros
  const applyFilters = () => {
    onFilterChange(tempFilters);
    setShowFilters(false);
  };

  // Limpar filtros
  const clearFilters = () => {
    const emptyFilters = {
      status: '',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: ''
    };
    setTempFilters(emptyFilters);
    onFilterChange(emptyFilters);
    setShowFilters(false);
  };

  // Cancelar mudanças
  const cancelChanges = () => {
    setTempFilters(filters);
    setShowFilters(false);
  };

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  // Formatear fecha para input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="order-filters">
      {/* Controles principales */}
      <div className="filters-controls">
        {/* Botón de filtros */}
        <button 
          className={`filters-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <span className="filter-icon">🔽</span>
          Filtros
          {activeFiltersCount > 0 && (
            <span className="filter-count">{activeFiltersCount}</span>
          )}
        </button>

        {/* Selector de ordenamiento */}
        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value, sortOrder)}
            className="sort-select"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <button
            className={`sort-order ${sortOrder === 'desc' ? 'desc' : 'asc'}`}
            onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'asc' ? 'Ordem crescente' : 'Ordem decrescente'}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* Limpar filtros ativos */}
        {activeFiltersCount > 0 && (
          <button 
            className="clear-filters"
            onClick={clearFilters}
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Panel de filtros expandible */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            {/* Filtro por status */}
            <div className="filter-group">
              <label htmlFor="statusFilter">Status do Pedido</label>
              <select
                id="statusFilter"
                value={tempFilters.status}
                onChange={(e) => handleTempFilterChange('status', e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por faixa de datas */}
            <div className="filter-group">
              <label htmlFor="dateFromFilter">Data De</label>
              <input
                type="date"
                id="dateFromFilter"
                value={formatDateForInput(tempFilters.dateFrom)}
                onChange={(e) => handleTempFilterChange('dateFrom', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="dateToFilter">Data Até</label>
              <input
                type="date"
                id="dateToFilter"
                value={formatDateForInput(tempFilters.dateTo)}
                onChange={(e) => handleTempFilterChange('dateTo', e.target.value)}
              />
            </div>

            {/* Filtro por faixa de valores */}
            <div className="filter-group">
              <label htmlFor="minAmountFilter">Valor Mínimo (R$)</label>
              <input
                type="number"
                id="minAmountFilter"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={tempFilters.minAmount}
                onChange={(e) => handleTempFilterChange('minAmount', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="maxAmountFilter">Valor Máximo (R$)</label>
              <input
                type="number"
                id="maxAmountFilter"
                placeholder="999999.99"
                min="0"
                step="0.01"
                value={tempFilters.maxAmount}
                onChange={(e) => handleTempFilterChange('maxAmount', e.target.value)}
              />
            </div>
          </div>

          {/* Ações do painel de filtros */}
          <div className="filters-actions">
            <button 
              className="btn btn-outline"
              onClick={cancelChanges}
            >
              Cancelar
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={clearFilters}
            >
              Limpar Tudo
            </button>
            
            <button 
              className="btn btn-primary"
              onClick={applyFilters}
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Filtros ativos (chips) */}
      {activeFiltersCount > 0 && (
        <div className="active-filters">
          <span className="active-filters-label">Filtros ativos:</span>
          
          {filters.status && (
            <div className="filter-chip">
              <span>Status: {statusOptions.find(opt => opt.value === filters.status)?.label}</span>
              <button 
                onClick={() => onFilterChange({ ...filters, status: '' })}
                className="remove-filter"
              >
                ×
              </button>
            </div>
          )}
          
          {filters.dateFrom && (
            <div className="filter-chip">
              <span>De: {new Date(filters.dateFrom).toLocaleDateString('pt-BR')}</span>
              <button 
                onClick={() => onFilterChange({ ...filters, dateFrom: '' })}
                className="remove-filter"
              >
                ×
              </button>
            </div>
          )}
          
          {filters.dateTo && (
            <div className="filter-chip">
              <span>Até: {new Date(filters.dateTo).toLocaleDateString('pt-BR')}</span>
              <button 
                onClick={() => onFilterChange({ ...filters, dateTo: '' })}
                className="remove-filter"
              >
                ×
              </button>
            </div>
          )}
          
          {filters.minAmount && (
            <div className="filter-chip">
              <span>Mín: R$ {parseFloat(filters.minAmount).toFixed(2)}</span>
              <button 
                onClick={() => onFilterChange({ ...filters, minAmount: '' })}
                className="remove-filter"
              >
                ×
              </button>
            </div>
          )}
          
          {filters.maxAmount && (
            <div className="filter-chip">
              <span>Máx: R$ {parseFloat(filters.maxAmount).toFixed(2)}</span>
              <button 
                onClick={() => onFilterChange({ ...filters, maxAmount: '' })}
                className="remove-filter"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderFilters;
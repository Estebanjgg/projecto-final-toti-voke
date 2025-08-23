import React from 'react';
import './SidebarFilters.css';

const SidebarFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const handlePriceChange = (priceRange) => {
    onFilterChange('priceRange', priceRange);
  };

  const handleConditionChange = (condition) => {
    onFilterChange('condition', condition);
  };

  const handleTypeChange = (type) => {
    onFilterChange('type', type);
  };

  return (
    <div className="sidebar-filters">
      <div className="filters-header">
        <h3>Filtrar por:</h3>
      </div>

      {/* Filtro de Preço */}
      <div className="filter-section">
        <h4>Preço</h4>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="price"
              value="0-500"
              checked={filters.priceRange === '0-500'}
              onChange={(e) => handlePriceChange(e.target.value)}
            />
            <span className="radio-custom"></span>
            Até R$ 500
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="price"
              value="500-1000"
              checked={filters.priceRange === '500-1000'}
              onChange={(e) => handlePriceChange(e.target.value)}
            />
            <span className="radio-custom"></span>
            R$ 500 - R$ 1000
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="price"
              value="1000-2000"
              checked={filters.priceRange === '1000-2000'}
              onChange={(e) => handlePriceChange(e.target.value)}
            />
            <span className="radio-custom"></span>
            R$ 1000 - R$ 2000
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="price"
              value="2000"
              checked={filters.priceRange === '2000'}
              onChange={(e) => handlePriceChange(e.target.value)}
            />
            <span className="radio-custom"></span>
            Acima de R$ 2000
          </label>
        </div>
      </div>

      {/* Filtro de Condição */}
      <div className="filter-section">
        <h4>Condição</h4>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.condition === 'Novo'}
              onChange={(e) => handleConditionChange(e.target.checked ? 'Novo' : '')}
            />
            <span className="checkbox-custom"></span>
            Bom
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.condition === 'Seminovo'}
              onChange={(e) => handleConditionChange(e.target.checked ? 'Seminovo' : '')}
            />
            <span className="checkbox-custom"></span>
            Excelente
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.condition === 'Usado'}
              onChange={(e) => handleConditionChange(e.target.checked ? 'Usado' : '')}
            />
            <span className="checkbox-custom"></span>
            Muito Bom
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.condition === 'Muito bom'}
              onChange={(e) => handleConditionChange(e.target.checked ? 'Muito bom' : '')}
            />
            <span className="checkbox-custom"></span>
            Muito bom
          </label>
        </div>
      </div>

      {/* Filtro de Tipo */}
      <div className="filter-section">
        <h4>Tipo</h4>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="type"
              value="Samsung"
              checked={filters.type === 'Samsung'}
              onChange={(e) => handleTypeChange(e.target.value)}
            />
            <span className="radio-custom"></span>
            Loja Samsung
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="type"
              value="Monitor"
              checked={filters.type === 'Monitor'}
              onChange={(e) => handleTypeChange(e.target.value)}
            />
            <span className="radio-custom"></span>
            Monitor
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="type"
              value="Smartphone"
              checked={filters.type === 'Smartphone'}
              onChange={(e) => handleTypeChange(e.target.value)}
            />
            <span className="radio-custom"></span>
            Smartphone
          </label>
        </div>
      </div>

      {/* Botão para limpar filtros */}
      <div className="filter-actions">
        <button className="clear-filters-btn" onClick={onClearFilters}>
          Limpar Filtros
        </button>
      </div>
    </div>
  );
};

export default SidebarFilters;
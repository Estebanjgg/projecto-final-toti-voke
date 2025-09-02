import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import SidebarFilters from './SidebarFilters';
import { productsAPI } from '../services/api';
import './CategoryProducts.css';

const LojaImperdivel = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    priceRange: '',
    condition: '',
    category: '',
    sortBy: 'discount' // Por defecto ordenar por desconto
  });

  useEffect(() => {
    loadOfferProducts();
    window.scrollTo(0, 0);
  }, []);
  
  // Aplicar filtros cuando cambien los productos o filtros
  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const applyFilters = () => {
    let filtered = [...products];
    
    // Filtro por rango de precio
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        const price = product.current_price || product.currentPrice || 0;
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min;
        }
      });
    }
    
    // Filtro por condición
    if (filters.condition) {
      filtered = filtered.filter(product => 
        product.condition === filters.condition
      );
    }
    
    // Filtro por categoría
    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category && product.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    
    // Ordenamiento
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.current_price || a.currentPrice || 0) - (b.current_price || b.currentPrice || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.current_price || b.currentPrice || 0) - (a.current_price || a.currentPrice || 0));
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'name':
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      default:
        // Por defecto ordenar por desconto
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }
    
    setFilteredProducts(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      priceRange: '',
      condition: '',
      category: '',
      sortBy: 'discount'
    });
  };

  const loadOfferProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar productos en oferta
      const response = await productsAPI.getAll({ 
        limit: 50,
        is_offer: true // Solo productos en oferta
      });
      
      // Filtrar productos que tengan descuento > 0
      const offerProducts = (response.data || []).filter(product => 
        product.discount && product.discount > 0
      );
      
      setProducts(offerProducts);
    } catch (err) {
      console.error('Error cargando ofertas imperdíveis:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <section className="category-products">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
          <span onClick={handleBackToHome} style={{ cursor: 'pointer', color: '#4A90E2' }}>
            Home
          </span>
          <span style={{ margin: '0 8px' }}>→</span>
          <span>Loja Imperdível</span>
        </nav>

        {/* Header da página */}
        <div className="page-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
            🔥 Loja Imperdível
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>
            As melhores ofertas e descontos que você não pode perder!
          </p>
        </div>

        {/* Banner de ofertas */}
        <div style={{ 
          background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>💥 OFERTAS RELÂMPAGO</h2>
          <p style={{ margin: '0', fontSize: '1rem' }}>Descontos de até 50% em produtos selecionados!</p>
        </div>

        {/* Layout com sidebar */}
        <div className="products-layout">
          {/* Sidebar de filtros */}
          <SidebarFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            showBrandFilter={true}
          />
          
          {/* Conteúdo principal */}
          <div className="products-content">
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Carregando ofertas imperdíveis...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <p>Erro ao carregar ofertas: {error}</p>
                <button onClick={loadOfferProducts}>Tentar novamente</button>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="empty-state">
                <p>Nenhuma oferta imperdível disponível no momento.</p>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <>
                <div className="products-count">
                  <p>
                    {filteredProducts.length} de {products.length} ofertas imperdíveis encontradas
                    {filters.priceRange || filters.condition || filters.category || filters.sortBy !== 'discount' ? ' (filtrados)' : ''}
                  </p>
                </div>
                
                {/* Ordenar por */}
                <div className="sort-section">
                  <label>Ordenar por:</label>
                  <select 
                    value={filters.sortBy} 
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="sort-select"
                  >
                    <option value="discount">Maior desconto</option>
                    <option value="price-low">Menor preço</option>
                    <option value="price-high">Maior preço</option>
                    <option value="name">Nome A-Z</option>
                  </select>
                </div>
                
                {filteredProducts.length === 0 ? (
                  <div className="no-results">
                    <p>Nenhuma oferta encontrada com os filtros selecionados.</p>
                    <button onClick={clearFilters}>Limpar filtros</button>
                  </div>
                ) : (
                  <div className="category-products-grid">
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product.id || index} product={product} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LojaImperdivel;
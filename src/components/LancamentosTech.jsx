import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import SidebarFilters from './SidebarFilters';
import { productsAPI } from '../services/api';
import './CategoryProducts.css';

const LancamentosTech = () => {
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
    sortBy: 'relevance'
  });

  useEffect(() => {
    loadTechProducts();
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
        // Relevancia (productos destacados primero)
        filtered.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return 0;
        });
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
      sortBy: 'relevance'
    });
  };

  const loadTechProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar productos de tecnología (Smartphones, Notebooks, Tablets, Desktops)
      const response = await productsAPI.getAll({ 
        limit: 50,
        is_featured: true // Solo productos destacados para lançamentos
      });
      
      // Filtrar solo categorías tech
      const techCategories = ['Smartphones', 'Notebooks', 'Tablets', 'Desktops', 'Monitores'];
      const techProducts = (response.data || []).filter(product => 
        techCategories.includes(product.category)
      );
      
      setProducts(techProducts);
    } catch (err) {
      console.error('Error cargando lançamentos tech:', err);
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
          <span>Lançamentos Tech</span>
        </nav>

        {/* Header da página */}
        <div className="page-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
            🚀 Lançamentos Tech
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>
            Os produtos mais inovadores e tecnológicos do momento
          </p>
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
                <p>Carregando lançamentos tech...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <p>Erro ao carregar produtos: {error}</p>
                <button onClick={loadTechProducts}>Tentar novamente</button>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="empty-state">
                <p>Nenhum lançamento tech encontrado no momento.</p>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <>
                <div className="products-count">
                  <p>
                    {filteredProducts.length} de {products.length} lançamentos tech encontrados
                    {filters.priceRange || filters.condition || filters.category || filters.sortBy !== 'relevance' ? ' (filtrados)' : ''}
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
                    <option value="relevance">Mais relevantes</option>
                    <option value="price-low">Menor preço</option>
                    <option value="price-high">Maior preço</option>
                    <option value="discount">Maior desconto</option>
                    <option value="name">Nome A-Z</option>
                  </select>
                </div>
                
                {filteredProducts.length === 0 ? (
                  <div className="no-results">
                    <p>Nenhum produto encontrado com os filtros selecionados.</p>
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

export default LancamentosTech;
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import SidebarFilters from './SidebarFilters';
import { productsAPI } from '../services/api';
import './CategoryProducts.css';

const CategoryProducts = ({ selectedCategory, onClose }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    priceRange: '',
    condition: '',
    type: '',
    sortBy: 'relevance'
  });

  const categoryNames = {
    'Smartphone': 'Smartphones 📱',
    'Tablet': 'Tablets 📱',
    'Notebook': 'Notebooks 💻',
    'Electrónicos': 'Eletrônicos 🖥️'
  };

  useEffect(() => {
    if (selectedCategory) {
      loadCategoryProducts();
    }
  }, [selectedCategory]);
  
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
    
    // Filtro por tipo/marca
    if (filters.type) {
      if (filters.type === 'Samsung') {
        filtered = filtered.filter(product => 
          product.brand && product.brand.toLowerCase().includes('samsung')
        );
      } else if (filters.type === 'Monitor') {
        filtered = filtered.filter(product => 
          product.category && product.category.toLowerCase().includes('monitor')
        );
      } else if (filters.type === 'Smartphone') {
        filtered = filtered.filter(product => 
          product.category && product.category.toLowerCase().includes('smartphone')
        );
      }
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
      type: '',
      sortBy: 'relevance'
    });
  };

  const loadCategoryProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsAPI.getAll({ 
        category: selectedCategory,
        limit: 20 
      });
      
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error cargando productos de categoría:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedCategory) {
    return null;
  }

  return (
    <section className="category-products">
      <div className="container">
        <div className="category-header">
          <h2 className="category-title">
            {categoryNames[selectedCategory] || selectedCategory}
          </h2>
          <button className="close-btn" onClick={onClose}>
            ✕ Voltar
          </button>
        </div>

        {/* Layout com sidebar */}
        <div className="products-layout">
          {/* Sidebar de filtros */}
          <SidebarFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
          
          {/* Conteúdo principal */}
          <div className="products-content">
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Carregando produtos...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <p>Erro ao carregar produtos: {error}</p>
                <button onClick={loadCategoryProducts}>Tentar novamente</button>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="empty-state">
                <p>Nenhum produto encontrado nesta categoria.</p>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <>
              <div className="products-count">
              <p>
                {filteredProducts.length} de {products.length} produtos encontrados
                {filters.priceRange || filters.condition || filters.sortBy !== 'relevance' ? ' (filtrados)' : ''}
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

export default CategoryProducts;
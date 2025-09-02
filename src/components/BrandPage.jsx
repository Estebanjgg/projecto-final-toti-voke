import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import SidebarFilters from './SidebarFilters';
import { productsAPI } from '../services/api';
import './CategoryProducts.css'; // Reutilizamos los estilos existentes

const BrandPage = () => {
  const { brand } = useParams();
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

  const brandNames = {
    'apple': 'Apple 🍎',
    'samsung': 'Samsung 📱',
    'sony': 'Sony 🎮',
    'dell': 'Dell 🖥️',
    'lenovo': 'Lenovo 💻',
    'microsoft': 'Microsoft 💻',
    'xiaomi': 'Xiaomi 📱',
    'motorola': 'Motorola 📱',
    'asus': 'Asus 💻',
    'hp': 'HP 🖥️',
    'lg': 'LG 📺',
    'huawei': 'Huawei 📱',
    'google': 'Google 🔍',
    'oneplus': 'OnePlus 📱',
    'nothing': 'Nothing 📱',
    'realme': 'Realme 📱',
    'oppo': 'Oppo 📱',
    'vivo': 'Vivo 📱',
    'nintendo': 'Nintendo 🎮',
    'canon': 'Canon 📷',
    'fujifilm': 'Fujifilm 📷',
    'bose': 'Bose 🎧',
    'steelseries': 'SteelSeries 🎮',
    'logitech': 'Logitech 🖱️'
  };

  // Mapeo de URL a marca de base de datos
  const brandMapping = {
    'apple': 'Apple',
    'samsung': 'Samsung',
    'sony': 'Sony',
    'dell': 'Dell',
    'lenovo': 'Lenovo',
    'microsoft': 'Microsoft',
    'xiaomi': 'Xiaomi',
    'motorola': 'Motorola',
    'asus': 'Asus',
    'hp': 'HP',
    'lg': 'LG',
    'huawei': 'Huawei',
    'google': 'Google',
    'oneplus': 'OnePlus',
    'nothing': 'Nothing',
    'realme': 'Realme',
    'oppo': 'Oppo',
    'vivo': 'Vivo',
    'nintendo': 'Nintendo',
    'canon': 'Canon',
    'fujifilm': 'Fujifilm',
    'bose': 'Bose',
    'steelseries': 'SteelSeries',
    'logitech': 'Logitech'
  };

  useEffect(() => {
    if (brand && brandMapping[brand]) {
      loadBrandProducts();
    }
    // Scroll al top cuando cambie la marca
    window.scrollTo(0, 0);
  }, [brand]);

  // Scroll al top cuando se monte el componente
  useEffect(() => {
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

  const loadBrandProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dbBrand = brandMapping[brand];
      const response = await productsAPI.getAll({ 
        brand: dbBrand,
        limit: 50 
      });
      
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error cargando productos de marca:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (!brand || !brandMapping[brand]) {
    return (
      <section className="category-products">
        <div className="container">
          {/* Breadcrumb para error */}
          <nav className="breadcrumb" style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
            <span onClick={handleBackToHome} style={{ cursor: 'pointer', color: '#4A90E2' }}>
              Home
            </span>
            <span style={{ margin: '0 8px' }}>→</span>
            <span>Marca não encontrada</span>
          </nav>

          <div className="category-header">
            <h2 className="category-title">❌ Marca no encontrada</h2>
          </div>
          <div className="error-state">
            <p>A marca "{brand}" não existe. Verifique a URL ou volte ao início.</p>
            <button onClick={handleBackToHome}>Voltar ao Home</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="category-products">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
          <span onClick={handleBackToHome} style={{ cursor: 'pointer', color: '#4A90E2' }}>
            Home
          </span>
          <span style={{ margin: '0 8px' }}>→</span>
          <span>Marcas</span>
          <span style={{ margin: '0 8px' }}>→</span>
          <span>{brandNames[brand] || brand}</span>
        </nav>



        {/* Imagen de propaganda de la marca */}
        <div className="brand-propaganda-section">
          <img 
            src={`/picture/imagen-proganda-lojas/${brandMapping[brand]} [Desktop]@2x.png`}
            alt={`Propaganda ${brandNames[brand]}`}
            className="brand-propaganda-image"
            onError={(e) => {
              console.warn(`Imagen no encontrada para ${brandMapping[brand]}`);
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Layout com sidebar */}
        <div className="products-layout">
          {/* Sidebar de filtros */}
          <SidebarFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            showBrandFilter={false} // No mostrar filtro de marca ya que estamos en una página de marca específica
          />
          
          {/* Conteúdo principal */}
          <div className="products-content">
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Carregando produtos da {brandNames[brand]}...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <p>Erro ao carregar produtos: {error}</p>
                <button onClick={loadBrandProducts}>Tentar novamente</button>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="empty-state">
                <p>Nenhum produto encontrado para a marca {brandNames[brand]}.</p>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <>
                <div className="products-count">
                  <p>
                    {filteredProducts.length} de {products.length} produtos {brandNames[brand]} encontrados
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

export default BrandPage;
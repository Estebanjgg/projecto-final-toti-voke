import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import CategorySection from './components/CategorySection';
import ProductSection from './components/ProductSection';
import CategoryProducts from './components/CategoryProducts';
import BrandStores from './components/BrandStores';
import Footer from './components/Footer';
import { productsAPI } from './services/api';
import './App.css';

function App() {
  // Estados para los productos
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para navegación por categorías
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Cargar productos al montar el componente
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // Cargar solo productos destacados (limitados para optimizar)
        const featuredResponse = await productsAPI.getFeatured(6);
        setFeaturedProducts(featuredResponse.data || []);
        
        // Cargar ofertas del día (limitadas)
        const offersResponse = await productsAPI.getOffers(6);
        setOfferProducts(offersResponse.data || []);
        
      } catch (err) {
        console.error('Error cargando productos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
  
  // Manejar selección de categoría
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  
  const handleCloseCategoryView = () => {
    setSelectedCategory(null);
  };

  // Mostrar loading o error si es necesario
  if (loading) {
    return (
      <div className="App">
        <Header />
        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Cargando productos...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <Header />
        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Error cargando productos: {error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </main>
        <Footer />
      </div>
    );
  }

  // Si hay una categoría seleccionada, mostrar solo esos productos
  if (selectedCategory) {
    return (
      <div className="App">
        <Header />
        <main>
          <CategoryProducts 
            selectedCategory={selectedCategory}
            onClose={handleCloseCategoryView}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main>
        <Banner />
        <CategorySection 
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />
        
        {/* Solo mostrar productos destacados en la página principal */}
        <ProductSection 
          title="⚡ Produtos em Destaque" 
          products={featuredProducts}
          backgroundColor="#4A90E2"
        />
        
        <BrandStores onCategorySelect={handleCategorySelect} />
        
        <ProductSection 
          title="🔥 Ofertas Imperdíveis" 
          products={offerProducts}
          backgroundColor="#FF6B6B"
        />
      </main>
      <Footer />
    </div>
  );
}

export default App

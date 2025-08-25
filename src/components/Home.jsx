import React, { useState, useEffect } from 'react';
import Banner from './Banner';
import CategorySection from './CategorySection';
import ProductSection from './ProductSection';
import CategoryProducts from './CategoryProducts';
import BrandOffers from './BrandOffers';
import TechOffers from './TechOffers';
import VideoSection from './VideoSection';
import { productsAPI } from '../services/api';

const Home = () => {
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
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Cargando productos...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Error cargando productos: {error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </main>
    );
  }

  // Si hay una categoría seleccionada, mostrar solo esos productos
  if (selectedCategory) {
    return (
      <main>
        <CategoryProducts 
          selectedCategory={selectedCategory}
          onClose={handleCloseCategoryView}
        />
      </main>
    );
  }

  return (
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
      
      {/* Sección de Ofertas Tech con filtros por categoría - ARRIBA */}
      <TechOffers />
      
      {/* Tarjetas de las lojas de marcas - DEBAJO DE OFERTAS TECH */}
      <BrandOffers />
      
      <ProductSection 
        title="🔥 Ofertas Imperdíveis" 
        products={offerProducts}
        backgroundColor="#FF6B6B"
      />
      
      <VideoSection />
    </main>
  );
};

export default Home;
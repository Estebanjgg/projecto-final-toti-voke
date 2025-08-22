import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import CategorySection from './components/CategorySection';
import ProductSection from './components/ProductSection';
import TechOffers from './components/TechOffers';
import BrandStores from './components/BrandStores';
import VideoSection from './components/VideoSection';
import Footer from './components/Footer';
import { productsAPI } from './services/api';
import './App.css';

function App() {
  // Estados para los productos
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [techProducts, setTechProducts] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos al montar el componente
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // Cargar productos destacados
        const featuredResponse = await productsAPI.getFeatured();
        setFeaturedProducts(featuredResponse.data || []);
        
        // Cargar productos de tecnología (notebooks)
        const techResponse = await productsAPI.getAll({ category: 'Notebook', limit: 4 });
        setTechProducts(techResponse.data || []);
        
        // Cargar ofertas del día
        const offersResponse = await productsAPI.getOffers();
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

  return (
    <div className="App">
      <Header />
      <main>
        <Banner />
        <CategorySection />
        <ProductSection 
          title="Imperdível" 
          products={featuredProducts}
          backgroundColor="#FFA500"
        />
        <TechOffers products={techProducts} />
        <BrandStores />
        <ProductSection 
          title="Ofertas do Dia" 
          products={offerProducts}
          backgroundColor="#FFA500"
        />
        <VideoSection />
      </main>
      <Footer />
    </div>
  );
}

export default App

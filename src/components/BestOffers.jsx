import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { productsAPI } from '../services/api';
import './BestOffers.css';

const BestOffers = ({ categoryFilter = null }) => {
  const [offerProducts, setOfferProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBestOffers();
  }, [categoryFilter]);

  const loadBestOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Si hay filtro de categoría, obtener ofertas de esa categoría
      // Si no, obtener ofertas generales
      const filters = {
        offer: true,
        limit: 4
      };
      
      if (categoryFilter) {
        filters.category = categoryFilter;
      }
      
      const response = await productsAPI.getAll(filters);
      setOfferProducts(response.data || []);
      
    } catch (err) {
      console.error('Error cargando mejores ofertas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="best-offers">
        <div className="container">
          <div className="best-offers-header">
            <img src="/picture/logo gif/bolt.gif" alt="Bolt" className="bolt-icon" />
            <h2>Melhores Ofertas</h2>
          </div>
          <div className="loading-offers">
            <p>Carregando ofertas...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || offerProducts.length === 0) {
    return null; // No mostrar la sección si hay error o no hay productos
  }

  return (
    <section className="best-offers">
      <div className="container">
        <div className="best-offers-header">
          <img src="/picture/logo gif/bolt.gif" alt="Bolt" className="bolt-icon" />
          <h2>Melhores Ofertas</h2>
        </div>
        
        <div className="best-offers-grid">
          {offerProducts.map((product, index) => (
            <div key={product.id || index} className="offer-card-wrapper">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestOffers;
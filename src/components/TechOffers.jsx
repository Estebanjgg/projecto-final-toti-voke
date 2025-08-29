import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getProductsByCategory } from '../services/api';
import './TechOffers.css';

const TechOffers = () => {
  const [activeFilter, setActiveFilter] = useState('Notebooks');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Categorías con nombres actualizados que coinciden con la base de datos
  const filters = [
    { key: 'Notebooks', label: 'Notebook', dbValue: 'Notebooks' },
    { key: 'Smartphones', label: 'Smartphones', dbValue: 'Smartphones' },
    { key: 'Desktops', label: 'Computador', dbValue: 'Desktops' },
    { key: 'Monitores', label: 'Monitor', dbValue: 'Monitores' }
  ];
  
  // Cargar productos cuando cambie el filtro
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Encontrar el valor de base de datos para el filtro activo
        const activeFilterObj = filters.find(f => f.key === activeFilter);
        const categoryToQuery = activeFilterObj ? activeFilterObj.dbValue : activeFilter;
        
        const response = await getProductsByCategory(categoryToQuery);
        
        // Manejar diferentes estructuras de respuesta
        let productsData = [];
        if (Array.isArray(response)) {
          productsData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          productsData = response.data;
        } else if (response && Array.isArray(response.products)) {
          productsData = response.products;
        }
        
        // Limitar a 4 productos (1 fila)
        setProducts(productsData.slice(0, 4));
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [activeFilter]);

  return (
    <section className="tech-offers">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Ofertas Tech</h2>
          
          <div className="filter-tabs">
            {filters.map((filter) => (
              <button
                key={filter.key}
                className={`filter-tab ${activeFilter === filter.key ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="tech-products-grid">
          {loading ? (
            // Loading state
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="product-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-price"></div>
              </div>
            ))
          ) : (
            products.map((product) => {
              // Parsear installments si es un string JSON
              let installments = null;
              if (product.installments) {
                try {
                  const parsed = typeof product.installments === 'string' 
                    ? JSON.parse(product.installments) 
                    : product.installments;
                  installments = {
                    times: parsed.times,
                    value: parsed.value
                  };
                } catch (e) {
                  console.warn('Error parsing installments:', e);
                }
              }

              return (
                <ProductCard 
                  key={product.id} 
                  product={{
                    id: product.id,
                    image: product.image,
                    title: product.title,
                    brand: product.brand,
                    originalPrice: parseFloat(product.original_price),
                    currentPrice: parseFloat(product.current_price),
                    discount: product.discount,
                    installments: installments,
                    stock: product.stock,
                    isOffer: product.is_offer,
                    isBestSeller: product.is_best_seller
                  }}
                />
              );
            })
          )}
        </div>
        
        {!loading && products.length === 0 && (
          <div className="no-products">
            <p>Nenhum produto encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TechOffers;
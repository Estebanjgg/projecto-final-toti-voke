import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ProductSection.css';

const ProductSection = ({ title, products, backgroundColor = '#FFA500' }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 4;
  
  // Calcular el número total de páginas
  const totalPages = Math.ceil(products.length / productsPerPage);
  
  // Obtener productos para la página actual
  const getCurrentProducts = () => {
    const startIndex = currentPage * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return products.slice(startIndex, endIndex);
  };
  
  // Resetear página cuando cambien los productos
  useEffect(() => {
    setCurrentPage(0);
  }, [products]);
  
  return (
    <section className="product-section" style={{ backgroundColor }}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <img src="/picture/logo gif/bolt.gif" alt="Bolt" className="title-icon-gif" />
            {title}
          </h2>
        </div>
        
        <div className="products-grid">
          {getCurrentProducts().map((product, index) => (
            <ProductCard key={product.id || index} product={product} />
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className="section-dots">
            {Array.from({ length: totalPages }, (_, index) => (
              <span 
                key={index}
                className={`dot ${index === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
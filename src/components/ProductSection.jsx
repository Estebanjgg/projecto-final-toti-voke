import React from 'react';
import ProductCard from './ProductCard';
import './ProductSection.css';

const ProductSection = ({ title, products, backgroundColor = '#FFA500' }) => {
  return (
    <section className="product-section" style={{ backgroundColor }}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">⚡</span>
            {title}
          </h2>
        </div>
        
        <div className="products-grid">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
        
        <div className="section-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
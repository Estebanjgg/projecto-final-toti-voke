import React, { useState } from 'react';
import ProductCard from './ProductCard';
import './TechOffers.css';

const TechOffers = ({ products }) => {
  const [activeFilter, setActiveFilter] = useState('Notebook');
  
  const filters = ['Notebook', 'Smartphones', 'Computador', 'Monitor'];
  
  const filteredProducts = products.filter(product => 
    product.category === activeFilter
  );

  return (
    <section className="tech-offers">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Ofertas Tech</h2>
          
          <div className="filter-tabs">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <div className="tech-products-grid">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechOffers;
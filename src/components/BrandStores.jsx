import React from 'react';
import './BrandStores.css';

const BrandStores = ({ onCategorySelect }) => {
  const stores = [
    {
      title: '📱 Smartphones',
      subtitle: 'iPhone, Samsung Galaxy, Xiaomi e muito mais!',
      description: 'Descubra smartphones',
      buttonText: 'Ver Smartphones',
      backgroundColor: '#4A90E2',
      category: 'Smartphone',
      productImage: '📱'
    },
    {
      title: '📱 Tablets',
      subtitle: 'iPad, Galaxy Tab, Surface e outros tablets!',
      description: 'Descubra tablets',
      buttonText: 'Ver Tablets',
      backgroundColor: '#32CD32',
      category: 'Tablet',
      productImage: '📱'
    },
    {
      title: '💻 Notebooks',
      subtitle: 'MacBook, Dell, Lenovo, ASUS e muito mais!',
      description: 'Notebooks para trabalho e gaming',
      buttonText: 'Ver Notebooks',
      backgroundColor: '#FF6347',
      category: 'Notebook',
      productImage: '💻'
    },
    {
      title: '🖥️ Eletrônicos',
      subtitle: 'Desktops, monitores, acessórios e tecnologia!',
      description: 'Tecnologia completa',
      buttonText: 'Ver Eletrônicos',
      backgroundColor: '#9370DB',
      category: 'Electrónicos',
      productImage: '🖥️'
    }
  ];
  
  const handleStoreClick = (store) => {
    if (onCategorySelect) {
      onCategorySelect(store.category);
    }
  };

  return (
    <section className="brand-stores">
      <div className="container">
        <div className="stores-grid">
          {stores.map((store, index) => (
            <div 
              key={index} 
              className="store-card"
              style={{ backgroundColor: store.backgroundColor }}
              onClick={() => handleStoreClick(store)}
            >
              <div className="store-content">
                <div className="store-text">
                  <span className="store-label">{store.description}</span>
                  <h3 className="store-title">{store.title}</h3>
                  <p className="store-subtitle">{store.subtitle}</p>
                  <button className="store-button">{store.buttonText}</button>
                </div>
                
                <div className="store-visual">
                  <div className="product-showcase">
                    <div className="product-item">{store.productImage}</div>
                  </div>
                  <div className="decorative-cubes">
                    <div className="cube cube-1"></div>
                    <div className="cube cube-2"></div>
                    <div className="cube cube-3"></div>
                    <div className="cube cube-4"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandStores;
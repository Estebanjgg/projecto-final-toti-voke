import React from 'react';
import './BrandStores.css';

const BrandStores = () => {
  const stores = [
    {
      title: 'Loja APPLE',
      subtitle: 'A Marca mais desejada do Brasil',
      description: 'Descubra smartphones',
      buttonText: 'Compre agora!',
      backgroundColor: '#4A90E2',
      image: '📱',
      productImage: '📱'
    },
    {
      title: 'Loja SAMSUNG',
      subtitle: 'Toda a linha Galaxy e muito mais!',
      description: 'Descubra smartphones',
      buttonText: 'Compre agora!',
      backgroundColor: '#FFA500',
      image: '📱',
      productImage: '📱'
    },
    {
      title: 'Loja LENOVO',
      subtitle: 'Encontre Notebooks, computadores, monitores e muito mais!',
      description: 'Mais sem-fio!',
      buttonText: 'Compre agora!',
      backgroundColor: '#4A90E2',
      image: '💻',
      productImage: '💻'
    },
    {
      title: 'Loja DELL',
      subtitle: 'Toda linha DELL, exclusivo para você!',
      description: 'Versatilidade e economia',
      buttonText: 'Compre agora!',
      backgroundColor: '#FFA500',
      image: '💻',
      productImage: '💻'
    }
  ];

  return (
    <section className="brand-stores">
      <div className="container">
        <div className="stores-grid">
          {stores.map((store, index) => (
            <div 
              key={index} 
              className="store-card"
              style={{ backgroundColor: store.backgroundColor }}
            >
              <div className="store-content">
                <div className="store-text">
                  <span className="store-label">Descubra smartphones</span>
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
import React from 'react';
import './BrandOffers.css';

const BrandOffers = () => {
  const offers = [
    {
      id: 1,
      brand: 'APPLE',
      title: 'Loja APPLE',
      subtitle: 'A Voke mais desejada do Brasil',
      buttonText: 'Comprar Agora',
      backgroundImage: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      badgeText: 'Descontos Imperdíveis!'
    },
    {
      id: 2,
      brand: 'SAMSUNG',
      title: 'Loja SAMSUNG',
      subtitle: 'Toda linha Galaxy e muito mais',
      buttonText: 'Comprar Agora',
      backgroundImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      badgeText: 'Descontos Imperdíveis!'
    },
    {
      id: 3,
      brand: 'LENOVO',
      title: 'Loja LENOVO',
      subtitle: 'Encontre Notebook, computadores, monitores e muito mais!',
      buttonText: 'Comprar Agora',
      backgroundImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      badgeText: 'Novo preço!'
    },
    {
      id: 4,
      brand: 'DELL',
      title: 'Loja DELL',
      subtitle: 'Toda linha DELL exclusiva para você!',
      buttonText: 'Comprar Agora',
      backgroundImage: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      badgeText: 'Versatilidade e economia!'
    }
  ];

  return (
    <section className="brand-offers">
      <div className="container">
        <div className="offers-grid">
          {offers.map((offer) => (
            <div 
              key={offer.id} 
              className="offer-card"
              style={{
                backgroundImage: `url(${offer.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="offer-overlay">
                <div className="offer-content">
                  <div className="offer-badge">
                    {offer.badgeText}
                  </div>
                  
                  <div className="offer-text">
                    <h3 className="offer-title">{offer.title}</h3>
                    <p className="offer-subtitle">{offer.subtitle}</p>
                  </div>
                  
                  <button className="offer-button">
                    {offer.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandOffers;
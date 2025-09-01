import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BrandOffers.css';

const BrandOffers = () => {
  const navigate = useNavigate();

  const handleBrandClick = (brand) => {
    const brandKey = brand.toLowerCase();
    navigate(`/marca/${brandKey}`);
  };

  const offers = [
    {
      id: 1,
      brand: 'APPLE',
      title: 'Loja APPLE',
      subtitle: 'A Voke mais desejada do Brasil',
      buttonText: 'Comprar Agora',
      backgroundImage: '/picture/banner-lojas/Banner%20Apple%20%5BDesktop%5D@2x.png',
      badgeText: 'Descontos Imperdíveis!'
    },
    {
      id: 2,
      brand: 'SAMSUNG',
      title: 'Loja SAMSUNG',
      subtitle: 'Toda linha Galaxy e muito mais',
      buttonText: 'Comprar Agora',
      backgroundImage: '/picture/banner-lojas/Banner%20Samsung%20%5BDesktop%5D@2x.png',
      badgeText: 'Descontos Imperdíveis!'
    },
    {
      id: 3,
      brand: 'LENOVO',
      title: 'Loja LENOVO',
      subtitle: 'Encontre Notebook, computadores, monitores e muito mais!',
      buttonText: 'Comprar Agora',
      backgroundImage: '/picture/banner-lojas/Banner%20Lenovo%20%5BDesktop%5D@2x.png',
      badgeText: 'Novo preço!'
    },
    {
      id: 4,
      brand: 'DELL',
      title: 'Loja DELL',
      subtitle: 'Toda linha DELL exclusiva para você!',
      buttonText: 'Comprar Agora',
      backgroundImage: '/picture/banner-lojas/Banner%20Dell%20%5BDesktop%5D@2x.png',
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
                  
                  <button 
                    className="offer-button"
                    onClick={() => handleBrandClick(offer.brand)}
                  >
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
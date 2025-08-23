import React, { useState, useEffect } from 'react';
import './Banner.css';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const bannerMessages = [
    {
      logo: {
        mc: "Mc",
        dia: "Dia", 
        feliz: "Feliz",
        icon: "🍟"
      },
      title: "COMPRE NA VOKE, APOIE O MCDIA FELIZ E CONCORRA A VOUCHERS EXCLUSIVOS!",
      description: "AO COMPRAR ACIMA DE R$2.000,00 NO NOSSO E-COMMERCE, VOCÊ AJUDA MILHARES DE ESTUDANTES APOIANDO PELO INSTITUTO AYRTON SENNA E AINDA CONCORRE A 100 VOUCHERS.",
      primaryButton: "COMPRE AGORA E PARTICIPE!",
      secondaryButton: "APROVEITE, FAÇA SUA COMPRA ATÉ 31/10/2024 E PARTICIPE DESSA CAUSA INCRÍVEL!"
    },
    {
      logo: {
        mc: "Voke",
        dia: "Tech", 
        feliz: "Store",
        icon: "💻"
      },
      title: "TECNOLOGIA DE PONTA COM OS MELHORES PREÇOS DO MERCADO!",
      description: "DESCUBRA NOSSA SELEÇÃO EXCLUSIVA DE SMARTPHONES, NOTEBOOKS, TABLETS E ACESSÓRIOS DAS MELHORES MARCAS COM GARANTIA E QUALIDADE VOKE.",
      primaryButton: "VER OFERTAS ESPECIAIS!",
      secondaryButton: "APROVEITE NOSSOS DESCONTOS IMPERDÍVEIS E RENOVE SUA TECNOLOGIA!"
    },
    {
      logo: {
        mc: "Super",
        dia: "Black", 
        feliz: "Friday",
        icon: "🔥"
      },
      title: "MEGA PROMOÇÕES COM ATÉ 70% DE DESCONTO EM ELETRÔNICOS!",
      description: "NÃO PERCA ESSA OPORTUNIDADE ÚNICA! PRODUTOS SEMINOVOS E NOVOS COM DESCCONTOS INCRÍVEIS. FRETE GRÁTIS PARA TODO O BRASIL EM COMPRAS ACIMA DE R$500.",
      primaryButton: "APROVEITAR DESCONTOS!",
      secondaryButton: "OFERTA LIMITADA! GARANTE JÁ O SEU PRODUTO COM O MELHOR PREÇO!"
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerMessages.length);
    }, 5000); // Cambia cada 5 segundos
    
    return () => clearInterval(interval);
  }, [bannerMessages.length]);
  
  const currentMessage = bannerMessages[currentSlide];
  
  return (
    <section className="banner">
      <div className="container">
        <div className="banner-content">
          <div className="banner-text">
            <div className="mcdia-logo">
              <span className="mc-text">{currentMessage.logo.mc}</span>
              <span className="dia-text">{currentMessage.logo.dia}</span>
              <span className="feliz-text">{currentMessage.logo.feliz}</span>
              <div className="mcdonalds-logo">{currentMessage.logo.icon}</div>
            </div>
            
            <h2 className="banner-title">
              {currentMessage.title}
            </h2>
            
            <p className="banner-description">
              {currentMessage.description}
            </p>
            
            <div className="banner-buttons">
              <button className="btn-primary">
                {currentMessage.primaryButton}
              </button>
              <button className="btn-secondary">
                {currentMessage.secondaryButton}
              </button>
            </div>
          </div>
          
          <div className="banner-image">
            <div className="character-container">
              <div className="character">
                <div className="character-head"></div>
                <div className="character-body"></div>
              </div>
              <div className="burger">
                <div className="burger-top"></div>
                <div className="burger-middle"></div>
                <div className="burger-bottom"></div>
              </div>
              <div className="house">
                <div className="house-roof"></div>
                <div className="house-body"></div>
                <div className="house-door"></div>
              </div>
              <div className="blocks">
                <div className="block block-a">A</div>
                <div className="block block-b">B</div>
                <div className="block block-c">C</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="banner-dots">
          {bannerMessages.map((_, index) => (
            <span 
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;
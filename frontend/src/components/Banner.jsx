import React from 'react';
import './Banner.css';

const Banner = () => {
  return (
    <section className="banner">
      <div className="container">
        <div className="banner-content">
          <div className="banner-text">
            <div className="mcdia-logo">
              <span className="mc-text">Mc</span>
              <span className="dia-text">Dia</span>
              <span className="feliz-text">Feliz</span>
              <div className="mcdonalds-logo">🍟</div>
            </div>
            
            <h2 className="banner-title">
              COMPRE NA VOKE, APOIE O MCDIA FELIZ
              <br />
              E CONCORRA A VOUCHERS EXCLUSIVOS!
            </h2>
            
            <p className="banner-description">
              AO COMPRAR ACIMA DE R$2.000,00 NO NOSSO E-COMMERCE, VOCÊ AJUDA
              <br />
              MILHARES DE ESTUDANTES APOIANDO PELO INSTITUTO AYRTON SENNA E
              <br />
              AINDA CONCORRE A 100 VOUCHERS.
            </p>
            
            <div className="banner-buttons">
              <button className="btn-primary">
                COMPRE AGORA E PARTICIPE!
              </button>
              <button className="btn-secondary">
                APROVEITE, FAÇA SUA COMPRA
                <br />
                ATÉ 31/10/2024 E PARTICIPE DESSA
                <br />
                CAUSA INCRÍVEL!
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
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </section>
  );
};

export default Banner;
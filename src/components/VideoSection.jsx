import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VideoSection.css';

const VideoSection = () => {
  const navigate = useNavigate();

  const handleBrandClick = (brand) => {
    const brandKey = brand.toLowerCase();
    navigate(`/marca/${brandKey}`);
  };

  return (
    <>
      {/* Brand Logos Section with white background */}
      <section className="brand-section">
        <div className="brand-container">
          <h3 className="brand-title">As melhores marcas</h3>
          <div className="brand-logos">
            <img 
              src="https://www.voke.shop/dw/image/v2/BKXD_PRD/on/demandware.static/-/Library-Sites-RefArchSharedLibrary/default/dw5d3e0661/Apple-logo-pb.png" 
              alt="Apple" 
              className="brand-logo" 
              onClick={() => handleBrandClick('Apple')}
              style={{ cursor: 'pointer' }}
            />
            <img 
              src="https://www.voke.shop/dw/image/v2/BKXD_PRD/on/demandware.static/-/Library-Sites-RefArchSharedLibrary/default/dweb1ee236/Microsoft-logo-pb.png" 
              alt="Microsoft" 
              className="brand-logo" 
              onClick={() => handleBrandClick('Microsoft')}
              style={{ cursor: 'pointer' }}
            />
            <img 
              src="https://www.voke.shop/dw/image/v2/BKXD_PRD/on/demandware.static/-/Library-Sites-RefArchSharedLibrary/default/dwf0be0f3b/Dell-technologies-logo-pb.png" 
              alt="Dell" 
              className="brand-logo" 
              onClick={() => handleBrandClick('Dell')}
              style={{ cursor: 'pointer' }}
            />
            <img 
              src="https://www.voke.shop/dw/image/v2/BKXD_PRD/on/demandware.static/-/Library-Sites-RefArchSharedLibrary/default/dw408820f7/Samsung-logo-pb.png" 
              alt="Samsung" 
              className="brand-logo" 
              onClick={() => handleBrandClick('Samsung')}
              style={{ cursor: 'pointer' }}
            />
            <img 
              src="https://www.voke.shop/dw/image/v2/BKXD_PRD/on/demandware.static/-/Library-Sites-RefArchSharedLibrary/default/dw261b697b/Motorola-logo-pb.png" 
              alt="Motorola" 
              className="brand-logo" 
              onClick={() => handleBrandClick('Motorola')}
              style={{ cursor: 'pointer' }}
            />
            <img 
              src="https://www.voke.shop/dw/image/v2/BKXD_PRD/on/demandware.static/-/Library-Sites-RefArchSharedLibrary/default/dwa6ea8277/Lenovo-logo-pb.png" 
              alt="Lenovo" 
              className="brand-logo" 
              onClick={() => handleBrandClick('Lenovo')}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
      </section>
      
      {/* Video Section with original Voke structure */}
      <section className="video-section">
        <div className="container padding-adjustment-infoCard">
          <div className="row informationCard">
            <div className="col-md-4">
              <div className="informationCard__left">
                <p className="informationCard__title">Já pensou em comprar um seminovo?</p>
                <p className="informationCard__description">
                  Os equipamentos da Voke são indicados para pequenas, médias e grandes empresas, 
                  que buscam modernizar e aumentar seu parque tecnológico com qualidade e preço competitivo.
                </p>
                <div className="informationCard__button">
                  <div className="row">
                    <a href="https://staging-na01-agasusseminovos.demandware.net/s/Voke/solucoes.html" className="buttonLink__circle">
                      <span className="buttonLink__arrow">➔</span>
                    </a>
                    <span className="buttonLink__label mt-3">Saiba mais sobre nossas soluções</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="informationCard__right">
                <div className="rounded-video-container">
                  <iframe 
                    width="100%" 
                    height="400" 
                    src="https://www.youtube.com/embed/obMOJ5A7pSw?si=e93A1h4rkNPNvRSj" 
                    loading="lazy" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VideoSection;
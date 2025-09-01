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
      
      {/* Video Section with yellow background */}
      <section className="video-section">
        <div className="video-section-content">
          <div className="video-container">
            <div className="video-content">
              <div className="video-text">
                <h2>Já pensou em comprar um seminovo?</h2>
                <p>Os equipamentos da Voke são indicados para pequenas, médias e grandes empresas, que buscam modernizar e aumentar seu parque tecnológico com qualidade e economia.</p>
                <button className="cta-button">
                  <span className="icon">📞</span>
                  Saiba mais sobre nossas soluções
                </button>
              </div>
              <div className="video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Voke Seminovos"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <button className="close-btn">×</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VideoSection;
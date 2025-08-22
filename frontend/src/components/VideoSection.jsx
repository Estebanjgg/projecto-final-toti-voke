import React from 'react';
import './VideoSection.css';

const VideoSection = () => {
  return (
    <section className="video-section">
      <div className="video-container">
        <div className="video-content">
          <div className="video-text">
            <h2>Já pensou em comprar um seminovo?</h2>
            <p>
              Os equipamentos da Voke são indicados para pequenas, médias e grandes empresas, que buscam modernizar e aumentar seu parque tecnológico com qualidade e economia.
            </p>
            <button className="video-btn">
              <span className="play-icon">▶</span>
              Saiba mais sobre nossas soluções
            </button>
          </div>
          <div className="video-player">
            <div className="video-wrapper">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Equipamentos Seminovos de Qualidade para Você!"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="video-overlay">
                <div className="close-btn">×</div>
              </div>
            </div>
          </div>
        </div>
        <div className="brand-logos">
          <img src="/api/placeholder/120/60" alt="Apple" className="brand-logo" />
          <img src="/api/placeholder/120/60" alt="Microsoft" className="brand-logo" />
          <img src="/api/placeholder/120/60" alt="Dell" className="brand-logo" />
          <img src="/api/placeholder/120/60" alt="Samsung" className="brand-logo" />
          <img src="/api/placeholder/120/60" alt="Motorola" className="brand-logo" />
          <img src="/api/placeholder/120/60" alt="Lenovo" className="brand-logo" />
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
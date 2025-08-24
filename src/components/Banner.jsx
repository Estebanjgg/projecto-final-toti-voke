import React, { useState, useEffect } from 'react';
import './Banner.css';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const bannerMessages = [
    {
      image: "/picture/image-propaganda/Screenshot_81.png"
    },
    {
      image: "/picture/image-propaganda/Screenshot_82.png"
    },
    {
      image: "/picture/image-propaganda/Screenshot_83.png"
    },
    {
      image: "/picture/image-propaganda/Screenshot_84.png"
    },    
    {
      image: "/picture/image-propaganda/Screenshot_86.png"
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
          <div className="banner-image-container">
            <button 
              className="nav-arrow nav-arrow-left"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerMessages.length) % bannerMessages.length)}
            >
              &#8249;
            </button>
            <img 
              src={currentMessage.image} 
              alt={`Propaganda ${currentSlide + 1}`}
              className="propaganda-image"
            />
            <button 
              className="nav-arrow nav-arrow-right"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerMessages.length)}
            >
              &#8250;
            </button>
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
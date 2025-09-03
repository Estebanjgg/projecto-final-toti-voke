import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        {/* Número 404 animado */}
        <div className="error-code">
          <span className="four">4</span>
          <span className="zero">0</span>
          <span className="four">4</span>
        </div>

        {/* Mensaje principal */}
        <div className="error-message">
          <h1>Ops! Página não encontrada</h1>
          <p>A página que você está procurando não existe ou foi movida.</p>
        </div>

        {/* Ilustración/Icono */}
        <div className="error-illustration">
          <div className="search-icon">
            <div className="magnifying-glass">
              <div className="glass-circle"></div>
              <div className="glass-handle"></div>
            </div>
            <div className="question-mark">?</div>
          </div>
        </div>

        {/* Descripción adicional */}
        <div className="error-description">
          <p>Isso pode ter acontecido porque:</p>
          <ul>
            <li>A URL foi digitada incorretamente</li>
            <li>O link está desatualizado</li>
            <li>A página foi removida ou renomeada</li>
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="error-actions">
          <Link to="/" className="btn btn-primary">
            <span className="btn-icon">🏠</span>
            Ir ao Início
          </Link>
          
          <button onClick={handleGoBack} className="btn btn-secondary">
            <span className="btn-icon">←</span>
            Voltar
          </button>
          
          <Link to="/categoria/smartphones" className="btn btn-outline">
            <span className="btn-icon">📱</span>
            Ver Produtos
          </Link>
        </div>

        {/* Sugerencias de navegación */}
        <div className="navigation-suggestions">
          <h3>Tem interesse em alguma dessas seções?</h3>
          <div className="suggestions-grid">
            <Link to="/categoria/smartphones" className="suggestion-card">
              <div className="suggestion-icon">📱</div>
              <span>Smartphones</span>
            </Link>
            
            <Link to="/categoria/notebooks" className="suggestion-card">
              <div className="suggestion-icon">💻</div>
              <span>Notebooks</span>
            </Link>
            
            <Link to="/categoria/tablets" className="suggestion-card">
              <div className="suggestion-icon">📱</div>
              <span>Tablets</span>
            </Link>
            
            <Link to="/favorites" className="suggestion-card">
              <div className="suggestion-icon">❤️</div>
              <span>Favoritos</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

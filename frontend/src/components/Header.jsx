import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      {/* Top bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            <span>📧 Até mesmo de gratuito com o Voke</span>
            <div className="top-bar-nav">
              <span>←</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="main-header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <div className="logo">
              <h1>voke</h1>
            </div>

            {/* Search bar */}
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Encontre o que procura" 
                className="search-input"
              />
              <button className="search-btn">🔍</button>
            </div>

            {/* User actions */}
            <div className="user-actions">
              <button className="action-btn">
                <span>♡</span>
                <span>2</span>
              </button>
              <button className="action-btn cart">
                <span>🛒</span>
                <span className="cart-count">1</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="nav-menu">
        <div className="container">
          <div className="nav-content">
            <button className="menu-toggle">☰ Menu</button>
            <div className="nav-links">
              <a href="#" className="nav-link">Lançada Tech</a>
              <a href="#" className="nav-link">Loja Imperdível</a>
              <a href="#" className="nav-link">Loja Samsung</a>
              <a href="#" className="nav-link">Loja Lenovo</a>
              <a href="#" className="nav-link">Loja Dell</a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
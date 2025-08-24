import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

// Componente para el botón de autenticación
const AuthButton = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      await logout();
      setShowDropdown(false);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="auth-dropdown">
        <button 
          className="action-btn user-btn"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="user-avatar">
            <span className="avatar-letter">
              {user.first_name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
            <div className="avatar-ring"></div>
          </div>
          <span className="user-name">{user.first_name}</span>
          <span className="dropdown-arrow">{showDropdown ? '▲' : '▼'}</span>
        </button>
        
        {showDropdown && (
          <div className="dropdown-menu">
            <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
              👤 Mi Perfil
            </Link>
            <Link to="/orders" className="dropdown-item" onClick={() => setShowDropdown(false)}>
              📦 Mis Pedidos
            </Link>
            <button className="dropdown-item logout" onClick={handleLogout}>
              🚪 Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="auth-buttons">
      <Link to="/login" className="action-btn login-btn">
        <span>👤</span>
      </Link>
    </div>
  );
};

const Header = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);
  
  const messages = [
    "📧 Frete grátis para todo Brasil",
    "👤 06 meses de garantia com a Voke",
    "💳 5% de Desconto para Pix e Boleto"
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => 
        (prevIndex + 1) % messages.length
      );
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, [messages.length]);

  const handlePrevMessage = () => {
    setCurrentMessageIndex((prevIndex) => 
      prevIndex === 0 ? messages.length - 1 : prevIndex - 1
    );
  };

  const handleNextMessage = () => {
    setCurrentMessageIndex((prevIndex) => 
      (prevIndex + 1) % messages.length
    );
  };

  return (
    <header className="header">
      {/* Top bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            <button className="top-nav-arrow" onClick={handlePrevMessage}>←</button>
            <span className="promotional-message">{messages[currentMessageIndex]}</span>
            <button className="top-nav-arrow" onClick={handleNextMessage}>→</button>
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
              </button>
              <AuthButton />
              <button className="action-btn cart">
                <span>🛒</span>
                <span className="cart-count">0</span>
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
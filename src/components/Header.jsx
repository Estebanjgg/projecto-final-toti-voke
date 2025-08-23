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
          <span className="user-avatar">
            {user.first_name?.charAt(0)?.toUpperCase() || '👤'}
          </span>
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
        <span>🔑</span>
        <span>Entrar</span>
      </Link>
      <Link to="/register" className="action-btn register-btn">
        <span>👤</span>
        <span>Registro</span>
      </Link>
    </div>
  );
};

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
              
              {/* Auth button */}
              <AuthButton />
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
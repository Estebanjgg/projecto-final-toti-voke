import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import CartIcon from './ui/CartIcon';
import CartDrawer from './ui/CartDrawer';
import Modal from './Modal';
import { FiSearch, FiHeart, FiMenu, FiUser, FiPackage, FiLogOut, FiChevronDown, FiSmartphone, FiMonitor, FiTablet, FiHardDrive, FiHeadphones, FiCamera } from 'react-icons/fi';
import { productsAPI } from '../services/api';
import './Header.css';

// Componente de busca com sugestões
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const searchRef = React.useRef(null);

  // Debounce para evitar muitas chamadas à API
  const debounceRef = React.useRef(null);

  const searchProducts = async (term) => {
    if (term.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const response = await productsAPI.search(term, { limit: 8 });
      const products = response.data || response || [];
      setSuggestions(products);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Erro buscando produtos:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Limpar o debounce anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Criar novo debounce
    debounceRef.current = setTimeout(() => {
      searchProducts(value);
    }, 300);
  };

  const handleProductClick = (product) => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(`/product/${product.id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Fechar sugestões ao clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-container" ref={searchRef}>
      <form onSubmit={handleSearchSubmit}>
        <input 
          type="text" 
          placeholder="Pesquisar produtos... (ex: Samsung, iPhone, Notebook)"
          className="search-input"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
        />
        <button type="submit" className="search-btn">
          <FiSearch size={20} />
        </button>
      </form>
      
      {showSuggestions && (
        <div className="search-suggestions">
          {loading && (
            <div className="search-suggestion-item loading">
              <FiSearch size={16} />
              <span>Buscando...</span>
            </div>
          )}
          
          {!loading && suggestions.length === 0 && searchTerm.length >= 2 && (
            <div className="search-suggestion-item no-results">
              <span>Nenhum produto encontrado</span>
            </div>
          )}
          
          {!loading && suggestions.map((product) => (
            <div 
              key={product.id} 
              className="search-suggestion-item"
              onClick={() => handleProductClick(product)}
            >
              <div className="suggestion-image">
                 {product.image_url || product.images?.[0] || product.image ? (
                   <img 
                     src={product.image_url || product.images?.[0] || product.image} 
                     alt={product.title}
                     onError={(e) => {
                       e.target.style.display = 'none';
                       e.target.nextSibling.style.display = 'flex';
                     }}
                   />
                 ) : null}
                 <div className="no-image" style={{ display: product.image_url || product.images?.[0] || product.image ? 'none' : 'flex' }}>
                   {product.category === 'Smartphone' ? '📱' : 
                    product.category === 'Notebook' ? '💻' : 
                    product.category === 'Tablet' ? '📱' : 
                    product.category === 'Electronics' ? '🔌' : '📦'}
                 </div>
               </div>
              <div className="suggestion-content">
                <div className="suggestion-title">{product.title}</div>
                <div className="suggestion-details">
                  <span className="suggestion-brand">{product.brand}</span>
                  <span className="suggestion-price">R$ {product.current_price}</span>
                </div>
              </div>
            </div>
          ))}
          
          {!loading && suggestions.length > 0 && (
            <div className="search-suggestion-item view-all" onClick={handleSearchSubmit}>
              <FiSearch size={16} />
              <span>Ver todos os resultados para "{searchTerm}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Componente para el menú desplegable
const MenuDropdown = () => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [hoveredCategory, setHoveredCategory] = React.useState(null);
  const navigate = useNavigate();
  const dropdownRef = React.useRef(null);

  // Datos extraídos del SQL - Categorías disponibles
  const categories = [
    { name: 'Smartphones', icon: <FiSmartphone size={16} />, path: '/categoria/smartphones' },
    { name: 'Notebooks', icon: <FiMonitor size={16} />, path: '/categoria/notebooks' },
    { name: 'Tablets', icon: <FiTablet size={16} />, path: '/categoria/tablets' },
    { name: 'Desktops', icon: <FiHardDrive size={16} />, path: '/categoria/desktops' },
    { name: 'Monitores', icon: <FiMonitor size={16} />, path: '/categoria/monitores' },
    { name: 'Acessórios', icon: <FiHeadphones size={16} />, path: '/categoria/acessorios' },
    { name: 'Camaras', icon: <FiCamera size={16} />, path: '/categoria/camaras' },
    { name: 'Games', icon: <FiHardDrive size={16} />, path: '/categoria/games' }
  ];

  // Marcas por categoría basadas en los datos del SQL
  const brandsByCategory = {
    'Smartphones': ['Apple', 'Samsung', 'Xiaomi', 'Motorola', 'Huawei', 'Google', 'OnePlus', 'Nothing', 'Realme', 'Oppo', 'Vivo', 'Microsoft'],
    'Notebooks': ['Samsung', 'Lenovo', 'Dell', 'Asus', 'HP', 'Apple', 'Microsoft'],
    'Tablets': ['Samsung', 'Apple', 'Lenovo', 'Motorola', 'Microsoft'],
    'Desktops': ['Samsung', 'Dell', 'Lenovo', 'Apple'],
    'Monitores': ['Sony', 'Samsung', 'Lenovo', 'Dell', 'LG', 'Apple'],
    'Acessórios': ['SteelSeries', 'Sony', 'Samsung', 'Microsoft', 'Bose', 'Logitech'],
    'Camaras': ['Sony', 'Canon', 'Fujifilm'],
    'Games': ['Sony', 'Nintendo', 'Microsoft']
  };

  const handleCategoryClick = (path) => {
    navigate(path);
    setShowDropdown(false);
    setHoveredCategory(null);
  };

  const handleBrandClick = (brand) => {
    navigate(`/marca/${brand.toLowerCase()}`);
    setShowDropdown(false);
    setHoveredCategory(null);
  };

  const handleCategoryHover = (categoryName) => {
    setHoveredCategory(categoryName);
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null);
  };

  // Cerrar dropdown al hacer clic fuera
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setHoveredCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="menu-dropdown" ref={dropdownRef}>
      <button 
        className="menu-toggle"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FiMenu size={20} />
        <span>Menu</span>
        <FiChevronDown size={16} className={`dropdown-chevron ${showDropdown ? 'rotated' : ''}`} />
      </button>
      
      {showDropdown && (
        <div className="mega-dropdown">
          <div className="dropdown-section categories-section">
            <h3 className="dropdown-title">Departamentos</h3>
            <div className="dropdown-items">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="category-item-container"
                  onMouseEnter={() => handleCategoryHover(category.name)}
                  onMouseLeave={handleCategoryLeave}
                >
                  <button
                    className={`dropdown-item category-item ${hoveredCategory === category.name ? 'hovered' : ''}`}
                    onClick={() => handleCategoryClick(category.path)}
                  >
                    <span>{category.name}</span>
                    <FiChevronDown size={12} className="category-arrow" />
                  </button>
                  
                  {hoveredCategory === category.name && brandsByCategory[category.name] && (
                    <div className="brands-submenu">
                      <div className="submenu-header">
                        <span>Marcas</span>
                      </div>
                      <div className="submenu-brands">
                        {brandsByCategory[category.name].map((brand) => (
                          <button
                            key={brand}
                            className="submenu-brand-item"
                            onClick={() => handleBrandClick(brand)}
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="dropdown-footer">
              <div className="business-message">
                <h4>Para a sua empresa</h4>
                <p>Temos as melhores soluções de gestão de hardwares para sua empresa. confira!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para o botão de autenticação
const AuthButton = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setShowDropdown(false);
  };

  const handleLogoutConfirm = async () => {
    await logout();
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  if (isAuthenticated && user) {
    return (
      <div className="auth-dropdown">
        <button 
          className="navbar-action-btn user-btn"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <FiUser size={20} />
          <span className="dropdown-arrow">{showDropdown ? '▲' : '▼'}</span>
        </button>
        
        {showDropdown && (
          <div className="dropdown-menu">
            <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
              <FiUser size={16} />
              <span>Meu Perfil</span>
            </Link>
            <Link to="/orders" className="dropdown-item" onClick={() => setShowDropdown(false)}>
              <FiPackage size={16} />
              <span>Meus Pedidos</span>
            </Link>
            <button className="dropdown-item logout" onClick={handleLogoutClick}>
              <FiLogOut size={16} />
              <span>Encerrar Sessão</span>
            </button>
          </div>
        )}
        
        <Modal
          isOpen={showLogoutModal}
          onClose={handleLogoutCancel}
          onConfirm={handleLogoutConfirm}
          title="Encerrar Sessão"
          message={`Tem certeza de que deseja encerrar a sessão, ${user?.first_name}? Você precisará fazer login novamente para acessar sua conta.`}
          confirmText="Encerrar Sessão"
          cancelText="Cancelar"
          type="danger"
        />
      </div>
    );
  }

  return (
    <div className="auth-buttons">
      <Link to="/login" className="navbar-action-btn login-btn">
        <FiUser size={20} />
      </Link>
    </div>
  );
};

const Header = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const { favorites } = useFavorites();
  const { totalItems } = useCart();
  
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
    }, 3000); // Muda a cada 3 segundos

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

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
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
            <Link to="/" className="logo">
              <img 
                src="/picture/logo empresa/logoWoke.png" 
                alt="Logo da empresa" 
                className="logo-image"
              />
            </Link>

            {/* Search bar */}
            <SearchBar />

            {/* User actions */}
            <div className="user-actions">
              <Link to="/favorites" className="navbar-action-btn favorites-btn">
                <FiHeart size={20} />
                {favorites.length > 0 && (
                  <span className="favorites-count">{favorites.length}</span>
                )}
              </Link>
              <AuthButton />
              <CartIcon 
                className="navbar-action-btn cart-btn"
                size="medium"
                onClick={() => setIsCartOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="nav-menu">
        <div className="container">
          <div className="nav-content">
            <MenuDropdown />
            <div className="nav-links">
              <Link to="/lancamentos-tech" className="nav-link">Lançamentos Tech</Link>
              <Link to="/loja-imperdivel" className="nav-link">Loja Imperdível</Link>
              <Link to="/marca/samsung" className="nav-link">Loja Samsung</Link>
              <Link to="/marca/lenovo" className="nav-link">Loja Lenovo</Link>
              <Link to="/marca/dell" className="nav-link">Loja Dell</Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </header>
  );
};

export default Header;
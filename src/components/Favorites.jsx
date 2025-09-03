import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAlert } from '../contexts/AlertContext';
import ProductCard from './ProductCard';
import './Favorites.css';

// Dados mock de produtos para teste
const mockProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max 256GB",
    image: "/picture/image-propaganda/Screenshot_81.png",
    original_price: 1299.99,
    current_price: 1199.99,
    discount: 8,
    rating: 4.8,
    reviews: 324,
    category: "Smartphones",
    brand: "Apple"
  },
  {
    id: 2,
    name: "MacBook Pro 14 M3 512GB",
    image: "/picture/image-propaganda/Screenshot_82.png",
    original_price: 2299.99,
    current_price: 2099.99,
    discount: 9,
    rating: 4.9,
    reviews: 156,
    category: "Notebooks",
    brand: "Apple"
  },
  {
    id: 3,
    name: "Dell XPS 15 OLED Touch",
    image: "/picture/image-propaganda/Screenshot_83.png",
    original_price: 1899.99,
    current_price: 1699.99,
    discount: 11,
    rating: 4.7,
    reviews: 89,
    category: "Notebooks",
    brand: "Dell"
  },
  {
    id: 4,
    name: "Samsung Galaxy S24 Ultra",
    image: "/picture/image-propaganda/Screenshot_84.png",
    original_price: 999.99,
    current_price: 899.99,
    discount: 10,
    rating: 4.6,
    reviews: 203,
    category: "Smartphones",
    brand: "Samsung"
  },
  {
    id: 5,
    name: "Gaming Monitor 27 4K",
    image: "/picture/image-propaganda/Screenshot_85.png",
    original_price: 599.99,
    current_price: 529.99,
    discount: 12,
    rating: 4.5,
    reviews: 142,
    category: "Monitores",
    brand: "LG"
  },
  {
    id: 6,
    name: "Tablet Pro 12.9 WiFi",
    image: "/picture/image-propaganda/Screenshot_86.png",
    original_price: 799.99,
    current_price: 729.99,
    discount: 9,
    rating: 4.4,
    reviews: 98,
    category: "Tablets",
    brand: "Apple"
  }
];

const Favorites = () => {
  const { isAuthenticated } = useAuth();
  const { favorites, favoriteProducts, loading, loadFavorites } = useFavorites();
  const { showInfo } = useAlert();

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated, loadFavorites]);

  // Determinar quais produtos mostrar
  const getDisplayProducts = () => {
    // Se temos produtos reais do backend, usar eles
    if (favoriteProducts.length > 0) {
      return favoriteProducts.map(product => ({
        id: product.id,
        name: product.title || product.name,
        image: product.image,
        original_price: product.original_price,
        current_price: product.current_price,
        discount: product.discount,
        rating: product.rating,
        reviews: product.reviews,
        category: product.category,
        brand: product.brand || 'Voke'
      }));
    }
    
    // Se temos favoritos mas sem dados de produtos, usar mock como fallback
    if (favorites.length > 0) {
      return favorites.map((fav, index) => {
        const mockProduct = mockProducts[index % mockProducts.length];
        return {
          id: fav.product_id,
          name: mockProduct.name,
          image: mockProduct.image,
          original_price: mockProduct.original_price,
          current_price: mockProduct.current_price,
          discount: mockProduct.discount,
          rating: mockProduct.rating,
          reviews: mockProduct.reviews,
          category: mockProduct.category,
          brand: mockProduct.brand
        };
      });
    }
    
    return [];
  };

  const displayProducts = getDisplayProducts();

  if (!isAuthenticated) {
    return (
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>Meus Favoritos</h1>
        </div>
        <div className="empty-favorites">
          <div className="empty-favorites-icon">❤️</div>
          <h2>Faça login para ver seus favoritos</h2>
          <p>Você precisa estar conectado para acessar sua lista de favoritos</p>
          <Link to="/login" className="login-link">
            Entrar
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>Meus Favoritos</h1>
        </div>
        <div className="loading-favorites">
          <div className="loading-spinner"></div>
          <p>Carregando seus favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1>Meus Favoritos</h1>
        <div className="favorites-info">
          <span className="favorites-count-text">
            {displayProducts.length} {displayProducts.length === 1 ? 'produto' : 'produtos'}
          </span>
        </div>
      </div>

      {displayProducts.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-favorites-icon">💔</div>
          <h2>Você ainda não tem favoritos</h2>
          <p>Explore nossos produtos e marque os que você mais gostar como favoritos</p>
          <Link to="/" className="browse-products-link">
            Explorar Produtos
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                title: product.name,
                image: product.image,
                originalPrice: product.original_price,
                currentPrice: product.current_price,
                discount: product.discount,
                rating: product.rating,
                reviews: product.reviews,
                category: product.category,
                brand: product.brand || 'Voke',
                installments: `12x de R$ ${(product.current_price / 12).toFixed(2)}`,
                isOffer: product.discount > 0,
                isBestSeller: false
              }}
            />
          ))}
        </div>
      )}

      {displayProducts.length > 0 && (
        <div className="favorites-actions">
          <button 
            className="clear-favorites-btn"
            onClick={() => {
              if (window.confirm('Tem certeza de que deseja limpar todos os seus favoritos?')) {
                showInfo('Funcionalidade de limpar favoritos em breve');
              }
            }}
          >
            Limpar Favoritos
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;

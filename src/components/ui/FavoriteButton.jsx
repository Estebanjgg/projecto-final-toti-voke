import React, { useState } from 'react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import './FavoriteButton.css';

const FavoriteButton = ({ productId, className = '', size = 'medium' }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      return;
    }

    setIsAnimating(true);
    await toggleFavorite(productId);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const isCurrentlyFavorite = isFavorite(productId);

  return (
    <button
      className={`favorite-button ${className} ${size} ${isCurrentlyFavorite ? 'is-favorite' : ''} ${isAnimating ? 'is-animating' : ''}`}
      onClick={handleClick}
      title={isCurrentlyFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
      disabled={!isAuthenticated}
    >
      <span className="favorite-icon">
        {isCurrentlyFavorite ? '❤️' : '🤍'}
      </span>
    </button>
  );
};

export default FavoriteButton;

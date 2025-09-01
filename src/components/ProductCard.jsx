import React from 'react';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from './ui/FavoriteButton';
import AddToCartButton from './ui/AddToCartButton';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  
  const {
    id,
    image,
    title,
    brand,
    originalPrice,
    currentPrice,
    discount,
    installments,
    stock,
    isOffer = false,
    isBestSeller = false,
    // API fields with underscores
    original_price,
    current_price,
    is_offer,
    is_best_seller
  } = product;

  // Use API fields if camelCase versions are not available
  const finalOriginalPrice = originalPrice || original_price;
  const finalCurrentPrice = currentPrice || current_price;
  const finalIsOffer = isOffer || is_offer;
  const finalIsBestSeller = isBestSeller || is_best_seller;

  // Função para formatar preços e tratar valores NaN
  const formatProductPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) {
      return '0,00';
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) {
      return '0,00';
    }
    return numPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleCardClick = (e) => {
    // Evitar navegación si se hace clic en botones
    if (e.target.closest('.card-overlay') || e.target.closest('button')) {
      return;
    }
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      {/* Product badges */}
      <div className="product-badges">
        {finalIsOffer && <span className="badge offer-badge">Oferta</span>}
        {finalIsBestSeller && <span className="badge bestseller-badge">Mais Bem</span>}
      </div>

      {/* Action buttons container */}
      <div className="action-buttons-container">
        {/* Add to cart button */}
        <AddToCartButton 
          productId={id}
          variant="icon"
          size="medium"
          className="action-button"
        />
        
        {/* Favorite button */}
        <FavoriteButton 
          productId={id} 
          className="action-button" 
          size="medium"
        />
      </div>

      {/* Product image */}
      <div className="product-image">
        <img src={image} alt={title} />
      </div>

      {/* Brand */}
      {brand && (
        <div className="product-brand">
          <span className="brand-icon">🏷️</span>
          <span className="brand-name">{brand}</span>
        </div>
      )}

      {/* Stock information */}
      {stock !== undefined && stock !== null && (
        <div className="product-stock">
          <span className="stock-badge">
            {stock > 0 ? `Restam ${stock}` : 'Esgotado'}
          </span>
        </div>
      )}

      {/* Product title */}
      <h3 className="product-title">{title}</h3>

      {/* Pricing */}
      <div className="product-pricing">
        {finalOriginalPrice && (
          <span className="original-price">
            R$ {formatProductPrice(finalOriginalPrice)}
          </span>
        )}
        <div className="current-price-container">
          <span className="current-price">
            R$ {formatProductPrice(finalCurrentPrice)}
          </span>
          {discount && (
            <span className="discount-badge">{discount}% OFF</span>
          )}
        </div>
        {installments && (
          <p className="installments">
            em até <strong>{installments.times} de R$ {installments.value}</strong> sem juros
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
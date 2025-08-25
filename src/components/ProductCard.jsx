import React from 'react';
import FavoriteButton from './ui/FavoriteButton';
import AddToCartButton from './ui/AddToCartButton';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const {
    id,
    image,
    title,
    brand,
    originalPrice,
    currentPrice,
    discount,
    installments,
    isOffer = false,
    isBestSeller = false
  } = product;

  return (
    <div className="product-card">
      {/* Product badges */}
      <div className="product-badges">
        {isOffer && <span className="badge offer-badge">Oferta</span>}
        {isBestSeller && <span className="badge bestseller-badge">Mais Bem</span>}
      </div>

      {/* Favorite button */}
      <FavoriteButton 
        productId={id} 
        className="card-overlay" 
        size="medium"
      />

      {/* Add to cart button */}
      <AddToCartButton 
        productId={id}
        variant="icon"
        size="medium"
        className="card-overlay cart-overlay"
      />

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

      {/* Product title */}
      <h3 className="product-title">{title}</h3>

      {/* Pricing */}
      <div className="product-pricing">
        {originalPrice && (
          <span className="original-price">
            R$ {typeof originalPrice === 'number' 
              ? originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : originalPrice
            }
          </span>
        )}
        <div className="current-price-container">
          <span className="current-price">
            R$ {typeof currentPrice === 'number' 
              ? currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : currentPrice
            }
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
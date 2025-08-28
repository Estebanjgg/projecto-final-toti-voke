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

  return (
    <div className="product-card">
      {/* Product badges */}
      <div className="product-badges">
        {finalIsOffer && <span className="badge offer-badge">Oferta</span>}
        {finalIsBestSeller && <span className="badge bestseller-badge">Mais Bem</span>}
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
            R$ {typeof finalOriginalPrice === 'number' 
              ? finalOriginalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : finalOriginalPrice
            }
          </span>
        )}
        <div className="current-price-container">
          <span className="current-price">
            R$ {typeof finalCurrentPrice === 'number' 
              ? finalCurrentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : finalCurrentPrice
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
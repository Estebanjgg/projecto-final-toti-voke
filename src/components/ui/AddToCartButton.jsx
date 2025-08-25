import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import './AddToCartButton.css';

const AddToCartButton = ({ 
  productId, 
  className = '',
  size = 'medium',
  variant = 'button',
  disabled = false 
}) => {
  const { addToCart, isInCart, getProductQuantity, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const quantity = getProductQuantity(productId);
  const inCart = isInCart(productId);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled || isAdding || loading) return;
    
    setIsAdding(true);
    try {
      await addToCart(productId, 1);
    } finally {
      setIsAdding(false);
    }
  };

  const buttonContent = () => {
    if (isAdding) {
      return variant === 'icon' ? '⏳' : '⏳ Adicionando...';
    }
    
    if (inCart && quantity > 0) {
      return variant === 'icon' ? '✓' : `✓ No carrinho (${quantity})`;
    }
    
    return variant === 'icon' ? '🛒' : '🛒 Adicionar';
  };

  const getButtonClass = () => {
    let classes = `add-to-cart-btn ${size} ${variant} ${className}`;
    
    if (inCart) classes += ' in-cart';
    if (isAdding || loading) classes += ' loading';
    if (disabled) classes += ' disabled';
    
    return classes;
  };

  return (
    <button
      className={getButtonClass()}
      onClick={handleAddToCart}
      disabled={disabled || isAdding || loading}
      title={inCart ? `${quantity} no carrinho` : 'Adicionar ao carrinho'}
    >
      {buttonContent()}
    </button>
  );
};

export default AddToCartButton;

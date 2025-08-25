import React from 'react';
import { useCart } from '../../contexts/CartContext';
import './CartIcon.css';

const CartIcon = ({ onClick, className = '', size = 'medium' }) => {
  const { cartItemsCount, totalItems } = useCart();
  
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
  };

  return (
    <div className={`cart-icon-container ${size} ${className}`} onClick={handleClick}>
      <div className="cart-icon">
        🛒
        {totalItems > 0 && (
          <span className="cart-badge">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </div>
      {totalItems > 0 && (
        <span className="cart-text">
          {totalItems} item{totalItems !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};

export default CartIcon;

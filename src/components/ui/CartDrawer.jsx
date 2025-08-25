import React from 'react';
import { useCart } from '../../contexts/CartContext';
import AddToCartButton from './AddToCartButton';
import './CartDrawer.css';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  // Verificar si el item tiene la estructura esperada
  if (!item) {
    return <div className="cart-item">Error: Item no encontrado</div>;
  }
  
  // Determinar la estructura del producto según el formato del backend
  const product = item.products || item.product || item;
  const quantity = item.quantity || 0;
  const cartItemId = item.id; // ID del cart_item para eliminar/actualizar
  
  if (!product) {
    return <div className="cart-item">Error: Producto no encontrado</div>;
  }
  
  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img 
          src={product.image || product.image_url || '/placeholder.jpg'} 
          alt={product.title || product.name || 'Producto'} 
        />
      </div>
      
      <div className="cart-item-details">
        <h4 className="cart-item-title">{product.title || product.name || 'Producto sin nombre'}</h4>
        {product.brand && (
          <span className="cart-item-brand">{product.brand}</span>
        )}
        
        <div className="cart-item-price">
          <span className="price">R$ {(product.current_price || product.currentPrice || product.price || 0).toLocaleString('pt-BR', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}</span>
          {(product.original_price || product.originalPrice) && (product.original_price || product.originalPrice) > (product.current_price || product.currentPrice || product.price) && (
            <span className="original-price">
              R$ {(product.original_price || product.originalPrice).toLocaleString('pt-BR', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </span>
          )}
        </div>
        
        <div className="cart-item-actions">
          <div className="quantity-controls">
            <button 
              className="quantity-btn"
              onClick={() => onUpdateQuantity(cartItemId, quantity - 1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="quantity">{quantity}</span>
            <button 
              className="quantity-btn"
              onClick={() => onUpdateQuantity(cartItemId, quantity + 1)}
            >
              +
            </button>
          </div>
          
          <button 
            className="remove-btn"
            onClick={() => onRemove(cartItemId)}
            title="Remover item"
          >
            🗑️
          </button>
        </div>
        
        <div className="cart-item-total">
          <strong>
            Total: R$ {((product.current_price || product.currentPrice || product.price || 0) * quantity).toLocaleString('pt-BR', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </strong>
        </div>
      </div>
    </div>
  );
};

const CartDrawer = ({ isOpen, onClose }) => {
  const { 
    cartItems, 
    totalItems, 
    cartTotal, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    loading 
  } = useCart();

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity > 0) {
      await updateQuantity(cartItemId, newQuantity);
    } else {
      // Si la cantidad es 0, eliminar el item
      await removeFromCart(cartItemId);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    await removeFromCart(cartItemId);
  };

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    // TODO: Implementar checkout
    console.log('Proceder al checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-drawer-overlay" onClick={onClose}></div>
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h3>Carrinho de Compras</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="cart-drawer-content">
          {loading && (
            <div className="cart-loading">
              <span>Cargando...</span>
            </div>
          )}
          
          {!loading && cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h4>Tu carrito está vacío</h4>
              <p>Agrega productos para comenzar a comprar</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item, index) => (
                  <CartItem
                    key={item.id || item.productId || item.product_id || `cart-item-${index}`}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="cart-stats">
                  <div className="stat">
                    <span>Items: {totalItems}</span>
                  </div>
                  <div className="stat total">
                    <span>Total: R$ {cartTotal.toLocaleString('pt-BR', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}</span>
                  </div>
                </div>
                
                <div className="cart-actions">
                  <button 
                    className="clear-cart-btn"
                    onClick={handleClearCart}
                    disabled={loading}
                  >
                    Vaciar Carrito
                  </button>
                  <button 
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    Finalizar Compra
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;

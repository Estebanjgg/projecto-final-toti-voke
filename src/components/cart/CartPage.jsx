import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAlert } from '../../contexts/AlertContext';
import './CartPage.css';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  if (!item) {
    return <div className="cart-item">Erro: Item não encontrado</div>;
  }
  
  const product = item.products || item.product || item;
  const quantity = item.quantity || 0;
  const cartItemId = item.id;
  
  if (!product) {
    return <div className="cart-item">Erro: Produto não encontrado</div>;
  }
  
  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img 
          src={product.image || product.image_url || '/placeholder.jpg'} 
          alt={product.title || product.name || 'Produto'} 
        />
      </div>
      
      <div className="cart-item-details">
        <h4 className="cart-item-title">{product.title || product.name || 'Produto sem nome'}</h4>
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
        
        <div className="cart-item-stock-info">
          {product.stock !== undefined && (
            <span className={`stock-info ${product.stock === 0 ? 'out-of-stock' : product.stock < 5 ? 'low-stock' : ''}`}>
              {product.stock === 0 ? 'Esgotado' : 
               product.stock < 5 ? `Apenas ${product.stock} unidades` : 
               'Em estoque'}
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
              disabled={product.stock !== undefined && quantity >= product.stock}
            >
              +
            </button>
          </div>
          
          <button 
            className="remove-btn"
            onClick={() => onRemove(cartItemId)}
            title="Remover item"
          >
            <span>🗑️</span>
            <span className="remove-text">Remover</span>
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

const CartPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useAlert();
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
    try {
      if (newQuantity > 0) {
        await updateQuantity(cartItemId, newQuantity);
        showSuccess('Quantidade atualizada com sucesso!');
      } else {
        await removeFromCart(cartItemId);
        showSuccess('Item removido do carrinho!');
      }
    } catch (error) {
      showError('Erro ao atualizar quantidade');
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      showSuccess('Item removido do carrinho!');
    } catch (error) {
      showError('Erro ao remover item');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Tem certeza de que deseja esvaziar o carrinho?')) {
      try {
        await clearCart();
        showSuccess('Carrinho esvaziado com sucesso!');
      } catch (error) {
        showError('Erro ao esvaziar carrinho');
      }
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showError('Seu carrinho está vazio');
      return;
    }
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-loading">
            <span>Carregando carrinho...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Meu Carrinho</h1>
          <button 
            className="continue-shopping-btn"
            onClick={handleContinueShopping}
          >
            ← Continuar Comprando
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Seu carrinho está vazio</h2>
            <p>Que tal explorar nossos produtos e adicionar alguns itens?</p>
            <button 
              className="shop-now-btn"
              onClick={handleContinueShopping}
            >
              Explorar Produtos
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-section">
              <div className="cart-items-header">
                <h2>Itens no Carrinho ({totalItems})</h2>
                <button 
                  className="clear-cart-btn"
                  onClick={handleClearCart}
                  disabled={loading}
                >
                  Esvaziar Carrinho
                </button>
              </div>
              
              <div className="cart-items-list">
                {cartItems.map((item, index) => (
                  <CartItem
                    key={item.id || item.productId || item.product_id || `cart-item-${index}`}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </div>
            
            <div className="cart-summary-section">
              <div className="cart-summary">
                <h3>Resumo do Pedido</h3>
                
                <div className="summary-row">
                  <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                  <span>R$ {cartTotal.toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}</span>
                </div>
                
                <div className="summary-row">
                  <span>Frete</span>
                  <span>Calculado no checkout</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total">
                  <span><strong>Total</strong></span>
                  <span><strong>R$ {cartTotal.toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}</strong></span>
                </div>
                
                <div className="cart-actions">
                  <button 
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    Finalizar Compra
                  </button>
                  <button 
                    className="continue-shopping-secondary-btn"
                    onClick={handleContinueShopping}
                  >
                    Continuar Comprando
                  </button>
                </div>
                
                <div className="security-info">
                  <p>🔒 Compra 100% segura e protegida</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

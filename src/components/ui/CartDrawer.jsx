import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import AddToCartButton from './AddToCartButton';
import ConfirmationModal from './ConfirmationModal';
import './CartDrawer.css';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  // Verificar se o item tem a estrutura esperada
  if (!item) {
    return <div className="cart-item">Erro: Item não encontrado</div>;
  }
  
  // Determinar a estrutura do produto segundo o formato do backend
  const product = item.products || item.product || item;
  const quantity = item.quantity || 0;
  const cartItemId = item.id; // ID do cart_item para eliminar/atualizar
  
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
  const navigate = useNavigate();
  const { 
    cartItems, 
    totalItems, 
    cartTotal, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    loading 
  } = useCart();

  // Estado para controlar o modal de confirmação
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null
  });

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity > 0) {
      await updateQuantity(cartItemId, newQuantity);
    } else {
      // Se a quantidade é 0, eliminar o item
      await removeFromCart(cartItemId);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    await removeFromCart(cartItemId);
  };

  const handleClearCart = () => {
    setConfirmModal({
      isOpen: true,
      type: 'danger',
      title: 'Esvaziar Carrinho',
      message: 'Tem certeza que deseja remover todos os produtos do seu carrinho? Esta ação não pode ser desfeita.',
      onConfirm: async () => {
        await clearCart();
      }
    });
  };

  const handleCheckout = () => {
    // Verificar que há items no carrinho
    if (cartItems.length === 0) {
      setConfirmModal({
        isOpen: true,
        type: 'info',
        title: 'Carrinho Vazio',
        message: 'Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.',
        onConfirm: () => {
          // Só fechar o modal
        }
      });
      return;
    }
    
    // Fechar o drawer do carrinho
    onClose();
    
    // Navegar para a página de checkout
    navigate('/checkout');
  };

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
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
              <span>Carregando...</span>
            </div>
          )}
          
          {!loading && cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h4>Seu carrinho está vazio</h4>
              <p>Adicione produtos para começar a comprar</p>
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
                    <span>Itens: {totalItems}</span>
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
                    Esvaziar Carrinho
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

      {/* Modal de Confirmação */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.type === 'info' ? 'Entendi' : 'Sim, confirmar'}
        cancelText="Cancelar"
      />
    </>
  );
};

export default CartDrawer;

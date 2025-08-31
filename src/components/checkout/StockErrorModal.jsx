import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import './StockErrorModal.css';

const StockErrorModal = ({ 
  isOpen, 
  onClose, 
  stockErrors = [], 
  onUpdateCart,
  onRetryCheckout 
}) => {
  const navigate = useNavigate();
  const { removeFromCart, updateQuantity } = useCart();

  if (!isOpen) return null;

  const handleGoToCart = () => {
    onClose();
    navigate('/cart');
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/');
  };

  const handleRemoveUnavailableItems = async () => {
    try {
      // Analisar os erros de estoque para identificar produtos esgotados
      const unavailableProductNames = stockErrors
        .filter(error => error.includes('esgotado'))
        .map(error => {
          // Extrair o nome do produto da mensagem de erro
          const match = error.match(/^(.+?) está esgotado$/);
          return match ? match[1] : null;
        })
        .filter(Boolean);
      
      // Aqui você pode implementar a lógica para remover produtos específicos
      // Por exemplo, buscar no carrinho pelos nomes dos produtos e removê-los
      
      onClose();
      if (onUpdateCart) {
        await onUpdateCart();
      }
    } catch (error) {
      console.error('Erro ao remover items:', error);
    }
  };

  return (
    <div className="stock-error-modal-overlay">
      <div className="stock-error-modal">
        <div className="stock-error-modal-header">
          <h2>⚠️ Problemas com Estoque</h2>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className="stock-error-modal-content">
          <p className="stock-error-description">
            Infelizmente, alguns produtos do seu carrinho não estão mais disponíveis 
            na quantidade desejada. Confira os detalhes abaixo:
          </p>

          <div className="stock-errors-list">
            {stockErrors.map((error, index) => (
              <div key={index} className="stock-error-item">
                <span className="error-icon">🚫</span>
                <span className="error-message">{error}</span>
              </div>
            ))}
          </div>

          <div className="stock-error-suggestions">
            <h3>O que você pode fazer:</h3>
            <ul>
              <li>
                <strong>Ajustar quantidades:</strong> Vá ao seu carrinho e reduza a quantidade 
                dos produtos com estoque limitado
              </li>
              <li>
                <strong>Remover produtos:</strong> Retire os produtos indisponíveis do seu carrinho
              </li>
              <li>
                <strong>Continuar comprando:</strong> Explore outros produtos similares em nossa loja
              </li>
            </ul>
          </div>
        </div>

        <div className="stock-error-modal-actions">
          <button 
            className="btn btn-outline"
            onClick={handleContinueShopping}
          >
            Continuar Comprando
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleGoToCart}
          >
            Ir ao Carrinho
          </button>
          {stockErrors.some(error => error.includes('esgotado')) && (
            <button 
              className="btn btn-warning"
              onClick={handleRemoveUnavailableItems}
            >
              Remover Esgotados
            </button>
          )}
          {onRetryCheckout && (
            <button 
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onRetryCheckout();
              }}
            >
              Tentar Novamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockErrorModal;

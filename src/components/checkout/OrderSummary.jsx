import React from 'react';

const OrderSummary = ({ cartItems, totals, selectedShipping }) => {
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="order-summary">
        <h3>Resumo do Pedido</h3>
        <p>Seu carrinho está vazio</p>
      </div>
    );
  }

  return (
    <div className="order-summary">
      <h3>Resumo do Pedido</h3>
      
      {/* Itens do carrinho */}
      <div className="order-items">
        {cartItems.map((item) => {
          const product = item.products || item.product || item;
          const quantity = item.quantity || 0;
          const price = product.current_price || product.currentPrice || product.price || 0;
          
          return (
            <div key={item.id || item.product_id} className="order-item">
              <div className="item-image">
                <img 
                  src={product.image || product.image_url || '/placeholder.jpg'} 
                  alt={product.title || product.name || 'Produto'}
                />
              </div>
              
              <div className="item-details">
                <h4 className="item-title">{product.title || product.name || 'Produto'}</h4>
                {product.brand && (
                  <span className="item-brand">{product.brand}</span>
                )}
                <div className="item-quantity">Quantidade: {quantity}</div>
              </div>
              
              <div className="item-price">
                <span className="unit-price">R$ {price.toFixed(2)}</span>
                <span className="total-price">R$ {(price * quantity).toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Totais */}
      <div className="order-totals">
        <div className="total-line">
          <span>Subtotal ({cartItems.length} itens)</span>
          <span>R$ {totals.subtotal.toFixed(2)}</span>
        </div>
        
        {totals.discount > 0 && (
          <div className="total-line discount">
            <span>Desconto</span>
            <span>-R$ {totals.discount.toFixed(2)}</span>
          </div>
        )}
        
        {selectedShipping && (
          <div className="total-line">
            <span>Entrega ({selectedShipping.name})</span>
            <span>R$ {selectedShipping.price.toFixed(2)}</span>
          </div>
        )}
        
        {totals.tax > 0 && (
          <div className="total-line">
            <span>Impostos</span>
            <span>R$ {totals.tax.toFixed(2)}</span>
          </div>
        )}
        
        <div className="total-line total-final">
          <span>Total</span>
          <span>R$ {totals.total.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Informações adicionais */}
      <div className="order-info">
        <div className="info-item">
          <span className="icon">🔒</span>
          <span>Pagamento seguro</span>
        </div>
        <div className="info-item">
          <span className="icon">🚚</span>
          <span>Entrega rápida</span>
        </div>
        <div className="info-item">
          <span className="icon">↩️</span>
          <span>Devolução fácil</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
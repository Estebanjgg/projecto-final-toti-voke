import React from 'react';

const OrderSummary = ({ cartItems, totals, selectedShipping }) => {
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="order-summary">
        <h3>Resumen del Pedido</h3>
        <p>Tu carrito está vacío</p>
      </div>
    );
  }

  return (
    <div className="order-summary">
      <h3>Resumen del Pedido</h3>
      
      {/* Items del carrito */}
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
                  alt={product.title || product.name || 'Producto'}
                />
              </div>
              
              <div className="item-details">
                <h4 className="item-title">{product.title || product.name || 'Producto'}</h4>
                {product.brand && (
                  <span className="item-brand">{product.brand}</span>
                )}
                <div className="item-quantity">Cantidad: {quantity}</div>
              </div>
              
              <div className="item-price">
                <span className="unit-price">R$ {price.toFixed(2)}</span>
                <span className="total-price">R$ {(price * quantity).toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Totales */}
      <div className="order-totals">
        <div className="total-line">
          <span>Subtotal ({cartItems.length} items)</span>
          <span>R$ {totals.subtotal.toFixed(2)}</span>
        </div>
        
        {totals.discount > 0 && (
          <div className="total-line discount">
            <span>Descuento</span>
            <span>-R$ {totals.discount.toFixed(2)}</span>
          </div>
        )}
        
        {selectedShipping && (
          <div className="total-line">
            <span>Envío ({selectedShipping.name})</span>
            <span>R$ {selectedShipping.price.toFixed(2)}</span>
          </div>
        )}
        
        {totals.tax > 0 && (
          <div className="total-line">
            <span>Impuestos</span>
            <span>R$ {totals.tax.toFixed(2)}</span>
          </div>
        )}
        
        <div className="total-line total-final">
          <span>Total</span>
          <span>R$ {totals.total.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Información adicional */}
      <div className="order-info">
        <div className="info-item">
          <span className="icon">🔒</span>
          <span>Pago seguro</span>
        </div>
        <div className="info-item">
          <span className="icon">🚚</span>
          <span>Envío rápido</span>
        </div>
        <div className="info-item">
          <span className="icon">↩️</span>
          <span>Devolución fácil</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
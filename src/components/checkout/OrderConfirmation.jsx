import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation = ({ order, paymentResult, onContinueShopping, onViewOrder, onViewMyOrders }) => {
  if (!order) {
    return (
      <div className="order-confirmation">
        <div className="error-state">
          <h2>Error</h2>
          <p>No se pudo cargar la información del pedido.</p>
          <Link to="/" className="btn btn-primary">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const getPaymentMethodName = (method) => {
    const methods = {
      'credit_card': 'Tarjeta de Crédito',
      'debit_card': 'Tarjeta de Débito',
      'pix': 'PIX',
      'boleto': 'Boleto Bancário'
    };
    return methods[method] || method;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#f39c12',
      'confirmed': '#27ae60',
      'processing': '#3498db',
      'shipped': '#9b59b6',
      'delivered': '#2ecc71',
      'cancelled': '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  const getStatusText = (status) => {
    const statuses = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmado',
      'processing': 'Procesando',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return statuses[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="order-confirmation">
      {/* Header de confirmación */}
      <div className="confirmation-header">
        <div className="success-icon">✅</div>
        <h1>¡Pedido Confirmado!</h1>
        <p className="order-number">Número de pedido: <strong>#{order.order_number || 'No disponible'}</strong></p>
        <p className="confirmation-message">
          Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando.
        </p>
      </div>

      {/* Estado del pedido */}
      <div className="order-status">
        <div className="status-badge" style={{ backgroundColor: getStatusColor(order.status || 'pending') }}>
          {getStatusText(order.status || 'pending')}
        </div>
        <p className="status-date">
          Pedido realizado el {formatDate(order.created_at)}
        </p>
      </div>

      {/* Información del pedido */}
      <div className="order-details">
        <div className="details-section">
          <h3>Resumen del Pedido</h3>
          <div className="order-summary">
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>R$ {(order.subtotal || 0).toFixed(2)}</span>
            </div>
            {(order.discount || 0) > 0 && (
              <div className="summary-line discount">
                <span>Descuento:</span>
                <span>-R$ {(order.discount || 0).toFixed(2)}</span>
              </div>
            )}
            <div className="summary-line">
              <span>Envío:</span>
              <span>R$ {(order.shipping || 0).toFixed(2)}</span>
            </div>
            {(order.tax || 0) > 0 && (
              <div className="summary-line">
                <span>Impuestos:</span>
                <span>R$ {(order.tax || 0).toFixed(2)}</span>
              </div>
            )}
            <div className="summary-line total">
              <span>Total:</span>
              <span>R$ {(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Información de pago */}
        <div className="details-section">
          <h3>Información de Pago</h3>
          <div className="payment-info">
            <p><strong>Método:</strong> {getPaymentMethodName(order.payment_method || 'N/A')}</p>
            <p><strong>Estado:</strong> 
              <span className={`payment-status ${order.payment_status || 'pending'}`}>
                {(order.payment_status || 'pending') === 'pending' ? 'Pendiente' : 
                 (order.payment_status || 'pending') === 'paid' ? 'Pagado' : 
                 (order.payment_status || 'pending') === 'failed' ? 'Falló' : (order.payment_status || 'pending')}
              </span>
            </p>
            
            {/* Mostrar información específica según el resultado del pago */}
            {paymentResult && paymentResult.payment_result && (
              <div className="payment-details">
                {paymentResult.payment_result.transaction_id && (
                  <p><strong>ID de Transacción:</strong> {paymentResult.payment_result.transaction_id}</p>
                )}
                
                {/* PIX específico */}
                {order.payment_method === 'pix' && paymentResult.payment_result.qr_code && (
                  <div className="pix-instructions">
                    <p><strong>Instrucciones PIX:</strong></p>
                    <p>Usa el código QR o la clave PIX para completar el pago.</p>
                    <div className="pix-details">
                      <p><strong>Clave PIX:</strong> <code>{paymentResult.payment_result.pix_key}</code></p>
                      <p><strong>Valor:</strong> R$ {(paymentResult.payment_result.amount || 0).toFixed(2)}</p>
                      <p><strong>Vence en:</strong> 15 minutos</p>
                    </div>
                    <button 
                      className="btn btn-outline"
                      onClick={() => {
                        // Simular confirmación de PIX después de 5 segundos
                        setTimeout(() => {
                          alert('PIX confirmado! (Simulación)');
                          window.location.reload();
                        }, 5000);
                      }}
                    >
                      Simular Pago PIX
                    </button>
                  </div>
                )}
                
                {/* Boleto específico */}
                {order.payment_method === 'boleto' && paymentResult.payment_result.boleto_number && (
                  <div className="boleto-instructions">
                    <p><strong>Instrucciones Boleto:</strong></p>
                    <div className="boleto-details">
                      <p><strong>Número:</strong> {paymentResult.payment_result.boleto_number}</p>
                      <p><strong>Código de barras:</strong></p>
                      <code className="barcode">{paymentResult.payment_result.barcode}</code>
                      <p><strong>Vencimiento:</strong> {formatDate(paymentResult.payment_result.due_date)}</p>
                    </div>
                    <div className="boleto-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          if (paymentResult.payment_result.download_url) {
                            window.open(paymentResult.payment_result.download_url, '_blank');
                          }
                        }}
                      >
                        Descargar Boleto
                      </button>
                      <button 
                        className="btn btn-outline"
                        onClick={() => {
                          // Simular confirmación de boleto
                          setTimeout(() => {
                            alert('Boleto pago confirmado! (Simulación)');
                            window.location.reload();
                          }, 3000);
                        }}
                      >
                        Simular Pago Boleto
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Tarjeta específico */}
                {(order.payment_method === 'credit_card' || order.payment_method === 'debit_card') && (
                  <div className="card-payment-details">
                    {paymentResult.payment_result.authorization_code && (
                      <p><strong>Código de autorización:</strong> {paymentResult.payment_result.authorization_code}</p>
                    )}
                    {paymentResult.payment_result.last_four_digits && (
                      <p><strong>Tarjeta terminada en:</strong> ***{paymentResult.payment_result.last_four_digits}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Información de envío */}
        <div className="details-section">
          <h3>Información de Envío</h3>
          <div className="shipping-info">
            {order.shipping_address && (
              <div className="address">
                <p><strong>Dirección:</strong></p>
                <p>{order.shipping_address.street}, {order.shipping_address.number}</p>
                {order.shipping_address.complement && (
                  <p>{order.shipping_address.complement}</p>
                )}
                <p>{order.shipping_address.neighborhood}</p>
                <p>{order.shipping_address.city} - {order.shipping_address.state}</p>
                <p>CEP: {order.shipping_address.postal_code}</p>
              </div>
            )}
            
            {order.estimated_delivery && (
              <p><strong>Entrega estimada:</strong> {formatDate(order.estimated_delivery)}</p>
            )}
          </div>
        </div>

        {/* Información de contacto */}
        <div className="details-section">
          <h3>Información de Contacto</h3>
          <div className="contact-info">
            <p><strong>Email:</strong> {order.customer_email || 'No disponible'}</p>
            {order.customer_phone && (
              <p><strong>Teléfono:</strong> {order.customer_phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Próximos pasos */}
      <div className="next-steps">
        <h3>Próximos Pasos</h3>
        <div className="steps-list">
          <div className="step">
            <span className="step-number">1</span>
            <div className="step-content">
              <h4>Confirmación por Email</h4>
              <p>Recibirás un email de confirmación con todos los detalles de tu pedido.</p>
            </div>
          </div>
          
          {(order.payment_status || 'pending') === 'pending' && (
            <div className="step">
              <span className="step-number">2</span>
              <div className="step-content">
                <h4>Completar Pago</h4>
                <p>Completa el pago siguiendo las instrucciones enviadas a tu email.</p>
              </div>
            </div>
          )}
          
          <div className="step">
            <span className="step-number">{(order.payment_status || 'pending') === 'pending' ? '3' : '2'}</span>
            <div className="step-content">
              <h4>Preparación del Pedido</h4>
              <p>Una vez confirmado el pago, prepararemos tu pedido para el envío.</p>
            </div>
          </div>
          
          <div className="step">
            <span className="step-number">{(order.payment_status || 'pending') === 'pending' ? '4' : '3'}</span>
            <div className="step-content">
              <h4>Envío y Entrega</h4>
              <p>Te notificaremos cuando tu pedido sea enviado con el código de rastreo.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="confirmation-actions">
        <button onClick={onViewMyOrders} className="btn btn-primary">
          Ver Mis Pedidos
        </button>
        <button onClick={onContinueShopping} className="btn btn-secondary">
          Continuar Comprando
        </button>
        <button 
          onClick={onViewOrder}
          className="btn btn-outline"
        >
          Ver Detalles del Pedido
        </button>
        <button 
          className="btn btn-outline"
          onClick={() => window.print()}
        >
          Imprimir Confirmación
        </button>
      </div>

      {/* Información de soporte */}
      <div className="support-info">
        <h4>¿Necesitas Ayuda?</h4>
        <p>
          Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos:
        </p>
        <div className="support-contacts">
          <p>📧 Email: soporte@tienda.com</p>
          <p>📞 Teléfono: (11) 1234-5678</p>
          <p>💬 Chat en vivo disponible 24/7</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
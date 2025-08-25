import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation = ({ order, paymentMethod }) => {
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
        <p className="order-number">Número de pedido: <strong>#{order.order_number}</strong></p>
        <p className="confirmation-message">
          Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando.
        </p>
      </div>

      {/* Estado del pedido */}
      <div className="order-status">
        <div className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
          {getStatusText(order.status)}
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
              <span>R$ {order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="summary-line discount">
                <span>Descuento:</span>
                <span>-R$ {order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-line">
              <span>Envío:</span>
              <span>R$ {order.shipping_cost.toFixed(2)}</span>
            </div>
            {order.tax > 0 && (
              <div className="summary-line">
                <span>Impuestos:</span>
                <span>R$ {order.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-line total">
              <span>Total:</span>
              <span>R$ {order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Información de pago */}
        <div className="details-section">
          <h3>Información de Pago</h3>
          <div className="payment-info">
            <p><strong>Método:</strong> {getPaymentMethodName(order.payment_method)}</p>
            <p><strong>Estado:</strong> 
              <span className={`payment-status ${order.payment_status}`}>
                {order.payment_status === 'pending' ? 'Pendiente' : 
                 order.payment_status === 'paid' ? 'Pagado' : 
                 order.payment_status === 'failed' ? 'Falló' : order.payment_status}
              </span>
            </p>
            
            {order.payment_method === 'pix' && order.payment_status === 'pending' && (
              <div className="pix-instructions">
                <p><strong>Instrucciones PIX:</strong></p>
                <p>Usa el código QR o la clave PIX que enviamos a tu email para completar el pago.</p>
                <div className="pix-code">
                  <p>Clave PIX: <code>{order.pix_code || 'Enviada por email'}</code></p>
                </div>
              </div>
            )}
            
            {order.payment_method === 'boleto' && order.payment_status === 'pending' && (
              <div className="boleto-instructions">
                <p><strong>Instrucciones Boleto:</strong></p>
                <p>El boleto fue enviado a tu email. Puedes pagarlo en cualquier banco, lotérica o por internet banking.</p>
                <p><strong>Vencimiento:</strong> {formatDate(order.boleto_due_date || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))}</p>
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
            <p><strong>Email:</strong> {order.customer_email}</p>
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
          
          {order.payment_status === 'pending' && (
            <div className="step">
              <span className="step-number">2</span>
              <div className="step-content">
                <h4>Completar Pago</h4>
                <p>Completa el pago siguiendo las instrucciones enviadas a tu email.</p>
              </div>
            </div>
          )}
          
          <div className="step">
            <span className="step-number">{order.payment_status === 'pending' ? '3' : '2'}</span>
            <div className="step-content">
              <h4>Preparación del Pedido</h4>
              <p>Una vez confirmado el pago, prepararemos tu pedido para el envío.</p>
            </div>
          </div>
          
          <div className="step">
            <span className="step-number">{order.payment_status === 'pending' ? '4' : '3'}</span>
            <div className="step-content">
              <h4>Envío y Entrega</h4>
              <p>Te notificaremos cuando tu pedido sea enviado con el código de rastreo.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="confirmation-actions">
        <Link to="/orders" className="btn btn-primary">
          Ver Mis Pedidos
        </Link>
        <Link to="/" className="btn btn-secondary">
          Continuar Comprando
        </Link>
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
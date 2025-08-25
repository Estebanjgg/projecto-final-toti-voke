import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { checkoutAPI } from '../../services/checkoutAPI';
import { paymentsAPI } from '../../services/paymentsAPI';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import PaymentMethods from './PaymentMethods';
import ShippingOptions from './ShippingOptions';
import OrderConfirmation from './OrderConfirmation';
import PaymentProcessing from './PaymentProcessing';
import './Checkout.css';

const CHECKOUT_STEPS = {
  SHIPPING: 'shipping',
  PAYMENT: 'payment',
  REVIEW: 'review',
  PROCESSING: 'processing',
  CONFIRMATION: 'confirmation'
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartSummary, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showError, showSuccess } = useAlert();

  const [currentStep, setCurrentStep] = useState(CHECKOUT_STEPS.SHIPPING);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    customer_name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : '',
    customer_email: user?.email || '',
    customer_phone: user?.phone || '',
    shipping_address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Brasil'
    },
    billing_address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Brasil'
    },
    same_as_shipping: true,
    payment_method: '',
    notes: '',
    shipping: 0,
    tax: 0
  });

  const [shippingOptions, setShippingOptions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentData, setPaymentData] = useState({});
  const [orderResult, setOrderResult] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  // Verificar que hay items en el carrito
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      showError('Tu carrito está vacío');
      navigate('/');
    }
  }, [cartItems, navigate, showError]);

  // Cargar métodos de pago al montar el componente
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await checkoutAPI.getPaymentMethods();
      setPaymentMethods(response.data);
    } catch (error) {
      console.error('Error cargando métodos de pago:', error);
    }
  };

  const loadShippingOptions = async (postalCode) => {
    try {
      setLoading(true);
      const response = await checkoutAPI.getShippingOptions(postalCode);
      setShippingOptions(response.data);
    } catch (error) {
      console.error('Error cargando opciones de envío:', error);
      showError('Error al cargar opciones de envío');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar errores de validación para este campo
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddressChange = (addressType, field, value) => {
    setFormData(prev => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [field]: value
      }
    }));

    // Cargar opciones de envío cuando se complete el código postal
    if (addressType === 'shipping_address' && field === 'postal_code' && value.length >= 8) {
      loadShippingOptions(value);
    }
  };

  const handleShippingSelect = (shipping) => {
    setSelectedShipping(shipping);
    setFormData(prev => ({
      ...prev,
      shipping: shipping.price
    }));
  };

  const validateCurrentStep = async () => {
    try {
      setLoading(true);
      
      // Preparar datos para validación
      const dataToValidate = { ...formData };
      
      // Si same_as_shipping es true, copiar shipping_address a billing_address
      if (formData.same_as_shipping) {
        dataToValidate.billing_address = { ...formData.shipping_address };
      }
      
      // Validación específica por paso
      if (currentStep === CHECKOUT_STEPS.PAYMENT) {
        if (!selectedPaymentMethod) {
          showError('Por favor selecciona un método de pago');
          return false;
        }
        
        // Validar datos del método de pago seleccionado
        if ((selectedPaymentMethod === 'credit_card' || selectedPaymentMethod === 'debit_card')) {
          if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardName) {
            showError('Por favor completa todos los datos de la tarjeta');
            return false;
          }
        }
        
        // Actualizar datos con el método de pago
        dataToValidate.payment_method = selectedPaymentMethod;
      }
      
      const response = await checkoutAPI.validateCheckout(dataToValidate);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error.message && error.message.includes('Datos de checkout inválidos')) {
        setValidationErrors(error.errors || {});
      } else {
        showError(error.message || 'Error en la validación');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    switch (currentStep) {
      case CHECKOUT_STEPS.SHIPPING:
        setCurrentStep(CHECKOUT_STEPS.PAYMENT);
        break;
      case CHECKOUT_STEPS.PAYMENT:
        setCurrentStep(CHECKOUT_STEPS.REVIEW);
        break;
      case CHECKOUT_STEPS.REVIEW:
        await handleCreateOrder();
        break;
      default:
        break;
    }
  };

  const handlePrevStep = () => {
    switch (currentStep) {
      case CHECKOUT_STEPS.PAYMENT:
        setCurrentStep(CHECKOUT_STEPS.SHIPPING);
        break;
      case CHECKOUT_STEPS.REVIEW:
        setCurrentStep(CHECKOUT_STEPS.PAYMENT);
        break;
      default:
        break;
    }
  };

  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      setCurrentStep(CHECKOUT_STEPS.PROCESSING);
      
      // Preparar datos para la orden
      const orderData = { ...formData };
      
      // Si same_as_shipping es true, copiar shipping_address a billing_address
      if (formData.same_as_shipping) {
        orderData.billing_address = { ...formData.shipping_address };
      }
      
      // Asegurar que el payment_method esté incluido
      orderData.payment_method = selectedPaymentMethod;
      
      // Paso 1: Crear la orden
      const response = await checkoutAPI.createOrder(orderData);
      const order = response.data.order;
      setOrderResult(order);
      
      // Paso 2: Procesar el pago
      const paymentRequestData = {
        order_id: order.id,
        payment_method: selectedPaymentMethod,
        payment_data: paymentData
      };
      
      const paymentResponse = await paymentsAPI.processPayment(paymentRequestData);
      setPaymentResult(paymentResponse.data);
      
      // Paso 3: Manejar el resultado del pago
      if (paymentResponse.data.payment_result.status === 'approved') {
        // Pago aprobado inmediatamente (tarjetas)
        showSuccess('¡Pago procesado exitosamente! Tu pedido ha sido confirmado.');
        await clearCart();
        setCurrentStep(CHECKOUT_STEPS.CONFIRMATION);
      } else if (paymentResponse.data.payment_result.status === 'pending') {
        // Pago pendiente (PIX, Boleto)
        showSuccess('¡Orden creada exitosamente! Completa el pago para confirmar tu pedido.');
        await clearCart();
        setCurrentStep(CHECKOUT_STEPS.CONFIRMATION);
      } else {
        throw new Error('Error en el procesamiento del pago');
      }
      
    } catch (error) {
      console.error('Error en el checkout:', error);
      showError(error.message || 'Error al procesar el pedido');
      // Volver al paso de revisión si hay error
      setCurrentStep(CHECKOUT_STEPS.REVIEW);
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case CHECKOUT_STEPS.SHIPPING:
        return 'Información de Envío';
      case CHECKOUT_STEPS.PAYMENT:
        return 'Método de Pago';
      case CHECKOUT_STEPS.REVIEW:
        return 'Revisar Orden';
      case CHECKOUT_STEPS.CONFIRMATION:
        return 'Confirmación';
      default:
        return 'Checkout';
    }
  };

  const calculateTotal = () => {
    const subtotal = cartSummary?.subtotal || 0;
    const discount = cartSummary?.totalDiscount || 0;
    const shipping = formData.shipping || 0;
    const tax = formData.tax || 0;
    
    return {
      subtotal,
      discount,
      shipping,
      tax,
      total: subtotal + shipping + tax
    };
  };

  if (currentStep === CHECKOUT_STEPS.CONFIRMATION && orderResult) {
    return (
      <OrderConfirmation 
        order={orderResult}
        paymentResult={paymentResult}
        onContinueShopping={() => navigate('/')}
        onViewOrder={() => navigate(`/orders`)}
        onViewMyOrders={() => navigate('/orders')}
      />
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Finalizar Compra</h1>
        
        {/* Progress indicator */}
        <div className="checkout-progress">
          <div className={`step ${currentStep === CHECKOUT_STEPS.SHIPPING ? 'active' : 'completed'}`}>
            <span className="step-number">1</span>
            <span className="step-label">Envío</span>
          </div>
          <div className={`step ${currentStep === CHECKOUT_STEPS.PAYMENT ? 'active' : currentStep === CHECKOUT_STEPS.REVIEW ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Pago</span>
          </div>
          <div className={`step ${currentStep === CHECKOUT_STEPS.REVIEW ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Revisar</span>
          </div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-main">
          <div className="checkout-step">
            <h2>{getStepTitle()}</h2>
            
            {currentStep === CHECKOUT_STEPS.SHIPPING && (
              <>
                <CheckoutForm
                  formData={formData}
                  validationErrors={validationErrors}
                  onFormChange={handleFormChange}
                  onAddressChange={handleAddressChange}
                />
                
                {shippingOptions.length > 0 && (
                  <ShippingOptions
                    options={shippingOptions}
                    selected={selectedShipping}
                    onSelect={handleShippingSelect}
                  />
                )}
              </>
            )}

            {currentStep === CHECKOUT_STEPS.PAYMENT && (
              <PaymentMethods
                selectedMethod={selectedPaymentMethod}
                onMethodChange={setSelectedPaymentMethod}
                paymentData={paymentData}
                onPaymentDataChange={setPaymentData}
              />
            )}

            {currentStep === CHECKOUT_STEPS.PROCESSING && (
              <PaymentProcessing 
                paymentMethod={selectedPaymentMethod}
                orderNumber={orderResult?.order_number}
              />
            )}

            {currentStep === CHECKOUT_STEPS.REVIEW && (
              <div className="order-review">
                <h3>Revisar tu orden</h3>
                <div className="review-section">
                  <h4>Información de contacto</h4>
                  <p><strong>Nombre:</strong> {formData.customer_name}</p>
                  <p><strong>Email:</strong> {formData.customer_email}</p>
                  <p><strong>Teléfono:</strong> {formData.customer_phone}</p>
                </div>
                
                <div className="review-section">
                  <h4>Dirección de envío</h4>
                  <p>
                    {formData.shipping_address.street} {formData.shipping_address.number}
                    {formData.shipping_address.complement && `, ${formData.shipping_address.complement}`}
                  </p>
                  <p>
                    {formData.shipping_address.neighborhood}, {formData.shipping_address.city}
                  </p>
                  <p>
                    {formData.shipping_address.state} - {formData.shipping_address.postal_code}
                  </p>
                </div>
                
                <div className="review-section">
                  <h4>Método de pago</h4>
                  <p>{paymentMethods.find(m => m.id === formData.payment_method)?.name}</p>
                </div>
                
                {selectedShipping && (
                  <div className="review-section">
                    <h4>Envío</h4>
                    <p>{selectedShipping.name} - R$ {selectedShipping.price.toFixed(2)}</p>
                    <p>{selectedShipping.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="checkout-navigation">
            {currentStep !== CHECKOUT_STEPS.SHIPPING && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handlePrevStep}
                disabled={loading}
              >
                Anterior
              </button>
            )}
            
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleNextStep}
              disabled={loading}
            >
              {loading ? 'Procesando...' : 
               currentStep === CHECKOUT_STEPS.REVIEW ? 'Crear Orden' : 'Siguiente'}
            </button>
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="checkout-sidebar">
          <OrderSummary
            cartItems={cartItems}
            totals={calculateTotal()}
            selectedShipping={selectedShipping}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
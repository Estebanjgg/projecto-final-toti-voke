import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { checkoutAPI } from '../../services/checkoutAPI';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import PaymentMethods from './PaymentMethods';
import ShippingOptions from './ShippingOptions';
import OrderConfirmation from './OrderConfirmation';
import './Checkout.css';

const CHECKOUT_STEPS = {
  SHIPPING: 'shipping',
  PAYMENT: 'payment',
  REVIEW: 'review',
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
    billing_address: null,
    same_as_shipping: true,
    payment_method: '',
    notes: '',
    shipping: 0,
    tax: 0
  });

  const [shippingOptions, setShippingOptions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [orderResult, setOrderResult] = useState(null);

  // Verificar que hay items en el carrito
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      showError('Tu carrito está vacío');
      navigate('/cart');
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
      const response = await checkoutAPI.validateCheckout(formData);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error.message && error.message.includes('Datos de checkout inválidos')) {
        // Manejar errores de validación específicos
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
      const response = await checkoutAPI.createOrder(formData);
      
      setOrderResult(response.data);
      setCurrentStep(CHECKOUT_STEPS.CONFIRMATION);
      
      // Limpiar carrito después de crear la orden exitosamente
      await clearCart();
      
      showSuccess('¡Orden creada exitosamente!');
    } catch (error) {
      showError(error.message || 'Error al crear la orden');
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
        onContinueShopping={() => navigate('/')}
        onViewOrder={() => navigate(`/orders/${orderResult.order_number}`)}
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
                methods={paymentMethods}
                selected={formData.payment_method}
                onSelect={(method) => handleFormChange('payment_method', method)}
                validationError={validationErrors.payment_method}
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
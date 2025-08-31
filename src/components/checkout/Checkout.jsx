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

  // Verificar que há itens no carrinho
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      showError('Seu carrinho está vazio');
      navigate('/');
    }
  }, [cartItems, navigate, showError]);

  // Carregar métodos de pagamento ao montar o componente
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await checkoutAPI.getPaymentMethods();
      setPaymentMethods(response.data);
    } catch (error) {
      console.error('Erro carregando métodos de pagamento:', error);
    }
  };

  const loadShippingOptions = async (postalCode) => {
    try {
      setLoading(true);
      const response = await checkoutAPI.getShippingOptions(postalCode);
      setShippingOptions(response.data);
    } catch (error) {
      console.error('Erro carregando opções de envio:', error);
      showError('Erro ao carregar opções de envio');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erros de validação para este campo
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

    // Carregar opções de envio quando completar o código postal
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
      
      // Preparar dados para validação
      const dataToValidate = { ...formData };
      
      // Se same_as_shipping for true, copiar shipping_address para billing_address
      if (formData.same_as_shipping) {
        dataToValidate.billing_address = { ...formData.shipping_address };
      }
      
      // Validação específica por passo
      if (currentStep === CHECKOUT_STEPS.PAYMENT) {
        if (!selectedPaymentMethod) {
          showError('Por favor selecione um método de pagamento');
          return false;
        }
        
        // Validar dados do método de pagamento selecionado
        if ((selectedPaymentMethod === 'credit_card' || selectedPaymentMethod === 'debit_card')) {
          if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardName) {
            showError('Por favor complete todos os dados do cartão');
            return false;
          }
        }
        
        // Atualizar dados com o método de pagamento
        dataToValidate.payment_method = selectedPaymentMethod;
      }
      
      const response = await checkoutAPI.validateCheckout(dataToValidate);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error.message && error.message.includes('Dados de checkout inválidos')) {
        setValidationErrors(error.errors || {});
      } else {
        showError(error.message || 'Erro na validação');
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
      
      // Preparar dados para o pedido
      const orderData = { ...formData };
      
      // Se same_as_shipping for true, copiar shipping_address para billing_address
      if (formData.same_as_shipping) {
        orderData.billing_address = { ...formData.shipping_address };
      }
      
      // Assegurar que o payment_method esteja incluído
      orderData.payment_method = selectedPaymentMethod;
      
      // Passo 1: Criar o pedido
      const response = await checkoutAPI.createOrder(orderData);
      const order = response.data.order;
      setOrderResult(order);
      
      // Passo 2: Processar o pagamento
      const paymentRequestData = {
        order_id: order.id,
        payment_method: selectedPaymentMethod,
        payment_data: paymentData
      };
      
      const paymentResponse = await paymentsAPI.processPayment(paymentRequestData);
      setPaymentResult(paymentResponse.data);
      
      // Passo 3: Tratar o resultado do pagamento
      if (paymentResponse.data.payment_result.status === 'approved') {
        // Pagamento aprovado imediatamente (cartões)
        showSuccess('Pagamento processado com sucesso! Seu pedido foi confirmado.');
        await clearCart();
        setCurrentStep(CHECKOUT_STEPS.CONFIRMATION);
      } else if (paymentResponse.data.payment_result.status === 'pending') {
        // Pagamento pendente (PIX, Boleto)
        showSuccess('Pedido criado com sucesso! Complete o pagamento para confirmar seu pedido.');
        await clearCart();
        setCurrentStep(CHECKOUT_STEPS.CONFIRMATION);
      } else {
        throw new Error('Erro no processamento do pagamento');
      }
      
    } catch (error) {
      console.error('Erro no checkout:', error);
      showError(error.message || 'Erro ao processar o pedido');
      // Voltar ao passo de revisão se houver erro
      setCurrentStep(CHECKOUT_STEPS.REVIEW);
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case CHECKOUT_STEPS.SHIPPING:
        return 'Informações de Envio';
      case CHECKOUT_STEPS.PAYMENT:
        return 'Método de Pagamento';
      case CHECKOUT_STEPS.REVIEW:
        return 'Revisar Pedido';
      case CHECKOUT_STEPS.CONFIRMATION:
        return 'Confirmação';
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
            <span className="step-label">Envio</span>
          </div>
          <div className={`step ${currentStep === CHECKOUT_STEPS.PAYMENT ? 'active' : currentStep === CHECKOUT_STEPS.REVIEW ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Pagamento</span>
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
                <h3>Revisar seu pedido</h3>
                <div className="review-section">
                  <h4>Informações de contato</h4>
                  <p><strong>Nome:</strong> {formData.customer_name}</p>
                  <p><strong>Email:</strong> {formData.customer_email}</p>
                  <p><strong>Telefone:</strong> {formData.customer_phone}</p>
                </div>
                
                <div className="review-section">
                  <h4>Endereço de entrega</h4>
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
                  <h4>Método de pagamento</h4>
                  <p>{paymentMethods.find(m => m.id === formData.payment_method)?.name}</p>
                </div>
                
                {selectedShipping && (
                  <div className="review-section">
                    <h4>Entrega</h4>
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
              {loading ? 'Processando...' : 
               currentStep === CHECKOUT_STEPS.REVIEW ? 'Criar Pedido' : 'Próximo'}
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
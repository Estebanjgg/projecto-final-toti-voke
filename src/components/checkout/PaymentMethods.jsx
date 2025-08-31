import React, { useState, useEffect } from 'react';
import { checkoutAPI } from '../../services/checkoutAPI';

const PaymentMethods = ({ selectedMethod, onMethodChange, paymentData, onPaymentDataChange }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const response = await checkoutAPI.getPaymentMethods();
        // La respuesta del backend viene en response.data
        setPaymentMethods(response.data || []);
      } catch (err) {
        console.error('Erro ao carregar métodos de pagamento:', err);
        setError('Erro ao carregar métodos de pagamento');
        // Métodos de pagamento padrão em caso de erro
        setPaymentMethods([
          { id: 'credit_card', name: 'Cartão de Crédito', icon: '💳' },
          { id: 'debit_card', name: 'Cartão de Débito', icon: '💳' },
          { id: 'pix', name: 'PIX', icon: '📱' },
          { id: 'boleto', name: 'Boleto Bancário', icon: '🧾' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleMethodSelect = (methodId) => {
    onMethodChange(methodId);
    // Limpar dados de pagamento quando mudar o método
    onPaymentDataChange({});
  };

  const handlePaymentDataChange = (field, value) => {
    onPaymentDataChange({
      ...paymentData,
      [field]: value
    });
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (loading) {
    return (
      <div className="payment-methods">
        <h3>Método de Pagamento</h3>
        <div className="loading">Carregando métodos de pagamento...</div>
      </div>
    );
  }

  return (
    <div className="payment-methods">
      <h3>Método de Pagamento</h3>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {/* Seleção de método de pagamento */}
      <div className="payment-options">
        {Array.isArray(paymentMethods) && paymentMethods.map((method) => (
          <div 
            key={method.id} 
            className={`payment-option ${selectedMethod === method.id ? 'selected' : ''}`}
            onClick={() => handleMethodSelect(method.id)}
          >
            <span className="payment-icon">{method.icon}</span>
            <span className="payment-name">{method.name}</span>
            <span className="payment-radio">
              <input 
                type="radio" 
                name="paymentMethod" 
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => handleMethodSelect(method.id)}
              />
            </span>
          </div>
        ))}
      </div>
      
      {/* Formulário específico conforme o método selecionado */}
      {selectedMethod && (
        <div className="payment-form">
          {(selectedMethod === 'credit_card' || selectedMethod === 'debit_card') && (
            <div className="card-form">
              <div className="form-group">
                <label htmlFor="cardNumber">Número do Cartão</label>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber || ''}
                  onChange={(e) => handlePaymentDataChange('cardNumber', formatCardNumber(e.target.value))}
                  maxLength="19"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Data de Vencimento</label>
                  <input
                    type="text"
                    id="expiryDate"
                    placeholder="MM/AA"
                    value={paymentData.expiryDate || ''}
                    onChange={(e) => handlePaymentDataChange('expiryDate', formatExpiryDate(e.target.value))}
                    maxLength="5"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    placeholder="123"
                    value={paymentData.cvv || ''}
                    onChange={(e) => handlePaymentDataChange('cvv', e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength="4"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="cardName">Nome no Cartão</label>
                <input
                  type="text"
                  id="cardName"
                  placeholder="Nome completo"
                  value={paymentData.cardName || ''}
                  onChange={(e) => handlePaymentDataChange('cardName', e.target.value)}
                  required
                />
              </div>
              
              {selectedMethod === 'credit_card' && (
                <div className="form-group">
                  <label htmlFor="installments">Parcelas</label>
                  <select
                    id="installments"
                    value={paymentData.installments || '1'}
                    onChange={(e) => handlePaymentDataChange('installments', e.target.value)}
                  >
                    <option value="1">1x sem juros</option>
                    <option value="2">2x sem juros</option>
                    <option value="3">3x sem juros</option>
                    <option value="6">6x com juros</option>
                    <option value="12">12x com juros</option>
                  </select>
                </div>
              )}
            </div>
          )}
          
          {selectedMethod === 'pix' && (
            <div className="pix-form">
              <div className="pix-info">
                <p>🔹 Pagamento instantâneo</p>
                <p>🔹 Disponível 24/7</p>
                <p>🔹 Sem taxas adicionais</p>
              </div>
              <p className="pix-instructions">
                Após confirmar o pedido, você receberá um código QR para realizar o pagamento via PIX.
              </p>
            </div>
          )}
          
          {selectedMethod === 'boleto' && (
            <div className="boleto-form">
              <div className="boleto-info">
                <p>🔹 Vencimento em 3 dias úteis</p>
                <p>🔹 Pagamento em bancos, lotéricas ou internet banking</p>
                <p>🔹 Sem taxas adicionais</p>
              </div>
              <p className="boleto-instructions">
                O boleto será enviado por email após confirmar o pedido.
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Informações de segurança */}
      <div className="security-info">
        <div className="security-item">
          <span className="icon">🔒</span>
          <span>Transação 100% segura</span>
        </div>
        <div className="security-item">
          <span className="icon">🛡️</span>
          <span>Dados protegidos com SSL</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
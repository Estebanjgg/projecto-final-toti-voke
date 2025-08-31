import React, { useState } from 'react';
import { useCEPLookup } from '../../hooks/useCEPLookup';
import { formatCEP } from '../../services/cepAPI';

const CheckoutForm = ({ formData, validationErrors, onFormChange, onAddressChange }) => {
  const [cepMessages, setCepMessages] = useState({
    shipping: '',
    billing: ''
  });

  // Hook para busca automática de CEP
  const { loading: cepLoading, lookupCEP } = useCEPLookup(
    // Callback quando endereço é encontrado
    (addressData, addressType) => {
      const targetAddress = addressType === 'billing' ? 'billing_address' : 'shipping_address';
      
      // Preencher campos automaticamente
      onAddressChange(targetAddress, 'street', addressData.street);
      onAddressChange(targetAddress, 'neighborhood', addressData.neighborhood);
      onAddressChange(targetAddress, 'city', addressData.city);
      onAddressChange(targetAddress, 'state', addressData.state);
      
      // Mostrar mensagem de sucesso
      setCepMessages(prev => ({
        ...prev,
        [addressType]: '✅ Endereço encontrado automaticamente!'
      }));
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setCepMessages(prev => ({
          ...prev,
          [addressType]: ''
        }));
      }, 3000);
    },
    // Callback quando há erro
    (error, addressType) => {
      setCepMessages(prev => ({
        ...prev,
        [addressType]: `❌ ${error}`
      }));
      
      // Limpar mensagem de erro após 5 segundos
      setTimeout(() => {
        setCepMessages(prev => ({
          ...prev,
          [addressType]: ''
        }));
      }, 5000);
    }
  );
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  const handleAddressInputChange = (addressType) => (e) => {
    const { name, value } = e.target;
    onAddressChange(addressType, name, value);
  };

  const handleSameAsShippingChange = (e) => {
    const sameAsShipping = e.target.checked;
    onFormChange('same_as_shipping', sameAsShipping);
    
    if (sameAsShipping) {
      onFormChange('billing_address', null);
    } else {
      onFormChange('billing_address', {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Brasil'
      });
    }
  };

  const formatPostalCode = (value) => {
    // Usar a função centralizada do serviço
    return formatCEP(value);
  };

  const handlePostalCodeChange = (addressType) => (e) => {
    const formatted = formatPostalCode(e.target.value);
    const targetAddress = addressType === 'billing_address' ? 'billing_address' : 'shipping_address';
    
    // Atualizar o campo CEP
    onAddressChange(targetAddress, 'postal_code', formatted);
    
    // Buscar endereço automaticamente quando CEP estiver completo
    if (formatted.length === 9) { // XXXXX-XXX
      const addressTypeForLookup = targetAddress === 'billing_address' ? 'billing' : 'shipping';
      lookupCEP(formatted, addressTypeForLookup);
    } else {
      // Limpar mensagem se CEP incompleto
      const messageKey = targetAddress === 'billing_address' ? 'billing' : 'shipping';
      setCepMessages(prev => ({
        ...prev,
        [messageKey]: ''
      }));
    }
  };

  const formatPhone = (value) => {
    // Remover caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    // Aplicar máscara (XX) XXXXX-XXXX
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    onFormChange('customer_phone', formatted);
  };

  return (
    <div className="checkout-form">
      {/* Informações de contato */}
      <div className="form-section">
        <h3>Informações de Contato</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customer_name">Nome Completo *</label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleInputChange}
              className={validationErrors.customer_name ? 'error' : ''}
              placeholder="Seu nome completo"
              required
            />
            {validationErrors.customer_name && (
              <span className="error-message">{validationErrors.customer_name}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customer_email">Email *</label>
            <input
              type="email"
              id="customer_email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleInputChange}
              className={validationErrors.customer_email ? 'error' : ''}
              placeholder="seu@email.com"
              required
            />
            {validationErrors.customer_email && (
              <span className="error-message">{validationErrors.customer_email}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="customer_phone">Telefone *</label>
            <input
              type="tel"
              id="customer_phone"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handlePhoneChange}
              className={validationErrors.customer_phone ? 'error' : ''}
              placeholder="(11) 99999-9999"
              maxLength="15"
              required
            />
            {validationErrors.customer_phone && (
              <span className="error-message">{validationErrors.customer_phone}</span>
            )}
          </div>
        </div>
      </div>

      {/* Endereço de entrega */}
      <div className="form-section">
        <h3>Endereço de Entrega</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="shipping_postal_code">CEP *</label>
            <div className="cep-input-container">
              <input
                type="text"
                id="shipping_postal_code"
                name="postal_code"
                value={formData.shipping_address.postal_code}
                onChange={handlePostalCodeChange('shipping_address')}
                className={validationErrors['shipping_address.postal_code'] ? 'error' : ''}
                placeholder="00000-000"
                maxLength="9"
                required
              />
              {cepLoading && (
                <div className="cep-loading">🔍</div>
              )}
            </div>
            {validationErrors['shipping_address.postal_code'] && (
              <span className="error-message">{validationErrors['shipping_address.postal_code']}</span>
            )}
            {cepMessages.shipping && (
              <span className={`cep-message ${cepMessages.shipping.includes('✅') ? 'success' : 'error'}`}>
                {cepMessages.shipping}
              </span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group flex-2">
            <label htmlFor="shipping_street">Rua *</label>
            <input
              type="text"
              id="shipping_street"
              name="street"
              value={formData.shipping_address.street}
              onChange={handleAddressInputChange('shipping_address')}
              className={validationErrors['shipping_address.street'] ? 'error' : ''}
              placeholder="Nome da rua"
              required
            />
            {validationErrors['shipping_address.street'] && (
              <span className="error-message">{validationErrors['shipping_address.street']}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="shipping_number">Número *</label>
            <input
              type="text"
              id="shipping_number"
              name="number"
              value={formData.shipping_address.number}
              onChange={handleAddressInputChange('shipping_address')}
              className={validationErrors['shipping_address.number'] ? 'error' : ''}
              placeholder="123"
              required
            />
            {validationErrors['shipping_address.number'] && (
              <span className="error-message">{validationErrors['shipping_address.number']}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="shipping_complement">Complemento</label>
            <input
              type="text"
              id="shipping_complement"
              name="complement"
              value={formData.shipping_address.complement}
              onChange={handleAddressInputChange('shipping_address')}
              placeholder="Apto, bloco, etc."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="shipping_neighborhood">Bairro *</label>
            <input
              type="text"
              id="shipping_neighborhood"
              name="neighborhood"
              value={formData.shipping_address.neighborhood}
              onChange={handleAddressInputChange('shipping_address')}
              className={validationErrors['shipping_address.neighborhood'] ? 'error' : ''}
              placeholder="Nome do bairro"
              required
            />
            {validationErrors['shipping_address.neighborhood'] && (
              <span className="error-message">{validationErrors['shipping_address.neighborhood']}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="shipping_city">Cidade *</label>
            <input
              type="text"
              id="shipping_city"
              name="city"
              value={formData.shipping_address.city}
              onChange={handleAddressInputChange('shipping_address')}
              className={validationErrors['shipping_address.city'] ? 'error' : ''}
              placeholder="Nome da cidade"
              required
            />
            {validationErrors['shipping_address.city'] && (
              <span className="error-message">{validationErrors['shipping_address.city']}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="shipping_state">Estado *</label>
            <select
              id="shipping_state"
              name="state"
              value={formData.shipping_address.state}
              onChange={handleAddressInputChange('shipping_address')}
              className={validationErrors['shipping_address.state'] ? 'error' : ''}
              required
            >
              <option value="">Selecionar estado</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
            </select>
            {validationErrors['shipping_address.state'] && (
              <span className="error-message">{validationErrors['shipping_address.state']}</span>
            )}
          </div>
        </div>
      </div>

      {/* Endereço de cobrança */}
      <div className="form-section">
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.same_as_shipping}
              onChange={handleSameAsShippingChange}
            />
            <span className="checkmark"></span>
            O endereço de cobrança é o mesmo do endereço de entrega
          </label>
        </div>

        {!formData.same_as_shipping && formData.billing_address && (
          <>
            <h3>Endereço de Cobrança</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="billing_postal_code">CEP *</label>
                <div className="cep-input-container">
                  <input
                    type="text"
                    id="billing_postal_code"
                    name="postal_code"
                    value={formData.billing_address.postal_code}
                    onChange={handlePostalCodeChange('billing_address')}
                    className={validationErrors['billing_address.postal_code'] ? 'error' : ''}
                    placeholder="00000-000"
                    maxLength="9"
                    required
                  />
                  {cepLoading && (
                    <div className="cep-loading">🔍</div>
                  )}
                </div>
                {validationErrors['billing_address.postal_code'] && (
                  <span className="error-message">{validationErrors['billing_address.postal_code']}</span>
                )}
                {cepMessages.billing && (
                  <span className={`cep-message ${cepMessages.billing.includes('✅') ? 'success' : 'error'}`}>
                    {cepMessages.billing}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-2">
                <label htmlFor="billing_street">Rua *</label>
                <input
                  type="text"
                  id="billing_street"
                  name="street"
                  value={formData.billing_address.street}
                  onChange={handleAddressInputChange('billing_address')}
                  className={validationErrors['billing_address.street'] ? 'error' : ''}
                  placeholder="Nome da rua"
                  required
                />
                {validationErrors['billing_address.street'] && (
                  <span className="error-message">{validationErrors['billing_address.street']}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="billing_number">Número *</label>
                <input
                  type="text"
                  id="billing_number"
                  name="number"
                  value={formData.billing_address.number}
                  onChange={handleAddressInputChange('billing_address')}
                  className={validationErrors['billing_address.number'] ? 'error' : ''}
                  placeholder="123"
                  required
                />
                {validationErrors['billing_address.number'] && (
                  <span className="error-message">{validationErrors['billing_address.number']}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="billing_complement">Complemento</label>
                <input
                  type="text"
                  id="billing_complement"
                  name="complement"
                  value={formData.billing_address.complement}
                  onChange={handleAddressInputChange('billing_address')}
                  placeholder="Apto, bloco, etc."
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="billing_neighborhood">Bairro *</label>
                <input
                  type="text"
                  id="billing_neighborhood"
                  name="neighborhood"
                  value={formData.billing_address.neighborhood}
                  onChange={handleAddressInputChange('billing_address')}
                  className={validationErrors['billing_address.neighborhood'] ? 'error' : ''}
                  placeholder="Nome do bairro"
                  required
                />
                {validationErrors['billing_address.neighborhood'] && (
                  <span className="error-message">{validationErrors['billing_address.neighborhood']}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="billing_city">Cidade *</label>
                <input
                  type="text"
                  id="billing_city"
                  name="city"
                  value={formData.billing_address.city}
                  onChange={handleAddressInputChange('billing_address')}
                  className={validationErrors['billing_address.city'] ? 'error' : ''}
                  placeholder="Nome da cidade"
                  required
                />
                {validationErrors['billing_address.city'] && (
                  <span className="error-message">{validationErrors['billing_address.city']}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="billing_state">Estado *</label>
                <select
                  id="billing_state"
                  name="state"
                  value={formData.billing_address.state}
                  onChange={handleAddressInputChange('billing_address')}
                  className={validationErrors['billing_address.state'] ? 'error' : ''}
                  required
                >
                  <option value="">Selecionar estado</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
                {validationErrors['billing_address.state'] && (
                  <span className="error-message">{validationErrors['billing_address.state']}</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Notas adicionais */}
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="notes">Notas adicionais (opcional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Instruções especiais para a entrega..."
            rows="3"
            maxLength="500"
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
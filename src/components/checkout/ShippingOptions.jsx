import React, { useState, useEffect } from 'react';
import { checkoutAPI } from '../../services/checkoutAPI';

const ShippingOptions = ({ selectedOption, onOptionChange, shippingAddress }) => {
  const [shippingOptions, setShippingOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShippingOptions = async () => {
      if (!shippingAddress || !shippingAddress.postalCode) {
        setShippingOptions([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const options = await checkoutAPI.getShippingOptions(shippingAddress.postalCode);
        setShippingOptions(options);
        
        // Se não há opção selecionada, selecionar a primeira por padrão
        if (!selectedOption && options.length > 0) {
          onOptionChange(options[0]);
        }
      } catch (err) {
        console.error('Erro ao carregar opções de frete:', err);
        setError('Erro ao calcular opções de frete');
        // Opções de frete padrão em caso de erro
        const defaultOptions = [
          {
            id: 'standard',
            name: 'Frete Padrão',
            description: 'Entrega em 5-7 dias úteis',
            price: 15.00,
            estimatedDays: '5-7',
            icon: '📦'
          },
          {
            id: 'express',
            name: 'Frete Expresso',
            description: 'Entrega em 2-3 dias úteis',
            price: 25.00,
            estimatedDays: '2-3',
            icon: '🚀'
          }
        ];
        setShippingOptions(defaultOptions);
        if (!selectedOption) {
          onOptionChange(defaultOptions[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShippingOptions();
  }, [shippingAddress?.postalCode, selectedOption, onOptionChange]);

  const handleOptionSelect = (option) => {
    onOptionChange(option);
  };

  const formatDeliveryDate = (days) => {
    const today = new Date();
    const minDays = parseInt(days.split('-')[0]);
    const maxDays = parseInt(days.split('-')[1] || days);
    
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);
    
    const formatDate = (date) => {
      return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short'
      });
    };
    
    if (minDays === maxDays) {
      return formatDate(minDate);
    }
    
    return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
  };

  if (!shippingAddress || !shippingAddress.postalCode) {
    return (
      <div className="shipping-options">
        <h3>Opções de Frete</h3>
        <div className="no-address">
          <p>Por favor, complete o endereço de entrega para ver as opções disponíveis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shipping-options">
      <h3>Opções de Frete</h3>
      
      <div className="shipping-address-summary">
        <p><strong>Enviar para:</strong></p>
        <p>
          {shippingAddress.street}, {shippingAddress.number}
          {shippingAddress.complement && `, ${shippingAddress.complement}`}
        </p>
        <p>
          {shippingAddress.neighborhood}, {shippingAddress.city} - {shippingAddress.state}
        </p>
        <p>CEP: {shippingAddress.postalCode}</p>
      </div>
      
      {loading && (
        <div className="loading">
          <span className="loading-spinner">⏳</span>
          Calculando opções de frete...
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {!loading && shippingOptions.length > 0 && (
        <div className="shipping-list">
          {shippingOptions.map((option) => (
            <div 
              key={option.id} 
              className={`shipping-option ${selectedOption?.id === option.id ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(option)}
            >
              <div className="option-radio">
                <input 
                  type="radio" 
                  name="shippingOption" 
                  value={option.id}
                  checked={selectedOption?.id === option.id}
                  onChange={() => handleOptionSelect(option)}
                />
              </div>
              
              <div className="option-icon">
                {option.icon || '📦'}
              </div>
              
              <div className="option-details">
                <div className="option-name">{option.name}</div>
                <div className="option-description">{option.description}</div>
                <div className="option-delivery">
                  Entrega estimada: {formatDeliveryDate(option.estimatedDays)}
                </div>
              </div>
              
              <div className="option-price">
                {option.price === 0 ? (
                  <span className="free-shipping">GRATIS</span>
                ) : (
                  <span className="price">R$ {option.price.toFixed(2)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && shippingOptions.length === 0 && !error && (
        <div className="no-options">
          <p>Não há opções de frete disponíveis para este endereço.</p>
          <p>Por favor, verifique o endereço ou entre em contato com o suporte.</p>
        </div>
      )}
      
      {/* Informações adicionais */}
      <div className="shipping-info">
        <div className="info-item">
          <span className="icon">📍</span>
          <span>Rastreamento incluído em todos os fretes</span>
        </div>
        <div className="info-item">
          <span className="icon">📦</span>
          <span>Embalagem segura e protegida</span>
        </div>
        <div className="info-item">
          <span className="icon">🔄</span>
          <span>Trocas e devoluções fáceis</span>
        </div>
      </div>
    </div>
  );
};

export default ShippingOptions;
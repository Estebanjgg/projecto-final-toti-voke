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
        
        // Si no hay opción seleccionada, seleccionar la primera por defecto
        if (!selectedOption && options.length > 0) {
          onOptionChange(options[0]);
        }
      } catch (err) {
        console.error('Error al cargar opciones de envío:', err);
        setError('Error al calcular opciones de envío');
        // Opciones de envío por defecto en caso de error
        const defaultOptions = [
          {
            id: 'standard',
            name: 'Envío Estándar',
            description: 'Entrega en 5-7 días hábiles',
            price: 15.00,
            estimatedDays: '5-7',
            icon: '📦'
          },
          {
            id: 'express',
            name: 'Envío Express',
            description: 'Entrega en 2-3 días hábiles',
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
        <h3>Opciones de Envío</h3>
        <div className="no-address">
          <p>Por favor, completa la dirección de envío para ver las opciones disponibles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shipping-options">
      <h3>Opciones de Envío</h3>
      
      <div className="shipping-address-summary">
        <p><strong>Enviar a:</strong></p>
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
          Calculando opciones de envío...
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
          <p>No hay opciones de envío disponibles para esta dirección.</p>
          <p>Por favor, verifica la dirección o contacta con soporte.</p>
        </div>
      )}
      
      {/* Información adicional */}
      <div className="shipping-info">
        <div className="info-item">
          <span className="icon">📍</span>
          <span>Rastreo incluido en todos los envíos</span>
        </div>
        <div className="info-item">
          <span className="icon">📦</span>
          <span>Embalaje seguro y protegido</span>
        </div>
        <div className="info-item">
          <span className="icon">🔄</span>
          <span>Cambios y devoluciones fáciles</span>
        </div>
      </div>
    </div>
  );
};

export default ShippingOptions;
import React, { useState } from 'react';
import { fetchAddressByCEP, formatCEP, isValidCEP } from '../services/cepAPI';
import './TestCEP.css';

const TestCEP = () => {
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCepChange = (e) => {
    const formatted = formatCEP(e.target.value);
    setCep(formatted);
    
    // Limpar mensagens anteriores
    setError('');
    setAddress(null);
    
    // Buscar automaticamente quando CEP estiver completo
    if (formatted.length === 9 && isValidCEP(formatted)) {
      handleCepLookup(formatted);
    }
  };

  const handleCepLookup = async (cepToSearch) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await fetchAddressByCEP(cepToSearch);
      
      if (result.success) {
        setAddress(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro ao consultar CEP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-cep-container">
      <h2>🏠 Teste de Consulta CEP</h2>
      <p>Digite um CEP para testar a busca automática de endereço:</p>
      
      <div className="cep-test-form">
        <div className="form-group">
          <label htmlFor="test-cep">CEP:</label>
          <div className="cep-input-container">
            <input
              type="text"
              id="test-cep"
              value={cep}
              onChange={handleCepChange}
              placeholder="00000-000"
              maxLength="9"
            />
            {loading && <div className="cep-loading">🔍</div>}
          </div>
          
          {error && (
            <div className="cep-message error">
              ❌ {error}
            </div>
          )}
          
          {address && (
            <div className="cep-message success">
              ✅ Endereço encontrado!
            </div>
          )}
        </div>
        
        {address && (
          <div className="address-result">
            <h3>📍 Dados Encontrados:</h3>
            <div className="address-grid">
              <div className="address-item">
                <strong>CEP:</strong> {address.postal_code}
              </div>
              <div className="address-item">
                <strong>Logradouro:</strong> {address.street || 'Não informado'}
              </div>
              <div className="address-item">
                <strong>Bairro:</strong> {address.neighborhood || 'Não informado'}
              </div>
              <div className="address-item">
                <strong>Cidade:</strong> {address.city}
              </div>
              <div className="address-item">
                <strong>Estado:</strong> {address.state}
              </div>
              {address.complement && (
                <div className="address-item">
                  <strong>Complemento:</strong> {address.complement}
                </div>
              )}
              {address.ddd && (
                <div className="address-item">
                  <strong>DDD:</strong> {address.ddd}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="cep-examples">
          <h4>💡 CEPs para teste:</h4>
          <div className="example-ceps">
            <button onClick={() => setCep('01310-100')}>01310-100 (São Paulo - SP)</button>
            <button onClick={() => setCep('20040-020')}>20040-020 (Rio de Janeiro - RJ)</button>
            <button onClick={() => setCep('30130-010')}>30130-010 (Belo Horizonte - MG)</button>
            <button onClick={() => setCep('80010-000')}>80010-000 (Curitiba - PR)</button>
            <button onClick={() => setCep('90010-150')}>90010-150 (Porto Alegre - RS)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCEP;

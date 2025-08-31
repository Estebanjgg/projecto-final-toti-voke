import { useState, useCallback } from 'react';
import { fetchAddressByCEP, isValidCEP } from '../services/cepAPI';

/**
 * Hook para gerenciar consulta automática de CEP
 * @param {Function} onAddressFound - Callback chamado quando endereço é encontrado
 * @param {Function} onError - Callback chamado quando há erro
 * @returns {Object} Estado e funções do hook
 */
export const useCEPLookup = (onAddressFound, onError) => {
  const [loading, setLoading] = useState(false);
  const [lastSearchedCEP, setLastSearchedCEP] = useState('');

  /**
   * Buscar endereço pelo CEP
   * @param {string} cep - CEP a ser consultado
   * @param {string} addressType - Tipo de endereço ('shipping' ou 'billing')
   */
  const lookupCEP = useCallback(async (cep, addressType = 'shipping') => {
    // Limpar CEP e validar
    const cleanCEP = cep.replace(/\D/g, '');
    
    // Não fazer nova busca se for o mesmo CEP
    if (cleanCEP === lastSearchedCEP) {
      return;
    }

    // Validar se CEP tem 8 dígitos
    if (!isValidCEP(cep)) {
      if (cleanCEP.length > 0) {
        onError?.('CEP deve conter 8 dígitos', addressType);
      }
      return;
    }

    try {
      setLoading(true);
      setLastSearchedCEP(cleanCEP);

      const result = await fetchAddressByCEP(cep);

      if (result.success) {
        // Sucesso: chamar callback com os dados
        onAddressFound?.(result.data, addressType);
      } else {
        // Erro na API
        onError?.(result.error || 'CEP não encontrado', addressType);
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      onError?.('Erro ao consultar CEP. Tente novamente.', addressType);
    } finally {
      setLoading(false);
    }
  }, [lastSearchedCEP, onAddressFound, onError]);

  /**
   * Limpar estado da busca
   */
  const clearSearch = useCallback(() => {
    setLastSearchedCEP('');
    setLoading(false);
  }, []);

  return {
    loading,
    lookupCEP,
    clearSearch,
    lastSearchedCEP
  };
};

export default useCEPLookup;

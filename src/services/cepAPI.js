/**
 * Serviço para consulta de CEP usando a API ViaCEP
 */

const CEP_API_BASE_URL = 'https://viacep.com.br/ws';

/**
 * Busca informações de endereço pelo CEP
 * @param {string} cep - CEP no formato XXXXX-XXX ou XXXXXXXX
 * @returns {Promise<Object>} Dados do endereço
 */
export const fetchAddressByCEP = async (cep) => {
  try {
    // Remover caracteres não numéricos
    const cleanCEP = cep.replace(/\D/g, '');
    
    // Validar CEP
    if (cleanCEP.length !== 8) {
      throw new Error('CEP deve conter 8 dígitos');
    }
    
    // Fazer requisição para ViaCEP
    const response = await fetch(`${CEP_API_BASE_URL}/${cleanCEP}/json/`);
    
    if (!response.ok) {
      throw new Error('Erro na consulta do CEP');
    }
    
    const data = await response.json();
    
    // Verificar se o CEP foi encontrado
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }
    
    // Normalizar dados para o formato esperado
    return {
      success: true,
      data: {
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
        postal_code: formatCEP(data.cep) || formatCEP(cleanCEP),
        complement: data.complemento || '',
        ibge_code: data.ibge || '',
        gia_code: data.gia || '',
        ddd: data.ddd || ''
      }
    };
    
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return {
      success: false,
      error: error.message || 'Erro ao consultar CEP'
    };
  }
};

/**
 * Formatar CEP para o padrão XXXXX-XXX
 * @param {string} cep - CEP sem formatação
 * @returns {string} CEP formatado
 */
export const formatCEP = (cep) => {
  if (!cep) return '';
  const numbers = cep.replace(/\D/g, '');
  if (numbers.length === 8) {
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
  return numbers;
};

/**
 * Validar se o CEP está no formato correto
 * @param {string} cep - CEP a ser validado
 * @returns {boolean} True se válido
 */
export const isValidCEP = (cep) => {
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.length === 8;
};

/**
 * Buscar múltiplos endereços por cidade/estado
 * @param {string} state - Estado (UF)
 * @param {string} city - Cidade
 * @param {string} street - Logradouro
 * @returns {Promise<Array>} Lista de endereços
 */
export const searchAddressByLocation = async (state, city, street) => {
  try {
    if (!state || !city || !street) {
      throw new Error('Estado, cidade e logradouro são obrigatórios');
    }
    
    const response = await fetch(
      `${CEP_API_BASE_URL}/${state}/${city}/${street}/json/`
    );
    
    if (!response.ok) {
      throw new Error('Erro na busca de endereços');
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Nenhum endereço encontrado');
    }
    
    return {
      success: true,
      data: data.map(item => ({
        street: item.logradouro || '',
        neighborhood: item.bairro || '',
        city: item.localidade || '',
        state: item.uf || '',
        postal_code: formatCEP(item.cep) || '',
        complement: item.complemento || '',
        ibge_code: item.ibge || '',
        gia_code: item.gia || '',
        ddd: item.ddd || ''
      }))
    };
    
  } catch (error) {
    console.error('Erro ao buscar endereços:', error);
    return {
      success: false,
      error: error.message || 'Erro ao buscar endereços'
    };
  }
};

export default {
  fetchAddressByCEP,
  formatCEP,
  isValidCEP,
  searchAddressByLocation
};

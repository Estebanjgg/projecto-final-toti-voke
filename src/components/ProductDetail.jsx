import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAlert } from '../contexts/AlertContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const { showSuccess, showError } = useAlert();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estados removidos: selectedColor, selectedStorage, selectedCondition ya no son necesarios
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState('');

  // Função para formatar preços e tratar valores NaN
  const formatProductPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) {
      return '0,00';
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) {
      return '0,00';
    }
    return numPrice.toFixed(2);
  };

  // Função para validar CEP
  const validateCEP = (cep) => {
    const cepRegex = /^\d{5}-?\d{3}$/;
    return cepRegex.test(cep.replace(/\D/g, ''));
  };

  // Função para formatar CEP
  const formatCEP = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  // Função para calcular frete usando API real de ViaCEP
  const calculateShipping = async () => {
    if (!validateCEP(cep)) {
      setShippingError('CEP inválido. Digite um CEP válido (ex: 01234-567)');
      return;
    }

    setLoadingShipping(true);
    setShippingError('');
    setShippingOptions([]);

    try {
      // Consultar API ViaCEP para validar CEP e obter localização
      const cepResponse = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
      
      if (!cepResponse.ok) {
        throw new Error('CEP não encontrado');
      }

      const addressData = await cepResponse.json();
      
      if (addressData.erro) {
        throw new Error('CEP não encontrado na base de dados');
      }

      // Simular delay adicional para parecer mais realista
      await new Promise(resolve => setTimeout(resolve, 800));

      // Calcular frete baseado na localização real
      const { uf, localidade } = addressData;
      
      // Definir fatores de distância por estado (simulado mas realista)
      const stateDistanceFactors = {
        'SP': 1.0,  // Base (São Paulo)
        'RJ': 1.2,  // Rio de Janeiro
        'MG': 1.3,  // Minas Gerais
        'ES': 1.4,  // Espírito Santo
        'PR': 1.5,  // Paraná
        'SC': 1.6,  // Santa Catarina
        'RS': 1.8,  // Rio Grande do Sul
        'GO': 1.7,  // Goiás
        'MT': 2.0,  // Mato Grosso
        'MS': 1.9,  // Mato Grosso do Sul
        'DF': 1.6,  // Distrito Federal
        'BA': 2.2,  // Bahia
        'SE': 2.3,  // Sergipe
        'AL': 2.4,  // Alagoas
        'PE': 2.5,  // Pernambuco
        'PB': 2.6,  // Paraíba
        'RN': 2.7,  // Rio Grande do Norte
        'CE': 2.8,  // Ceará
        'PI': 2.9,  // Piauí
        'MA': 3.0,  // Maranhão
        'TO': 2.1,  // Tocantins
        'PA': 3.2,  // Pará
        'AP': 3.5,  // Amapá
        'AM': 3.8,  // Amazonas
        'RR': 4.0,  // Roraima
        'AC': 4.2   // Acre
      };

      const basePrice = 12;
      const weightFactor = product?.weight ? product.weight * 1.8 : 4;
      const distanceFactor = (stateDistanceFactors[uf] || 2.0) * 8;
      
      // Adicionar variação por cidade (capitais são mais baratas)
      const capitals = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Fortaleza', 'Brasília', 'Curitiba', 'Recife', 'Porto Alegre', 'Manaus', 'Belém', 'Goiânia', 'Guarulhos', 'Campinas', 'São Luís', 'São Gonçalo', 'Maceió', 'Duque de Caxias', 'Natal', 'Teresina'];
      const isCapital = capitals.includes(localidade);
      const cityFactor = isCapital ? 0.9 : 1.1;
      
      const pacPrice = (basePrice + weightFactor + distanceFactor) * cityFactor;
      const sedexPrice = pacPrice * 1.7;
      const expressPrice = sedexPrice * 1.4;

      // Todos os fretes são gratuitos - política da loja
       const baseDays = stateDistanceFactors[uf] <= 1.5 ? 3 : stateDistanceFactors[uf] <= 2.5 ? 5 : 7;
       
       const options = [
         {
           id: 'free-shipping',
           name: 'Frete Grátis',
           price: 0,
           days: baseDays,
           description: `Entrega gratuita para ${localidade}/${uf}`,
           location: `${localidade} - ${uf}`
         }
       ];

      setShippingOptions(options);
    } catch (error) {
      if (error.message.includes('CEP não encontrado')) {
        setShippingError('CEP não encontrado. Verifique se o CEP está correto.');
      } else {
        setShippingError('Erro ao consultar CEP. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setLoadingShipping(false);
    }
  };

  // Função para formatar data de entrega
  const formatDeliveryDate = (days) => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    return deliveryDate.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obter produto por ID
      const response = await productsAPI.getById(id);
      setProduct(response.data);
      
      // Valores padrão removidos - ahora usamos especificaciones dinámicas
    } catch (err) {
      console.error('Erro carregando produto:', err);
      setError('Erro ao carregar o produto');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    // Validar estoque disponível
    if (product.stock !== undefined && product.stock < quantity) {
      showError(`Estoque insuficiente. Disponível: ${product.stock}`);
      return;
    }
    
    try {
      setAddingToCart(true);
      
      // Adicionar ao carrinho usando o contexto
      const success = await addToCart(id, quantity);
      
      if (success) {
        showSuccess(`${product.title} adicionado ao carrinho!`);
      }
    } catch (error) {
      console.error('Erro adicionando ao carrinho:', error);
      showError('Erro ao adicionar produto ao carrinho');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    // Validar estoque disponível
    if (product.stock !== undefined && product.stock < quantity) {
      showError(`Estoque insuficiente. Disponível: ${product.stock}`);
      return;
    }
    
    try {
      setAddingToCart(true);
      
      // Primeiro adicionar ao carrinhom 
      const success = await addToCart(id, quantity);
      
      if (success) {
        // Redirecionar ao checkout
        navigate('/checkout');
      }
    } catch (error) {
      console.error('Erro na compra direta:', error);
      showError('Erro ao processar compra');
    } finally {
      setAddingToCart(false);
    }
  };

  const getCategoryName = (category) => {
    const categoryMap = {
      'Smartphones': 'Smartphone',
      'Tablets': 'Tablet',
      'Notebooks': 'Notebook',
      'Desktops': 'Desktop',
      'Monitores': 'Monitor',
      'Acessórios': 'Acessório'
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Carregando produto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <h2>Produto não encontrado</h2>
        <p>{error || 'O produto solicitado não existe.'}</p>
        <button onClick={() => navigate('/')} className="back-home-btn">
          Voltar ao início
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <span onClick={() => navigate('/')} className="breadcrumb-link">
          Home
        </span>
        <span className="breadcrumb-separator">→</span>
        <span onClick={() => navigate(`/category/${product.category.toLowerCase()}`)} className="breadcrumb-link">
          {getCategoryName(product.category)}
        </span>
      </nav>

      <div className="product-detail-container">
        {/* Imagem do produto */}
        <div className="product-image-section">
          <div className="product-image-main">
            <img src={product.image} alt={product.title} />
          </div>
          <div className="product-image-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        {/* Informações do produto */}
        <div className="product-info-section">
          {/* Rating */}
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star ${i < (product.rating || 5) ? 'filled' : ''}`}>
                  ⭐
                </span>
              ))}
            </div>
          </div>

          {/* Título */}
            <h1 className="product-title">{product.title}</h1>

          {/* Preços */}
          <div className="product-pricing">
            {product.original_price && (
              <span className="original-price">R$ {formatProductPrice(product.original_price)}</span>
            )}
            {product.discount && (
              <span className="discount-badge">-{product.discount}%</span>
            )}
            <div className="current-price-container">
              <span className="current-price">R$ {formatProductPrice(product.current_price)}</span>
              <span className="pix-label">no PIX / Boleto</span>
            </div>
            <div className="installments">
              <span className="installment-price">R$ {formatProductPrice(product.current_price * 1.1)}</span>
              <span className="installment-text">no cartão</span>
            </div>
            <div className="installment-details">
              <span>em até 10x de R$ {formatProductPrice(product.current_price * 1.1 / 10)} sem juros</span>
            </div>
          </div>

          {/* Especificações do produto */}
          {product.category === 'Smartphones' && (
            <div className="product-specifications">
              <h3>Especificações</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Marca:</span>
                  <span className="spec-value">{product.brand || 'N/A'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Modelo:</span>
                  <span className="spec-value">{product.title}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Categoria:</span>
                  <span className="spec-value">{product.category}</span>
                </div>
                {product.storage && (
                  <div className="spec-item">
                    <span className="spec-label">Armazenamento:</span>
                    <span className="spec-value">{product.storage}</span>
                  </div>
                )}
                {product.color && (
                  <div className="spec-item">
                    <span className="spec-label">Cor:</span>
                    <span className="spec-value">{product.color}</span>
                  </div>
                )}
                {product.condition && (
                  <div className="spec-item">
                    <span className="spec-label">Estado:</span>
                    <span className="spec-value">{product.condition}</span>
                  </div>
                )}
                {product.warranty && (
                  <div className="spec-item">
                    <span className="spec-label">Garantia:</span>
                    <span className="spec-value">{product.warranty}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Especificações dinâmicas do produto */}
          {product.specifications && (
            <div className="product-dynamic-specifications">
              <h3>Especificações</h3>
              <div className="specs-grid">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Descrição */}
          <div className="product-description">
            <p>{product.description || 'Tela pode conter riscos mínimos, invisíveis a uma distância de um braço ou quando a tela está ligada. Traseira e laterais podem ter riscos aparentes, mas leves.'}</p>
          </div>

          {/* Seletor de quantidade */}
          <div className="quantity-selector">
            <label>Quantidade:</label>
            <div className="quantity-controls">
              <button 
                className="quantity-btn" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button 
                className="quantity-btn" 
                onClick={() => setQuantity(quantity + 1)}
                disabled={product?.stock && quantity >= product.stock}
              >
                +
              </button>
            </div>
            {product?.stock && (
              <span className="stock-info">
                {product.stock > 0 ? `${product.stock} disponíveis` : 'Fora de estoque'}
              </span>
            )}
          </div>

          {/* Botões de ação */}
          <div className="product-actions">
            <button 
              className="add-to-cart-btn" 
              onClick={handleAddToCart}
              disabled={addingToCart || cartLoading || (product?.stock === 0)}
            >
              {addingToCart ? 'Adicionando...' : 'Adicionar à sacola'}
            </button>
            <button 
              className="buy-now-btn" 
              onClick={handleBuyNow}
              disabled={addingToCart || cartLoading || (product?.stock === 0)}
            >
              {addingToCart ? 'Processando...' : 'Comprar'}
            </button>
          </div>

          {/* Cálculo de frete */}
          <div className="shipping-calculator">
            <label>Calcule o frete e prazo de entrega</label>
            <div className="shipping-input">
              <input 
                type="text" 
                placeholder="Digite seu CEP" 
                value={cep}
                onChange={(e) => setCep(formatCEP(e.target.value))}
                maxLength={9}
                onKeyPress={(e) => e.key === 'Enter' && calculateShipping()}
              />
              <button 
                onClick={calculateShipping}
                disabled={!cep}
              >
                Consultar
              </button>
            </div>
            
            {loadingShipping && (
              <div className="shipping-loading">
                <div className="shipping-loading-spinner"></div>
                <div className="shipping-loading-text">Calculando frete...</div>
                <div className="shipping-loading-subtext">
                  Consultando as melhores opções de entrega para seu CEP
                </div>
              </div>
            )}
            
            {shippingError && (
              <div className="shipping-error">
                <div className="shipping-error-text">⚠️ {shippingError}</div>
              </div>
            )}
            
            {shippingOptions.length > 0 && (
              <div className="shipping-options">
                <h4>Opções de entrega para {cep}:</h4>
                {shippingOptions.map((option) => (
                  <div key={option.id} className="shipping-option">
                    <div className="option-info">
                      <div className="option-name">{option.name}</div>
                      <div className="option-description">{option.description}</div>
                      {option.location && (
                        <div className="option-location">📍 {option.location}</div>
                      )}
                    </div>
                    <div className="option-details">
                      <div className="option-price">
                        {option.price === 0 ? 'Grátis' : `R$ ${option.price.toFixed(2)}`}
                      </div>
                      <div className="option-delivery">
                        {option.days === 1 ? 'Amanhã' : `${option.days} dias úteis`}
                        <br />
                        <small>até {formatDeliveryDate(option.days)}</small>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="shipping-info">
                  <small>
                    📦 Produto será enviado pelos Correios<br />
                    📍 Rastreamento incluído em todas as modalidades<br />
                    🎉 Frete grátis para todo o Brasil!
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
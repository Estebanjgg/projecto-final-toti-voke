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
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

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
      
      // Estabelecer valores padrão
      if (response.data) {
        setSelectedColor(response.data.color || 'Rosa');
        setSelectedStorage(response.data.storage || '512 GB');
        setSelectedCondition(response.data.condition || 'Muito Bom');
      }
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
        // Opcional: mostrar as opções selecionadas na mensagem
        const options = [];
        if (selectedColor) options.push(`Cor: ${selectedColor}`);
        if (selectedStorage) options.push(`Armazenamento: ${selectedStorage}`);
        if (selectedCondition) options.push(`Estado: ${selectedCondition}`);
        
        const optionsText = options.length > 0 ? ` (${options.join(', ')})` : '';
        showSuccess(`${product.title}${optionsText} adicionado ao carrinho!`);
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

          {/* Título e SKU */}
          <h1 className="product-title">{product.title}</h1>
          <p className="product-sku">SKU: {product.id}</p>

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

          {/* Opções de produto */}
          <div className="product-options">
            {/* Color */}
            <div className="option-group">
              <label>Cor</label>
              <div className="color-options">
                <button 
                  className={`color-option ${selectedColor === (product.color || 'Rosa') ? 'selected' : ''}`}
                  onClick={() => setSelectedColor(product.color || 'Rosa')}
                >
                  {product.color || 'Rosa'}
                </button>
              </div>
            </div>

            {/* Armazenamento */}
            {product.category === 'Smartphones' && (
              <div className="option-group">
                <label>Armazenamento</label>
                <div className="storage-options">
                  <button 
                    className={`storage-option ${selectedStorage === (product.storage || '512 GB') ? 'selected' : ''}`}
                    onClick={() => setSelectedStorage(product.storage || '512 GB')}
                  >
                    {product.storage || '512 GB'}
                  </button>
                </div>
              </div>
            )}

            {/* Estado do produto */}
            <div className="option-group">
              <label>Estado do produto</label>
              <div className="condition-options">
                <button 
                  className={`condition-option ${selectedCondition === (product.condition || 'Muito Bom') ? 'selected' : ''}`}
                  onClick={() => setSelectedCondition(product.condition || 'Muito Bom')}
                >
                  {product.condition || 'Muito Bom'}
                </button>
              </div>
            </div>
          </div>

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
              <input type="text" placeholder="CEP" />
              <button>Consultar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
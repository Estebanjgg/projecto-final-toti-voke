import React, { useState, useEffect, useContext } from 'react';
import AlertContext from '../../contexts/AlertContext';
import adminAPI from '../../services/adminAPI';
import { categoriesAPI } from '../../services/categoriesAPI';

const AdminProducts = () => {
  const { addAlert } = useContext(AlertContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    category: '',
    brand: '',
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    in_stock: ''
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAdminProducts(filters);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Erro carregando produtos:', error);
      addAlert('Erro carregando produtos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Erro carregando categorias:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value
    }));
  };

  const openCreateModal = () => {
    setSelectedProduct({
      title: '',
      description: '',
      price: '',
      category: '',
      brand: '',
      image: '',
      stock: 0,
      is_featured: false,
      is_active: true
    });
    setIsEditing(false);
    setShowProductModal(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (isEditing) {
        await adminAPI.updateProduct(selectedProduct.id, productData);
        addAlert('Produto atualizado com sucesso', 'success');
      } else {
        await adminAPI.createProduct(productData);
        addAlert('Produto criado com sucesso', 'success');
      }
      setShowProductModal(false);
      loadProducts();
    } catch (error) {
      console.error('Erro salvando produto:', error);
      addAlert(
        error.response?.data?.message || 'Erro salvando produto',
        'error'
      );
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Tem certeza de que deseja excluir este produto?')) {
      return;
    }

    try {
      await adminAPI.deleteProduct(productId);
      addAlert('Produto excluído com sucesso', 'success');
      loadProducts();
    } catch (error) {
      console.error('Erro excluindo produto:', error);
      addAlert('Erro excluindo produto', 'error');
    }
  };

  const formatCurrency = (amount) => {
    // Verificar se o valor é válido e numérico
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || amount === null || amount === undefined) {
      return 'R$ 0,00';
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numericAmount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-products">
      <div className="products-header">
        <h1>Gestão de Produtos</h1>
        <button onClick={openCreateModal} className="btn btn-primary">
          Criar Produto
        </button>
      </div>

      {/* Filtros */}
      <div className="products-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label>Buscar:</label>
            <input
              type="text"
              placeholder="Nome, descrição, marca..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Categoria:</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="form-select"
            >
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Marca:</label>
            <input
              type="text"
              placeholder="Filtrar por marca"
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Stock:</label>
            <select
              value={filters.in_stock}
              onChange={(e) => handleFilterChange('in_stock', e.target.value)}
              className="form-select"
            >
              <option value="">Todos</option>
              <option value="true">Com estoque</option>
              <option value="false">Sem estoque</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Ordenar por:</label>
            <select
              value={`${filters.sort_by}-${filters.sort_order}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sort_by', sortBy);
                handleFilterChange('sort_order', sortOrder);
              }}
              className="form-select"
            >
              <option value="created_at-desc">Data (Mais recente)</option>
              <option value="created_at-asc">Data (Mais antiga)</option>
              <option value="title-asc">Nome (A-Z)</option>
              <option value="title-desc">Nome (Z-A)</option>
              <option value="price-desc">Preço (Maior para menor)</option>
              <option value="price-asc">Preço (Menor para maior)</option>
              <option value="stock-asc">Estoque (Menor para maior)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      {loading ? (
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Carregando produtos...</p>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.title} />
                  {!product.is_active && (
                    <div className="inactive-overlay">Inativo</div>
                  )}
                  {product.is_featured && (
                    <div className="featured-badge">Destacado</div>
                  )}
                </div>
                
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p className="product-category">{product.category}</p>
                  <p className="product-brand">{product.brand}</p>
                  <p className="product-price">{formatCurrency(product.current_price)}</p>
                  
                  <div className="product-stock">
                    <span className={`stock-badge ${
                      product.stock === 0 ? 'out-of-stock' :
                      product.stock <= 10 ? 'low-stock' : 'in-stock'
                    }`}>
                      Stock: {product.stock}
                    </span>
                  </div>
                  
                  <div className="product-meta">
                    <small>Criado: {formatDate(product.created_at)}</small>
                    {product.updated_at && product.updated_at !== product.created_at && (
                      <small>Atualizado: {formatDate(product.updated_at)}</small>
                    )}
                  </div>
                </div>
                
                <div className="product-actions">
                  <button
                    onClick={() => openEditModal(product)}
                    className="btn btn-sm btn-outline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handleFilterChange('page', pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="btn btn-outline"
              >
                Anterior
              </button>
              
              <span className="pagination-info">
                Página {pagination.page} de {pagination.pages}
              </span>
              
              <button
                onClick={() => handleFilterChange('page', pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="btn btn-outline"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal de producto */}
      {showProductModal && (
        <ProductModal
          product={selectedProduct}
          categories={categories}
          isEditing={isEditing}
          onSave={handleSaveProduct}
          onClose={() => setShowProductModal(false)}
        />
      )}
    </div>
  );
};

// Componente del modal de producto
const ProductModal = ({ product, categories, isEditing, onSave, onClose }) => {
  const [formData, setFormData] = useState(product);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'O título é obrigatório';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'A descrição é obrigatória';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'O preço deve ser maior que 0';
    }
    
    if (!formData.category?.trim()) {
      newErrors.category = 'A categoria é obrigatória';
    }
    
    if (!formData.brand?.trim()) {
      newErrors.brand = 'A marca é obrigatória';
    }
    
    if (!formData.image?.trim()) {
      newErrors.image = 'A imagem é obrigatória';
    }
    
    if (formData.stock < 0) {
      newErrors.stock = 'O estoque não pode ser negativo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        ...formData,
        current_price: parseFloat(formData.price),
        original_price: parseFloat(formData.original_price) || parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Produto' : 'Criar Produto'}</h2>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Nome do produto"
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>
            
            <div className="form-group">
              <label>Preço Atual *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className={`form-input ${errors.price ? 'error' : ''}`}
                placeholder="0.00"
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>
            
            <div className="form-group">
              <label>Preço Original</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.original_price || ''}
                onChange={(e) => handleChange('original_price', e.target.value)}
                className="form-input"
                placeholder="0.00"
              />
            </div>
            
            <div className="form-group">
              <label>Categoría *</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className={`form-select ${errors.category ? 'error' : ''}`}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>
            
            <div className="form-group">
              <label>Marca *</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                className={`form-input ${errors.brand ? 'error' : ''}`}
                placeholder="Marca do produto"
              />
              {errors.brand && <span className="error-text">{errors.brand}</span>}
            </div>
            
            <div className="form-group">
              <label>Estoque</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                className={`form-input ${errors.stock ? 'error' : ''}`}
                placeholder="0"
              />
              {errors.stock && <span className="error-text">{errors.stock}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label>Descrição *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Descrição do produto"
              rows="4"
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>
          
          <div className="form-group">
            <label>URL da Imagem *</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              className={`form-input ${errors.image ? 'error' : ''}`}
              placeholder="https://exemplo.com/imagem.jpg"
            />
            {errors.image && <span className="error-text">{errors.image}</span>}
            {formData.image && (
              <div className="image-preview">
                <img src={formData.image} alt="Preview" />
              </div>
            )}
          </div>
          
          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => handleChange('is_featured', e.target.checked)}
              />
              Produto em destaque
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
              />
              Produto ativo
            </label>
          </div>
        </form>
        
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-outline">
            Cancelar
          </button>
          <button type="submit" onClick={handleSubmit} className="btn btn-primary">
            {isEditing ? 'Atualizar' : 'Criar'} Produto
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
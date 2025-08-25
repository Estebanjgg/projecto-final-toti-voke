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
      console.error('Error cargando productos:', error);
      addAlert('Error cargando productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
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
        addAlert('Producto actualizado exitosamente', 'success');
      } else {
        await adminAPI.createProduct(productData);
        addAlert('Producto creado exitosamente', 'success');
      }
      setShowProductModal(false);
      loadProducts();
    } catch (error) {
      console.error('Error guardando producto:', error);
      addAlert(
        error.response?.data?.message || 'Error guardando producto',
        'error'
      );
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      await adminAPI.deleteProduct(productId);
      addAlert('Producto eliminado exitosamente', 'success');
      loadProducts();
    } catch (error) {
      console.error('Error eliminando producto:', error);
      addAlert('Error eliminando producto', 'error');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="admin-products">
      <div className="products-header">
        <h1>Gestión de Productos</h1>
        <button onClick={openCreateModal} className="btn btn-primary">
          Crear Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="products-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label>Buscar:</label>
            <input
              type="text"
              placeholder="Nombre, descripción, marca..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Categoría:</label>
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
              <option value="true">Con stock</option>
              <option value="false">Sin stock</option>
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
              <option value="created_at-desc">Fecha (Más reciente)</option>
              <option value="created_at-asc">Fecha (Más antigua)</option>
              <option value="title-asc">Nombre (A-Z)</option>
              <option value="title-desc">Nombre (Z-A)</option>
              <option value="price-desc">Precio (Mayor a menor)</option>
              <option value="price-asc">Precio (Menor a mayor)</option>
              <option value="stock-asc">Stock (Menor a mayor)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      {loading ? (
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.title} />
                  {!product.is_active && (
                    <div className="inactive-overlay">Inactivo</div>
                  )}
                  {product.is_featured && (
                    <div className="featured-badge">Destacado</div>
                  )}
                </div>
                
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p className="product-category">{product.category}</p>
                  <p className="product-brand">{product.brand}</p>
                  <p className="product-price">{formatCurrency(product.price)}</p>
                  
                  <div className="product-stock">
                    <span className={`stock-badge ${
                      product.stock === 0 ? 'out-of-stock' :
                      product.stock <= 10 ? 'low-stock' : 'in-stock'
                    }`}>
                      Stock: {product.stock}
                    </span>
                  </div>
                  
                  <div className="product-meta">
                    <small>Creado: {formatDate(product.created_at)}</small>
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
                    Eliminar
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
                Siguiente
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
      newErrors.title = 'El título es requerido';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }
    
    if (!formData.category?.trim()) {
      newErrors.category = 'La categoría es requerida';
    }
    
    if (!formData.brand?.trim()) {
      newErrors.brand = 'La marca es requerida';
    }
    
    if (!formData.image?.trim()) {
      newErrors.image = 'La imagen es requerida';
    }
    
    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Producto' : 'Crear Producto'}</h2>
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
                placeholder="Nombre del producto"
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>
            
            <div className="form-group">
              <label>Precio *</label>
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
                placeholder="Marca del producto"
              />
              {errors.brand && <span className="error-text">{errors.brand}</span>}
            </div>
            
            <div className="form-group">
              <label>Stock</label>
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
            <label>Descripción *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Descripción del producto"
              rows="4"
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>
          
          <div className="form-group">
            <label>URL de Imagen *</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              className={`form-input ${errors.image ? 'error' : ''}`}
              placeholder="https://ejemplo.com/imagen.jpg"
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
              Producto destacado
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
              />
              Producto activo
            </label>
          </div>
        </form>
        
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-outline">
            Cancelar
          </button>
          <button type="submit" onClick={handleSubmit} className="btn btn-primary">
            {isEditing ? 'Actualizar' : 'Crear'} Producto
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
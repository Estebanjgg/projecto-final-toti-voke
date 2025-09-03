import React from 'react';
import { Link } from 'react-router-dom';
import './ProductListModal.css';

const ProductListModal = ({ isOpen, onClose, title, products = [], loading }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="product-modal-overlay" onClick={handleBackdropClick}>
      <div className="product-modal-container">
        <div className="product-modal-header">
          <h3 className="product-modal-title">{title}</h3>
          <button className="product-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="product-modal-body">
          {loading ? (
            <div className="product-modal-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Cargando productos...</p>
            </div>
          ) : !products || products.length === 0 ? (
            <p className="product-modal-empty">No hay productos para mostrar.</p>
          ) : (
            <div className="product-list-table-container">
              <table className="product-list-table">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id || product._id}>
                      <td>
                        <img 
                          src={product.image || (product.images && Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/placeholder.png')} 
                          alt={product.title || product.name || 'Producto'} 
                          className="product-thumbnail" 
                          onError={(e) => { e.target.src = '/placeholder.png'; }}
                        />
                      </td>
                      <td>{product.title || product.name}</td>
                      <td>${typeof product.current_price === 'number' && product.current_price > 0 ? product.current_price.toFixed(2) : (typeof product.price === 'number' && product.price > 0 ? product.price.toFixed(2) : (typeof product.precio === 'number' && product.precio > 0 ? product.precio.toFixed(2) : '0.00'))}</td>
                      <td className={typeof product.stock === 'number' ? (product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : '') : ''}>
                        {typeof product.stock === 'number' ? product.stock : 'N/A'}
                      </td>
                      <td>{product.category || 'Sin categoría'}</td>
                      <td>
                        <Link to={`/admin/products/edit/${product.id || product._id}`} className="product-action-btn edit">
                          <i className="fas fa-edit"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="product-modal-footer">
          <button 
            className="product-modal-button" 
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductListModal;
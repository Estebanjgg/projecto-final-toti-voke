import React, { useState, useEffect } from 'react';
import { categoriesAPI, getProductsByCategory } from '../services/api';

const TestAPI = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  // Cargar categorías al inicio
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesAPI.getAll();
        console.log('Categorías desde API:', data);
        setCategories(data.data || []);
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    };
    loadCategories();
  }, []);

  // Función para probar productos por categoría
  const testCategory = async (categoryName) => {
    setLoading(true);
    setSelectedCategory(categoryName);
    try {
      console.log('Probando categoría:', categoryName);
      const response = await getProductsByCategory(categoryName);
      console.log('Respuesta completa de API:', response);
      setApiResponse(response);
      
      // Intentar extraer productos de diferentes estructuras posibles
      let productsData = [];
      if (Array.isArray(response)) {
        productsData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response && Array.isArray(response.products)) {
        productsData = response.products;
      }
      
      setProducts(productsData);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setApiResponse({ error: error.message });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', margin: '20px', borderRadius: '8px' }}>
      <h2>🔧 Test de API - Categorías y Productos</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>📋 Categorías disponibles:</h3>
        {categories.length > 0 ? (
          <ul>
            {categories.map((cat, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                <button 
                  onClick={() => testCategory(cat.name)}
                  style={{ 
                    padding: '5px 10px', 
                    marginRight: '10px',
                    backgroundColor: selectedCategory === cat.name ? '#4A90E2' : '#fff',
                    color: selectedCategory === cat.name ? '#fff' : '#000',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {cat.name} ({cat.count})
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No se pudieron cargar las categorías</p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>🧪 Probar categorías manuales:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['Notebook', 'Notebooks', 'Smartphone', 'Smartphones', 'Tablet', 'Tablets', 'Desktops', 'Monitores'].map(cat => (
            <button 
              key={cat}
              onClick={() => testCategory(cat)}
              style={{ 
                padding: '8px 12px',
                backgroundColor: selectedCategory === cat ? '#FF6B6B' : '#fff',
                color: selectedCategory === cat ? '#fff' : '#000',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>📦 Resultados para "{selectedCategory}":</h3>
          {loading ? (
            <p>⏳ Cargando...</p>
          ) : (
            <>
              <div style={{ marginBottom: '15px' }}>
                <strong>📊 Productos encontrados:</strong> {products.length}
              </div>
              
              {products.length > 0 && (
                <div>
                  <h4>🔍 Primeros 3 productos:</h4>
                  {products.slice(0, 3).map((product, index) => (
                    <div key={index} style={{ 
                      border: '1px solid #eee', 
                      padding: '10px', 
                      margin: '5px 0',
                      borderRadius: '4px',
                      backgroundColor: '#f9f9f9'
                    }}>
                      <strong>ID:</strong> {product.id}<br/>
                      <strong>Título:</strong> {product.title}<br/>
                      <strong>Categoría:</strong> {product.category}<br/>
                      <strong>Marca:</strong> {product.brand}<br/>
                      <strong>Precio:</strong> R$ {product.current_price}
                    </div>
                  ))}
                </div>
              )}
              
              <details style={{ marginTop: '15px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>🔧 Ver respuesta completa de API</summary>
                <pre style={{ 
                  backgroundColor: '#f4f4f4', 
                  padding: '10px', 
                  borderRadius: '4px', 
                  overflow: 'auto',
                  fontSize: '12px',
                  maxHeight: '300px'
                }}>
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </details>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TestAPI;

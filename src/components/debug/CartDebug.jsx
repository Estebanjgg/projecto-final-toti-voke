import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const CartDebug = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    // Recopilar información de debug
    const token = localStorage.getItem('authToken');
    const sessionId = localStorage.getItem('sessionId');
    
    setDebugInfo({
      isAuthenticated,
      user: user || null,
      token: token ? `${token.substring(0, 20)}...` : null,
      sessionId,
      cartItemsCount: cartItems ? cartItems.length : 0,
      cartItems: cartItems || []
    });
  }, [isAuthenticated, user, cartItems]);

  const testCartRequest = async () => {
    const token = localStorage.getItem('authToken');
    const sessionId = localStorage.getItem('sessionId');
    
    console.log('🔍 Debug Cart Request:');
    console.log('Token existe:', !!token);
    console.log('Token completo:', token);
    console.log('Session ID:', sessionId);
    console.log('User desde contexto:', user);
    console.log('Is Authenticated:', isAuthenticated);
    
    // Hacer una petición de prueba para obtener el carrito
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(sessionId && !token && { 'x-session-id': sessionId }),
      };
      
      console.log('Headers enviados:', headers);
      
      const response = await fetch('https://tu-app-voke-backend-7da6ed58e5fc.herokuapp.com/api/cart', {
        method: 'GET',
        headers
      });
      
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      
    } catch (error) {
      console.error('Error en petición de debug:', error);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      background: 'white', 
      border: '2px solid #ccc', 
      padding: '15px', 
      borderRadius: '8px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>🔍 Cart Debug Info</h4>
      <div><strong>Authenticated:</strong> {debugInfo.isAuthenticated ? '✅' : '❌'}</div>
      <div><strong>User ID:</strong> {debugInfo.user?.id || 'N/A'}</div>
      <div><strong>User Name:</strong> {debugInfo.user?.first_name || 'N/A'}</div>
      <div><strong>Token:</strong> {debugInfo.token || 'N/A'}</div>
      <div><strong>Session ID:</strong> {debugInfo.sessionId || 'N/A'}</div>
      <div><strong>Cart Items:</strong> {debugInfo.cartItemsCount}</div>
      
      <button 
        onClick={testCartRequest}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Cart Request
      </button>
      
      {debugInfo.cartItems && debugInfo.cartItems.length > 0 && (
        <details style={{ marginTop: '10px' }}>
          <summary>Ver items del carrito ({debugInfo.cartItems.length})</summary>
          <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '100px' }}>
            {JSON.stringify(debugInfo.cartItems, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default CartDebug;

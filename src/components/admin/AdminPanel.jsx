import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import AdminDashboard from './AdminDashboard';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminUsers from './AdminUsers';
import adminAPI from '../../services/adminAPI';
import './Admin.css';

const AdminPanel = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { showError } = useAlert();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [debugLogs, setDebugLogs] = useState([]);
  const location = useLocation();

  const addDebugLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { timestamp, message, type };
    setDebugLogs(prev => [...prev, logEntry]);
    console.log(`[${timestamp}] ${message}`);
  };

  useEffect(() => {
    // Solo verificar acceso admin cuando AuthContext termine de cargar
    if (!authLoading) {
      checkAdminAccess();
    }
  }, [authLoading, user]);

  const checkAdminAccess = async () => {
    try {
      addDebugLog('🔍 === INICIANDO VERIFICACIÓN DE ACCESO ADMIN ===', 'info');
      addDebugLog(`👤 Usuario actual completo: ${JSON.stringify(user, null, 2)}`, 'info');
      addDebugLog(`🔑 Token en localStorage: ${localStorage.getItem('token') ? 'Presente' : 'Ausente'}`, 'info');
      
      if (!user) {
        addDebugLog('❌ FALLO: No hay usuario logueado', 'error');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      addDebugLog(`📧 Email del usuario: ${user.email}`, 'info');
      addDebugLog(`🔑 Rol del usuario: ${user.role}`, 'info');
      addDebugLog(`🆔 ID del usuario: ${user.id}`, 'info');
      addDebugLog(`📅 Usuario creado: ${user.created_at}`, 'info');
      
      addDebugLog('🔍 === LLAMANDO A adminAPI.checkAdminStatus() ===', 'info');
      const hasAccess = await adminAPI.checkAdminStatus();
      addDebugLog(`✅ Resultado de checkAdminStatus: ${hasAccess}`, 'success');
      
      // Debug adicional: intentar llamar directamente al endpoint
      addDebugLog('🔍 === VERIFICACIÓN DIRECTA DEL ENDPOINT ===', 'info');
      try {
        const token = localStorage.getItem('token');
        addDebugLog(`🔑 Token a enviar: ${token ? token.substring(0, 20) + '...' : 'null'}`, 'info');
        
        const dashboardResponse = await fetch('http://localhost:3001/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        addDebugLog(`🔍 Status directo del dashboard: ${dashboardResponse.status}`, 'info');
        addDebugLog(`🔍 Status text: ${dashboardResponse.statusText}`, 'info');
        addDebugLog(`🔍 Headers de respuesta: ${JSON.stringify(Object.fromEntries(dashboardResponse.headers.entries()))}`, 'info');
        
        if (dashboardResponse.ok) {
          const responseData = await dashboardResponse.json();
          addDebugLog(`📊 Datos del dashboard: ${JSON.stringify(responseData)}`, 'success');
        } else {
          const errorText = await dashboardResponse.text();
          addDebugLog(`❌ Error del servidor: ${errorText}`, 'error');
        }
        
        if (!dashboardResponse.ok) {
          const errorText = await dashboardResponse.text();
          addDebugLog(`❌ Error del dashboard: ${errorText}`, 'error');
        }
      } catch (fetchError) {
        addDebugLog(`💥 Error en fetch directo: ${fetchError}`, 'error');
      }
      
      addDebugLog('🔍 === ESTABLECIENDO ESTADO FINAL ===', 'info');
      addDebugLog(`✅ hasAccess valor: ${hasAccess}`, 'info');
      setIsAdmin(hasAccess);
      
      if (!hasAccess) {
        addDebugLog('🚫 RESULTADO: Acceso denegado - no es admin', 'error');
        showError('No tienes permisos de administrador');
      } else {
        addDebugLog('🎉 RESULTADO: Acceso concedido - es admin', 'success');
      }
    } catch (error) {
      addDebugLog(`💥 ERROR CRÍTICO verificando acceso de admin: ${error}`, 'error');
      addDebugLog(`💥 Stack trace: ${error.stack}`, 'error');
      setIsAdmin(false);
      showError('Error verificando permisos de administrador');
    } finally {
      addDebugLog('🏁 === FINALIZANDO VERIFICACIÓN ===', 'info');
      addDebugLog(`🏁 Estado final isAdmin: ${isAdmin}`, 'info');
      addDebugLog('🏁 Estado final loading: false', 'info');
      setLoading(false);
    }
  };

  // Log de estado de renderizado usando useEffect para evitar bucles
  useEffect(() => {
    addDebugLog('🎭 === RENDERIZANDO ADMINPANEL ===', 'info');
    addDebugLog(`🎭 Estado authLoading: ${authLoading}`, 'info');
    addDebugLog(`🎭 Estado loading: ${loading}`, 'info');
    addDebugLog(`🎭 Estado user: ${user ? 'Presente' : 'Ausente'}`, 'info');
    addDebugLog(`🎭 Estado isAdmin: ${isAdmin}`, 'info');
  }, [authLoading, loading, user, isAdmin]);

  // Mostrar carga mientras AuthContext se inicializa o mientras verificamos admin
  if (authLoading || loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>{authLoading ? 'Inicializando autenticación...' : 'Verificando permisos...'}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-unauthorized">
        <div className="unauthorized-content">
          <h2>Acceso Restringido</h2>
          <p>Debes iniciar sesión para acceder al panel de administración.</p>
          <Link to="/login" className="btn btn-primary">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-unauthorized">
        <div className="unauthorized-content">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder al panel de administración.</p>
          <Link to="/" className="btn btn-primary">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/orders', label: 'Órdenes', icon: '📦' },
    { path: '/admin/products', label: 'Productos', icon: '🛍️' },
    { path: '/admin/users', label: 'Usuarios', icon: '👥' }
  ];

  // Componente de Debug Visual
  const DebugPanel = () => (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      width: '400px',
      maxHeight: '500px',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      overflow: 'auto',
      zIndex: 9999,
      border: '2px solid #333'
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#4CAF50' }}>
        🐛 Debug Logs - Admin Panel
      </div>
      <button 
        onClick={() => setDebugLogs([])} 
        style={{
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '4px',
          marginBottom: '10px',
          cursor: 'pointer'
        }}
      >
        Limpiar Logs
      </button>
      <div style={{ maxHeight: '400px', overflow: 'auto' }}>
        {debugLogs.map((log, index) => (
          <div key={index} style={{
            marginBottom: '5px',
            padding: '5px',
            backgroundColor: log.type === 'error' ? '#ff444420' : 
                           log.type === 'success' ? '#4CAF5020' : '#33333320',
            borderLeft: `3px solid ${log.type === 'error' ? '#ff4444' : 
                                   log.type === 'success' ? '#4CAF50' : '#2196F3'}`,
            paddingLeft: '8px'
          }}>
            <span style={{ color: '#888' }}>[{log.timestamp}]</span> {log.message}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="admin-panel">
      <DebugPanel />
      <div className="admin-sidebar">
        <div className="admin-header">
          <h2>Panel de Admin</h2>
          <p>Bienvenido, {user.first_name}</p>
        </div>
        
        <nav className="admin-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="admin-footer">
          <Link to="/" className="btn btn-outline">
            Volver a la Tienda
          </Link>
        </div>
      </div>
      
      <div className="admin-content">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
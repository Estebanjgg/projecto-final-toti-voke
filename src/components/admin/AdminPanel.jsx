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

  const location = useLocation();



  useEffect(() => {
    // Solo verificar acceso admin cuando AuthContext termine de cargar
    if (!authLoading) {
      checkAdminAccess();
    }
  }, [authLoading, user]);

  const checkAdminAccess = async () => {
    try {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const hasAccess = await adminAPI.checkAdminStatus();
      setIsAdmin(hasAccess);
      
      if (!hasAccess) {
        showError('No tienes permisos de administrador');
      }
    } catch (error) {
      console.error('Error verificando acceso de admin:', error);
      setIsAdmin(false);
      showError('Error verificando permisos de administrador');
    } finally {
      setLoading(false);
    }
  };



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
    { path: '/admin/orders', label: 'Pedidos', icon: '📦' },
    { path: '/admin/products', label: 'Productos', icon: '🛍️' },
    { path: '/admin/users', label: 'Usuarios', icon: '👥' }
  ];



  return (
    <div className="admin-panel">
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
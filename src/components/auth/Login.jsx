import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Obtener la ruta a la que el usuario quería ir antes del login
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    // Contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password
      });
      
      // Redirigir a la página original o al home
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Error en login:', error);
      setErrors({ submit: error.message || 'Error al iniciar sesión' });
    }
  };

  const handleDemoLogin = async () => {
    try {
      await login({
        email: 'user@test.com',
        password: '123456'
      });
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Error en demo login:', error);
      setErrors({ submit: 'Error al iniciar sesión con usuario demo' });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Iniciar Sesión</h1>
          <p>Accede a tu cuenta de Voke</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.submit && (
            <div className="error-message">
              {errors.submit}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="tu@email.com"
              disabled={loading}
              autoComplete="email"
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Tu contraseña"
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>o</span>
        </div>

        <button
          type="button"
          className="demo-button"
          onClick={handleDemoLogin}
          disabled={loading}
        >
          🚀 Probar con Usuario Demo
        </button>

        <div className="auth-footer">
          <p>
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="auth-link">
              Regístrate gratis
            </Link>
          </p>
          <p>
            <Link to="/forgot-password" className="auth-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </div>

        <div className="demo-info">
          <h3>👤 Usuarios Demo Disponibles:</h3>
          <div className="demo-users">
            <div className="demo-user">
              <strong>Usuario de Prueba:</strong>
              <br />
              📧 user@test.com
              <br />
              🔑 123456
            </div>
            <div className="demo-user">
              <strong>Administrador:</strong>
              <br />
              📧 admin@voke.com
              <br />
              🔑 123456
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
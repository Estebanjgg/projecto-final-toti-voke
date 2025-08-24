import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  
  // Hook para alertas
  const { 
    showError, 
    showSuccess 
  } = useAlert();
  
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
      // Mostrar errores de validación con alertas
      Object.entries(errors).forEach(([field, message]) => {
        if (message) {
          showError(message);
        }
      });
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
      
      // Manejar diferentes tipos de errores con alertas bonitas
      if (error.message.includes('Email o contraseña incorrectos') || 
          error.message.includes('Credenciales inválidas')) {
        showError('❌ Email o contraseña incorrectos. Por favor, verifica tus datos.');
      } else if (error.message.includes('Demasiados intentos')) {
        showError('⏰ Demasiados intentos de login. Intenta de nuevo en 15 minutos.');
      } else if (error.message.includes('red') || error.message.includes('network')) {
        showError('🌐 Error de conexión. Verifica tu conexión a internet.');
      } else {
        showError(`⚠️ ${error.message || 'Error inesperado al iniciar sesión'}`);
      }
      
      // También mantener el error en el estado para mostrar en el formulario si es necesario
      setErrors({ submit: error.message });
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
          
          {/* Botón de prueba temporal - ELIMINAR DESPUÉS */}
          <button 
            type="button" 
            onClick={() => showError('🧪 Esta es una alerta de prueba')}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Probar Alerta
          </button>
        </form>



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

      </div>
    </div>
  );
};

export default Login;
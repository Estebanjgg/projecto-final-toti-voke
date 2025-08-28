import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { authAPI } from '../../services/authAPI';
import './Auth.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false
  });
  const [tokenValid, setTokenValid] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Verificar token al cargar el componente
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    const verifyToken = async () => {
      try {
        await authAPI.verifyResetToken(token);
        setTokenValid(true);
      } catch (error) {
        console.error('Token inválido:', error);
        setTokenValid(false);
      }
    };

    verifyToken();
  }, [token]);

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

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Confirmar contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword({
        token,
        password: formData.password
      });
      
      setResetSuccess(true);
    } catch (error) {
      console.error('Error resetting password:', error);
      if (error.message.includes('Token')) {
        setTokenValid(false);
      } else {
        setErrors({ general: error.message || 'Error al restablecer la contraseña. Intenta de nuevo.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Token inválido o expirado
  if (tokenValid === false) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>❌ Enlace Inválido</h2>
            <p>El enlace de recuperación no es válido o ha expirado</p>
          </div>

          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <p>Este enlace de recuperación:</p>
            <ul>
              <li>Ha expirado (válido por 1 hora)</li>
              <li>Ya fue utilizado</li>
              <li>No es válido</li>
            </ul>
          </div>

          <div className="auth-actions">
            <Link to="/forgot-password" className="auth-button">
              Solicitar Nuevo Enlace
            </Link>
            
            <Link to="/login" className="auth-button secondary">
              Volver al Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Contraseña restablecida exitosamente
  if (resetSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>✅ Contraseña Restablecida</h2>
            <p>Tu contraseña ha sido cambiada exitosamente</p>
          </div>

          <div className="success-message">
            <div className="success-icon">🎉</div>
            <p>Ya puedes iniciar sesión con tu nueva contraseña.</p>
          </div>

          <div className="auth-actions">
            <button 
              onClick={() => navigate('/login')}
              className="auth-button"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Verificando token
  if (tokenValid === null) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>🔍 Verificando Enlace</h2>
            <p>Validando tu enlace de recuperación...</p>
          </div>
          <div className="loading-container">
            <span className="loading-spinner"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🔐 Nueva Contraseña</h2>
          <p>Ingresa tu nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Nueva Contraseña</label>
            <div className="password-input">
              <input
                type={showPasswords.password ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className={errors.password ? 'error' : ''}
                disabled={loading}
                autoComplete="new-password"
                autoFocus
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('password')}
                disabled={loading}
              >
                {showPasswords.password ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <div className="password-input">
              <input
                type={showPasswords.confirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repita sua nova senha"
                className={errors.confirmPassword ? 'error' : ''}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                disabled={loading}
              >
                {showPasswords.confirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading || !formData.password || !formData.confirmPassword}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Restableciendo...
              </>
            ) : (
              'Restablecer Contraseña'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Recordaste tu contraseña?{' '}
            <Link to="/login" className="auth-link">
              Iniciar Sesión
            </Link>
          </p>
        </div>

        <div className="password-requirements">
          <h3>📋 Requisitos de Contraseña</h3>
          <ul>
            <li className={formData.password.length >= 6 ? 'valid' : ''}>
              Mínimo 6 caracteres
            </li>
            <li className={formData.password === formData.confirmPassword && formData.password ? 'valid' : ''}>
              Las contraseñas deben coincidir
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
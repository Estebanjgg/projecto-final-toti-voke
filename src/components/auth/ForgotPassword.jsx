import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/authAPI';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) {
      setError('');
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!email) {
      setError('El email es requerido');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authAPI.forgotPassword(email);
      setEmailSent(true);
      setMessage('Se ha enviado un enlace de recuperación a tu email. Revisa tu bandeja de entrada y spam.');
    } catch (error) {
      console.error('Error en forgot password:', error);
      setError(error.message || 'Error al enviar el email de recuperación. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>📧 Email Enviado</h2>
            <p>Revisa tu bandeja de entrada</p>
          </div>

          <div className="success-message">
            <div className="success-icon">✅</div>
            <p>{message}</p>
          </div>

          <div className="auth-instructions">
            <h3>¿Qué hacer ahora?</h3>
            <ol>
              <li>Revisa tu bandeja de entrada del email: <strong>{email}</strong></li>
              <li>Si no encuentras el email, revisa tu carpeta de spam</li>
              <li>Haz clic en el enlace del email para restablecer tu contraseña</li>
              <li>El enlace expira en 1 hora por seguridad</li>
            </ol>
          </div>

          <div className="auth-actions">
            <button 
              type="button" 
              onClick={() => {
                setEmailSent(false);
                setEmail('');
                setMessage('');
                setError('');
              }}
              className="auth-button secondary"
            >
              Enviar a otro email
            </button>
            
            <Link to="/login" className="auth-button">
              Volver al Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🔐 Recuperar Contraseña</h2>
          <p>Ingresa tu email para recibir un enlace de recuperación</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className={error ? 'error' : ''}
              disabled={loading}
              autoComplete="email"
              autoFocus
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading || !email}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Enviando...
              </>
            ) : (
              'Enviar Enlace de Recuperación'
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
          <p>
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="auth-link">
              Registrarse
            </Link>
          </p>
        </div>

        <div className="auth-help">
          <h3>💡 Consejos de Seguridad</h3>
          <ul>
            <li>El enlace de recuperación expira en 1 hora</li>
            <li>Solo se puede usar una vez</li>
            <li>Si no recibes el email, revisa tu carpeta de spam</li>
            <li>Nunca compartas el enlace de recuperación</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
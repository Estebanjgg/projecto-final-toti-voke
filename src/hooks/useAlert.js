import { useState, useCallback } from 'react';

export const useAlert = () => {
  const [alerts, setAlerts] = useState([]);

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const showAlert = useCallback((type, message, options = {}) => {
    const id = Date.now() + Math.random();
    const alert = {
      id,
      type,
      message,
      isVisible: true,
      ...options
    };

    setAlerts(prev => [...prev, alert]);

    // Auto remove after duration
    const duration = options.duration || 4000;
    if (options.autoClose !== false) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }

    return id;
  }, [removeAlert]);

  const showSuccess = useCallback((message, options) => 
    showAlert('success', message, options), [showAlert]);

  const showError = useCallback((message, options) => {
    return showAlert('error', message, options);
  }, [showAlert]);

  const showWarning = useCallback((message, options) => 
    showAlert('warning', message, options), [showAlert]);

  const showInfo = useCallback((message, options) => 
    showAlert('info', message, options), [showAlert]);

  const clearAll = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    alerts,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeAlert,
    clearAll
  };
};

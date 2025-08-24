import React, { createContext, useContext, useState, useCallback } from 'react';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert debe ser usado dentro de AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const removeAlert = useCallback((id) => {
    setAlerts(prev => {
      const filtered = prev.filter(alert => alert.id !== id);
      return filtered;
    });
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

    setAlerts(prev => {
      const newAlerts = [...prev, alert];
      return newAlerts;
    });

    // Auto remove after duration
    const duration = options.duration || 4000;
    if (options.autoClose !== false) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }

    return id;
  }, [removeAlert]);

  const showSuccess = useCallback((message, options = {}) => {
    return showAlert('success', message, options);
  }, [showAlert]);

  const showError = useCallback((message, options = {}) => {
    return showAlert('error', message, options);
  }, [showAlert]);

  const showWarning = useCallback((message, options = {}) => {
    return showAlert('warning', message, options);
  }, [showAlert]);

  const showInfo = useCallback((message, options = {}) => {
    return showAlert('info', message, options);
  }, [showAlert]);

  const value = {
    alerts,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeAlert
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};

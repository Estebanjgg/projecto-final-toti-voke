import React, { useEffect, useState } from 'react';
import './AlertMessage.css';

const AlertMessage = ({ 
  type = 'info', 
  message, 
  isVisible, 
  onClose, 
  autoClose = true, 
  duration = 4000 
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      
      if (autoClose && onClose) {
        const timer = setTimeout(() => {
          setShow(false);
          setTimeout(() => onClose(), 300);
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setShow(false);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) {
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  return (
    <div className={`alert-message ${type} ${show ? 'show' : ''}`}>
      <div className="alert-content">
        <span className="alert-icon">{getIcon()}</span>
        <span className="alert-text">{message}</span>
        <button className="alert-close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default AlertMessage;

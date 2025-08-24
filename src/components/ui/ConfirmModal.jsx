import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  type = "warning" // warning, danger, info
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <div className={`confirm-modal-header ${type}`}>
          <div className="confirm-modal-icon">
            {type === 'warning' && '⚠️'}
            {type === 'danger' && '🚨'}
            {type === 'info' && 'ℹ️'}
          </div>
          <h3 className="confirm-modal-title">{title}</h3>
        </div>
        
        <div className="confirm-modal-body">
          <p className="confirm-modal-message">{message}</p>
        </div>
        
        <div className="confirm-modal-footer">
          <button 
            className="btn btn-cancel" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`btn btn-confirm ${type}`} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

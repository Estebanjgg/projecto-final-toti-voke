import React from 'react';
import AlertMessage from './AlertMessage';

const AlertContainer = ({ alerts, onRemoveAlert }) => {
  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
      {alerts.map((alert, index) => {
        return (
          <AlertMessage
            key={alert.id}
            type={alert.type}
            message={alert.message}
            isVisible={alert.isVisible}
            onClose={() => onRemoveAlert(alert.id)}
            autoClose={alert.autoClose}
            duration={alert.duration}
            style={{ 
              top: `${20 + index * 80}px`,
              marginBottom: '10px'
            }}
          />
        );
      })}
    </div>
  );
};

export default AlertContainer;

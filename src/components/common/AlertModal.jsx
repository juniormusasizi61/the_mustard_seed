import { useState } from 'react';
import './AlertModal.css';

export default function AlertModal({ 
  isOpen, 
  onClose, 
  title = "Alert",
  message,
  buttonText = "OK",
  showDontShowAgain = false,
  modalId, // Unique identifier for each modal type
  type = "info" // "info", "success", "warning", "error"
}) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (showDontShowAgain && dontShowAgain && modalId) {
      localStorage.setItem(`dontShow_${modalId}`, 'true');
    }
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getIcon = () => {
    switch(type) {
      case 'success':
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        );
      case 'warning':
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        );
      case 'error':
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        );
      default:
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        );
    }
  };

  return (
    <div className="alert-modal-backdrop" onClick={handleBackdropClick}>
      <div className={`alert-modal alert-modal-${type}`}>
        <div className="alert-modal-icon">
          {getIcon()}
        </div>

        <div className="alert-modal-header">
          <h3>{title}</h3>
        </div>
        
        <div className="alert-modal-body">
          <p>{message}</p>
        </div>

        {showDontShowAgain && (
          <div className="alert-modal-checkbox">
            <label>
              <input 
                type="checkbox" 
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
              <span>Don't show this again</span>
            </label>
          </div>
        )}

        <div className="alert-modal-actions">
          <button 
            className="alert-modal-btn ok-btn" 
            onClick={handleClose}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to check if user has disabled a specific modal
// eslint-disable-next-line react-refresh/only-export-components
export function shouldShowAlert(modalId) {
  return localStorage.getItem(`dontShow_${modalId}`) !== 'true';
}

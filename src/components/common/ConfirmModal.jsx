import { useState } from 'react';
import './ConfirmModal.css';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  showDontShowAgain = false,
  modalId // Unique identifier for each modal type
}) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (showDontShowAgain && dontShowAgain && modalId) {
      localStorage.setItem(`dontShow_${modalId}`, 'true');
    }
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div className="confirm-modal-backdrop" onClick={handleBackdropClick}>
      <div className="confirm-modal">
        <div className="confirm-modal-header">
          <h3>{title}</h3>
        </div>
        
        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>

        {showDontShowAgain && (
          <div className="confirm-modal-checkbox">
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

        <div className="confirm-modal-actions">
          <button 
            className="confirm-modal-btn cancel-btn" 
            onClick={handleCancel}
          >
            {cancelText}
          </button>
          <button 
            className="confirm-modal-btn confirm-btn" 
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to check if user has disabled a specific modal
// eslint-disable-next-line react-refresh/only-export-components
export function shouldShowModal(modalId) {
  return localStorage.getItem(`dontShow_${modalId}`) !== 'true';
}

// Helper function to reset a specific modal preference
// eslint-disable-next-line react-refresh/only-export-components
export function resetModalPreference(modalId) {
  localStorage.removeItem(`dontShow_${modalId}`);
}

// Helper function to reset all modal preferences
// eslint-disable-next-line react-refresh/only-export-components
export function resetAllModalPreferences() {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('dontShow_')) {
      localStorage.removeItem(key);
    }
  });
}

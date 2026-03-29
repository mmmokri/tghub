import React from 'react';
import '../styles/common/ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  theme: {
    bg: string;
    text: string;
    buttonPrimary: string;
    secondaryBg: string;
  };
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  theme
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div 
        className="modal-content" 
        style={{ backgroundColor: theme.bg, color: theme.text }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        
        <div className="modal-actions">
          <button 
            className="btn btn-confirm" 
            style={{ backgroundColor: theme.buttonPrimary, color: '#FFFFFF' }}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button 
            className="btn btn-cancel" 
            style={{ backgroundColor: theme.secondaryBg, color: theme.text }}
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

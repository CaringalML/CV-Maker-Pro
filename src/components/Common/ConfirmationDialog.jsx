import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmationDialog.css';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "delete" // "delete", "warning", "info"
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIconAndColor = () => {
    switch (type) {
      case 'delete':
        return {
          icon: <AlertTriangle size={24} />,
          iconColor: 'text-red-500',
          confirmButtonClass: 'confirm-btn-delete'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={24} />,
          iconColor: 'text-yellow-500',
          confirmButtonClass: 'confirm-btn-warning'
        };
      default:
        return {
          icon: <AlertTriangle size={24} />,
          iconColor: 'text-blue-500',
          confirmButtonClass: 'confirm-btn-primary'
        };
    }
  };

  const { icon, iconColor, confirmButtonClass } = getIconAndColor();

  return (
    <div className="confirmation-dialog-overlay" onClick={handleBackdropClick}>
      <div className="confirmation-dialog">
        {/* Header */}
        <div className="confirmation-dialog-header">
          <div className="confirmation-dialog-icon-container">
            <div className={`confirmation-dialog-icon ${iconColor}`}>
              {icon}
            </div>
          </div>
          <button
            onClick={onClose}
            className="confirmation-dialog-close"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="confirmation-dialog-content">
          <h3 className="confirmation-dialog-title">{title}</h3>
          <p className="confirmation-dialog-message">{message}</p>
        </div>

        {/* Actions */}
        <div className="confirmation-dialog-actions">
          <button
            onClick={onClose}
            className="confirmation-dialog-btn confirmation-dialog-btn-cancel"
            type="button"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`confirmation-dialog-btn ${confirmButtonClass}`}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
import React from "react";
import "../../assets/css/components/ConfirmModal.css";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("confirm-modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="confirm-modal-overlay" onClick={handleOverlayClick}>
      <div className="confirm-modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-modal-title">{title}</h3>

        <p className="confirm-modal-text">{message}</p>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-cancel-btn"
            onClick={onClose}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className="confirm-ok-btn"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

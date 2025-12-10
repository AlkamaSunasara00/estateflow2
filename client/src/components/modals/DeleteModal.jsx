import React, { useEffect, useState } from "react";
import "../../assets/css/components/DeleteModal.css"; 
import { toast } from "react-toastify";

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  const [randomCode, setRandomCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setRandomCode(code);
      setInputCode("");
      setError(""); // clear previous error
    }
  }, [isOpen]);

  const handleDelete = () => {
    if (inputCode.trim() === randomCode) {
      onConfirm();
    } else {
      setError("You entered wrong code!");
      toast.error("Wrong code");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-card">
        <h3 className="delete-modal-title">Confirm Delete</h3>

        <p className="delete-modal-text">
          Enter this code to confirm deletion:
        </p>

        <div className="delete-modal-code">{randomCode}</div>

        <input
          type="text"
          maxLength={4}
          value={inputCode}
          onChange={(e) => {
            setInputCode(e.target.value.replace(/\D/g, ""));
            if (error) setError("");   // remove error on typing
          }}
          className={`delete-modal-input ${error ? "input-error" : ""}`}
          placeholder="Enter code"
        />

        {error && <p className="delete-error">{error}</p>}

        <div className="delete-modal-actions">
          <button className="delete-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-confirm-btn" onClick={handleDelete}>
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

import React from 'react';
import './Modal.css';

/**
 * Modal reutilizable
 * Sigue SRP: solo maneja la estructura del modal
 */
const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className={`modal-content modal-${size}`}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;

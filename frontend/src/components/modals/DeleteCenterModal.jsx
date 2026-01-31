import React, { useState } from 'react';
import Modal from '../common/Modal';
import { centerService } from '../../services/centerService';
import './DeleteCenterModal.css';

/**
 * Modal de confirmación para eliminar un centro
 */
const DeleteCenterModal = ({ isOpen, onClose, center, onSuccess }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            await centerService.delete(center.id);
            console.log('✅ Centro eliminado:', center.id);
            onSuccess(center.id);
            onClose();
        } catch (err) {
            console.error('❌ Error al eliminar centro:', err);
            setError(err.message || 'Error al eliminar el centro');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClose = () => {
        if (!isDeleting) {
            setError(null);
            onClose();
        }
    };

    if (!center) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="🗑️ Eliminar Centro"
            size="small"
        >
            <div className="delete-modal-content">
                {error && (
                    <div className="alert alert-error">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                <div className="delete-warning">
                    <div className="warning-icon">⚠️</div>
                    <p><strong>¿Estás seguro que deseas eliminar este centro?</strong></p>
                    <p className="center-name">{center.name}</p>
                    <p className="warning-text">
                        Esta acción no se puede deshacer.
                    </p>
                </div>

                <div className="delete-actions">
                    <button
                        onClick={handleClose}
                        className="btn btn-secondary"
                        disabled={isDeleting}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete}
                        className="btn btn-danger"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteCenterModal;

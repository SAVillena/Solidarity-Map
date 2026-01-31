import React, { useState } from 'react';
import Modal from '../common/Modal';
import CenterForm from '../forms/CenterForm';
import { centerService } from '../../services/centerService';

/**
 * Modal para editar un centro existente
 */
const EditCenterModal = ({ isOpen, onClose, center, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const updatedCenter = await centerService.update(center.id, formData);
            console.log('✅ Centro actualizado:', updatedCenter);
            onSuccess(updatedCenter);
            onClose();
        } catch (err) {
            console.error('❌ Error al actualizar centro:', err);
            setError(err.message || 'Error al actualizar el centro');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setError(null);
            onClose();
        }
    };

    if (!center) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="📝 Editar Centro"
            size="large"
        >
            {error && (
                <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}
            <CenterForm
                initialData={center}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                isSubmitting={isSubmitting}
            />
        </Modal>
    );
};

export default EditCenterModal;

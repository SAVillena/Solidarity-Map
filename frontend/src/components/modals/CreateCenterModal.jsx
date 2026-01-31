import React, { useState } from 'react';
import Modal from '../common/Modal';
import CenterForm from '../forms/CenterForm';
import { centerService } from '../../services/centerService';

/**
 * Modal para crear un nuevo centro
 */
const CreateCenterModal = ({ isOpen, onClose, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const createdCenter = await centerService.create(formData);
            console.log('✅ Centro creado:', createdCenter);
            onSuccess(createdCenter);
            onClose();
        } catch (err) {
            console.error('❌ Error al crear centro:', err);
            setError(err.message || 'Error al crear el centro');
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

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="➕ Crear Nuevo Centro"
            size="large"
        >
            {error && (
                <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}
            <CenterForm
                onSubmit={handleSubmit}
                onCancel={handleClose}
                isSubmitting={isSubmitting}
            />
        </Modal>
    );
};

export default CreateCenterModal;

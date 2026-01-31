import React, { useState } from 'react';
import LocationPicker from '../common/LocationPicker';
import './CenterForm.css';

/**
 * Formulario reutilizable para crear/editar centros
 * Sigue SRP: solo maneja el formulario y emite eventos
 */
const CenterForm = ({ initialData = {}, onSubmit, onCancel, isSubmitting = false }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        address: initialData.address || '',
        contactNumber: initialData.contactNumber || '',
        type: initialData.type || 'ACOPIO',
        urgencyStatus: initialData.urgencyStatus ?? 0,
        latitude: initialData.latitude || -33.4489,
        longitude: initialData.longitude || -70.6693,
        operatingHours: initialData.operatingHours || '',
        // Convertir array a string separado por comas para el textarea
        suppliesNeeded: Array.isArray(initialData.suppliesNeeded)
            ? initialData.suppliesNeeded.join(', ')
            : (initialData.suppliesNeeded || '')
    });

    const [showLocationPicker, setShowLocationPicker] = useState(false);

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error del campo al editarlo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        } else if (formData.name.length < 3) {
            newErrors.name = 'El nombre debe tener al menos 3 caracteres';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'La dirección es requerida';
        }

        if (formData.contactNumber && !/^(\+?56)?\s?[0-9]{8,9}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = 'Número de contacto inválido (formato chileno)';
        }

        const lat = parseFloat(formData.latitude);
        const lon = parseFloat(formData.longitude);

        if (!formData.latitude || isNaN(lat) || lat < -90 || lat > 90) {
            newErrors.latitude = 'Latitud inválida (-90 a 90)';
        }

        if (!formData.longitude || isNaN(lon) || lon < -180 || lon > 180) {
            newErrors.longitude = 'Longitud inválida (-180 a 180)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Preparar datos para enviar
        const submitData = {
            name: formData.name.trim(),
            address: formData.address.trim(),
            contactNumber: formData.contactNumber.trim() || null,
            type: formData.type,
            urgencyStatus: parseInt(formData.urgencyStatus),
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            operatingHours: formData.operatingHours.trim() || null,
            // Convertir suppliesNeeded a array JSON
            suppliesNeeded: formData.suppliesNeeded.trim()
                ? formData.suppliesNeeded.split(',').map(item => item.trim()).filter(item => item)
                : []
        };

        onSubmit(submitData);
    };

    return (
        <form className="center-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Nombre *</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                    disabled={isSubmitting}
                    placeholder="Ej: Centro Acopio Santiago Centro"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="address">Dirección *</label>
                <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? 'error' : ''}
                    disabled={isSubmitting}
                    placeholder="Ej: Av. Libertador Bernardo O'Higgins 1234, Santiago"
                    rows="2"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="contactNumber">Teléfono de Contacto</label>
                    <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className={errors.contactNumber ? 'error' : ''}
                        disabled={isSubmitting}
                        placeholder="+56912345678"
                    />
                    {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="type">Tipo *</label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    >
                        <option value="ACOPIO">Centro de Acopio</option>
                        <option value="VETERINARIA">Veterinaria</option>
                    </select>
                </div>
            </div>

            <div className="form-group location-section">
                <div className="location-header">
                    <label>📍 Ubicación del Centro</label>
                    <button
                        type="button"
                        className="btn-toggle-map"
                        onClick={() => setShowLocationPicker(!showLocationPicker)}
                    >
                        {showLocationPicker ? '▼ Ocultar Mapa' : '▶ Editar Ubicación en Mapa'}
                    </button>
                </div>

                {showLocationPicker && (
                    <LocationPicker
                        initialPosition={{ lat: formData.latitude, lng: formData.longitude }}
                        onChange={(position) => {
                            setFormData(prev => ({
                                ...prev,
                                latitude: position.lat,
                                longitude: position.lng
                            }));
                        }}
                    />
                )}

                <div className="current-location-info">
                    <span>📌 Coordenadas actuales:</span>
                    <code>Lat: {formData.latitude.toFixed(6)}, Lng: {formData.longitude.toFixed(6)}</code>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="urgencyStatus">Estado de Urgencia *</label>
                <select
                    id="urgencyStatus"
                    name="urgencyStatus"
                    value={formData.urgencyStatus}
                    onChange={handleChange}
                    disabled={isSubmitting}
                >
                    <option value="0">🟢 Baja - No requiere ayuda urgente</option>
                    <option value="1">🟡 Media - Abastecidos pero requieren apoyo</option>
                    <option value="2">🔴 Alta - Requieren ayuda urgente</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="operatingHours">Horario de Atención</label>
                <input
                    type="text"
                    id="operatingHours"
                    name="operatingHours"
                    value={formData.operatingHours}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder='Ej: Lun-Vie 9:00-18:00'
                />
                <small>Formato libre, ej: "Lun-Vie 9:00-18:00, Sáb 10:00-14:00"</small>
            </div>

            <div className="form-group">
                <label htmlFor="suppliesNeeded">Suministros Necesarios</label>
                <textarea
                    id="suppliesNeeded"
                    name="suppliesNeeded"
                    value={formData.suppliesNeeded}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Ej: Alimentos, agua, medicamentos"
                    rows="3"
                />
                <small>Lista separada por comas</small>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary"
                    disabled={isSubmitting}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Guardando...' : initialData.id ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </form>
    );
};

export default CenterForm;

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Modal para crear/editar usuarios
 */
const UserFormModal = ({ isOpen, onClose, onSubmit, user, isEditing }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'USER',
        enabled: true
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing && user) {
            setFormData({
                username: user.username,
                email: user.email,
                password: '',
                role: user.role,
                enabled: user.enabled
            });
        } else {
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'USER',
                enabled: true
            });
        }
    }, [isEditing, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Preparar datos según si es crear o editar
            const submitData = isEditing
                ? {
                    email: formData.email !== user.email ? formData.email : undefined,
                    password: formData.password || undefined,
                    role: formData.role !== user.role ? formData.role : undefined,
                    enabled: formData.enabled !== user.enabled ? formData.enabled : undefined
                }
                : formData;

            // Eliminar campos undefined
            Object.keys(submitData).forEach(key =>
                submitData[key] === undefined && delete submitData[key]
            );

            await onSubmit(submitData);
        } catch (err) {
            console.error('Error en formulario:', err);
            setError(err.response?.data || 'Error al guardar usuario');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                        {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username - Solo en crear */}
                    {!isEditing && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Usuario *
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                minLength={3}
                            />
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Contraseña {isEditing ? '(opcional)' : '*'}
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={!isEditing}
                            minLength={6}
                            placeholder={isEditing ? 'Dejar en blanco para no cambiar' : ''}
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Rol *
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="USER">USER</option>
                            <option value="VOLUNTEER">VOLUNTEER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                    {/* Enabled */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enabled"
                            checked={formData.enabled}
                            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="enabled" className="ml-2 text-sm text-gray-700">
                            Usuario activo
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;

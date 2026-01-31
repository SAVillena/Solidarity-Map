import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Modal de confirmación para eliminar usuario
 */
const DeleteUserModal = ({ isOpen, onClose, onConfirm, user }) => {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="text-red-600" size={24} />
                        <h3 className="text-xl font-bold text-gray-800">
                            Eliminar Usuario
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <p className="text-gray-700 mb-2">
                        ¿Estás seguro que deseas eliminar al usuario:
                    </p>
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-gray-900">{user.username}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <p className="text-red-600 text-sm mt-3">
                        ⚠️ Esta acción no se puede deshacer
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserModal;

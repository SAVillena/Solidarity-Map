import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import userManagementService from '../../services/userManagementService';
import UserFormModal from './UserFormModal';
import DeleteUserModal from './DeleteUserModal';

/**
 * Componente de gestión de usuarios para el panel de administración
 */
const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Cargar usuarios al montar el componente
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await userManagementService.getAllUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setError('Error al cargar la lista de usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setIsEditing(false);
        setShowFormModal(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsEditing(true);
        setShowFormModal(true);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleFormSubmit = async (userData) => {
        try {
            if (isEditing) {
                await userManagementService.updateUser(selectedUser.id, userData);
            } else {
                await userManagementService.createUser(userData);
            }
            setShowFormModal(false);
            loadUsers();
        } catch (err) {
            throw err; // El modal mostrará el error
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await userManagementService.deleteUser(selectedUser.id);
            setShowDeleteModal(false);
            loadUsers();
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            alert(err.response?.data || 'Error al eliminar usuario');
        }
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            ADMIN: 'bg-red-100 text-red-800',
            VOLUNTEER: 'bg-blue-100 text-blue-800',
            USER: 'bg-gray-100 text-gray-800'
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-600">Cargando usuarios...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <Users className="text-blue-600" size={32} />
                    <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Crear Usuario
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Usuario
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rol
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha Creación
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{user.username}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.enabled ? (
                                        <span className="flex items-center gap-1 text-green-600">
                                            <CheckCircle size={16} />
                                            Activo
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-red-600">
                                            <XCircle size={16} />
                                            Inactivo
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                        title="Editar"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user)}
                                        className="text-red-600 hover:text-red-900"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No hay usuarios registrados
                    </div>
                )}
            </div>

            {/* Modals */}
            {showFormModal && (
                <UserFormModal
                    isOpen={showFormModal}
                    onClose={() => setShowFormModal(false)}
                    onSubmit={handleFormSubmit}
                    user={selectedUser}
                    isEditing={isEditing}
                />
            )}

            {showDeleteModal && (
                <DeleteUserModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    user={selectedUser}
                />
            )}
        </div>
    );
};

export default UserManagement;

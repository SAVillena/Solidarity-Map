import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';
import userManagementService from '../../services/userManagementService';
import UserFormModal from './UserFormModal';
import DeleteUserModal from './DeleteUserModal';
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Input from '../common/Input';

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
    const [searchTerm, setSearchTerm] = useState('');

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

    const getRoleBadge = (role) => {
        const badges = {
            ADMIN: { variant: 'danger' },
            VOLUNTEER: { variant: 'info' },
            USER: { variant: 'gray' }
        };
        const config = badges[role] || badges.USER;
        return <Badge variant={config.variant} size="sm">{role}</Badge>;
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="spinner spinner-lg border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">Usuarios Registrados</h2>
                <Button
                    variant="primary"
                    onClick={handleCreate}
                    icon={<Plus size={18} />}
                >
                    Crear Usuario
                </Button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-fade-in">
                    {error}
                </div>
            )}

            {/* Filter */}
            <Card className="p-4">
                <div className="w-full sm:w-1/3">
                    <Input
                        placeholder="Buscar por usuario o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search size={18} />}
                    />
                </div>
            </Card>

            {/* Users Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                    Fecha Creación
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                <Users size={16} />
                                            </div>
                                            <div className="font-medium text-gray-900">{user.username}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.enabled ? (
                                            <Badge variant="success" dot size="sm">Activo</Badge>
                                        ) : (
                                            <Badge variant="danger" dot size="sm">Inactivo</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleEdit(user)}
                                                className="text-primary-600 hover:bg-primary-50 px-2"
                                                title="Editar"
                                            >
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(user)}
                                                className="text-red-600 hover:bg-red-50 px-2"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-gray-50/50">
                        <Users size={40} className="mx-auto text-gray-300 mb-2" />
                        <h3 className="text-sm font-medium text-gray-900">No se encontraron usuarios</h3>
                        <p className="mt-1 text-xs text-gray-500">Prueba con otra búsqueda o crea un nuevo usuario</p>
                    </div>
                )}
            </Card>

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

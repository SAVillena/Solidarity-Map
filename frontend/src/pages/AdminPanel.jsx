import React, { useState, useEffect } from 'react';
import { useCenters } from '../hooks/useCenters';
import CreateCenterModal from '../components/modals/CreateCenterModal';
import EditCenterModal from '../components/modals/EditCenterModal';
import DeleteCenterModal from '../components/modals/DeleteCenterModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ImportComponent from '../components/ImportComponent';
import UserManagement from '../components/admin/UserManagement';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import { Plus, Search, Package, Stethoscope, Filter } from 'lucide-react';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('centers'); // 'centers' or 'users'
    const { centers, loading, error, refresh } = useCenters();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCenter, setSelectedCenter] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    // Refresh en mount (solo una vez)
    useEffect(() => {
        if (activeTab === 'centers') {
            refresh();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const handleCreateSuccess = () => {
        refresh();
    };

    const handleEditClick = (center) => {
        setSelectedCenter(center);
        setShowEditModal(true);
    };

    const handleEditSuccess = () => {
        refresh();
    };

    const handleDeleteClick = (center) => {
        setSelectedCenter(center);
        setShowDeleteModal(true);
    };

    const handleDeleteSuccess = () => {
        refresh();
    };

    const handleImportSuccess = () => {
        refresh();
    };

    // Filtrar centros
    const filteredCenters = centers.filter(center => {
        const matchesType = filter === 'ALL' || center.type === filter;
        const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            center.address.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    const getUrgencyBadge = (status) => {
        const badges = {
            0: { variant: 'success', text: 'Baja' },
            1: { variant: 'warning', text: 'Media' },
            2: { variant: 'danger', text: 'Alta' }
        };
        return badges[status] || badges[0];
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
            <PageHeader
                title="Panel de Administración"
                description="Gestiona los centros de ayuda y usuarios del sistema"
            />

            {/* Tabs */}
            <div className="mb-8 border-b border-gray-200">
                <div className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('centers')}
                        className={`
                            py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center gap-2
                            ${activeTab === 'centers'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        `}
                    >
                        <Package size={18} />
                        Gestión de Centros
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`
                            py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center gap-2
                            ${activeTab === 'users'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        `}
                    >
                        <Stethoscope size={18} />
                        Gestión de Usuarios
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'centers' ? (
                <div className="space-y-6 animate-slide-in-up">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-semibold text-gray-800">Centros Registrados</h2>
                        <Button
                            variant="primary"
                            onClick={() => setShowCreateModal(true)}
                            icon={<Plus size={18} />}
                        >
                            Nuevo Centro
                        </Button>
                    </div>

                    {error && <ErrorMessage message={error} />}

                    {/* Importar Excel */}
                    <Card className="p-6 bg-blue-50 border-blue-100">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                            📂 Importación Masiva
                        </h3>
                        <ImportComponent onImportSuccess={handleImportSuccess} />
                    </Card>

                    {/* Filters & Search */}
                    <Card className="p-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="w-full md:w-1/3">
                                <Input
                                    placeholder="Buscar por nombre o dirección..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    leftIcon={<Search size={18} />}
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                                <span className="text-sm text-gray-500 font-medium whitespace-nowrap flex items-center gap-1">
                                    <Filter size={16} /> Filtros:
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant={filter === 'ALL' ? 'primary' : 'outline'}
                                        onClick={() => setFilter('ALL')}
                                    >
                                        Todos
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={filter === 'ACOPIO' ? 'primary' : 'outline'}
                                        onClick={() => setFilter('ACOPIO')}
                                    >
                                        Acopios
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={filter === 'VETERINARIA' ? 'primary' : 'outline'}
                                        onClick={() => setFilter('VETERINARIA')}
                                    >
                                        Veterinarias
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Table */}
                    <Card className="overflow-hidden">
                        {loading && centers.length === 0 ? (
                            <div className="p-8 flex justify-center">
                                <LoadingSpinner />
                            </div>
                        ) : filteredCenters.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <Search size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No se encontraron centros</h3>
                                <p className="mt-1">Intenta ajustar los filtros o la búsqueda</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgencia</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredCenters.map(center => {
                                            const urgency = getUrgencyBadge(center.urgencyStatus);
                                            return (
                                                <tr key={center.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">{center.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge variant={center.type === 'ACOPIO' ? 'primary' : 'secondary'} dot>
                                                            {center.type}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-truncate max-w-[200px]">
                                                        {center.address}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {center.contactNumber || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge variant={urgency.variant}>
                                                            {urgency.text}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleEditClick(center)}
                                                                className="text-primary-600 hover:bg-primary-50"
                                                            >
                                                                Editar
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleDeleteClick(center)}
                                                                className="text-red-600 hover:bg-red-50"
                                                            >
                                                                Eliminar
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>

                    {/* Modales */}
                    <CreateCenterModal
                        isOpen={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                        onSuccess={handleCreateSuccess}
                    />
                    <EditCenterModal
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        center={selectedCenter}
                        onSuccess={handleEditSuccess}
                    />
                    <DeleteCenterModal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        center={selectedCenter}
                        onSuccess={handleDeleteSuccess}
                    />
                </div>
            ) : (
                /* Users Management Content */
                <div className="animate-slide-in-up">
                    <UserManagement />
                </div>
            )}
        </div>
    );
};

export default AdminPanel;

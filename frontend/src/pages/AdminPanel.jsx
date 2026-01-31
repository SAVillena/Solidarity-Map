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
import { Plus, Search, Package, Stethoscope, Filter, AlertTriangle, CheckCircle, Edit, Trash2, XCircle } from 'lucide-react';
import { centerService } from '../services/centerService';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('centers'); // 'centers' or 'users'
    const { centers, loading, error, refresh } = useCenters();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCenter, setSelectedCenter] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [pendingCenters, setPendingCenters] = useState([]);

    // Fetch pending centers
    // Fetch pending centers to update badge count
    useEffect(() => {
        fetchPending();
    }, [activeTab]);

    const fetchPending = async () => {
        try {
            const data = await centerService.getPending();
            setPendingCenters(data);
        } catch (err) {
            console.error("Error loading pending centers", err);
        }
    };

    const handleApprove = async (id) => {
        if (window.confirm('¿Aprobar este centro? Será visible para todo el público.')) {
            try {
                await centerService.approve(id);
                fetchPending(); // Refresh list
                refresh(); // Refresh Approved list too
            } catch (err) {
                alert('Error al aprobar centro');
            }
        }
    };

    const handleReject = async (id) => {
        if (window.confirm('¿Rechazar este centro? Esta acción no se puede deshacer.')) {
            try {
                await centerService.reject(id);
                fetchPending();
            } catch (err) {
                alert('Error al rechazar centro');
            }
        }
    };

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
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`
                            py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center gap-2
                            ${activeTab === 'pending'
                                ? 'border-yellow-500 text-yellow-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        `}
                    >
                        <AlertTriangle size={18} />
                        Pendientes ({pendingCenters.length})
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            {
                activeTab === 'centers' ? (
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
                                                                    className="text-primary-600 hover:bg-primary-50 px-2"
                                                                    title="Editar"
                                                                >
                                                                    <Edit size={16} />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleDeleteClick(center)}
                                                                    className="text-red-600 hover:bg-red-50 px-2"
                                                                    title="Eliminar"
                                                                >
                                                                    <Trash2 size={16} />
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

                ) : activeTab === 'pending' ? (
                    <div className="space-y-6 animate-slide-in-up">
                        <h2 className="text-xl font-semibold text-gray-800">Sugerencias Pendientes de Revisión</h2>

                        <Card className="overflow-hidden">
                            {loading && pendingCenters.length === 0 ? (
                                <div className="p-8 flex justify-center">
                                    <LoadingSpinner />
                                </div>
                            ) : pendingCenters.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-yellow-50 mb-4">
                                        <AlertTriangle size={32} className="text-yellow-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">No hay sugerencias pendientes</h3>
                                    <p className="mt-1">Todas las sugerencias han sido revisadas.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insumos</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {pendingCenters.map(center => (
                                                <tr key={center.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">{center.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge variant={center.type === 'ACOPIO' ? 'primary' : 'secondary'} dot>
                                                            {center.type}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {center.address}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {center.suppliesNeeded ? (
                                                                // Handle string or array
                                                                (typeof center.suppliesNeeded === 'string'
                                                                    ? JSON.parse(center.suppliesNeeded)
                                                                    : center.suppliesNeeded
                                                                ).map((supply, i) => (
                                                                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                                        {supply}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-gray-400 text-sm">-</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleApprove(center.id)}
                                                                className="text-green-600 hover:bg-green-50 px-2"
                                                                title="Aprobar"
                                                            >
                                                                <CheckCircle size={18} />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleReject(center.id)}
                                                                className="text-red-600 hover:bg-red-50 px-2"
                                                                title="Rechazar"
                                                            >
                                                                <XCircle size={18} />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Card>
                    </div>
                ) : (
                    /* Users Management Content */
                    <div className="animate-slide-in-up">
                        <UserManagement />
                    </div>
                )
            }
        </div >
    );
};

export default AdminPanel;

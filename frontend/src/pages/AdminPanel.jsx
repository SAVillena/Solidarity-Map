import React, { useState, useEffect } from 'react';
import { useCenters } from '../hooks/useCenters';
import CreateCenterModal from '../components/modals/CreateCenterModal';
import EditCenterModal from '../components/modals/EditCenterModal';
import DeleteCenterModal from '../components/modals/DeleteCenterModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ImportComponent from '../components/ImportComponent';
import './AdminPanel.css';

const AdminPanel = () => {
    const { centers, loading, error, refresh } = useCenters();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCenter, setSelectedCenter] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    // Refresh en mount (solo una vez)
    useEffect(() => {
        refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            0: { emoji: '🟢', text: 'Baja', class: 'badge-low' },
            1: { emoji: '🟡', text: 'Media', class: 'badge-medium' },
            2: { emoji: '🔴', text: 'Alta', class: 'badge-high' }
        };
        return badges[status] || badges[0];
    };

    if (loading && centers.length === 0) {
        return (
            <div className="admin-panel">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <div>
                    <h1>🛠️ Panel de Administración</h1>
                    <p>Gestiona todos los centros de ayuda</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary"
                >
                    ➕ Nuevo Centro
                </button>
            </div>

            {error && <ErrorMessage message={error} />}

            {/* Importar Excel */}
            <div className="admin-section">
                <h2>📂 Importar Centros</h2>
                <ImportComponent onImportSuccess={handleImportSuccess} />
            </div>

            {/* Filtros y búsqueda */}
            <div className="admin-section">
                <div className="filters-row">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="🔍 Buscar por nombre o dirección..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
                            onClick={() => setFilter('ALL')}
                        >
                            Todos ({centers.length})
                        </button>
                        <button
                            className={`filter-btn ${filter === 'ACOPIO' ? 'active' : ''}`}
                            onClick={() => setFilter('ACOPIO')}
                        >
                            Acopio ({centers.filter(c => c.type === 'ACOPIO').length})
                        </button>
                        <button
                            className={`filter-btn ${filter === 'VETERINARIA' ? 'active' : ''}`}
                            onClick={() => setFilter('VETERINARIA')}
                        >
                            Veterinarias ({centers.filter(c => c.type === 'VETERINARIA').length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabla de centros */}
            <div className="admin-section">
                <h2>📋 Centros ({filteredCenters.length})</h2>
                {filteredCenters.length === 0 ? (
                    <div className="empty-state">
                        <p>No hay centros que coincidan con los filtros</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="centers-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th>Dirección</th>
                                    <th>Teléfono</th>
                                    <th>Urgencia</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCenters.map(center => {
                                    const urgency = getUrgencyBadge(center.urgencyStatus);
                                    return (
                                        <tr key={center.id}>
                                            <td className="center-name">{center.name}</td>
                                            <td>
                                                <span className={`type-badge type-${center.type.toLowerCase()}`}>
                                                    {center.type === 'ACOPIO' ? '📦' : '🏥'} {center.type}
                                                </span>
                                            </td>
                                            <td className="center-address">{center.address}</td>
                                            <td>{center.contactNumber || '-'}</td>
                                            <td>
                                                <span className={`urgency-badge ${urgency.class}`}>
                                                    {urgency.emoji} {urgency.text}
                                                </span>
                                            </td>
                                            <td className="actions-cell">
                                                <button
                                                    onClick={() => handleEditClick(center)}
                                                    className="action-btn edit-btn"
                                                    title="Editar"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(center)}
                                                    className="action-btn delete-btn"
                                                    title="Eliminar"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

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
    );
};

export default AdminPanel;

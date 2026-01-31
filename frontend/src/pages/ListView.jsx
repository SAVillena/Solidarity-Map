import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

import { useCenters } from '../hooks/useCenters';
import { useGeolocation } from '../hooks/useGeolocation';
import { useNearbyCenters } from '../hooks/useNearbyCenters';
import FilterButtons from '../components/common/FilterButtons';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import CenterCard from '../components/common/CenterCard';

const ListView = () => {
    const [selectedType, setSelectedType] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [nearbyMode, setNearbyMode] = useState(false);
    const [searchRadius, setSearchRadius] = useState(5000);

    const { centers: allCenters, loading, error } = useCenters(selectedType === 'ALL' ? null : selectedType);
    const { location: userLocation } = useGeolocation();
    const { centers: nearbyCenters, loading: nearbyLoading } = useNearbyCenters(userLocation, searchRadius, nearbyMode);

    // Use nearby centers when in nearby mode, otherwise all centers
    const centers = nearbyMode ? nearbyCenters : allCenters;
    const isLoading = nearbyMode ? nearbyLoading : loading;

    // Filtrar centros por búsqueda
    const filteredCenters = centers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNearbyToggle = () => {
        if (!userLocation) {
            alert('Necesitas habilitar la geolocalización para usar esta función');
            return;
        }
        setNearbyMode(!nearbyMode);
    };

    // Configuración de fil tros
    const filters = [
        { id: 'ALL', label: 'Todos', count: centers.length },
        { id: 'ACOPIO', label: 'Acopio', icon: '📦' },
        { id: 'VETERINARIA', label: 'Veterinarias', icon: '🏥' }
    ];

    return (
        <div className="h-full overflow-auto bg-gray-50">
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Lista de Centros</h2>
                    <p className="text-gray-600">Encuentra centros de acopio y veterinarias cerca de ti</p>
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6 space-y-4">
                    {/* Nearby Search Button */}
                    <button
                        onClick={handleNearbyToggle}
                        disabled={!userLocation}
                        className={`w-full px-4 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${nearbyMode
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } ${!userLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <MapPin size={20} />
                        {nearbyMode ? `Mostrando ${centers.length} cerca` : 'Cerca de mí'}
                    </button>

                    {/* Radius Selector (only in nearby mode) */}
                    {nearbyMode && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <label className="block text-sm font-semibold text-blue-900 mb-2">
                                Radio de búsqueda
                            </label>
                            <select
                                value={searchRadius}
                                onChange={(e) => setSearchRadius(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={1000}>1 km</option>
                                <option value={3000}>3 km</option>
                                <option value={5000}>5 km</option>
                                <option value={10000}>10 km</option>
                                <option value={20000}>20 km</option>
                            </select>
                        </div>
                    )}

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o dirección..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Type Filter */}
                    <div className="flex gap-2 flex-wrap">
                        {filters.map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setSelectedType(filter.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition ${selectedType === filter.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {filter.icon && <span className="mr-1">{filter.icon}</span>}
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 text-gray-600">
                    <span className="font-semibold">{filteredCenters.length}</span> centros encontrados
                </div>

                {/* Centers List */}
                <div className="space-y-4">
                    {loading ? (
                        <LoadingSpinner message="Cargando centros..." />
                    ) : error ? (
                        <ErrorMessage error={error} title="Error al cargar centros" />
                    ) : filteredCenters.length === 0 ? (
                        <ErrorMessage error="No se encontraron centros" title="Sin resultados" />
                    ) : (
                        filteredCenters.map(center => (
                            <CenterCard key={center.id} center={center} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListView;

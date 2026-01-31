import React, { useState, useEffect } from 'react';
import { Search, MapPin, Box, Stethoscope, Filter, AlertTriangle, Plus } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useNearbyCenters } from '../hooks/useNearbyCenters';
import { centerService } from '../services/centerService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import CenterCard from '../components/common/CenterCard';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import SuggestCenterModal from '../components/SuggestCenterModal';

const ListView = () => {
    // Search & Filter State
    const [selectedType, setSelectedType] = useState('ALL');
    const [urgencyStatus, setUrgencyStatus] = useState(null); // null, 0, 1, 2
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Modal State
    const [suggestModalOpen, setSuggestModalOpen] = useState(false);

    // Data State
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Nearby Mode State
    const [nearbyMode, setNearbyMode] = useState(false);
    const [searchRadius, setSearchRadius] = useState(5000);

    const { location: userLocation } = useGeolocation();
    const { centers: nearbyCenters, loading: nearbyLoading } = useNearbyCenters(
        nearbyMode ? userLocation : null,
        searchRadius,
        nearbyMode
    );

    // Debounce Search Term
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch Centers (Server-side Search)
    useEffect(() => {
        if (nearbyMode) return; // Don't fetch if in nearby mode

        const fetchCenters = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = {
                    query: debouncedSearchTerm,
                    type: selectedType === 'ALL' ? null : selectedType,
                    urgencyStatus: urgencyStatus === 'ALL' ? null : urgencyStatus
                };
                const data = await centerService.search(params);
                setCenters(data);
            } catch (err) {
                console.error("Search error:", err);
                setError(err.message || 'Error al buscar centros');
            } finally {
                setLoading(false);
            }
        };

        fetchCenters();
    }, [debouncedSearchTerm, selectedType, urgencyStatus, nearbyMode]);

    // Determine what to display
    const activeCenters = nearbyMode ? nearbyCenters : centers;
    const isLoading = nearbyMode ? nearbyLoading : loading;

    const handleNearbyToggle = () => {
        if (!userLocation) {
            alert('Necesitas habilitar la geolocalización para usar esta función');
            return;
        }
        setNearbyMode(!nearbyMode);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedType('ALL');
        setUrgencyStatus(null);
        setNearbyMode(false);
    };

    return (
        <div className="h-full overflow-y-auto custom-scrollbar bg-gray-50 pb-20">
            <div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in">
                <PageHeader
                    title="Lista de Centros"
                    description="Encuentra centros de acopio y veterinarias cerca de ti"
                    actions={
                        <Button
                            variant="primary"
                            onClick={() => setSuggestModalOpen(true)}
                            icon={<Plus size={18} />}
                            className="shadow-lg shadow-blue-500/30"
                        >
                            Sugerir Centro
                        </Button>
                    }
                />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1 space-y-4">
                        <Card className="p-4 sticky top-24">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Filter size={18} /> Filtros
                                </h3>
                                {(searchTerm || selectedType !== 'ALL' || urgencyStatus !== null || nearbyMode) && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>

                            {/* Search */}
                            <div className="mb-4">
                                <Input
                                    placeholder="Buscar por nombre..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    leftIcon={<Search size={16} />}
                                    className="text-sm"
                                    disabled={nearbyMode}
                                />
                            </div>

                            {/* Type Filter */}
                            <div className="space-y-2 mb-6">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</p>
                                <Button
                                    variant={selectedType === 'ALL' ? 'primary' : 'ghost'}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedType('ALL')}
                                    disabled={nearbyMode}
                                >
                                    Todos
                                </Button>
                                <Button
                                    variant={selectedType === 'ACOPIO' ? 'primary' : 'ghost'}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedType('ACOPIO')}
                                    icon={<Box size={16} />}
                                    disabled={nearbyMode}
                                >
                                    Acopios
                                </Button>
                                <Button
                                    variant={selectedType === 'VETERINARIA' ? 'primary' : 'ghost'}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedType('VETERINARIA')}
                                    icon={<Stethoscope size={16} />}
                                    disabled={nearbyMode}
                                >
                                    Veterinarias
                                </Button>
                            </div>

                            {/* Urgency Filter */}
                            <div className="space-y-2 mb-6">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Urgencia</p>
                                <div className="grid grid-cols-3 gap-1">
                                    <button
                                        onClick={() => setUrgencyStatus(null)}
                                        disabled={nearbyMode}
                                        className={`px-2 py-1.5 text-xs rounded-md border transition-colors ${urgencyStatus === null
                                            ? 'bg-gray-800 text-white border-gray-800'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        Todos
                                    </button>
                                    <button
                                        onClick={() => setUrgencyStatus(2)}
                                        disabled={nearbyMode}
                                        className={`px-2 py-1.5 text-xs rounded-md border transition-colors flex justify-center items-center gap-1 ${urgencyStatus === 2
                                            ? 'bg-red-100 text-red-700 border-red-200 font-bold'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <AlertTriangle size={10} /> Alta
                                    </button>
                                    <button
                                        onClick={() => setUrgencyStatus(1)}
                                        disabled={nearbyMode}
                                        className={`px-2 py-1.5 text-xs rounded-md border transition-colors ${urgencyStatus === 1
                                            ? 'bg-amber-100 text-amber-700 border-amber-200 font-bold'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        Media
                                    </button>
                                </div>
                            </div>

                            <hr className="border-gray-100 my-4" />

                            {/* Nearby Toggle */}
                            <div className="space-y-3">
                                <Button
                                    variant={nearbyMode ? 'secondary' : 'outline'}
                                    className="w-full justify-center"
                                    onClick={handleNearbyToggle}
                                    disabled={!userLocation}
                                    icon={<MapPin size={16} />}
                                >
                                    {nearbyMode ? 'Modo Cercanía Activo' : 'Buscar Cerca de Mí'}
                                </Button>

                                {nearbyMode && (
                                    <div className="animate-fade-in bg-secondary-50 p-3 rounded-lg border border-secondary-100">
                                        <label className="text-xs font-semibold text-secondary-800 block mb-2">
                                            Radio: {searchRadius / 1000} km
                                        </label>
                                        <input
                                            type="range"
                                            min="1000"
                                            max="20000"
                                            step="1000"
                                            value={searchRadius}
                                            onChange={(e) => setSearchRadius(Number(e.target.value))}
                                            className="w-full accent-secondary-600"
                                        />
                                        <div className="flex justify-between text-xs text-secondary-600 mt-1">
                                            <span>1km</span>
                                            <span>20km</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Main Content List */}
                    <div className="lg:col-span-3">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-700">
                                {activeCenters.length} resultados encontrados
                            </h3>
                            {nearbyMode && (
                                <span className="text-xs font-medium text-secondary-600 bg-secondary-50 px-2 py-1 rounded-md">
                                    Ordenado por cercanía
                                </span>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <LoadingSpinner message="Buscando centros..." />
                            </div>
                        ) : error ? (
                            <ErrorMessage error={error} title="Error al cargar centros" />
                        ) : activeCenters.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                                    <Search size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No se encontraron centros</h3>
                                <p className="text-gray-500 mt-1">Intenta ajustar tu búsqueda o filtros</p>
                                <Button
                                    variant="ghost"
                                    className="mt-4"
                                    onClick={clearFilters}
                                >
                                    Limpiar todos los filtros
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-in-up">
                                {activeCenters.map(center => (
                                    <CenterCard key={center.id} center={center} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {suggestModalOpen && (
                <SuggestCenterModal
                    onClose={() => setSuggestModalOpen(false)}
                    onSuccess={() => alert('¡Sugerencia enviada! Un administrador revisará tu solicitud.')}
                />
            )}
        </div>
    );
};

export default ListView;

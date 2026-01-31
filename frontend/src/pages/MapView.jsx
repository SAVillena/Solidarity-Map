import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';

import { useCenters } from '../hooks/useCenters';
import { useGeolocation } from '../hooks/useGeolocation';
import { useNearbyCenters } from '../hooks/useNearbyCenters';
import { initializeLeafletIcons, createCenterIcon, createUserLocationIcon } from '../constants/icons';
import { getUrgencyConfig } from '../constants/urgency';
import { formatDistance, calculateDistance } from '../utils/distance';
import FilterButtons from '../components/common/FilterButtons';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

// Initialize Leaflet icons once
initializeLeafletIcons();

const MapView = () => {
    const [selectedType, setSelectedType] = useState('ALL');
    const [filtersOpen, setFiltersOpen] = useState(true);
    const [nearbyMode, setNearbyMode] = useState(false);
    const [searchRadius, setSearchRadius] = useState(5000); // 5km default

    const { centers: allCenters, loading, error } = useCenters(selectedType === 'ALL' ? null : selectedType);
    const { location: userLocation, error: locationError } = useGeolocation();
    const { centers: nearbyCenters, loading: nearbyLoading } = useNearbyCenters(userLocation, searchRadius, nearbyMode);

    const getCoords = (center) => {
        const coords = center.location;
        return coords ? [coords.latitude, coords.longitude] : null;
    };

    // Use nearby centers when in nearby mode, otherwise all centers
    const centers = nearbyMode ? nearbyCenters : allCenters;
    const isLoading = nearbyMode ? nearbyLoading : loading;

    const defaultCenter = userLocation
        ? [userLocation.lat, userLocation.lng]
        : [-33.4489, -70.6693];
    const defaultZoom = userLocation ? 12 : 6;

    const handleNearbyToggle = () => {
        if (!userLocation) {
            alert('Necesitas habilitar la geolocalización para usar esta función');
            return;
        }
        setNearbyMode(!nearbyMode);
    };

    // Configuración de filtros
    const filters = [
        { id: 'ALL', label: 'Todos', icon: '📍', count: centers.length },
        { id: 'ACOPIO', label: 'Acopio', icon: '📦' },
        { id: 'VETERINARIA', label: 'Veterinarias', icon: '🏥' }
    ];

    if (isLoading) return <LoadingSpinner message="Cargando mapa..." />;
    if (error) return <ErrorMessage error={error} title="Error al cargar centros" />;

    return (
        <div className="relative w-full h-full">
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                className="w-full h-full"
                key={`${defaultCenter[0]}-${defaultCenter[1]}`}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Search Radius Circle */}
                {nearbyMode && userLocation && (
                    <Circle
                        center={[userLocation.lat, userLocation.lng]}
                        radius={searchRadius}
                        pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
                    />
                )}

                {/* User Location Marker */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserLocationIcon()}>
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-bold text-lg mb-1">📍 Tu ubicación</h3>
                                <p className="text-sm text-gray-600">Estás aquí</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Centers Markers */}
                {centers.map(center => {
                    const pos = getCoords(center);
                    if (!pos) return null;

                    const urgencyInfo = center.urgencyStatus !== null
                        ? getUrgencyConfig(center.urgencyStatus)
                        : null;

                    // Calculate distance if we have user location
                    const distance = userLocation && center.location
                        ? formatDistance(
                            calculateDistance(
                                userLocation.lat,
                                userLocation.lng,
                                center.location.latitude,
                                center.location.longitude
                            )
                        )
                        : null;

                    return (
                        <Marker key={center.id} position={pos} icon={createCenterIcon(center.type)}>
                            <Popup>
                                <div className="p-2 min-w-[250px]">
                                    <h3 className="font-bold text-lg mb-2">{center.name}</h3>
                                    <div className="space-y-1 text-sm">
                                        <p><strong>📍</strong> {center.address}</p>
                                        {distance && (
                                            <p className="text-blue-600 font-semibold">
                                                <strong>🚶</strong> {distance}
                                            </p>
                                        )}
                                        {center.contactNumber && <p><strong>📞</strong> {center.contactNumber}</p>}
                                        <p>
                                            <strong>🏷️</strong>
                                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${center.type === 'ACOPIO' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {center.type === 'ACOPIO' ? 'Acopio' : 'Veterinaria'}
                                            </span>
                                        </p>
                                        {urgencyInfo && (
                                            <p>
                                                <strong>Estado:</strong>
                                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${urgencyInfo.color}`}>
                                                    {urgencyInfo.icon} {urgencyInfo.label}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Floating Filter Panel */}
            <div className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-2xl overflow-hidden max-w-sm w-full sm:w-80">
                <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-between md:hidden"
                >
                    <span>Filtros</span>
                    {filtersOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                <div className={`p-4 ${filtersOpen ? 'block' : 'hidden'} md:block`}>
                    {/* Nearby Search Button */}
                    <button
                        onClick={handleNearbyToggle}
                        disabled={!userLocation}
                        className={`w-full mb-4 px-4 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${nearbyMode
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } ${!userLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <MapPin size={20} />
                        {nearbyMode ? `Mostrando ${centers.length} cerca` : 'Cerca de mí'}
                    </button>

                    {/* Radius Selector (only in nearby mode) */}
                    {nearbyMode && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
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

                    {/* Location Status */}
                    {userLocation && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-700 font-medium">📍 Ubicación detectada</p>
                        </div>
                    )}
                    {locationError && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-700">{locationError}</p>
                        </div>
                    )}

                    <h3 className="text-sm font-semibold text-gray-600 mb-3">Filtrar por tipo</h3>
                    <FilterButtons
                        filters={filters}
                        selected={selectedType}
                        onSelect={setSelectedType}
                        colorScheme="blue"
                    />
                </div>
            </div>
        </div>
    );
};

export default MapView;

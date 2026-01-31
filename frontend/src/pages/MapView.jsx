import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ChevronDown, ChevronUp, MapPin, Search, Filter } from 'lucide-react';

import { useCenters } from '../hooks/useCenters';
import { useGeolocation } from '../hooks/useGeolocation';
import { useNearbyCenters } from '../hooks/useNearbyCenters';
import { initializeLeafletIcons, createCenterIcon, createUserLocationIcon } from '../constants/icons';
import { getUrgencyConfig } from '../constants/urgency';
import { formatDistance, calculateDistance } from '../utils/distance';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

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

    if (isLoading) return (
        <div className="h-full flex items-center justify-center bg-gray-50">
            <LoadingSpinner message="Cargando mapa..." />
        </div>
    );

    if (error) return (
        <div className="p-8">
            <ErrorMessage error={error} title="Error al cargar centros" />
        </div>
    );

    return (
        <div className="relative w-full h-full overflow-hidden">
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                className="w-full h-full z-0"
                key={`${defaultCenter[0]}-${defaultCenter[1]}`}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {/* Search Radius Circle */}
                {nearbyMode && userLocation && (
                    <Circle
                        center={[userLocation.lat, userLocation.lng]}
                        radius={searchRadius}
                        pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1 }}
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
                            <Popup className="custom-popup">
                                <div className="p-1 min-w-[220px]">
                                    <h3 className="font-bold text-base mb-2 text-gray-900">{center.name}</h3>

                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <Badge variant={center.type === 'ACOPIO' ? 'primary' : 'secondary'} size="sm">
                                            {center.type === 'ACOPIO' ? 'Acopio' : 'Veterinaria'}
                                        </Badge>

                                        {urgencyInfo && (
                                            <Badge variant={urgencyInfo.color.includes('red') ? 'danger' : urgencyInfo.color.includes('yellow') ? 'warning' : 'success'} size="sm">
                                                {urgencyInfo.label}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="space-y-1 text-xs text-gray-600">
                                        <p className="flex items-start gap-1">
                                            <MapPin size={14} className="mt-0.5 text-gray-400" />
                                            <span className="flex-1">{center.address}</span>
                                        </p>

                                        {distance && (
                                            <p className="flex items-center gap-1 font-semibold text-primary-600">
                                                <span>🚶</span> {distance}
                                            </p>
                                        )}

                                        {center.contactNumber && (
                                            <p className="flex items-center gap-1">
                                                <span>📞</span> {center.contactNumber}
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
            <div className="absolute top-4 left-4 z-[1000] w-full max-w-sm px-4 sm:px-0">
                <Card className="overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-md">
                    <button
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className="w-full px-4 py-3 flex items-center justify-between font-semibold text-gray-800 border-b border-gray-100 sm:cursor-default"
                    >
                        <span className="flex items-center gap-2">
                            <Filter size={18} className="text-primary-600" />
                            Filtros y Búsqueda
                        </span>
                        <div className="sm:hidden">
                            {filtersOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </button>

                    <div className={`p-4 space-y-4 ${filtersOpen ? 'block' : 'hidden'} animate-fade-in`}>
                        {/* Type Filters */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                Tipo de Centro
                            </label>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant={selectedType === 'ALL' ? 'primary' : 'outline'}
                                    onClick={() => setSelectedType('ALL')}
                                    className="flex-1 justify-center"
                                >
                                    Todos
                                </Button>
                                <Button
                                    size="sm"
                                    variant={selectedType === 'ACOPIO' ? 'primary' : 'outline'}
                                    onClick={() => setSelectedType('ACOPIO')}
                                    className="flex-1 justify-center"
                                >
                                    Acopios
                                </Button>
                                <Button
                                    size="sm"
                                    variant={selectedType === 'VETERINARIA' ? 'primary' : 'outline'}
                                    onClick={() => setSelectedType('VETERINARIA')}
                                    className="flex-1 justify-center"
                                >
                                    Veterinarias
                                </Button>
                            </div>
                        </div>

                        {/* Nearby Toggle */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                Ubicación
                            </label>
                            <Button
                                variant={nearbyMode ? 'secondary' : 'outline'}
                                className="w-full justify-center"
                                onClick={handleNearbyToggle}
                                disabled={!userLocation}
                                icon={<MapPin size={16} />}
                            >
                                {nearbyMode ? 'Modo Cercanía Activado' : 'Buscar Cerca de Mí'}
                            </Button>
                        </div>

                        {/* Radius Slider */}
                        {nearbyMode && (
                            <div className="bg-secondary-50 p-3 rounded-lg border border-secondary-100 animate-fade-in">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-semibold text-secondary-800">
                                        Radio de búsqueda
                                    </label>
                                    <span className="text-xs font-bold text-secondary-600">
                                        {searchRadius / 1000} km
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="1000"
                                    max="20000"
                                    step="1000"
                                    value={searchRadius}
                                    onChange={(e) => setSearchRadius(Number(e.target.value))}
                                    className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-secondary-600"
                                />
                            </div>
                        )}

                        {/* Stats */}
                        <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                            <span>Mostrando:</span>
                            <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">
                                {centers.length} centros
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Attribution */}
            <div className="absolute bottom-1 right-1 z-[1000] bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-gray-500 pointer-events-none">
                Solidarity Map v1.0
            </div>
        </div>
    );
};

export default MapView;

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ImportComponent from './ImportComponent';

// Fix Leaflet default icon issue
// The icons are not loading because Webpack doesn't bundle them correctly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom markers for different center types
const createIcon = (type) => {
    const color = type === 'ACOPIO' ? '#3b82f6' : '#10b981'; // blue for ACOPIO, green for VETERINARIA
    const emoji = type === 'ACOPIO' ? '📦' : '🏥';

    return L.divIcon({
        html: `
            <div style="
                background: ${color};
                width: 40px;
                height: 40px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                border: 3px solid white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            ">
                <div style="transform: rotate(45deg); font-size: 20px;">${emoji}</div>
            </div>
        `,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

// Component to recenter map when filters change
function MapUpdater({ centers }) {
    const map = useMap();

    useEffect(() => {
        if (centers.length > 0) {
            const bounds = centers.map(center => {
                // Parse GeoJSON Point coordinates [longitude, latitude]
                const coords = center.location?.coordinates;
                if (coords && coords.length === 2) {
                    return [coords[1], coords[0]]; // Leaflet uses [lat, lon]
                }
                return null;
            }).filter(Boolean);

            if (bounds.length > 0) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [centers, map]);

    return null;
}

const MapWithFilters = () => {
    const [centers, setCenters] = useState([]);
    const [filteredCenters, setFilteredCenters] = useState([]);
    const [selectedType, setSelectedType] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Default center (Santiago, Chile)
    const defaultCenter = [-33.4489, -70.6693];
    const defaultZoom = 6;

    // Fetch centers from API
    useEffect(() => {
        const fetchCenters = async () => {
            setLoading(true);
            setError(null);

            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
                const url = selectedType === 'ALL'
                    ? `${baseUrl}/api/centers`
                    : `${baseUrl}/api/centers?type=${selectedType}`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Centers loaded:', data);
                setCenters(data);
                setFilteredCenters(data);
            } catch (err) {
                console.error('Error fetching centers:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCenters();
    }, [selectedType]);

    // Parse coordinates from GeoJSON Point
    const getCoordinates = (center) => {
        // center.location is a GeoJSON Point: {type: "Point", coordinates: [lon, lat]}
        const coords = center.location?.coordinates;
        if (!coords || coords.length !== 2) {
            console.warn('Invalid coordinates for center:', center);
            return null;
        }
        // Leaflet expects [latitude, longitude]
        return [coords[1], coords[0]];
    };

    return (
        <div className="relative w-full h-screen">
            {/* Map */}
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                className="w-full h-full"
                style={{ zIndex: 0 }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Render markers */}
                {filteredCenters.map((center) => {
                    const position = getCoordinates(center);
                    if (!position) return null;

                    return (
                        <Marker
                            key={center.id}
                            position={position}
                            icon={createIcon(center.type)}
                        >
                            <Popup>
                                <div className="p-2 min-w-[250px]">
                                    <h3 className="font-bold text-lg mb-2 text-gray-800">
                                        {center.name}
                                    </h3>

                                    <div className="space-y-1 text-sm">
                                        <p className="flex items-center gap-2">
                                            <span className="font-semibold">📍 Dirección:</span>
                                            <span className="text-gray-700">{center.address}</span>
                                        </p>

                                        {center.contactNumber && (
                                            <p className="flex items-center gap-2">
                                                <span className="font-semibold">📞 Contacto:</span>
                                                <span className="text-gray-700">{center.contactNumber}</span>
                                            </p>
                                        )}

                                        <p className="flex items-center gap-2">
                                            <span className="font-semibold">🏷️ Tipo:</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${center.type === 'ACOPIO'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-green-100 text-green-700'
                                                }`}>
                                                {center.type === 'ACOPIO' ? 'Centro de Acopio' : 'Veterinaria'}
                                            </span>
                                        </p>

                                        {center.urgencyStatus !== null && (
                                            <p className="flex items-center gap-2">
                                                <span className="font-semibold">🚨 Urgencia:</span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${center.urgencyStatus === 0 ? 'bg-green-100 text-green-700' :
                                                        center.urgencyStatus === 1 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {center.urgencyStatus === 0 ? 'Verde' :
                                                        center.urgencyStatus === 1 ? 'Amarillo' : 'Rojo'}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                <MapUpdater centers={filteredCenters} />
            </MapContainer>

            {/* Control Panel */}
            <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 max-w-sm">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    🗺️ Solidarity Map
                </h2>

                {/* Filter Buttons */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">Filtrar por tipo</h3>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => setSelectedType('ALL')}
                            className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${selectedType === 'ALL'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            📍 Todos ({centers.length})
                        </button>
                        <button
                            onClick={() => setSelectedType('ACOPIO')}
                            className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${selectedType === 'ACOPIO'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            📦 Centros de Acopio ({centers.filter(c => c.type === 'ACOPIO').length})
                        </button>
                        <button
                            onClick={() => setSelectedType('VETERINARIA')}
                            className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${selectedType === 'VETERINARIA'
                                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            🏥 Veterinarias ({centers.filter(c => c.type === 'VETERINARIA').length})
                        </button>
                    </div>
                </div>

                {/* Loading/Error State */}
                {loading && (
                    <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-sm text-gray-600">Cargando centros...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
                        <p className="text-sm text-red-700">
                            <strong>Error:</strong> {error}
                        </p>
                    </div>
                )}

                {/* Import Component */}
                <ImportComponent />
            </div>
        </div>
    );
};

export default MapWithFilters;

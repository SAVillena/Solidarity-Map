import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// import { Icon } from 'leaflet'; // Ensure you set up custom icons for "Acopio" vs "Veterinaria"

const MapWithFilters = () => {
    const [centers, setCenters] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [filters, setFilters] = useState({
        type: 'ALL', // 'ALL', 'VETERINARIA', 'ACOPIO'
        radius: 5, // km
        supplies: [] // ['Agua', 'Alimentos', ...]
    });

    useEffect(() => {
        // 1. Get User Location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation([position.coords.latitude, position.coords.longitude]);
            },
            (error) => console.error("Error getting location: ", error)
        );

        // 2. Fetch Centers (Mock or API)
        // fetchCenters(filters).then(data => setCenters(data));
        // MOCK DATA for display
        setCenters([
            { id: 1, name: "Acopio Central", lat: -33.4489, lng: -70.6693, type: "ACOPIO", status: "OPEN" },
            { id: 2, name: "Vet Emergency", lat: -33.4500, lng: -70.6600, type: "VETERINARIA", status: "CLOSED" },
        ]);
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredCenters = centers.filter(center => {
        if (filters.type !== 'ALL' && center.type !== filters.type) return false;
        // Implement radius logic here or in backend
        return true;
    });

    // Component to re-center map
    const CenterMap = ({ center }) => {
        const map = useMap();
        useEffect(() => {
            if (center) map.setView(center, 13);
        }, [center, map]);
        return null;
    };

    return (
        <div className="flex h-screen flex-col md:flex-row">
            {/* Sidebar Filters */}
            <div className="w-full md:w-1/4 p-4 bg-gray-50 shadow-lg z-10 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-blue-700">Solidarity Map</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Tipo de Centro</label>
                    <select
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="ALL">Todos</option>
                        <option value="ACOPIO">Centros de Acopio</option>
                        <option value="VETERINARIA">Veterinarias</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Radio de Búsqueda (km): {filters.radius}</label>
                    <input
                        type="range"
                        name="radius"
                        min="1"
                        max="50"
                        value={filters.radius}
                        onChange={handleFilterChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                    Aplicar Filtros
                </button>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative z-0">
                {!userLocation ? (
                    <div className="flex items-center justify-center h-full">
                        <span className="animate-pulse text-gray-500">Localizando...</span>
                    </div>
                ) : (
                    <MapContainer center={userLocation} zoom={13} style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <CenterMap center={userLocation} />

                        {/* User Location Marker */}
                        <Marker position={userLocation}>
                            <Popup>Tu ubicación</Popup>
                        </Marker>

                        {/* Center Markers */}
                        {filteredCenters.map(center => (
                            <Marker key={center.id} position={[center.lat, center.lng]}>
                                <Popup>
                                    <div className="p-1">
                                        <h3 className="font-bold">{center.name}</h3>
                                        <p className="text-sm text-gray-600">{center.type}</p>
                                        <span className={`px-2 py-0.5 rounded text-xs text-white ${center.status === 'OPEN' ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {center.status === 'OPEN' ? 'Abierto' : 'Cerrado'}
                                        </span>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>
        </div>
    );
};

export default MapWithFilters;

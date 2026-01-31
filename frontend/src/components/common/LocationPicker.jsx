import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './LocationPicker.css';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Componente interno para manejar eventos del mapa
 */
function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition({
                lat: e.latlng.lat,
                lng: e.latlng.lng
            });
        },
    });

    return position.lat && position.lng ? (
        <Marker position={[position.lat, position.lng]} />
    ) : null;
}

/**
 * Selector de ubicación en mapa interactivo
 * @param {Object} initialPosition - Posición inicial {lat, lng}
 * @param {Function} onChange - Callback cuando cambia la posición
 */
const LocationPicker = ({ initialPosition = { lat: -33.4489, lng: -70.6693 }, onChange }) => {
    const [position, setPosition] = useState(initialPosition);

    useEffect(() => {
        if (onChange) {
            onChange(position);
        }
    }, [position, onChange]);

    return (
        <div className="location-picker">
            <div className="location-info">
                <span>🗺️ Haz clic en el mapa para seleccionar la ubicación</span>
                {position.lat && position.lng && (
                    <span className="coordinates">
                        Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
                    </span>
                )}
            </div>
            <MapContainer
                center={[position.lat, position.lng]}
                zoom={13}
                className="location-map"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
        </div>
    );
};

export default LocationPicker;

import L from 'leaflet';

// CDN URLs for Leaflet icons
export const LEAFLET_CDN = {
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
};

// Fix Leaflet default icons
export const initializeLeafletIcons = () => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions(LEAFLET_CDN);
};

// Configuración de iconos por tipo de centro
const ICON_CONFIG = {
    ACOPIO: {
        color: '#3b82f6',
        emoji: '📦',
        name: 'Acopio'
    },
    VETERINARIA: {
        color: '#10b981',
        emoji: '🏥',
        name: 'Veterinaria'
    }
};

/**
 * Crea un icono personalizado para marcadores de centros
 * @param {string} type - Tipo de centro (ACOPIO o VETERINARIA)
 * @returns {L.DivIcon} Icono de Leaflet
 */
export const createCenterIcon = (type) => {
    const config = ICON_CONFIG[type] || ICON_CONFIG.ACOPIO;

    return L.divIcon({
        html: `<div style="
            background:${config.color};
            width:40px;
            height:40px;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            display:flex;
            align-items:center;
            justify-center;
            border:3px solid white;
            box-shadow:0 2px 10px rgba(0,0,0,0.3)
        ">
            <div style="transform:rotate(45deg);font-size:20px">${config.emoji}</div>
        </div>`,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

/**
 * Crea un icono para la ubicación del usuario
 * @returns {L.DivIcon} Icono de ubicación del usuario
 */
export const createUserLocationIcon = () => {
    return L.divIcon({
        html: `
            <div style="
                background:#ef4444;
                width:20px;
                height:20px;
                border-radius:50%;
                border:4px solid white;
                box-shadow:0 0 10px rgba(239,68,68,0.5);
                animation:pulse 2s infinite
            "></div>
            <style>
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
            </style>
        `,
        className: '',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
};

export { ICON_CONFIG };

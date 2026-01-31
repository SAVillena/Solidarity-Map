import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { getUrgencyConfig } from '../../constants/urgency';
import { formatDistance } from '../../utils/distance';

/**
 * Componente reutilizable de tarjeta de centro
 * Sigue SRP: responsabilidad única de mostrar datos de centro
 */
const CenterCard = ({ center }) => {
    const urgencyInfo = center.urgencyStatus !== null
        ? getUrgencyConfig(center.urgencyStatus)
        : null;

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {center.type === 'ACOPIO' ? '📦' : '🏥'} {center.name}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${center.type === 'ACOPIO'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                        }`}>
                        {center.type === 'ACOPIO' ? 'Centro de Acopio' : 'Veterinaria'}
                    </span>
                </div>
                {urgencyInfo && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${urgencyInfo.color}`}>
                        {urgencyInfo.icon} {urgencyInfo.label}
                    </span>
                )}
            </div>

            <div className="space-y-2 text-gray-700">
                <div className="flex items-start gap-2">
                    <MapPin className="flex-shrink-0 mt-0.5" size={18} />
                    <span>{center.address}</span>
                </div>
                {center.distance !== undefined && (
                    <div className="text-blue-600 font-semibold text-sm">
                        🚶 {formatDistance(center.distance)}
                    </div>
                )}
                {center.contactNumber && (
                    <div className="flex items-center gap-2">
                        <Phone size={18} />
                        <a
                            href={`tel:${center.contactNumber}`}
                            className="text-blue-600 hover:underline"
                        >
                            {center.contactNumber}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CenterCard;

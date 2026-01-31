import React from 'react';
import { MapPin, Phone, Box, Stethoscope } from 'lucide-react';
import { getUrgencyConfig } from '../../constants/urgency';
import { formatDistance } from '../../utils/distance';
import Badge from './Badge';
import Card from './Card';

/**
 * Componente reutilizable de tarjeta de centro
 */
const CenterCard = ({ center }) => {
    const urgencyInfo = center.urgencyStatus !== null
        ? getUrgencyConfig(center.urgencyStatus)
        : null;

    const urgencyVariant = {
        'bg-green-100 text-green-800': 'success',
        'bg-yellow-100 text-yellow-800': 'warning',
        'bg-red-100 text-red-800': 'danger'
    }[urgencyInfo?.color] || 'gray';

    const typeIcon = center.type === 'ACOPIO' ? <Box size={14} /> : <Stethoscope size={14} />;
    const typeLabel = center.type === 'ACOPIO' ? 'Centro de Acopio' : 'Veterinaria';
    const typeVariant = center.type === 'ACOPIO' ? 'primary' : 'secondary';

    return (
        <Card hover clickable className="p-5 flex flex-col gap-3 border border-transparent hover:border-primary-100 transition-colors">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">
                        {center.name}
                    </h3>
                    <Badge variant={typeVariant} size="sm" className="inline-flex items-center gap-1">
                        {typeIcon} {typeLabel}
                    </Badge>
                </div>
                {urgencyInfo && (
                    <Badge variant={urgencyVariant} size="sm" dot>
                        {urgencyInfo.label}
                    </Badge>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 mt-1">
                <div className="flex items-start gap-2 text-gray-600 text-sm">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    <span>{center.address}</span>
                </div>

                {center.contactNumber && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Phone size={16} className="flex-shrink-0 text-gray-400" />
                        <a
                            href={`tel:${center.contactNumber}`}
                            className="hover:text-primary-600 hover:underline transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {center.contactNumber}
                        </a>
                    </div>
                )}
            </div>

            {/* Footer / Distance */}
            {center.distance !== undefined && (
                <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">Distancia aproximada</span>
                    <span className="text-sm font-semibold text-primary-600 flex items-center gap-1">
                        🚶 {formatDistance(center.distance)}
                    </span>
                </div>
            )}
        </Card>
    );
};

export default CenterCard;

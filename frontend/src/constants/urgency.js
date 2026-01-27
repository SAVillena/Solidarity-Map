// Configuración de urgencia para centros
export const URGENCY_CONFIG = {
    0: {
        label: 'No Necesita',
        color: 'bg-green-100 text-green-700',
        icon: '✅',
        priority: 'low'
    },
    1: {
        label: 'Abastecido',
        color: 'bg-yellow-100 text-yellow-700',
        icon: '⚠️',
        priority: 'medium'
    },
    2: {
        label: 'Urgente',
        color: 'bg-red-100 text-red-700',
        icon: '🚨',
        priority: 'high'
    }
};

export const getUrgencyConfig = (status) => {
    return URGENCY_CONFIG[status] || URGENCY_CONFIG[0];
};

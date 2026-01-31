import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import Card from './Card';

/**
 * Componente para mostrar mensajes de error
 * Actualizado con el sistema de diseño
 */
const ErrorMessage = ({ message, title = 'Ha ocurrido un error', variant = 'error' }) => {
    if (!message) return null;

    const config = {
        error: {
            icon: AlertCircle,
            color: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-100',
            titleColor: 'text-red-900'
        },
        warning: {
            icon: AlertTriangle,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            titleColor: 'text-amber-900'
        }
    };

    const style = config[variant] || config.error;
    const Icon = style.icon;

    return (
        <div className={`
            p-6 rounded-xl border ${style.bg} ${style.border} 
            flex flex-col items-center text-center 
            animate-scale-in
        `}>
            <div className={`p-3 rounded-full bg-white shadow-sm mb-3 ${style.color}`}>
                <Icon size={32} />
            </div>
            <h3 className={`text-lg font-semibold ${style.titleColor} mb-1`}>
                {title}
            </h3>
            <p className="text-gray-600 max-w-md">
                {message}
            </p>
        </div>
    );
};

export default ErrorMessage;

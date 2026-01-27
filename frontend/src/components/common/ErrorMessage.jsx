import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Componente para mostrar mensajes de error
 * Sigue SRP: responsabilidad única de mostrar errores
 */
const ErrorMessage = ({ error, title = 'Error' }) => {
    if (!error) return null;

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="mx-auto mb-3 text-red-600" size={48} />
            <h3 className="text-lg font-semibold text-red-800 mb-2">{title}</h3>
            <p className="text-red-600">{error}</p>
        </div>
    );
};

export default ErrorMessage;

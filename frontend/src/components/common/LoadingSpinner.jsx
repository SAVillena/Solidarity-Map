import React from 'react';

/**
 * Componente de spinner de carga reutilizable
 * Sigue SRP: responsabilidad única de mostrar loading state
 */
const LoadingSpinner = ({ message = 'Cargando...' }) => {
    return (
        <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">{message}</p>
        </div>
    );
};

export default LoadingSpinner;

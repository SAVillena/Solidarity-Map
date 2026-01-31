import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente para proteger rutas que requieren autenticación
 * Redirige a /login si el usuario no está autenticado
 * 
 * @param {boolean} requireAdmin - Si true, solo permite ADMIN role
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    console.log('🔒 ProtectedRoute check:', {
        isAuthenticated,
        isAdmin,
        requireAdmin,
        path: location.pathname
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg text-gray-600">Verificando autenticación...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.log('❌ No autenticado, redirigiendo a /login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin) {
        console.log('❌ Requiere ADMIN pero usuario no es admin');
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">
                        Acceso Denegado
                    </h2>
                    <p className="text-gray-600">
                        No tienes permisos para acceder a esta página
                    </p>
                </div>
            </div>
        );
    }

    console.log('✅ Acceso permitido');
    return children;
};

export default ProtectedRoute;

import { useState, useEffect, useCallback } from 'react';
import { centerService } from '../services/centerService';

/**
 * Custom hook para gestionar el estado de centros
 * Sigue SRP: responsabilidad única de gestión de estado de centros
 * 
 * @param {string|null} type - Tipo de centro para filtrar (ACOPIO, VETERINARIA, o null para todos)
 * @returns {Object} Estado y funciones de centros
 */
export const useCenters = (type = null) => {
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCenters = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await centerService.getAll(type);
            setCenters(data);
        } catch (err) {
            console.error('Error fetching centers:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [type]); // Ahora fetchCenters depende correctamente de type

    useEffect(() => {
        fetchCenters();
    }, [fetchCenters]);

    return {
        centers,
        loading,
        error,
        refresh: fetchCenters, // Cambiado de refetch a refresh
        setCenters // Para actualizaciones desde import
    };
};

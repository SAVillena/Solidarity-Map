import { useState, useEffect } from 'react';
import { calculateDistance } from '../utils/distance';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Hook personalizado para buscar centros cercanos a una ubicación
 * @param {Object} userLocation - {lat, lng} ubicación del usuario
 * @param {number} radius - Radio de búsqueda en metros (default: 5000)
 * @param {boolean} enabled - Si la búsqueda está habilitada
 * @returns {Object} { centers, loading, error, refetch }
 */
export const useNearbyCenters = (userLocation, radius = 5000, enabled = false) => {
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNearbyCenters = async () => {
        if (!userLocation || !enabled) {
            setCenters([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/centers/nearest?lat=${userLocation.lat}&lon=${userLocation.lng}&radius=${radius}`
            );

            if (!response.ok) {
                throw new Error('Error al buscar centros cercanos');
            }

            const data = await response.json();

            // Calcular y agregar distancia a cada centro
            const centersWithDistance = data.map(center => {
                const distance = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    center.location.latitude,
                    center.location.longitude
                );

                return {
                    ...center,
                    distance
                };
            });

            // Ordenar por distancia
            centersWithDistance.sort((a, b) => a.distance - b.distance);

            setCenters(centersWithDistance);
        } catch (err) {
            setError(err.message);
            setCenters([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNearbyCenters();
    }, [userLocation?.lat, userLocation?.lng, radius, enabled]);

    return {
        centers,
        loading,
        error,
        refetch: fetchNearbyCenters
    };
};

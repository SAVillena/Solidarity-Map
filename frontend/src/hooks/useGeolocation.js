import { useState, useEffect } from 'react';

/**
 * Custom hook para geolocalización del usuario
 * Sigue SRP: responsabilidad única de obtener ubicación
 * 
 * @returns {Object} Estado de geolocalización
 */
export const useGeolocation = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setError('Geolocalización no disponible en tu navegador');
            setLoading(false);
            return;
        }

        const onSuccess = (position) => {
            setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
            });
            setLoading(false);
        };

        const onError = (err) => {
            console.error('Geo location error:', err);
            let errorMessage = 'No se pudo obtener tu ubicación';

            switch (err.code) {
                case err.PERMISSION_DENIED:
                    errorMessage = 'Permiso para ubicación denegado';
                    break;
                case err.POSITION_UNAVAILABLE:
                    errorMessage = 'Ubicación no disponible';
                    break;
                case err.TIMEOUT:
                    errorMessage = 'Tiempo de espera agotado';
                    break;
                default:
                    errorMessage = 'Error desconocido al obtener ubicación';
            }

            setError(errorMessage);
            setLoading(false);
        };

        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    }, []);

    return { location, error, loading };
};

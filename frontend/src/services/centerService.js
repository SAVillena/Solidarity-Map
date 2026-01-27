// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Servicio centralizado para todas las operaciones de centros
 * Sigue SRP: responsabilidad única de comunicación con API
 */
export const centerService = {
    /**
     * Obtiene todos los centros, opcionalmente filtrados por tipo
     */
    getAll: async (type = null) => {
        const url = type
            ? `${API_BASE_URL}/centers?type=${type}`
            : `${API_BASE_URL}/centers`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    },

    /**
     * Obtiene centros cercanos a una ubicación
     */
    getNearby: async (lat, lon, radius = 5000) => {
        const url = `${API_BASE_URL}/centers/nearest?lat=${lat}&lon=${lon}&radius=${radius}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    },

    /**
     * Importa centros desde un archivo Excel
     */
    importFromExcel: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/centers/import`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al importar archivo');
        }

        return response.json();
    }
};

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
     * Búsqueda avanzada de centros
     */
    search: async (params) => {
        // params: { query, type, urgencyStatus }
        const queryParams = new URLSearchParams();
        if (params.query) queryParams.append('query', params.query);
        if (params.type && params.type !== 'ALL') queryParams.append('type', params.type);
        if (params.urgencyStatus !== undefined && params.urgencyStatus !== null) queryParams.append('urgencyStatus', params.urgencyStatus);

        const response = await fetch(`${API_BASE_URL}/centers/search?${queryParams.toString()}`);
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
    },

    /**
     * Obtiene un centro por su ID
     */
    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/centers/${id}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Centro no encontrado');
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Crea un nuevo centro
     */
    create: async (centerData) => {
        const response = await fetch(`${API_BASE_URL}/centers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(centerData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear centro');
        }

        return response.json();
    },

    /**
     * Actualiza un centro existente
     */
    update: async (id, centerData) => {
        const response = await fetch(`${API_BASE_URL}/centers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(centerData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar centro');
        }

        return response.json();
    },

    /**
     * Actualiza solo el estado de urgencia de un centro
     */
    updateUrgency: async (id, urgencyStatus) => {
        const response = await fetch(`${API_BASE_URL}/centers/${id}/urgency`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ urgencyStatus }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar urgencia');
        }

        return response.json();
    },

    /**
     * Elimina un centro
     */
    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/centers/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Centro no encontrado');
            }
            const error = await response.json();
            throw new Error(error.message || 'Error al eliminar centro');
        }

        // DELETE retorna 204 No Content, no hay body que parsear
        return { success: true };
    }
};

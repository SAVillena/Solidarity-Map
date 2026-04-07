import axios from 'axios';

// API base URL (Vite usa import.meta.env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : 'http://localhost:8080/api';

// Configurar instancia de axios
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor para agregar token (por si acaso no está en defaults, aunque authService lo pone)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Servicio centralizado para todas las operaciones de centros
 * Utiliza axios para aprovechar los interceptores de auth
 */
export const centerService = {
    /**
     * Obtiene todos los centros, opcionalmente filtrados por tipo
     */
    getAll: async (type = null) => {
        const url = type ? `/centers?type=${type}` : '/centers';
        const response = await api.get(url);
        return response.data;
    },

    /**
     * Obtiene centros cercanos a una ubicación
     */
    getNearby: async (lat, lon, radius = 5000) => {
        const response = await api.get(`/centers/nearest`, {
            params: { lat, lon, radius }
        });
        return response.data;
    },

    /**
     * Búsqueda avanzada de centros
     */
    search: async (params) => {
        const response = await api.get('/centers/search', { params });
        return response.data;
    },

    /**
     * Importa centros desde un archivo Excel
     */
    importFromExcel: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/centers/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Obtiene un centro por su ID
     */
    getById: async (id) => {
        const response = await api.get(`/centers/${id}`);
        return response.data;
    },

    /**
     * Crea un nuevo centro
     */
    create: async (centerData) => {
        const response = await api.post('/centers', centerData);
        return response.data;
    },

    /**
     * Actualiza un centro existente
     */
    update: async (id, centerData) => {
        const response = await api.put(`/centers/${id}`, centerData);
        return response.data;
    },

    /**
     * Actualiza solo el estado de urgencia de un centro
     */
    updateUrgency: async (id, urgencyStatus) => {
        const response = await api.patch(`/centers/${id}/urgency`, { urgencyStatus });
        return response.data;
    },

    /**
     * Sugiere un nuevo centro (Público)
     */
    suggest: async (centerData) => {
        // Este endpoint es público, pero axios enviará el token si existe (no hace daño)
        const response = await api.post('/centers/suggest', centerData);
        return response.data;
    },

    /**
     * Aprueba un centro (Admin)
     */
    approve: async (id) => {
        const response = await api.patch(`/centers/${id}/approve`);
        return response.data;
    },

    /**
     * Rechaza un centro (Admin)
     */
    reject: async (id) => {
        const response = await api.patch(`/centers/${id}/reject`);
        return response.data;
    },

    /**
     * Obtiene centros pendientes (Admin)
     */
    getPending: async () => {
        const response = await api.get('/centers/pending');
        return response.data;
    },

    /**
     * Elimina un centro
     */
    delete: async (id) => {
        const response = await api.delete(`/centers/${id}`);
        return response.data;
    }
};

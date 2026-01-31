import axios from 'axios';
import { tokenStorage } from '../utils/tokenStorage';

const API_BASE_URL = 'http://localhost:8080/api/users';

/**
 * Servicio para gestión de usuarios
 */
const userManagementService = {
    /**
     * Obtener todos los usuarios
     */
    getAllUsers: async () => {
        const token = tokenStorage.getToken();
        const response = await axios.get(API_BASE_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    /**
     * Crear nuevo usuario
     */
    createUser: async (userData) => {
        const token = tokenStorage.getToken();
        const response = await axios.post(API_BASE_URL, userData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    /**
     * Actualizar usuario
     */
    updateUser: async (userId, userData) => {
        const token = tokenStorage.getToken();
        const response = await axios.put(`${API_BASE_URL}/${userId}`, userData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    /**
     * Eliminar usuario
     */
    deleteUser: async (userId) => {
        const token = tokenStorage.getToken();
        const response = await axios.delete(`${API_BASE_URL}/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }
};

export default userManagementService;

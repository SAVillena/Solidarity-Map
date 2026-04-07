import axios from 'axios';
import { tokenStorage } from '../utils/tokenStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_URL = `${API_BASE_URL}/api/auth`;

/**
 * Servicio de autenticación
 * Maneja todas las llamadas API relacionadas con auth
 */
export const authService = {
    /**
     * Login de usuario
     */
    async login(username, password) {
        console.log('🔐 Intentando login para:', username);

        try {
            const response = await axios.post(`${API_URL}/login`, {
                username,
                password
            });

            console.log('✅ Login exitoso');

            const { token, user } = response.data;

            // Guardar en localStorage
            tokenStorage.saveToken(token);
            tokenStorage.saveUser(user);

            // Configurar header para futuras requests
            setAuthToken(token);

            return { token, user };
        } catch (error) {
            console.error('❌ Error en login:', error.response?.data || error.message);
            throw new Error('Credenciales inválidas');
        }
    },

    /**
     * Registro de nuevo usuario
     */
    async register(username, email, password, role = 'USER') {
        console.log('📝 Intentando registro para:', username);

        try {
            const response = await axios.post(`${API_URL}/register`, {
                username,
                email,
                password,
                role
            });

            console.log('✅ Registro exitoso');

            const { token, user } = response.data;

            tokenStorage.saveToken(token);
            tokenStorage.saveUser(user);
            setAuthToken(token);

            return { token, user };
        } catch (error) {
            console.error('❌ Error en registro:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Error en el registro');
        }
    },

    /**
     * Obtener usuario actual
     */
    async getCurrentUser() {
        console.log('📋 Obteniendo usuario actual');

        try {
            const response = await axios.get(`${API_URL}/me`);
            console.log('✅ Usuario obtenido:', response.data.username);
            return response.data;
        } catch (error) {
            console.error('❌ Error obteniendo usuario:', error);
            throw error;
        }
    },

    /**
     * Logout
     */
    logout() {
        console.log('👋 Cerrando sesión');
        tokenStorage.clear();
        delete axios.defaults.headers.common['Authorization'];
    },

    /**
     * Verifica si hay una sesión activa
     */
    isAuthenticated() {
        return !!tokenStorage.getToken();
    },

    /**
     * Obtiene el usuario guardado en localStorage
     */
    getStoredUser() {
        return tokenStorage.getUser();
    }
};

/**
 * Configura el token en el header de axios
 */
export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('🔑 Token configurado en headers de axios');
    } else {
        delete axios.defaults.headers.common['Authorization'];
        console.log('🔓 Token eliminado de headers de axios');
    }
};

// Configurar token al cargar si existe
const token = tokenStorage.getToken();
if (token) {
    setAuthToken(token);
}

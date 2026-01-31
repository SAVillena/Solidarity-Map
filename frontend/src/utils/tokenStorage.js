/**
 * Utilidad para manejar almacenamiento de tokens JWT en localStorage
 * Proporciona métodos seguros para guardar, obtener y limpiar tokens
 */

const TOKEN_KEY = 'solidarity_map_token';
const USER_KEY = 'solidarity_map_user';

export const tokenStorage = {
    /**
     * Guarda el token JWT en localStorage
     */
    saveToken(token) {
        console.log('💾 Guardando token en localStorage');
        localStorage.setItem(TOKEN_KEY, token);
    },

    /**
     * Obtiene el token JWT de localStorage
     */
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    /**
     * Elimina el token del localStorage
     */
    removeToken() {
        console.log('🗑️ Eliminando token de localStorage');
        localStorage.removeItem(TOKEN_KEY);
    },

    /**
     * Guarda información del usuario
     */
    saveUser(user) {
        console.log('💾 Guardando info de usuario:', user.username);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    /**
     * Obtiene información del usuario
     */
    getUser() {
        const userStr = localStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Elimina información del usuario
     */
    removeUser() {
        console.log('🗑️ Eliminando info de usuario');
        localStorage.removeItem(USER_KEY);
    },

    /**
     * Limpia todo (token y usuario)
     */
    clear() {
        console.log('🧹 Limpiando todo el almacenamiento de autenticación');
        this.removeToken();
        this.removeUser();
    }
};

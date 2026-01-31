import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

/**
 * Context de Autenticación
 * Proporciona estado y métodos de auth a toda la aplicación
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar usuario al iniciar si hay token
    useEffect(() => {
        console.log('🔄 Inicializando AuthContext...');

        const initAuth = async () => {
            if (authService.isAuthenticated()) {
                const storedUser = authService.getStoredUser();
                if (storedUser) {
                    console.log('✅ Usuario encontrado en localStorage:', storedUser.username);
                    setUser(storedUser);
                }
            } else {
                console.log('ℹ️ No hay sesión activa');
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    /**
     * Login
     */
    const login = async (username, password) => {
        console.log('🔐 AuthContext: Iniciando login...');

        try {
            const { user } = await authService.login(username, password);
            setUser(user);
            console.log('✅ AuthContext: Login exitoso:', user.username);
            return { success: true };
        } catch (error) {
            console.error('❌ AuthContext: Error en login:', error.message);
            return { success: false, error: error.message };
        }
    };

    /**
     * Register
     */
    const register = async (username, email, password) => {
        console.log('📝 AuthContext: Iniciando registro...');

        try {
            const { user } = await authService.register(username, email, password);
            setUser(user);
            console.log('✅ AuthContext: Registro exitoso:', user.username);
            return { success: true };
        } catch (error) {
            console.error('❌ AuthContext: Error en registro:', error.message);
            return { success: false, error: error.message };
        }
    };

    /**
     * Logout
     */
    const logout = () => {
        console.log('👋 AuthContext: Cerrando sesión...');
        authService.logout();
        setUser(null);
        console.log('✅ AuthContext: Sesión cerrada');
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg text-gray-600">Cargando...</div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook personalizado para usar el contexto de autenticación
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};

export default AuthContext;

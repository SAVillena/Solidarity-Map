import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ArrowLeft } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

/**
 * Página de Login
 * Permite a los usuarios autenticarse en el sistema
 */
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        console.log('📝 Form submit: Intentando login...');

        const result = await login(username, password);

        if (result.success) {
            console.log('✅ Login exitoso, redirigiendo a:', from);
            navigate(from, { replace: true });
        } else {
            console.error('❌ Login fallido:', result.error);
            setError(result.error || 'Error al iniciar sesión');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md animate-scale-in shadow-2xl overflow-hidden glass">
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-2xl shadow-lg mb-4 transform rotate-3 hover:rotate-6 transition-transform duration-300">
                            <Lock className="text-white" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                            Bienvenido
                        </h1>
                        <p className="text-gray-500 font-medium">
                            Accede al panel de administración
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 animate-slide-in-down">
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ingresa tu usuario"
                            leftIcon={<User size={20} />}
                            required
                            disabled={loading}
                        />

                        <Input
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                            leftIcon={<Lock size={20} />}
                            required
                            disabled={loading}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full mt-2"
                            loading={loading}
                            disabled={loading}
                        >
                            Iniciar Sesión
                        </Button>
                    </form>

                    {/* Help Text */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <div className="text-xs text-gray-500 bg-gray-50 py-2 px-4 rounded-lg inline-block">
                            Demo: <strong>admin</strong> / <strong>admin123</strong>
                        </div>
                    </div>

                    {/* Back to Home Button */}
                    <div className="mt-6">
                        <Link to="/">
                            <Button
                                variant="ghost"
                                className="w-full text-gray-500 hover:text-gray-900"
                                icon={<ArrowLeft size={18} />}
                            >
                                Volver al Inicio
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Login;

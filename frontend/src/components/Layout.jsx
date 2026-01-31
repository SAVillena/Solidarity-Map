import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Map, List, Settings, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        console.log('👋 Logout button clicked');
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Mapa', icon: Map },
        { path: '/list', label: 'Lista', icon: List },
        { path: '/admin', label: 'Admin', icon: Settings },
    ];

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="text-2xl">🗺️</div>
                            <h1 className="text-xl font-bold hidden sm:block">Solidarity Map</h1>
                            <h1 className="text-xl font-bold sm:hidden">SM</h1>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex gap-2">
                            {navItems.map(({ path, label, icon: Icon }) => (
                                <Link
                                    key={path}
                                    to={path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive(path)
                                        ? 'bg-white/20 font-semibold'
                                        : 'hover:bg-white/10'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span>{label}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* User Info & Logout (Desktop) */}
                        <div className="hidden md:flex items-center gap-3">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                                        <User size={16} />
                                        <span className="text-sm font-medium">{user?.username}</span>
                                        {user?.role === 'ADMIN' && (
                                            <span className="px-2 py-0.5 bg-yellow-400 text-gray-900 text-xs font-bold rounded">
                                                ADMIN
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                                    >
                                        <LogOut size={16} />
                                        <span className="text-sm">Salir</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <User size={18} />
                                    <span>Iniciar Sesión</span>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <nav className="md:hidden pb-4 space-y-2">
                            {navItems.map(({ path, label, icon: Icon }) => (
                                <Link
                                    key={path}
                                    to={path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(path)
                                        ? 'bg-white/20 font-semibold'
                                        : 'hover:bg-white/10'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{label}</span>
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;

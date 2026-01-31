import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Map, List, Settings, Menu, X, LogOut, User, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './common/Button';
import Badge from './common/Badge';

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
            {/* Glassmorphism Header */}
            <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm transition-all duration-300">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo Area */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                                <Heart size={20} fill="currentColor" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent hidden sm:block">
                                    Solidarity Map
                                </h1>
                                <span className="text-xl font-bold text-gray-900 sm:hidden">SM</span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl">
                            {navItems.map(({ path, label, icon: Icon }) => (
                                <Link
                                    key={path}
                                    to={path}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                        ${isActive(path)
                                            ? 'bg-white text-primary-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                        }
                                    `}
                                >
                                    <Icon size={18} />
                                    <span>{label}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* User Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {user?.username}
                                        </span>
                                        <span className="text-xs text-gray-500 capitalize">
                                            {user?.role?.toLowerCase() || 'User'}
                                        </span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-white shadow-sm flex items-center justify-center text-gray-600">
                                        <User size={20} />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLogout}
                                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                        icon={<LogOut size={16} />}
                                    />
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Link to="/login">
                                        <Button variant="ghost" size="sm">
                                            Log In
                                        </Button>
                                    </Link>
                                    <Link to="/login?register=true">
                                        <Button variant="primary" size="sm">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl animate-slide-in-down absolute w-full shadow-lg">
                        <div className="p-4 space-y-4">
                            <nav className="flex flex-col gap-2">
                                {navItems.map(({ path, label, icon: Icon }) => (
                                    <Link
                                        key={path}
                                        to={path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                                            ${isActive(path)
                                                ? 'bg-primary-50 text-primary-600 font-semibold'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        <Icon size={20} />
                                        <span>{label}</span>
                                    </Link>
                                ))}
                            </nav>

                            <div className="pt-4 border-t border-gray-100">
                                {isAuthenticated ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 px-2">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{user?.username}</div>
                                                <Badge variant="gray" size="sm" className="mt-1">
                                                    {user?.role}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Button
                                            variant="danger"
                                            className="w-full justify-center"
                                            onClick={() => {
                                                handleLogout();
                                                setMobileMenuOpen(false);
                                            }}
                                            icon={<LogOut size={16} />}
                                        >
                                            Cerrar Sesión
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full justify-center">
                                                Log In
                                            </Button>
                                        </Link>
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="primary" className="w-full justify-center">
                                                Sign Up
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden relative">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;

import React, { useState } from 'react';
import { Upload, RefreshCw } from 'lucide-react';

import { useCenters } from '../hooks/useCenters';
import { centerService } from '../services/centerService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { getUrgencyConfig } from '../constants/urgency';

const AdminPanel = () => {
    const { centers, loading, error, refetch } = useCenters();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleUpload = async () => {
        if (!file) {
            setMessage({ type: 'error', text: 'Selecciona un archivo primero' });
            return;
        }

        setUploading(true);
        setMessage(null);

        try {
            const result = await centerService.importFromExcel(file);
            setMessage({
                type: 'success',
                text: `✅ ${result.centersImported} centros importados exitosamente`
            });
            setFile(null);
            refetch(); // Recargar centros
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.message || 'Error al importar archivo'
            });
        } finally {
            setUploading(false);
        }
    };

    // Estadísticas
    const stats = {
        total: centers.length,
        acopio: centers.filter(c => c.type === 'ACOPIO').length,
        veterinaria: centers.filter(c => c.type === 'VETERINARIA').length,
        urgente: centers.filter(c => c.urgencyStatus === 2).length
    };

    return (
        <div className="h-full overflow-auto bg-gray-50">
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Panel de Administración</h2>
                    <p className="text-gray-600">Gestiona centros de acopio y veterinarias</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total Centros</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <div className="text-3xl font-bold text-blue-600">{stats.acopio}</div>
                        <div className="text-sm text-gray-600">📦 Acopio</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <div className="text-3xl font-bold text-green-600">{stats.veterinaria}</div>
                        <div className="text-sm text-gray-600">🏥 Veterinarias</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <div className="text-3xl font-bold text-red-600">{stats.urgente}</div>
                        <div className="text-sm text-gray-600">🚨 Urgentes</div>
                    </div>
                </div>

                {/* Import Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Upload size={24} className="text-blue-600" />
                        Importar Centros desde Excel
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
                            />
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={uploading || !file}
                            className={`w-full py-3 px-4 rounded-xl font-medium transition ${uploading || !file
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
                                }`}
                        >
                            {uploading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <RefreshCw className="animate-spin" size={20} />
                                    Procesando...
                                </span>
                            ) : 'Subir Archivo'}
                        </button>

                        {message && (
                            <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'success'
                                    ? 'bg-green-50 text-green-700 border border-green-100'
                                    : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <p className="text-sm text-blue-700 mb-2"><strong>Formato de Excel requerido:</strong></p>
                            <ul className="text-sm text-blue-600 space-y-1 ml-4">
                                <li>• Columna A: Nombre</li>
                                <li>• Columna B: Dirección</li>
                                <li>• Columna C: Teléfono (opcional)</li>
                                <li>• Columna D: Tipo (ACOPIO o VETERINARIA)</li>
                                <li>• Columna E: Latitud</li>
                                <li>• Columna F: Longitud</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Centers Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800">Lista de Centros</h3>
                        <button
                            onClick={refetch}
                            className="p-2 hover:bg-gray-200 rounded-lg transition"
                            title="Actualizar"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <LoadingSpinner message="Cargando centros..." />
                        ) : error ? (
                            <ErrorMessage error={error} title="Error al cargar centros" />
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {centers.map(center => {
                                        const urgencyInfo = center.urgencyStatus !== null
                                            ? getUrgencyConfig(center.urgencyStatus)
                                            : null;

                                        return (
                                            <tr key={center.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{center.name}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${center.type === 'ACOPIO' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                        }`}>
                                                        {center.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{center.address}</td>
                                                <td className="px-6 py-4">
                                                    {urgencyInfo && (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${urgencyInfo.color}`}>
                                                            {urgencyInfo.icon} {urgencyInfo.label}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;

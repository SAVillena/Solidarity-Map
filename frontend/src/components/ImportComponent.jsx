import React, { useState } from 'react';

const ImportComponent = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
            const response = await fetch(`${API_BASE_URL}/api/centers/import`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setMessage("Archivo cargado exitosamente!");
                // Optionally trigger a refresh of the map
                window.location.reload();
            } else {
                setMessage("Error al cargar archivo.");
            }
        } catch (error) {
            setMessage("Error de conexión: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-blue-500">📥</span> Importar Datos
            </h3>

            <div className="flex flex-col gap-4">
                <div className="relative group">
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2.5 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-600
                            hover:file:bg-blue-100
                            cursor-pointer"
                    />
                </div>

                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className={`w-full py-2.5 px-4 rounded-xl font-medium shadow-sm transition-all duration-200 
                        ${loading
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Procesando...
                        </span>
                    ) : 'Subir Archivo Excel'}
                </button>

                {message && (
                    <div className={`p-3 rounded-lg text-sm font-medium animate-fade-in ${message.includes('exitosamente')
                        ? 'bg-green-50 text-green-700 border border-green-100'
                        : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportComponent;

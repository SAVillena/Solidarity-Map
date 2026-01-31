import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { centerService } from '../services/centerService';
import LocationPicker from './common/LocationPicker';

const SuggestCenterModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contactNumber: '',
        type: 'ACOPIO',
        urgencyStatus: 0,
        operatingHours: '',
        latitude: '',
        longitude: '',
        suppliesNeeded: []
    });

    const [supplyInput, setSupplyInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showLocationPicker, setShowLocationPicker] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSupply = () => {
        if (supplyInput.trim()) {
            setFormData(prev => ({
                ...prev,
                suppliesNeeded: [...prev.suppliesNeeded, supplyInput.trim()]
            }));
            setSupplyInput('');
        }
    };

    const handleRemoveSupply = (index) => {
        setFormData(prev => ({
            ...prev,
            suppliesNeeded: prev.suppliesNeeded.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Validation
            if (!formData.latitude || !formData.longitude) {
                throw new Error("Las coordenadas son obligatorias (Lat/Lon)");
            }

            const payload = {
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            };

            await centerService.suggest(payload);
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.message || 'Error al enviar sugerencia');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Sugerir Nuevo Centro</h2>
                        <p className="text-sm text-gray-500">Tu sugerencia será revisada por un administrador.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Centro *</label>
                                <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej: Centro Comunitario..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                                <input required name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Calle principal #123..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
                                <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+56 9..." />
                            </div>
                        </div>

                        {/* Type & Locations */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Centro *</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="ACOPIO">Centro de Acopio</option>
                                    <option value="VETERINARIA">Veterinaria / Refugio</option>
                                    <option value="ALBERGUE">Albergue</option>
                                </select>
                            </div>

                            {/* Location Section */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-700">Ubicación *</label>
                                    <button
                                        type="button"
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                        onClick={() => setShowLocationPicker(!showLocationPicker)}
                                    >
                                        {showLocationPicker ? '▼ Ocultar Mapa' : '▶ Abrir Mapa'}
                                    </button>
                                </div>

                                {showLocationPicker && (
                                    <div className="mb-2">
                                        <LocationPicker
                                            initialPosition={{
                                                lat: parseFloat(formData.latitude) || -33.4489,
                                                lng: parseFloat(formData.longitude) || -70.6693
                                            }}
                                            onChange={(pos) => setFormData(prev => ({
                                                ...prev,
                                                latitude: pos.lat,
                                                longitude: pos.lng
                                            }))}
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <input
                                            required
                                            type="number"
                                            step="any"
                                            name="latitude"
                                            value={formData.latitude}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            placeholder="Latitud"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            required
                                            type="number"
                                            step="any"
                                            name="longitude"
                                            value={formData.longitude}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            placeholder="Longitud"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Horario Atención</label>
                                <input name="operatingHours" value={formData.operatingHours} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="9:00 - 18:00" />
                            </div>
                        </div>
                    </div>

                    {/* Supplies */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Insumos Necesarios</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                value={supplyInput}
                                onChange={(e) => setSupplyInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSupply())}
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ej: Agua, Mantas..."
                            />
                            <button type="button" onClick={handleAddSupply} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                                Agregar
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.suppliesNeeded.map((supply, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-1">
                                    {supply}
                                    <button type="button" onClick={() => handleRemoveSupply(index)} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Enviando...' : <><Save className="w-5 h-5" /> Enviar Sugerencia</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SuggestCenterModal;

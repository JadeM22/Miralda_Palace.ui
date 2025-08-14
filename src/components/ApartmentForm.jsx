import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apartmentService } from '../services';

const ApartmentForm = ({ item, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        number: item?.number || '',
        floor: item?.floor || '',
        status: item?.status ?? 'active'
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { validateToken } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        if (!validateToken()) {
            return;
        }

        if (!formData.number.trim()) {
            setError('El número del apartamento es requerido');
            return;
        }

        if (!formData.floor.trim()) {
            setError('El piso es requerido');
            return;
        }

        setIsSubmitting(true);

        try {
            setError('');
            let savedItem;
            if (item) {
                savedItem = await apartmentService.update(item.id, formData);
                if (!savedItem) {
                    savedItem = { ...item, ...formData };
                }
                onSuccess(savedItem, true);
            } else {
                savedItem = await apartmentService.create(formData);
                if (!savedItem) {
                    savedItem = { 
                        id: Date.now(),
                        ...formData 
                    };
                }
                onSuccess(savedItem, false);
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            setError(error.message || 'Error al guardar el apartamento');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isSubmitting) {
            handleSubmit();
        }
        if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full border-2 border-pink-200">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-pink-600 mb-5">
                        {item ? 'Editar Apartamento' : 'Nuevo Apartamento'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-pink-100 border border-pink-400 text-pink-800 rounded-md">
                            <div className="flex items-center">
                                <span className="mr-2">❌</span>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                                Número *
                            </label>
                            <input
                                type="text"
                                id="number"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                                placeholder="Ej: 101"
                                maxLength="10"
                                autoFocus
                            />
                        </div>

                        <div>
                            <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
                                Piso *
                            </label>
                            <input
                                type="text"
                                id="floor"
                                name="floor"
                                value={formData.floor}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                                placeholder="Ej: 1"
                                maxLength="5"
                            />
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Estado
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                            >
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-md disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApartmentForm;

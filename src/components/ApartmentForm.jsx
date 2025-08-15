import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apartmentService } from '../services';

const ApartmentForm = ({ item, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        number: item?.number || '',
        level: item?.level || '',
        status: item?.status === 'active' 
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { validateToken } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 'active' : 'inactive') : value
        }));
        if (error) setError('');
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (!validateToken()) return;

        if (!formData.number.trim()) {
            setError('El número del apartamento es requerido');
            return;
        }
        if (!formData.level.trim()) {
            setError('El nivel del apartamento es requerido');
            return;
        }

        setIsSubmitting(true);

        try {
            setError('');
            let savedItem;
            if (item) {
                savedItem = await apartmentService.update(item.id, formData);
                if (!savedItem) savedItem = { ...item, ...formData };
                onSuccess(savedItem, true);
            } else {
                savedItem = await apartmentService.create(formData);
                if (!savedItem) savedItem = { id: Date.now(), ...formData, contract: 0 };
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
        if (e.key === 'Enter' && !isSubmitting) handleSubmit();
        if (e.key === 'Escape') onCancel();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {item ? 'Editar Apartamento' : 'Nuevo Apartamento'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                placeholder="Ej: 101"
                                maxLength="10"
                                autoFocus
                            />
                        </div>

                        <div>
                            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                                Nivel *
                            </label>
                            <input
                                type="text"
                                id="level"
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                placeholder="Ej: 1, 2, 3"
                                maxLength="5"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="status"
                                name="status"
                                checked={formData.status === 'active'}
                                onChange={handleChange}
                                className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                            />
                            <label htmlFor="status" className="ml-2 block text-sm text-gray-700">
                                Activo
                            </label>
                        </div>

                        {item && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contratos
                                </label>
                                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                    {item.contract} contratos
                                </span>
                            </div>
                        )}
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
                            className="px-4 py-2 text-sm font-medium text-white bg-[#D4AF37] hover:bg-[#B9962B] rounded-md disabled:opacity-50 transition-colors"
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

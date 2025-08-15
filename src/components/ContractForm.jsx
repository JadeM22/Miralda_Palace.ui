import { useState, useEffect } from 'react';
import { contractService } from '../services';

const ContractForm = ({ item, apartments, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        id_apartment: item?.apartment?.id || '', 
        start_date: item?.start_date || '',
        end_date: item?.end_date || '',
        active: item?.active ?? true
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormData({
            id_apartment: item?.apartment?.id || '',
            start_date: item?.start_date || '',
            end_date: item?.end_date || '',
            active: item?.active ?? true
        });
    }, [item]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        if (!formData.id_apartment) {
            setError('El apartamento es requerido');
            return;
        }
        if (!formData.start_date) {
            setError('La fecha de inicio es requerida');
            return;
        }
        if (!formData.end_date) {
            setError('La fecha de finalización es requerida');
            return;
        }
        if (new Date(formData.end_date) < new Date(formData.start_date)) {
            setError('La fecha de finalización no puede ser anterior a la de inicio');
            return;
        }

        setIsSubmitting(true);
        try {
            setError('');
            const payload = { ...formData, id_apartment: formData.id_apartment };
            let savedItem;

            if (item) {
                savedItem = await contractService.update(item.id, payload);
                if (!savedItem) savedItem = { ...item, ...payload };
                onSuccess(savedItem, true);
            } else {
                savedItem = await contractService.create(payload);
                if (!savedItem) savedItem = { id: Date.now().toString(), ...payload };
                onSuccess(savedItem, false);
            }
        } catch (err) {
            console.error('Error al guardar:', err);
            setError(err.message || 'Error al guardar el contrato');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isSubmitting) handleSubmit();
        if (e.key === 'Escape') onCancel();
    };

    // Mostrar solo apartamentos activos o el del contrato que estamos editando
    const activeApartments = apartments.filter(a => {
        if (!a) return false;
        const apartmentId = String(a.id);                  
        const currentId = item?.apartment?.id ? String(item.apartment.id) : null;
        return a.active || apartmentId === currentId;
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-[#1C1C1C] mb-4">
                        {item ? 'Editar Contrato' : 'Nuevo Contrato'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-black rounded-md">
                            <div className="flex items-center">
                                <span className="mr-2">❌</span>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="id_apartment" className="block text-sm font-medium text-[#1C1C1C] mb-1">
                                Apartamento *
                            </label>
                            <select
                                id="id_apartment"
                                name="id_apartment"
                                value={formData.id_apartment}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                            >
                                <option value="">Seleccionar apartamento...</option>
                                {activeApartments.map(a => (
                                    <option key={a.id} value={a.id}>
                                        {a.number || a.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-[#1C1C1C] mb-1">
                                    Fecha de Inicio *
                                </label>
                                <input
                                    type="date"
                                    id="start_date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyPress}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                />
                            </div>

                            <div>
                                <label htmlFor="end_date" className="block text-sm font-medium text-[#1C1C1C] mb-1">
                                    Fecha de Fin *
                                </label>
                                <input
                                    type="date"
                                    id="end_date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyPress}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="active"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                            />
                            <label htmlFor="active" className="ml-2 block text-sm text-[#1C1C1C]">
                                Activo
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-[#1C1C1C] bg-[#F5F5F5] hover:bg-[#E0E0E0] rounded-md transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-black bg-[#D4AF37] hover:bg-[#B9962B] rounded-md disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractForm;

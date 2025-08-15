import { useState, useEffect } from 'react';
import { apartmentService } from '../services';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import ApartmentForm from './ApartmentForm';

const ApartmentsList = () => {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [recentlyUpdated, setRecentlyUpdated] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const { validateToken } = useAuth();

    useEffect(() => { loadApartments(); }, []);

    useEffect(() => {
        if (recentlyUpdated) {
            const timer = setTimeout(() => setRecentlyUpdated(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [recentlyUpdated]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const loadApartments = async () => {
        if (!validateToken()) return;
        try {
            setLoading(true);
            setError('');
            const data = await apartmentService.getAll(); // debe usar pipeline en backend
            setApartments(data);
        } catch (error) {
            console.error('Error al cargar apartamentos:', error);
            setError(error.message || 'Error al cargar los apartamentos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => { setEditingItem(null); setShowForm(true); };
    const handleEdit = (item) => { setEditingItem(item); setShowForm(true); };

    const handleToggleStatus = async (item) => {
        if (!validateToken()) return;

        try {
            const updatedItem = await apartmentService.toggleStatus(item.id, item.status);
            setApartments(prev => prev.map(a => a.id === item.id ? updatedItem : a));
            setSuccessMessage(
                updatedItem.status === 'active'
                    ? 'Apartamento activado exitosamente'
                    : 'Apartamento desactivado exitosamente'
            );
        } catch (err) {
            console.error('Error al alternar estado del apartamento:', err);
            setError(err.message || 'Error al actualizar estado del apartamento');
        }
    };

    const handleFormSuccess = async (savedItem, isEdit = false) => {
        await loadApartments();
        setRecentlyUpdated(savedItem.id);
        const message = isEdit ? 'Apartamento actualizado exitosamente' : 'Apartamento creado exitosamente';
        setSuccessMessage(message);
        setShowForm(false);
        setEditingItem(null);
        setError('');
    };

    const handleFormCancel = () => { setShowForm(false); setEditingItem(null); };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-600">
                Cargando apartamentos...
            </div>
        );
    }

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Apartamentos</h1>
                <button
                    onClick={handleCreate}
                    className="bg-[#D4AF37] hover:bg-[#B9962B] text-[#1C1C1C] font-medium py-2 px-4 rounded-md transition-colors"
                >
                    + Nuevo Apartamento
                </button>
            </div>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-[#1C1C1C] rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">✅</span>
                        <span>{successMessage}</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-[#1C1C1C] rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">❌</span>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nivel</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contratos</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {apartments.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    No hay apartamentos registrados
                                </td>
                            </tr>
                        ) : (
                            apartments.map((item) => (
                                <tr
                                    key={item.id}
                                    className={`hover:bg-gray-50 transition-colors ${recentlyUpdated === item.id ? 'bg-green-50 border-l-4 border-green-400' : ''}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.level}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                            (item.contractsCount || 0) > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {item.contractsCount || 0} contratos
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            item.status === 'active' ? 'bg-green-100 text-[#1C1C1C]' : 'bg-red-100 text-[#1C1C1C]'
                                        }`}>
                                            {item.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-[#D4AF37] hover:text-[#B9962B] mr-3"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleToggleStatus(item)}
                                            className={item.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}
                                        >
                                            {item.status === 'active' ? 'Desactivar' : 'Activar'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <ApartmentForm
                    item={editingItem}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            )}
        </Layout>
    );
};

export default ApartmentsList;

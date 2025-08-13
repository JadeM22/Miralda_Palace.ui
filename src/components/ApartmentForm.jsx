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

    useEffect(() => {
        loadApartments();
    }, []);

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
            const data = await apartmentService.getAll();
            setApartments(data);
        } catch (err) {
            console.error('Error al cargar apartamentos:', err);
            setError(err.message || 'Error al cargar los apartamentos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingItem(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleDelete = async (item) => {
        if (!validateToken()) return;

        const hasContracts = item.number_of_contracts > 0;
        const action = hasContracts ? 'desactivar' : 'eliminar';
        const messageConfirmation = hasContracts
            ? `Este apartamento tiene ${item.number_of_contracts} contrato(s). Se desactivará pero mantendrá la integridad de los datos.`
            : 'Este apartamento será eliminado permanentemente del sistema.';

        const confirmed = window.confirm(
            `¿Estás seguro de ${action} el apartamento "${item.number}"?\n\n${messageConfirmation}\n\n¿Deseas continuar?`
        );

        if (confirmed) {
            try {
                setError('');
                await apartmentService.deactivate(item.id);
                await loadApartments();
                setSuccessMessage(
                    hasContracts ? 'Apartamento desactivado exitosamente' : 'Apartamento eliminado exitosamente'
                );
            } catch (err) {
                console.error('Error al procesar:', err);
                setError(err.message || `Error al ${action} el apartamento`);
            }
        }
    };

    const handleFormSuccess = async (savedItem, isEdit = false) => {
        await loadApartments();
        setRecentlyUpdated(savedItem.id);
        setSuccessMessage(isEdit ? 'Apartamento actualizado exitosamente' : 'Apartamento creado exitosamente');
        setShowForm(false);
        setEditingItem(null);
        setError('');
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F8F8F8]">
                <div className="text-lg text-[#7F8C8D]">Cargando apartamentos...</div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[#1C1C1C]">Apartamentos</h1>
                <button
                    onClick={handleCreate}
                    className="bg-[#D4AF37] hover:bg-[#B9962F] text-[#1C1C1C] font-medium py-2 px-4 rounded-md transition-colors"
                >
                    + Nuevo Apartamento
                </button>
            </div>

            {successMessage && (
                <div className="mb-4 p-3 bg-[#FDF6E3] border border-[#D4AF37] text-[#1C1C1C] rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">✅</span>
                        <span>{successMessage}</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-[#FDF6E3] border border-red-500 text-[#1C1C1C] rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">❌</span>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <div className="bg-[#FDF6E3] shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-[#FDF6E3]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">Número</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">Piso</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">Contratos</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apartments.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-[#7F8C8D]">
                                    No hay apartamentos registrados
                                </td>
                            </tr>
                        ) : (
                            apartments.map((item) => (
                                <tr
                                    key={item.id}
                                    className={`hover:bg-[#FDF6E3] transition-colors ${
                                        recentlyUpdated === item.id ? 'bg-[#D4AF37]/20 border-l-4 border-[#D4AF37]' : ''
                                    }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1C1C1C]">{item.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1C1C1C]">{item.number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1C1C1C]">{item.floor}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1C1C1C]">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            item.number_of_contracts > 0
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {item.number_of_contracts} contrato(s)
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                item.status === 'active'
                                                    ? 'bg-[#D4AF37]/30 text-[#1C1C1C]'
                                                    : 'bg-red-200 text-[#1C1C1C]'
                                            }`}
                                        >
                                            {item.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-[#D4AF37] hover:text-[#B9962F] mr-3"
                                        >
                                            Editar
                                        </button>
                                        {item.status === 'active' && (
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="text-[#D4AF37] hover:text-[#B9962F]"
                                            >
                                                {item.number_of_contracts > 0 ? 'Desactivar' : 'Eliminar'}
                                            </button>
                                        )}
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

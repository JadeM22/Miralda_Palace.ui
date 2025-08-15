import { useState, useEffect } from 'react';
import { contractService, apartmentService } from '../services';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import ContractForm from './ContractForm';

const ContractsList = () => {
    const [contracts, setContracts] = useState([]);
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [recentlyUpdated, setRecentlyUpdated] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const { validateToken } = useAuth();

    useEffect(() => { loadData(); }, []);

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

    const loadData = async () => {
        if (!validateToken()) return;
        try {
            setLoading(true);
            setError('');

            // Traer contratos
            const contractsData = await contractService.getAll();
            setContracts(contractsData);

            // Traer apartamentos
            const apartmentsData = await apartmentService.getAll();

            // Filtrar solo activos y sin contrato activo
            const activeApartments = apartmentsData.filter(a => a.active && !a.hasActiveContract);
            setApartments(activeApartments);

        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError(err.message || 'Error al cargar contratos o apartamentos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => { setEditingItem(null); setShowForm(true); };
    const handleEdit = (item) => { setEditingItem(item); setShowForm(true); };

    const handleDeleteOrDeactivate = async (item) => {
        const hasApartment = !!item.apartment;
        const confirmed = window.confirm(
            hasApartment
                ? "El contrato tiene un apartamento asignado. ¿Deseas desactivarlo?"
                : "¿Estás seguro de eliminar el contrato? Esta acción no se puede deshacer."
        );
        if (!confirmed) return;

        try {
            await contractService.deleteOrDeactivate(item.id);

            setContracts(prevContracts =>
                prevContracts.filter(c => c.id !== item.id)
            );

            setSuccessMessage(
                hasApartment
                    ? 'Contrato desactivado exitosamente'
                    : 'Contrato eliminado exitosamente'
            );
        } catch (err) {
            console.error('Error al eliminar/desactivar:', err);
            setError(err.message || 'Error al procesar contrato');
        }
    };

    const handleFormSuccess = async (savedItem, isEdit = false) => {
        await loadData();
        setRecentlyUpdated(savedItem.id);
        setSuccessMessage(
            isEdit
                ? 'Contrato actualizado exitosamente'
                : 'Contrato creado exitosamente'
        );
        setShowForm(false);
        setEditingItem(null);
        setError('');
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-HN');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-800">Cargando contratos...</div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Contratos</h1>
                <button
                    onClick={handleCreate}
                    className="bg-[#D4AF37] hover:bg-[#B9962B] text-black font-medium py-2 px-4 rounded-md transition-colors"
                >
                    + Nuevo Contrato
                </button>
            </div>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-black rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">✅</span>
                        <span>{successMessage}</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-black rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">❌</span>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-[#F5F5F5]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#1C1C1C] uppercase tracking-wider">
                                Apartment
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#1C1C1C] uppercase tracking-wider">
                                Start Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#1C1C1C] uppercase tracking-wider">
                                End Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#1C1C1C] uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#1C1C1C] uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {contracts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-[#1C1C1C]">
                                    No hay contratos registrados
                                </td>
                            </tr>
                        ) : (
                            contracts.map((item) => (
                                <tr
                                    key={item.id}
                                    className={`hover:bg-gray-50 transition-colors ${
                                        recentlyUpdated === item.id ? 'bg-blue-50 border-l-4 border-blue-400' : ''
                                    }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1C1C1C]">
                                        {item.apartment?.number || 'Sin asignar'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1C1C1C]">
                                        {formatDate(item.start_date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1C1C1C]">
                                        {formatDate(item.end_date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            item.active ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-black'
                                        }`}>
                                            {item.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="bg-[#D4AF37] hover:bg-[#B9962B] text-black px-3 py-1 rounded-md transition-colors"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOrDeactivate(item)}
                                            className={`px-3 py-1 rounded-md transition-colors ${
                                                item.apartment
                                                    ? 'bg-orange-400 hover:bg-orange-600 text-black'
                                                    : 'bg-red-400 hover:bg-red-600 text-black'
                                            }`}
                                        >
                                            {item.apartment ? 'Desactivar' : 'Eliminar'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <ContractForm
                    item={editingItem}
                    apartments={apartments}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            )}
        </Layout>
    );
};

export default ContractsList;

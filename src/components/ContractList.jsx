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
    useEffect(() => { if (recentlyUpdated) { const timer = setTimeout(() => setRecentlyUpdated(null), 2000); return () => clearTimeout(timer); } }, [recentlyUpdated]);
    useEffect(() => { if (successMessage) { const timer = setTimeout(() => setSuccessMessage(''), 3000); return () => clearTimeout(timer); } }, [successMessage]);

    const loadData = async () => {
        try {
            setLoading(true); setError('');
            const contractsData = await contractService.getAll();
            setContracts(contractsData["contracts"]);
            try {
                const apartmentsData = await apartmentService.getAll();
                setApartments(apartmentsData);
            } catch { setApartments([]); }
        } catch (err) {
            console.error(err); setError(err.message || 'Error al cargar los contratos');
        } finally { setLoading(false); }
    };

    const handleCreate = () => { setEditingItem(null); setShowForm(true); };
    const handleEdit = (item) => { setEditingItem(item); setShowForm(true); };
    const handleDelete = async (item) => {
        if (!validateToken()) return;
        if (!window.confirm(`¿Eliminar contrato del usuario "${item.id_User}"?`)) return;
        try { await contractService.deactivate(item.id); await loadData(); setSuccessMessage('Contrato eliminado exitosamente'); } 
        catch (err) { console.error(err); setError(err.message || 'Error al eliminar el contrato'); }
    };

    const handleFormSuccess = async (savedItem, isEdit = false) => {
        await loadData(); setRecentlyUpdated(savedItem.id);
        setSuccessMessage(isEdit ? 'Contrato actualizado exitosamente' : 'Contrato creado exitosamente');
        setShowForm(false); setEditingItem(null); setError('');
    };
    const handleFormCancel = () => { setShowForm(false); setEditingItem(null); };
    const getApartmentName = (contract) => { const a = apartments.find(ap => ap.id === contract.id_apartment); return a ? a.description : 'Apartamento no encontrado'; };

    if (loading) return <div className="flex justify-center items-center min-h-screen text-white">Cargando contratos...</div>;

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[#1C1C1C]">Contratos</h1>
                <button
                    onClick={handleCreate}
                    className="bg-[#D4AF37] hover:bg-[#B9962B] text-[#1C1C1C] font-medium py-2 px-4 rounded-md transition-colors"
                >
                    + Nuevo Contrato
                </button>
            </div>

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-[#1C1C1C] rounded-md">
                    <div className="flex items-center"><span className="mr-2">✅</span><span>{successMessage}</span></div>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-[#1C1C1C] rounded-md">
                    <div className="flex items-center"><span className="mr-2">❌</span><span>{error}</span></div>
                </div>
            )}

            <div className="bg-[#FDF6E3] shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#FDF6E3]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">Apartamento</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">Fecha Inicio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">Fecha Fin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#7F8C8D] uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#FDF6E3] divide-y divide-gray-200">
                        {contracts.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-4 text-center text-[#1C1C1C]">No hay contratos registrados</td></tr>
                        ) : (
                            contracts.map((item) => (
                                <tr key={item.id} className={`hover:bg-[#eae0d6] transition-colors ${recentlyUpdated === item.id ? 'bg-green-50 border-l-4 border-green-400' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1C1C1C]">{item.id_User}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#7F8C8D]">
                                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-[#D4AF37]/20 text-[#1C1C1C] rounded-full">{getApartmentName(item)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1C1C1C]">{item.start_date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1C1C1C]">{item.end_date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            item.status === 'active' ? 'bg-green-100 text-[#1C1C1C]' : 'bg-red-100 text-[#1C1C1C]'
                                        }`}>
                                            {item.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(item)} className="text-[#D4AF37] hover:text-[#B9962B] mr-3">Editar</button>
                                        {item.status === 'active' && <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-900">Eliminar</button>}
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

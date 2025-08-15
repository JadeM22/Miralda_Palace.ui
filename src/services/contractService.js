import { API_BASE_URL, handleResponse } from "./api.js";

export const contractService = {
    getAll: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/contracts`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' } // público
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener contratos:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' } 
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener contrato:', error);
            throw error;
        }
    },

    create: async (contract) => {
        try {
            const response = await fetch(`${API_BASE_URL}/contracts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({
                    id_apartment: contract.id_apartment,
                    start_date: contract.start_date,
                    end_date: contract.end_date,
                    active: contract.active ?? true
                })
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al crear contrato:', error);
            throw error;
        }
    },

    update: async (id, contract) => {
        try {
            const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({
                    id_apartment: contract.id_apartment,
                    start_date: contract.start_date,
                    end_date: contract.end_date,
                    active: contract.active
                })
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al actualizar contrato:', error);
            throw error;
        }
    },

    deleteOrDeactivate: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' } 
            });
            await handleResponse(response);
            return true;
        } catch (error) {
            console.error('Error al eliminar/desactivar contrato:', error);
            throw error;
        }
    }
};

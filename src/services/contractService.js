import { API_BASE_URL, handleResponse } from "./api.js";

export const contractService = {
    getAll: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/contracts`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
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
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/contracts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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

    deactivate: async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al desactivar contrato:', error);
            throw error;
        }
    }
};

import { API_BASE_URL, handleResponse } from "./api.js";

export const apartmentService = {
    getAll: async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/apartments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener apartamentos:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/apartments/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener apartamento:', error);
            throw error;
        }
    },

    create: async (apartment) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/apartments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    number: apartment.number,
                    level: apartment.level,
                    status: apartment.status ?? 'active'
                })
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al crear apartamento:', error);
            throw error;
        }
    },

    update: async (id, apartment) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/apartments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    number: apartment.number,
                    level: apartment.level,
                    status: apartment.status
                })
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al actualizar apartamento:', error);
            throw error;
        }
    },

    toggleStatus: async (id, currentStatus) => {
    try {
        const token = localStorage.getItem('authToken');
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

        const response = await fetch(`${API_BASE_URL}/apartments/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error al alternar estado del apartamento:', error);
        throw error;
    }
}
}
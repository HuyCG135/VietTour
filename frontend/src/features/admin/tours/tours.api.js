const API_URL = import.meta.env.VITE_API_URL || '/api';
const ADMIN_TOURS_URL = `${API_URL}/admin/tours`;
import { getToken } from '../../auth/auth.api';

export async function getAllTours() {
    const res = await fetch(ADMIN_TOURS_URL, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    return res.json();
}

export async function createTour(data) {
    const res = await fetch(ADMIN_TOURS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function updateTour(id, data) {
    const res = await fetch(`${ADMIN_TOURS_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function deleteTour(id) {
    const res = await fetch(`${ADMIN_TOURS_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
        },
    });
    return res.json();
}

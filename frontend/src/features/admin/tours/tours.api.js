const API_URL = import.meta.env.VITE_API_URL || '/api';
const ADMIN_TOURS_URL = `${API_URL}/admin/tours`;
import { getToken } from '../../auth/auth.api';

const authHeaders = (extra = {}) => ({
    'Authorization': `Bearer ${getToken()}`,
    ...extra,
});

const buildQuery = (query = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.set(key, value);
        }
    });
    const qs = params.toString();
    return qs ? `?${qs}` : '';
};

export async function getAllTours(query = {}) {
    const res = await fetch(`${ADMIN_TOURS_URL}${buildQuery(query)}`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function getTourFilters() {
    const res = await fetch(`${ADMIN_TOURS_URL}/filters`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function getTourById(id) {
    const res = await fetch(`${ADMIN_TOURS_URL}/${id}`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function createTour(data) {
    const res = await fetch(ADMIN_TOURS_URL, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function updateTour(id, data) {
    const res = await fetch(`${ADMIN_TOURS_URL}/${id}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function deleteTour(id) {
    const res = await fetch(`${ADMIN_TOURS_URL}/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return res.json();
}

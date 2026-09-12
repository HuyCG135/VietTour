const API_URL = import.meta.env.VITE_API_URL || '/api';
import { getToken } from '../auth/auth.api.js';

const authHeaders = (extra = {}) => ({
    'Authorization': `Bearer ${getToken()}`,
    ...extra,
});

const jsonHeaders = authHeaders({ 'Content-Type': 'application/json' });

export async function getProfile() {
    const res = await fetch(`${API_URL}/auth/profile`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function updateProfile(data) {
    const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: jsonHeaders,
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function changePassword(data) {
    const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(data),
    });
    return res.json();
}
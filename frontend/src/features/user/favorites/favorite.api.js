const API_URL = import.meta.env.VITE_API_URL || '/api';
import { getToken } from '../../auth/auth.api.js';

const authHeaders = (extra = {}) => ({
    'Authorization': `Bearer ${getToken()}`,
    ...extra,
});

export async function getFavorites() {
    const res = await fetch(`${API_URL}/favorites`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function getFavoriteIds() {
    const res = await fetch(`${API_URL}/favorites/ids`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function addFavorite(tourId) {
    const res = await fetch(`${API_URL}/favorites/${tourId}`, {
        method: 'POST',
        headers: authHeaders(),
    });
    return res.json();
}

export async function removeFavorite(tourId) {
    const res = await fetch(`${API_URL}/favorites/${tourId}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return res.json();
}
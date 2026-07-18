const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function getFavorites() {
    const res = await fetch(`${API_URL}/favorites`);
    return res.json();
}

export async function addFavorite(tourId) {
    const res = await fetch(`${API_URL}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tour_id: tourId }),
    });
    return res.json();
}

export async function removeFavorite(tourId) {
    const res = await fetch(`${API_URL}/favorites/${tourId}`, { method: 'DELETE' });
    return res.json();
}

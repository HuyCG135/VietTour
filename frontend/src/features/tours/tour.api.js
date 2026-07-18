const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function getAllTours() {
     const res = await fetch(`${API_URL}/tours`);
     return res.json();
}

export async function getToursByRegion(region) {
     const res = await fetch(`${API_URL}/tours/region/${encodeURIComponent(region)}`);
     return res.json();
}

export async function getTourById(id) {
     const res = await fetch(`${API_URL}/tours/${id}`);
     return res.json();
}

export async function searchTours(keyword) {
     const res = await fetch(`${API_URL}/tours/search?q=${encodeURIComponent(keyword)}`);
     return res.json();
}

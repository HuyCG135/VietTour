const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function getAllTours() {
     const res = await fetch(`${API_URL}/tours`);
     return res.json();
}

export async function getToursByRegion(region) {
     const res = await fetch(`${API_URL}/tours/region/${encodeURIComponent(region)}`);
     return res.json();
}

export async function getTours(query = {}) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
                params.set(key, value.join(","));
            } else {
                params.set(key, value);
            }
        }
    });
    const qs = params.toString();
    const res = await fetch(`${API_URL}/tours${qs ? `?${qs}` : ""}`);
    return res.json();
}

export async function getTourFilters() {
    const res = await fetch(`${API_URL}/tours/filters`);
    return res.json();
}

export async function getTourCalendar(query = {}) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
                params.set(key, value.join(","));
            } else {
                params.set(key, value);
            }
        }
    });
    const qs = params.toString();
    const res = await fetch(`${API_URL}/tours/calendar${qs ? `?${qs}` : ""}`);
    return res.json();
}

export async function getTourById(id) {
    const res = await fetch(`${API_URL}/tours/${id}`);
    return res.json();
}

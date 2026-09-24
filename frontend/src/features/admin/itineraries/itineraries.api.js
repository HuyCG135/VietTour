const API_URL = import.meta.env.VITE_API_URL || "/api";
const ADMIN_ITINERARIES_URL = `${API_URL}/admin/itineraries`;
import { getToken } from "../../auth/auth.api";

const authHeaders = (extra = {}) => ({
    Authorization: `Bearer ${getToken()}`,
    ...extra,
});

const buildQuery = (query = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.set(key, value);
        }
    });
    const qs = params.toString();
    return qs ? `?${qs}` : "";
};

export async function getItineraries(query = {}) {
    const res = await fetch(`${ADMIN_ITINERARIES_URL}${buildQuery(query)}`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function getItineraryDetail(tourId) {
    const res = await fetch(`${ADMIN_ITINERARIES_URL}/${tourId}`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function updateItinerary(tourId, itineraries) {
    const res = await fetch(`${ADMIN_ITINERARIES_URL}/${tourId}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ itineraries }),
    });
    return res.json();
}
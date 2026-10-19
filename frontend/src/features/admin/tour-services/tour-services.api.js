import { getToken } from "../../auth/auth.api";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const ADMIN_TOUR_SERVICES_URL = `${API_URL}/admin/tour-services`;

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

export async function getTourServices(query = {}) {
    const res = await fetch(`${ADMIN_TOUR_SERVICES_URL}${buildQuery(query)}`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function getTourServiceDetail(tourId) {
    const res = await fetch(`${ADMIN_TOUR_SERVICES_URL}/${encodeURIComponent(tourId)}`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function updateTourServices(tourId, serviceIds) {
    const res = await fetch(`${ADMIN_TOUR_SERVICES_URL}/${encodeURIComponent(tourId)}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ service_ids: serviceIds }),
    });
    return res.json();
}

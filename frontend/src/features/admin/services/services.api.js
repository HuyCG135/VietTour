import { getToken } from "../../auth/auth.api";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const ADMIN_SERVICES_URL = `${API_URL}/admin/services`;

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

export async function getAllServices(query = {}) {
    const res = await fetch(`${ADMIN_SERVICES_URL}${buildQuery(query)}`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function getServiceById(id) {
    const res = await fetch(`${ADMIN_SERVICES_URL}/${encodeURIComponent(id)}`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function createService(data) {
    const res = await fetch(ADMIN_SERVICES_URL, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function updateService(id, data) {
    const res = await fetch(`${ADMIN_SERVICES_URL}/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function deleteService(id) {
    const res = await fetch(`${ADMIN_SERVICES_URL}/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return res.json();
}

import { getToken } from "../../auth/auth.api";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const ADMIN_DEPARTURES_URL = `${API_URL}/admin/departures`;

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

// Danh sách tour gọn cho dropdown chọn tour (GET /api/admin/departures/tours).
export async function getTours() {
    const res = await fetch(`${ADMIN_DEPARTURES_URL}/tours`, {
        headers: authHeaders(),
    });
    return res.json();
}

// Danh sách chuyến khởi hành, lọc theo tour + khoảng ngày (from/to).
export async function getDepartures(query = {}) {
    const res = await fetch(`${ADMIN_DEPARTURES_URL}${buildQuery(query)}`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function createDeparture(data) {
    const res = await fetch(ADMIN_DEPARTURES_URL, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
    });
    return res.json();
}

// Cập nhật một phần (chỉ gửi các field đang đổi).
export async function updateDeparture(id, data) {
    const res = await fetch(`${ADMIN_DEPARTURES_URL}/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
    });
    return res.json();
}

// Đổi cờ thủ công open/closed của chuyến.
export async function updateDepartureStatus(id, status) {
    const res = await fetch(`${ADMIN_DEPARTURES_URL}/${encodeURIComponent(id)}/status`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ status }),
    });
    return res.json();
}

export async function deleteDeparture(id) {
    const res = await fetch(`${ADMIN_DEPARTURES_URL}/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return res.json();
}
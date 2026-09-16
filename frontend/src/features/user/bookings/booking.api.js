const API_URL = import.meta.env.VITE_API_URL || '/api';
import { getToken } from '../../auth/auth.api.js';

const authHeaders = (extra = {}) => ({
    'Authorization': `Bearer ${getToken()}`,
    ...extra,
});

export async function createBooking(data) {
    const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function getMyBookings() {
    const res = await fetch(`${API_URL}/bookings/my-bookings`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function getBookingDetail(id) {
    const res = await fetch(`${API_URL}/bookings/${id}`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function cancelBooking(id) {
    const res = await fetch(`${API_URL}/bookings/${id}/cancel`, {
        method: "PUT",
        headers: authHeaders(),
    });
    return res.json();
}

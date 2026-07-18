const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function createBooking(data) {
    const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function getMyBookings() {
    const res = await fetch(`${API_URL}/bookings/my`);
    return res.json();
}

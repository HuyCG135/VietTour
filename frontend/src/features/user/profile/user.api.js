const API_URL = import.meta.env.VITE_API_URL || '/api';
import { getToken } from '../auth/auth.api';

export async function updateProfile(data) {
    const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
    });
    return res.json();
}

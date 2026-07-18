const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function login(username, password) {
     const res = await fetch(`${API_URL}/auth/login`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ username, password }),
     });
     return res.json();
}

export async function register(data) {
     const res = await fetch(`${API_URL}/auth/register`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(data),
     });
     return res.json();
}

export function logout() {
     localStorage.removeItem('token');
     localStorage.removeItem('user');
}

export function getToken() {
     return localStorage.getItem('token');
}

export function getUser() {
     const user = localStorage.getItem('user');
     return user ? JSON.parse(user) : null;
}

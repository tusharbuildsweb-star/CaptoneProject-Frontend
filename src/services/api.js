import axios from 'axios';

// Base API instance
const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '') + '/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ── Request interceptor: attach Bearer token from sessionStorage ──────────────
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401/403 globally ───────────────────────────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — clear storage and redirect to login
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('needsOnboarding');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

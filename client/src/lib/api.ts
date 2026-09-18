import axios from 'axios';

let rawApiUrl = (import.meta.env.VITE_API_URL || '').trim();
if (rawApiUrl.endsWith('/')) {
  rawApiUrl = rawApiUrl.slice(0, -1);
}
if (rawApiUrl && !rawApiUrl.endsWith('/api')) {
  rawApiUrl = `${rawApiUrl}/api`;
}

const API_BASE_URL =
  rawApiUrl || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject fallback token if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tc_admin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

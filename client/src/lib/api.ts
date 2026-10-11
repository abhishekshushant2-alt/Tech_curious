import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

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

// Lightweight client-side GET cache (TTL: 60 seconds)
interface CacheEntry {
  data: any;
  timestamp: number;
}
const requestCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000;

export const clearApiCache = () => {
  requestCache.clear();
};

// Request interceptor to inject fallback token and handle client-side cache
api.interceptors.request.use((config: InternalAxiosRequestConfig & { skipCache?: boolean }) => {
  const token = localStorage.getItem('tc_admin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // If this is a mutation (POST, PUT, DELETE, PATCH), invalidate cached GET responses
  const method = config.method?.toUpperCase();
  if (method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    requestCache.clear();
  }

  return config;
});

// Response interceptor to store and return cached data
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as any;
    if (config.method?.toUpperCase() === 'GET' && !config.skipCache && !config.url?.includes('/auth/me')) {
      const cacheKey = `${config.url}?${JSON.stringify(config.params || {})}`;
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    }
    return response;
  },
  (error) => Promise.reject(error)
);

// Custom cached get helper
export const cachedGet = async <T = any>(
  url: string,
  params?: any,
  options?: { ttl?: number; forceFresh?: boolean }
): Promise<T> => {
  const cacheKey = `${url}?${JSON.stringify(params || {})}`;
  const now = Date.now();
  const cached = requestCache.get(cacheKey);
  const ttl = options?.ttl || CACHE_TTL_MS;

  if (!options?.forceFresh && cached && now - cached.timestamp < ttl) {
    return cached.data as T;
  }

  const res = await api.get(url, { params, ...options });
  return res.data as T;
};

export default api;

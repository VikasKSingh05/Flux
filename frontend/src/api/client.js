import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 15000,
});

let getToken = () => null;
export const setAuthTokenGetter = (fn) => {
  getToken = fn;
};

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    if (err.response?.status === 429) {
      err.message = err.response?.data?.error || 'Too many requests. Please try again later.';
    }
    if (err.code === 'ECONNABORTED') {
      err.message = 'Request timed out. Please try again.';
    }
    return Promise.reject(err);
  }
);

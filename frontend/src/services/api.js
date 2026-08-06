import axios from 'axios';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.PROD) {
    return '/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    let message = error.response?.data?.message;

    if (!message) {
      if (error.message === 'Network Error' || !error.response) {
        message = 'Network Error: Backend server is unreachable. Please set VITE_API_URL in environment settings.';
      } else {
        message = error.message || 'An unexpected error occurred';
      }
    }

    if (status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.startsWith('/auth/')) {
        window.location.href = '/auth/login?sessionExpired=true';
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;

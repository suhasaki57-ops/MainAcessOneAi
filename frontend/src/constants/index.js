export const APP_NAME = import.meta.env.VITE_APP_NAME || 'ascess-1-ai';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ACCESSIBILITY: '/accessibility',
  DOCUMENT: '/document',
  AI_STUDIO: '/ai',
  HISTORY: '/history',
  SETTINGS: '/settings',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
  },
  DOCUMENT: {
    LIST: '/document',
    UPLOAD: '/document/upload',
  },
  AI: {
    PROMPT: '/ai/prompt',
  },
  ACCESSIBILITY: {
    SCAN: '/accessibility/scan',
  },
  HISTORY: {
    LIST: '/history',
  },
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
  },
};

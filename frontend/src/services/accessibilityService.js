import api from './api';

export const accessibilityService = {
  getPreferences: async () => {
    return await api.get('/accessibility/preferences');
  },
  updatePreferences: async (payload) => {
    return await api.put('/accessibility/preferences', payload);
  },
  getProfile: async () => {
    return await api.get('/accessibility/profile');
  },
  updateProfile: async (payload) => {
    return await api.put('/accessibility/profile', payload);
  },
  runAudit: async (text) => {
    return await api.post('/accessibility/audit', { text });
  },
  runWebsiteAudit: async (url) => {
    return await api.post('/accessibility/website', { url });
  },
  getHistory: async () => {
    return await api.get('/accessibility/history');
  },
  exportReport: async (format, report) => {
    return await api.post(`/accessibility/export/${format}`, { format, report });
  },
  getAnalytics: async () => {
    return await api.get('/accessibility/analytics');
  },
};

export default accessibilityService;

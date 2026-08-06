import api from './api';

export const historyService = {
  getHistory: async (params = {}) => {
    return await api.get('/history', { params });
  },
  addHistory: async (payload) => {
    return await api.post('/history', payload);
  },
  toggleFavorite: async (id) => {
    return await api.patch(`/history/${id}/favorite`);
  },
  deleteHistory: async (id) => {
    return await api.delete(`/history/${id}`);
  },
};

export default historyService;

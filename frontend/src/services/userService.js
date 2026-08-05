import api from './api';

export const userService = {
  getProfile: async () => {
    return await api.get('/user/profile');
  },
  updateProfile: async (data) => {
    return await api.put('/user/profile', data);
  },
  changePassword: async (passwordData) => {
    return await api.put('/user/change-password', passwordData);
  },
  deleteAccount: async () => {
    return await api.delete('/user/delete-account');
  },
};

export default userService;

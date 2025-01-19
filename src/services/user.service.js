import api from './api';

export const userService = {
  recoverPassword: async (email) => {
    const response = await api.post('/User/recoverPassword', { email });
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.post('/User/changePassword', passwordData);
    return response.data;
  }
}; 
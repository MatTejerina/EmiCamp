import api from './api';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/Auth/login', {
        userName: credentials.userName,
        password: credentials.password
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.idToken && response.data.accessToken) {
        localStorage.setItem('idToken', response.data.idToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', {
        status: error.response?.status,
        message: error.response?.data
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('idToken');
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization'];
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  }
}; 
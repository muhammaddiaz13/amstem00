import api from './api.js';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const userData = {
        ...response.data.user,
        token: response.data.token
      };

      if (userData.token) {
        localStorage.setItem('amstem_user', JSON.stringify(userData));
      }
      return userData;
    } catch (error) {
      console.error("Login error:", error.response?.data?.message || error.message);
      throw error;
    }
  },

  register: async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      
      const userData = {
        ...response.data.user,
        token: response.data.token
      };

      if (userData.token) {
        localStorage.setItem('amstem_user', JSON.stringify(userData));
      }
      return userData;
    } catch (error) {
      console.error("Register error:", error.response?.data?.message || error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('amstem_user');
  },

  getCurrentUser: () => {
    const stored = localStorage.getItem('amstem_user');
    return stored ? JSON.parse(stored) : null;
  }
};
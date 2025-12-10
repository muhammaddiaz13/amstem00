// Simulasi Backend API Delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  login: async (email, password) => {
    await delay(800); // Simulasi network loading
    
    // Simulasi logic backend sederhana
    if (email && password) {
      const username = email.split('@')[0];
      const user = { username, email, token: 'fake-jwt-token' };
      localStorage.setItem('amstem_user', JSON.stringify(user));
      return user;
    }
    throw new Error('Invalid credentials');
  },

  register: async (email, password) => {
    await delay(800);
    
    const username = email.split('@')[0];
    const user = { username, email, token: 'fake-jwt-token' };
    localStorage.setItem('amstem_user', JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem('amstem_user');
  },

  getCurrentUser: () => {
    const stored = localStorage.getItem('amstem_user');
    return stored ? JSON.parse(stored) : null;
  }
};
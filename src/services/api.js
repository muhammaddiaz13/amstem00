import axios from 'axios';

// Domain Railway Production (Port 3000)
const API_URL = 'https://amstem00-production-6448.up.railway.app/api'; 

console.log("🔗 Connecting to API:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyisipkan Token JWT ke setiap request otomatis
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('amstem_user'));
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
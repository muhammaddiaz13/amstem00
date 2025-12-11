import axios from 'axios';

// Kita gunakan domain yang ada tulisan "Port 3000" dari screenshot kamu
// Jangan lupa tambahkan /api di belakangnya
const API_URL = 'https://amstem00-production-6448.up.railway.app/api'; 

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
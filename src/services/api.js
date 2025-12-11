import axios from 'axios';

// Kita ubah menjadi relative path '/api'.
// Vercel (Production) atau Vite (Local) akan mem-proxy request ini ke Railway.
// Ini membypass masalah CORS karena browser mengira kita request ke domain yang sama.
const API_URL = '/api';

console.log("🔗 Connecting to API via Proxy:", API_URL);

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
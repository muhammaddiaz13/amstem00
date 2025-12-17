import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Mengambil Client ID dari file .env
// Jika kosong, gunakan dummy string untuk mencegah GoogleOAuthProvider crash saat inisialisasi.
// Komponen GoogleAuthButton di dalam App akan mencegah penggunaan hook jika ID ini adalah dummy/kosong.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "dummy_client_id_for_init_only";

if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  console.warn("⚠️ Google Client ID belum dipasang di file .env. Tombol Login Google akan disembunyikan otomatis.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
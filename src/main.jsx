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

// Mengambil Client ID dan membersihkannya dari tanda kutip atau spasi berlebih
const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_ID = rawClientId.replace(/['"]/g, '').trim() || "dummy_client_id_for_init_only";

if (!rawClientId || GOOGLE_CLIENT_ID === "dummy_client_id_for_init_only") {
  console.warn("⚠️ Google Client ID belum dipasang dengan benar di file .env atau Environment Variables.");
} else {
  console.log("✅ Google Client ID Loaded");
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
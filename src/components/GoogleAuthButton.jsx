import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const GoogleAuthButton = ({ text = "Sign in with Google", isRegister = false }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // LOGIC UPDATE: Strategi Proxy (Recommended)
  // Kita memaksa menggunakan Relative Path ('') di production agar request melalui Vercel Proxy.
  // Ini menghindari masalah CORS yang terjadi jika kita menembak URL Railway secara langsung dari browser.
  const getApiUrl = () => {
     const hostname = window.location.hostname;
     
     // Jika di Localhost, gunakan variable env atau default localhost
     if (hostname === 'localhost' || hostname === '127.0.0.1') {
         return import.meta.env.VITE_API_URL || 'http://localhost:3000';
     }

     // Jika di Production (Vercel), kembalikan string kosong.
     // Ini akan membuat fetch URL menjadi relative: "/api/auth/google"
     // Request ini akan ditangkap oleh vercel.json dan diteruskan ke Railway.
     return ''; 
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const toastId = toast.loading("Verifying with Google...");
      try {
        const accessToken = tokenResponse.access_token;
        
        // --- STEP 1: Get User Info from Google ---
        let userInfo;
        try {
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            
            if (!userInfoResponse.ok) {
                throw new Error(`Status ${userInfoResponse.status}`);
            }
            userInfo = await userInfoResponse.json();
        } catch (googleErr) {
            console.error("Step 1 (Google Profile) Failed:", googleErr);
            throw new Error(`Google Profile Error: ${googleErr.message}`);
        }
        
        // --- STEP 2: Send to Backend ---
        const apiUrl = getApiUrl();
        // Pastikan tidak ada double slash jika apiUrl kosong
        const baseUrl = apiUrl ? apiUrl.replace(/\/$/, '') : '';
        const targetUrl = `${baseUrl}/api/auth/google`;
        
        toast.loading("Connecting to server...", { id: toastId });
        console.log("Attempting Backend Login to:", targetUrl);

        let response;
        try {
             response = await fetch(targetUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({ 
                token: accessToken,
                googleUser: userInfo
              }),
            });
        } catch (networkErr) {
            console.error("Step 2 (Backend Fetch) Failed:", networkErr);
            // Jika proxy gagal (misal 504 Gateway Timeout), fetch akan throw error atau return status error.
            // Jika fetch throw error "Failed to fetch" di relative path, biasanya koneksi internet user putus
            // atau Vercel down total.
            throw new Error(`Connection Error: ${networkErr.message}.`);
        }

        // Handle Response Content
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error("Non-JSON response from backend:", text);
            // Respons HTML biasanya indikasi 404/500 dari Vercel/Railway
            throw new Error(`Server Error (${response.status}): The server returned an unexpected response.`);
        }

        if (!response.ok) {
          throw new Error(data.message || data.error || `Login failed with status ${response.status}`);
        }

        console.log("Google Auth success:", data);
        login(data);
        toast.success(isRegister ? "Account created successfully!" : "Login successful!", { id: toastId });
        navigate('/dashboard');

      } catch (err) {
        console.error("Google Auth Final Catch:", err);
        toast.error(err.message, { 
            id: toastId,
            duration: 6000 
        });
      }
    },
    onError: (errorResponse) => {
      console.error('Google Login onError:', errorResponse);
      toast.error("Google Popup Closed or Failed");
    },
    flow: 'implicit' 
  });

  const handleClick = () => {
    const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
    const clientId = rawClientId.replace(/['"]/g, '').trim();
    
    if (!clientId || clientId === "dummy_client_id_for_init_only" || clientId === "") {
        toast.error("Config Error: Missing Google Client ID", { duration: 4000 });
        return;
    }
    
    googleLogin();
  };

  return (
    <div className="flex justify-center w-full">
        <button
            onClick={handleClick}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-white py-3 px-4 rounded-xl transition-all duration-200 shadow-sm font-semibold group"
        >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>{text}</span>
        </button>
    </div>
  );
};

export default GoogleAuthButton;
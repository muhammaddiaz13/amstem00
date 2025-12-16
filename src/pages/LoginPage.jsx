import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { authService } from '../services/authService.js';
import { toast, Toaster } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log("Attempting login...");
      const user = await authService.login(email, password);
      console.log("Login success:", user);
      login(user);
      navigate('/dashboard');
    } catch (err) {
      console.error("Login Error Full Object:", err);
      
      let message = 'Login failed.';
      
      if (err.response) {
        if (err.response.data) {
          message = err.response.data.message || err.response.data.error || JSON.stringify(err.response.data);
        } else {
          message = `Server error: ${err.response.status}`;
        }
      } else if (err.request) {
        message = 'Cannot connect to server. Check your internet or CORS configuration.';
      } else {
        message = err.message;
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast("Sorry, Google Sign-In is coming soon!", {
        icon: '🚧',
        style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
        },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100 dark:border-gray-700 animate-[fadeIn_0.5s_ease-out] transition-colors duration-300">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">AMStem</h1>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
          <p className="text-gray-400 text-sm mt-2">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-xs rounded-lg text-center break-words border border-red-100 dark:border-red-900/50">
               {error}
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 rounded-xl transition-all duration-300 font-bold shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider with Text */}
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
            </div>
        </div>

        {/* Google Login Button (Coming Soon) */}
        <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white dark:bg-white text-gray-700 font-semibold py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm active:scale-95"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
        </button>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Don't have an account?</p>
          <Link to="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-bold hover:underline">
            Create an account
          </Link>
          <div className="mt-4">
            <Link to="/dashboard" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs">
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
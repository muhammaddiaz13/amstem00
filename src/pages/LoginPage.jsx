import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { authService } from '../services/authService.js';
import GoogleAuthButton from '../components/GoogleAuthButton';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    logout();
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log("Attempting login...");
      const responseData = await authService.login(email, password);
      
      console.log("Login success:", responseData);
      
      const userToLogin = responseData.user ? {
          ...responseData.user,
          token: responseData.token
      } : responseData;

      login(userToLogin);
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
      
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100 dark:border-gray-700 animate-fadeIn transition-colors duration-300">
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

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
            </div>
        </div>
        
        <GoogleAuthButton text="Sign in with Google" />

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
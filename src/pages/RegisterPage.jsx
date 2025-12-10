import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = await authService.register(email, password);
      login(user);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600 mb-1">AMStem</h1>
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-400 text-sm mt-2">Join us to manage your assignments better.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{error}</div>}
          
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 transition-all"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 transition-all"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 transition-all"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-bold shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Already have an account?</p>
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
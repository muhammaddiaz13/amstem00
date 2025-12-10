import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';

const LoginRequiredModal = () => {
  const { isLoginModalOpen, closeLoginModal } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    closeLoginModal();
    navigate('/login');
  };

  const handleRegister = () => {
    closeLoginModal();
    navigate('/register');
  };

  return (
    <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal} title="Unlock Full Access 🚀">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">🔒</span>
          </div>
        </div>
        
        <h4 className="text-xl font-semibold text-gray-800 mb-2">Login Required</h4>
        <p className="text-gray-600 mb-8">
          To create new assignments, collaborate with teams, and save your progress, you need to be logged into your AMStem account.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Login to Account
          </button>
          <button
            onClick={handleRegister}
            className="w-full bg-white text-blue-600 border-2 border-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all"
          >
            Create New Account
          </button>
        </div>
        
        <p className="mt-6 text-sm text-gray-400 cursor-pointer hover:text-gray-600" onClick={closeLoginModal}>
          Maybe later
        </p>
      </div>
    </Modal>
  );
};

export default LoginRequiredModal;
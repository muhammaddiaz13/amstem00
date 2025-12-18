import React from 'react';
import { toast } from 'react-hot-toast';
import { createPortal } from 'react-dom';

// Komponen internal untuk konten toast agar bisa menggunakan Portal
const ConfirmToastContent = ({ t, message, onConfirm }) => {
  // 1. Deteksi konteks pesan
  const lowerMsg = message.toLowerCase();
  const isDelete = lowerMsg.includes('delete');
  const isLogout = lowerMsg.includes('logout');
  
  // 2. Konfigurasi tampilan
  const config = {
    title: isLogout ? 'Confirm Logout' : (isDelete ? 'Delete Task' : 'Confirm Action'),
    confirmBtnText: isLogout ? 'Yes, Logout' : (isDelete ? 'Yes, Delete' : 'Yes, Confirm'),
    icon: isLogout ? 'fa-sign-out-alt' : (isDelete ? 'fa-trash-alt' : 'fa-question'),
    iconBg: (isDelete || isLogout) ? 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400',
    confirmBtnClass: (isDelete || isLogout) 
      ? 'bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-none' 
      : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 dark:shadow-none'
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm w-screen h-screen transition-opacity duration-300">
      <div 
        className={`${
          t.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } transform transition-all duration-200 pointer-events-auto flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 max-w-sm w-full mx-4 relative`}
      >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${config.iconBg}`}>
            <i className={`fas ${config.icon} text-xl`}></i>
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 text-center">
          {config.title}
        </h3>
        
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6 text-sm leading-relaxed">
          {message}
        </p>
        
        <div className="flex gap-3 w-full">
          <button
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className={`flex-1 px-4 py-2.5 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] ${config.confirmBtnClass}`}
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
          >
            {config.confirmBtnText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const ConfirmToast = (message, onConfirm) => {
  toast(
    (t) => <ConfirmToastContent t={t} message={message} onConfirm={onConfirm} />,
    {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: 'transparent',
        boxShadow: 'none',
        padding: 0,
        margin: 0,
        maxWidth: '100%'
      },
    }
  );
};
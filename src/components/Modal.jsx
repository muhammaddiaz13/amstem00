import React from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 transition-all duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-auto relative max-h-[85vh] flex flex-col animate-[fadeIn_0.2s_ease-out] border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 rounded-t-xl z-10">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5 overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body // Target render dipindahkan ke Body agar lepas dari container Dashboard
  );
};

export default Modal;
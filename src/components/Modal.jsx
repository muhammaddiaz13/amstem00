import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 transition-all duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto relative max-h-[90vh] flex flex-col animate-[fadeIn_0.2s_ease-out]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white rounded-t-xl z-10">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
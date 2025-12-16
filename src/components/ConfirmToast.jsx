import React from 'react';
import toast from 'react-hot-toast';

export const ConfirmToast = (message, onConfirm) => {
  toast(
    (t) => (
      <div 
        className={`${
          t.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } transition-all duration-200 flex flex-col items-center p-6 bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-sm w-full mx-auto`}
      >
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500">
            <i className="fas fa-trash-alt text-xl"></i>
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
          Confirm Action
        </h3>
        
        <p className="text-gray-500 text-center mb-6 text-sm leading-relaxed">
          {message}
        </p>
        
        <div className="flex gap-3 w-full">
          <button
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-200"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all duration-200 transform hover:scale-[1.02]"
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: 'transparent',
        boxShadow: 'none',
      },
    }
  );
};
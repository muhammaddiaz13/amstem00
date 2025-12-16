import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import Modal from './Modal.jsx';
import TaskForm from './TaskForm.jsx';
import { taskService } from '../services/taskService.js';
import { ConfirmToast } from './ConfirmToast.jsx';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, openLoginModal } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClasses = ({ isActive }) =>
    `flex items-center p-3 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm dark:bg-blue-900/30 dark:text-blue-400'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
    }`;

  const handleNewAssignmentClick = () => {
    if (!user) {
      openLoginModal();
    } else {
      setIsTaskModalOpen(true);
      if(window.innerWidth < 768) onClose(); // Close sidebar on mobile when action taken
    }
  };

  const handleTaskSubmit = async (task) => {
    try {
      await taskService.create({
        ...task,
        taskStatus: 'Unfinished',
        progress: 0
      });
      window.location.reload(); 
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error("Failed to create task via sidebar", error);
      alert("Failed to create task. Please try again.");
    }
  };

  const handleAuthAction = () => {
    if (user) {
      ConfirmToast("Are you sure you want to logout from your account?", () => {
        logout();
        if(window.innerWidth < 768) onClose();
      });
    } else {
      navigate('/login');
      if(window.innerWidth < 768) onClose();
    }
  };

  const handleNavClick = () => {
      // Auto close only on mobile
      if(window.innerWidth < 768) onClose();
  };

  return (
    <>
      {/* Mobile Overlay - Only visible on mobile when open */}
      <div 
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar Container */}
      {/* Note: Removed 'top-0' and changed to 'top-16' to sit below the header */}
      <div 
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-30 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-grow p-4 no-scrollbar">
          {/* User Profile Snippet */}
          <div className="flex items-center mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-3 shadow-sm ${user ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
              {user ? user.username[0].toUpperCase() : '?'}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-gray-800 dark:text-gray-200 truncate text-sm">
                {user ? user.username : 'Anonymous'}
              </p>
              <div className="flex items-center mt-0.5">
                <span className={`w-2 h-2 rounded-full mr-1.5 ${user ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user ? 'Online' : 'Guest Mode'}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">Main</p>
            <NavLink to="/dashboard" onClick={handleNavClick} className={navLinkClasses}>
              <span className="mr-3 text-lg">📊</span> Dashboard
            </NavLink>
            <NavLink to="/all-tasks" onClick={handleNavClick} className={navLinkClasses}>
              <span className="mr-3 text-lg">📝</span> All Tasks
            </NavLink>
            <NavLink to="/progress" onClick={handleNavClick} className={navLinkClasses}>
              <span className="mr-3 text-lg">📈</span> Progress
            </NavLink>
            <NavLink to="/calendar" onClick={handleNavClick} className={navLinkClasses}>
              <span className="mr-3 text-lg">📅</span> Calendar
            </NavLink>
            
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Collaboration</p>
            <NavLink to="/team" onClick={handleNavClick} className={navLinkClasses}>
              <span className="mr-3 text-lg">👥</span> Team
            </NavLink>

            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Categories</p>
            <NavLink to="/personal" onClick={handleNavClick} className={navLinkClasses}>
              <span className="mr-3 text-lg">👤</span> Personal
            </NavLink>
            <NavLink to="/work" onClick={handleNavClick} className={navLinkClasses}>
              <span className="mr-3 text-lg">💼</span> Work
            </NavLink>
            <NavLink to="/others" onClick={handleNavClick} className={navLinkClasses}>
              <span className="mr-3 text-lg">📦</span> Others
            </NavLink>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0 space-y-3 bg-white dark:bg-gray-900 transition-colors duration-300">
           
           {/* Dark Mode Toggle */}
           <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
           >
             <div className="flex items-center gap-2">
               <i className={`fas ${theme === 'light' ? 'fa-sun text-yellow-500' : 'fa-moon text-blue-400'}`}></i>
               <span className="text-sm font-medium">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
             </div>
             <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${theme === 'dark' ? 'left-4.5 translate-x-1' : 'left-0.5'}`}></div>
             </div>
           </button>

           <button
            className="new-assignments w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-all duration-300 font-semibold flex items-center justify-center shadow-lg shadow-blue-200 hover:shadow-blue-300 dark:shadow-none transform hover:-translate-y-0.5"
            onClick={handleNewAssignmentClick}
          >
            <span className="mr-2 text-lg font-bold">+</span> New
          </button>

          <button
            className={`w-full py-2.5 rounded-lg transition-colors duration-300 font-semibold flex items-center justify-center border ${
              user 
              ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/40' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
            }`}
            onClick={handleAuthAction}
          >
            {user ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="New Task">
        <TaskForm onSubmit={handleTaskSubmit} />
      </Modal>
    </>
  );
};

export default Sidebar;
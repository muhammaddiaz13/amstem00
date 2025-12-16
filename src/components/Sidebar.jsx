import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import Modal from './Modal.jsx';
import TaskForm from './TaskForm.jsx';
import { taskService } from '../services/taskService.js';
import { ConfirmToast } from './ConfirmToast.jsx';

const Sidebar = () => {
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
    }
  };

  const handleTaskSubmit = async (task) => {
    try {
      await taskService.create({
        ...task,
        taskStatus: 'Unfinished',
        progress: 0
      });
      // Kita reload halaman agar data terbaru muncul di dashboard
      window.location.reload(); 
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error("Failed to create task via sidebar", error);
      alert("Failed to create task. Please try again.");
    }
  };

  const handleAuthAction = () => {
    if (user) {
      // Menggunakan ConfirmToast menggantikan window.confirm
      ConfirmToast("Are you sure you want to logout from your account?", () => {
        logout();
      });
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col fixed top-0 left-0 h-screen z-30 transition-colors duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-blue-200 dark:shadow-none">A</div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">AMStem</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1 font-medium">Assignment Management System</p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-grow p-4 no-scrollbar">
          {/* User Profile Snippet */}
          <div className="flex items-center mb-8 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
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
            <NavLink to="/dashboard" className={navLinkClasses}>
              <span className="mr-3 text-lg">📊</span> Dashboard
            </NavLink>
            <NavLink to="/all-tasks" className={navLinkClasses}>
              <span className="mr-3 text-lg">📝</span> All Tasks
            </NavLink>
            <NavLink to="/progress" className={navLinkClasses}>
              <span className="mr-3 text-lg">📈</span> Progress
            </NavLink>
            <NavLink to="/calendar" className={navLinkClasses}>
              <span className="mr-3 text-lg">📅</span> Calendar
            </NavLink>
            
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Collaboration</p>
            <NavLink to="/team" className={navLinkClasses}>
              <span className="mr-3 text-lg">👥</span> Team
            </NavLink>

            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Categories</p>
            <NavLink to="/personal" className={navLinkClasses}>
              <span className="mr-3 text-lg">👤</span> Personal
            </NavLink>
            <NavLink to="/work" className={navLinkClasses}>
              <span className="mr-3 text-lg">💼</span> Work
            </NavLink>
            <NavLink to="/others" className={navLinkClasses}>
              <span className="mr-3 text-lg">📦</span> Others
            </NavLink>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0 space-y-3 bg-white dark:bg-gray-900 transition-colors duration-300">
           
           {/* Dark Mode Toggle - Integrated back into your snippet */}
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
            <span className="mr-2 text-lg font-bold">+</span> New Assignment
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
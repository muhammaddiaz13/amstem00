import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';
import TaskForm from './TaskForm';
import { ConfirmToast } from "./ConfirmToast";

const Sidebar = () => {
  const { user, logout, openLoginModal } = useAuth();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClasses = ({ isActive }) =>
    `flex items-center p-3 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  const handleNewAssignmentClick = () => {
    if (!user) {
      openLoginModal();
    } else {
      setIsTaskModalOpen(true);
    }
  };

  const handleTaskSubmit = (task) => {
    const existing = JSON.parse(localStorage.getItem('tasks') || '[]');
    const newTask = { ...task, id: Date.now(), taskStatus: 'Unfinished', progress: 0 };
    localStorage.setItem('tasks', JSON.stringify([...existing, newTask]));
    
    // Force a reload to refresh tasks
    window.location.reload(); 
    setIsTaskModalOpen(false);
  };

  const handleAuthAction = () => {
    if (user) {
        ConfirmToast(
        "Are you sure you want to logout?",
        () => logout());
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 h-screen z-30">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">AMStem</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1 font-medium">Assignment Management System</p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-grow p-4 no-scrollbar">
          {/* User Profile Snippet */}
          <div className="flex items-center mb-8 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-3 shadow-sm ${user ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
              {user ? user.username[0].toUpperCase() : '?'}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-gray-800 truncate text-sm">
                {user ? user.username : 'Anonymous'}
              </p>
              <div className="flex items-center mt-0.5">
                <span className={`w-2 h-2 rounded-full mr-1.5 ${user ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <p className="text-xs text-gray-500">{user ? 'Online' : 'Guest Mode'}</p>
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
        <div className="p-4 border-t border-gray-100 flex-shrink-0 space-y-3">
           <button
            className="new-assignments w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-all duration-300 font-semibold flex items-center justify-center shadow-lg shadow-blue-200 hover:shadow-blue-300"
            onClick={handleNewAssignmentClick}
          >
            <span className="mr-2 text-lg font-bold">+</span> New Assignment
          </button>

          <button
            className={`w-full py-2.5 rounded-lg transition-colors duration-300 font-semibold flex items-center justify-center border ${
              user 
              ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
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
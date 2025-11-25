import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';

function Sidebar({ username, onLogout }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  const navLinkClasses = ({ isActive }) =>
    `flex items-center p-3 rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-blue-200 text-blue-800 font-semibold' : 'text-gray-700 hover:bg-blue-100'
    }`;

  const handleAddTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now(), status: 'Unfinished', progress: 0 }]);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-64 bg-white shadow-lg flex flex-col fixed top-0 left-0 h-screen">
        
        {/* section atas */}
        <div className="p-5 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-2xl font-bold text-blue-700">AMStem</h1>
          <p className="text-sm text-gray-500 mt-1">Assignment Management System</p>
        </div>

        {/* isi sidebar */}
        <div className="overflow-y-auto flex-grow p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg mr-3">
              {username ? username[0].toUpperCase() : 'A'}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{username}</p>
              <p className="text-sm text-gray-500">
                <span className="text-xs text-green-500">●</span> Online
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Main</h3>
            <NavLink to="/dashboard" className={navLinkClasses}>
              <span className="mr-3 text-lg">📊</span> Dashboards
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

            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-6 mb-2">Collaboration</h3>
            <NavLink to="/team" className={navLinkClasses}>
              <span className="mr-3 text-lg">👥</span> Team
            </NavLink>
            <NavLink to="/shared-tasks" className={navLinkClasses}>
              <span className="mr-3 text-lg">🔗</span> Shared tasks
            </NavLink>

            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-6 mb-2">Category</h3>
            <NavLink to="/personal" className={navLinkClasses}>
              <span className="mr-3 text-lg">👤</span> Personal
            </NavLink>
            <NavLink to="/work" className={navLinkClasses}>
              <span className="mr-3 text-lg">💼</span> Work
            </NavLink>
            <NavLink to="/shopping" className={navLinkClasses}>
              <span className="mr-3 text-lg">🛍️</span> Shopping
            </NavLink>
          </nav>
        </div>

        {/* section bawah */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 font-semibold flex items-center justify-center"
            onClick={onLogout}
          >
            Logout
          </button>

          <button
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 font-semibold flex items-center justify-center mt-2"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="mr-2 text-xl">+</span> new assignments
          </button>

          <div className="text-center text-sm text-blue-700 font-semibold mt-3">AMStem</div>
        </div>
      </div>

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Task">
        <TaskForm onSubmit={handleAddTask} />
      </Modal>
    </>
  );
}

export default Sidebar;
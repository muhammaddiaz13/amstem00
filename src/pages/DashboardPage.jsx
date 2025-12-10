import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';

const DashboardPage = () => {
  const { user, openLoginModal } = useAuth();
  
  // FIX: Initialize state directly from localStorage to prevent overwriting with []
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Remove the useEffect that reads data, as we do it in useState now

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTaskClick = () => {
    if (!user) {
      openLoginModal();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleAddTask = (newTask) => {
    const taskWithId = {
      ...newTask,
      id: Date.now(),
      taskStatus: 'Unfinished', 
      progress: 0
    };
    setTasks([...tasks, taskWithId]);
    setIsModalOpen(false);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="p-8 md:p-12 bg-gray-50/50 min-h-full fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {greeting}, {user ? user.username : 'Guest'}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your assignments today.</p>
        </div>
        
        <button
          onClick={handleAddTaskClick}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center font-semibold"
        >
          <span className="mr-2 text-xl leading-none">+</span> New Assignment
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80 bg-white rounded-2xl shadow-sm border border-gray-100 mt-8 text-center p-6">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-3xl">
            📝
          </div>
          <h3 className="text-xl font-bold text-gray-800">No Assignments Yet</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto mb-6">
            You're all caught up! or maybe you haven't added any tasks yet.
          </p>
          <button onClick={handleAddTaskClick} className="text-blue-600 font-semibold hover:underline">
            Create your first assignment
          </button>
        </div>
      ) : (
        <>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onUpdate={handleUpdateTask} 
                onDelete={handleDeleteTask} 
              />
            ))}
          </div>
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Assignment">
        <TaskForm onSubmit={handleAddTask} />
      </Modal>
    </div>
  );
};

export default DashboardPage;
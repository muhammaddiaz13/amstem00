import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import TaskCard from '../components/TaskCard.jsx';
import Modal from '../components/Modal.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { taskService } from '../services/taskService.js';
import { Toaster, toast } from 'react-hot-toast';

const DashboardPage = () => {
  const { user, openLoginModal } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tasks dari API saat komponen dimuat atau user berubah
  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTaskClick = () => {
    if (!user) {
      openLoginModal();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleAddTask = async (newTask) => {
    const toastId = toast.loading("Creating assignment...");
    try {
      const createdTask = await taskService.create({
        ...newTask,
        taskStatus: 'Unfinished',
        progress: 0
      });
      setTasks([...tasks, createdTask]);
      setIsModalOpen(false);
      toast.success("Assignment created successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to create task", error);
      toast.error("Failed to create assignment.", { id: toastId });
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const result = await taskService.update(updatedTask.id, updatedTask);
      setTasks(tasks.map(t => t.id === updatedTask.id ? result : t));
      toast.success("Assignment updated!");
    } catch (error) {
      console.error("Failed to update task", error);
      toast.error("Failed to update assignment.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    const toastId = toast.loading("Deleting...");
    try {
      await taskService.delete(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success("Assignment deleted successfully", { id: toastId });
    } catch (error) {
      console.error("Failed to delete task", error);
      toast.error("Failed to delete assignment", { id: toastId });
    }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="p-8 md:p-12 bg-gray-50/50 dark:bg-gray-900 min-h-full fade-in transition-colors duration-300">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {greeting}, {user ? user.username : 'Guest'}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your assignments today.</p>
        </div>
        
        <button
          onClick={handleAddTaskClick}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center font-semibold transform hover:-translate-y-0.5"
        >
          <span className="mr-2 text-xl leading-none">+</span> New Assignment
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
          <i className="fas fa-circle-notch fa-spin text-3xl mb-3 text-blue-500"></i>
          <p>Loading assignments...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mt-8 text-center p-6 animate-[fadeIn_0.5s_ease-out] transition-colors duration-300">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 text-3xl">
            📝
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">No Assignments Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto mb-6">
            You're all caught up! or maybe you haven't added any tasks yet.
          </p>
          <button onClick={handleAddTaskClick} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Create your first assignment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fadeIn_0.3s_ease-out]">
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onUpdate={handleUpdateTask} 
                onDelete={handleDeleteTask} 
              />
            ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Assignment">
        <TaskForm onSubmit={handleAddTask} />
      </Modal>
    </div>
  );
};

export default DashboardPage;
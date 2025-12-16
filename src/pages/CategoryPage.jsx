import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import TaskCard from '../components/TaskCard.jsx';
import Modal from '../components/Modal.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { taskService } from '../services/taskService.js';
import { Toaster, toast } from 'react-hot-toast';

const CategoryPage = ({ category }) => {
  const { user, openLoginModal } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) fetchTasks();
    else setTasks([]);
  }, [user, category]); 

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
    if (!user) openLoginModal();
    else setIsModalOpen(true);
  };

  const handleAddTask = async (newTask) => {
    const toastId = toast.loading("Creating task...");
    try {
      const createdTask = await taskService.create({
        ...newTask,
        taskStatus: 'Unfinished', 
        progress: 0,
        taskCategory: category 
      });
      setTasks([...tasks, createdTask]);
      setIsModalOpen(false);
      toast.success("Task created successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to create task", error);
      toast.error("Failed to create task", { id: toastId });
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const result = await taskService.update(updatedTask.id, updatedTask);
      setTasks(tasks.map(t => t.id === updatedTask.id ? result : t));
      toast.success("Task updated!");
    } catch (error) {
      console.error("Failed to update task", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    const toastId = toast.loading("Deleting...");
    try {
      await taskService.delete(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success("Task deleted!", { id: toastId });
    } catch (error) {
      console.error("Failed to delete task", error);
      toast.error("Failed to delete task", { id: toastId });
    }
  };

  // Filter logic
  const filteredTasks = tasks.filter(task => {
    const matchesCategory = task.taskCategory === category;
    const matchesSearch = task.taskTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.taskStatus === statusFilter;
    
    return matchesCategory && matchesSearch && matchesStatus;
  });

  // Dynamic Theme
  const getTheme = () => {
    switch(category) {
      case 'Work': return { 
        // Dark Black for Work (Previous Request)
        bg: 'bg-gray-50 dark:bg-black', 
        accent: 'text-gray-800 dark:text-gray-200', 
        btn: 'bg-gray-900 hover:bg-black dark:bg-gray-800 dark:hover:bg-gray-700', 
        icon: '💼',
        desc: 'Professional commitments and projects'
      };
      case 'Others': return { 
        // Indigo/Deep Purple for Others (Harmonizes with Blue)
        bg: 'bg-indigo-50 dark:bg-indigo-950', 
        accent: 'text-indigo-700 dark:text-indigo-200', 
        btn: 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500', 
        icon: '📦',
        desc: 'Miscellaneous tasks and shopping lists'
      };
      default: return { 
        // Standard Blue for Personal/Default
        bg: 'bg-blue-50 dark:bg-gray-900', 
        accent: 'text-blue-700 dark:text-blue-200', 
        btn: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500', 
        icon: '👤',
        desc: 'Personal goals and daily errands'
      };
    }
  };

  const theme = getTheme();

  return (
    <div className={`p-8 md:p-12 min-h-full ${theme.bg} transition-colors duration-300`}>
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{theme.icon}</span>
                <h1 className={`text-3xl font-bold ${theme.accent}`}>{category}</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{theme.desc}</p>
        </div>
        
        <button 
            onClick={handleAddTaskClick} 
            className={`${theme.btn} text-white px-6 py-3 rounded-xl shadow-lg shadow-gray-200 dark:shadow-none transition-all transform hover:-translate-y-1 font-semibold flex items-center gap-2`}
        >
          <span className="text-xl">+</span> Add {category} Task
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-center transition-colors duration-300">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder={`Search ${category} tasks...`}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
        </div>
        
        <select 
            className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
            onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Unfinished">Unfinished</option>
          <option value="In Progress">In Progress</option>
          <option value="Finished">Finished</option>
        </select>
      </div>

      {/* Tasks Grid */}
      {isLoading ? <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                <TaskCard 
                    key={task.id} 
                    task={task} 
                    onUpdate={handleUpdateTask} 
                    onDelete={handleDeleteTask} 
                />
                ))
            ) : (
                <div className="col-span-full py-16 text-center bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="text-6xl mb-4 opacity-50">{theme.icon}</div>
                    <h3 className="text-xl font-bold text-gray-400">No {category} tasks found</h3>
                    <p className="text-gray-400 mt-2">Start by adding a new assignment above!</p>
                </div>
            )}
        </div>
      )}

      {/* Modal with Pre-filled Category */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`New ${category} Assignment`}>
        <TaskForm 
            onSubmit={handleAddTask} 
            initialData={{ taskCategory: category }} 
        />
      </Modal>
    </div>
  );
};

export default CategoryPage;
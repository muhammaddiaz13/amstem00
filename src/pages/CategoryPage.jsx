import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import TaskCard from '../components/TaskCard.jsx';
import Modal from '../components/Modal.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { taskService } from '../services/taskService.js';
import { Toaster } from 'react-hot-toast';

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
  }, [user, category]); // Re-fetch if user or category changes

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTaskClick = () => {
    if (!user) openLoginModal();
    else setIsModalOpen(true);
  };

  const handleAddTask = async (newTask) => {
    try {
      const createdTask = await taskService.create({
        ...newTask,
        taskStatus: 'Unfinished', 
        progress: 0,
        taskCategory: category 
      });
      setTasks([...tasks, createdTask]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const result = await taskService.update(updatedTask.id, updatedTask);
      setTasks(tasks.map(t => t.id === updatedTask.id ? result : t));
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task", error);
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
        bg: 'bg-slate-50', 
        accent: 'text-slate-700', 
        btn: 'bg-slate-700 hover:bg-slate-800', 
        icon: '💼',
        desc: 'Professional commitments and projects'
      };
      case 'Others': return { 
        bg: 'bg-orange-50', 
        accent: 'text-orange-700', 
        btn: 'bg-orange-600 hover:bg-orange-700', 
        icon: '📦',
        desc: 'Miscellaneous tasks and shopping lists'
      };
      default: return { 
        bg: 'bg-blue-50', 
        accent: 'text-blue-700', 
        btn: 'bg-blue-600 hover:bg-blue-700', 
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
            <p className="text-gray-500 font-medium">{theme.desc}</p>
        </div>
        
        <button 
            onClick={handleAddTaskClick} 
            className={`${theme.btn} text-white px-6 py-3 rounded-xl shadow-lg shadow-gray-200 transition-all transform hover:-translate-y-1 font-semibold flex items-center gap-2`}
        >
          <span className="text-xl">+</span> Add {category} Task
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder={`Search ${category} tasks...`}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
        </div>
        
        <select 
            className="px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
            onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Unfinished">Unfinished</option>
          <option value="In Progress">In Progress</option>
          <option value="Finished">Finished</option>
        </select>
      </div>

      {/* Tasks Grid */}
      {isLoading ? <div className="text-center">Loading...</div> : (
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
                <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-gray-200">
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
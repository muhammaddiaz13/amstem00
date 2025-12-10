import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';

const CategoryPage = ({ category }) => {
  const { user, openLoginModal } = useAuth();
  
  // Load tasks from localStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTaskClick = () => {
    if (!user) openLoginModal();
    else setIsModalOpen(true);
  };

  const handleAddTask = (newTask) => {
    const taskWithId = {
      ...newTask,
      id: Date.now(),
      taskStatus: 'Unfinished', 
      progress: 0,
      // Ensure the category is forced to the current page category if not set
      taskCategory: category 
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

  // Filter logic: Match category prop AND search term AND status filter
  const filteredTasks = tasks.filter(task => {
    const matchesCategory = task.taskCategory === category;
    const matchesSearch = task.taskTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.taskStatus === statusFilter;
    
    return matchesCategory && matchesSearch && matchesStatus;
  });

  // Dynamic Theme based on Category
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
      }; // Personal
    }
  };

  const theme = getTheme();

  return (
    <div className={`p-8 md:p-12 min-h-full ${theme.bg} transition-colors duration-300`}>
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

      {/* Modal with Pre-filled Category */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`New ${category} Assignment`}>
        <TaskForm 
            onSubmit={handleAddTask} 
            initialData={{ taskCategory: category }} // Auto-select category
        />
      </Modal>
    </div>
  );
};

export default CategoryPage;
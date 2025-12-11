import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import { taskService } from '../services/taskService';

const AllTasksPage = () => {
  const { user, openLoginModal } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

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
        progress: 0
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

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.taskTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || task.taskCategory === categoryFilter;
    const matchesStatus = statusFilter === 'All' || task.taskStatus === statusFilter;
    return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-8 md:p-12 bg-gray-50/50 min-h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
        <button onClick={handleAddTaskClick} className="bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-all font-medium flex items-center gap-2">
          <i className="fas fa-plus"></i> Add New
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search assignments..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-3 text-gray-400">🔍</span>
        </div>
        
        <select className="px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm" onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select className="px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm" onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Unfinished">Unfinished</option>
          <option value="In Progress">In Progress</option>
          <option value="Finished">Finished</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <i className="fas fa-circle-notch fa-spin text-3xl mb-3 text-blue-500"></i>
          <p>Loading tasks...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
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
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
              <i className="far fa-folder-open text-3xl mb-3 text-gray-300"></i>
              <p>No tasks match your filters.</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Task">
        <TaskForm onSubmit={handleAddTask} />
      </Modal>
    </div>
  );
};

export default AllTasksPage;
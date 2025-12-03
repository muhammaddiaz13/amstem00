import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';

function AllTasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('Unfinished');
  const [sortOrder, setSortOrder] = useState('The Latest');

  // Load tasks dari localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  // Save tasks ke localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Filter dan sort tasks
  const filteredTasks = tasks
    .filter(task => {
      // Filter berdasarkan search
      const matchesSearch = 
        task.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.taskDescription.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter berdasarkan priority
      const matchesPriority = 
        priorityFilter === 'All Priorities' || 
        task.priority === priorityFilter;
      
      // Filter berdasarkan category
      const matchesCategory = 
        categoryFilter === 'All Categories' || 
        task.category === categoryFilter;
      
      // Filter berdasarkan status
      const matchesStatus = 
        statusFilter === 'Unfinished' ? task.status === 'Unfinished' : 
        statusFilter === 'Finished' ? task.status === 'Finished' : true;
      
      return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      // Sort berdasarkan tanggal (asumsi ada field createdAt)
      if (sortOrder === 'The Latest') {
        return new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id);
      } else {
        return new Date(a.createdAt || a.id) - new Date(b.createdAt || b.id);
      }
    });

  const handleAddTask = (newTask) => {
    const taskWithId = { 
      ...newTask, 
      id: Date.now(), 
      status: 'Unfinished', 
      progress: 0,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, taskWithId]);
    setIsModalOpen(false);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Tasks</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center"
        >
          <span className="mr-2 text-xl">+</span> new assignments
        </button>
      </div>

      {/* Filter dan Sorting Options */}
      <div className="flex gap-4 mb-6">
        <select className="p-2 border rounded-md">
          <option>All Priorities</option>
          <option>High to Low</option>
          <option>Low to High</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select className="p-2 border rounded-md">
          <option>All Categories</option>
          <option>Personal</option>
          <option>Work</option>
          <option>Shopping</option>
        </select>
        <select className="p-2 border rounded-md">
          <option>Unfinished</option>
          <option>Finished</option>
        </select>
        <select className="p-2 border rounded-md">
          <option>The Latest</option>
          <option>The Oldest</option>
        </select>
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full p-3 pl-10 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>

        {/* Filter Options */}
        <div className="flex flex-wrap gap-4">
          <select 
            className="p-2 border rounded-md bg-white"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option>All Priorities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          
          <select 
            className="p-2 border rounded-md bg-white"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option>All Categories</option>
            <option>Personal</option>
            <option>Work</option>
            <option>Shopping</option>
          </select>
          
          <select 
            className="p-2 border rounded-md bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>Unfinished</option>
            <option>Finished</option>
          </select>
          
          <select 
            className="p-2 border rounded-md bg-white"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option>The Latest</option>
            <option>The Oldest</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md">
          <p className="text-xl text-gray-600 font-medium">No tasks found.</p>
          <p className="text-md text-gray-500 mt-2">Add new tasks to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Task">
        <TaskForm onSubmit={handleAddTask} />
      </Modal>
    </div>
  );
}

export default AllTasksPage;
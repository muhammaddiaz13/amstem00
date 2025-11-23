import React, { useState } from 'react';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';

function AllTasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]); // State untuk menyimpan daftar tugas

  const handleAddTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now(), status: 'Unfinished', progress: 0 }]);
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
            placeholder="search"
            className="w-full p-2 pl-10 border rounded-md"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>


      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md mt-4">
          <p className="text-xl text-gray-600 font-medium">No tasks found yet.</p>
          <p className="text-md text-gray-500 mt-2">Add new tasks to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-4">
            {tasks.map(task => (
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
import React, { useState } from 'react';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';

function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

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
        <h1 className="text-3xl font-bold text-gray-800">Task Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center"
        >
          <span className="mr-2 text-xl">+</span> new assignments
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-md mt-8">
          <p className="text-xl text-gray-600 font-medium">There are no assignments yet :)</p>
          <p className="text-md text-gray-500 mt-2">Start by adding a new task!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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

export default DashboardPage;
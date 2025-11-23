import React, { useState } from 'react';
import Modal from './Modal';
import TaskForm from './TaskForm';

function TaskCard({ task, onUpdate, onDelete }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'Finished':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-yellow-500';
      default: // Unfinished
        return 'bg-blue-500';
    }
  };

  const handleEditSubmit = (updatedFields) => {
    const updatedTask = { ...task, ...updatedFields };
    onUpdate(updatedTask);
    setIsEditModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{task.taskTitle}</h3>
          <p className="text-gray-600 text-sm">{task.taskDescription}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
            title="Edit Task"
          >
            ✏️
          </button>
          <button
            onClick={() => { if (window.confirm('Are you sure you want to delete this task?')) onDelete(task.id); }}
            className="text-gray-500 hover:text-red-600 transition-colors duration-200"
            title="Delete Task"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <span className={`w-3 h-3 rounded-full mr-2 ${getPriorityColor(task.priority)}`}></span>
          <span>Prioritas: {task.priority}</span>
        </div>
        <p className="text-sm text-gray-600 mb-1">Kategori: {task.taskCategory}</p>
        <p className="text-sm text-gray-600 mb-1">Batas Waktu: {task.dueDate}</p>
        <p className="text-sm text-gray-600 mb-1">Status: {task.taskStatus}</p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
        <div
          className={`${getProgressColor(task.taskStatus)} h-2.5 rounded-full`}
          style={{ width: task.taskStatus === 'Finished' ? '100%' : (task.taskStatus === 'In Progress' ? '50%' : '10%') }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 text-right mt-1">
        {task.taskStatus === 'Finished' ? '100% Completed' : (task.taskStatus === 'In Progress' ? '50% In Progress' : '0% Progress')}
      </p>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Task">
        <TaskForm onSubmit={handleEditSubmit} initialData={task} />
      </Modal>
    </div>
  );
}

export default TaskCard;
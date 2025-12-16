import React, { useState } from 'react';
import Modal from './Modal';
import TaskForm from './TaskForm';
import { useAuth } from '../contexts/AuthContext';
import { ConfirmToast } from "./ConfirmToast";

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user, openLoginModal } = useAuth();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'Finished': return 'bg-green-500';
      case 'In Progress': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Mencegah event bubbling
    if (!user) {
      openLoginModal();
    } else {
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Mencegah event bubbling agar tidak mengklik card
    if (!user) {
      openLoginModal();
    } else {
      // Panggil ConfirmToast sebelum menjalankan onDelete
      ConfirmToast(
        `Are you sure you want to delete "${task.taskTitle}"?`,
        () => onDelete(task.id)
      );
    }
  };

  const handleEditSubmit = (updatedFields) => {
    onUpdate({ ...task, ...updatedFields });
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100 relative group h-full flex flex-col">
        <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${getPriorityColor(task.priority)}`}></div>
        
        <div className="flex justify-between items-start mb-3 pl-3">
          <div className="flex-1 pr-2">
            <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">{task.taskTitle}</h3>
            <p className="text-gray-500 text-xs line-clamp-2 min-h-[2.5em]">{task.taskDescription || "No description provided."}</p>
          </div>
          {/* Tombol Aksi */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleEditClick} 
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" 
              title="Edit"
            >
              ✏️
            </button>
            <button 
              onClick={handleDeleteClick} 
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" 
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="pl-3 mt-auto space-y-2">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">
               {task.taskCategory}
            </span>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md font-medium flex items-center">
               ⏰ {task.dueDate}
            </span>
          </div>
        </div>

        <div className="pl-3 mt-5">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5 font-medium">
            <span>{task.taskStatus}</span>
            <span>{task.taskStatus === 'Finished' ? '100%' : (task.taskStatus === 'In Progress' ? '50%' : '0%')}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`${getProgressColor(task.taskStatus)} h-2 rounded-full transition-all duration-500`}
              style={{ width: task.taskStatus === 'Finished' ? '100%' : (task.taskStatus === 'In Progress' ? '50%' : '5%') }}
            ></div>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Task">
        <TaskForm onSubmit={handleEditSubmit} initialData={task} />
      </Modal>
    </>
  );
};

export default TaskCard;
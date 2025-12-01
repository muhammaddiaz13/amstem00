import React, { useState } from 'react';

function TaskForm({ onSubmit, initialData = {} }) {
  const [taskTitle, setTaskTitle] = useState(initialData.taskTitle || '');
  const [taskDescription, setTaskDescription] = useState(initialData.taskDescription || '');
  const [taskCategory, setTaskCategory] = useState(initialData.taskCategory || '');
  const [taskStatus, setTaskStatus] = useState(initialData.taskStatus || 'Unfinished');
  const [dueDate, setDueDate] = useState(initialData.dueDate || '');
  const [priority, setPriority] = useState(initialData.priority || 'Medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle || !taskCategory || !dueDate) {
      alert('Judul, Kategori, dan Batas Waktu harus diisi!');
      return;
    }
    onSubmit({ 
      taskTitle, 
      taskDescription, 
      taskCategory, 
      taskStatus, 
      dueDate, 
      priority,
      // Tambahkan field yang dibutuhkan calendar
      title: taskTitle, 
      description: taskDescription, 
      category: taskCategory, 
      status: taskStatus, 
      dueDate: dueDate 
    });
    if (!initialData.id) { // Reset form jika ini untuk menambah tugas baru
        setTaskTitle('');
        setTaskDescription('');
        setTaskCategory('');
        setTaskStatus('Unfinished');
        setDueDate('');
        setPriority('Medium');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">
          Task title
        </label>
        <input
          type="text"
          id="taskTitle"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          placeholder="Enter the assignment title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">
          Task description
        </label>
        <textarea
          id="taskDescription"
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          placeholder="Enter a Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        ></textarea>
      </div>

      <div>
        <label htmlFor="taskCategory" className="block text-sm font-medium text-gray-700 mb-1">
          Task Category
        </label>
        <select
          id="taskCategory"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          value={taskCategory}
          onChange={(e) => setTaskCategory(e.target.value)}
          required
        >
          <option value="">-- Select Category --</option>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          id="priority"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700 mb-1">
          Task Status
        </label>
        <select
          id="taskStatus"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
        >
          <option value="Unfinished">Unfinished</option>
          <option value="In Progress">In Progress</option>
          <option value="Finished">Finished</option>
        </select>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
          Due date
        </label>
        <input
          type="date"
          id="dueDate"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-300 font-semibold"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 font-semibold"
        >
          Finished
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
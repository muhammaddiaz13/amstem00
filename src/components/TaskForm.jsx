import React, { useState } from 'react';

const TaskForm = ({ onSubmit, initialData = {} }) => {
  const [taskTitle, setTaskTitle] = useState(initialData.taskTitle || '');
  const [taskDescription, setTaskDescription] = useState(initialData.taskDescription || '');
  const [taskCategory, setTaskCategory] = useState(initialData.taskCategory || '');
  const [taskStatus, setTaskStatus] = useState(initialData.taskStatus || 'Unfinished');
  const [dueDate, setDueDate] = useState(initialData.dueDate || '');
  const [priority, setPriority] = useState(initialData.priority || 'Medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle || !taskCategory || !dueDate) {
      alert('Title, Category, and Due Date are required!');
      return;
    }

    onSubmit({
      taskTitle,
      taskDescription,
      taskCategory,
      taskStatus,
      dueDate,
      priority,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Row 1: Title & Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8">
          <label htmlFor="taskTitle" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Assignment Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="taskTitle"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all text-sm"
            placeholder="e.g. Calculus Homework"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="md:col-span-4">
          <label htmlFor="dueDate" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dueDate"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all text-sm"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Row 2: Selects (Category, Priority, Status) */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label htmlFor="taskCategory" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="taskCategory"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all appearance-none text-sm"
            value={taskCategory}
            onChange={(e) => setTaskCategory(e.target.value)}
            required
          >
            <option value="">Select...</option>
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select
            id="priority"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all appearance-none text-sm"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="taskStatus" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            id="taskStatus"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all appearance-none text-sm"
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
          >
            <option value="Unfinished">Unfinished</option>
            <option value="In Progress">In Progress</option>
            <option value="Finished">Finished</option>
          </select>
        </div>
      </div>

      {/* Row 3: Description */}
      <div>
        <label htmlFor="taskDescription" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="taskDescription"
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all resize-none text-sm"
          placeholder="Add details..."
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold shadow-md text-sm"
        >
          {initialData.id ? 'Save Changes' : 'Create Assignment'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
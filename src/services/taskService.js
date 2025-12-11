import api from './api.js';

// Helper: Ubah format dari Backend (snake_case) ke Frontend (camelCase)
const transformToFrontend = (task) => ({
  id: task.id,
  taskTitle: task.title,
  taskDescription: task.description || '',
  taskCategory: task.category,
  taskStatus: task.status,
  priority: task.priority,
  dueDate: task.due_date ? task.due_date.split('T')[0] : '',
  progress: task.status === 'Finished' ? 100 : (task.status === 'In Progress' ? 50 : 0),
  createdAt: task.created_at
});

// Helper: Ubah format dari Frontend ke Backend
const transformToBackend = (task) => ({
  title: task.taskTitle,
  description: task.taskDescription,
  category: task.taskCategory,
  priority: task.priority,
  status: task.taskStatus,
  due_date: task.dueDate
});

export const taskService = {
  getAll: async () => {
    const response = await api.get('/tasks');
    return response.data.map(transformToFrontend);
  },

  create: async (taskData) => {
    const payload = transformToBackend(taskData);
    const response = await api.post('/tasks', payload);
    return transformToFrontend(response.data);
  },

  update: async (id, taskData) => {
    const payload = transformToBackend(taskData);
    const response = await api.put(`/tasks/${id}`, payload);
    return transformToFrontend(response.data);
  },

  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};
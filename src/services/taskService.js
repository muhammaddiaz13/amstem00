// Helper untuk mendapatkan URL API yang dinamis
const getApiUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }
  return ''; 
};

// Helper untuk mendapatkan Header dengan Token terbaru dari LocalStorage
const getAuthHeaders = () => {
  const userStr = localStorage.getItem('user');
  let token = null;
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      token = user.token;
    } catch (e) {
      console.error("Error parsing user from local storage", e);
    }
  }

  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// --- TRANSFORMERS (Sesuai kodingan sebelumnya) ---

// Mengubah format dari Backend (snake_case/db) ke Frontend (camelCase)
const transformToFrontend = (task) => ({
  id: task.id,
  // Handle kedua kemungkinan key agar aman
  taskTitle: task.title || task.taskTitle,
  taskDescription: task.description || task.taskDescription || '',
  taskCategory: task.category || task.taskCategory,
  taskStatus: task.status || task.taskStatus,
  priority: task.priority,
  // Pastikan format tanggal YYYY-MM-DD
  dueDate: (task.due_date || task.dueDate || '').split('T')[0],
  // Hitung progress otomatis berdasarkan status
  progress: (task.status === 'Finished' || task.taskStatus === 'Finished') ? 100 : 
            ((task.status === 'In Progress' || task.taskStatus === 'In Progress') ? 50 : 0),
  createdAt: task.created_at || task.createdAt
});

// Mengubah format dari Frontend ke Backend (untuk Create/Update)
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
    const baseUrl = getApiUrl().replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/api/tasks`, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
        // Tambahan header anti-cache agar data akun lama tidak nyangkut
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch tasks');
    const data = await response.json();
    // Transform data dari backend ke format frontend
    return data.map(transformToFrontend);
  },

  create: async (taskData) => {
    const baseUrl = getApiUrl().replace(/\/$/, '');
    // Transform data ke format backend sebelum dikirim
    const payload = transformToBackend(taskData);
    
    const response = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to create task');
    const data = await response.json();
    return transformToFrontend(data);
  },

  update: async (id, taskData) => {
    const baseUrl = getApiUrl().replace(/\/$/, '');
    const payload = transformToBackend(taskData);
    
    const response = await fetch(`${baseUrl}/api/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to update task');
    const data = await response.json();
    return transformToFrontend(data);
  },

  delete: async (id) => {
    const baseUrl = getApiUrl().replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to delete task');
    return await response.json();
  }
};
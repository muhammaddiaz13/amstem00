import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Calendar from '../components/Calendar';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import { taskService } from '../services/taskService';

const CalendarPage = () => {
  const { user, openLoginModal } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) fetchTasks();
    else setTasks([]);
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

  // Navigation Logic
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // CRUD & Interaction Logic
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

  const handleDeleteTask = async (taskId) => {
    if(window.confirm("Are you sure you want to delete this task?")){
       try {
         await taskService.delete(taskId);
         setTasks(tasks.filter(t => t.id !== taskId));
       } catch (error) {
         console.error("Failed to delete", error);
       }
    }
  };

  const toggleTaskStatus = async (task, isChecked) => {
      const newStatus = isChecked ? 'Finished' : 'Unfinished';
      try {
        const updated = await taskService.update(task.id, {
            ...task,
            taskStatus: newStatus,
            progress: isChecked ? 100 : 0
        });
        setTasks(tasks.map(t => t.id === task.id ? updated : t));
      } catch (error) {
        console.error("Failed to toggle status", error);
      }
  };

  // Helper untuk mengubah Date object menjadi string 'YYYY-MM-DD' berdasarkan waktu lokal
  // Ini mencegah bug di mana toISOString() mengembalikan tanggal kemarin karena zona waktu UTC
  const toLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filtering
  const getTasksForDate = (date) => {
    const dateString = toLocalDateString(date);
    return tasks.filter(task => task.dueDate === dateString);
  };

  const selectedTasks = getTasksForDate(selectedDate);

  const getPriorityColor = (priority) => {
    switch(priority) {
        case 'High': return 'border-l-4 border-red-500 bg-red-50/50';
        case 'Medium': return 'border-l-4 border-yellow-500 bg-yellow-50/50';
        case 'Low': return 'border-l-4 border-green-500 bg-green-50/50';
        default: return 'border-l-4 border-gray-300 bg-gray-50';
    }
  };

  const getCategoryIcon = (category) => {
      switch(category) {
          case 'Work': return 'fa-briefcase';
          case 'Personal': return 'fa-home';
          case 'Others': return 'fa-layer-group';
          default: return 'fa-tasks';
      }
  };

  return (
    <div className="p-8 md:p-12 bg-gray-50/50 min-h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Task Calendar</h1>
        <button 
          onClick={() => {
            const now = new Date();
            setSelectedDate(now);
            setCurrentDate(now);
          }}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          Jump to Today
        </button>
      </div>

      <Calendar 
        currentDate={currentDate}
        selectedDate={selectedDate}
        tasks={tasks}
        onDateClick={handleDateClick}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
                Tasks for {selectedDate.toDateString()}
            </h3>
            <button 
                onClick={() => {
                    if(!user) openLoginModal();
                    else setIsModalOpen(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-200 text-sm font-semibold flex items-center gap-2"
            >
                <i className="fas fa-plus"></i> Add Task
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <i className="fas fa-circle-notch fa-spin text-2xl mb-2 text-blue-500"></i>
              <p>Loading...</p>
            </div>
          ) : selectedTasks.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center animate-[fadeIn_0.3s_ease-out]">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-calendar-check text-2xl text-gray-400"></i>
                  </div>
                  <p className="text-gray-500 font-medium">No tasks scheduled for this day.</p>
                  <p className="text-sm text-gray-400 mt-1">Enjoy your free time!</p>
              </div>
          ) : (
              <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                  {selectedTasks.map(task => {
                      const isCompleted = task.taskStatus === 'Finished';
                      
                      return (
                        <div 
                          key={task.id} 
                          className={`bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 transition-all hover:shadow-md ${getPriorityColor(task.priority)}`}
                        >
                            {/* Checkbox Action */}
                            <div className="flex-shrink-0">
                                <input 
                                    type="checkbox" 
                                    checked={isCompleted}
                                    onChange={(e) => {
                                        if(!user) openLoginModal();
                                        else toggleTaskStatus(task, e.target.checked);
                                    }}
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-grow min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className={`font-semibold text-gray-800 truncate ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                                        {task.taskTitle}
                                    </h4>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                        task.priority === 'High' ? 'bg-red-100 text-red-700' :
                                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                        {task.priority}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 truncate mb-2">
                                    {task.taskDescription || "No description"}
                                </p>
                                
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <i className={`fas ${getCategoryIcon(task.taskCategory)}`}></i>
                                        {task.taskCategory}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <i className="far fa-clock"></i>
                                        {task.taskStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Delete Action */}
                            <button 
                                onClick={() => {
                                    if(!user) openLoginModal();
                                    else handleDeleteTask(task.id);
                                }}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        </div>
                      );
                  })}
              </div>
          )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Assignment">
        <TaskForm 
            onSubmit={handleAddTask} 
            initialData={{ dueDate: toLocalDateString(selectedDate) }} 
        />
      </Modal>
    </div>
  );
};

export default CalendarPage;
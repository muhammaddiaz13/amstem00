import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Calendar from '../components/Calendar'; 
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import { taskService } from '../services/taskService.js';

const CalendarPage = () => {
  const { user, openLoginModal } = useAuth();
  
  // Initialize tasks as an empty array
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Helper konsisten untuk format tanggal YYYY-MM-DD
  const formatDateForApi = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // FETCH TASKS FROM API
  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks for calendar", error);
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

  // CRUD & Interaction Logic via API
  const handleAddTask = async (newTask) => {
    try {
      // Create via API
      const createdTask = await taskService.create({
        ...newTask,
        taskStatus: 'Unfinished',
        progress: 0
      });
      // Update local state
      setTasks([...tasks, createdTask]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create task", error);
      alert("Failed to save task. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if(window.confirm("Are you sure you want to delete this task?")){
       try {
         await taskService.delete(taskId);
         setTasks(tasks.filter(t => t.id !== taskId));
       } catch (error) {
         console.error("Failed to delete task", error);
         alert("Failed to delete task.");
       }
    }
  };

  // Logic baru dari team: Toggle Status via Checkbox (Updated with API)
  const toggleTaskStatus = async (taskId, isChecked) => {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if(!taskToUpdate) return;

      const updatedFields = {
          ...taskToUpdate,
          taskStatus: isChecked ? 'Finished' : 'Unfinished',
          progress: isChecked ? 100 : 0
      };

      // Optimistic update
      setTasks(tasks.map(t => {
          if (t.id === taskId) {
              return updatedFields;
          }
          return t;
      }));

      try {
          await taskService.update(taskId, updatedFields);
      } catch (error) {
          console.error("Failed to update status", error);
          // Revert if failed
          fetchTasks();
      }
  };

  // Filtering
  const getTasksForDate = (date) => {
    const dateString = formatDateForApi(date);
    return tasks.filter(task => task.dueDate === dateString);
  };

  const selectedTasks = getTasksForDate(selectedDate);

  // Helper styles based on update
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
            const today = new Date();
            setSelectedDate(today);
            setCurrentDate(today);
          }}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          Jump to Today
        </button>
      </div>

      {/* Menggunakan Komponen Calendar yang baru dipisah */}
      {isLoading ? (
        <div className="flex justify-center py-10">
           <i className="fas fa-circle-notch fa-spin text-3xl text-blue-500"></i>
        </div>
      ) : (
        <Calendar 
            currentDate={currentDate}
            selectedDate={selectedDate}
            tasks={tasks}
            onDateClick={handleDateClick}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
        />
      )}

      {/* Task List Section - Updated Style from Team */}
      <div className="mt-8 animate-[fadeIn_0.3s_ease-out]">
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

          {selectedTasks.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-calendar-check text-2xl text-gray-400"></i>
                  </div>
                  <p className="text-gray-500 font-medium">No tasks scheduled for this day.</p>
                  <p className="text-sm text-gray-400 mt-1">Enjoy your free time!</p>
              </div>
          ) : (
              <div className="space-y-4">
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
                                        else toggleTaskStatus(task.id, e.target.checked);
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
            // Format date YYYY-MM-DD for the form initial value using the consistent helper
            initialData={{ 
                dueDate: formatDateForApi(selectedDate)
            }} 
        />
      </Modal>
    </div>
  );
};

export default CalendarPage;
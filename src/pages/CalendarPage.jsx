import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Calendar from '../components/Calendar'; // Import komponen baru
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';

const CalendarPage = () => {
  const { user, openLoginModal } = useAuth();
  
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

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
  const handleAddTask = (newTask) => {
    const taskWithId = {
      ...newTask,
      id: Date.now(),
      taskStatus: 'Unfinished',
      progress: 0
    };
    setTasks([...tasks, taskWithId]);
    setIsModalOpen(false);
  };

  const handleDeleteTask = (taskId) => {
    if(window.confirm("Are you sure you want to delete this task?")){
       setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  // Logic baru dari team: Toggle Status via Checkbox
  const toggleTaskStatus = (taskId, isChecked) => {
      setTasks(tasks.map(t => {
          if (t.id === taskId) {
              return { 
                  ...t, 
                  taskStatus: isChecked ? 'Finished' : 'Unfinished',
                  progress: isChecked ? 100 : 0
              };
          }
          return t;
      }));
  };

  // Filtering
  const getTasksForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
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
            setSelectedDate(new Date());
            setCurrentDate(new Date());
          }}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          Jump to Today
        </button>
      </div>

      {/* Menggunakan Komponen Calendar yang baru dipisah */}
      <Calendar 
        currentDate={currentDate}
        selectedDate={selectedDate}
        tasks={tasks}
        onDateClick={handleDateClick}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      {/* Task List Section - Updated Style from Team */}
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
            initialData={{ dueDate: selectedDate.toISOString().split('T')[0] }} 
        />
      </Modal>
    </div>
  );
};

export default CalendarPage;
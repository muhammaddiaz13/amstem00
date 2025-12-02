import React, { useState, useEffect } from 'react';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Get calendar data untuk bulan dan tahun saat ini
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();

  const previousMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = prev === 0 ? 11 : prev - 1;
      const newYear = prev === 0 ? currentYear - 1 : currentYear;
      setCurrentYear(newYear);
      return newMonth;
    });
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = prev === 11 ? 0 : prev + 1;
      const newYear = prev === 11 ? currentYear + 1 : currentYear;
      setCurrentYear(newYear);
      return newMonth;
    });
  };

  const getTasksForDate = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => task.dueDate === dateStr);
  };

  const isToday = (day) => {
    return day === today.getDate() && 
           currentMonth === today.getMonth() && 
           currentYear === today.getFullYear();
  };

  const handleDateClick = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  // Filter tasks for current month or selected date
  const filteredTasks = selectedDate 
    ? tasks.filter(task => task.dueDate === selectedDate)
    : tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
      });

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'No date';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'work': 'briefcase',
      'personal': 'home',
      'shopping': 'shopping-cart',
      'health': 'heart'
    };
    return icons[category] || 'tasks';
  };

  const getStatusText = (status) => {
    const statuses = {
      'todo': 'Not Started',
      'inprogress': 'In Progress',
      'completed': 'Completed'
    };
    // Hapus bagian 'Unknown' dan kembalikan status asli jika tidak ditemukan
    return statuses[status] || status;
  };

  const toggleTaskStatus = (taskId, completed) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: completed ? 'completed' : 'todo' } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  };

  const clearDateSelection = () => {
    setSelectedDate(null);
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen w-full">
      <div className="max-w-6xl mx-auto w-full">
        {/* Calendar Page */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {selectedDate ? `Tasks for ${formatDisplayDate(selectedDate)}` : 'Task Calendar'}
            </h1>
            {selectedDate && (
              <button 
                onClick={clearDateSelection}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 font-medium"
              >
                <i className="fas fa-calendar"></i>
                <span>View All Month Tasks</span>
              </button>
            )}
          </div>

          {/* Calendar Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <div className="flex gap-3">
                <button 
                  onClick={previousMonth}
                  className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors text-lg font-bold"
                >
                  ←
                </button>
                <button 
                  onClick={nextMonth}
                  className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors text-lg font-bold"
                >
                  →
                </button>
              </div>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-semibold text-blue-600 py-3">
                  {day}
                </div>
              ))}
              
              {/* Empty days from previous month */}
              {Array(firstDay).fill(null).map((_, index) => (
                <div key={`empty-${index}`} className="text-center p-2"></div>
              ))}
              
              {/* Days of current month */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dateTasks = getTasksForDate(day);
                const hasHighPriority = dateTasks.some(task => task.priority === 'high');
                const hasMediumPriority = dateTasks.some(task => task.priority === 'medium');
                const hasLowPriority = dateTasks.some(task => task.priority === 'low');
                
                return (
                  <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`
                      text-center p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 min-h-[80px] flex flex-col items-center justify-start relative
                      ${isToday(day) 
                        ? 'bg-blue-500 text-white border-blue-500 font-bold' 
                        : dateTasks.length > 0
                        ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }
                      ${selectedDate === `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` 
                        ? 'ring-2 ring-blue-400 ring-opacity-50' 
                        : ''
                      }
                    `}
                  >
                    <div className={`font-medium ${isToday(day) ? 'text-white' : 'text-gray-800'}`}>
                      {day}
                    </div>
                    
                    {/* Task Indicators - Dot di pojok kanan atas */}
                    {dateTasks.length > 0 && (
                      <div className="absolute top-1 right-1 flex flex-wrap gap-1">
                        {hasHighPriority && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                        {hasMediumPriority && (
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        )}
                        {hasLowPriority && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    )}
                    
                    {/* Task Count Badge */}
                    {dateTasks.length > 0 && (
                      <div className="mt-1 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full font-medium">
                        {dateTasks.length}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {selectedDate ? `Tasks for ${formatDisplayDate(selectedDate)}` : 'Tasks This Month'}
            </h2>
            
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-tasks text-4xl text-gray-300 mb-3"></i>
                  <h3 className="text-lg font-medium text-gray-500">No tasks</h3>
                  <p className="text-gray-400">No tasks match the current criteria.</p>
                </div>
              ) : (
                filteredTasks.map(task => {
                  const isCompleted = task.status === 'completed';
                  const priorityClass = {
                    'high': 'border-red-500',
                    'medium': 'border-yellow-500', 
                    'low': 'border-green-500'
                  }[task.priority];
                  
                  const priorityBadge = {
                    'high': 'bg-red-100 text-red-800',
                    'medium': 'bg-yellow-100 text-yellow-800',
                    'low': 'bg-green-100 text-green-800'
                  }[task.priority];
                  
                  const priorityText = {
                    'high': 'High',
                    'medium': 'Medium', 
                    'low': 'Low'
                  }[task.priority];
                  
                  const categoryIcon = getCategoryIcon(task.category);
                  const statusText = getStatusText(task.status);
                  
                  return (
                    <div 
                      key={task.id} 
                      className={`flex items-center p-4 bg-gray-50 rounded-lg border-l-4 ${priorityClass} hover:bg-gray-100 transition-all duration-200`}
                    >
                      <div className="mr-4">
                        <input 
                          type="checkbox" 
                          checked={isCompleted} 
                          onChange={(e) => toggleTaskStatus(task.id, e.target.checked)}
                          className="w-5 h-5 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <i className={`fas fa-${categoryIcon} text-blue-600`}></i>
                          <span className={`font-semibold ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {task.title}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${priorityBadge} font-medium`}>
                            {priorityText}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        <div className="flex items-center gap-6 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <i className="far fa-calendar"></i>
                            {formatDate(task.dueDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="fas fa-tag"></i>
                            {task.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <i className={`fas fa-${isCompleted ? 'check' : 'clock'}`}></i>
                            {statusText}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <i 
                          className="fas fa-edit text-gray-500 hover:text-blue-500 cursor-pointer p-2 rounded-lg hover:bg-gray-200 transition-colors" 
                        ></i>
                        <i 
                          className="fas fa-trash text-gray-500 hover:text-red-500 cursor-pointer p-2 rounded-lg hover:bg-gray-200 transition-colors" 
                          onClick={() => deleteTask(task.id)}
                        ></i>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
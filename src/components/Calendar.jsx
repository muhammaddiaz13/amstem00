import React from 'react';

const Calendar = ({ 
  currentDate, 
  selectedDate, 
  tasks, 
  onDateClick, 
  onPrevMonth, 
  onNextMonth 
}) => {
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper function to get days in month
  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getTasksForDay = (day) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = checkDate.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateString);
  };

  const renderCalendarDays = () => {
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for previous month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-transparent"></div>);
    }

    // Days of current month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const dayTasks = getTasksForDay(day);

      // Check priorities for dots
      const hasHighPriority = dayTasks.some(task => task.priority === 'High');
      const hasMediumPriority = dayTasks.some(task => task.priority === 'Medium');
      const hasLowPriority = dayTasks.some(task => task.priority === 'Low');

      // Changed from aspect-square to h-24 for compact height
      let dayClasses = "h-24 border rounded-lg p-2 relative cursor-pointer transition-all duration-200 flex flex-col items-center justify-start ";
      
      if (isSelected) {
         // Selected: Biru Solid
         dayClasses += "bg-blue-600 text-white border-blue-600 shadow-md z-10";
      } else if (isToday) {
         // Today: Text Biru
         dayClasses += "bg-white text-blue-600 border-blue-200 font-bold hover:bg-blue-50";
      } else if (dayTasks.length > 0) {
         // Has Tasks
         dayClasses += "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
      } else {
         // Empty
         dayClasses += "bg-white text-gray-700 border-gray-100 hover:bg-gray-50";
      }

      days.push(
        <div 
          key={day} 
          onClick={() => onDateClick(date)}
          className={dayClasses}
        >
          <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700'} mb-1`}>{day}</span>
          
          {/* Priority Dots Indicator */}
          {dayTasks.length > 0 && (
            <div className="flex gap-1 mt-auto mb-1">
               {hasHighPriority && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-red-500'}`}></div>}
               {hasMediumPriority && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-200' : 'bg-yellow-500'}`}></div>}
               {hasLowPriority && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-300' : 'bg-green-500'}`}></div>}
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 max-w-4xl mx-auto">
      {/* Header Navigation */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button onClick={onPrevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
            <i className="fas fa-chevron-left text-sm"></i>
          </button>
          <button onClick={onNextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
            <i className="fas fa-chevron-right text-sm"></i>
          </button>
        </div>
      </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 mb-2 text-center">
        {dayNames.map(day => (
          <div key={day} className="text-blue-600 font-semibold py-2 text-xs uppercase tracking-wide">{day}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-2">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;
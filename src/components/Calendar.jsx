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
  const mobileDayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const toLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTasksForDay = (day) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = toLocalDateString(checkDate);
    return tasks.filter(task => task.dueDate === dateString);
  };

  const renderCalendarDays = () => {
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    const days = [];

    const todayString = toLocalDateString(new Date());
    const selectedDateString = toLocalDateString(selectedDate);

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 md:h-24 border border-transparent"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = toLocalDateString(date);
      
      const isToday = todayString === dateString;
      const isSelected = selectedDateString === dateString;
      
      const dayTasks = getTasksForDay(day);

      const hasHighPriority = dayTasks.some(task => task.priority === 'High');
      const hasMediumPriority = dayTasks.some(task => task.priority === 'Medium');
      const hasLowPriority = dayTasks.some(task => task.priority === 'Low');

      let dayClasses = "h-16 md:h-24 border rounded-lg p-1 md:p-2 relative cursor-pointer transition-all duration-200 flex flex-col items-center justify-start ";
      
      if (isSelected) {
         dayClasses += "bg-blue-600 text-white border-blue-600 shadow-md z-10";
      } else if (isToday) {
         dayClasses += "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 font-bold hover:bg-blue-50 dark:hover:bg-gray-700";
      } else if (dayTasks.length > 0) {
         dayClasses += "bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700";
      } else {
         dayClasses += "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700";
      }

      days.push(
        <div 
          key={day} 
          onClick={() => onDateClick(date)}
          className={dayClasses}
        >
          <span className={`text-xs md:text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'} mb-1`}>{day}</span>
          
          {/* Priority Dots Indicator */}
          {dayTasks.length > 0 && (
            <div className="flex gap-1 mt-auto mb-1">
               {hasHighPriority && <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-red-500'}`}></div>}
               {hasMediumPriority && <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${isSelected ? 'bg-blue-200' : 'bg-yellow-500'}`}></div>}
               {hasLowPriority && <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${isSelected ? 'bg-blue-300' : 'bg-green-500'}`}></div>}
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 max-w-4xl mx-auto animate-[fadeIn_0.5s_ease-out] transition-colors duration-300">
      {/* Header Navigation */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button onClick={onPrevMonth} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors">
            <i className="fas fa-chevron-left text-sm"></i>
          </button>
          <button onClick={onNextMonth} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors">
            <i className="fas fa-chevron-right text-sm"></i>
          </button>
        </div>
      </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 mb-2 text-center">
        {/* Desktop View */}
        <div className="hidden md:contents">
            {dayNames.map(day => (
            <div key={day} className="text-blue-600 dark:text-blue-400 font-semibold py-2 text-xs uppercase tracking-wide">{day}</div>
            ))}
        </div>
        {/* Mobile View (Short names) */}
        <div className="contents md:hidden">
            {mobileDayNames.map((day, idx) => (
            <div key={`${day}-${idx}`} className="text-blue-600 dark:text-blue-400 font-semibold py-2 text-xs uppercase tracking-wide">{day}</div>
            ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;
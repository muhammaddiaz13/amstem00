import React from 'react';

const ProgressBar = ({ progress, showPercentage = true, height = 10, showLabel = false, label = 'Progress' }) => {

  const getProgressColor = () => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-800">
              {progress}%
            </span>
          )}
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <div 
          className={`flex-1 bg-gray-200 rounded-full overflow-hidden ${height === 12 ? 'h-3' : height === 8 ? 'h-2' : 'h-2.5'}`}
        >
          <div 
            className={`h-full rounded-full transition-all duration-500 ease-in-out ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {!showLabel && showPercentage && (
          <span className="text-sm font-semibold text-gray-800 min-w-[50px]">
            {progress}%
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
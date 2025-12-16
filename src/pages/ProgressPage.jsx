import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { taskService } from '../services/taskService.js';

function ProgressPage() {
  const { user } = useAuth();
  const username = user ? user.username : 'Guest';
  
  const [tasks, setTasks] = useState([]);
  const [progressStats, setProgressStats] = useState({
    overall: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    total: 0,
    work: 0,
    personal: 0,
    others: 0
  });

  useEffect(() => {
    if (user) {
      taskService.getAll().then(data => setTasks(data)).catch(err => console.error(err));
    } else {
      setTasks([]);
    }
  }, [user]);

  // Calculate progress statistics
  useEffect(() => {
    if (tasks.length === 0) {
      setProgressStats({
        overall: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        total: 0,
        work: 0,
        personal: 0,
        others: 0
      });
      return;
    }

    const completedTasks = tasks.filter(task => task.taskStatus === 'Finished').length;
    const inProgressTasks = tasks.filter(task => task.taskStatus === 'In Progress').length;
    const pendingTasks = tasks.filter(task => task.taskStatus === 'Unfinished' || !task.taskStatus).length;
    const totalTasks = tasks.length;
    
    const workTasks = tasks.filter(task => task.taskCategory === 'Work' || task.priority === 'High').length;
    const personalTasks = tasks.filter(task => task.taskCategory === 'Personal' || task.priority === 'Medium').length;
    const othersTasks = tasks.filter(task => task.taskCategory === 'Others' || task.priority === 'Low').length;

    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    setProgressStats({
      overall: overallProgress,
      completed: completedTasks,
      inProgress: inProgressTasks,
      pending: pendingTasks,
      total: totalTasks,
      work: workTasks,
      personal: personalTasks,
      others: othersTasks
    });
  }, [tasks]);

  const completedTasks = tasks.filter(task => task.taskStatus === 'Finished');

  return (
    <div className="p-8 md:p-12 bg-gray-50/50 dark:bg-gray-900 min-h-full transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Progress Overview</h1>
        <div className="text-lg text-gray-600 dark:text-gray-400">
          Welcome, <span className="font-semibold text-blue-600 dark:text-blue-400">{username}</span>
        </div>
      </div>

      {/* Overall Progress Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Overall Progress</h2>
          <span className="text-lg font-semibold text-blue-500 dark:text-blue-400">{progressStats.overall}% Complete</span>
        </div>
        <ProgressBar 
          progress={progressStats.overall} 
          showPercentage={false} 
          height={12}
          showLabel={true}
          label="Overall Task Completion"
        />
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{progressStats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{progressStats.completed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">{progressStats.inProgress}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-500 dark:text-blue-400 text-2xl mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Tasks</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">{progressStats.total}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-500 dark:text-green-400 text-2xl mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Completed Tasks</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">{progressStats.completed}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center text-yellow-500 dark:text-yellow-400 text-2xl mb-4">
            <span className="text-2xl">⏳</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">In Progress</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">{progressStats.inProgress}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-500 dark:text-red-400 text-2xl mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Pending Tasks</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">{progressStats.pending}</div>
        </div>
      </div>

      {/* Progress by Category */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Progress by Category</h2>
        
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border-l-4 border-blue-500">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">💼</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 dark:text-white">Work</span>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{progressStats.work} tasks</div>
                </div>
              </div>
              <span className="text-sm font-semibold text-blue-500 dark:text-blue-400">
                {progressStats.work > 0 ? Math.round((tasks.filter(t => t.taskStatus === 'Finished' && (t.taskCategory === 'Work' || t.priority === 'High')).length / progressStats.work) * 100) : 0}%
              </span>
            </div>
            <ProgressBar 
              progress={progressStats.work > 0 ? Math.round((tasks.filter(t => t.taskStatus === 'Finished' && (t.taskCategory === 'Work' || t.priority === 'High')).length / progressStats.work) * 100) : 0} 
              showPercentage={false}
              height={8}
            />
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border-l-4 border-green-500">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-bold">👤</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 dark:text-white">Personal</span>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{progressStats.personal} tasks</div>
                </div>
              </div>
              <span className="text-sm font-semibold text-green-500 dark:text-green-400">
                {progressStats.personal > 0 ? Math.round((tasks.filter(t => t.taskStatus === 'Finished' && (t.taskCategory === 'Personal' || t.priority === 'Medium')).length / progressStats.personal) * 100) : 0}%
              </span>
            </div>
            <ProgressBar 
              progress={progressStats.personal > 0 ? Math.round((tasks.filter(t => t.taskStatus === 'Finished' && (t.taskCategory === 'Personal' || t.priority === 'Medium')).length / progressStats.personal) * 100) : 0} 
              showPercentage={false}
              height={8}
            />
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border-l-4 border-purple-500">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">📦</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 dark:text-white">Others</span>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{progressStats.others} tasks</div>
                </div>
              </div>
              <span className="text-sm font-semibold text-purple-500 dark:text-purple-400">
                {progressStats.others > 0 ? Math.round((tasks.filter(t => t.taskStatus === 'Finished' && (t.taskCategory === 'Others' || t.priority === 'Low')).length / progressStats.others) * 100) : 0}%
              </span>
            </div>
            <ProgressBar 
              progress={progressStats.others > 0 ? Math.round((tasks.filter(t => t.taskStatus === 'Finished' && (t.taskCategory === 'Others' || t.priority === 'Low')).length / progressStats.others) * 100) : 0} 
              showPercentage={false}
              height={8}
            />
          </div>
        </div>
      </div>

      {/* Recently Completed Tasks */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Recently Completed Tasks</h2>
        
        {completedTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <span className="text-4xl mb-4 block">📊</span>
            <p className="text-lg">No completed tasks yet</p>
            <p className="text-sm mt-2">Complete some tasks to see them here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedTasks.slice(0, 5).map((task, index) => (
              <div key={task.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-green-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                <div className="mr-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{task.taskTitle}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      task.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <span>Status:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">Completed</span>
                    </span>
                    {task.dueDate && (
                      <span className="flex items-center gap-1">
                        <span>Due:</span>
                        <span>{task.dueDate}</span>
                      </span>
                    )}
                    {task.taskCategory && (
                      <span className="flex items-center gap-1">
                        <span>Category:</span>
                        <span>{task.taskCategory}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-600 dark:text-green-400">100%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Complete</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressPage;
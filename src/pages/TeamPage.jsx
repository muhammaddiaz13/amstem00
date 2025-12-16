import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const TeamPage = () => {
  const { user, openLoginModal } = useAuth();
  const username = user ? user.username : 'Guest';

  const [taskAssignments, setTaskAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    const savedAssignments = JSON.parse(localStorage.getItem('taskAssignments'));
    
    if (savedAssignments) {
      // Filter out the specific dummy data (ID '1') that might persist in users' local storage
      const cleanedAssignments = savedAssignments.filter(task => task.id !== '1');
      
      setTaskAssignments(cleanedAssignments);
      
      // Update local storage if we removed the dummy data
      if (cleanedAssignments.length !== savedAssignments.length) {
        localStorage.setItem('taskAssignments', JSON.stringify(cleanedAssignments));
      }
    } else {
      setTaskAssignments([]);
      localStorage.setItem('taskAssignments', JSON.stringify([]));
    }
  }, []);

  const filteredAssignments = taskAssignments.filter(assignment => {
    const matchesSearch = assignment.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || assignment.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const groupAssignmentsByAssignee = () => {
    const grouped = {};
    filteredAssignments.forEach(assignment => {
      if (!grouped[assignment.assignee]) {
        grouped[assignment.assignee] = [];
      }
      grouped[assignment.assignee].push(assignment);
    });
    return grouped;
  };

  const handleSaveAssignment = (assignmentData) => {
    let updatedAssignments;
    
    if (editingAssignment) {
      updatedAssignments = taskAssignments.map(a => 
        a.id === editingAssignment.id ? { ...assignmentData, id: a.id } : a
      );
    } else {
      const newAssignment = {
        ...assignmentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      updatedAssignments = [...taskAssignments, newAssignment];
    }

    setTaskAssignments(updatedAssignments);
    localStorage.setItem('taskAssignments', JSON.stringify(updatedAssignments));
    setShowModal(false);
    setEditingAssignment(null);
  };

  
  const handleDeleteAssignment = (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      const updatedAssignments = taskAssignments.filter(a => a.id !== assignmentId);
      setTaskAssignments(updatedAssignments);
      localStorage.setItem('taskAssignments', JSON.stringify(updatedAssignments));
    }
  };

  
  const handleDeleteAssigneeAssignments = (assigneeName) => {
    if (window.confirm(`Are you sure you want to delete all assignments for ${assigneeName}?`)) {
      const updatedAssignments = taskAssignments.filter(a => a.assignee !== assigneeName);
      setTaskAssignments(updatedAssignments);
      localStorage.setItem('taskAssignments', JSON.stringify(updatedAssignments));
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'todo': 'Not Started',
      'inprogress': 'In Progress',
      'completed': 'Completed'
    };
    return statusMap[status] || 'Unknown';
  };

  const getPriorityText = (priority) => {
    const priorityMap = {
      'high': 'High',
      'medium': 'Medium',
      'low': 'Low'
    };
    return priorityMap[priority] || 'Unknown';
  };

  const getCategoryName = (category) => {
    const categoryMap = {
      'work': 'Work',
      'personal': 'Personal',
      'others': 'Others'
    };
    return categoryMap[category] || 'Other';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const assignmentsByAssignee = groupAssignmentsByAssignee();

  const TaskAssignmentModal = ({ assignment, onSave, onClose }) => {
    const [formData, setFormData] = useState({
      taskName: '',
      assignee: '',
      status: 'todo',
      priority: 'medium',
      tag: 'work',
      dueDate: '',
      notes: ''
    });

    
    useEffect(() => {
      if (assignment) {
        setFormData({
          taskName: assignment.taskName || '',
          assignee: assignment.assignee || '',
          status: assignment.status || 'todo',
          priority: assignment.priority || 'medium',
          tag: assignment.tag || 'work',
          dueDate: assignment.dueDate || '',
          notes: assignment.notes || ''
        });
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setFormData(prev => ({
          ...prev,
          dueDate: tomorrow.toISOString().split('T')[0]
        }));
      }
    }, [assignment]);
    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (!formData.taskName || !formData.assignee || !formData.status || !formData.priority || !formData.tag) {
        alert('Please fill all required fields!');
        return;
      }
      onSave(formData);
    };
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar transition-colors duration-300">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {assignment ? 'Edit Task Assignment ✏️' : 'Add Task Assignment'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {assignment ? 'Update assignment details' : 'Add new task assignment'}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assignee *
                </label>
                <input
                  type="text"
                  name="assignee"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter assignee name"
                  value={formData.assignee}
                  onChange={handleChange}
                  required
                />
              </div>        
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Task Name *
                </label>
                <input
                  type="text"
                  name="taskName"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter task name"
                  value={formData.taskName}
                  onChange={handleChange}
                  required
                />
              </div>          
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="todo">Not Started</option>
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority *
                </label>
                <select
                  name="priority"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="tag"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.tag}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="others">Others</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes / Description
              </label>
              <textarea
                name="notes"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add notes or description"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button 
                type="button" 
                className="px-4 py-2.5 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg font-medium transition-colors duration-200"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
              >
                <i className="fas fa-save mr-2"></i>
                {assignment ? 'Update Assignment ✏️' : 'Save Assignment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 md:p-12 bg-gray-50/50 dark:bg-gray-900 min-h-full transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Team Task Assignments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Hello, {username}! Manage and track task assignments for your team members</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow"
            onClick={() => {
              if (!user) {
                openLoginModal();
                return;
              }
              setEditingAssignment(null);
              setShowModal(true);
            }}
          >
            <i className="fas fa-plus"></i>
            <span>Add New Assignment</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Assignees</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {Object.keys(assignmentsByAssignee).length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <i className="fas fa-users text-blue-500 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {taskAssignments.length}
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <i className="fas fa-tasks text-green-500 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {taskAssignments.filter(a => a.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <i className="fas fa-check-circle text-purple-500 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {taskAssignments.filter(a => a.status === 'inprogress').length}
              </p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <i className="fas fa-spinner text-orange-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 transition-colors duration-300">
        <div className="relative mb-4">
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Search by task name or assignee..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="todo">Not Started</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Assignments Grid */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Team Members & Assignments</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-800 dark:text-white">{Object.keys(assignmentsByAssignee).length}</span> team members
          </div>
        </div>
        
        {Object.keys(assignmentsByAssignee).length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-6">
              <i className="fas fa-user-friends text-3xl text-blue-400"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-3">No assignments found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              No task assignments match your current filters. Try adjusting your search criteria or add new assignments.
            </p>
            <button 
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow"
              onClick={() => {
                if (!user) {
                  openLoginModal();
                  return;
                }
                setShowModal(true);
              }}
            >
              <i className="fas fa-plus"></i>
              <span>Create First Assignment</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(assignmentsByAssignee).map(([assignee, assignments]) => {
              const completedCount = assignments.filter(a => a.status === 'completed').length;
              const inProgressCount = assignments.filter(a => a.status === 'inprogress').length;
              const todoCount = assignments.filter(a => a.status === 'todo').length;
              const totalTasks = assignments.length;
              const initials = assignee.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

              return (
                <div key={assignee} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 relative">
                  {/* Assignee Header */}
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
                        {initials}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{assignee}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Team Member</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs px-2 py-1 rounded">
                            <i className="fas fa-tasks"></i>
                            <span>{totalTasks} Tasks</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Bar */}
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedCount}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{inProgressCount}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">In Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{todoCount}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
                      </div>
                    </div>
                  </div>

                  {/* Task List Header dengan Tombol Edit & Delete */}
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Assigned Tasks</h4>
                      <div className="flex gap-2">
                        {/* Tombol Edit */}
                        <button 
                          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200"
                          onClick={() => {
                            if (!user) {
                              openLoginModal();
                              return;
                            }
                            if (assignments.length > 0) {
                              setEditingAssignment(assignments[0]);
                              setShowModal(true);
                            }
                          }}
                          title="Edit First Assignment"
                          disabled={assignments.length === 0}
                        >
                          <span className="text-sm">✏️</span>
                          <span>Edit</span>
                        </button>                    
                        {/* Tombol Delete */}
                        <button 
                          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200"
                          onClick={() => {
                            if (!user) {
                              openLoginModal();
                              return;
                            }
                            handleDeleteAssigneeAssignments(assignee);
                          }}
                          title="Delete All Assignments"
                          disabled={assignments.length === 0}
                        >
                          <span className="text-sm">🗑️</span>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Task List */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {assignments.map(assignment => {
                        const priorityColors = {
                          high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                          medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
                          low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        };
                        
                        const tagColors = {
                          work: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                          personal: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                          others: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        };
                        
                        const statusColors = {
                          todo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
                          inprogress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                          completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        };

                        return (
                          <div key={assignment.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-l-4 border-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 relative group">
                            {/* Task Header */}
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium text-gray-800 dark:text-gray-200">{assignment.taskName}</h5>
                                {/* Tombol aksi untuk setiap task */}
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <button
                                    onClick={() => {
                                      if (!user) {
                                        openLoginModal();
                                        return;
                                      }
                                      setEditingAssignment(assignment);
                                      setShowModal(true);
                                    }}
                                    className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/50 dark:hover:bg-blue-900 dark:text-blue-300 rounded-lg transition-colors duration-200"
                                    title="Edit Task"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (!user) {
                                        openLoginModal();
                                        return;
                                      }
                                      handleDeleteAssignment(assignment.id);
                                    }}
                                    className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/50 dark:hover:bg-red-900 dark:text-red-300 rounded-lg transition-colors duration-200"
                                    title="Delete Task"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                              
                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[assignment.priority]}`}>
                                  {getPriorityText(assignment.priority)}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tagColors[assignment.tag]}`}>
                                  {getCategoryName(assignment.tag)}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[assignment.status]}`}>
                                  {getStatusText(assignment.status)}
                                </span>
                              </div>                            
                              {/* Due Date */}
                              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                <i className="far fa-calendar-alt mr-1"></i>
                                {assignment.dueDate 
                                  ? `Due: ${formatDate(assignment.dueDate)}`
                                  : 'No due date'
                                }
                              </div>
                              {/* Notes */}
                              {assignment.notes && (
                                <div className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600 mt-2">
                                  <div className="flex items-start">
                                    <span className="text-gray-400 mr-2">📝</span>
                                    <div>{assignment.notes}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Task Assignment Modal */}
      {showModal && (
        <TaskAssignmentModal
          assignment={editingAssignment}
          onSave={handleSaveAssignment}
          onClose={() => {
            setShowModal(false);
            setEditingAssignment(null);
          }}
        />
      )}
    </div>
  );
};

export default TeamPage;
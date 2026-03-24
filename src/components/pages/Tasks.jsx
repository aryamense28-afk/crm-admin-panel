// Tasks.jsx - Comprehensive CRM Tasks Component with Vibrant Colors

import React, { useState, useEffect } from "react";
import "./Tasks.css";

const CRMTasks = () => {
  // State management
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [view, setView] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(8);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    dueDate: new Date().toISOString().split('T')[0],
    category: "general",
    assignedTo: "",
    tags: [],
    attachments: [],
    subtasks: [],
    comments: [],
    estimatedHours: 0,
    actualHours: 0
  });

  // Categories and priorities
  const categories = ["general", "development", "design", "marketing", "sales", "support", "meeting"];
  const priorities = ["low", "medium", "high", "critical"];
  const statuses = ["pending", "in-progress", "review", "completed", "blocked"];
  const teamMembers = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "Alex Brown"];

  // Load initial tasks from localStorage or use defaults
  useEffect(() => {
    const savedTasks = localStorage.getItem('crmTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(generateInitialTasks());
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('crmTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Generate initial tasks with more variety
  const generateInitialTasks = () => {
    return [
      { 
        id: Date.now() - 1000000, 
        title: "Follow up with client", 
        description: "Call ABC Corp about project requirements",
        priority: "critical", 
        status: "pending", 
        dueDate: "2026-03-15",
        category: "sales",
        assignedTo: "John Doe",
        tags: ["client", "urgent"],
        attachments: [],
        subtasks: [
          { id: 1, title: "Review previous meeting notes", completed: true },
          { id: 2, title: "Prepare proposal", completed: false }
        ],
        comments: [],
        estimatedHours: 2,
        actualHours: 0,
        createdAt: "2026-03-10",
        lastUpdated: "2026-03-10"
      },
      { 
        id: Date.now() - 2000000, 
        title: "Prepare quarterly proposal", 
        description: "Create detailed proposal for Q2",
        priority: "high", 
        status: "in-progress", 
        dueDate: "2026-03-18",
        category: "development",
        assignedTo: "Jane Smith",
        tags: ["proposal", "quarterly"],
        attachments: [],
        subtasks: [
          { id: 1, title: "Gather requirements", completed: true },
          { id: 2, title: "Create timeline", completed: true },
          { id: 3, title: "Estimate costs", completed: false }
        ],
        comments: [],
        estimatedHours: 8,
        actualHours: 3,
        createdAt: "2026-03-11",
        lastUpdated: "2026-03-12"
      },
      { 
        id: Date.now() - 3000000, 
        title: "Send invoice", 
        description: "Process and send invoice for completed work",
        priority: "medium", 
        status: "completed", 
        dueDate: "2026-03-10",
        category: "finance",
        assignedTo: "Mike Johnson",
        tags: ["invoice", "finance"],
        attachments: [],
        subtasks: [
          { id: 1, title: "Calculate hours", completed: true },
          { id: 2, title: "Generate PDF", completed: true }
        ],
        comments: [],
        estimatedHours: 1,
        actualHours: 1,
        createdAt: "2026-03-08",
        lastUpdated: "2026-03-10"
      },
      { 
        id: Date.now() - 4000000, 
        title: "Team meeting", 
        description: "Weekly sprint planning meeting",
        priority: "high", 
        status: "pending", 
        dueDate: "2026-03-16",
        category: "meeting",
        assignedTo: "Sarah Wilson",
        tags: ["meeting", "sprint"],
        attachments: [],
        subtasks: [
          { id: 1, title: "Prepare agenda", completed: false },
          { id: 2, title: "Send invites", completed: true }
        ],
        comments: [],
        estimatedHours: 1.5,
        actualHours: 0,
        createdAt: "2026-03-12",
        lastUpdated: "2026-03-12"
      },
      { 
        id: Date.now() - 5000000, 
        title: "Update documentation", 
        description: "Update API documentation for new features",
        priority: "low", 
        status: "in-progress", 
        dueDate: "2026-03-20",
        category: "development",
        assignedTo: "Alex Brown",
        tags: ["docs", "api"],
        attachments: [],
        subtasks: [
          { id: 1, title: "Review changes", completed: true },
          { id: 2, title: "Write documentation", completed: false }
        ],
        comments: [],
        estimatedHours: 4,
        actualHours: 1.5,
        createdAt: "2026-03-13",
        lastUpdated: "2026-03-14"
      },
      { 
        id: Date.now() - 6000000, 
        title: "Review pull requests", 
        description: "Review and merge pending PRs",
        priority: "medium", 
        status: "blocked", 
        dueDate: "2026-03-17",
        category: "development",
        assignedTo: "John Doe",
        tags: ["code-review", "github"],
        attachments: [],
        subtasks: [
          { id: 1, title: "Review PR #123", completed: false },
          { id: 2, title: "Test changes", completed: false }
        ],
        comments: [],
        estimatedHours: 2,
        actualHours: 0,
        createdAt: "2026-03-14",
        lastUpdated: "2026-03-14"
      }
    ];
  };

  // Calculate comprehensive stats
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    review: tasks.filter(t => t.status === "review").length,
    completed: tasks.filter(t => t.status === "completed").length,
    blocked: tasks.filter(t => t.status === "blocked").length,
    critical: tasks.filter(t => t.priority === "critical").length,
    high: tasks.filter(t => t.priority === "high").length,
    medium: tasks.filter(t => t.priority === "medium").length,
    low: tasks.filter(t => t.priority === "low").length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== "completed").length,
    dueToday: tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0]).length,
    dueThisWeek: tasks.filter(t => {
      const taskDate = new Date(t.dueDate);
      const today = new Date();
      const weekFromNow = new Date(today.setDate(today.getDate() + 7));
      return taskDate <= weekFromNow && taskDate >= new Date();
    }).length,
    totalEstimatedHours: tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0),
    totalActualHours: tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0),
    completionRate: Math.round((tasks.filter(t => t.status === "completed").length / tasks.length) * 100) || 0
  };

  // Filter and sort tasks
  useEffect(() => {
    let result = [...tasks];

    // Apply status filter
    if (filter !== "all") {
      result = result.filter(task => task.status === filter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term) ||
        task.assignedTo?.toLowerCase().includes(term) ||
        task.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "dueDate":
          comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        case "priority":
          const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
          comparison = priorityWeight[b.priority] - priorityWeight[a.priority];
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "assignedTo":
          comparison = (a.assignedTo || "").localeCompare(b.assignedTo || "");
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredTasks(result);
  }, [tasks, filter, searchTerm, sortBy, sortOrder]);

  // Pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // Handle add task
  const handleAddTask = () => {
    if (newTask.title.trim() === "") {
      alert("Please enter a task title");
      return;
    }

    const task = {
      ...newTask,
      id: Date.now(),
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      subtasks: [],
      comments: [],
      attachments: []
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      dueDate: new Date().toISOString().split('T')[0],
      category: "general",
      assignedTo: "",
      tags: [],
      attachments: [],
      subtasks: [],
      comments: [],
      estimatedHours: 0,
      actualHours: 0
    });
    setShowAddForm(false);
  };

  // Bulk actions
  const handleBulkAction = (action) => {
    if (selectedTasks.length === 0) {
      alert("Please select tasks first");
      return;
    }

    switch (action) {
      case "delete":
        if (window.confirm(`Delete ${selectedTasks.length} selected tasks?`)) {
          setTasks(tasks.filter(task => !selectedTasks.includes(task.id)));
          setSelectedTasks([]);
        }
        break;
      case "complete":
        setTasks(tasks.map(task =>
          selectedTasks.includes(task.id) ? { ...task, status: "completed" } : task
        ));
        setSelectedTasks([]);
        break;
      case "assign":
        const assignee = prompt("Enter assignee name:");
        if (assignee) {
          setTasks(tasks.map(task =>
            selectedTasks.includes(task.id) ? { ...task, assignedTo: assignee } : task
          ));
          setSelectedTasks([]);
        }
        break;
      case "priority":
        const newPriority = prompt("Enter new priority (low/medium/high/critical):");
        if (newPriority && priorities.includes(newPriority)) {
          setTasks(tasks.map(task =>
            selectedTasks.includes(task.id) ? { ...task, priority: newPriority } : task
          ));
          setSelectedTasks([]);
        }
        break;
      default:
        break;
    }
  };

  // Toggle task selection
  const toggleTaskSelection = (taskId) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  // Select all tasks
  const selectAllTasks = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map(t => t.id));
    }
  };

  // Update task status
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] }
          : task
      )
    );
  };

  // Add subtask
  const addSubtask = (taskId, subtaskTitle) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const newSubtask = {
            id: Date.now(),
            title: subtaskTitle,
            completed: false
          };
          return {
            ...task,
            subtasks: [...(task.subtasks || []), newSubtask]
          };
        }
        return task;
      })
    );
  };

  // Toggle subtask
  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.map(st =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            )
          };
        }
        return task;
      })
    );
  };

  // Add comment
  const addComment = (taskId, comment) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const newComment = {
            id: Date.now(),
            text: comment,
            author: "Current User",
            createdAt: new Date().toISOString().split('T')[0]
          };
          return {
            ...task,
            comments: [...(task.comments || []), newComment]
          };
        }
        return task;
      })
    );
  };

  // Update hours
  const updateHours = (taskId, field, value) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, [field]: parseFloat(value) || 0 } : task
      )
    );
  };

  return (
    <div className="tasks-medium-colorful">
      
      {/* Header with Actions */}
      <div className="tasks-header">
        <div className="header-left">
          <h2>
            <span className="header-icon">📋</span>
            Task Management
          </h2>
          <p className="tasks-subtitle">Organize, track, and complete your tasks efficiently</p>
        </div>
        
        <div className="header-actions">
          <button 
            className={`view-btn ${showStats ? 'active' : ''}`}
            onClick={() => setShowStats(!showStats)}
            title="Toggle Statistics"
          >
            <span className="btn-icon">📊</span>
          </button>
          <button 
            className={`view-btn ${showCalendar ? 'active' : ''}`}
            onClick={() => setShowCalendar(!showCalendar)}
            title="Calendar View"
          >
            <span className="btn-icon">📅</span>
          </button>
          <button 
            className={`view-btn ${view === 'grid' ? 'active' : ''}`}
            onClick={() => setView('grid')}
          >
            <span className="btn-icon">⊞</span>
            Grid
          </button>
          <button 
            className={`view-btn ${view === 'table' ? 'active' : ''}`}
            onClick={() => setView('table')}
          >
            <span className="btn-icon">☷</span>
            Table
          </button>
          <button 
            className="add-task-header-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '✕' : '+ New Task'}
          </button>
        </div>
      </div>

      {/* Stats Cards - Enhanced */}
      {showStats && (
        <div className="stats-section">
          <div className="stats-row">
            <div className="stat-card total">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
            
            <div className="stat-card pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <span className="stat-value">{stats.pending}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
            
            <div className="stat-card progress">
              <div className="stat-icon">🔄</div>
              <div className="stat-content">
                <span className="stat-value">{stats.inProgress}</span>
                <span className="stat-label">In Progress</span>
              </div>
            </div>
            
            <div className="stat-card review">
              <div className="stat-icon">👀</div>
              <div className="stat-content">
                <span className="stat-value">{stats.review}</span>
                <span className="stat-label">Review</span>
              </div>
            </div>
            
            <div className="stat-card completed">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-value">{stats.completed}</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
            
            <div className="stat-card blocked">
              <div className="stat-icon">🚫</div>
              <div className="stat-content">
                <span className="stat-value">{stats.blocked}</span>
                <span className="stat-label">Blocked</span>
              </div>
            </div>
          </div>

          <div className="stats-row secondary">
            <div className="stat-mini critical">
              <span className="stat-label">Critical</span>
              <span className="stat-value">{stats.critical}</span>
            </div>
            <div className="stat-mini high">
              <span className="stat-label">High</span>
              <span className="stat-value">{stats.high}</span>
            </div>
            <div className="stat-mini medium">
              <span className="stat-label">Medium</span>
              <span className="stat-value">{stats.medium}</span>
            </div>
            <div className="stat-mini low">
              <span className="stat-label">Low</span>
              <span className="stat-value">{stats.low}</span>
            </div>
            <div className="stat-mini overdue">
              <span className="stat-label">Overdue</span>
              <span className="stat-value">{stats.overdue}</span>
            </div>
            <div className="stat-mini today">
              <span className="stat-label">Due Today</span>
              <span className="stat-value">{stats.dueToday}</span>
            </div>
            <div className="stat-mini week">
              <span className="stat-label">This Week</span>
              <span className="stat-value">{stats.dueThisWeek}</span>
            </div>
            <div className="stat-mini hours">
              <span className="stat-label">Hours</span>
              <span className="stat-value">{stats.totalActualHours}/{stats.totalEstimatedHours}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Form - Expanded */}
      {showAddForm && (
        <div className="add-task-expanded">
          <h3>Create New Task</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Title *</label>
              <input
                type="text"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
              >
                {priorities.map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={newTask.category}
                onChange={(e) => setNewTask({...newTask, category: e.target.value})}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Assign To</label>
              <select
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
              >
                <option value="">Unassigned</option>
                {teamMembers.map(member => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Estimated Hours</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={newTask.estimatedHours}
                onChange={(e) => setNewTask({...newTask, estimatedHours: parseFloat(e.target.value) || 0})}
              />
            </div>

            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g., urgent, client"
                value={newTask.tags.join(', ')}
                onChange={(e) => setNewTask({
                  ...newTask,
                  tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                })}
              />
            </div>

            <div className="form-actions full-width">
              <button className="save-btn" onClick={handleAddTask}>
                Create Task
              </button>
              <button className="cancel-btn" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="search-filter-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tasks by title, description, assignee, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>

        <div className="filter-controls">
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
            <option value="status">Sort by Status</option>
            <option value="assignedTo">Sort by Assignee</option>
          </select>

          <button
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>

          <button
            className={`bulk-actions-btn ${selectedTasks.length > 0 ? 'active' : ''}`}
            onClick={() => setShowBulkActions(!showBulkActions)}
          >
            Bulk Actions ({selectedTasks.length})
          </button>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      {showBulkActions && (
        <div className="bulk-actions-panel">
          <button onClick={() => selectAllTasks()}>
            {selectedTasks.length === filteredTasks.length ? 'Deselect All' : 'Select All'}
          </button>
          <button onClick={() => handleBulkAction("complete")}>
            Mark Complete
          </button>
          <button onClick={() => handleBulkAction("assign")}>
            Assign To
          </button>
          <button onClick={() => handleBulkAction("priority")}>
            Change Priority
          </button>
          <button className="delete-bulk" onClick={() => handleBulkAction("delete")}>
            Delete Selected
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({stats.total})
        </button>
        <button 
          className={`filter-btn pending`}
          onClick={() => setFilter('pending')}
        >
          Pending ({stats.pending})
        </button>
        <button 
          className={`filter-btn progress`}
          onClick={() => setFilter('in-progress')}
        >
          In Progress ({stats.inProgress})
        </button>
        <button 
          className={`filter-btn review`}
          onClick={() => setFilter('review')}
        >
          Review ({stats.review})
        </button>
        <button 
          className={`filter-btn completed`}
          onClick={() => setFilter('completed')}
        >
          Completed ({stats.completed})
        </button>
        <button 
          className={`filter-btn blocked`}
          onClick={() => setFilter('blocked')}
        >
          Blocked ({stats.blocked})
        </button>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <span>Showing {indexOfFirstTask + 1}-{Math.min(indexOfLastTask, filteredTasks.length)} of {filteredTasks.length} tasks</span>
        {selectedTasks.length > 0 && (
          <span className="selected-count">{selectedTasks.length} selected</span>
        )}
      </div>

      {/* Conditional Rendering */}
      {view === 'grid' ? (
        /* GRID VIEW */
        <div className="task-grid">
          {currentTasks.length > 0 ? (
            currentTasks.map(task => (
              <div 
                key={task.id} 
                className={`task-card ${task.priority} ${task.status} ${selectedTasks.includes(task.id) ? 'selected' : ''}`}
              >
                <div className="task-card-header">
                  <div className="task-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => toggleTaskSelection(task.id)}
                    />
                  </div>
                  <h4>{task.title}</h4>
                  <span className="due-date">📅 {task.dueDate}</span>
                </div>
                
                <div className="task-card-body">
                  <p className="task-description">{task.description}</p>
                  
                  <div className="task-meta">
                    <span className={`priority-tag ${task.priority}`}>
                      {task.priority === 'critical' && '🔥'}
                      {task.priority === 'high' && '🔴'}
                      {task.priority === 'medium' && '🟡'}
                      {task.priority === 'low' && '🟢'}
                      {task.priority}
                    </span>
                    
                    <span className="category-tag">
                      📁 {task.category}
                    </span>
                    
                    {task.assignedTo && (
                      <span className="assignee-tag">
                        👤 {task.assignedTo}
                      </span>
                    )}
                  </div>

                  {task.tags && task.tags.length > 0 && (
                    <div className="tags-container">
                      {task.tags.map(tag => (
                        <span key={tag} className="task-tag">#{tag}</span>
                      ))}
                    </div>
                  )}

                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="subtasks-preview">
                      <span>📋 {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks</span>
                    </div>
                  )}

                  {task.estimatedHours > 0 && (
                    <div className="hours-info">
                      <span>⏱️ {task.actualHours}/{task.estimatedHours}h</span>
                      <div className="hours-progress">
                        <div 
                          className="hours-fill"
                          style={{ width: `${(task.actualHours / task.estimatedHours) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="task-card-footer">
                  <select 
                    className="status-select"
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>{s.replace('-', ' ').toUpperCase()}</option>
                    ))}
                  </select>
                  
                  <div className="card-actions">
                    <button 
                      className="icon-btn details"
                      onClick={() => {/* Show details modal */}}
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button 
                      className="icon-btn delete"
                      onClick={() => deleteTask(task.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-tasks">
              <div className="no-tasks-icon">📭</div>
              <h3>No tasks found</h3>
              <p>Try adjusting your filters or create a new task</p>
              <button className="create-first-task" onClick={() => setShowAddForm(true)}>
                + Create Task
              </button>
            </div>
          )}
        </div>
      ) : (
        /* TABLE VIEW - Enhanced */
        <div className="table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                    onChange={selectAllTasks}
                  />
                </th>
                <th onClick={() => { setSortBy('title'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                  Task {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => { setSortBy('priority'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                  Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => { setSortBy('status'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                  Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => { setSortBy('assignedTo'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                  Assignee {sortBy === 'assignedTo' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => { setSortBy('dueDate'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                  Due Date {sortBy === 'dueDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.length > 0 ? (
                currentTasks.map(task => (
                  <tr key={task.id} className={selectedTasks.includes(task.id) ? 'selected-row' : ''}>
                    <td className="checkbox-col">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => toggleTaskSelection(task.id)}
                      />
                    </td>
                    
                    <td className="task-title-cell">
                      <div className="task-title-info">
                        <strong>{task.title}</strong>
                        {task.description && (
                          <small>{task.description.substring(0, 50)}...</small>
                        )}
                      </div>
                    </td>
                    
                    <td>
                      <span className={`priority-tag ${task.priority}`}>
                        {task.priority === 'critical' && '🔥'}
                        {task.priority === 'high' && '🔴'}
                        {task.priority === 'medium' && '🟡'}
                        {task.priority === 'low' && '🟢'}
                        {task.priority}
                      </span>
                    </td>
                    
                    <td>
                      <select
                        className={`status-select-table ${task.status}`}
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>{s.replace('-', ' ').toUpperCase()}</option>
                        ))}
                      </select>
                    </td>
                    
                    <td>
                      {task.assignedTo ? (
                        <span className="assignee-badge">{task.assignedTo}</span>
                      ) : (
                        <span className="unassigned">Unassigned</span>
                      )}
                    </td>
                    
                    <td>
                      <span className={`due-date-cell ${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'overdue' : ''}`}>
                        📅 {task.dueDate}
                      </span>
                    </td>
                    
                    <td>
                      {task.subtasks && task.subtasks.length > 0 ? (
                        <div className="progress-cell">
                          <span>{Math.round((task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100)}%</span>
                          <div className="mini-progress">
                            <div 
                              className="mini-progress-fill"
                              style={{ width: `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    
                    <td className="actions-cell">
                      <button 
                        className="table-btn details"
                        onClick={() => {/* Show details modal */}}
                        title="Details"
                      >
                        👁️
                      </button>
                      <button 
                        className="table-btn delete"
                        onClick={() => deleteTask(task.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-results">
                    <div className="no-results-content">
                      <span className="no-results-icon">📭</span>
                      <p>No tasks found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredTasks.length > tasksPerPage && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}

      {/* Progress Summary */}
      <div className="progress-section">
        <div className="progress-label">
          <span>Overall Progress</span>
          <span className="progress-percent">{stats.completionRate}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${stats.completionRate}%` }}
          ></div>
        </div>
        <div className="progress-stats">
          <span>✅ {stats.completed} completed</span>
          <span>⏳ {stats.pending + stats.inProgress + stats.review} active</span>
          <span>🚫 {stats.blocked} blocked</span>
          <span>⏱️ {stats.totalActualHours}/{stats.totalEstimatedHours} hours</span>
        </div>
      </div>

    </div>
  );
};

export default CRMTasks;
import React, { useState, useEffect } from 'react';
import './Tickets.css';

const initialTickets = [
  {
    id: 1,
    title: 'Login issue - Unable to access account',
    customer: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    priority: 'HIGH',
    status: 'OPEN',
    category: 'Technical',
    assignedTo: 'Support Team A',
    description: 'User unable to login after password reset. Getting error message "Invalid credentials".',
    date: '2026-03-10',
    lastUpdated: '2026-03-10',
    attachments: [],
    comments: [
      { id: 1, user: 'Agent John', text: 'Checking logs...', date: '2026-03-10' }
    ],
    timeSpent: 0,
    slaDeadline: '2026-03-11'
  },
  {
    id: 2,
    title: 'Payment failed during checkout',
    customer: 'Neha Patel',
    email: 'neha.patel@email.com',
    phone: '+91 87654 32109',
    priority: 'MEDIUM',
    status: 'IN PROGRESS',
    category: 'Billing',
    assignedTo: 'Support Team B',
    description: 'Payment gateway showing error for credit card transactions.',
    date: '2026-03-09',
    lastUpdated: '2026-03-10',
    attachments: [],
    comments: [
      { id: 1, user: 'Agent Sarah', text: 'Contacting payment gateway team', date: '2026-03-09' }
    ],
    timeSpent: 45,
    slaDeadline: '2026-03-12'
  },
  {
    id: 3,
    title: 'Account verification pending',
    customer: 'Aman Singh',
    email: 'aman.singh@email.com',
    phone: '+91 76543 21098',
    priority: 'LOW',
    status: 'CLOSED',
    category: 'Account',
    assignedTo: 'Support Team A',
    description: 'User waiting for KYC verification for 3 days.',
    date: '2026-03-08',
    lastUpdated: '2026-03-09',
    attachments: [],
    comments: [
      { id: 1, user: 'Agent Mike', text: 'Verified and closed', date: '2026-03-09' }
    ],
    timeSpent: 30,
    slaDeadline: '2026-03-10'
  }
];

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [bulkSelected, setBulkSelected] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    customer: '',
    email: '',
    phone: '',
    priority: 'LOW',
    category: 'Technical',
    description: '',
    assignedTo: 'Support Team A'
  });

  // Load from localStorage
  useEffect(() => {
    const savedTickets = localStorage.getItem('crmTickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    } else {
      setTickets(initialTickets);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (tickets.length > 0) {
      localStorage.setItem('crmTickets', JSON.stringify(tickets));
    }
  }, [tickets]);

  // Filter and sort tickets
  useEffect(() => {
    let result = [...tickets];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(ticket =>
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.customer.toLowerCase().includes(searchLower) ||
        (ticket.email && ticket.email.toLowerCase().includes(searchLower)) ||
        ticket.id.toString().includes(searchLower)
      );
    }

    // Apply status filter
    if (filterStatus !== 'ALL') {
      result = result.filter(ticket => ticket.status === filterStatus);
    }

    // Apply priority filter
    if (filterPriority !== 'ALL') {
      result = result.filter(ticket => ticket.priority === filterPriority);
    }

    // Apply category filter
    if (filterCategory !== 'ALL') {
      result = result.filter(ticket => ticket.category === filterCategory);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'priority':
          const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          comparison = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
          break;
        case 'customer':
          comparison = a.customer.localeCompare(b.customer);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredTickets(result);
  }, [tickets, search, filterStatus, filterPriority, filterCategory, sortBy, sortOrder]);

  // Calculate comprehensive stats
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN PROGRESS').length,
    closed: tickets.filter(t => t.status === 'CLOSED').length,
    highPriority: tickets.filter(t => t.priority === 'HIGH').length,
    mediumPriority: tickets.filter(t => t.priority === 'MEDIUM').length,
    lowPriority: tickets.filter(t => t.priority === 'LOW').length,
    avgResolutionTime: tickets.filter(t => t.status === 'CLOSED').length > 0
      ? Math.round(tickets.filter(t => t.status === 'CLOSED')
          .reduce((sum, t) => sum + (t.timeSpent || 0), 0) / 
          tickets.filter(t => t.status === 'CLOSED').length)
      : 0,
    overdue: tickets.filter(t => 
      new Date(t.slaDeadline) < new Date() && 
      t.status !== 'CLOSED'
    ).length,
    totalTimeSpent: tickets.reduce((sum, t) => sum + (t.timeSpent || 0), 0)
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      setTickets(tickets.filter((t) => t.id !== id));
      if (selectedTicket === id) setSelectedTicket(null);
    }
  };

  const handleBulkDelete = () => {
    if (bulkSelected.length === 0) return;
    if (window.confirm(`Delete ${bulkSelected.length} selected tickets?`)) {
      setTickets(tickets.filter(t => !bulkSelected.includes(t.id)));
      setBulkSelected([]);
      setShowBulkActions(false);
    }
  };

  const handleBulkStatusChange = (newStatus) => {
    setTickets(tickets.map(t => 
      bulkSelected.includes(t.id) ? { 
        ...t, 
        status: newStatus, 
        lastUpdated: new Date().toISOString().slice(0, 10) 
      } : t
    ));
    setBulkSelected([]);
    setShowBulkActions(false);
  };

  const toggleBulkSelect = (id) => {
    setBulkSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (bulkSelected.length === filteredTickets.length) {
      setBulkSelected([]);
    } else {
      setBulkSelected(filteredTickets.map(t => t.id));
    }
  };

  const handleChangeStatus = (id) => {
    const nextStatus = {
      OPEN: 'IN PROGRESS',
      'IN PROGRESS': 'CLOSED',
      CLOSED: 'OPEN',
    };
    setTickets(
      tickets.map((t) =>
        t.id === id 
          ? { 
              ...t, 
              status: nextStatus[t.status],
              lastUpdated: new Date().toISOString().slice(0, 10)
            } 
          : t
      )
    );
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicket.title || !newTicket.customer) {
      alert('Please fill in required fields');
      return;
    }
    
    const newId = tickets.length > 0 ? Math.max(...tickets.map((t) => t.id)) + 1 : 4;
    const today = new Date().toISOString().slice(0, 10);
    const slaDate = new Date();
    slaDate.setDate(slaDate.getDate() + 2); // 2 days SLA
    
    setTickets([
      ...tickets,
      {
        id: newId,
        ...newTicket,
        status: 'OPEN',
        date: today,
        lastUpdated: today,
        attachments: [],
        comments: [],
        timeSpent: 0,
        slaDeadline: slaDate.toISOString().slice(0, 10)
      },
    ]);
    
    setNewTicket({
      title: '',
      customer: '',
      email: '',
      phone: '',
      priority: 'LOW',
      category: 'Technical',
      description: '',
      assignedTo: 'Support Team A'
    });
    setShowAddForm(false);
  };

  const addComment = (ticketId, comment) => {
    if (!comment.trim()) return;
    
    setTickets(tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const newComment = {
          id: Date.now(),
          user: 'Current Agent',
          text: comment,
          date: new Date().toISOString().slice(0, 10)
        };
        return {
          ...ticket,
          comments: [...(ticket.comments || []), newComment],
          lastUpdated: new Date().toISOString().slice(0, 10)
        };
      }
      return ticket;
    }));
  };

  const updateTimeSpent = (ticketId, minutes) => {
    setTickets(tickets.map(ticket =>
      ticket.id === ticketId
        ? { ...ticket, timeSpent: (ticket.timeSpent || 0) + minutes }
        : ticket
    ));
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'OPEN': return '#5e72e4';
      case 'IN PROGRESS': return '#a05ee4';
      case 'CLOSED': return '#4caf50';
      default: return '#5e72e4';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'HIGH': return '#ff4757';
      case 'MEDIUM': return '#ffa502';
      case 'LOW': return '#26de81';
      default: return '#26de81';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'OPEN': return '📌';
      case 'IN PROGRESS': return '⚡';
      case 'CLOSED': return '✅';
      default: return '📌';
    }
  };

  return (
    <div className="tickets-container">
      <div className="tickets-wrapper">
        {/* Colorful Header Banner */}
        <div className="tickets-banner">
          <div className="banner-content">
            <div className="banner-left">
              <h1>🎫 Ticket Management System</h1>
              <p className="banner-subtitle">Manage, track, and resolve customer tickets efficiently</p>
            </div>
            <div className="banner-right">
              <div className="date-badge">
                📅 {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="quick-actions-bar">
          <button className="quick-action" onClick={() => setShowAddForm(!showAddForm)}>
            <span className="action-icon">➕</span>
            New Ticket
          </button>
          <button className="quick-action" onClick={() => setShowStats(!showStats)}>
            <span className="action-icon">📊</span>
            {showStats ? 'Hide' : 'Show'} Stats
          </button>
          <button className="quick-action" onClick={() => setViewMode(viewMode === 'table' ? 'kanban' : 'table')}>
            <span className="action-icon">{viewMode === 'table' ? '📋' : '📊'}</span>
            {viewMode === 'table' ? 'Kanban' : 'Table'} View
          </button>
          {bulkSelected.length > 0 && (
            <button className="quick-action bulk" onClick={() => setShowBulkActions(!showBulkActions)}>
              <span className="action-icon">✓</span>
              Bulk Actions ({bulkSelected.length})
            </button>
          )}
        </div>

        {/* Bulk Actions Panel */}
        {showBulkActions && bulkSelected.length > 0 && (
          <div className="bulk-actions-panel">
            <span className="bulk-count">Selected: {bulkSelected.length} tickets</span>
            <div className="bulk-buttons">
              <button onClick={selectAll}>
                {bulkSelected.length === filteredTickets.length ? 'Deselect All' : 'Select All'}
              </button>
              <button onClick={() => handleBulkStatusChange('OPEN')}>Mark Open</button>
              <button onClick={() => handleBulkStatusChange('IN PROGRESS')}>Mark In Progress</button>
              <button onClick={() => handleBulkStatusChange('CLOSED')}>Mark Closed</button>
              <button className="bulk-delete" onClick={handleBulkDelete}>Delete Selected</button>
            </div>
          </div>
        )}

        {/* MAIN PANEL */}
        <main className="main-panel">
          {/* Create Ticket Form - Expandable */}
          {showAddForm && (
            <div className="create-ticket-expanded">
              <h2 className="section-title">Create New Ticket</h2>
              <form className="ticket-form-expanded" onSubmit={handleCreateTicket}>
                <div className="form-row">
                  <div className="form-group">
                    <label>📝 Ticket Title *</label>
                    <input
                      type="text"
                      placeholder="Enter ticket title"
                      value={newTicket.title}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>👤 Customer Name *</label>
                    <input
                      type="text"
                      placeholder="Enter customer name"
                      value={newTicket.customer}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, customer: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>📧 Email</label>
                    <input
                      type="email"
                      placeholder="customer@email.com"
                      value={newTicket.email}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>📱 Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={newTicket.phone}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>🔴 Priority</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, priority: e.target.value })
                      }
                    >
                      <option value="LOW">🟢 Low Priority</option>
                      <option value="MEDIUM">🟡 Medium Priority</option>
                      <option value="HIGH">🔴 High Priority</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>📂 Category</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, category: e.target.value })
                      }
                    >
                      <option value="Technical">Technical</option>
                      <option value="Billing">Billing</option>
                      <option value="Account">Account</option>
                      <option value="Product">Product</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>👥 Assign To</label>
                    <select
                      value={newTicket.assignedTo}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, assignedTo: e.target.value })
                      }
                    >
                      <option value="Support Team A">Support Team A</option>
                      <option value="Support Team B">Support Team B</option>
                      <option value="Support Team C">Support Team C</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>📝 Description</label>
                  <textarea
                    placeholder="Describe the issue in detail..."
                    rows="4"
                    value={newTicket.description}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, description: e.target.value })
                    }
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="create-btn">
                    ✨ Create Ticket
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="filter-bar">
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Search by ID, title, customer, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="clear-search" onClick={() => setSearch('')}>
                  ✕
                </button>
              )}
            </div>

            <div className="filter-controls">
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="OPEN">Open</option>
                <option value="IN PROGRESS">In Progress</option>
                <option value="CLOSED">Closed</option>
              </select>

              <select
                className="filter-select"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="ALL">All Priority</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              <select
                className="filter-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Billing">Billing</option>
                <option value="Account">Account</option>
                <option value="Product">Product</option>
              </select>

              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="customer">Sort by Customer</option>
                <option value="status">Sort by Status</option>
              </select>

              <button
                className="sort-order-btn"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {showStats && (
            <div className="stats-container">
              <div className="stat-card total">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>Total Tickets</h3>
                  <p>{stats.total}</p>
                </div>
              </div>
              <div className="stat-card open">
                <div className="stat-icon">📌</div>
                <div className="stat-info">
                  <h3>Open</h3>
                  <p>{stats.open}</p>
                </div>
              </div>
              <div className="stat-card progress">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <h3>In Progress</h3>
                  <p>{stats.inProgress}</p>
                </div>
              </div>
              <div className="stat-card closed">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>Closed</h3>
                  <p>{stats.closed}</p>
                </div>
              </div>
              <div className="stat-card high">
                <div className="stat-icon">🔴</div>
                <div className="stat-info">
                  <h3>High Priority</h3>
                  <p>{stats.highPriority}</p>
                </div>
              </div>
              <div className="stat-card overdue">
                <div className="stat-icon">⚠️</div>
                <div className="stat-info">
                  <h3>Overdue</h3>
                  <p>{stats.overdue}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Info */}
          <div className="results-info">
            <span>Showing {filteredTickets.length} of {tickets.length} tickets</span>
            {bulkSelected.length > 0 && (
              <span className="selected-count">{bulkSelected.length} selected</span>
            )}
          </div>

          {/* Conditional Rendering: Table View or Kanban View */}
          {viewMode === 'table' ? (
            /* TICKET TABLE VIEW */
            <div className="table-wrapper">
              <table className="ticket-table">
                <thead>
                  <tr>
                    <th className="checkbox-col">
                      <input
                        type="checkbox"
                        checked={bulkSelected.length === filteredTickets.length && filteredTickets.length > 0}
                        onChange={selectAll}
                      />
                    </th>
                    <th>ID</th>
                    <th>TITLE</th>
                    <th>CUSTOMER</th>
                    <th>PRIORITY</th>
                    <th>STATUS</th>
                    <th>CATEGORY</th>
                    <th>ASSIGNED</th>
                    <th>DATE</th>
                    <th>SLA</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className={`table-row ${bulkSelected.includes(ticket.id) ? 'selected-row' : ''}`}>
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          checked={bulkSelected.includes(ticket.id)}
                          onChange={() => toggleBulkSelect(ticket.id)}
                        />
                      </td>
                      <td className="id-cell">#{ticket.id}</td>
                      <td className="title-cell">
                        <div className="title-with-badge">
                          {ticket.title}
                          {ticket.priority === 'HIGH' && <span className="urgent-badge">URGENT</span>}
                        </div>
                      </td>
                      <td className="customer-cell">
                        <div className="customer-info">
                          <span className="customer-avatar">
                            {ticket.customer.split(' ').map(n => n[0]).join('')}
                          </span>
                          <div className="customer-details">
                            <span>{ticket.customer}</span>
                            {ticket.email && <small>{ticket.email}</small>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="priority-badge"
                          style={{ background: getPriorityColor(ticket.priority) }}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ background: getStatusColor(ticket.status) }}
                        >
                          {getStatusIcon(ticket.status)} {ticket.status}
                        </span>
                      </td>
                      <td>{ticket.category}</td>
                      <td>{ticket.assignedTo}</td>
                      <td className="date-cell">📅 {ticket.date}</td>
                      <td>
                        <span className={`sla-badge ${new Date(ticket.slaDeadline) < new Date() && ticket.status !== 'CLOSED' ? 'sla-overdue' : ''}`}>
                          {ticket.slaDeadline}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn view"
                            onClick={() => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)}
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button
                            className="action-btn change"
                            onClick={() => handleChangeStatus(ticket.id)}
                            title="Change Status"
                          >
                            🔄
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(ticket.id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTickets.length === 0 && (
                    <tr>
                      <td colSpan="11" className="no-results">
                        <div className="no-results-content">
                          <span className="no-results-icon">🔍</span>
                          <h3>No tickets found</h3>
                          <p>Try adjusting your filters or create a new ticket</p>
                          <button className="create-first-ticket" onClick={() => setShowAddForm(true)}>
                            + Create First Ticket
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* KANBAN BOARD VIEW */
            <div className="kanban-board">
              {['OPEN', 'IN PROGRESS', 'CLOSED'].map(status => (
                <div key={status} className="kanban-column">
                  <div className="kanban-header" style={{ background: getStatusColor(status) }}>
                    <h3>{getStatusIcon(status)} {status}</h3>
                    <span className="kanban-count">
                      {filteredTickets.filter(t => t.status === status).length}
                    </span>
                  </div>
                  <div className="kanban-cards">
                    {filteredTickets
                      .filter(t => t.status === status)
                      .map(ticket => (
                        <div key={ticket.id} className="kanban-card" onClick={() => setSelectedTicket(ticket.id)}>
                          <div className="kanban-card-header">
                            <span className="ticket-id">#{ticket.id}</span>
                            <span className="ticket-priority" style={{ background: getPriorityColor(ticket.priority) }}>
                              {ticket.priority}
                            </span>
                          </div>
                          <h4 className="ticket-title">{ticket.title}</h4>
                          <div className="ticket-customer">
                            <span className="customer-avatar small">
                              {ticket.customer.split(' ').map(n => n[0]).join('')}
                            </span>
                            {ticket.customer}
                          </div>
                          <div className="ticket-meta">
                            <span>📅 {ticket.date}</span>
                            <span>👤 {ticket.assignedTo}</span>
                          </div>
                          <div className="kanban-card-actions">
                            <button onClick={(e) => {
                              e.stopPropagation();
                              handleChangeStatus(ticket.id);
                            }}>→ Move</button>
                            <button onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(ticket.id);
                            }}>🗑️</button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ticket Details Modal */}
          {selectedTicket && (
            <div className="ticket-modal" onClick={() => setSelectedTicket(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {tickets.filter(t => t.id === selectedTicket).map(ticket => (
                  <div key={ticket.id} className="ticket-details">
                    <div className="modal-header">
                      <h2>Ticket #{ticket.id} - {ticket.title}</h2>
                      <button className="close-modal" onClick={() => setSelectedTicket(null)}>✕</button>
                    </div>
                    
                    <div className="details-grid">
                      <div className="detail-item">
                        <label>Customer</label>
                        <span>{ticket.customer}</span>
                        {ticket.email && <small>{ticket.email}</small>}
                        {ticket.phone && <small>{ticket.phone}</small>}
                      </div>
                      
                      <div className="detail-item">
                        <label>Status</label>
                        <span className="status-badge" style={{ background: getStatusColor(ticket.status) }}>
                          {ticket.status}
                        </span>
                      </div>
                      
                      <div className="detail-item">
                        <label>Priority</label>
                        <span className="priority-badge" style={{ background: getPriorityColor(ticket.priority) }}>
                          {ticket.priority}
                        </span>
                      </div>
                      
                      <div className="detail-item">
                        <label>Category</label>
                        <span>{ticket.category}</span>
                      </div>
                      
                      <div className="detail-item">
                        <label>Assigned To</label>
                        <span>{ticket.assignedTo}</span>
                      </div>
                      
                      <div className="detail-item">
                        <label>Created</label>
                        <span>{ticket.date}</span>
                      </div>
                      
                      <div className="detail-item">
                        <label>SLA Deadline</label>
                        <span className={new Date(ticket.slaDeadline) < new Date() && ticket.status !== 'CLOSED' ? 'sla-overdue' : ''}>
                          {ticket.slaDeadline}
                        </span>
                      </div>
                      
                      <div className="detail-item">
                        <label>Time Spent</label>
                        <span>{ticket.timeSpent || 0} minutes</span>
                        <div className="time-controls">
                          <button onClick={() => updateTimeSpent(ticket.id, 15)}>+15m</button>
                          <button onClick={() => updateTimeSpent(ticket.id, 30)}>+30m</button>
                          <button onClick={() => updateTimeSpent(ticket.id, 60)}>+1h</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="detail-item full-width">
                      <label>Description</label>
                      <p>{ticket.description || 'No description provided'}</p>
                    </div>
                    
                    {/* Comments Section */}
                    <div className="comments-section">
                      <h3>Comments</h3>
                      <div className="comments-list">
                        {ticket.comments && ticket.comments.map(comment => (
                          <div key={comment.id} className="comment">
                            <div className="comment-header">
                              <strong>{comment.user}</strong>
                              <span>{comment.date}</span>
                            </div>
                            <p>{comment.text}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="add-comment">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              addComment(ticket.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="modal-actions">
                      <button className="action-btn change" onClick={() => {
                        handleChangeStatus(ticket.id);
                        setSelectedTicket(null);
                      }}>
                        🔄 Change Status
                      </button>
                      <button className="action-btn delete" onClick={() => {
                        handleDelete(ticket.id);
                        setSelectedTicket(null);
                      }}>
                        🗑️ Delete Ticket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Tickets;
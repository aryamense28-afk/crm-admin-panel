import React, { useState, useEffect } from "react";
import "./mobilecrm.css";

function MobileCRM() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState("lead");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [pullToRefresh, setPullToRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offlineMode, setOfflineMode] = useState(!navigator.onLine);
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());

  // Load data from localStorage on mount
  useEffect(() => {
    loadData();
    
    // Monitor online/offline status
    const handleOnline = () => setOfflineMode(false);
    const handleOffline = () => setOfflineMode(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveData();
  }, [leads, deals, tasks, contacts]);

  const loadData = () => {
    const savedLeads = localStorage.getItem("mobile_leads");
    const savedDeals = localStorage.getItem("mobile_deals");
    const savedTasks = localStorage.getItem("mobile_tasks");
    const savedContacts = localStorage.getItem("mobile_contacts");

    setLeads(savedLeads ? JSON.parse(savedLeads) : generateSampleLeads());
    setDeals(savedDeals ? JSON.parse(savedDeals) : generateSampleDeals());
    setTasks(savedTasks ? JSON.parse(savedTasks) : generateSampleTasks());
    setContacts(savedContacts ? JSON.parse(savedContacts) : generateSampleContacts());
  };

  const saveData = () => {
    localStorage.setItem("mobile_leads", JSON.stringify(leads));
    localStorage.setItem("mobile_deals", JSON.stringify(deals));
    localStorage.setItem("mobile_tasks", JSON.stringify(tasks));
    localStorage.setItem("mobile_contacts", JSON.stringify(contacts));
  };

  const generateSampleLeads = () => [
    { id: 1, name: "John Smith", company: "Acme Corp", value: 50000, status: "new", phone: "+1 234-567-890", email: "john@acme.com", lastContact: "2026-03-15" },
    { id: 2, name: "Sarah Johnson", company: "TechStart", value: 25000, status: "contacted", phone: "+1 234-567-891", email: "sarah@techstart.com", lastContact: "2026-03-14" },
    { id: 3, name: "Mike Wilson", company: "Global Inc", value: 75000, status: "qualified", phone: "+1 234-567-892", email: "mike@global.com", lastContact: "2026-03-13" }
  ];

  const generateSampleDeals = () => [
    { id: 1, name: "Enterprise License", company: "Acme Corp", value: 50000, stage: "negotiation", probability: 80, closeDate: "2026-04-15" },
    { id: 2, name: "Consulting Project", company: "TechStart", value: 25000, stage: "proposal", probability: 60, closeDate: "2026-04-20" },
    { id: 3, name: "Product Demo", company: "Global Inc", value: 15000, stage: "lead", probability: 30, closeDate: "2026-04-25" }
  ];

  const generateSampleTasks = () => [
    { id: 1, title: "Call John Smith", dueDate: "2026-03-18", priority: "high", status: "pending", type: "call" },
    { id: 2, title: "Send proposal to Sarah", dueDate: "2026-03-19", priority: "medium", status: "pending", type: "email" },
    { id: 3, title: "Follow up with Mike", dueDate: "2026-03-17", priority: "high", status: "completed", type: "meeting" }
  ];

  const generateSampleContacts = () => [
    { id: 1, name: "John Smith", company: "Acme Corp", phone: "+1 234-567-890", email: "john@acme.com", role: "CEO" },
    { id: 2, name: "Sarah Johnson", company: "TechStart", phone: "+1 234-567-891", email: "sarah@techstart.com", role: "CTO" },
    { id: 3, name: "Mike Wilson", company: "Global Inc", phone: "+1 234-567-892", email: "mike@global.com", role: "Director" }
  ];

  const addItem = (item) => {
    const newItem = { id: Date.now(), ...item };
    
    switch(formType) {
      case "lead":
        setLeads([...leads, newItem]);
        addNotification("Lead added successfully");
        break;
      case "deal":
        setDeals([...deals, newItem]);
        addNotification("Deal added successfully");
        break;
      case "task":
        setTasks([...tasks, newItem]);
        addNotification("Task added successfully");
        break;
      case "contact":
        setContacts([...contacts, newItem]);
        addNotification("Contact added successfully");
        break;
      default:
        break;
    }
    
    setShowAddForm(false);
  };

  const deleteItem = (type, id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      switch(type) {
        case "lead":
          setLeads(leads.filter(l => l.id !== id));
          break;
        case "deal":
          setDeals(deals.filter(d => d.id !== id));
          break;
        case "task":
          setTasks(tasks.filter(t => t.id !== id));
          break;
        case "contact":
          setContacts(contacts.filter(c => c.id !== id));
          break;
        default:
          break;
      }
      addNotification("Item deleted");
    }
  };

  const updateTaskStatus = (taskId, status) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
    addNotification("Task updated");
  };

  const updateLeadStatus = (leadId, status) => {
    setLeads(leads.map(l => l.id === leadId ? { ...l, status } : l));
    addNotification("Lead status updated");
  };

  const addNotification = (message) => {
    const newNotif = {
      id: Date.now(),
      message,
      time: new Date().toLocaleTimeString(),
      read: false
    };
    setNotifications([newNotif, ...notifications].slice(0, 20));
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 3000);
  };

  const markNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handlePullToRefresh = (e) => {
    const startY = e.touches[0].clientY;
    
    const handleTouchMove = (e) => {
      const currentY = e.touches[0].clientY;
      if (currentY - startY > 100 && !pullToRefresh) {
        setPullToRefresh(true);
      }
    };
    
    const handleTouchEnd = () => {
      if (pullToRefresh) {
        setLoading(true);
        setTimeout(() => {
          loadData();
          setPullToRefresh(false);
          setLoading(false);
          addNotification("Data refreshed");
        }, 1000);
      }
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handleWhatsApp = (phone) => {
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`);
  };

  const handleMap = (address) => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
  };

  const filteredItems = () => {
    const query = searchQuery.toLowerCase();
    
    switch(activeTab) {
      case "leads":
        return leads.filter(l => 
          l.name.toLowerCase().includes(query) ||
          l.company.toLowerCase().includes(query)
        );
      case "deals":
        return deals.filter(d => 
          d.name.toLowerCase().includes(query) ||
          d.company.toLowerCase().includes(query)
        );
      case "tasks":
        return tasks.filter(t => 
          t.title.toLowerCase().includes(query)
        );
      case "contacts":
        return contacts.filter(c => 
          c.name.toLowerCase().includes(query) ||
          c.company.toLowerCase().includes(query)
        );
      default:
        return [];
    }
  };

  const getStats = () => {
    return {
      totalLeads: leads.length,
      newLeads: leads.filter(l => l.status === "new").length,
      totalDeals: deals.length,
      dealsValue: deals.reduce((sum, d) => sum + d.value, 0),
      pendingTasks: tasks.filter(t => t.status === "pending").length,
      totalContacts: contacts.length
    };
  };

  const stats = getStats();
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="mobile-crm" onTouchStart={handlePullToRefresh}>
      
      {/* Pull to Refresh Indicator */}
      {pullToRefresh && (
        <div className="refresh-indicator">
          <div className="spinner"></div>
          <span>Refreshing...</span>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Offline Banner */}
      {offlineMode && (
        <div className="offline-banner">
          📴 You are offline. Changes will sync when connection is restored.
        </div>
      )}

      {/* Header */}
      <div className="mobile-header">
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
        <h2>📱 Mobile CRM</h2>
        <div className="header-icons">
          <button className="notif-btn" onClick={markNotificationsRead}>
            🔔
            {unreadNotifications > 0 && (
              <span className="notif-badge">{unreadNotifications}</span>
            )}
          </button>
          <button className="sync-btn" onClick={() => {
            loadData();
            addNotification("Data synced");
          }}>
            🔄
          </button>
        </div>
      </div>

      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <div className="notifications-panel">
          {notifications.map(notif => (
            <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
              <span className="notif-message">{notif.message}</span>
              <span className="notif-time">{notif.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <a href="#" onClick={() => { setActiveTab("dashboard"); setMenuOpen(false); }}>
            📊 Dashboard
          </a>
          <a href="#" onClick={() => { setActiveTab("leads"); setMenuOpen(false); }}>
            🎯 Leads ({stats.totalLeads})
          </a>
          <a href="#" onClick={() => { setActiveTab("deals"); setMenuOpen(false); }}>
            💰 Deals ({stats.totalDeals})
          </a>
          <a href="#" onClick={() => { setActiveTab("tasks"); setMenuOpen(false); }}>
            ✅ Tasks ({stats.pendingTasks})
          </a>
          <a href="#" onClick={() => { setActiveTab("contacts"); setMenuOpen(false); }}>
            👥 Contacts ({stats.totalContacts})
          </a>
          <a href="#" onClick={() => { setActiveTab("analytics"); setMenuOpen(false); }}>
            📈 Analytics
          </a>
          <div className="menu-footer">
            <span>Last sync: {lastSync}</span>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {activeTab !== "dashboard" && activeTab !== "analytics" && (
        <div className="search-bar">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className="mobile-content">
        {activeTab === "dashboard" && (
          <div className="mobile-dashboard">
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card" onClick={() => setActiveTab("leads")}>
                <span className="stat-icon">🎯</span>
                <span className="stat-value">{stats.totalLeads}</span>
                <span className="stat-label">Leads</span>
              </div>
              <div className="stat-card" onClick={() => setActiveTab("deals")}>
                <span className="stat-icon">💰</span>
                <span className="stat-value">${stats.dealsValue.toLocaleString()}</span>
                <span className="stat-label">Deals</span>
              </div>
              <div className="stat-card" onClick={() => setActiveTab("tasks")}>
                <span className="stat-icon">✅</span>
                <span className="stat-value">{stats.pendingTasks}</span>
                <span className="stat-label">Tasks</span>
              </div>
              <div className="stat-card" onClick={() => setActiveTab("contacts")}>
                <span className="stat-icon">👥</span>
                <span className="stat-value">{stats.totalContacts}</span>
                <span className="stat-label">Contacts</span>
              </div>
            </div>

            {/* Recent Items */}
            <div className="recent-section">
              <h3>Recent Leads</h3>
              {leads.slice(0, 3).map(lead => (
                <div key={lead.id} className="recent-item" onClick={() => {
                  setSelectedItem(lead);
                  setFormType("lead");
                  setShowDetails(true);
                }}>
                  <span className="item-name">{lead.name}</span>
                  <span className="item-company">{lead.company}</span>
                  <span className={`status-badge ${lead.status}`}>{lead.status}</span>
                </div>
              ))}
            </div>

            <div className="recent-section">
              <h3>Today's Tasks</h3>
              {tasks.filter(t => t.status === "pending").slice(0, 3).map(task => (
                <div key={task.id} className="recent-item">
                  <span className="item-name">{task.title}</span>
                  <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => updateTaskStatus(task.id, task.status === "pending" ? "completed" : "pending")}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "leads" && (
          <div className="list-view">
            <div className="list-header">
              <h3>Leads</h3>
              <button className="add-btn" onClick={() => {
                setFormType("lead");
                setShowAddForm(true);
              }}>+ Add Lead</button>
            </div>
            {filteredItems().map(lead => (
              <div key={lead.id} className="list-item" onClick={() => {
                setSelectedItem(lead);
                setFormType("lead");
                setShowDetails(true);
              }}>
                <div className="item-main">
                  <span className="item-title">{lead.name}</span>
                  <span className="item-subtitle">{lead.company}</span>
                </div>
                <div className="item-details">
                  <span className="item-value">${lead.value}</span>
                  <span className={`status-badge ${lead.status}`}>{lead.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "deals" && (
          <div className="list-view">
            <div className="list-header">
              <h3>Deals</h3>
              <button className="add-btn" onClick={() => {
                setFormType("deal");
                setShowAddForm(true);
              }}>+ Add Deal</button>
            </div>
            {filteredItems().map(deal => (
              <div key={deal.id} className="list-item" onClick={() => {
                setSelectedItem(deal);
                setFormType("deal");
                setShowDetails(true);
              }}>
                <div className="item-main">
                  <span className="item-title">{deal.name}</span>
                  <span className="item-subtitle">{deal.company}</span>
                </div>
                <div className="item-details">
                  <span className="item-value">${deal.value}</span>
                  <span className="probability-badge">{deal.probability}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="list-view">
            <div className="list-header">
              <h3>Tasks</h3>
              <button className="add-btn" onClick={() => {
                setFormType("task");
                setShowAddForm(true);
              }}>+ Add Task</button>
            </div>
            {filteredItems().map(task => (
              <div key={task.id} className="list-item">
                <div className="item-main">
                  <span className="item-title">{task.title}</span>
                  <span className="item-subtitle">Due: {task.dueDate}</span>
                </div>
                <div className="item-details">
                  <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => updateTaskStatus(task.id, task.status === "pending" ? "completed" : "pending")}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="list-view">
            <div className="list-header">
              <h3>Contacts</h3>
              <button className="add-btn" onClick={() => {
                setFormType("contact");
                setShowAddForm(true);
              }}>+ Add Contact</button>
            </div>
            {filteredItems().map(contact => (
              <div key={contact.id} className="list-item" onClick={() => {
                setSelectedItem(contact);
                setFormType("contact");
                setShowDetails(true);
              }}>
                <div className="item-main">
                  <span className="item-title">{contact.name}</span>
                  <span className="item-subtitle">{contact.company}</span>
                </div>
                <div className="contact-actions">
                  <button className="action-btn" onClick={(e) => {
                    e.stopPropagation();
                    handleCall(contact.phone);
                  }}>📞</button>
                  <button className="action-btn" onClick={(e) => {
                    e.stopPropagation();
                    handleEmail(contact.email);
                  }}>📧</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="analytics-view">
            <h3>Analytics</h3>
            
            <div className="chart-card">
              <h4>Leads by Status</h4>
              <div className="status-breakdown">
                <div className="status-item">
                  <span className="status-label">New</span>
                  <span className="status-count">{leads.filter(l => l.status === "new").length}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Contacted</span>
                  <span className="status-count">{leads.filter(l => l.status === "contacted").length}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Qualified</span>
                  <span className="status-count">{leads.filter(l => l.status === "qualified").length}</span>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h4>Deal Pipeline</h4>
              <div className="pipeline-stages">
                {["lead", "proposal", "negotiation"].map(stage => {
                  const stageDeals = deals.filter(d => d.stage === stage);
                  const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
                  return (
                    <div key={stage} className="pipeline-item">
                      <span className="stage-name">{stage}</span>
                      <span className="stage-count">{stageDeals.length}</span>
                      <span className="stage-value">${stageValue.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="chart-card">
              <h4>Task Completion</h4>
              <div className="completion-stats">
                <div className="progress-circle">
                  <svg viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#667eea"
                      strokeWidth="3"
                      strokeDasharray={`${(tasks.filter(t => t.status === "completed").length / tasks.length) * 100 || 0}, 100`}
                    />
                  </svg>
                  <div className="percentage">
                    {Math.round((tasks.filter(t => t.status === "completed").length / tasks.length) * 100) || 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action FAB */}
      {activeTab !== "dashboard" && (
        <button className="fab" onClick={() => setShowAddForm(true)}>
          +
        </button>
      )}

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="modal" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Add New {formType}</h3>
            <AddForm
              type={formType}
              onSubmit={addItem}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedItem && (
        <div className="modal" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{formType === "lead" ? "Lead" : formType === "deal" ? "Deal" : formType === "task" ? "Task" : "Contact"} Details</h3>
            <DetailsView
              item={selectedItem}
              type={formType}
              onCall={handleCall}
              onEmail={handleEmail}
              onWhatsApp={handleWhatsApp}
              onMap={handleMap}
              onDelete={() => {
                deleteItem(formType, selectedItem.id);
                setShowDetails(false);
              }}
              onStatusChange={formType === "lead" ? updateLeadStatus : null}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Add Form Component
function AddForm({ type, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderFields = () => {
    switch(type) {
      case "lead":
        return (
          <>
            <input
              type="text"
              placeholder="Name *"
              required
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input
              type="text"
              placeholder="Company"
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
            <input
              type="number"
              placeholder="Value"
              onChange={(e) => setFormData({...formData, value: parseInt(e.target.value)})}
            />
            <input
              type="tel"
              placeholder="Phone"
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <select onChange={(e) => setFormData({...formData, status: e.target.value})}>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
            </select>
          </>
        );
      case "deal":
        return (
          <>
            <input
              type="text"
              placeholder="Deal Name *"
              required
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input
              type="text"
              placeholder="Company"
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
            <input
              type="number"
              placeholder="Value"
              onChange={(e) => setFormData({...formData, value: parseInt(e.target.value)})}
            />
            <select onChange={(e) => setFormData({...formData, stage: e.target.value})}>
              <option value="lead">Lead</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
            </select>
            <input
              type="number"
              placeholder="Probability %"
              min="0"
              max="100"
              onChange={(e) => setFormData({...formData, probability: parseInt(e.target.value)})}
            />
            <input
              type="date"
              placeholder="Close Date"
              onChange={(e) => setFormData({...formData, closeDate: e.target.value})}
            />
          </>
        );
      case "task":
        return (
          <>
            <input
              type="text"
              placeholder="Task Title *"
              required
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <input
              type="date"
              placeholder="Due Date"
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            />
            <select onChange={(e) => setFormData({...formData, priority: e.target.value})}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </>
        );
      case "contact":
        return (
          <>
            <input
              type="text"
              placeholder="Name *"
              required
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input
              type="text"
              placeholder="Company"
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
            <input
              type="tel"
              placeholder="Phone"
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input
              type="text"
              placeholder="Role"
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      {renderFields()}
      <div className="form-actions">
        <button type="submit" className="save-btn">Save</button>
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// Details View Component
function DetailsView({ item, type, onCall, onEmail, onWhatsApp, onMap, onDelete, onStatusChange }) {
  return (
    <div className="details-view">
      {type === "lead" && (
        <>
          <div className="detail-row">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{item.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Company:</span>
            <span className="detail-value">{item.company}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Value:</span>
            <span className="detail-value">${item.value}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <select
              value={item.status}
              onChange={(e) => onStatusChange(item.id, e.target.value)}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
            </select>
          </div>
        </>
      )}

      {type === "deal" && (
        <>
          <div className="detail-row">
            <span className="detail-label">Deal:</span>
            <span className="detail-value">{item.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Company:</span>
            <span className="detail-value">{item.company}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Value:</span>
            <span className="detail-value">${item.value}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Stage:</span>
            <span className="detail-value">{item.stage}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Probability:</span>
            <span className="detail-value">{item.probability}%</span>
          </div>
        </>
      )}

      {type === "task" && (
        <>
          <div className="detail-row">
            <span className="detail-label">Task:</span>
            <span className="detail-value">{item.title}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Due Date:</span>
            <span className="detail-value">{item.dueDate}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Priority:</span>
            <span className={`priority-badge ${item.priority}`}>{item.priority}</span>
          </div>
        </>
      )}

      {type === "contact" && (
        <>
          <div className="detail-row">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{item.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Company:</span>
            <span className="detail-value">{item.company}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Role:</span>
            <span className="detail-value">{item.role}</span>
          </div>
        </>
      )}

      {/* Contact Actions */}
      {item.phone && (
        <div className="contact-actions-large">
          <button onClick={() => onCall(item.phone)} className="contact-btn call">
            📞 Call
          </button>
          <button onClick={() => onWhatsApp(item.phone)} className="contact-btn whatsapp">
            📱 WhatsApp
          </button>
        </div>
      )}
      
      {item.email && (
        <div className="contact-actions-large">
          <button onClick={() => onEmail(item.email)} className="contact-btn email">
            📧 Email
          </button>
        </div>
      )}

      {/* Delete Button */}
      <button className="delete-btn-large" onClick={onDelete}>
        🗑️ Delete
      </button>
    </div>
  );
}

export default MobileCRM;
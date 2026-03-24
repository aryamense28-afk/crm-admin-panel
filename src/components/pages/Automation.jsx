import React, { useState, useEffect } from "react";
import "./Automation.css";

function Automation() {
  const [agents, setAgents] = useState([
    { id: 1, name: "John", email: "john@crm.com", role: "Senior", workload: 0, maxLoad: 10, skills: ["sales", "support"], active: true },
    { id: 2, name: "Sarah", email: "sarah@crm.com", role: "Lead", workload: 0, maxLoad: 15, skills: ["sales", "negotiation"], active: true },
    { id: 3, name: "Mike", email: "mike@crm.com", role: "Junior", workload: 0, maxLoad: 8, skills: ["support"], active: true },
    { id: 4, name: "Emma", email: "emma@crm.com", role: "Senior", workload: 0, maxLoad: 12, skills: ["sales", "enterprise"], active: false },
    { id: 5, name: "Alex", email: "alex@crm.com", role: "Junior", workload: 0, maxLoad: 8, skills: ["support", "technical"], active: true }
  ]);

  const [leads, setLeads] = useState([
    { id: 1, name: "Lead A", email: "leadA@example.com", source: "Website", value: 5000, priority: "high", status: "new", createdAt: "2026-03-15", region: "North", type: "enterprise" },
    { id: 2, name: "Lead B", email: "leadB@example.com", source: "Referral", value: 3000, priority: "medium", status: "contacted", createdAt: "2026-03-14", region: "South", type: "small" },
    { id: 3, name: "Lead C", email: "leadC@example.com", source: "LinkedIn", value: 8000, priority: "high", status: "new", createdAt: "2026-03-16", region: "West", type: "enterprise" },
    { id: 4, name: "Lead D", email: "leadD@example.com", source: "Website", value: 2000, priority: "low", status: "new", createdAt: "2026-03-13", region: "East", type: "startup" },
    { id: 5, name: "Lead E", email: "leadE@example.com", source: "Event", value: 6000, priority: "medium", status: "qualified", createdAt: "2026-03-12", region: "North", type: "mid" }
  ]);

  const [tasks, setTasks] = useState([]);
  const [workflows, setWorkflows] = useState([
    { id: 1, name: "Welcome Email", trigger: "new_lead", action: "send_email", template: "welcome", active: true },
    { id: 2, name: "Assign to Sales", trigger: "high_priority", action: "assign_agent", condition: "priority=high", active: true },
    { id: 3, name: "Follow-up Task", trigger: "no_response", action: "create_task", delay: 24, active: false }
  ]);

  const [automationRules, setAutomationRules] = useState([
    { id: 1, name: "Round Robin", type: "assignment", active: true, config: {} },
    { id: 2, name: "Skill-based", type: "assignment", active: false, config: {} },
    { id: 3, name: "Workload Balance", type: "assignment", active: true, config: { threshold: 80 } }
  ]);

  const [selectedRule, setSelectedRule] = useState("round-robin");
  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: "", email: "", role: "Junior", maxLoad: 10, skills: [] });
  const [newLead, setNewLead] = useState({ name: "", email: "", source: "Website", value: "", priority: "medium", region: "North", type: "small" });
  const [newWorkflow, setNewWorkflow] = useState({ name: "", trigger: "new_lead", action: "send_email", template: "", active: true });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [timeRange, setTimeRange] = useState("today");
  const [autoMode, setAutoMode] = useState(true);
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [notification, setNotification] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const savedAgents = localStorage.getItem("crm_agents");
    const savedLeads = localStorage.getItem("crm_leads");
    const savedRules = localStorage.getItem("crm_rules");
    
    if (savedAgents) setAgents(JSON.parse(savedAgents));
    if (savedLeads) setLeads(JSON.parse(savedLeads));
    if (savedRules) setAutomationRules(JSON.parse(savedRules));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("crm_agents", JSON.stringify(agents));
    localStorage.setItem("crm_leads", JSON.stringify(leads));
    localStorage.setItem("crm_rules", JSON.stringify(automationRules));
  }, [agents, leads, automationRules]);

  // Auto assignment every minute if auto mode is on
  useEffect(() => {
    if (!autoMode) return;

    const interval = setInterval(() => {
      const newLeads = leads.filter(l => !l.agent && l.status === "new");
      if (newLeads.length > 0) {
        autoAssignLeads();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [autoMode, leads]);

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Round Robin Assignment
  const roundRobinAssign = () => {
    const activeAgents = agents.filter(a => a.active);
    if (activeAgents.length === 0) {
      showNotification("No active agents available", "error");
      return;
    }

    const unassignedLeads = leads.filter(l => !l.agent);
    const assigned = [...leads];

    unassignedLeads.forEach((lead, index) => {
      const agentIndex = index % activeAgents.length;
      const agent = activeAgents[agentIndex];
      
      const leadIndex = assigned.findIndex(l => l.id === lead.id);
      assigned[leadIndex] = { ...lead, agent: agent.name };
      
      // Update agent workload
      setAgents(prev => prev.map(a => 
        a.id === agent.id ? { ...a, workload: a.workload + 1 } : a
      ));
    });

    setLeads(assigned);
    recordAssignment(unassignedLeads.length, "round-robin");
    showNotification(`Assigned ${unassignedLeads.length} leads using Round Robin`);
  };

  // Skill-based Assignment
  const skillBasedAssign = () => {
    const unassignedLeads = leads.filter(l => !l.agent);
    const assigned = [...leads];

    unassignedLeads.forEach(lead => {
      // Find agent with matching skills based on lead type
      const requiredSkill = lead.type === "enterprise" ? "enterprise" : 
                           lead.type === "support" ? "support" : "sales";
      
      const availableAgents = agents.filter(a => 
        a.active && a.skills.includes(requiredSkill) && a.workload < a.maxLoad
      );

      if (availableAgents.length > 0) {
        // Pick agent with lowest workload
        const agent = availableAgents.reduce((prev, curr) => 
          prev.workload < curr.workload ? prev : curr
        );

        const leadIndex = assigned.findIndex(l => l.id === lead.id);
        assigned[leadIndex] = { ...lead, agent: agent.name };
        
        setAgents(prev => prev.map(a => 
          a.id === agent.id ? { ...a, workload: a.workload + 1 } : a
        ));
      }
    });

    setLeads(assigned);
    const assignedCount = assigned.filter(l => l.agent).length - leads.filter(l => l.agent).length;
    recordAssignment(assignedCount, "skill-based");
    showNotification(`Assigned ${assignedCount} leads using Skill-based matching`);
  };

  // Workload Balance Assignment
  const workloadBalanceAssign = () => {
    const unassignedLeads = leads.filter(l => !l.agent);
    const assigned = [...leads];

    unassignedLeads.forEach(lead => {
      // Find agent with lowest workload
      const availableAgents = agents.filter(a => a.active && a.workload < a.maxLoad);
      
      if (availableAgents.length > 0) {
        const agent = availableAgents.reduce((prev, curr) => 
          (prev.workload / prev.maxLoad) < (curr.workload / curr.maxLoad) ? prev : curr
        );

        const leadIndex = assigned.findIndex(l => l.id === lead.id);
        assigned[leadIndex] = { ...lead, agent: agent.name };
        
        setAgents(prev => prev.map(a => 
          a.id === agent.id ? { ...a, workload: a.workload + 1 } : a
        ));
      }
    });

    setLeads(assigned);
    const assignedCount = assigned.filter(l => l.agent).length - leads.filter(l => l.agent).length;
    recordAssignment(assignedCount, "workload-balance");
    showNotification(`Assigned ${assignedCount} leads using Workload Balance`);
  };

  // Auto assign based on selected rule
  const autoAssignLeads = () => {
    switch(selectedRule) {
      case "round-robin":
        roundRobinAssign();
        break;
      case "skill-based":
        skillBasedAssign();
        break;
      case "workload":
        workloadBalanceAssign();
        break;
      default:
        roundRobinAssign();
    }
  };

  // Record assignment history
  const recordAssignment = (count, method) => {
    const record = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      leadsAssigned: count,
      method: method,
      agentsUsed: agents.filter(a => a.active).length
    };
    setAssignmentHistory(prev => [record, ...prev].slice(0, 50));
  };

  // Execute workflow
  const executeWorkflow = (workflow, lead) => {
    switch(workflow.action) {
      case "send_email":
        sendAutomatedEmail(lead, workflow.template);
        break;
      case "create_task":
        createFollowupTask(lead, workflow.delay);
        break;
      case "update_status":
        updateLeadStatus(lead, "qualified");
        break;
      default:
        console.log("Unknown action");
    }
  };

  // Send automated email
  const sendAutomatedEmail = (lead, template) => {
    const emailTask = {
      id: Date.now(),
      type: "email",
      to: lead.email,
      template: template,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, emailTask]);
    showNotification(`Email queued for ${lead.name}`);
  };

  // Create follow-up task
  const createFollowupTask = (lead, delayHours) => {
    const dueDate = new Date();
    dueDate.setHours(dueDate.getHours() + delayHours);

    const task = {
      id: Date.now(),
      title: `Follow up with ${lead.name}`,
      leadId: lead.id,
      dueDate: dueDate.toISOString(),
      status: "pending",
      type: "followup"
    };
    setTasks(prev => [...prev, task]);
  };

  // Update lead status
  const updateLeadStatus = (lead, status) => {
    setLeads(prev => prev.map(l =>
      l.id === lead.id ? { ...l, status } : l
    ));
  };

  // Add new agent
  const addAgent = () => {
    if (!newAgent.name) return;

    const agent = {
      id: Date.now(),
      ...newAgent,
      workload: 0,
      active: true,
      skills: newAgent.skills.split(',').map(s => s.trim()).filter(s => s)
    };

    setAgents([...agents, agent]);
    setNewAgent({ name: "", email: "", role: "Junior", maxLoad: 10, skills: [] });
    setShowAddAgent(false);
    showNotification(`Agent ${agent.name} added`);
  };

  // Add new lead
  const addLead = () => {
    if (!newLead.name) return;

    const lead = {
      id: Date.now(),
      ...newLead,
      value: parseInt(newLead.value) || 0,
      status: "new",
      createdAt: new Date().toISOString().split('T')[0]
    };

    setLeads([...leads, lead]);
    setNewLead({ name: "", email: "", source: "Website", value: "", priority: "medium", region: "North", type: "small" });
    setShowAddLead(false);
    showNotification(`Lead ${lead.name} added`);
  };

  // Add workflow
  const addWorkflow = () => {
    if (!newWorkflow.name) return;

    const workflow = {
      id: Date.now(),
      ...newWorkflow,
      active: true
    };

    setWorkflows([...workflows, workflow]);
    setNewWorkflow({ name: "", trigger: "new_lead", action: "send_email", template: "", active: true });
    setShowWorkflow(false);
    showNotification(`Workflow ${workflow.name} created`);
  };

  // Toggle agent active status
  const toggleAgentActive = (agentId) => {
    setAgents(prev => prev.map(a =>
      a.id === agentId ? { ...a, active: !a.active } : a
    ));
    showNotification("Agent status updated");
  };

  // Delete agent
  const deleteAgent = (agentId) => {
    if (window.confirm("Are you sure you want to remove this agent?")) {
      setAgents(prev => prev.filter(a => a.id !== agentId));
      showNotification("Agent removed");
    }
  };

  // Delete lead
  const deleteLead = (leadId) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      setLeads(prev => prev.filter(l => l.id !== leadId));
      showNotification("Lead deleted");
    }
  };

  // Reset all assignments
  const resetAssignments = () => {
    if (window.confirm("This will unassign all leads. Continue?")) {
      setLeads(prev => prev.map(l => ({ ...l, agent: undefined })));
      setAgents(prev => prev.map(a => ({ ...a, workload: 0 })));
      showNotification("All assignments reset");
    }
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return lead.name.toLowerCase().includes(term) ||
             lead.email?.toLowerCase().includes(term) ||
             lead.agent?.toLowerCase().includes(term);
    }
    if (filterStatus !== "all") {
      return lead.status === filterStatus;
    }
    return true;
  });

  // Calculate stats
  const stats = {
    totalLeads: leads.length,
    assignedLeads: leads.filter(l => l.agent).length,
    unassignedLeads: leads.filter(l => !l.agent).length,
    activeAgents: agents.filter(a => a.active).length,
    totalWorkload: agents.reduce((sum, a) => sum + a.workload, 0),
    avgWorkload: agents.length > 0 ? 
      (agents.reduce((sum, a) => sum + (a.workload / a.maxLoad) * 100, 0) / agents.length).toFixed(1) : 0,
    highPriorityLeads: leads.filter(l => l.priority === "high").length,
    todayLeads: leads.filter(l => l.createdAt === new Date().toISOString().split('T')[0]).length
  };

  return (
    <div className="automation-container">
      {/* Header */}
      <div className="automation-header">
        <div className="header-left">
          <h1>
            <span className="header-icon">⚡</span>
            CRM Automation
          </h1>
          <p className="header-subtitle">Automate lead assignment and workflows</p>
        </div>

        <div className="header-actions">
          <div className="auto-mode-toggle">
            <label className="switch">
              <input
                type="checkbox"
                checked={autoMode}
                onChange={() => setAutoMode(!autoMode)}
              />
              <span className="slider"></span>
            </label>
            <span>Auto Mode {autoMode ? 'ON' : 'OFF'}</span>
          </div>

          <button className="reset-btn" onClick={resetAssignments}>
            🔄 Reset All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">Total Leads</span>
            <span className="stat-value">{stats.totalLeads}</span>
          </div>
        </div>

        <div className="stat-card assigned">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-label">Assigned</span>
            <span className="stat-value">{stats.assignedLeads}</span>
          </div>
        </div>

        <div className="stat-card unassigned">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <span className="stat-label">Unassigned</span>
            <span className="stat-value">{stats.unassignedLeads}</span>
          </div>
        </div>

        <div className="stat-card agents">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <span className="stat-label">Active Agents</span>
            <span className="stat-value">{stats.activeAgents}</span>
          </div>
        </div>

        <div className="stat-card workload">
          <div className="stat-icon">⚖️</div>
          <div className="stat-content">
            <span className="stat-label">Avg Workload</span>
            <span className="stat-value">{stats.avgWorkload}%</span>
          </div>
        </div>

        <div className="stat-card high">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <span className="stat-label">High Priority</span>
            <span className="stat-value">{stats.highPriorityLeads}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="automation-grid">
        {/* Left Column - Controls */}
        <div className="controls-column">
          {/* Assignment Rules */}
          <div className="card">
            <h3>🤖 Assignment Rules</h3>
            <div className="rule-selector">
              <button
                className={`rule-btn ${selectedRule === 'round-robin' ? 'active' : ''}`}
                onClick={() => setSelectedRule('round-robin')}
              >
                🔄 Round Robin
              </button>
              <button
                className={`rule-btn ${selectedRule === 'skill-based' ? 'active' : ''}`}
                onClick={() => setSelectedRule('skill-based')}
              >
                🎯 Skill-based
              </button>
              <button
                className={`rule-btn ${selectedRule === 'workload' ? 'active' : ''}`}
                onClick={() => setSelectedRule('workload')}
              >
                ⚖️ Workload Balance
              </button>
            </div>

            <button className="assign-btn" onClick={autoAssignLeads}>
              ⚡ Auto Assign Now
            </button>

            <div className="schedule-control">
              <label>Schedule Time:</label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3>⚡ Quick Actions</h3>
            <div className="quick-actions">
              <button onClick={() => setShowAddAgent(true)}>➕ Add Agent</button>
              <button onClick={() => setShowAddLead(true)}>➕ Add Lead</button>
              <button onClick={() => setShowWorkflow(true)}>🔧 New Workflow</button>
            </div>
          </div>

          {/* Workflows */}
          <div className="card">
            <h3>🔧 Active Workflows</h3>
            <div className="workflow-list">
              {workflows.filter(w => w.active).map(workflow => (
                <div key={workflow.id} className="workflow-item">
                  <span className="workflow-name">{workflow.name}</span>
                  <span className="workflow-trigger">⚡ {workflow.trigger}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agents List */}
          <div className="card">
            <h3>👥 Agents ({agents.length})</h3>
            <div className="agents-list">
              {agents.map(agent => (
                <div key={agent.id} className={`agent-item ${!agent.active ? 'inactive' : ''}`}>
                  <div className="agent-info">
                    <span className="agent-name">{agent.name}</span>
                    <span className="agent-role">{agent.role}</span>
                  </div>
                  <div className="agent-workload">
                    <div className="workload-bar">
                      <div 
                        className="workload-fill"
                        style={{ width: `${(agent.workload / agent.maxLoad) * 100}%` }}
                      ></div>
                    </div>
                    <span className="workload-text">{agent.workload}/{agent.maxLoad}</span>
                  </div>
                  <div className="agent-actions">
                    <button 
                      className={`toggle-btn ${agent.active ? 'active' : ''}`}
                      onClick={() => toggleAgentActive(agent.id)}
                    >
                      {agent.active ? '🟢' : '🔴'}
                    </button>
                    <button 
                      className="delete-btn-small"
                      onClick={() => deleteAgent(agent.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Leads */}
        <div className="leads-column">
          <div className="card">
            <div className="leads-header">
              <h3>📋 Leads Management</h3>
              <div className="leads-controls">
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                </select>
              </div>
            </div>

            <div className="leads-list">
              {filteredLeads.map(lead => (
                <div key={lead.id} className={`lead-item ${lead.priority}`}>
                  <div className="lead-header">
                    <span className="lead-name">{lead.name}</span>
                    <span className={`priority-badge ${lead.priority}`}>
                      {lead.priority}
                    </span>
                  </div>
                  
                  <div className="lead-details">
                    <span className="lead-email">📧 {lead.email}</span>
                    <span className="lead-value">💰 ${lead.value}</span>
                    <span className="lead-source">📌 {lead.source}</span>
                  </div>

                  <div className="lead-footer">
                    <span className={`status-badge ${lead.status}`}>
                      {lead.status}
                    </span>
                    <span className="lead-agent">
                      👤 {lead.agent || 'Unassigned'}
                    </span>
                    <button 
                      className="delete-lead-btn"
                      onClick={() => deleteLead(lead.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment History */}
          <div className="card">
            <h3>📜 Assignment History</h3>
            <div className="history-list">
              {assignmentHistory.slice(0, 5).map(record => (
                <div key={record.id} className="history-item">
                  <span className="history-time">
                    {new Date(record.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="history-action">
                    Assigned {record.leadsAssigned} leads
                  </span>
                  <span className="history-method">
                    {record.method}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Agent Modal */}
      {showAddAgent && (
        <div className="modal" onClick={() => setShowAddAgent(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Add New Agent</h3>
            <div className="modal-form">
              <input
                type="text"
                placeholder="Name *"
                value={newAgent.name}
                onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email"
                value={newAgent.email}
                onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
              />
              <select
                value={newAgent.role}
                onChange={(e) => setNewAgent({...newAgent, role: e.target.value})}
              >
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
              <input
                type="number"
                placeholder="Max Workload"
                value={newAgent.maxLoad}
                onChange={(e) => setNewAgent({...newAgent, maxLoad: parseInt(e.target.value)})}
              />
              <input
                type="text"
                placeholder="Skills (comma separated)"
                value={newAgent.skills}
                onChange={(e) => setNewAgent({...newAgent, skills: e.target.value})}
              />
              <div className="modal-actions">
                <button onClick={addAgent}>Add Agent</button>
                <button onClick={() => setShowAddAgent(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLead && (
        <div className="modal" onClick={() => setShowAddLead(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Add New Lead</h3>
            <div className="modal-form">
              <input
                type="text"
                placeholder="Name *"
                value={newLead.name}
                onChange={(e) => setNewLead({...newLead, name: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email"
                value={newLead.email}
                onChange={(e) => setNewLead({...newLead, email: e.target.value})}
              />
              <select
                value={newLead.source}
                onChange={(e) => setNewLead({...newLead, source: e.target.value})}
              >
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Event">Event</option>
              </select>
              <input
                type="number"
                placeholder="Value ($)"
                value={newLead.value}
                onChange={(e) => setNewLead({...newLead, value: e.target.value})}
              />
              <select
                value={newLead.priority}
                onChange={(e) => setNewLead({...newLead, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div className="modal-actions">
                <button onClick={addLead}>Add Lead</button>
                <button onClick={() => setShowAddLead(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default Automation;
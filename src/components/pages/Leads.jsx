// Leads.jsx - Perfect Table Layout with Vibrant Colors
import React, { useState } from "react";
import "./Leads.css";

const Leads = () => {
  const [leads, setLeads] = useState([
    { id: 1, name: "Rahul Sharma", company: "TCS", email: "rahul@tcs.com", phone: "+91 98765 43210", status: "New", value: "25,000" },
    { id: 2, name: "Priya Patel", company: "Infosys", email: "priya@infosys.com", phone: "+91 98765 01234", status: "Contacted", value: "50,000" },
    { id: 3, name: "Amit Kumar", company: "Wipro", email: "amit@wipro.com", phone: "+91 87654 32109", status: "Qualified", value: "75,000" },
    { id: 4, name: "Neha Gupta", company: "HCL", email: "neha@hcl.com", phone: "+91 76543 21098", status: "New", value: "40,000" },
    { id: 5, name: "Vikram Singh", company: "Tech Mahindra", email: "vikram@techm.com", phone: "+91 99887 66554", status: "Contacted", value: "60,000" }
  ]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "", company: "", email: "", phone: "", status: "New", value: ""
  });

  // Stats
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === "New").length;
  const contactedLeads = leads.filter(l => l.status === "Contacted").length;
  const qualifiedLeads = leads.filter(l => l.status === "Qualified").length;
  const totalValue = leads.reduce((sum, lead) => sum + parseInt(lead.value.replace(/,/g, '') || 0), 0);

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
                         lead.company.toLowerCase().includes(search.toLowerCase()) ||
                         lead.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "All" || lead.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.company) return;

    if (editId) {
      setLeads(leads.map(l => l.id === editId ? { ...l, ...formData } : l));
      setEditId(null);
    } else {
      setLeads([...leads, { id: Date.now(), ...formData }]);
    }
    
    setFormData({ name: "", company: "", email: "", phone: "", status: "New", value: "" });
    setShowModal(false);
  };

  const handleEdit = (lead) => {
    setFormData(lead);
    setEditId(lead.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this lead?")) {
      setLeads(leads.filter(l => l.id !== id));
    }
  };

  const updateStatus = (id, newStatus) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  return (
    <div className="leads-vibrant">
      
      {/* Header */}
      <div className="leads-header">
        <div>
          <h2>
            <span className="header-icon">📋</span>
            Lead Management
          </h2>
          <p className="lead-subtitle">Track and manage your sales pipeline</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <span className="btn-icon">+</span>
          New Lead
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <span className="stat-label">Total Leads</span>
            <span className="stat-value">{totalLeads}</span>
          </div>
        </div>
        <div className="stat-card new">
          <div className="stat-icon">🆕</div>
          <div className="stat-content">
            <span className="stat-label">New</span>
            <span className="stat-value">{newLeads}</span>
          </div>
        </div>
        <div className="stat-card contacted">
          <div className="stat-icon">📞</div>
          <div className="stat-content">
            <span className="stat-label">Contacted</span>
            <span className="stat-value">{contactedLeads}</span>
          </div>
        </div>
        <div className="stat-card qualified">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-label">Qualified</span>
            <span className="stat-value">{qualifiedLeads}</span>
          </div>
        </div>
        <div className="stat-card value">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-label">Total Value</span>
            <span className="stat-value">₹{totalValue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search leads by name, company, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        
        <div className="filter-box">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
          </select>
        </div>
      </div>

      {/* Leads Table - Perfect Layout */}
      <div className="table-wrapper">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Value (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map(lead => (
                <tr key={lead.id} className="table-row">
                  <td className="name-cell">
                    <div className="avatar">{lead.name.charAt(0)}</div>
                    <strong>{lead.name}</strong>
                  </td>
                  <td className="company-cell">{lead.company}</td>
                  <td className="email-cell">
                    <a href={`mailto:${lead.email}`}>{lead.email}</a>
                  </td>
                  <td className="phone-cell">
                    <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                  </td>
                  <td>
                    <select 
                      className={`status-select ${lead.status.toLowerCase()}`}
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                    </select>
                  </td>
                  <td className="value-cell">₹{lead.value}</td>
                  <td className="action-cell">
                    <button className="btn-icon edit" onClick={() => handleEdit(lead)} title="Edit Lead">
                      ✏️
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(lead.id)} title="Delete Lead">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  <div className="no-results-content">
                    <span className="no-results-icon">🔍</span>
                    <p>No leads found matching your criteria</p>
                    <button className="clear-filter-btn" onClick={() => {
                      setSearch("");
                      setFilterStatus("All");
                    }}>
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Stats Row */}
      <div className="quick-stats">
        <div className="quick-stat">
          <span className="quick-label">Conversion Rate</span>
          <span className="quick-value">{((qualifiedLeads / totalLeads) * 100 || 0).toFixed(1)}%</span>
        </div>
        <div className="quick-stat">
          <span className="quick-label">Avg. Deal Value</span>
          <span className="quick-value">₹{(totalValue / totalLeads || 0).toLocaleString()}</span>
        </div>
        <div className="quick-stat">
          <span className="quick-label">Response Rate</span>
          <span className="quick-value">{((contactedLeads / totalLeads) * 100 || 0).toFixed(1)}%</span>
        </div>
        <div className="quick-stat">
          <span className="quick-label">Qualified Rate</span>
          <span className="quick-value">{((qualifiedLeads / totalLeads) * 100 || 0).toFixed(1)}%</span>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editId ? "✏️ Edit Lead" : "➕ Add New Lead"}</h3>
              <button className="modal-close" onClick={() => {
                setShowModal(false);
                setEditId(null);
                setFormData({ name: "", company: "", email: "", phone: "", status: "New", value: "" });
              }}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Company <span className="required">*</span></label>
                  <input
                    type="text"
                    placeholder="Enter company name"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Deal Value (₹)</label>
                  <input
                    type="text"
                    placeholder="Enter deal value"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  {editId ? "Update Lead" : "Save Lead"}
                </button>
                <button type="button" className="btn-cancel" onClick={() => {
                  setShowModal(false);
                  setEditId(null);
                  setFormData({ name: "", company: "", email: "", phone: "", status: "New", value: "" });
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
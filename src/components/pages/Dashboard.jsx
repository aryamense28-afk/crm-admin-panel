// components/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import './Dashboard.css';

// Import services (adjust paths as needed)
// import dashboardService from '../services/dashboardService';
// import contactService from '../services/contactService';
// import dealService from '../services/dealService';

// Mock data for demonstration (remove this when services are available)
const mockStats = {
  totalContacts: 245,
  totalDeals: 78,
  totalRevenue: 1245000,
  dealsByStage: [
    { _id: 'Lead', count: 23, value: 450000 },
    { _id: 'Contact Made', count: 18, value: 320000 },
    { _id: 'Proposal', count: 15, value: 280000 },
    { _id: 'Negotiation', count: 12, value: 195000 },
    { _id: 'Closed Won', count: 10, value: 0 }
  ],
  recentActivities: [
    { _id: '1', type: 'Call', title: 'Product Demo Call', contactId: { name: 'Rahul Sharma' } },
    { _id: '2', type: 'Email', title: 'Follow-up Email', contactId: { name: 'Neha Patel' } },
    { _id: '3', type: 'Meeting', title: 'Client Meeting', contactId: { name: 'Aman Singh' } },
    { _id: '4', type: 'Deal', title: 'Deal Closed - $12,500', contactId: { name: 'Priya Mehta' } },
    { _id: '5', type: 'Task', title: 'Follow-up Call', contactId: { name: 'Vikram Kumar' } }
  ]
};

const mockContacts = [
  { _id: '1', name: 'Rahul Sharma', email: 'rahul@email.com', status: 'active', company: 'Tech Corp', phone: '+91 98765 43210' },
  { _id: '2', name: 'Neha Patel', email: 'neha@email.com', status: 'pending', company: 'Business Solutions', phone: '+91 87654 32109' },
  { _id: '3', name: 'Aman Singh', email: 'aman@email.com', status: 'active', company: 'Innovation Labs', phone: '+91 76543 21098' },
  { _id: '4', name: 'Priya Mehta', email: 'priya@email.com', status: 'inactive', company: 'Global Services', phone: '+91 65432 10987' },
  { _id: '5', name: 'Vikram Kumar', email: 'vikram@email.com', status: 'active', company: 'Digital Agency', phone: '+91 54321 09876' }
];

const mockDeals = [
  { _id: '1', name: 'Enterprise Software', stage: 'Proposal', value: 50000, contactId: { name: 'Rahul Sharma' } },
  { _id: '2', name: 'Cloud Services', stage: 'Negotiation', value: 35000, contactId: { name: 'Neha Patel' } },
  { _id: '3', name: 'Consulting Package', stage: 'Lead', value: 25000, contactId: { name: 'Aman Singh' } },
  { _id: '4', name: 'Annual Subscription', stage: 'Closed Won', value: 15000, contactId: { name: 'Priya Mehta' } }
];

const Dashboard = ({ user, userType }) => {
  const [stats, setStats] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Replace with actual API calls when services are ready
      // const [statsRes, contactsRes, dealsRes] = await Promise.all([
      //   dashboardService.getStats(),
      //   contactService.getAll({ limit: 5 }),
      //   dealService.getAll(),
      // ]);
      // setStats(statsRes.data);
      // setContacts(contactsRes.data.contacts);
      // setDeals(dealsRes.data);

      // Using mock data for now
      setTimeout(() => {
        setStats(mockStats);
        setContacts(mockContacts);
        setDeals(mockDeals);
        setError(null);
        setLoading(false);
      }, 800);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      console.error('Error fetching dashboard data:', err);
      setLoading(false);
    }
  };

  const handleCreateContact = async (contactData) => {
    try {
      // Replace with actual API call
      // const response = await contactService.create(contactData);
      const newContact = { _id: Date.now().toString(), ...contactData };
      setContacts([newContact, ...contacts]);
      return { success: true, data: newContact };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  };

  const handleUpdateDealStage = async (dealId, newStage) => {
    try {
      // Replace with actual API call
      // const response = await dealService.updateStage(dealId, newStage);
      setDeals(deals.map(deal => 
        deal._id === dealId ? { ...deal, stage: newStage } : deal
      ));
      return { success: true, data: { _id: dealId, stage: newStage } };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return '#26de81';
      case 'pending': return '#ffa502';
      case 'inactive': return '#ff4757';
      default: return '#a0aec0';
    }
  };

  // Get stage color
  const getStageColor = (stage) => {
    switch(stage) {
      case 'Lead': return '#5e72e4';
      case 'Contact Made': return '#4facfe';
      case 'Proposal': return '#f093fb';
      case 'Negotiation': return '#fa709a';
      case 'Closed Won': return '#26de81';
      default: return '#5e72e4';
    }
  };

  // Get activity icon
  const getActivityIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'call': return '📞';
      case 'email': return '📧';
      case 'meeting': return '👥';
      case 'deal': return '💰';
      case 'task': return '✅';
      default: return '📌';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <p className="error-message">{error}</p>
        <button onClick={fetchDashboardData} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.name || 'User'}! 👋</h1>
            <p className="header-subtitle">
              {userType === 'admin' 
                ? 'Here\'s what\'s happening with your business today.' 
                : 'Track your sales activities and performance.'}
            </p>
          </div>
          <div className="timeframe-selector">
            <button 
              className={selectedTimeframe === 'week' ? 'active' : ''} 
              onClick={() => setSelectedTimeframe('week')}
            >
              This Week
            </button>
            <button 
              className={selectedTimeframe === 'month' ? 'active' : ''} 
              onClick={() => setSelectedTimeframe('month')}
            >
              This Month
            </button>
            <button 
              className={selectedTimeframe === 'year' ? 'active' : ''} 
              onClick={() => setSelectedTimeframe('year')}
            >
              This Year
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Total Contacts</h3>
              <p className="stat-value">{stats?.totalContacts || 0}</p>
              <span className="stat-trend positive">↑ 12% from last month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💼</div>
            <div className="stat-info">
              <h3>Total Deals</h3>
              <p className="stat-value">{stats?.totalDeals || 0}</p>
              <span className="stat-trend positive">↑ 8% from last month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Total Revenue</h3>
              <p className="stat-value">${stats?.totalRevenue?.toLocaleString() || 0}</p>
              <span className="stat-trend positive">↑ 23% from last month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>Conversion Rate</h3>
              <p className="stat-value">24.8%</p>
              <span className="stat-trend positive">↑ 5% from last month</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Recent Contacts Section */}
          <div className="dashboard-section contacts-section">
            <div className="section-header">
              <h2>Recent Contacts</h2>
              <button className="view-all-btn">View All →</button>
            </div>
            <div className="contacts-list">
              {contacts.slice(0, 5).map(contact => (
                <div key={contact._id} className="contact-item">
                  <div className="contact-avatar">
                    {contact.name?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="contact-info">
                    <div className="contact-name">{contact.name}</div>
                    <div className="contact-details">
                      <span>{contact.email}</span>
                      <span>{contact.company}</span>
                    </div>
                  </div>
                  <span 
                    className="status-badge" 
                    style={{ background: getStatusColor(contact.status) }}
                  >
                    {contact.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deals by Stage Section */}
          <div className="dashboard-section deals-section">
            <div className="section-header">
              <h2>Deals by Stage</h2>
              <button className="view-all-btn">View All →</button>
            </div>
            <div className="deals-stages">
              {stats?.dealsByStage?.map(stage => (
                <div key={stage._id} className="stage-item">
                  <div className="stage-header">
                    <span 
                      className="stage-dot" 
                      style={{ background: getStageColor(stage._id) }}
                    ></span>
                    <span className="stage-name">{stage._id}</span>
                  </div>
                  <div className="stage-stats">
                    <span className="stage-count">{stage.count} deals</span>
                    <span className="stage-value">${stage.value?.toLocaleString()}</span>
                  </div>
                  <div className="stage-progress">
                    <div 
                      className="stage-progress-bar" 
                      style={{ 
                        width: `${(stage.count / (stats?.dealsByStage?.reduce((sum, s) => sum + s.count, 0) || 1)) * 100}%`,
                        background: getStageColor(stage._id)
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities Section */}
          <div className="dashboard-section activities-section full-width">
            <div className="section-header">
              <h2>Recent Activities</h2>
              <button className="view-all-btn">View All →</button>
            </div>
            <div className="activities-timeline">
              {stats?.recentActivities?.map(activity => (
                <div key={activity._id} className="activity-item">
                  <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                  <div className="activity-content">
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-meta">
                      <span className="activity-type">{activity.type}</span>
                      <span className="activity-contact">
                        with {activity.contactId?.name}
                      </span>
                    </div>
                  </div>
                  <div className="activity-time">2 hours ago</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section quick-actions-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions-grid">
              <button className="quick-action-btn" onClick={() => {/* Add contact */}}>
                <span>➕</span> Add Contact
              </button>
              <button className="quick-action-btn" onClick={() => {/* Create deal */}}>
                <span>💼</span> Create Deal
              </button>
              <button className="quick-action-btn" onClick={() => {/* Log activity */}}>
                <span>📝</span> Log Activity
              </button>
              <button className="quick-action-btn" onClick={() => {/* Send email */}}>
                <span>📧</span> Send Email
              </button>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="dashboard-section tasks-section">
            <div className="section-header">
              <h2>Upcoming Tasks</h2>
              <button className="view-all-btn">View All →</button>
            </div>
            <div className="tasks-list">
              <div className="task-item">
                <input type="checkbox" id="task1" />
                <label htmlFor="task1">Follow up with Rahul Sharma</label>
                <span className="task-date">Today</span>
              </div>
              <div className="task-item">
                <input type="checkbox" id="task2" />
                <label htmlFor="task2">Prepare quarterly report</label>
                <span className="task-date">Tomorrow</span>
              </div>
              <div className="task-item">
                <input type="checkbox" id="task3" />
                <label htmlFor="task3">Review new leads</label>
                <span className="task-date">Due in 2 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
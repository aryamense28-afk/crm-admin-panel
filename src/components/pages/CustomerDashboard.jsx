// components/pages/CustomerPanel.jsx
import React, { useState, useEffect } from 'react';
import './CustomerDashboard.css';

const CustomerPanel = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Customer-specific data
  const [customerData, setCustomerData] = useState({
    accountInfo: {
      name: user?.name || 'John Smith',
      email: user?.email || 'john@example.com',
      company: user?.company || 'Tech Corp',
      phone: '+1 (555) 123-4567',
      address: '123 Business Ave, Suite 100, San Francisco, CA 94105',
      since: 'January 15, 2024',
      type: 'Premium Customer',
      status: 'Active'
    },
    billingInfo: {
      plan: 'Enterprise Plan',
      nextBilling: 'April 15, 2024',
      amount: '$499/month',
      paymentMethod: 'Visa ending in 4242',
      invoices: [
        { id: 'INV-001', date: 'Mar 15, 2024', amount: '$499', status: 'paid' },
        { id: 'INV-002', date: 'Feb 15, 2024', amount: '$499', status: 'paid' },
        { id: 'INV-003', date: 'Jan 15, 2024', amount: '$499', status: 'paid' },
      ]
    },
    supportTickets: [
      { id: 'TKT-001', subject: 'Login Issue', status: 'open', priority: 'high', created: '2024-03-10', lastUpdate: '2 hours ago' },
      { id: 'TKT-002', subject: 'Billing Question', status: 'in-progress', priority: 'medium', created: '2024-03-08', lastUpdate: '1 day ago' },
      { id: 'TKT-003', subject: 'Feature Request', status: 'closed', priority: 'low', created: '2024-03-01', lastUpdate: '3 days ago' },
    ],
    products: [
      { id: 'PRD-001', name: 'CRM Enterprise License', quantity: 5, price: '$499/month', status: 'active', expiry: 'Apr 15, 2024' },
      { id: 'PRD-002', name: 'Premium Support Package', quantity: 1, price: '$199/month', status: 'active', expiry: 'Apr 15, 2024' },
      { id: 'PRD-003', name: 'API Access Add-on', quantity: 2, price: '$99/month', status: 'active', expiry: 'Apr 15, 2024' },
    ],
    usageStats: {
      apiCalls: 15420,
      storageUsed: '45.2 GB',
      teamMembers: 8,
      activeProjects: 12
    }
  });

  // Load notifications
  useEffect(() => {
    const demoNotifications = [
      { id: 1, type: 'info', message: 'Your invoice is ready', date: '2 hours ago', read: false },
      { id: 2, type: 'success', message: 'Payment successful', date: '1 day ago', read: false },
      { id: 3, type: 'warning', message: 'Trial ends in 3 days', date: '2 days ago', read: true },
    ];
    setNotifications(demoNotifications);
  }, []);

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div className="customer-panel">
      {/* Header Section */}
      <div className="panel-header">
        <div className="header-left">
          <h1>Welcome back, {customerData.accountInfo.name}!</h1>
          <p className="customer-type">{customerData.accountInfo.type}</p>
        </div>
        
        <div className="header-right">
          <div className="notification-center">
            <button className="notification-bell">
              🔔
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-count">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            <div className="notification-dropdown">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <span className={`notification-type ${notification.type}`}></span>
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-date">{notification.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="quick-actions">
            <button className="quick-action-btn">
              <span className="icon">📞</span>
              Support
            </button>
            <button className="quick-action-btn">
              <span className="icon">💬</span>
              Chat
            </button>
          </div>
        </div>
      </div>

      {/* Account Status Bar */}
      <div className="status-bar">
        <div className="status-item">
          <span className="status-label">Account Status</span>
          <span className="status-value active">{customerData.accountInfo.status}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Current Plan</span>
          <span className="status-value">{customerData.billingInfo.plan}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Next Billing</span>
          <span className="status-value">{customerData.billingInfo.nextBilling}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Amount</span>
          <span className="status-value">{customerData.billingInfo.amount}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="panel-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 My Products
        </button>
        <button 
          className={`tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          💳 Billing
        </button>
        <button 
          className={`tab-btn ${activeTab === 'support' ? 'active' : ''}`}
          onClick={() => setActiveTab('support')}
        >
          🎫 Support
        </button>
        <button 
          className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          ⚙️ Account
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <OverviewTab 
            customerData={customerData} 
            notifications={notifications}
          />
        )}
        
        {activeTab === 'products' && (
          <ProductsTab products={customerData.products} />
        )}
        
        {activeTab === 'billing' && (
          <BillingTab billingInfo={customerData.billingInfo} />
        )}
        
        {activeTab === 'support' && (
          <SupportTab tickets={customerData.supportTickets} />
        )}
        
        {activeTab === 'account' && (
          <AccountTab accountInfo={customerData.accountInfo} />
        )}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ customerData, notifications }) => {
  const recentActivities = [
    { id: 1, icon: '💰', text: 'Payment of $499 processed successfully', time: '2 hours ago' },
    { id: 2, icon: '📧', text: 'Support ticket #TKT-001 updated', time: '5 hours ago' },
    { id: 3, icon: '📊', text: 'Monthly report generated', time: '1 day ago' },
    { id: 4, icon: '🔔', text: 'New feature announcement', time: '2 days ago' },
  ];

  return (
    <div className="overview-tab">
      {/* Usage Statistics */}
      <div className="usage-stats">
        <div className="stat-card">
          <div className="stat-icon blue">📊</div>
          <div className="stat-details">
            <span className="stat-label">API Calls</span>
            <span className="stat-value">{customerData.usageStats.apiCalls.toLocaleString()}</span>
            <span className="stat-trend">+12% vs last month</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon green">💾</div>
          <div className="stat-details">
            <span className="stat-label">Storage Used</span>
            <span className="stat-value">{customerData.usageStats.storageUsed}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon orange">👥</div>
          <div className="stat-details">
            <span className="stat-label">Team Members</span>
            <span className="stat-value">{customerData.usageStats.teamMembers}</span>
            <span className="stat-sub">3 invites available</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon purple">🚀</div>
          <div className="stat-details">
            <span className="stat-label">Active Projects</span>
            <span className="stat-value">{customerData.usageStats.activeProjects}</span>
            <span className="stat-sub">2 in planning</span>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="overview-grid">
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-timeline">
            {recentActivities.map(activity => (
              <div key={activity.id} className="timeline-item">
                <span className="timeline-icon">{activity.icon}</span>
                <div className="timeline-content">
                  <p>{activity.text}</p>
                  <span className="timeline-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-btn">View All Activity →</button>
        </div>

        <div className="quick-support">
          <h3>Need Help?</h3>
          <div className="support-options">
            <button className="support-option">
              <span className="option-icon">📚</span>
              <span>Documentation</span>
            </button>
            <button className="support-option">
              <span className="option-icon">💬</span>
              <span>Live Chat</span>
            </button>
            <button className="support-option">
              <span className="option-icon">📞</span>
              <span>Call Support</span>
            </button>
            <button className="support-option">
              <span className="option-icon">🎓</span>
              <span>Tutorials</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Products Tab Component
const ProductsTab = ({ products }) => {
  return (
    <div className="products-tab">
      <div className="products-header">
        <h2>Your Products & Services</h2>
        <button className="btn-primary">➕ Add New Product</button>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-header">
              <span className="product-id">{product.id}</span>
              <span className={`product-status ${product.status}`}>{product.status}</span>
            </div>
            <h4 className="product-name">{product.name}</h4>
            <div className="product-details">
              <div className="product-detail">
                <span className="detail-label">Quantity:</span>
                <span className="detail-value">{product.quantity}</span>
              </div>
              <div className="product-detail">
                <span className="detail-label">Price:</span>
                <span className="detail-value">{product.price}</span>
              </div>
              <div className="product-detail">
                <span className="detail-label">Expires:</span>
                <span className="detail-value">{product.expiry}</span>
              </div>
            </div>
            <div className="product-actions">
              <button className="action-btn">Manage</button>
              <button className="action-btn">Renew</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Billing Tab Component
const BillingTab = ({ billingInfo }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <div className="billing-tab">
      <div className="billing-header">
        <h2>Billing & Subscription</h2>
        <button className="btn-primary" onClick={() => setShowPaymentModal(true)}>
          💳 Update Payment Method
        </button>
      </div>

      <div className="billing-grid">
        <div className="current-plan-card">
          <h3>Current Plan</h3>
          <div className="plan-details">
            <span className="plan-name">{billingInfo.plan}</span>
            <span className="plan-price">{billingInfo.amount}</span>
            <span className="plan-billing">Next billing: {billingInfo.nextBilling}</span>
          </div>
          <div className="plan-features">
            <div className="feature">✓ Unlimited Users</div>
            <div className="feature">✓ 24/7 Priority Support</div>
            <div className="feature">✓ Advanced Analytics</div>
            <div className="feature">✓ Custom Integrations</div>
          </div>
          <button className="btn-secondary">Change Plan</button>
        </div>

        <div className="payment-method-card">
          <h3>Payment Method</h3>
          <div className="payment-details">
            <span className="card-icon">💳</span>
            <div className="card-info">
              <span className="card-type">{billingInfo.paymentMethod}</span>
              <span className="card-expiry">Expires 12/25</span>
            </div>
          </div>
          <button className="btn-link">Edit</button>
        </div>
      </div>

      <div className="invoice-history">
        <h3>Invoice History</h3>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {billingInfo.invoices.map(invoice => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.date}</td>
                <td>{invoice.amount}</td>
                <td>
                  <span className={`status-badge ${invoice.status}`}>
                    {invoice.status}
                  </span>
                </td>
                <td>
                  <button className="action-icon-btn">📄</button>
                  <button className="action-icon-btn">💰</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <PaymentModal onClose={() => setShowPaymentModal(false)} />
      )}
    </div>
  );
};

// Payment Modal Component
const PaymentModal = ({ onClose }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Payment method updated successfully!');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Update Payment Method</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Card Number</label>
              <input 
                type="text" 
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Cardholder Name</label>
              <input 
                type="text" 
                placeholder="John Smith"
                value={paymentDetails.cardName}
                onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  value={paymentDetails.expiry}
                  onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input 
                  type="password" 
                  placeholder="123"
                  maxLength="3"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Update Payment Method</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Support Tab Component
const SupportTab = ({ tickets }) => {
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'technical',
    priority: 'medium',
    description: ''
  });
  const [showTicketForm, setShowTicketForm] = useState(false);

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    alert('Ticket submitted successfully!');
    setShowTicketForm(false);
  };

  return (
    <div className="support-tab">
      <div className="support-header">
        <h2>Support Tickets</h2>
        <button className="btn-primary" onClick={() => setShowTicketForm(true)}>
          🎫 Create New Ticket
        </button>
      </div>

      <div className="tickets-list">
        {tickets.map(ticket => (
          <div key={ticket.id} className={`ticket-card priority-${ticket.priority}`}>
            <div className="ticket-header">
              <span className="ticket-id">{ticket.id}</span>
              <span className={`ticket-status ${ticket.status}`}>{ticket.status}</span>
            </div>
            <h4 className="ticket-subject">{ticket.subject}</h4>
            <div className="ticket-meta">
              <span className="ticket-date">Created: {ticket.created}</span>
              <span className="ticket-update">Last update: {ticket.lastUpdate}</span>
            </div>
            <div className="ticket-actions">
              <button className="action-btn">View Details</button>
              <button className="action-btn">Add Comment</button>
            </div>
          </div>
        ))}
      </div>

      {/* New Ticket Modal */}
      {showTicketForm && (
        <div className="modal-overlay" onClick={() => setShowTicketForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Support Ticket</h3>
              <button className="modal-close" onClick={() => setShowTicketForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmitTicket}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Subject</label>
                  <input 
                    type="text" 
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                  >
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="account">Account Management</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select 
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    rows="5"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    placeholder="Please provide detailed information about your issue"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowTicketForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Account Tab Component
const AccountTab = ({ accountInfo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(accountInfo);

  const handleSave = () => {
    setIsEditing(false);
    alert('Account information updated successfully!');
  };

  return (
    <div className="account-tab">
      <div className="account-header">
        <h2>Account Settings</h2>
        {!isEditing ? (
          <button className="btn-primary" onClick={() => setIsEditing(true)}>
            ✏️ Edit Profile
          </button>
        ) : (
          <div className="edit-actions">
            <button className="btn-primary" onClick={handleSave}>Save Changes</button>
            <button className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        )}
      </div>

      <div className="account-grid">
        <div className="profile-section">
          <div className="profile-avatar">
            <img 
              src={`https://ui-avatars.com/api/?name=${accountInfo.name}&background=4f46e5&color=fff&size=128`} 
              alt={accountInfo.name}
            />
            {isEditing && (
              <button className="avatar-edit">📷</button>
            )}
          </div>
          
          <div className="account-details">
            <div className="detail-group">
              <label>Full Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              ) : (
                <p>{accountInfo.name}</p>
              )}
            </div>

            <div className="detail-group">
              <label>Email Address</label>
              {isEditing ? (
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              ) : (
                <p>{accountInfo.email}</p>
              )}
            </div>

            <div className="detail-group">
              <label>Company</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              ) : (
                <p>{accountInfo.company}</p>
              )}
            </div>

            <div className="detail-group">
              <label>Phone</label>
              {isEditing ? (
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              ) : (
                <p>{accountInfo.phone}</p>
              )}
            </div>

            <div className="detail-group full-width">
              <label>Address</label>
              {isEditing ? (
                <textarea 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows="3"
                />
              ) : (
                <p>{accountInfo.address}</p>
              )}
            </div>
          </div>
        </div>

        <div className="account-info-card">
          <h3>Account Information</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Customer Since</span>
              <span className="info-value">{accountInfo.since}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Account Type</span>
              <span className="info-value premium">{accountInfo.type}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className="info-value active">{accountInfo.status}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Login</span>
              <span className="info-value">Today, 10:30 AM</span>
            </div>
          </div>

          <div className="security-section">
            <h4>Security Settings</h4>
            <button className="security-btn">
              <span className="icon">🔒</span>
              Change Password
            </button>
            <button className="security-btn">
              <span className="icon">📱</span>
              Enable Two-Factor Auth
            </button>
            <button className="security-btn">
              <span className="icon">📋</span>
              View Login History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPanel;
// components/AdminDashboard.js
import React, { useEffect, useRef, useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Initialize Chart.js
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Revenue',
              data: [12000, 19000, 15000, 25000, 28000, 35000],
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Leads',
              data: [450, 620, 580, 890, 1050, 1280],
              borderColor: '#a855f7',
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: '#94a3b8' },
            },
          },
        },
      });
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const stats = [
    { title: 'Total Revenue', value: '$58,240', change: '+22%', icon: 'fas fa-dollar-sign', color: '#3b82f6' },
    { title: 'Active Leads', value: '1,284', change: '+12%', icon: 'fas fa-users', color: '#a855f7' },
    { title: 'Conversion Rate', value: '24.8%', change: '+5%', icon: 'fas fa-chart-line', color: '#10b981' },
    { title: 'Active Deals', value: '47', change: '+3', icon: 'fas fa-rocket', color: '#f59e0b' },
  ];

  const recentActivities = [
    { user: 'Sarah Johnson', action: 'Created new deal', value: '$12,500', time: '2 min ago', avatar: 'SJ' },
    { user: 'Michael Chen', action: 'Updated lead status', value: 'Hot Lead', time: '15 min ago', avatar: 'MC' },
    { user: 'Emily Davis', action: 'Closed won deal', value: '$8,200', time: '1 hour ago', avatar: 'ED' },
    { user: 'James Wilson', action: 'Added new contact', value: 'Tech Corp', time: '3 hours ago', avatar: 'JW' },
  ];

  const topLeads = [
    { name: 'Acme Inc.', value: '$45,200', status: 'Hot', score: 92 },
    { name: 'Globex Corp', value: '$32,800', status: 'Warm', score: 78 },
    { name: 'Stark Industries', value: '$28,500', status: 'Hot', score: 88 },
    { name: 'Wayne Enterprises', value: '$22,000', status: 'Cold', score: 45 },
  ];

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">⚡ NexusCRM</span>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Overview</span>
          </button>
          <button className="nav-item">
            <i className="fas fa-users"></i>
            <span>Leads</span>
          </button>
          <button className="nav-item">
            <i className="fas fa-chart-bar"></i>
            <span>Analytics</span>
          </button>
          <button className="nav-item">
            <i className="fas fa-envelope"></i>
            <span>Campaigns</span>
          </button>
          <button className="nav-item">
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-title">
            <h2>Welcome back, Admin</h2>
            <p>Here's what's happening with your CRM today</p>
          </div>
          <div className="header-actions">
            <button className="create-btn">
              <i className="fas fa-plus"></i> Create New Deal
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                <i className={stat.icon}></i>
              </div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
                <span className="stat-change positive">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Tables */}
        <div className="dashboard-grid">
          <div className="chart-card">
            <div className="card-header">
              <h3>Revenue & Leads Overview</h3>
              <select>
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="chart-container">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>

          <div className="activities-card">
            <div className="card-header">
              <h3>Recent Activities</h3>
              <button className="view-all">View All</button>
            </div>
            <div className="activities-list">
              {recentActivities.map((activity, idx) => (
                <div className="activity-item" key={idx}>
                  <div className="activity-avatar">{activity.avatar}</div>
                  <div className="activity-details">
                    <div className="activity-user">{activity.user}</div>
                    <div className="activity-action">{activity.action}</div>
                    <div className="activity-value">{activity.value}</div>
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="leads-card">
            <div className="card-header">
              <h3>Top Leads by Value</h3>
              <button className="view-all">View All</button>
            </div>
            <div className="leads-table">
              <table>
                <thead>
                  <tr><th>Company</th><th>Value</th><th>Status</th><th>Score</th></tr>
                </thead>
                <tbody>
                  {topLeads.map((lead, idx) => (
                    <tr key={idx}>
                      <td>{lead.name}</td>
                      <td>{lead.value}</td>
                      <td><span className={`status-badge ${lead.status.toLowerCase()}`}>{lead.status}</span></td>
                      <td><div className="score-bar"><div style={{ width: `${lead.score}%` }}></div><span>{lead.score}%</span></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
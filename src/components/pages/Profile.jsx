import React from "react";
import "./Profile.css";

const Profile = () => {
  // Profile data
  const profile = {
    name: "Aarya mense",
    title: "Senior Account Executive",
    email: "aaryamense01@gmail.com",
    phone: "8668794735",
    location: "San Francisco, CA",
    department: "Enterprise Sales",
    manager: "Pravin Kumar",
    tenure: "3 years 4 months",
    quota: "112%",
    dealsClosed: 24,
    activityLevel: "High",
    profileComplete: 85,
    avatar: "AM",
  };

  // Recent activities
  const activities = [
    { icon: "✅", action: "Closed deal with Acme Corp", time: "2 hours ago" },
    { icon: "📂", action: "Updated client proposal", time: "5 hours ago" },
    { icon: "✉️", action: "Sent follow-up emails", time: "Yesterday" },
    { icon: "🏆", action: "Achieved monthly target", time: "2 days ago" },
  ];

  // Stats
  const stats = [
    { label: "Deals Closed", value: profile.dealsClosed, trend: "+12%", positive: true },
    { label: "Quota Attainment", value: profile.quota, trend: "+7%", positive: true },
    { label: "Activity Level", value: profile.activityLevel, trend: "High" },
  ];

  return (
    <div className="profile-container">
      {/* Header */}
      <header className="profile-header">
        <div className="profile-banner">
          <div className="avatar">
            <span>{profile.avatar}</span>
          </div>
          <div className="profile-info">
            <h1>{profile.name}</h1>
            <p>{profile.title} • {profile.department}</p>
            <div className="profile-meta">
              <span>📍 {profile.location}</span>
              <span>💼 {profile.tenure}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="profile-content">
        {/* Left Column */}
        <div className="profile-details">
          {/* Contact Card */}
          <div className="profile-card">
            <h2>👤 Personal Information</h2>
            <div className="info-grid">
              <div>
                <label>Email</label>
                <p>📧 {profile.email}</p>
              </div>
              <div>
                <label>Phone</label>
                <p>📞 {profile.phone}</p>
              </div>
              <div>
                <label>Manager</label>
                <p>{profile.manager}</p>
              </div>
              <div>
                <label>Department</label>
                <p>{profile.department}</p>
              </div>
            </div>
          </div>

          {/* Performance Card */}
          <div className="profile-card">
            <h2>🏆 Performance</h2>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                  {stat.trend && (
                    <div className={`stat-trend ${stat.positive ? 'positive' : ''}`}>
                      {stat.trend}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="profile-activity">
          {/* Activity Card */}
          <div className="profile-card">
            <h2>⏰ Recent Activity</h2>
            <div className="activity-list">
              {activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-content">
                    <p>{activity.action}</p>
                    <span>{activity.time}</span>
                  </div>
                  <span className="activity-arrow">➔</span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Completion */}
          <div className="profile-card completion-card">
            <h2>🛡️ Profile Strength</h2>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${profile.profileComplete}%` }}></div>
              <span>{profile.profileComplete}% Complete</span>
            </div>
            <p>Complete your profile to unlock all features</p>
            <button className="completion-button">
              Complete Profile ➔
            </button>
          </div>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="profile-actions">
        <button className="action-button">
          ⚙️ Settings
        </button>
        <button className="action-button logout">
          🚪 Logout
        </button>
      </footer>
    </div>
  );
};

export default Profile;
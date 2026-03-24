// src/components/pages/ActivityLog.jsx
import React, { useState, useEffect } from 'react';
import { Clock, User, Activity } from 'lucide-react';

export const ActivityLog = ({ roleId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [roleId]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setActivities([
        {
          id: '1',
          action: 'Role Updated',
          user: 'Admin User',
          timestamp: new Date().toISOString(),
          details: 'Permissions were modified'
        },
        {
          id: '2',
          action: 'User Assigned',
          user: 'John Doe',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          details: 'User assigned to this role'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading activities...</div>;
  }

  return (
    <div className="activity-log">
      {activities.length === 0 ? (
        <div className="empty-state">
          <Activity size={48} />
          <p>No activities recorded</p>
        </div>
      ) : (
        <div className="activity-list">
          {activities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                <Clock size={16} />
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-action">{activity.action}</span>
                  <span className="activity-time">
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
                <div className="activity-user">
                  <User size={12} />
                  <span>{activity.user}</span>
                </div>
                {activity.details && (
                  <div className="activity-details">
                    {activity.details}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
// components/pages/GeofenceManagement.jsx
import React, { useState, useEffect } from 'react';

const GeofenceManagement = ({ user }) => {
  const [geofences, setGeofences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    radius: 100,
    type: 'area'
  });

  useEffect(() => {
    fetchGeofences();
  }, []);

  const fetchGeofences = async () => {
    try {
      const response = await fetch('/api/geofences', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('crmToken')}`
        }
      });
      const data = await response.json();
      setGeofences(data);
    } catch (error) {
      console.error('Failed to fetch geofences:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/geofences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('crmToken')}`
        },
        body: JSON.stringify(formData)
      });
      setShowForm(false);
      fetchGeofences();
    } catch (error) {
      console.error('Failed to create geofence:', error);
    }
  };

  return (
    <div className="page-container">
      <h1>Geofence Management</h1>
      <button onClick={() => setShowForm(!showForm)}>
        Add New Geofence
      </button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={(e) => setFormData({...formData, latitude: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={(e) => setFormData({...formData, longitude: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Radius (meters)"
            value={formData.radius}
            onChange={(e) => setFormData({...formData, radius: e.target.value})}
            required
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            <option value="office">Office</option>
            <option value="customer">Customer Location</option>
            <option value="restricted">Restricted Area</option>
            <option value="area">General Area</option>
          </select>
          <button type="submit">Save</button>
        </form>
      )}

      <div className="geofences-list">
        {geofences.map(geofence => (
          <div key={geofence.id} className="geofence-card">
            <h3>{geofence.name}</h3>
            <p>Location: {geofence.latitude}, {geofence.longitude}</p>
            <p>Radius: {geofence.radius}m</p>
            <p>Type: {geofence.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeofenceManagement;
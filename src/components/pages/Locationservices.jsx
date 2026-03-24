// src/components/LocationTracker.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from '../hooks/useLocation';
import './LocationTracker.css';

const LocationTracker = ({ onLocationUpdate, geofences = [] }) => {
  const {
    location,
    error,
    isLoading,
    isTracking,
    locationHistory,
    getCurrentLocation,
    startTracking,
    stopTracking,
    clearHistory,
    checkGeofence,
    distanceTo
  } = useLocation({
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  });

  const [geofenceAlerts, setGeofenceAlerts] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Check geofences when location updates
  useEffect(() => {
    if (location && geofences.length > 0) {
      const alerts = [];
      
      geofences.forEach(geofence => {
        const isWithin = checkGeofence(geofence);
        const distance = distanceTo(geofence.latitude, geofence.longitude);
        
        alerts.push({
          ...geofence,
          isWithin,
          distance: Math.round(distance || 0)
        });
      });
      
      setGeofenceAlerts(alerts);
    }
  }, [location, geofences, checkGeofence, distanceTo]);

  // Notify parent of location updates
  useEffect(() => {
    if (location && onLocationUpdate) {
      onLocationUpdate(location);
    }
  }, [location, onLocationUpdate]);

  // Handle check-in
  const handleCheckIn = async () => {
    try {
      const position = await getCurrentLocation();
      alert(`Check-in recorded at: ${position.latitude.toFixed(4)}, ${position.longitude.toFixed(4)}`);
    } catch (err) {
      alert('Check-in failed: ' + err.message);
    }
  };

  return (
    <div className="location-tracker">
      <div className="tracker-header">
        <h3>Location Tracking</h3>
        <div className="tracker-status">
          Status: 
          <span className={isTracking ? 'active' : 'inactive'}>
            {isTracking ? ' Tracking Active' : ' Tracking Inactive'}
          </span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      <div className="current-location">
        <h4>Current Location</h4>
        {isLoading ? (
          <div className="loading">Getting location...</div>
        ) : location ? (
          <div className="location-details">
            <p><strong>Latitude:</strong> {location.latitude.toFixed(6)}</p>
            <p><strong>Longitude:</strong> {location.longitude.toFixed(6)}</p>
            <p><strong>Accuracy:</strong> {Math.round(location.accuracy)} meters</p>
            {location.speed > 0 && <p><strong>Speed:</strong> {location.speed} m/s</p>}
            {location.heading > 0 && <p><strong>Heading:</strong> {location.heading}°</p>}
            {location.formattedAddress && (
              <p><strong>Address:</strong> {location.formattedAddress}</p>
            )}
            <p><strong>Updated:</strong> {new Date(location.timestamp).toLocaleString()}</p>
          </div>
        ) : (
          <p>No location data available</p>
        )}
      </div>

      <div className="tracker-controls">
        <button 
          onClick={getCurrentLocation} 
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? 'Getting Location...' : 'Get Current Location'}
        </button>
        
        {!isTracking ? (
          <button 
            onClick={startTracking} 
            className="btn btn-success"
          >
            Start Tracking
          </button>
        ) : (
          <button 
            onClick={stopTracking} 
            className="btn btn-danger"
          >
            Stop Tracking
          </button>
        )}
        
        <button onClick={handleCheckIn} className="btn btn-info">
          Check In
        </button>
        
        <button 
          onClick={() => setShowHistory(!showHistory)} 
          className="btn btn-secondary"
        >
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
      </div>

      {geofenceAlerts.length > 0 && (
        <div className="geofence-alerts">
          <h4>Geofence Status</h4>
          <ul>
            {geofenceAlerts.map((alert, index) => (
              <li key={index} className={alert.isWithin ? 'inside' : 'outside'}>
                <strong>{alert.name}:</strong>
                {alert.isWithin ? ' Inside' : ' Outside'} 
                (Distance: {alert.distance} meters)
              </li>
            ))}
          </ul>
        </div>
      )}

      {showHistory && locationHistory.length > 0 && (
        <div className="location-history">
          <h4>Location History</h4>
          <button onClick={clearHistory} className="btn btn-warning btn-small">
            Clear History
          </button>
          <ul>
            {locationHistory.slice(-10).reverse().map((pos, index) => (
              <li key={index}>
                {new Date(pos.timestamp).toLocaleTimeString()}: 
                ({pos.latitude.toFixed(4)}, {pos.longitude.toFixed(4)})
                {pos.accuracy && ` ±${Math.round(pos.accuracy)}m`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationTracker;
// components/pages/LocationTracking.jsx
import React from 'react';
import LocationTracker from '../LocationTracker';

const LocationTracking = ({ user, currentLocation, isTracking }) => {
  const geofences = [
    {
      id: 1,
      name: 'Main Office',
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 100
    },
    {
      id: 2,
      name: 'Downtown Branch',
      latitude: 40.7589,
      longitude: -73.9851,
      radius: 150
    }
  ];

  const handleLocationUpdate = (location) => {
    console.log('Location updated:', location);
  };

  return (
    <div className="page-container">
      <h1>Location Tracking</h1>
      <LocationTracker 
        onLocationUpdate={handleLocationUpdate}
        geofences={geofences}
      />
    </div>
  );
};

export default LocationTracking;
// src/components/pages/MapPage.jsx
import React, { useState } from 'react';
import LocationMap from '../LocationMap';

const MapPage = () => {
  const [locations] = useState([
    {
      id: 1,
      lat: 40.7128,
      lng: -74.0060,
      name: 'Main Office',
      address: 'New York, NY',
      type: 'office',
      time: '9:00 AM'
    },
    {
      id: 2,
      lat: 40.7589,
      lng: -73.9851,
      name: 'Times Square',
      address: 'Manhattan, NY',
      type: 'client',
      time: '11:30 AM'
    },
    {
      id: 3,
      lat: 40.7484,
      lng: -73.9857,
      name: 'Empire State Building',
      address: '350 5th Ave, New York',
      type: 'meeting',
      time: '2:00 PM'
    }
  ]);

  const [currentLocation] = useState({
    lat: 40.7306,
    lng: -73.9352,
    accuracy: 15
  });

  const geofences = [
    {
      name: 'Office Zone',
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 200,
      color: '#10b981',
      type: 'restricted'
    },
    {
      name: 'Client Area',
      latitude: 40.7589,
      longitude: -73.9851,
      radius: 150,
      color: '#f59e0b',
      type: 'client'
    }
  ];

  const handleLocationClick = (location) => {
    console.log('Location clicked:', location);
  };

  const handleMapClick = (latlng) => {
    console.log('Map clicked:', latlng);
  };

  return (
    <div className="map-page">
      <h1>📍 Location Map</h1>
      <LocationMap
        locations={locations}
        currentLocation={currentLocation}
        geofences={geofences}
        onLocationClick={handleLocationClick}
        onMapClick={handleMapClick}
        showRoute={true}
        showHeatmap={false}
        height="700px"
        allowSearch={true}
        allowDrawing={true}
        showControls={true}
      />
    </div>
  );
};

export default MapPage;
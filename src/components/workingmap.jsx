// src/components/WorkingMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './WorkingMap.css';

// Fix for default markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const WorkingMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Sample locations
  const locations = [
    { id: 1, name: 'New York', lat: 40.7128, lng: -74.0060, description: 'Times Square' },
    { id: 2, name: 'Los Angeles', lat: 34.0522, lng: -118.2437, description: 'Downtown LA' },
    { id: 3, name: 'Chicago', lat: 41.8781, lng: -87.6298, description: 'Willis Tower' },
  ];

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  if (error) {
    return <div className="map-error">Error loading map: {error}</div>;
  }

  if (!mapLoaded) {
    return <div className="map-loading">Loading map...</div>;
  }

  return (
    <div className="map-container">
      <MapContainer
        center={[40.7128, -74.0060]}
        zoom={4}
        style={{ height: '600px', width: '100%' }}
        className="leaflet-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
          >
            <Popup>
              <div className="popup-content">
                <h3>{location.name}</h3>
                <p>{location.description}</p>
                <p className="coordinates">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default WorkingMap;
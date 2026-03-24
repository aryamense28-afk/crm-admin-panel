// src/components/AdvancedLocationTracker.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationTracker.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createMarkerIcon = (type, isActive = false) => {
  const colors = {
    current: '#4f46e5',
    office: '#10b981',
    client: '#f59e0b',
    home: '#8b5cf6',
    default: '#6b7280'
  };

  const color = colors[type] || colors.default;
  
  return L.divIcon({
    className: `custom-marker ${isActive ? 'pulse' : ''}`,
    html: `<div style="
      background-color: ${color};
      width: ${isActive ? '20px' : '12px'};
      height: ${isActive ? '20px' : '12px'};
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ${isActive ? 'animation: pulse 1.5s infinite;' : ''}
    "></div>`,
    iconSize: [isActive ? 26 : 18, isActive ? 26 : 18],
    popupAnchor: [0, -13]
  });
};

// Map Controller Component
const MapController = ({ center, zoom, locations, onBoundsChange }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
      map.fitBounds(bounds.pad(0.1));
    }
  }, [locations, map]);

  useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      onBoundsChange?.({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      });
    }
  });

  return null;
};

// Main Component
const AdvancedLocationTracker = ({ user, onLocationUpdate, geofences = [] }) => {
  const [location, setLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]);
  const [mapZoom, setMapZoom] = useState(15);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationStats, setLocationStats] = useState({
    accuracy: 0,
    speed: 0,
    altitude: 0,
    heading: 0,
    timestamp: null
  });
  const [nearbyGeofences, setNearbyGeofences] = useState([]);
  const [trackingMode, setTrackingMode] = useState('balanced'); // 'high', 'balanced', 'power'
  const [showHistory, setShowHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [searchRadius, setSearchRadius] = useState(500); // meters
  const [compassHeading, setCompassHeading] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [signalStrength, setSignalStrength] = useState('good');

  // Refs
  const mapRef = useRef(null);
  const watchPositionRef = useRef(null);
  const compassRef = useRef(null);

  // Load location history on mount
  useEffect(() => {
    loadLocationHistory();
    checkBatteryStatus();
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (compassRef.current) {
        window.removeEventListener('deviceorientation', handleCompass);
      }
    };
  }, []);

  // Update stats when location changes
  useEffect(() => {
    if (location) {
      setLocationStats({
        accuracy: location.accuracy,
        speed: location.speed || 0,
        altitude: location.altitude || 0,
        heading: location.heading || 0,
        timestamp: new Date().toLocaleTimeString()
      });
      setMapCenter([location.lat, location.lng]);
      checkNearbyGeofences();
      
      // Notify parent
      onLocationUpdate?.(location);
    }
  }, [location]);

  // Filter history based on criteria
  useEffect(() => {
    filterLocationHistory();
  }, [historyFilter, locationHistory]);

  const loadLocationHistory = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('locationHistory') || '[]');
      setLocationHistory(saved);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const checkBatteryStatus = async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        setBatteryLevel(battery.level * 100);
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level * 100);
        });
      } catch (error) {
        console.log('Battery API not available');
      }
    }
  };

  const handleCompass = (event) => {
    if (event.webkitCompassHeading) {
      setCompassHeading(event.webkitCompassHeading);
    } else if (event.alpha) {
      setCompassHeading(event.alpha);
    }
  };

  const startCompass = () => {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleCompass);
      compassRef.current = true;
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      const options = {
        enableHighAccuracy: trackingMode === 'high',
        timeout: 10000,
        maximumAge: trackingMode === 'power' ? 60000 : 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            id: Date.now(),
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
            type: 'manual'
          };
          setLocation(locationData);
          saveToHistory(locationData);
          resolve(locationData);
        },
        (error) => {
          handleLocationError(error);
          reject(error);
        },
        options
      );
    });
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setIsTracking(true);
    setError(null);
    startCompass();

    const options = {
      enableHighAccuracy: trackingMode === 'high',
      timeout: 5000,
      maximumAge: trackingMode === 'power' ? 30000 : 0,
      distanceFilter: trackingMode === 'high' ? 5 : 10
    };

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const locationData = {
          id: Date.now(),
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
          type: 'tracking'
        };
        setLocation(locationData);
        saveToHistory(locationData);
        
        // Update signal strength based on accuracy
        if (position.coords.accuracy < 10) setSignalStrength('excellent');
        else if (position.coords.accuracy < 30) setSignalStrength('good');
        else if (position.coords.accuracy < 50) setSignalStrength('fair');
        else setSignalStrength('poor');
      },
      (error) => {
        handleLocationError(error);
      },
      options
    );

    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    if (compassRef.current) {
      window.removeEventListener('deviceorientation', handleCompass);
      compassRef.current = null;
    }
  };

  const handleLocationError = (error) => {
    let message = 'Location error';
    switch(error.code) {
      case error.PERMISSION_DENIED:
        message = 'Location permission denied. Please enable in settings.';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'Location information unavailable. Check GPS.';
        break;
      case error.TIMEOUT:
        message = 'Location request timed out. Try again.';
        break;
      default:
        message = error.message;
    }
    setError(message);
  };

  const saveToHistory = (locationData) => {
    setLocationHistory(prev => {
      const updated = [locationData, ...prev].slice(0, 1000); // Keep last 1000
      localStorage.setItem('locationHistory', JSON.stringify(updated));
      return updated;
    });
  };

  const checkNearbyGeofences = () => {
    if (!location || !geofences.length) return;

    const nearby = geofences.filter(geofence => {
      const distance = calculateDistance(
        location.lat, location.lng,
        geofence.latitude, geofence.longitude
      );
      return distance <= searchRadius;
    }).map(g => ({
      ...g,
      distance: calculateDistance(
        location.lat, location.lng,
        g.latitude, g.longitude
      )
    }));

    setNearbyGeofences(nearby);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const filterLocationHistory = () => {
    if (historyFilter === 'all') return locationHistory;
    const now = Date.now();
    const filterTime = {
      hour: 3600000,
      day: 86400000,
      week: 604800000
    }[historyFilter] || 0;
    
    return locationHistory.filter(loc => (now - loc.timestamp) <= filterTime);
  };

  const clearHistory = () => {
    if (window.confirm('Clear all location history?')) {
      setLocationHistory([]);
      localStorage.removeItem('locationHistory');
    }
  };

  const exportLocations = (format) => {
    let data = locationHistory;
    let blob;
    let filename = `locations_${new Date().toISOString().split('T')[0]}`;

    switch(format) {
      case 'json':
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        filename += '.json';
        break;
      case 'csv':
        const csv = [
          ['ID', 'Latitude', 'Longitude', 'Accuracy', 'Speed', 'Timestamp', 'Type'].join(','),
          ...data.map(l => [l.id, l.lat, l.lng, l.accuracy, l.speed, new Date(l.timestamp).toISOString(), l.type].join(','))
        ].join('\n');
        blob = new Blob([csv], { type: 'text/csv' });
        filename += '.csv';
        break;
      default:
        return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSignalIcon = () => {
    const icons = {
      excellent: '📶',
      good: '📶',
      fair: '📶',
      poor: '📶'
    };
    return icons[signalStrength] || '📶';
  };

  return (
    <div className="advanced-tracker">
      {/* Header with Status */}
      <div className="tracker-header">
        <div className="status-indicators">
          <div className={`status-item ${isTracking ? 'active' : ''}`}>
            <span className="status-dot"></span>
            <span>{isTracking ? 'Tracking Active' : 'Tracking Off'}</span>
          </div>
          {batteryLevel !== null && (
            <div className="status-item">
              <span>🔋 {batteryLevel}%</span>
            </div>
          )}
          <div className={`status-item signal-${signalStrength}`}>
            <span>{getSignalIcon()} {signalStrength}</span>
          </div>
          {compassHeading > 0 && (
            <div className="status-item">
              <span>🧭 {Math.round(compassHeading)}°</span>
            </div>
          )}
        </div>
        <div className="tracker-controls">
          <select 
            value={trackingMode} 
            onChange={(e) => setTrackingMode(e.target.value)}
            className="mode-select"
          >
            <option value="high">🎯 High Accuracy</option>
            <option value="balanced">⚖️ Balanced</option>
            <option value="power">🔋 Power Saving</option>
          </select>
          {!isTracking ? (
            <button onClick={startTracking} className="btn-start">
              ▶ Start Tracking
            </button>
          ) : (
            <button onClick={stopTracking} className="btn-stop">
              ⏹ Stop Tracking
            </button>
          )}
          <button onClick={getCurrentLocation} className="btn-locate" disabled={isLoading}>
            📍 Get Location
          </button>
        </div>
      </div>

      {/* Main Content - Map and Info Side by Side */}
      <div className="tracker-main">
        {/* Map Section */}
        <div className="map-section">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '600px', width: '100%' }}
            className="tracker-map"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            
            <MapController 
              center={mapCenter}
              zoom={mapZoom}
              locations={locationHistory.slice(0, 100)}
            />

            {/* Geofences */}
            {geofences.map((fence, idx) => (
              <Circle
                key={`fence-${idx}`}
                center={[fence.latitude, fence.longitude]}
                radius={fence.radius}
                pathOptions={{
                  color: '#4f46e5',
                  fillColor: '#4f46e5',
                  fillOpacity: 0.1
                }}
              >
                <Popup>
                  <div className="geofence-popup">
                    <strong>{fence.name}</strong>
                    <p>Radius: {fence.radius}m</p>
                  </div>
                </Popup>
              </Circle>
            ))}

            {/* Path line */}
            {locationHistory.length > 1 && (
              <Polyline
                positions={locationHistory.slice(0, 100).map(l => [l.lat, l.lng])}
                color="#4f46e5"
                weight={3}
                opacity={0.6}
              />
            )}

            {/* History markers */}
            {locationHistory.slice(0, 50).map((loc, idx) => (
              <Marker
                key={`history-${idx}`}
                position={[loc.lat, loc.lng]}
                icon={createMarkerIcon('default')}
                eventHandlers={{ click: () => setSelectedLocation(loc) }}
              >
                <Popup>
                  <div className="map-popup">
                    <strong>📍 Location {idx + 1}</strong>
                    <p>🕒 {new Date(loc.timestamp).toLocaleString()}</p>
                    <p>🎯 ±{Math.round(loc.accuracy)}m</p>
                    {loc.speed > 0 && <p>🚀 {loc.speed.toFixed(1)} km/h</p>}
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Current location marker */}
            {location && (
              <Marker
                position={[location.lat, location.lng]}
                icon={createMarkerIcon('current', true)}
              >
                <Popup>
                  <div className="map-popup current">
                    <strong>📍 You are here</strong>
                    <p>🕒 {locationStats.timestamp}</p>
                    <p>🎯 ±{Math.round(location.accuracy)}m</p>
                    {location.speed > 0 && <p>🚀 {location.speed.toFixed(1)} km/h</p>}
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Map Overlay Controls */}
          <div className="map-overlay">
            <button onClick={() => setMapZoom(z => z + 1)} className="zoom-btn">+</button>
            <button onClick={() => setMapZoom(z => z - 1)} className="zoom-btn">−</button>
            <button onClick={() => setMapCenter([location?.lat || 40.7128, location?.lng || -74.0060])} className="recenter-btn">
              ◎
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="info-panel">
          {/* Current Location Info */}
          <div className="info-card current-location-card">
            <h3>📍 Current Location</h3>
            {location ? (
              <div className="location-details">
                <div className="coord-row">
                  <span className="label">Latitude:</span>
                  <span className="value">{location.lat.toFixed(6)}</span>
                </div>
                <div className="coord-row">
                  <span className="label">Longitude:</span>
                  <span className="value">{location.lng.toFixed(6)}</span>
                </div>
                <div className="stats-grid">
                  <div className="stat">
                    <span className="stat-icon">🎯</span>
                    <span className="stat-value">{Math.round(location.accuracy)}m</span>
                    <span className="stat-label">Accuracy</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">🚀</span>
                    <span className="stat-value">{location.speed?.toFixed(1) || 0}</span>
                    <span className="stat-label">km/h</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">⛰️</span>
                    <span className="stat-value">{Math.round(location.altitude || 0)}</span>
                    <span className="stat-label">Altitude</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">🧭</span>
                    <span className="stat-value">{Math.round(location.heading || 0)}°</span>
                    <span className="stat-label">Heading</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="no-location">No location data yet</p>
            )}
          </div>

          {/* Nearby Geofences */}
          {nearbyGeofences.length > 0 && (
            <div className="info-card">
              <h3>📍 Nearby Places</h3>
              <div className="nearby-list">
                {nearbyGeofences.map((fence, idx) => (
                  <div key={idx} className="nearby-item">
                    <span className="nearby-name">{fence.name}</span>
                    <span className="nearby-distance">{Math.round(fence.distance)}m</span>
                    {fence.distance <= fence.radius && (
                      <span className="inside-badge">Inside</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="radius-control">
                <label>Search radius: {searchRadius}m</label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* Location History */}
          <div className="info-card">
            <div className="card-header">
              <h3>📋 Recent Locations</h3>
              <div className="card-actions">
                <select 
                  value={historyFilter} 
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All</option>
                  <option value="hour">Last Hour</option>
                  <option value="day">Last Day</option>
                  <option value="week">Last Week</option>
                </select>
                <button onClick={clearHistory} className="icon-btn" title="Clear history">🗑️</button>
                <button onClick={() => exportLocations('json')} className="icon-btn" title="Export JSON">📥</button>
              </div>
            </div>
            <div className="history-list">
              {locationHistory.slice(0, 10).map((loc, idx) => (
                <div 
                  key={idx} 
                  className={`history-item ${selectedLocation?.id === loc.id ? 'selected' : ''}`}
                  onClick={() => setSelectedLocation(loc)}
                >
                  <div className="history-time">
                    {new Date(loc.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="history-coords">
                    {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                  </div>
                  <div className="history-meta">
                    <span className="accuracy" title="Accuracy">🎯 {Math.round(loc.accuracy)}m</span>
                    {loc.speed > 0 && (
                      <span className="speed" title="Speed">🚀 {loc.speed.toFixed(1)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="error-card">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{error}</span>
              <button onClick={() => setError(null)} className="error-close">×</button>
            </div>
          )}
        </div>
      </div>

      {/* Location Details Modal */}
      {selectedLocation && (
        <div className="modal-overlay" onClick={() => setSelectedLocation(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>📍 Location Details</h2>
            <button className="modal-close" onClick={() => setSelectedLocation(null)}>×</button>
            
            <div className="modal-details">
              <div className="detail-row">
                <span className="detail-label">Timestamp:</span>
                <span className="detail-value">{new Date(selectedLocation.timestamp).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Coordinates:</span>
                <span className="detail-value">
                  {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Accuracy:</span>
                <span className="detail-value">±{Math.round(selectedLocation.accuracy)} meters</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Speed:</span>
                <span className="detail-value">{selectedLocation.speed?.toFixed(1) || 0} km/h</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Altitude:</span>
                <span className="detail-value">{Math.round(selectedLocation.altitude || 0)} meters</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Heading:</span>
                <span className="detail-value">{Math.round(selectedLocation.heading || 0)}°</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{selectedLocation.type || 'manual'}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-primary"
                onClick={() => {
                  window.open(`https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`, '_blank');
                }}
              >
                Open in Maps
              </button>
              <button 
                className="btn-secondary"
                onClick={() => {
                  navigator.clipboard.writeText(`${selectedLocation.lat}, ${selectedLocation.lng}`);
                  alert('Coordinates copied!');
                }}
              >
                Copy Coordinates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedLocationTracker;
// src/components/pages/LocationHistory.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationHistory.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationHistory = ({ user }) => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showMap, setShowMap] = useState(true);
  const [stats, setStats] = useState({
    totalDistance: 0,
    avgSpeed: 0,
    maxSpeed: 0,
    totalTime: 0,
    uniquePlaces: 0
  });
  const [viewMode, setViewMode] = useState('list'); // 'list', 'map', 'stats'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [clusterData, setClusterData] = useState([]);

  useEffect(() => {
    loadLocationHistory();
  }, []);

  useEffect(() => {
    applyFilters();
    calculateStats();
    generateHeatmapData();
  }, [locations, selectedDate, dateRange, searchTerm, sortBy, sortOrder]);

  const loadLocationHistory = () => {
    try {
      // Load from localStorage
      const savedLocations = JSON.parse(localStorage.getItem('mockLocations') || '[]');
      
      // If no data, generate mock data
      if (savedLocations.length === 0) {
        const mockData = generateMockLocationData();
        setLocations(mockData);
        localStorage.setItem('mockLocations', JSON.stringify(mockData));
      } else {
        setLocations(savedLocations);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockLocationData = () => {
    const mockData = [];
    const centers = [
      { lat: 40.7128, lng: -74.0060, name: 'Office' }, // NYC
      { lat: 40.7589, lng: -73.9851, name: 'Times Square' },
      { lat: 40.6892, lng: -74.0445, name: 'Statue of Liberty' },
      { lat: 40.7614, lng: -73.9776, name: 'Rockefeller Center' },
      { lat: 40.7580, lng: -73.9855, name: 'Bryant Park' }
    ];

    for (let i = 0; i < 50; i++) {
      const center = centers[Math.floor(Math.random() * centers.length)];
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      mockData.push({
        id: i + 1,
        userId: user?.id || 1,
        userName: user?.name || 'John Doe',
        latitude: center.lat + (Math.random() - 0.5) * 0.01,
        longitude: center.lng + (Math.random() - 0.5) * 0.01,
        accuracy: Math.random() * 20 + 5,
        speed: Math.random() * 30,
        heading: Math.random() * 360,
        timestamp: date.toISOString(),
        formattedAddress: `${center.name}, New York, NY`,
        locationType: ['visit', 'route', 'check_in'][Math.floor(Math.random() * 3)],
        notes: Math.random() > 0.7 ? 'Customer meeting' : ''
      });
    }
    return mockData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const applyFilters = () => {
    let filtered = [...locations];

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(loc => 
        new Date(loc.timestamp).toDateString() === new Date(selectedDate).toDateString()
      );
    }

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(loc => {
        const date = new Date(loc.timestamp);
        return date >= new Date(dateRange.start) && date <= new Date(dateRange.end);
      });
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(loc => 
        loc.formattedAddress?.toLowerCase().includes(term) ||
        loc.locationType?.toLowerCase().includes(term) ||
        loc.notes?.toLowerCase().includes(term)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'timestamp':
          comparison = new Date(a.timestamp) - new Date(b.timestamp);
          break;
        case 'speed':
          comparison = (a.speed || 0) - (b.speed || 0);
          break;
        case 'accuracy':
          comparison = (a.accuracy || 0) - (b.accuracy || 0);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredLocations(filtered);
  };

  const calculateStats = () => {
    if (filteredLocations.length < 2) return;

    let totalDistance = 0;
    let totalSpeed = 0;
    let maxSpeed = 0;
    let speedCount = 0;
    const uniquePlaces = new Set();

    for (let i = 1; i < filteredLocations.length; i++) {
      const loc1 = filteredLocations[i - 1];
      const loc2 = filteredLocations[i];
      
      // Calculate distance
      const distance = calculateDistance(
        loc1.latitude, loc1.longitude,
        loc2.latitude, loc2.longitude
      );
      totalDistance += distance;

      // Calculate speed stats
      if (loc2.speed) {
        totalSpeed += loc2.speed;
        speedCount++;
        maxSpeed = Math.max(maxSpeed, loc2.speed);
      }

      // Track unique places (rounded to 4 decimals)
      uniquePlaces.add(`${loc2.latitude.toFixed(4)},${loc2.longitude.toFixed(4)}`);
    }

    // Calculate total time
    const firstTime = new Date(filteredLocations[0].timestamp);
    const lastTime = new Date(filteredLocations[filteredLocations.length - 1].timestamp);
    const totalTime = (lastTime - firstTime) / (1000 * 60); // in minutes

    setStats({
      totalDistance: (totalDistance / 1000).toFixed(2), // in km
      avgSpeed: speedCount > 0 ? (totalSpeed / speedCount).toFixed(1) : 0,
      maxSpeed: maxSpeed.toFixed(1),
      totalTime: totalTime.toFixed(0),
      uniquePlaces: uniquePlaces.size
    });
  };

  const generateHeatmapData = () => {
    const heatmap = filteredLocations.map(loc => ({
      lat: loc.latitude,
      lng: loc.longitude,
      intensity: loc.accuracy ? 100 / loc.accuracy : 1
    }));
    setHeatmapData(heatmap);
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

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const exportData = (format) => {
    let dataToExport = filteredLocations;
    let blob;

    switch (format) {
      case 'json':
        blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        break;
      case 'csv':
        const csv = [
          ['ID', 'Latitude', 'Longitude', 'Accuracy', 'Speed', 'Timestamp', 'Address', 'Type'].join(','),
          ...dataToExport.map(loc => [
            loc.id,
            loc.latitude,
            loc.longitude,
            loc.accuracy,
            loc.speed,
            loc.timestamp,
            `"${loc.formattedAddress || ''}"`,
            loc.locationType
          ].join(','))
        ].join('\n');
        blob = new Blob([csv], { type: 'text/csv' });
        break;
      default:
        return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `location_history_${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteLocation = (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      const updated = locations.filter(loc => loc.id !== id);
      setLocations(updated);
      localStorage.setItem('mockLocations', JSON.stringify(updated));
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all location history?')) {
      setLocations([]);
      localStorage.removeItem('mockLocations');
    }
  };

  // Get unique dates for filter
  const uniqueDates = useMemo(() => {
    const dates = new Set();
    locations.forEach(loc => {
      dates.add(new Date(loc.timestamp).toDateString());
    });
    return Array.from(dates).sort();
  }, [locations]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading location history...</p>
      </div>
    );
  }

  return (
    <div className="location-history-container">
      <div className="history-header">
        <h1>📍 Advanced Location History</h1>
        <div className="header-actions">
          <button 
            className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List
          </button>
          <button 
            className={`view-mode-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            🗺️ Map
          </button>
          <button 
            className={`view-mode-btn ${viewMode === 'stats' ? 'active' : ''}`}
            onClick={() => setViewMode('stats')}
          >
            📊 Stats
          </button>
          <button className="export-btn" onClick={() => exportData('json')}>
            📥 Export JSON
          </button>
          <button className="export-btn" onClick={() => exportData('csv')}>
            📥 Export CSV
          </button>
          <button className="danger-btn" onClick={clearAllData}>
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search by address or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label>Date:</label>
          <select 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-select"
          >
            <option value="">All Dates</option>
            {uniqueDates.map(date => (
              <option key={date} value={new Date(date).toISOString()}>
                {date}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Date Range:</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            className="date-input"
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            className="date-input"
          />
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="timestamp">Date</option>
            <option value="speed">Speed</option>
            <option value="accuracy">Accuracy</option>
          </select>
          <button 
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        <div className="filter-stats">
          <span>📊 {filteredLocations.length} locations</span>
        </div>
      </div>

      {/* Statistics Panel */}
      {viewMode === 'stats' && (
        <div className="stats-panel">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📏</div>
              <div className="stat-info">
                <span className="stat-label">Total Distance</span>
                <span className="stat-value">{stats.totalDistance} km</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-info">
                <span className="stat-label">Total Time</span>
                <span className="stat-value">{formatDuration(stats.totalTime)}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚀</div>
              <div className="stat-info">
                <span className="stat-label">Avg Speed</span>
                <span className="stat-value">{stats.avgSpeed} km/h</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <span className="stat-label">Max Speed</span>
                <span className="stat-value">{stats.maxSpeed} km/h</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📍</div>
              <div className="stat-info">
                <span className="stat-label">Unique Places</span>
                <span className="stat-value">{stats.uniquePlaces}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-label">Data Points</span>
                <span className="stat-value">{filteredLocations.length}</span>
              </div>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="activity-chart">
            <h3>Activity Timeline</h3>
            <div className="chart-bars">
              {Array.from({ length: 24 }, (_, hour) => {
                const count = filteredLocations.filter(loc => 
                  new Date(loc.timestamp).getHours() === hour
                ).length;
                const max = Math.max(...Array.from({ length: 24 }, (_, h) => 
                  filteredLocations.filter(loc => new Date(loc.timestamp).getHours() === h).length
                ));
                return (
                  <div key={hour} className="chart-bar-container">
                    <div 
                      className="chart-bar"
                      style={{ height: `${(count / max) * 100}%` }}
                    >
                      <span className="bar-value">{count}</span>
                    </div>
                    <span className="bar-label">{hour}:00</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && filteredLocations.length > 0 && (
        <div className="map-container">
          <MapContainer
            center={[filteredLocations[0]?.latitude || 40.7128, filteredLocations[0]?.longitude || -74.0060]}
            zoom={13}
            style={{ height: '500px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            {/* Path line */}
            <Polyline
              positions={filteredLocations.map(loc => [loc.latitude, loc.longitude])}
              color="blue"
              weight={3}
              opacity={0.6}
            />
            
            {/* Markers */}
            {filteredLocations.map((loc, index) => (
              <Marker
                key={loc.id}
                position={[loc.latitude, loc.longitude]}
                eventHandlers={{
                  click: () => setSelectedLocation(loc)
                }}
              >
                <Popup>
                  <div className="map-popup">
                    <h4>Location #{index + 1}</h4>
                    <p><strong>Time:</strong> {new Date(loc.timestamp).toLocaleString()}</p>
                    <p><strong>Accuracy:</strong> {Math.round(loc.accuracy)}m</p>
                    {loc.speed > 0 && <p><strong>Speed:</strong> {loc.speed} km/h</p>}
                    <p><strong>Address:</strong> {loc.formattedAddress || 'N/A'}</p>
                    {loc.notes && <p><strong>Notes:</strong> {loc.notes}</p>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="locations-list">
          <table className="locations-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Timestamp</th>
                <th>Coordinates</th>
                <th>Accuracy</th>
                <th>Speed</th>
                <th>Address</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocations.map((loc, index) => (
                <tr key={loc.id} className={selectedLocation?.id === loc.id ? 'selected' : ''}>
                  <td>{index + 1}</td>
                  <td>{new Date(loc.timestamp).toLocaleString()}</td>
                  <td>
                    {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                  </td>
                  <td>
                    <span className={`accuracy-badge ${loc.accuracy < 10 ? 'good' : loc.accuracy < 50 ? 'medium' : 'poor'}`}>
                      {Math.round(loc.accuracy)}m
                    </span>
                  </td>
                  <td>{loc.speed ? `${loc.speed} km/h` : '-'}</td>
                  <td className="address-cell">{loc.formattedAddress || 'N/A'}</td>
                  <td>
                    <span className={`type-badge ${loc.locationType}`}>
                      {loc.locationType || 'unknown'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="action-btn view"
                      onClick={() => setSelectedLocation(loc)}
                      title="View on map"
                    >
                      👁️
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => deleteLocation(loc.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLocations.length === 0 && (
            <div className="no-data">
              <p>No location data found</p>
              <button onClick={generateMockLocationData} className="generate-btn">
                Generate Sample Data
              </button>
            </div>
          )}
        </div>
      )}

      {/* Location Details Modal */}
      {selectedLocation && (
        <div className="modal-overlay" onClick={() => setSelectedLocation(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Location Details</h2>
            <button className="modal-close" onClick={() => setSelectedLocation(null)}>×</button>
            
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">📅 Date & Time:</span>
                <span className="detail-value">{new Date(selectedLocation.timestamp).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📍 Coordinates:</span>
                <span className="detail-value">
                  {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">🎯 Accuracy:</span>
                <span className="detail-value">{Math.round(selectedLocation.accuracy)} meters</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">🚀 Speed:</span>
                <span className="detail-value">{selectedLocation.speed || 0} km/h</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">🧭 Heading:</span>
                <span className="detail-value">{selectedLocation.heading || 0}°</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📝 Type:</span>
                <span className="detail-value">{selectedLocation.locationType || 'unknown'}</span>
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">🏢 Address:</span>
                <span className="detail-value">{selectedLocation.formattedAddress || 'Not available'}</span>
              </div>
              {selectedLocation.notes && (
                <div className="detail-item full-width">
                  <span className="detail-label">📌 Notes:</span>
                  <span className="detail-value">{selectedLocation.notes}</span>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button 
                className="btn-primary"
                onClick={() => {
                  window.open(`https://www.google.com/maps?q=${selectedLocation.latitude},${selectedLocation.longitude}`, '_blank');
                }}
              >
                Open in Google Maps
              </button>
              <button 
                className="btn-secondary"
                onClick={() => {
                  navigator.clipboard.writeText(`${selectedLocation.latitude}, ${selectedLocation.longitude}`);
                  alert('Coordinates copied to clipboard!');
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

export default LocationHistory;
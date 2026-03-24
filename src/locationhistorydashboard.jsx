// src/components/pages/LocationHistoryDashboard.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ComposedChart
} from 'recharts';
import './LocationHistoryDashboard.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const LocationHistoryDashboard = ({ user }) => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // day, week, month, year
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]);
  const [mapZoom, setMapZoom] = useState(12);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalLocations: 0,
    uniquePlaces: 0,
    totalDistance: 0,
    avgAccuracy: 0,
    mostVisitedPlace: '',
    peakActivityHour: 0,
    activeDays: 0,
    avgLocationsPerDay: 0,
    topVisitedTypes: {},
    distanceByDay: [],
    activityByHour: [],
    locationHeatmap: [],
    recentTrips: [],
    speedDistribution: [],
    accuracyTrend: []
  });

  useEffect(() => {
    loadLocationData();
  }, []);

  useEffect(() => {
    filterDataByTimeRange();
    calculateDashboardStats();
  }, [locations, timeRange]);

  const loadLocationData = () => {
    try {
      // Load from multiple sources
      const mockLocations = JSON.parse(localStorage.getItem('mockLocations') || '[]');
      const checkIns = JSON.parse(localStorage.getItem('checkIns') || '[]');
      const locationHistory = JSON.parse(localStorage.getItem('locationHistory') || '[]');
      const visits = JSON.parse(localStorage.getItem('mockVisits') || '[]');
      
      // Combine all data
      let allLocations = [...mockLocations, ...checkIns, ...locationHistory, ...visits];
      
      // Remove duplicates by id
      allLocations = allLocations.filter((loc, index, self) => 
        index === self.findIndex(l => l.id === loc.id)
      );
      
      if (allLocations.length === 0) {
        allLocations = generateMockLocationData();
        localStorage.setItem('mockLocations', JSON.stringify(allLocations));
      }
      
      setLocations(allLocations);
      
      // Set map center to most recent location
      if (allLocations.length > 0) {
        setMapCenter([allLocations[0].latitude, allLocations[0].longitude]);
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
      { lat: 40.7128, lng: -74.0060, name: 'Main Office' },
      { lat: 40.7589, lng: -73.9851, name: 'Times Square' },
      { lat: 40.6892, lng: -74.0445, name: 'Statue of Liberty' },
      { lat: 40.7614, lng: -73.9776, name: 'Rockefeller Center' },
      { lat: 40.7580, lng: -73.9855, name: 'Bryant Park' },
      { lat: 40.7484, lng: -73.9857, name: 'Empire State Building' }
    ];

    const locationTypes = ['office', 'client', 'meeting', 'lunch', 'home', 'travel'];
    
    for (let i = 0; i < 500; i++) {
      const center = centers[Math.floor(Math.random() * centers.length)];
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      date.setHours(
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60),
        Math.floor(Math.random() * 60)
      );

      mockData.push({
        id: Date.now() + i,
        latitude: center.lat + (Math.random() - 0.5) * 0.02,
        longitude: center.lng + (Math.random() - 0.5) * 0.02,
        accuracy: Math.random() * 30 + 3,
        speed: Math.random() * 50,
        timestamp: date.toISOString(),
        locationType: locationTypes[Math.floor(Math.random() * locationTypes.length)],
        address: center.name,
        city: 'New York',
        country: 'USA',
        visitDuration: Math.floor(Math.random() * 120) + 10,
        notes: Math.random() > 0.7 ? 'Important meeting' : ''
      });
    }
    return mockData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const filterDataByTimeRange = () => {
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const filtered = locations.filter(loc => new Date(loc.timestamp) >= startDate);
    setFilteredLocations(filtered);
  };

  const calculateDashboardStats = () => {
    if (filteredLocations.length === 0) return;

    // Basic stats
    const totalLocations = filteredLocations.length;
    
    // Unique places
    const uniquePlaces = new Set();
    filteredLocations.forEach(loc => {
      uniquePlaces.add(`${loc.latitude.toFixed(4)},${loc.longitude.toFixed(4)}`);
    });

    // Total distance
    let totalDistance = 0;
    for (let i = 1; i < filteredLocations.length; i++) {
      totalDistance += calculateDistance(
        filteredLocations[i-1].latitude,
        filteredLocations[i-1].longitude,
        filteredLocations[i].latitude,
        filteredLocations[i].longitude
      );
    }

    // Average accuracy
    const avgAccuracy = filteredLocations.reduce((acc, loc) => acc + loc.accuracy, 0) / totalLocations;

    // Most visited place
    const placeCount = {};
    filteredLocations.forEach(loc => {
      const key = loc.address || `${loc.latitude.toFixed(4)},${loc.longitude.toFixed(4)}`;
      placeCount[key] = (placeCount[key] || 0) + 1;
    });
    const mostVisited = Object.entries(placeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Peak activity hour
    const hourCount = Array(24).fill(0);
    filteredLocations.forEach(loc => {
      const hour = new Date(loc.timestamp).getHours();
      hourCount[hour]++;
    });
    const peakHour = hourCount.indexOf(Math.max(...hourCount));

    // Active days
    const activeDays = new Set();
    filteredLocations.forEach(loc => {
      activeDays.add(new Date(loc.timestamp).toDateString());
    });

    // Locations per day
    const avgLocationsPerDay = totalLocations / activeDays.size;

    // Top visited types
    const typeCount = {};
    filteredLocations.forEach(loc => {
      typeCount[loc.locationType] = (typeCount[loc.locationType] || 0) + 1;
    });

    // Distance by day
    const distanceByDay = [];
    const dayMap = new Map();
    for (let i = 1; i < filteredLocations.length; i++) {
      const date = new Date(filteredLocations[i].timestamp).toLocaleDateString();
      const distance = calculateDistance(
        filteredLocations[i-1].latitude,
        filteredLocations[i-1].longitude,
        filteredLocations[i].latitude,
        filteredLocations[i].longitude
      );
      dayMap.set(date, (dayMap.get(date) || 0) + distance);
    }
    dayMap.forEach((value, key) => {
      distanceByDay.push({ date: key, distance: (value / 1000).toFixed(2) });
    });

    // Activity by hour
    const activityByHour = hourCount.map((count, hour) => ({
      hour: `${hour}:00`,
      count
    }));

    // Speed distribution
    const speedRanges = {
      '0-10': 0,
      '11-20': 0,
      '21-30': 0,
      '31-40': 0,
      '41-50': 0,
      '50+': 0
    };
    filteredLocations.forEach(loc => {
      const speed = loc.speed || 0;
      if (speed <= 10) speedRanges['0-10']++;
      else if (speed <= 20) speedRanges['11-20']++;
      else if (speed <= 30) speedRanges['21-30']++;
      else if (speed <= 40) speedRanges['31-40']++;
      else if (speed <= 50) speedRanges['41-50']++;
      else speedRanges['50+']++;
    });
    const speedDistribution = Object.entries(speedRanges).map(([range, count]) => ({
      range,
      count
    }));

    // Accuracy trend
    const accuracyTrend = filteredLocations.slice(0, 20).map((loc, index) => ({
      index: index + 1,
      accuracy: loc.accuracy
    }));

    // Recent trips (group consecutive locations)
    const recentTrips = [];
    let currentTrip = [];
    for (let i = 0; i < Math.min(10, filteredLocations.length); i++) {
      if (currentTrip.length === 0 || 
          calculateDistance(
            currentTrip[currentTrip.length-1].latitude,
            currentTrip[currentTrip.length-1].longitude,
            filteredLocations[i].latitude,
            filteredLocations[i].longitude
          ) < 100) {
        currentTrip.push(filteredLocations[i]);
      } else {
        if (currentTrip.length > 1) {
          recentTrips.push({
            id: recentTrips.length + 1,
            start: new Date(currentTrip[0].timestamp).toLocaleTimeString(),
            end: new Date(currentTrip[currentTrip.length-1].timestamp).toLocaleTimeString(),
            points: currentTrip.length,
            distance: (calculateTripDistance(currentTrip) / 1000).toFixed(2)
          });
        }
        currentTrip = [filteredLocations[i]];
      }
    }

    setDashboardStats({
      totalLocations,
      uniquePlaces: uniquePlaces.size,
      totalDistance: (totalDistance / 1000).toFixed(2),
      avgAccuracy: avgAccuracy.toFixed(1),
      mostVisitedPlace: mostVisited,
      peakActivityHour: peakHour,
      activeDays: activeDays.size,
      avgLocationsPerDay: avgLocationsPerDay.toFixed(1),
      topVisitedTypes: typeCount,
      distanceByDay: distanceByDay.slice(-7),
      activityByHour,
      locationHeatmap: filteredLocations.slice(0, 50).map(loc => ({
        lat: loc.latitude,
        lng: loc.longitude,
        intensity: loc.accuracy ? 100 / loc.accuracy : 1
      })),
      recentTrips: recentTrips.slice(0, 5),
      speedDistribution,
      accuracyTrend
    });
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

  const calculateTripDistance = (trip) => {
    let distance = 0;
    for (let i = 1; i < trip.length; i++) {
      distance += calculateDistance(
        trip[i-1].latitude,
        trip[i-1].longitude,
        trip[i].latitude,
        trip[i].longitude
      );
    }
    return distance;
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading location dashboard...</p>
      </div>
    );
  }

  return (
    <div className="location-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-title">
          <h1>📍 Location Intelligence Dashboard</h1>
          <p>Real-time insights from your location data</p>
        </div>
        <div className="header-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
          <button 
            className="refresh-btn"
            onClick={() => loadLocationData()}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">📍</div>
          <div className="kpi-content">
            <span className="kpi-label">Total Locations</span>
            <span className="kpi-value">{dashboardStats.totalLocations}</span>
            <span className="kpi-trend">+{dashboardStats.avgLocationsPerDay}/day</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">🗺️</div>
          <div className="kpi-content">
            <span className="kpi-label">Unique Places</span>
            <span className="kpi-value">{dashboardStats.uniquePlaces}</span>
            <span className="kpi-trend">{dashboardStats.activeDays} active days</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">📏</div>
          <div className="kpi-content">
            <span className="kpi-label">Total Distance</span>
            <span className="kpi-value">{dashboardStats.totalDistance} km</span>
            <span className="kpi-trend">All trips combined</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">🎯</div>
          <div className="kpi-content">
            <span className="kpi-label">Avg Accuracy</span>
            <span className="kpi-value">±{dashboardStats.avgAccuracy}m</span>
            <span className="kpi-trend">High precision</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Map View */}
        <div className="dashboard-card map-card">
          <div className="card-header">
            <h3>📍 Live Location Map</h3>
            <div className="card-actions">
              <button onClick={() => setMapZoom(15)}>Zoom In</button>
              <button onClick={() => setMapZoom(10)}>Zoom Out</button>
            </div>
          </div>
          <div className="map-container">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
              
              {/* Path line */}
              {filteredLocations.length > 1 && (
                <Polyline
                  positions={filteredLocations.slice(0, 50).map(loc => [loc.latitude, loc.longitude])}
                  color="#4f46e5"
                  weight={3}
                  opacity={0.6}
                />
              )}
              
              {/* Markers */}
              {filteredLocations.slice(0, 50).map((loc, index) => (
                <Marker
                  key={loc.id}
                  position={[loc.latitude, loc.longitude]}
                  eventHandlers={{
                    click: () => setSelectedLocation(loc)
                  }}
                >
                  <Popup>
                    <div className="map-popup">
                      <h4>{loc.address || 'Location'}</h4>
                      <p>📍 {loc.locationType}</p>
                      <p>⏱️ {new Date(loc.timestamp).toLocaleString()}</p>
                      <p>🎯 ±{Math.round(loc.accuracy)}m</p>
                      {loc.visitDuration && (
                        <p>⏳ {formatDuration(loc.visitDuration)}</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Activity by Hour Chart */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>⏰ Activity by Hour</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardStats.activityByHour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="insight-text">
            Peak activity at {dashboardStats.peakActivityHour}:00
          </div>
        </div>

        {/* Distance by Day */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>📊 Daily Distance (km)</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardStats.distanceByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="distance" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Types Distribution */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>📍 Location Types</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(dashboardStats.topVisitedTypes).map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(dashboardStats.topVisitedTypes).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Speed Distribution */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>🚀 Speed Distribution</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardStats.speedDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="range" type="category" />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accuracy Trend */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>🎯 Accuracy Trend</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardStats.accuracyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis domain={[0, 50]} />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#ef4444" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Trips */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>🚗 Recent Trips</h3>
          </div>
          <div className="trips-list">
            {dashboardStats.recentTrips.map((trip, index) => (
              <div key={index} className="trip-item">
                <div className="trip-icon">🚗</div>
                <div className="trip-details">
                  <div className="trip-time">{trip.start} - {trip.end}</div>
                  <div className="trip-meta">
                    <span>{trip.points} locations</span>
                    <span>{trip.distance} km</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Visited Places */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>🏆 Most Visited Places</h3>
          </div>
          <div className="places-list">
            {Object.entries(dashboardStats.topVisitedTypes)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([place, count], index) => (
                <div key={index} className="place-item">
                  <span className="place-rank">{index + 1}</span>
                  <span className="place-name">{place}</span>
                  <span className="place-count">{count} visits</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="timeline-section">
        <h3>📋 Recent Activity Timeline</h3>
        <div className="timeline">
          {filteredLocations.slice(0, 10).map((loc, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-dot" style={{
                backgroundColor: loc.locationType === 'office' ? '#4f46e5' :
                               loc.locationType === 'client' ? '#10b981' :
                               loc.locationType === 'meeting' ? '#f59e0b' : '#6b7280'
              }}></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-time">
                    {new Date(loc.timestamp).toLocaleString()}
                  </span>
                  <span className="timeline-type">{loc.locationType}</span>
                </div>
                <div className="timeline-location">
                  📍 {loc.address || 'Unknown location'}, {loc.city || 'New York'}
                </div>
                {loc.notes && (
                  <div className="timeline-notes">📝 {loc.notes}</div>
                )}
                <div className="timeline-meta">
                  <span>🎯 ±{Math.round(loc.accuracy)}m</span>
                  {loc.speed > 0 && <span>🚀 {loc.speed.toFixed(1)} km/h</span>}
                  {loc.visitDuration && <span>⏳ {formatDuration(loc.visitDuration)}</span>}
                </div>
              </div>
            </div>
          ))}
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
                <span className="detail-label">Address:</span>
                <span className="detail-value">
                  {selectedLocation.address}, {selectedLocation.city}, {selectedLocation.country}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Coordinates:</span>
                <span className="detail-value">
                  {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Timestamp:</span>
                <span className="detail-value">
                  {new Date(selectedLocation.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{selectedLocation.locationType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Accuracy:</span>
                <span className="detail-value">±{Math.round(selectedLocation.accuracy)} meters</span>
              </div>
              {selectedLocation.speed > 0 && (
                <div className="detail-row">
                  <span className="detail-label">Speed:</span>
                  <span className="detail-value">{selectedLocation.speed.toFixed(1)} km/h</span>
                </div>
              )}
              {selectedLocation.visitDuration && (
                <div className="detail-row">
                  <span className="detail-label">Visit Duration:</span>
                  <span className="detail-value">{formatDuration(selectedLocation.visitDuration)}</span>
                </div>
              )}
              {selectedLocation.notes && (
                <div className="detail-row">
                  <span className="detail-label">Notes:</span>
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
                Open in Maps
              </button>
              <button 
                className="btn-secondary"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${selectedLocation.latitude}, ${selectedLocation.longitude}`
                  );
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

export default LocationHistoryDashboard;
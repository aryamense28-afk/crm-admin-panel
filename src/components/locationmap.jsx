// src/components/LocationMap.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import './LocationMap.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createMarkerIcon = (type, color = '#4f46e5', isActive = false) => {
  const colors = {
    current: '#4f46e5',
    office: '#10b981',
    client: '#f59e0b',
    home: '#8b5cf6',
    meeting: '#ec4899',
    restaurant: '#ef4444',
    default: '#6b7280'
  };

  const markerColor = colors[type] || color;

  return L.divIcon({
    className: `custom-marker ${isActive ? 'pulse' : ''}`,
    html: `<div style="
      background-color: ${markerColor};
      width: ${isActive ? '24px' : '16px'};
      height: ${isActive ? '24px' : '16px'};
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ${isActive ? 'animation: markerPulse 1.5s infinite;' : ''}
      position: relative;
    ">
      ${isActive ? '<div class="marker-ring"></div>' : ''}
    </div>`,
    iconSize: [isActive ? 30 : 22, isActive ? 30 : 22],
    popupAnchor: [0, -15]
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
    if (locations && locations.length > 0) {
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

// Search Control Component
const SearchControl = ({ map, onLocationFound }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    
    onLocationFound({
      lat,
      lng: lon,
      name: result.display_name,
      type: 'search'
    });
    
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="search-control">
      <div className="search-input-group">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
          placeholder="Search location..."
          className="search-input"
        />
        <button 
          onClick={searchLocation} 
          disabled={isSearching}
          className="search-btn"
        >
          {isSearching ? '...' : '🔍'}
        </button>
      </div>
      
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.slice(0, 5).map((result, index) => (
            <div
              key={index}
              className="search-result-item"
              onClick={() => handleSelectResult(result)}
            >
              <span className="result-icon">📍</span>
              <span className="result-name">{result.display_name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main LocationMap Component
const LocationMap = ({
  locations = [],
  currentLocation = null,
  geofences = [],
  onLocationClick,
  onMapClick,
  showRoute = false,
  showHeatmap = false,
  height = '600px',
  width = '100%',
  center = [40.7128, -74.0060],
  zoom = 12,
  allowSearch = true,
  allowDrawing = false,
  showControls = true
}) => {
  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawnItems, setDrawnItems] = useState([]);
  const [distance, setDistance] = useState(null);
  const [area, setArea] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [layerControl] = useState(L.control.layers());
  
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);
  const drawnItemsRef = useRef(L.featureGroup());

  // Initialize map
  useEffect(() => {
    if (map) {
      // Add scale control
      L.control.scale({ imperial: false, metric: true }).addTo(map);
      
      // Add fullscreen control
      if (L.control.fullscreen) {
        L.control.fullscreen().addTo(map);
      }
    }
  }, [map]);

  // Update route when locations change
  useEffect(() => {
    if (showRoute && locations.length > 1 && map) {
      calculateRoute();
    }
  }, [locations, showRoute, map]);

  // Calculate route between locations
  const calculateRoute = () => {
    if (!map || locations.length < 2) return;

    // Remove existing routing control
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    const waypoints = locations.map(loc => L.latLng(loc.lat, loc.lng));

    routingControlRef.current = L.Routing.control({
      waypoints,
      routeWhileDragging: true,
      showAlternatives: true,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#4f46e5', opacity: 0.8, weight: 5 }]
      },
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
      })
    }).addTo(map);

    routingControlRef.current.on('routesfound', (e) => {
      const routes = e.routes;
      const summary = routes[0].summary;
      setDistance({
        distance: (summary.totalDistance / 1000).toFixed(2),
        time: Math.round(summary.totalTime / 60)
      });
    });
  };

  // Handle map click
  const handleMapClick = (e) => {
    if (drawingMode) {
      addMarker(e.latlng);
    }
    onMapClick?.(e.latlng);
  };

  // Add marker at clicked location
  const addMarker = (latlng) => {
    const newLocation = {
      id: Date.now(),
      lat: latlng.lat,
      lng: latlng.lng,
      name: `Marker ${drawnItems.length + 1}`,
      type: 'custom'
    };

    setDrawnItems([...drawnItems, newLocation]);
    onLocationClick?.(newLocation);
  };

  // Clear all drawn items
  const clearDrawing = () => {
    setDrawnItems([]);
    drawnItemsRef.current.clearLayers();
    setDistance(null);
    setArea(null);
  };

  // Measure distance between points
  const measureDistance = () => {
    if (drawnItems.length < 2) return;

    let totalDistance = 0;
    for (let i = 1; i < drawnItems.length; i++) {
      const from = L.latLng(drawnItems[i-1].lat, drawnItems[i-1].lng);
      const to = L.latLng(drawnItems[i].lat, drawnItems[i].lng);
      totalDistance += from.distanceTo(to);
    }

    setDistance({
      distance: (totalDistance / 1000).toFixed(2),
      points: drawnItems.length
    });
  };

  // Calculate area for polygon
  const calculateArea = () => {
    if (drawnItems.length < 3) return;

    const latlngs = drawnItems.map(p => L.latLng(p.lat, p.lng));
    const polygon = L.polygon(latlngs);
    const areaInSqMeters = L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]);
    
    setArea({
      sqMeters: areaInSqMeters.toFixed(0),
      sqKm: (areaInSqMeters / 1000000).toFixed(2),
      acres: (areaInSqMeters * 0.000247105).toFixed(2)
    });
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            name: 'Current Location',
            type: 'current'
          };
          setMapCenter([loc.lat, loc.lng]);
          setMapZoom(16);
          onLocationClick?.(loc);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Change map layer
  const changeMapLayer = (layer) => {
    if (!map) return;

    // Remove existing tile layers
    map.eachLayer((l) => {
      if (l instanceof L.TileLayer) {
        map.removeLayer(l);
      }
    });

    // Add new layer
    const layers = {
      street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      dark: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
    };

    L.tileLayer(layers[layer] || layers.street, {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  };

  return (
    <div className="location-map-container" style={{ height, width }}>
      {/* Map Controls */}
      {showControls && (
        <div className="map-controls">
          <div className="control-group">
            <button onClick={getCurrentLocation} className="control-btn" title="My Location">
              📍
            </button>
            <button onClick={() => setMapZoom(z => z + 1)} className="control-btn" title="Zoom In">
              +
            </button>
            <button onClick={() => setMapZoom(z => z - 1)} className="control-btn" title="Zoom Out">
              −
            </button>
            <button onClick={() => setDrawingMode(!drawingMode)} className={`control-btn ${drawingMode ? 'active' : ''}`} title="Drawing Mode">
              ✏️
            </button>
          </div>

          <div className="control-group">
            <select onChange={(e) => changeMapLayer(e.target.value)} className="layer-select" title="Map Layer">
              <option value="street">Street Map</option>
              <option value="satellite">Satellite</option>
              <option value="terrain">Terrain</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>

          {drawingMode && (
            <div className="control-group drawing-tools">
              <button onClick={measureDistance} className="control-btn" title="Measure Distance">
                📏
              </button>
              <button onClick={calculateArea} className="control-btn" title="Calculate Area">
                🔲
              </button>
              <button onClick={clearDrawing} className="control-btn" title="Clear">
                🗑️
              </button>
            </div>
          )}
        </div>
      )}

      {/* Search Control */}
      {allowSearch && (
        <SearchControl 
          map={map} 
          onLocationFound={(loc) => {
            setMapCenter([loc.lat, loc.lng]);
            setMapZoom(16);
            onLocationClick?.(loc);
          }}
        />
      )}

      {/* Measurements Display */}
      {(distance || area) && (
        <div className="measurements-panel">
          {distance && (
            <div className="measurement">
              <span>📏 Distance: {distance.distance} km</span>
              <span>📍 {distance.points} points</span>
            </div>
          )}
          {area && (
            <div className="measurement">
              <span>🔲 Area: {area.sqMeters} m²</span>
              <span>🌾 {area.acres} acres</span>
            </div>
          )}
        </div>
      )}

      {/* Route Info */}
      {distance && distance.time && (
        <div className="route-info">
          <span>🚗 Estimated time: {distance.time} min</span>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap}
        className="leaflet-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <MapController 
          center={mapCenter}
          zoom={mapZoom}
          locations={[...locations, ...drawnItems]}
        />

        {/* Click handler */}
        {useMapEvents({ click: handleMapClick })}

        {/* Geofences */}
        {geofences.map((fence, idx) => (
          <Circle
            key={`fence-${idx}`}
            center={[fence.latitude, fence.longitude]}
            radius={fence.radius}
            pathOptions={{
              color: fence.color || '#4f46e5',
              fillColor: fence.color || '#4f46e5',
              fillOpacity: 0.1,
              weight: 2
            }}
          >
            <Popup>
              <div className="geofence-popup">
                <strong>{fence.name}</strong>
                {fence.description && <p>{fence.description}</p>}
                <p>Radius: {fence.radius}m</p>
                {fence.type && <p>Type: {fence.type}</p>}
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Location markers */}
        {locations.map((loc, idx) => (
          <Marker
            key={`loc-${idx}`}
            position={[loc.lat, loc.lng]}
            icon={createMarkerIcon(loc.type, loc.color)}
            eventHandlers={{
              click: () => {
                setSelectedMarker(loc);
                onLocationClick?.(loc);
              }
            }}
          >
            <Popup>
              <div className="location-popup">
                <h4>{loc.name || `Location ${idx + 1}`}</h4>
                {loc.address && <p className="address">📍 {loc.address}</p>}
                <p className="coordinates">
                  {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}
                </p>
                {loc.time && <p className="time">🕒 {loc.time}</p>}
                {loc.accuracy && <p className="accuracy">🎯 ±{loc.accuracy}m</p>}
                {loc.notes && <p className="notes">📝 {loc.notes}</p>}
                <button 
                  className="popup-btn"
                  onClick={() => window.open(`https://www.google.com/maps?q=${loc.lat},${loc.lng}`, '_blank')}
                >
                  Open in Maps
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Current location marker */}
        {currentLocation && (
          <Marker
            position={[currentLocation.lat, currentLocation.lng]}
            icon={createMarkerIcon('current', '#4f46e5', true)}
          >
            <Popup>
              <div className="location-popup current">
                <h4>📍 You are here</h4>
                <p className="coordinates">
                  {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                </p>
                {currentLocation.accuracy && (
                  <p className="accuracy">🎯 ±{currentLocation.accuracy}m</p>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Path line between locations */}
        {locations.length > 1 && !showRoute && (
          <Polyline
            positions={locations.map(loc => [loc.lat, loc.lng])}
            color="#4f46e5"
            weight={3}
            opacity={0.7}
          />
        )}

        {/* Drawn items */}
        {drawnItems.length > 0 && (
          <>
            <Polyline
              positions={drawnItems.map(p => [p.lat, p.lng])}
              color="#f59e0b"
              weight={4}
              opacity={0.8}
              dashArray="5, 5"
            />
            {drawnItems.map((item, idx) => (
              <Marker
                key={`draw-${idx}`}
                position={[item.lat, item.lng]}
                icon={createMarkerIcon('default', '#f59e0b')}
              >
                <Popup>
                  <div className="drawing-popup">
                    <strong>Point {idx + 1}</strong>
                    <p>{item.lat.toFixed(6)}, {item.lng.toFixed(6)}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>

      {/* Selected marker details */}
      {selectedMarker && (
        <div className="marker-details">
          <button className="close-btn" onClick={() => setSelectedMarker(null)}>×</button>
          <h4>{selectedMarker.name || 'Location'}</h4>
          <p>Lat: {selectedMarker.lat.toFixed(6)}</p>
          <p>Lng: {selectedMarker.lng.toFixed(6)}</p>
          {selectedMarker.accuracy && <p>Accuracy: ±{selectedMarker.accuracy}m</p>}
          <div className="details-actions">
            <button onClick={() => {
              navigator.clipboard.writeText(`${selectedMarker.lat}, ${selectedMarker.lng}`);
              alert('Coordinates copied!');
            }}>
              Copy
            </button>
            <button onClick={() => window.open(`https://www.google.com/maps?q=${selectedMarker.lat},${selectedMarker.lng}`, '_blank')}>
              Maps
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
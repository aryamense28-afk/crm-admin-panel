// src/components/SimpleMap.jsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const SimpleMap = ({ locations, center, zoom = 13 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Initialize map
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [center?.lat || 40.7128, center?.lng || -74.0060], 
        zoom
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !locations.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    const pathPoints = [];
    
    locations.forEach((loc, index) => {
      const marker = L.marker([loc.latitude, loc.longitude])
        .bindPopup(`
          <b>Location #${index + 1}</b><br>
          Time: ${new Date(loc.timestamp).toLocaleString()}<br>
          Accuracy: ${Math.round(loc.accuracy)}m
        `)
        .addTo(mapInstanceRef.current);
      
      markersRef.current.push(marker);
      pathPoints.push([loc.latitude, loc.longitude]);
    });

    // Draw path line
    if (pathPoints.length > 1) {
      L.polyline(pathPoints, { color: 'blue', weight: 3 }).addTo(mapInstanceRef.current);
    }

    // Fit bounds to show all markers
    if (pathPoints.length > 0) {
      const bounds = L.latLngBounds(pathPoints);
      mapInstanceRef.current.fitBounds(bounds.pad(0.1));
    }
  }, [locations]);

  return <div ref={mapRef} style={{ height: '500px', width: '100%', borderRadius: '8px' }} />;
};

export default SimpleMap;
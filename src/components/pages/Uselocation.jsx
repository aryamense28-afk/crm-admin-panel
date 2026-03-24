// hooks/useLocation.js
import { useState, useEffect, useCallback } from 'react';
import LocationService from '../services/LocationService';

export const useLocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationHistory, setLocationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const position = await LocationService.getCurrentPosition(options);
      setLocation(position);
      
      // Reverse geocode to get address
      const address = await reverseGeocode(position.latitude, position.longitude);
      setLocation({ ...position, formattedAddress: address });
      
      return position;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  // Start tracking
  const startTracking = useCallback(() => {
    try {
      LocationService.startTracking(options);
      setIsTracking(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [options]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    LocationService.stopTracking();
    setIsTracking(false);
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    LocationService.clearLocationHistory();
    setLocationHistory([]);
  }, []);

  // Check if within geofence
  const checkGeofence = useCallback((geofence) => {
    if (!location) return false;
    return LocationService.isWithinGeofence(
      location.latitude,
      location.longitude,
      geofence
    );
  }, [location]);

  // Calculate distance to point
  const distanceTo = useCallback((lat, lon) => {
    if (!location) return null;
    return LocationService.calculateDistance(
      location.latitude,
      location.longitude,
      lat,
      lon
    );
  }, [location]);

  // Set up listeners
  useEffect(() => {
    const handlePositionUpdate = (position) => {
      setLocation(position);
      setLocationHistory(LocationService.getLocationHistory());
    };

    const handleError = (error) => {
      setError(error.message);
    };

    const handleTrackingStopped = () => {
      setIsTracking(false);
    };

    LocationService.addListener('positionUpdate', handlePositionUpdate);
    LocationService.addListener('error', handleError);
    LocationService.addListener('trackingStopped', handleTrackingStopped);

    return () => {
      LocationService.removeListener('positionUpdate', handlePositionUpdate);
      LocationService.removeListener('error', handleError);
      LocationService.removeListener('trackingStopped', handleTrackingStopped);
    };
  }, []);

  return {
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
  };
};

// Reverse geocoding function
async function reverseGeocode(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    return data.display_name;
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return null;
  }
}
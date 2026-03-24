// components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, userType }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  
  // Refs for tracking
  const watchIdRef = useRef(null);
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);

  // Check location permission on mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        setLocationPermission(result.state);
        result.onchange = () => setLocationPermission(result.state);
      });
    }
  }, []);

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowLocationMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clean up tracking on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Get current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          };
          setLocation(locationData);
          resolve(locationData);
        },
        (error) => {
          let errorMessage = 'Location error';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
            default:
              errorMessage = error.message;
          }
          setError(errorMessage);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  // Start real-time tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setIsTracking(true);
    
    // Clear any existing watch
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        };
        setLocation(locationData);
        setError(null);
        
        // Save to localStorage for history
        saveLocationToHistory(locationData);
      },
      (error) => {
        console.error('Tracking error:', error);
        setError('Tracking error occurred');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
        distanceFilter: 10 // Update every 10 meters
      }
    );

    console.log('Real-time tracking started');
  };

  // Stop tracking
  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    console.log('Tracking stopped');
  };

  // Save location to history
  const saveLocationToHistory = (locationData) => {
    try {
      const history = JSON.parse(localStorage.getItem('locationHistory') || '[]');
      const newEntry = {
        id: Date.now(),
        ...locationData,
        timestamp: new Date().toISOString()
      };
      history.push(newEntry);
      // Keep only last 100 entries
      if (history.length > 100) {
        history.shift();
      }
      localStorage.setItem('locationHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const handleLogout = () => {
    // Stop location tracking on logout
    if (isTracking) {
      stopTracking();
    }
    localStorage.removeItem('crmUser');
    localStorage.removeItem('crmToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('locationHistory');
    localStorage.removeItem('checkIns');
    navigate('/');
  };

  const handleLocationToggle = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
    setShowLocationMenu(false);
  };

  const handleCheckIn = async () => {
    try {
      setIsLoading(true);
      const position = await getCurrentLocation();
      
      // Store in localStorage
      const checkIns = JSON.parse(localStorage.getItem('checkIns') || '[]');
      const checkInData = {
        id: Date.now(),
        userId: user?.id || 'unknown',
        userName: user?.name || 'User',
        location: {
          lat: position.latitude,
          lng: position.longitude,
          accuracy: position.accuracy
        },
        timestamp: new Date().toISOString(),
        type: 'manual_check_in'
      };
      
      checkIns.push(checkInData);
      localStorage.setItem('checkIns', JSON.stringify(checkIns));
      
      // Show success message
      alert(`✅ Check-in recorded successfully!\nLocation: ${position.latitude.toFixed(4)}, ${position.longitude.toFixed(4)}`);
    } catch (error) {
      console.error('Check-in failed:', error);
      alert('❌ Failed to record check-in. Please try again.');
    } finally {
      setIsLoading(false);
      setShowLocationMenu(false);
    }
  };

  // Get last check-in time
  const getLastCheckIn = () => {
    try {
      const checkIns = JSON.parse(localStorage.getItem('checkIns') || '[]');
      if (checkIns.length > 0) {
        const last = checkIns[checkIns.length - 1];
        return new Date(last.timestamp).toLocaleTimeString();
      }
    } catch (error) {
      console.error('Error getting last check-in:', error);
    }
    return null;
  };

  const menuItems = {
    admin: [
      { path: '/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/leads', icon: '👥', label: 'Leads' },
      { path: '/contacts', icon: '📇', label: 'Contacts' },
      { path: '/deals', icon: '💰', label: 'Deals' },
      { path: '/tasks', icon: '✅', label: 'Tasks' },
      { path: '/tickets', icon: '🎫', label: 'Tickets' },
      { path: '/email', icon: '📧', label: 'Email' },
      { path: '/chatbot', icon: '🤖', label: 'Chatbot' },
      { path: '/calendar', icon: '📅', label: 'Calendar' },
      { path: '/documents', icon: '📄', label: 'Documents' },
      { path: '/reports', icon: '📊', label: 'Reports' },
      { path: '/sales-pipeline', icon: '📈', label: 'Sales Pipeline' },
      { path: '/sales-management', icon: '📉', label: 'Sales Mgmt' },
      { path: '/orders', icon: '📦', label: 'Orders' },
      { path: '/billing', icon: '💳', label: 'Billing' },
      { path: '/automation', icon: '⚙️', label: 'Automation' },
      { path: '/settings', icon: '🔧', label: 'Settings' },
      { path: '/profile', icon: '👤', label: 'Profile' },
      { path: '/mobile-crm', icon: '📱', label: 'Mobile CRM' },
      { path: '/location-tracking', icon: '📍', label: 'Location History' },
    ],
    customer: [
      { path: '/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/leads', icon: '👥', label: 'My Leads' },
      { path: '/tasks', icon: '✅', label: 'My Tasks' },
      { path: '/tickets', icon: '🎫', label: 'Support' },
      { path: '/email', icon: '📧', label: 'Inbox' },
      { path: '/chatbot', icon: '🤖', label: 'Chat Support' },
      { path: '/calendar', icon: '📅', label: 'Calendar' },
      { path: '/documents', icon: '📄', label: 'Documents' },
      { path: '/customer-panel', icon: '👤', label: 'My Account' },
      { path: '/profile', icon: '⚙️', label: 'Profile' },
    ]
  };

  const items = userType === 'admin' ? menuItems.admin : menuItems.customer;
  const lastCheckIn = getLastCheckIn();

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
            ☰
          </button>
          <NavLink to="/dashboard" className="brand-logo">
            📊 CRM Enterprise
          </NavLink>
        </div>

        <div className="navbar-search">
          <input type="text" placeholder="Search..." />
          <span className="search-icon">🔍</span>
        </div>

        <div className="navbar-actions">
          {/* Location Status Indicator */}
          {userType === 'admin' && (
            <div className="location-menu-container" ref={menuRef}>
              <button 
                className={`action-btn location-btn ${isTracking ? 'tracking-active' : ''}`}
                onClick={() => setShowLocationMenu(!showLocationMenu)}
                title={isTracking ? 'Location tracking active' : 'Location tracking inactive'}
              >
                {isTracking ? '📍' : '🌍'}
                {isTracking && <span className="pulse-dot"></span>}
              </button>
              
              {showLocationMenu && (
                <div className="location-dropdown">
                  <div className="location-header">
                    <h4>Location Tracking</h4>
                    {location && (
                      <span className="location-time">
                        {new Date(location.timestamp).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  
                  {location ? (
                    <div className="location-preview">
                      <div className="coord-item">
                        <span className="coord-label">Lat:</span>
                        <span className="coord-value">{location.latitude.toFixed(6)}</span>
                      </div>
                      <div className="coord-item">
                        <span className="coord-label">Lng:</span>
                        <span className="coord-value">{location.longitude.toFixed(6)}</span>
                      </div>
                      {location.accuracy && (
                        <div className="coord-item">
                          <span className="coord-label">Accuracy:</span>
                          <span className="coord-value">±{Math.round(location.accuracy)}m</span>
                        </div>
                      )}
                      {location.speed > 0 && (
                        <div className="coord-item">
                          <span className="coord-label">Speed:</span>
                          <span className="coord-value">{location.speed.toFixed(1)} m/s</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="location-preview no-location">
                      <p>No location data yet</p>
                    </div>
                  )}

                  {lastCheckIn && (
                    <div className="last-checkin">
                      <small>Last check-in: {lastCheckIn}</small>
                    </div>
                  )}
                  
                  <div className="location-actions">
                    <button 
                      className={`location-action-btn ${isTracking ? 'stop' : 'start'}`}
                      onClick={handleLocationToggle}
                      disabled={isLoading}
                    >
                      {isLoading ? '...' : isTracking ? '⏹️ Stop Tracking' : '▶️ Start Tracking'}
                    </button>
                    
                    <button 
                      className="location-action-btn check-in"
                      onClick={handleCheckIn}
                      disabled={isLoading}
                    >
                      {isLoading ? '⏳ Checking...' : '✅ Check In'}
                    </button>
                  </div>
                  
                  {error && (
                    <div className="location-error">
                      ⚠️ {error}
                    </div>
                  )}
                  
                  {locationPermission === 'denied' && (
                    <div className="location-warning">
                      ⚠️ Location permission denied. 
                      <button 
                        className="permission-help-btn"
                        onClick={() => window.open('https://support.google.com/chrome/answer/142065?hl=en', '_blank')}
                      >
                        Learn how to enable
                      </button>
                    </div>
                  )}
                  
                  <NavLink 
                    to="/location-tracking" 
                    className="location-history-link"
                    onClick={() => setShowLocationMenu(false)}
                  >
                    View Full History →
                  </NavLink>
                </div>
              )}
            </div>
          )}

          <button className="action-btn" onClick={() => navigate('/notifications')}>
            🔔
            <span className="notification-badge">3</span>
          </button>
          
          <div className="user-menu-container" ref={userMenuRef}>
            <button 
              className="user-menu-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img 
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=4f46e5&color=fff`} 
                alt={user?.name || 'User'}
                className="user-avatar-small"
              />
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="dropdown-icon">▼</span>
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <NavLink to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                  <span className="item-icon">👤</span>
                  Profile
                </NavLink>
                <NavLink to="/settings" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                  <span className="item-icon">⚙️</span>
                  Settings
                </NavLink>
                {userType === 'admin' && (
                  <NavLink to="/location-tracking" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <span className="item-icon">📍</span>
                    Location History
                  </NavLink>
                )}
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <span className="item-icon">🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="user-info">
            <img 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=4f46e5&color=fff`} 
              alt={user?.name || 'User'} 
              className="user-avatar" 
            />
            <div className="user-details">
              <span className="user-fullname">{user?.name || 'User'}</span>
              <span className="user-type">{userType === 'admin' ? 'Administrator' : 'Customer'}</span>
            </div>
          </div>
          
          {/* Location status in sidebar */}
          {userType === 'admin' && (
            <div className="sidebar-location">
              <span className="location-indicator">
                <span className={`status-dot ${isTracking ? 'active' : 'inactive'}`}></span>
                {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
              </span>
              {location && (
                <div className="sidebar-coords">
                  <small>📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</small>
                </div>
              )}
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {items.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="system-info">
            <span className="info-item">Version 2.0.0</span>
            <span className="info-item">© 2024 CRM</span>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

export default Navbar;
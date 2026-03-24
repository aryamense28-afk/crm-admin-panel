// components/CustomerVisit.jsx
import React, { useState } from 'react';
import { useLocation } from '../hooks/useLocation';
import './CustomerVisit.css';

const CustomerVisit = ({ customer, onVisitStart, onVisitEnd }) => {
  const [visitStarted, setVisitStarted] = useState(false);
  const [visitNotes, setVisitNotes] = useState('');
  const [visitPurpose, setVisitPurpose] = useState('');
  
  const {
    location,
    getCurrentLocation,
    isLoading
  } = useLocation();

  const handleStartVisit = async () => {
    try {
      const position = await getCurrentLocation();
      setVisitStarted(true);
      
      if (onVisitStart) {
        onVisitStart({
          customerId: customer.id,
          location: position,
          purpose: visitPurpose,
          startTime: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Failed to start visit:', error);
    }
  };

  const handleEndVisit = async () => {
    try {
      const position = await getCurrentLocation();
      setVisitStarted(false);
      
      if (onVisitEnd) {
        onVisitEnd({
          customerId: customer.id,
          location: position,
          notes: visitNotes,
          endTime: new Date().toISOString()
        });
      }
      
      // Reset form
      setVisitNotes('');
      setVisitPurpose('');
    } catch (error) {
      console.error('Failed to end visit:', error);
    }
  };

  return (
    <div className="customer-visit">
      <div className="customer-info">
        <h3>{customer.name}</h3>
        <p>{customer.address}</p>
        <p>Phone: {customer.phone}</p>
      </div>

      {!visitStarted ? (
        <div className="visit-start-form">
          <h4>Start Customer Visit</h4>
          
          <div className="form-group">
            <label>Visit Purpose:</label>
            <select 
              value={visitPurpose} 
              onChange={(e) => setVisitPurpose(e.target.value)}
            >
              <option value="">Select purpose</option>
              <option value="meeting">Meeting</option>
              <option value="sales">Sales Call</option>
              <option value="support">Support</option>
              <option value="delivery">Delivery</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button 
            onClick={handleStartVisit}
            disabled={!visitPurpose || isLoading}
            className="btn btn-success"
          >
            {isLoading ? 'Getting Location...' : 'Start Visit'}
          </button>
        </div>
      ) : (
        <div className="visit-end-form">
          <h4>End Customer Visit</h4>
          
          <div className="form-group">
            <label>Visit Notes:</label>
            <textarea
              value={visitNotes}
              onChange={(e) => setVisitNotes(e.target.value)}
              placeholder="Add notes about the visit..."
              rows="4"
            />
          </div>

          {location && (
            <div className="location-info">
              <p>Check-in Location:</p>
              <p>Lat: {location.latitude.toFixed(6)}</p>
              <p>Lng: {location.longitude.toFixed(6)}</p>
            </div>
          )}

          <button 
            onClick={handleEndVisit}
            disabled={isLoading}
            className="btn btn-danger"
          >
            {isLoading ? 'Getting Location...' : 'End Visit'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerVisit;
// src/components/pages/MapTestPage.jsx
import React from 'react';
import WorkingMap from '../WorkingMap';

const MapTestPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', color: '#1e293b' }}>🗺️ Working Map Test</h1>
      <WorkingMap />
    </div>
  );
};

export default MapTestPage;
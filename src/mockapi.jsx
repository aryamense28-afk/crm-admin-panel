// src/services/mockApi.js

// Mock data storage
let mockLocations = JSON.parse(localStorage.getItem('mockLocations') || '[]');
let mockVisits = JSON.parse(localStorage.getItem('mockVisits') || '[]');
let mockGeofences = JSON.parse(localStorage.getItem('mockGeofences') || '[]');

// Initialize with some mock data if empty
if (mockGeofences.length === 0) {
  mockGeofences = [
    {
      id: 1,
      name: 'Main Office',
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 100,
      type: 'office',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Downtown Branch',
      latitude: 40.7589,
      longitude: -73.9851,
      radius: 150,
      type: 'office',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];
  localStorage.setItem('mockGeofences', JSON.stringify(mockGeofences));
}

// Mock API service
export const mockApi = {
  // Locations
  saveLocation: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLocation = {
          id: mockLocations.length + 1,
          ...data,
          created_at: new Date().toISOString()
        };
        mockLocations.push(newLocation);
        localStorage.setItem('mockLocations', JSON.stringify(mockLocations));
        resolve({ success: true, data: newLocation });
      }, 500);
    });
  },

  getLocations: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userLocations = mockLocations.filter(loc => loc.userId === userId);
        resolve({ success: true, data: userLocations });
      }, 500);
    });
  },

  // Visits
  startVisit: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newVisit = {
          id: mockVisits.length + 1,
          ...data,
          created_at: new Date().toISOString()
        };
        mockVisits.push(newVisit);
        localStorage.setItem('mockVisits', JSON.stringify(mockVisits));
        resolve({ success: true, data: newVisit });
      }, 500);
    });
  },

  endVisit: async (visitId, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const visit = mockVisits.find(v => v.id === visitId);
        if (visit) {
          Object.assign(visit, data);
          localStorage.setItem('mockVisits', JSON.stringify(mockVisits));
          resolve({ success: true, data: visit });
        } else {
          resolve({ success: false, error: 'Visit not found' });
        }
      }, 500);
    });
  },

  getVisits: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userVisits = mockVisits.filter(v => v.userId === userId);
        resolve({ success: true, data: userVisits });
      }, 500);
    });
  },

  // Geofences
  createGeofence: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newGeofence = {
          id: mockGeofences.length + 1,
          ...data,
          created_at: new Date().toISOString()
        };
        mockGeofences.push(newGeofence);
        localStorage.setItem('mockGeofences', JSON.stringify(mockGeofences));
        resolve({ success: true, data: newGeofence });
      }, 500);
    });
  },

  getGeofences: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockGeofences });
      }, 500);
    });
  },

  updateGeofence: async (id, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const geofence = mockGeofences.find(g => g.id === id);
        if (geofence) {
          Object.assign(geofence, data);
          localStorage.setItem('mockGeofences', JSON.stringify(mockGeofences));
          resolve({ success: true, data: geofence });
        } else {
          resolve({ success: false, error: 'Geofence not found' });
        }
      }, 500);
    });
  },

  deleteGeofence: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockGeofences = mockGeofences.filter(g => g.id !== id);
        localStorage.setItem('mockGeofences', JSON.stringify(mockGeofences));
        resolve({ success: true });
      }, 500);
    });
  }
};
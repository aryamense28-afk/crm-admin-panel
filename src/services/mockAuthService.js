// src/services/mockAuthService.js
const MOCK_USER = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'super_admin',
  department: 'IT',
  permissions: [
    'deal.create', 'deal.edit', 'deal.delete', 'deal.view',
    'user.create', 'user.edit', 'user.delete', 'user.view',
    'analytics.view', 'analytics.export'
  ]
};

export const mockAuthService = {
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email === 'admin@example.com' && password === 'password') {
      return {
        success: true,
        data: {
          user: MOCK_USER,
          token: 'mock-jwt-token',
          permissions: MOCK_USER.permissions
        }
      };
    }
    
    return {
      success: false,
      message: 'Invalid credentials'
    };
  },

  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: {
        user: MOCK_USER,
        permissions: MOCK_USER.permissions
      }
    };
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true };
  }
};
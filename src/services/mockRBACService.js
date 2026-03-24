// src/services/mockRBACService.js
const MOCK_ROLES = [
  {
    id: '1',
    name: 'super_admin',
    displayName: 'Super Administrator',
    description: 'Full system access with all permissions',
    level: 100,
    color: '#ef4444',
    icon: 'Shield',
    permissions: [
      'deal.create', 'deal.edit', 'deal.delete', 'deal.view', 'deal.move',
      'user.create', 'user.edit', 'user.delete', 'user.view', 'user.assign_role',
      'analytics.view', 'analytics.export', 'analytics.create_report',
      'system.settings', 'system.audit_log'
    ],
    userCount: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    metadata: { isSystem: true, department: 'IT' }
  },
  {
    id: '2',
    name: 'admin',
    displayName: 'Administrator',
    description: 'Full access to CRM features',
    level: 90,
    color: '#f59e0b',
    icon: 'Shield',
    permissions: [
      'deal.create', 'deal.edit', 'deal.delete', 'deal.view', 'deal.move',
      'user.create', 'user.edit', 'user.view',
      'analytics.view', 'analytics.export'
    ],
    userCount: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    metadata: { isSystem: true, department: 'Administration' }
  },
  {
    id: '3',
    name: 'sales_manager',
    displayName: 'Sales Manager',
    description: 'Manages sales team and oversees deals',
    level: 80,
    color: '#3b82f6',
    icon: 'Users',
    permissions: [
      'deal.create', 'deal.edit', 'deal.view', 'deal.move',
      'analytics.view', 'analytics.export'
    ],
    userCount: 3,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    metadata: { isSystem: false, department: 'Sales', maxUsers: 10 }
  },
  {
    id: '4',
    name: 'sales_rep',
    displayName: 'Sales Representative',
    description: 'Handles individual sales deals',
    level: 50,
    color: '#10b981',
    icon: 'Users',
    permissions: [
      'deal.create', 'deal.edit', 'deal.view'
    ],
    userCount: 15,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    metadata: { isSystem: false, department: 'Sales' }
  },
  {
    id: '5',
    name: 'viewer',
    displayName: 'Viewer',
    description: 'Read-only access to deals and analytics',
    level: 10,
    color: '#6b7280',
    icon: 'Eye',
    permissions: [
      'deal.view', 'analytics.view'
    ],
    userCount: 8,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    metadata: { isSystem: false, department: 'All' }
  }
];

const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'sales_manager',
    roleDisplayName: 'Sales Manager',
    department: 'Sales',
    team: 'Enterprise',
    status: 'active',
    avatar: null
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'sales_rep',
    roleDisplayName: 'Sales Representative',
    department: 'Sales',
    team: 'SMB',
    status: 'active',
    avatar: null
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'sales_rep',
    roleDisplayName: 'Sales Representative',
    department: 'Sales',
    team: 'Enterprise',
    status: 'inactive',
    avatar: null
  }
];

export const mockRBACService = {
  getRoles: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: MOCK_ROLES
    };
  },

  getPermissions: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const allPermissions = [
      'deal.create', 'deal.edit', 'deal.delete', 'deal.view', 'deal.move',
      'user.create', 'user.edit', 'user.delete', 'user.view', 'user.assign_role',
      'analytics.view', 'analytics.export', 'analytics.create_report',
      'system.settings', 'system.audit_log'
    ];
    return {
      success: true,
      data: allPermissions
    };
  },

  createRole: async (roleData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newRole = {
      id: String(Date.now()),
      ...roleData,
      userCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        ...roleData.metadata,
        isSystem: false
      }
    };
    MOCK_ROLES.push(newRole);
    return {
      success: true,
      data: newRole
    };
  },

  updateRole: async (roleId, roleData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = MOCK_ROLES.findIndex(r => r.id === roleId);
    if (index !== -1) {
      MOCK_ROLES[index] = {
        ...MOCK_ROLES[index],
        ...roleData,
        updatedAt: new Date().toISOString()
      };
      return {
        success: true,
        data: MOCK_ROLES[index]
      };
    }
    return {
      success: false,
      message: 'Role not found'
    };
  },

  deleteRole: async (roleId) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = MOCK_ROLES.findIndex(r => r.id === roleId);
    if (index !== -1) {
      if (MOCK_ROLES[index].metadata?.isSystem) {
        return {
          success: false,
          message: 'Cannot delete system role'
        };
      }
      MOCK_ROLES.splice(index, 1);
      return {
        success: true,
        data: { deleted: true }
      };
    }
    return {
      success: false,
      message: 'Role not found'
    };
  },

  getRoleUsers: async (roleId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const role = MOCK_ROLES.find(r => r.id === roleId);
    if (role) {
      const users = MOCK_USERS.filter(u => u.role === role.name);
      return {
        success: true,
        data: users
      };
    }
    return {
      success: false,
      message: 'Role not found'
    };
  },

  assignRole: async (userId, roleId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = MOCK_USERS.find(u => u.id === userId);
    const role = MOCK_ROLES.find(r => r.id === roleId);
    
    if (user && role) {
      user.role = role.name;
      user.roleDisplayName = role.displayName;
      return {
        success: true,
        data: user
      };
    }
    return {
      success: false,
      message: 'User or role not found'
    };
  },

  getRoleActivity: async (roleId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const activities = [
      {
        id: '1',
        action: 'Role Updated',
        user: 'Admin User',
        timestamp: new Date().toISOString(),
        details: 'Permissions modified'
      },
      {
        id: '2',
        action: 'User Assigned',
        user: 'John Doe',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        details: 'User assigned to role'
      }
    ];
    return {
      success: true,
      data: activities
    };
  }
};
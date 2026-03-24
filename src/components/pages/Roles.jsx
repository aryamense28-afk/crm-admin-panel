// components/RoleManagement.jsx
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Role.css';

const RoleManagement = () => {
  const { user, hasPermission } = useAuth();
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('roles'); // roles, users, permissions
  
  // Form states
  const [newRole, setNewRole] = useState({
    name: '',
    displayName: '',
    description: '',
    level: 0,
    permissions: [],
    inherits: []
  });
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRoleAssignment, setUserRoleAssignment] = useState('');

  // Check permissions
  const canManageRoles = hasPermission(Permission.MANAGE_ROLES);
  const canManageUsers = hasPermission(Permission.MANAGE_USERS);
  const canAssignRoles = hasPermission(Permission.ASSIGN_ROLES);

  useEffect(() => {
    if (canManageRoles) {
      fetchRoles();
    }
    if (canManageUsers) {
      fetchUsers();
    }
  }, [canManageRoles, canManageUsers]);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      // API call to fetch roles
      const response = await fetch('/api/roles');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRole.name || !newRole.displayName) {
      toast.error('Please fill in required fields');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole)
      });
      
      if (response.ok) {
        toast.success('Role created successfully');
        setShowCreateModal(false);
        setNewRole({
          name: '',
          displayName: '',
          description: '',
          level: 0,
          permissions: [],
          inherits: []
        });
        fetchRoles();
      } else {
        toast.error('Failed to create role');
      }
    } catch (error) {
      toast.error('Error creating role');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/roles/${selectedRole.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedRole)
      });
      
      if (response.ok) {
        toast.success('Role updated successfully');
        setShowEditModal(false);
        fetchRoles();
      } else {
        toast.error('Failed to update role');
      }
    } catch (error) {
      toast.error('Error updating role');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast.success('Role deleted successfully');
        fetchRoles();
      } else {
        toast.error('Failed to delete role');
      }
    } catch (error) {
      toast.error('Error deleting role');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !userRoleAssignment) {
      toast.error('Please select a user and role');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${selectedUser.id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: userRoleAssignment })
      });
      
      if (response.ok) {
        toast.success(`Role assigned to ${selectedUser.name}`);
        setShowAssignModal(false);
        fetchUsers();
      } else {
        toast.error('Failed to assign role');
      }
    } catch (error) {
      toast.error('Error assigning role');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permission, isChecked) => {
    if (isChecked) {
      setSelectedRole({
        ...selectedRole,
        permissions: [...selectedRole.permissions, permission]
      });
    } else {
      setSelectedRole({
        ...selectedRole,
        permissions: selectedRole.permissions.filter(p => p !== permission)
      });
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(selectedRole.permissions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setSelectedRole({
      ...selectedRole,
      permissions: items
    });
  };

  // Filtered roles and users
  const filteredRoles = roles.filter(role =>
    role.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Permission categories for better organization
  const permissionCategories = {
    'Deal Management': [
      Permission.CREATE_DEAL,
      Permission.EDIT_DEAL,
      Permission.DELETE_DEAL,
      Permission.VIEW_DEAL,
      Permission.MOVE_DEAL,
      Permission.CLONE_DEAL,
      Permission.ARCHIVE_DEAL
    ],
    'Pipeline Management': [
      Permission.EDIT_PIPELINE,
      Permission.CREATE_STAGE,
      Permission.EDIT_STAGE,
      Permission.DELETE_STAGE
    ],
    'Analytics & Reports': [
      Permission.VIEW_ANALYTICS,
      Permission.VIEW_FORECAST,
      Permission.EXPORT_DATA,
      Permission.VIEW_REPORTS,
      Permission.CREATE_REPORT
    ],
    'User Management': [
      Permission.MANAGE_USERS,
      Permission.MANAGE_ROLES,
      Permission.ASSIGN_ROLES,
      Permission.VIEW_USERS
    ],
    'Team Management': [
      Permission.MANAGE_TEAM,
      Permission.VIEW_TEAM,
      Permission.ASSIGN_LEADS
    ],
    'Approval Workflows': [
      Permission.APPROVE_DEALS,
      Permission.REQUEST_APPROVAL
    ],
    'System': [
      Permission.VIEW_AUDIT_LOG,
      Permission.EXPORT_AUDIT_LOG,
      Permission.MANAGE_SETTINGS,
      Permission.MANAGE_INTEGRATIONS
    ]
  };

  const permissionLabels = {
    [Permission.CREATE_DEAL]: 'Create Deals',
    [Permission.EDIT_DEAL]: 'Edit Deals',
    [Permission.DELETE_DEAL]: 'Delete Deals',
    [Permission.VIEW_DEAL]: 'View Deals',
    [Permission.MOVE_DEAL]: 'Move Deals',
    [Permission.CLONE_DEAL]: 'Clone Deals',
    [Permission.ARCHIVE_DEAL]: 'Archive Deals',
    [Permission.EDIT_PIPELINE]: 'Edit Pipeline',
    [Permission.CREATE_STAGE]: 'Create Stages',
    [Permission.EDIT_STAGE]: 'Edit Stages',
    [Permission.DELETE_STAGE]: 'Delete Stages',
    [Permission.EDIT_PROBABILITY]: 'Edit Probability',
    [Permission.BULK_UPDATE_PROBABILITY]: 'Bulk Update Probability',
    [Permission.VIEW_ANALYTICS]: 'View Analytics',
    [Permission.VIEW_FORECAST]: 'View Forecast',
    [Permission.EXPORT_DATA]: 'Export Data',
    [Permission.VIEW_REPORTS]: 'View Reports',
    [Permission.CREATE_REPORT]: 'Create Reports',
    [Permission.MANAGE_USERS]: 'Manage Users',
    [Permission.MANAGE_ROLES]: 'Manage Roles',
    [Permission.ASSIGN_ROLES]: 'Assign Roles',
    [Permission.VIEW_USERS]: 'View Users',
    [Permission.MANAGE_TEAM]: 'Manage Team',
    [Permission.VIEW_TEAM]: 'View Team',
    [Permission.ASSIGN_LEADS]: 'Assign Leads',
    [Permission.APPROVE_DEALS]: 'Approve Deals',
    [Permission.REQUEST_APPROVAL]: 'Request Approval',
    [Permission.VIEW_AUDIT_LOG]: 'View Audit Log',
    [Permission.EXPORT_AUDIT_LOG]: 'Export Audit Log',
    [Permission.MANAGE_SETTINGS]: 'Manage Settings',
    [Permission.MANAGE_INTEGRATIONS]: 'Manage Integrations'
  };

  if (!canManageRoles && !canManageUsers) {
    return (
      <div className="role-management-access-denied">
        <h3>Access Denied</h3>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="role-management-container">
      <div className="role-management-header">
        <h1>Role & User Management</h1>
        <div className="header-actions">
          {canManageRoles && (
            <button 
              className="btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              + Create New Role
            </button>
          )}
          {canAssignRoles && (
            <button 
              className="btn-secondary"
              onClick={() => setShowAssignModal(true)}
            >
              Assign Role to User
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="role-management-tabs">
        <button 
          className={`tab ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          Roles & Permissions
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users & Assignments
        </button>
        <button 
          className={`tab ${activeTab === 'permissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('permissions')}
        >
          Permission Matrix
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="roles-container">
          <div className="roles-grid">
            {filteredRoles.map(role => (
              <div key={role.id} className="role-card">
                <div className="role-card-header">
                  <div>
                    <h3>{role.displayName}</h3>
                    <span className="role-level">Level {role.level}</span>
                  </div>
                  <div className="role-actions">
                    {canManageRoles && (
                      <>
                        <button 
                          className="icon-btn"
                          onClick={() => {
                            setSelectedRole(role);
                            setShowEditModal(true);
                          }}
                        >
                          ✏️
                        </button>
                        <button 
                          className="icon-btn delete"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <p className="role-description">{role.description}</p>
                <div className="role-stats">
                  <span>📊 {role.permissions?.length || 0} permissions</span>
                  <span>👥 {role.userCount || 0} users</span>
                </div>
                {role.inherits && role.inherits.length > 0 && (
                  <div className="role-inherits">
                    <strong>Inherits from:</strong> {role.inherits.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="users-container">
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Department</th>
                  <th>Team</th>
                  <th>Status</th>
                  {canAssignRoles && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className="role-badge">
                        {user.roleDisplayName || user.role}
                      </span>
                    </td>
                    <td>{user.department}</td>
                    <td>{user.team}</td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    {canAssignRoles && (
                      <td>
                        <button 
                          className="assign-role-btn"
                          onClick={() => {
                            setSelectedUser(user);
                            setUserRoleAssignment(user.role);
                            setShowAssignModal(true);
                          }}
                        >
                          Change Role
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Permissions Matrix Tab */}
      {activeTab === 'permissions' && (
        <div className="permissions-matrix">
          <div className="matrix-header">
            <div className="permission-label">Permissions</div>
            {roles.map(role => (
              <div key={role.id} className="role-header">
                {role.displayName}
              </div>
            ))}
          </div>
          
          {Object.entries(permissionCategories).map(([category, permissions]) => (
            <div key={category} className="permission-category">
              <h3>{category}</h3>
              {permissions.map(permission => (
                <div key={permission} className="permission-row">
                  <div className="permission-name">
                    {permissionLabels[permission]}
                  </div>
                  {roles.map(role => (
                    <div key={role.id} className="permission-cell">
                      {role.permissions?.includes(permission) ? (
                        <span className="checkmark">✓</span>
                      ) : (
                        <span className="cross">✗</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Role</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateRole}>
              <div className="form-group">
                <label>Role Name *</label>
                <input
                  type="text"
                  placeholder="e.g., sales_manager"
                  value={newRole.name}
                  onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Display Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Sales Manager"
                  value={newRole.displayName}
                  onChange={(e) => setNewRole({...newRole, displayName: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={newRole.description}
                  onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Level (higher = more permissions)</label>
                <input
                  type="number"
                  value={newRole.level}
                  onChange={(e) => setNewRole({...newRole, level: parseInt(e.target.value)})}
                />
              </div>
              
              <div className="form-group">
                <label>Inherits from (comma-separated role names)</label>
                <input
                  type="text"
                  placeholder="sales_rep, account_manager"
                  value={newRole.inherits.join(', ')}
                  onChange={(e) => setNewRole({
                    ...newRole, 
                    inherits: e.target.value.split(',').map(r => r.trim()).filter(r => r)
                  })}
                />
              </div>
              
              <div className="form-group">
                <label>Permissions</label>
                <div className="permissions-selector">
                  {Object.entries(permissionCategories).map(([category, perms]) => (
                    <div key={category} className="permission-category-selector">
                      <h4>{category}</h4>
                      {perms.map(perm => (
                        <label key={perm} className="permission-checkbox">
                          <input
                            type="checkbox"
                            checked={newRole.permissions.includes(perm)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewRole({
                                  ...newRole,
                                  permissions: [...newRole.permissions, perm]
                                });
                              } else {
                                setNewRole({
                                  ...newRole,
                                  permissions: newRole.permissions.filter(p => p !== perm)
                                });
                              }
                            }}
                          />
                          {permissionLabels[perm]}
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Role'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditModal && selectedRole && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Role: {selectedRole.displayName}</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                ✕
              </button>
            </div>
            
            <form onSubmit={handleUpdateRole}>
              <div className="form-group">
                <label>Display Name *</label>
                <input
                  type="text"
                  value={selectedRole.displayName}
                  onChange={(e) => setSelectedRole({...selectedRole, displayName: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={selectedRole.description}
                  onChange={(e) => setSelectedRole({...selectedRole, description: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Level</label>
                <input
                  type="number"
                  value={selectedRole.level}
                  onChange={(e) => setSelectedRole({...selectedRole, level: parseInt(e.target.value)})}
                />
              </div>
              
              <div className="form-group">
                <label>Inherits from</label>
                <input
                  type="text"
                  placeholder="sales_rep, account_manager"
                  value={selectedRole.inherits?.join(', ') || ''}
                  onChange={(e) => setSelectedRole({
                    ...selectedRole, 
                    inherits: e.target.value.split(',').map(r => r.trim()).filter(r => r)
                  })}
                />
              </div>
              
              <div className="form-group">
                <label>Permissions</label>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="permissions">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="permissions-list"
                      >
                        {selectedRole.permissions.map((perm, index) => (
                          <Draggable key={perm} draggableId={perm} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="permission-item"
                              >
                                <span className="drag-handle">⋮⋮</span>
                                <span>{permissionLabels[perm] || perm}</span>
                                <button
                                  type="button"
                                  className="remove-permission"
                                  onClick={() => {
                                    setSelectedRole({
                                      ...selectedRole,
                                      permissions: selectedRole.permissions.filter(p => p !== perm)
                                    });
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                
                <div className="add-permissions">
                  <h4>Add Permissions</h4>
                  <div className="permissions-selector compact">
                    {Object.entries(permissionCategories).map(([category, perms]) => (
                      <div key={category} className="permission-category-selector">
                        <h5>{category}</h5>
                        {perms.map(perm => (
                          !selectedRole.permissions.includes(perm) && (
                            <button
                              key={perm}
                              type="button"
                              className="add-permission-btn"
                              onClick={() => {
                                setSelectedRole({
                                  ...selectedRole,
                                  permissions: [...selectedRole.permissions, perm]
                                });
                              }}
                            >
                              + {permissionLabels[perm]}
                            </button>
                          )
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Role Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Role to User</h2>
              <button className="close-btn" onClick={() => setShowAssignModal(false)}>
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              {selectedUser && (
                <div className="selected-user">
                  <strong>User:</strong> {selectedUser.name} ({selectedUser.email})
                </div>
              )}
              
              <div className="form-group">
                <label>Select Role</label>
                <select
                  value={userRoleAssignment}
                  onChange={(e) => setUserRoleAssignment(e.target.value)}
                >
                  <option value="">Choose a role...</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>
                      {role.displayName} - Level {role.level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="modal-actions">
              <button onClick={handleAssignRole} className="btn-primary" disabled={loading}>
                {loading ? 'Assigning...' : 'Assign Role'}
              </button>
              <button onClick={() => setShowAssignModal(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
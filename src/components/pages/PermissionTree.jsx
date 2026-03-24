// src/components/pages/PermissionTree.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckSquare, Square } from 'lucide-react';

export const PermissionTree = ({ 
  permissions = [], 
  allPermissions = [], 
  hierarchy = {},
  readOnly = false,
  onToggle 
}) => {
  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const formatPermissionName = (permission) => {
    return permission
      .split('.')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' - ');
  };

  const isPermissionChecked = (permission) => {
    return permissions.includes(permission);
  };

  const handleToggle = (permission, checked) => {
    if (!readOnly && onToggle) {
      onToggle(permission, checked);
    }
  };

  return (
    <div className="permission-tree">
      {Object.entries(hierarchy).map(([group, data]) => (
        <div key={group} className="permission-group">
          <div 
            className="permission-group-header"
            onClick={() => toggleGroup(group)}
          >
            {expandedGroups[group] ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            <span className="group-name">{data.name}</span>
            <span className="permission-count">
              {data.permissions.length} permissions
            </span>
          </div>
          
          {expandedGroups[group] && (
            <div className="permission-group-content">
              {data.permissions.map(permission => (
                <div key={permission} className="permission-item">
                  <label className="permission-label">
                    <input
                      type="checkbox"
                      checked={isPermissionChecked(permission)}
                      onChange={(e) => handleToggle(permission, e.target.checked)}
                      disabled={readOnly}
                    />
                    <span>{formatPermissionName(permission)}</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
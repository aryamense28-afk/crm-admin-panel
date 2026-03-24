// src/components/pages/RoleComparison.jsx
import React from 'react';
import { X, Check, X as XIcon } from 'lucide-react';

export const RoleComparison = ({ roles, onClose }) => {
  const allPermissions = new Set();
  roles.forEach(role => {
    role.permissions?.forEach(p => allPermissions.add(p));
  });

  const permissionList = Array.from(allPermissions);

  const formatPermissionName = (permission) => {
    return permission
      .split('.')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' - ');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Role Comparison</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Permission</th>
                  {roles.map(role => (
                    <th key={role.id}>{role.displayName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionList.map(permission => (
                  <tr key={permission}>
                    <td>{formatPermissionName(permission)}</td>
                    {roles.map(role => (
                      <td key={role.id} className="comparison-cell">
                        {role.permissions?.includes(permission) ? (
                          <Check size={18} className="check" />
                        ) : (
                          <XIcon size={18} className="x" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
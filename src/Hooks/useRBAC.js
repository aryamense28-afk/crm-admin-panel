// src/hooks/useRBAC.js
import { useState, useEffect, useCallback } from 'react';
import { mockRBACService } from '../services/mockRBACService';

export const useRBAC = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await mockRBACService.getRoles();
      if (response.success) {
        setRoles(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPermissions = useCallback(async () => {
    try {
      const response = await mockRBACService.getPermissions();
      if (response.success) {
        setPermissions(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch permissions:', err);
    }
  }, []);

  const createRole = async (roleData) => {
    setLoading(true);
    try {
      const response = await mockRBACService.createRole(roleData);
      if (response.success) {
        await fetchRoles();
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (roleId, roleData) => {
    setLoading(true);
    try {
      const response = await mockRBACService.updateRole(roleId, roleData);
      if (response.success) {
        await fetchRoles();
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (roleId) => {
    setLoading(true);
    try {
      const response = await mockRBACService.deleteRole(roleId);
      if (response.success) {
        await fetchRoles();
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId, roleId) => {
    try {
      const response = await mockRBACService.assignRole(userId, roleId);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getRoleUsers = async (roleId) => {
    try {
      const response = await mockRBACService.getRoleUsers(roleId);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getRoleActivity = async (roleId) => {
    try {
      const response = await mockRBACService.getRoleActivity(roleId);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  return {
    roles,
    permissions,
    loading,
    error,
    createRole,
    updateRole,
    deleteRole,
    assignRole,
    getRoleUsers,
    getRoleActivity,
    refreshRoles: fetchRoles
  };
};
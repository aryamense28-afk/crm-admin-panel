// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { mockAuthService } from '../services/mockAuthService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const response = await mockAuthService.getCurrentUser();
        if (response.success) {
          setUser(response.data.user);
          setPermissions(response.data.permissions || []);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await mockAuthService.login(email, password);
      if (response.success) {
        localStorage.setItem('auth_token', response.data.token);
        setUser(response.data.user);
        setPermissions(response.data.permissions || []);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setPermissions([]);
  };

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList) => {
    return permissionList.some(p => permissions.includes(p));
  };

  const hasAllPermissions = (permissionList) => {
    return permissionList.every(p => permissions.includes(p));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        permissions,
        login,
        logout,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
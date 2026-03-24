// AuthContext.jsx - Advanced Authentication Context with RBAC
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest");
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [sessionTimeout, setSessionTimeout] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Role-based permissions matrix
  const rolePermissions = {
    admin: {
      dashboard: ["view", "create", "edit", "delete", "export", "share"],
      users: ["view", "create", "edit", "delete", "assign", "suspend"],
      roles: ["view", "create", "edit", "delete", "assign"],
      reports: ["view", "create", "export", "schedule", "share"],
      settings: ["view", "edit", "configure"],
      sales: ["view", "create", "edit", "delete", "approve"],
      support: ["view", "create", "edit", "delete", "escalate"],
      billing: ["view", "create", "edit", "refund", "invoice"],
      analytics: ["view", "export", "configure"],
      api: ["view", "create", "delete", "configure"]
    },
    manager: {
      dashboard: ["view", "create", "edit", "export"],
      users: ["view", "create", "edit", "assign"],
      reports: ["view", "create", "export", "schedule"],
      sales: ["view", "create", "edit", "approve"],
      support: ["view", "create", "edit", "escalate"],
      analytics: ["view", "export"]
    },
    sales: {
      dashboard: ["view"],
      sales: ["view", "create", "edit"],
      customers: ["view", "create", "edit"],
      leads: ["view", "create", "edit", "convert"],
      opportunities: ["view", "create", "edit"],
      reports: ["view"]
    },
    support: {
      dashboard: ["view"],
      tickets: ["view", "create", "edit", "resolve", "escalate"],
      customers: ["view"],
      knowledge: ["view", "create", "edit"],
      reports: ["view"]
    },
    finance: {
      dashboard: ["view"],
      billing: ["view", "create", "edit", "invoice"],
      reports: ["view", "export"],
      analytics: ["view", "export"]
    },
    viewer: {
      dashboard: ["view"],
      reports: ["view"],
      analytics: ["view"]
    },
    guest: {
      dashboard: ["view"],
      public: ["view"]
    }
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("crmUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setRole(parsedUser.role || "guest");
      updatePermissions(parsedUser.role || "guest");
    }
    setLoading(false);

    // Start session monitoring
    startSessionMonitoring();

    // Cleanup on unmount
    return () => {
      if (sessionTimeout) clearTimeout(sessionTimeout);
    };
  }, []);

  // Update permissions based on role
  const updatePermissions = (newRole) => {
    setPermissions(rolePermissions[newRole] || rolePermissions.guest);
  };

  // Session monitoring
  const startSessionMonitoring = () => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const resetTimer = () => {
      setLastActivity(Date.now());
      if (sessionTimeout) clearTimeout(sessionTimeout);
      
      // Auto logout after 30 minutes of inactivity
      const timeout = setTimeout(() => {
        if (user) {
          addNotification("Session expired due to inactivity", "warning");
          logout();
        }
      }, 30 * 60 * 1000);
      
      setSessionTimeout(timeout);
    };

    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  };

  // Login function
  const login = async (email, password, selectedRole) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data
      const userData = {
        id: Date.now(),
        name: getUserNameFromRole(selectedRole),
        email,
        role: selectedRole,
        avatar: getAvatarFromRole(selectedRole),
        department: getDepartmentFromRole(selectedRole),
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: "light",
          notifications: true,
          language: "en"
        }
      };

      setUser(userData);
      setRole(selectedRole);
      updatePermissions(selectedRole);
      
      // Save to localStorage
      localStorage.setItem("crmUser", JSON.stringify(userData));
      localStorage.setItem("isAuthenticated", "true");

      addNotification(`Welcome back, ${userData.name}!`, "success");
      
      return { success: true, user: userData };
    } catch (err) {
      setError("Login failed. Please try again.");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setRole("guest");
    setPermissions(rolePermissions.guest);
    localStorage.removeItem("crmUser");
    localStorage.removeItem("isAuthenticated");
    addNotification("Logged out successfully", "info");
  };

  // Check if user has permission
  const hasPermission = (module, action) => {
    if (!permissions[module]) return false;
    return permissions[module].includes(action);
  };

  // Check if user has any of the specified roles
  const hasRole = (allowedRoles) => {
    if (typeof allowedRoles === 'string') {
      return role === allowedRoles;
    }
    return allowedRoles.includes(role);
  };

  // Get dashboard based on role
  const getDashboardForRole = () => {
    const dashboards = {
      admin: "Admin Dashboard",
      manager: "Manager Dashboard",
      sales: "Sales Dashboard",
      support: "Support Dashboard",
      finance: "Finance Dashboard",
      viewer: "Viewer Dashboard",
      guest: "Public Dashboard"
    };
    return dashboards[role] || "Dashboard";
  };

  // Add notification
  const addNotification = (message, type = "info") => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
  };

  // Mark notification as read
  const markNotificationAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Update user profile
  const updateProfile = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("crmUser", JSON.stringify(updated));
      return updated;
    });
    addNotification("Profile updated successfully", "success");
  };

  // Helper functions
  const getUserNameFromRole = (role) => {
    const names = {
      admin: "Admin User",
      manager: "Manager User",
      sales: "Sales Rep",
      support: "Support Agent",
      finance: "Finance Officer",
      viewer: "Viewer User"
    };
    return names[role] || "User";
  };

  const getAvatarFromRole = (role) => {
    const avatars = {
      admin: "👨‍💼",
      manager: "👔",
      sales: "💼",
      support: "🛠️",
      finance: "💰",
      viewer: "👤"
    };
    return avatars[role] || "👤";
  };

  const getDepartmentFromRole = (role) => {
    const departments = {
      admin: "Administration",
      manager: "Management",
      sales: "Sales Department",
      support: "Customer Support",
      finance: "Finance Department",
      viewer: "External"
    };
    return departments[role] || "General";
  };

  const value = {
    user,
    role,
    setRole,
    permissions,
    loading,
    error,
    notifications,
    login,
    logout,
    hasPermission,
    hasRole,
    getDashboardForRole,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    updateProfile,
    lastActivity
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
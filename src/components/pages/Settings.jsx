// src/components/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import "./Setting.css";

export default function Settings() {
  // Fetch initial user data from localStorage or API
  const [user, setUser] = useState({
    name: localStorage.getItem("username") || "John Doe",
    email: localStorage.getItem("email") || "john@example.com",
    role: localStorage.getItem("role") || "user",
  });

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Apply theme on component mount and when theme changes
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Check password strength
  useEffect(() => {
    if (form.newPassword) {
      checkPasswordStrength(form.newPassword);
    } else {
      setPasswordStrength("");
    }
  }, [form.newPassword]);

  const checkPasswordStrength = (password) => {
    // Check password strength
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;

    const strengthScore = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (length < 6) {
      setPasswordStrength("weak");
    } else if (length >= 6 && length < 8 && strengthScore < 2) {
      setPasswordStrength("weak");
    } else if (length >= 8 && strengthScore >= 2 && strengthScore < 4) {
      setPasswordStrength("medium");
    } else if (length >= 10 && strengthScore >= 3) {
      setPasswordStrength("strong");
    } else {
      setPasswordStrength("medium");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
    
    // Show success message
    showAlertMessage(`${e.target.name} notifications ${e.target.checked ? 'enabled' : 'disabled'}`, "success");
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    showAlertMessage(`${newTheme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode activated`, "success");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Save changes to localStorage or API
      setUser({ ...user, name: form.name, email: form.email });
      localStorage.setItem("username", form.name);
      localStorage.setItem("email", form.email);
      
      setIsLoading(false);
      showAlertMessage("Profile updated successfully! ✅", "success");
    }, 1500);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    // Check if current password is entered
    if (!form.currentPassword) {
      return showAlertMessage("Please enter current password", "error");
    }

    // Check if new password is entered
    if (!form.newPassword) {
      return showAlertMessage("Please enter new password", "error");
    }

    // Check password match
    if (form.newPassword !== form.confirmPassword) {
      return showAlertMessage("Passwords do not match ❌", "error");
    }

    // Check password strength
    if (passwordStrength === "weak") {
      return showAlertMessage("Password is too weak. Use at least 8 characters with mix of letters, numbers and special characters", "error");
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Send API request to update password
      setForm({ ...form, currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsLoading(false);
      showAlertMessage("Password changed successfully! ✅", "success");
    }, 1500);
  };

  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case "weak":
        return "Weak Password";
      case "medium":
        return "Medium Password";
      case "strong":
        return "Strong Password";
      default:
        return "";
    }
  };

  return (
    <div className="settings-container">
      <h2>
        <span className="section-icon icon-settings">⚙️</span>
        Settings
      </h2>

      {/* Alert Message */}
      {showAlert && (
        <div className={`alert ${alertType}`}>
          <span>{alertMessage}</span>
          <button className="alert-close" onClick={() => setShowAlert(false)}>×</button>
        </div>
      )}

      {/* Profile Section */}
      <div className="settings-section">
        <h3>
          <span className="section-icon icon-profile">👤</span>
          Profile Information
        </h3>
        <form onSubmit={handleProfileUpdate} className="profile-form">
          <div className="input-group">
            <span className="input-icon">📝</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              disabled={isLoading}
            />
          </div>
          <div className="input-group">
            <span className="input-icon">✉️</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              disabled={isLoading}
            />
          </div>
          <button type="submit" className={isLoading ? "loading" : ""} disabled={isLoading}>
            {isLoading ? <span className="loading-spinner"></span> : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Password Section */}
      <div className="settings-section">
        <h3>
          <span className="section-icon icon-password">🔒</span>
          Change Password
        </h3>
        <form onSubmit={handlePasswordChange} className="password-form">
          <div className="input-group">
            <span className="input-icon">🔐</span>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Current Password"
              required
              disabled={isLoading}
            />
          </div>
          <div className="input-group">
            <span className="input-icon">🔑</span>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              required
              disabled={isLoading}
            />
          </div>
          
          {/* Password Strength Meter */}
          {form.newPassword && (
            <div className="password-strength-container">
              <div className="password-strength">
                <div className={`password-strength-bar ${passwordStrength}`}></div>
              </div>
              <span className={`password-strength-text ${passwordStrength}`}>
                {getPasswordStrengthText()}
              </span>
            </div>
          )}

          <div className="input-group">
            <span className="input-icon">✓</span>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              disabled={isLoading}
            />
          </div>

          {/* Password requirements */}
          <div className="password-requirements">
            <p className="requirements-title">Password requirements:</p>
            <ul>
              <li className={form.newPassword?.length >= 8 ? "valid" : ""}>
                ✓ At least 8 characters
              </li>
              <li className={/[a-z]/.test(form.newPassword) && /[A-Z]/.test(form.newPassword) ? "valid" : ""}>
                ✓ Uppercase & lowercase letters
              </li>
              <li className={/\d/.test(form.newPassword) ? "valid" : ""}>
                ✓ At least one number
              </li>
              <li className={/[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword) ? "valid" : ""}>
                ✓ At least one special character
              </li>
            </ul>
          </div>

          <button type="submit" className={isLoading ? "loading" : ""} disabled={isLoading}>
            {isLoading ? <span className="loading-spinner"></span> : "Change Password"}
          </button>
        </form>
      </div>

      {/* Theme Section */}
      <div className="settings-section">
        <h3>
          <span className="section-icon icon-theme">🎨</span>
          Theme Preferences
        </h3>
        <div className="theme-options">
          <label className="theme-toggle">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={handleThemeToggle}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">
              {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </span>
          </label>

          {/* Theme preview */}
          <div className="theme-preview">
            <div className={`preview-card ${theme}`}>
              <div className="preview-header"></div>
              <div className="preview-body">
                <div className="preview-line"></div>
                <div className="preview-line short"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="settings-section">
        <h3>
          <span className="section-icon icon-notifications">🔔</span>
          Notification Settings
        </h3>
        <div className="notifications-container">
          <div className="notifications">
            <label className="notification-item">
              <span className="notification-icon">📧</span>
              <span className="notification-label">Email Notifications</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  name="email"
                  checked={notifications.email}
                  onChange={handleNotificationChange}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>

            <label className="notification-item">
              <span className="notification-icon">📱</span>
              <span className="notification-label">SMS Notifications</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  name="sms"
                  checked={notifications.sms}
                  onChange={handleNotificationChange}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>

            <label className="notification-item">
              <span className="notification-icon">🔔</span>
              <span className="notification-label">Push Notifications</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  name="push"
                  checked={notifications.push}
                  onChange={handleNotificationChange}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>

          {/* Notification schedule */}
          <div className="notification-schedule">
            <h4>Quiet Hours</h4>
            <div className="time-range">
              <input type="time" defaultValue="22:00" disabled={!notifications.push} />
              <span>to</span>
              <input type="time" defaultValue="08:00" disabled={!notifications.push} />
            </div>
          </div>
        </div>
      </div>

      {/* Account Summary Section */}
      <div className="settings-section account-summary">
        <h3>
          <span className="section-icon icon-account">📊</span>
          Account Summary
        </h3>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Account Type</span>
            <span className="stat-value">Premium</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Member Since</span>
            <span className="stat-value">Jan 2024</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Last Login</span>
            <span className="stat-value">Today, 10:30 AM</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Security Status</span>
            <span className="stat-value status-good">Good</span>
          </div>
        </div>
      </div>

      {/* Danger Zone Section */}
      <div className="settings-section danger-zone">
        <h3>
          <span className="section-icon icon-danger">⚠️</span>
          Danger Zone
        </h3>
        <div className="danger-actions">
          <button className="danger-btn" onClick={() => {
            if (window.confirm("Are you sure you want to deactivate your account? This action cannot be undone.")) {
              showAlertMessage("Account deactivation requested", "success");
            }
          }}>
            Deactivate Account
          </button>
          <button className="danger-btn delete" onClick={() => {
            if (window.confirm("Are you sure you want to delete your account? All data will be permanently removed.")) {
              showAlertMessage("Account deletion requested", "success");
            }
          }}>
            Delete Account
          </button>
        </div>
      </div>

      {/* Settings Footer */}
      <div className="settings-footer">
        <p>Changes are automatically saved to your account</p>
        <p className="last-synced">Last synced: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
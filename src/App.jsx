import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

/* Layout */
import Navbar from "./components/Navbar";

/* Pages */
import Login from "./components/pages/Login";
import LandingPage from "./components/pages/LandingPage"; // Add this import

import Dashboard from "./components/pages/Dashboard";
import Leads from "./components/pages/Leads";
import Profile from "./components/pages/Profile";
import Contacts from "./components/pages/Contacts";
import Settings from "./components/pages/Settings";
import Reports from "./components/pages/Reports";
import Tickets from "./components/pages/Tickets";
import Tasks from "./components/pages/Tasks";
import Deals from "./components/pages/Deals";
import Documents from "./components/pages/Documents";
import Chatbot from "./components/pages/Chatbot";
import SalesPrediction from "./components/pages/SalesPrediction";
import Email from "./components/pages/Email";
import Calendar from "./components/pages/Calendar";

/* Advanced Modules */
import SalesPipeline from "./components/pages/SalesPipeline";
import Notifications from "./components/pages/Notifications";
import Roles from "./components/pages/Roles";
import Automation from "./components/pages/Automation";
import MobileCRM from "./components/pages/MobileCRM";

/* Orders */
import AdvancedOrder from "./components/pages/AdvancedOrder";
import SalesManagement from "./components/pages/SalesManagement";
import Billing from "./components/pages/Billing";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = localStorage.getItem('crmUser');
  const userType = localStorage.getItem('userType');
  
  if (!user || !userType) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Check authentication status
    const userData = localStorage.getItem('crmUser');
    const type = localStorage.getItem('userType');
    
    if (userData && type) {
      setUser(JSON.parse(userData));
      setUserType(type);
    }
  }, [location]);

  // Hide Navbar on Landing page and Login page
  const hideNavbar = location.pathname === "/login" || location.pathname === "/";

  return (
    <div className="app-container">
      {!hideNavbar && <Navbar user={user} userType={userType} />}

      <div className={`main-content ${hideNavbar ? 'no-padding' : ''}`}>
        <Routes>
          {/* Landing Page - Public */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Public Pages */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard - Role based */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={["admin", "customer"]}>
              <Dashboard user={user} userType={userType} />
            </ProtectedRoute>
          } />

          {/* CRM Core - Accessible by both */}
          <Route path="/leads" element={
            <ProtectedRoute allowedRoles={["admin", "customer"]}>
              <Leads user={user} userType={userType} />
            </ProtectedRoute>
          } />
          <Route path="/contacts" element={
            <ProtectedRoute allowedRoles={["admin", "customer"]}>
              <Contacts user={user} userType={userType} />
            </ProtectedRoute>
          } />
          <Route path="/deals" element={
            <ProtectedRoute allowedRoles={["admin", "customer"]}>
              <Deals user={user} userType={userType} />
            </ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute allowedRoles={["admin", "customer"]}>
              <Tasks user={user} userType={userType} />
            </ProtectedRoute>
          } />
          <Route path="/tickets" element={
            <ProtectedRoute allowedRoles={["admin", "customer"]}>
              <Tickets user={user} userType={userType} />
            </ProtectedRoute>
          } />

          {/* Communication - Accessible by both */}
          <Route path="/email" element={
            <ProtectedRoute allowedRoles={["admin", "customer"]}>
              <Email user={user} userType={userType} />
            </ProtectedRoute>
          } />
          <Route path="/chatbot" element={
            <ProtectedRoute allowedRoles={["admin", "customer"]}>
              <Chatbot user={user} userType={userType} />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute allowedRoles={["admin", "customer"]}>
              <Notifications user={user} userType={userType} />
            </ProtectedRoute>
          } />

          {/* Productivity - Accessible by both */}
          <Route path="/calendar" element={
            <ProtectedRoute allowedRoles={["admin", "customer"]}>
              <Calendar user={user} userType={userType} />
            </ProtectedRoute>
          } />
          <Route path="/documents" element={
            <ProtectedRoute allowedRoles={["admin", "customer"]}>
              <Documents user={user} userType={userType} />
            </ProtectedRoute>
          } />

          {/* Analytics - Admin only */}
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Reports user={user} userType={userType} />
            </ProtectedRoute>
          } />
          <Route path="/sales-prediction" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SalesPrediction user={user} userType={userType} />
            </ProtectedRoute>
          } />

          {/* Management - Admin only */}
          <Route path="/roles" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Roles user={user} userType={userType} />
            </ProtectedRoute>
          } />
          <Route path="/automation" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Automation user={user} userType={userType} />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Settings user={user} userType={userType} />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={["admin", "customer"]}>
              <Profile user={user} userType={userType} />
            </ProtectedRoute>
          } />

          {/* Sales - Admin only */}
          <Route path="/sales-pipeline" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SalesPipeline user={user} userType={userType} />
            </ProtectedRoute>
          } />
          <Route path="/sales-management" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SalesManagement user={user} userType={userType} />
            </ProtectedRoute>
          } />

          {/* Orders - Admin only */}
          <Route path="/orders" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdvancedOrder user={user} userType={userType} />
            </ProtectedRoute>
          } />
          <Route path="/billing" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Billing user={user} userType={userType} />
            </ProtectedRoute>
          } />
          
          {/* Mobile CRM - Admin only */}
          <Route path="/mobile-crm" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MobileCRM user={user} userType={userType} />
            </ProtectedRoute>
          } />
          
          {/* Fallback route - redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
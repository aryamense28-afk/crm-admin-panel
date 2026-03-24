import React from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./modules/Dashboard/Dashboard";

const Layout = () => {
  return (
    <div>
      <Sidebar />
      <div className="main-content">
        <Dashboard />
      </div>
    </div>
  );
};

export default Layout;
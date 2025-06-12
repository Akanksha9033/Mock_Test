import React from "react";

import SuperAdminSidebar from "./SuperAdminSidebar";

const SuperAdminDashboard = () => {
  return (
    <div className="d-flex">
      <SuperAdminSidebar />
      <div className="flex-grow-1 p-4">
        <h2>Welcome, SuperAdmin 👑</h2>
        <p>This is your main dashboard. From here, you can manage admins and monitor your platform.</p>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

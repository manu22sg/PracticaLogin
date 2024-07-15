import React from "react";
import Sidebar from "./SideBar"; // Asegúrate de importar el Sidebar
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

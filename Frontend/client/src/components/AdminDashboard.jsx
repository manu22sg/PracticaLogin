import React from "react";
import Sidebar from "./SideBar"; // Asegúrate de importar el Sidebar
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-white text-black">
      <div className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-6">CITEC</h2>
        <div className="bg-gray-200 p-4 rounded-lg shadow-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React from "react";
import Sidebar from "./SideBar"; // Asegúrate de importar el Sidebar
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-6">Pagina Principal</h2>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

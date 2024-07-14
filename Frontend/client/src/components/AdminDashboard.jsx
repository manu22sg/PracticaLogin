import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <nav>
        <ul>
          <li>
            <Link to="/users">Usuarios</Link>
          </li>
          <li>
            <Link to="/companies">Empresas</Link>
          </li>
        </ul>
      </nav>
      <header>
        <Link to="/account">Mi cuenta</Link>
      </header>
    </div>
  );
};

export default AdminDashboard;

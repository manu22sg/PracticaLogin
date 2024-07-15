import React, { useState } from "react";
import { Link } from "react-router-dom";
import getUserFromToken from "../utils/authUtils"; // Importa la función de decodificación

const Sidebar = () => {
  const [showUserOptions, setShowUserOptions] = useState(false);
  const user = getUserFromToken();

  const toggleUserOptions = () => {
    setShowUserOptions(!showUserOptions);
  };

  if (!user || user.role !== "Administrador Interno") {
    return null; // No mostrar la barra lateral si el usuario no está autenticado o no tiene el rol adecuado
  }

  return (
    <div className="sidebar">
      <h3>Menú</h3>
      <ul>
        <li>
          <button onClick={toggleUserOptions} className="sidebar-button">
            Usuarios
          </button>
          {showUserOptions && (
            <ul className="submenu">
              <li>
                <Link to="/create-user">Crear Usuario</Link>
              </li>
              <li>
                <Link to="/edit-user">Editar Usuario</Link>
              </li>
              <li>
                <Link to="/view-users">Ver Usuarios</Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link to="/dashboard/companies">Empresas</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

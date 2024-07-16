import React, { useState } from "react";
import { Link } from "react-router-dom";
import getUserFromToken from "../utils/authUtils"; // Importa la función de decodificación

const Sidebar = () => {
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [showCompanyOptions, setShowCompanyOptions] = useState(false);
  const user = getUserFromToken();

  const toggleUserOptions = () => {
    setShowUserOptions(!showUserOptions);
  };

  const toggleCompanyOptions = () => {
    setShowCompanyOptions(!showCompanyOptions);
  };

  if (!user || user.role !== "Administrador Interno") {
    return null; // No mostrar la barra lateral si el usuario no está autenticado o no tiene el rol adecuado
  }

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h3 className="text-xl font-bold mb-4">Menú</h3>
      <ul>
        <li className="mb-2">
          <button
            onClick={toggleUserOptions}
            className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Usuarios
          </button>
          {showUserOptions && (
            <ul className="ml-4 mt-2">
              <li className="mb-2">
                <Link
                  to="/create-user"
                  className="block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Crear Usuario
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/edit-user"
                  className="block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Editar Usuario
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/view-users"
                  className="block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Ver Usuarios
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="mb-2">
          <button
            onClick={toggleCompanyOptions}
            className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Compañías
          </button>
          {showCompanyOptions && (
            <ul className="ml-4 mt-2">
              <li className="mb-2">
                <Link
                  to="/create-company"
                  className="block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Crear Compañía
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/edit-company"
                  className="block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Editar Compañía
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/view-companies"
                  className="block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Ver Compañías
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/Contexto"; // Importa el hook del contexto
import { FaChevronDown, FaChevronUp, FaUser, FaBuilding } from "react-icons/fa"; // Importa los íconos

const Sidebar = () => {
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [showCompanyOptions, setShowCompanyOptions] = useState(false);
  const { user } = useAuth(); // Usa el hook para obtener el usuario

  const toggleUserOptions = () => {
    setShowUserOptions(!showUserOptions);
  };

  const toggleCompanyOptions = () => {
    setShowCompanyOptions(!showCompanyOptions);
  };

  if (!user) {
    return null; // No renderiza el Sidebar si no hay usuario
  }

  const sidebarClass =
    user.role === "Personal Contable" ? "contable-sidebar" : "admin-sidebar";

  const buttonClass =
    user.role === "Personal Contable" ? "contable-button" : "admin-button";

  return (
    <div className={`sidebar ${sidebarClass} text-white w-90 h-screen fixed top-16 left-0 overflow-y-auto p-4 shadow-lg flex flex-col`}>
      <div className="flex-grow">
        <ul>
          {user.role === "Administrador Interno" && (
            <li className="mb-2">
              <button
                onClick={toggleUserOptions}
                className={`w-full text-left px-4 py-3 ${buttonClass} rounded flex items-center justify-between`}
              >
                <div className="flex items-center space-x-2">
                  <FaUser className="text-white" />
                  <span>Usuarios</span>
                </div>
                <span>
                  {showUserOptions ? (
                    <FaChevronUp className="text-white" />
                  ) : (
                    <FaChevronDown className="text-white" />
                  )}
                </span>
              </button>
              {showUserOptions && (
                <ul className="ml-4 mt-2">
                  <li className="mb-2">
                    <Link
                      to="/create-user"
                      className={`block px-4 py-2 ${buttonClass} rounded transition-colors text-white`}
                    >
                      Crear Usuario
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/view-users"
                      className={`block px-4 py-2 ${buttonClass} rounded transition-colors text-white`}
                    >
                      Gestión de Usuarios
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}
          {(user.role === "Administrador Interno" || user.role === "Personal Contable") && (
            <li className="mb-2">
              <button
                onClick={toggleCompanyOptions}
                className={`w-full text-left px-4 py-3 ${buttonClass} rounded flex items-center justify-between`}
              >
                <div className="flex items-center space-x-2">
                  <FaBuilding className="text-white" />
                  <span>Empresas</span>
                </div>
                <span>
                  {showCompanyOptions ? (
                    <FaChevronUp className="text-white" />
                  ) : (
                    <FaChevronDown className="text-white" />
                  )}
                </span>
              </button>
              {showCompanyOptions && (
                <ul className="ml-4 mt-2">
                  {user.role === "Administrador Interno" && (
                    <li className="mb-2">
                      <Link
                        to="/create-company"
                        className={`block px-4 py-2 ${buttonClass} rounded transition-colors text-white`}
                      >
                        Crear Empresa
                      </Link>
                    </li>
                  )}
                  <li className="mb-2">
                    <Link
                      to="/view-companies"
                      className={`block px-4 py-2 ${buttonClass} rounded transition-colors text-white`}
                    >
                      Gestión de Empresas
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

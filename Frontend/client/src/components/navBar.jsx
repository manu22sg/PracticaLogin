import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/Contexto"; // Importa el contexto
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";


const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    //console.log("User in Navbar:", user); // Verifica si el usuario está siendo recibido}
  }, [user]);

  const handleLogout = () => {
    if (isSidebarVisible) {
      setIsSidebarVisible(false); // Asegúrate de que la barra lateral esté oculta
      toggleSidebar();
    }
    logout();
    
    navigate("/login");
  };

  const handleToggleSidebar = () => {
    setIsSidebarVisible((prevState) => !prevState); // Alterna la visibilidad de la barra lateral
    toggleSidebar();
  };

  return (
    <nav className="navbar bg-white text-black flex justify-between items-center px-6 py-3 shadow-md fixed top-0 left-0 w-full z-10">
      <div className="flex items-center space-x-4">
        <button onClick={handleToggleSidebar} className="p-1">
          {isSidebarVisible ? (
            <FaAnglesLeft className="text-black w-7 h-7" />
          ) : (
            <FaAnglesRight className="text-black w-7 h-7" />
          )}
        </button>
        <Link to="/dashboard" className="text-2xl font-bold">
          Citec UBB
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link to="/account" className="hover:text-gray-700">
              {user.name} {user.apellido_paterno} {user.apellido_materno}
              <br />({user.role})
            </Link>
            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded flex items-center space-x-2"
              >
               <FaSignOutAlt className="w-5 h-5"/>
               <span>Cerrar sesión</span>
              </button>
          </>
        ) : (
          location.pathname !== "/login" && (
            <Link to="/login" className="hover:text-gray-700">
              Login
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;

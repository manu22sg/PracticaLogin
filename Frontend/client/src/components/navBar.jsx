import React, { useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/Contexto"; // Importa el contexto
import IconSidebar from "../assets/images/Sidebar.png"; // Ruta correcta

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    console.log("User in Navbar:", user); // Verifica si el usuario está siendo recibido
  }, [user]);

  const handleLogout = () => {
    toggleSidebar();
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar bg-white text-black flex justify-between items-center px-6 py-3 shadow-md fixed top-0 left-0 w-full z-10">
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="p-1">
          <img src={IconSidebar} alt="Sidebar Icon" className="w-9 h-9" />
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
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
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

import React, { useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/Contexto"; // Importa el contexto

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    console.log("User in Navbar:", user); // Verifica si el usuario está siendo recibido
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white flex justify-between items-center px-6 py-3 shadow-md">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-2xl font-bold">
          Citec UBB
        </Link>
        {user && <></>}
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link to="/account" className="hover:text-gray-300">
              Mi Cuenta
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
            <Link to="/login" className="hover:text-gray-300">
              Login
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;

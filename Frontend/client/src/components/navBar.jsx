import React, { useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/Contexto"; // Importa el contexto

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Obtén la ubicación actual
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    console.log("User in Navbar:", user); // Verifica si el usuario está siendo recibido
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-menu">
        {user ? (
          <>
            <span className="navbar-item">Hola, {user.name}</span>
            <span className="navbar-item">Rol: {user.role}</span>
            <Link to="/account" className="navbar-item">
              Mi Cuenta
            </Link>
            <button onClick={handleLogout} className="navbar-item">
              Logout
            </button>
          </>
        ) : (
          location.pathname !== "/login" && (
            <Link to="/login" className="navbar-item">
              Login
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/Contexto"; // Importa el contexto

const PrivateRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);

  if (!user || !user.role) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;

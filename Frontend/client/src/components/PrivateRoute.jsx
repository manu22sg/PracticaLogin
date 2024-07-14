// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  const user = jwt_decode(token);

  if (!roles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;

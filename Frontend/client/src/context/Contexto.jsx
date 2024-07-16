import React, { createContext, useState, useEffect } from "react";
import getUserFromToken from "../utils/authUtils";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Añadir estado de carga

  useEffect(() => {
    const user = getUserFromToken();
    setUser(user);
    setLoading(false); // Cambiar el estado de carga a false después de obtener el usuario
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const user = getUserFromToken();
    console.log(user);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

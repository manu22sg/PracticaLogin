import React, { createContext, useState, useEffect } from "react";
import getUserFromToken from "../utils/authUtils";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = getUserFromToken();
    setUser(user);
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
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

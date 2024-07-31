import React, { createContext, useState, useEffect } from "react";
import getUserFromToken from "../utils/authUtils";


export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const user = getUserFromToken();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

  const login = (token) => {
    localStorage.setItem("accessToken", token);
    const user = getUserFromToken();
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

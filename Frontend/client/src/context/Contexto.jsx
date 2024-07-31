import React, { createContext, useState, useEffect } from "react";
import getUserFromToken from "../utils/authUtils";
import Cookies from "cookie-universal";

export const AuthContext = createContext();
const cookies = Cookies();

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

  const login = (token, refreshToken) => {
    localStorage.setItem("accessToken", token);
    cookies.set("refreshToken", refreshToken, { httpOnly: true });
    const user = getUserFromToken();
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    cookies.remove("refreshToken");
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

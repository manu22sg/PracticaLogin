import React, { createContext, useState, useEffect, useContext } from "react";
import {jwtDecode} from "jwt-decode"; // Asegúrate de tener instalada la dependencia jwt-decode
import api from "../services/api"; // Importa la instancia de axios
// Crear el contexto
export const AuthContext = createContext();

// Función para obtener el usuario desde el token
export const getUserFromToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) return null;

    return {
      id: decoded.id,
      name: decoded.name,
      apellido_paterno: decoded.apellido_paterno,
      apellido_materno: decoded.apellido_materno,
      celular: decoded.celular,
      fecha_nacimiento: decoded.fecha_nacimiento,
      email_opcional: decoded.email_opcional,
      email: decoded.email,
      role: decoded.role,
      rut: decoded.rut,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getUserFromToken());
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    setLoading(false); // El estado de carga se establece después de la inicialización
  }, []);

  const login = (token) => {
    localStorage.setItem("accessToken", token);
    setUser(getUserFromToken());
  };

  const logout =async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};

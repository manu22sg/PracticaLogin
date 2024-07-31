import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/envConfig.js";

// Función para generar el token
export const generateToken = (user) => {
  const payload = {
    rut: user.rut,
    name: user.name,
    apellido_paterno: user.apellido_paterno,
    apellido_materno: user.apellido_materno,
    celular: user.celular,
    fecha_nacimiento: user.fecha_nacimiento,
    email: user.email,
    email_opcional: user.email_opcional,
    role: user.role,
  };

  const options = { expiresIn: "1h" };

  return jwt.sign(payload, SECRET_KEY, options);
};

// Middleware para autenticar el token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.replace("Bearer ", "");

  // Primero verificamos si el token existe
  if (token) {
    try {
      const verified = jwt.verify(token, SECRET_KEY);
      req.user = verified;
      return next();
    } catch (err) {
      // Token expira
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  }

  return res.status(401).json({ message: "Acceso denegado" });
};

// Middleware para verificar el rol del usuario
export const checkRole =
  (...roles) => // Recibimos los roles que pueden acceder a la ruta
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "No tiene los permisos suficientes" });
    }
    next();
  };

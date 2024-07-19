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
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado" });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Token inválido" });
  }
};

// Middleware para verificar el rol del usuario
export const checkRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res
      .status(403)
      .json({ message: "No tiene los permisos suficientes" });
  }
  next();
};

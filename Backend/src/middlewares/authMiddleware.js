import jwt from "jsonwebtoken";
import { SECRET_KEY, REFRESH_SECRET } from "../config/envConfig.js";
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

  // Check access token first
  if (token) {
    try {
      const verified = jwt.verify(token, SECRET_KEY);
      req.user = verified;
      return next();
    } catch (err) {
      // Token expira
      if (err.name === "JsonWebTokenError") {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return res.status(401).json({ message: "No hay refresh token" });
        }

        try {
          const refreshPayload = jwt.verify(refreshToken, REFRESH_SECRET);
          const user = { id: refreshPayload.userId }; //
          const newAccessToken = generateToken(user);
          res.cookie("refreshToken", generateRefreshToken(user), {
            httpOnly: true,
          }); // Update refresh token
          req.user = jwt.verify(newAccessToken, SECRET_KEY); //
          req.headers["authorization"] = `Bearer ${newAccessToken}`;
          return next();
        } catch (err) {
          return res.status(401).json({ message: "Refresh Token invalido" });
        }
      }
    }
  }

  return res.status(401).json({ message: "Acceso denegado" });
};

export const generateRefreshToken = (user) => {
  const payload = { userId: user.id }; // Use a unique identifier for the user
  const options = { expiresIn: "7d" }; // Set expiry to 7 days
  return jwt.sign(payload, REFRESH_SECRET, options);
};
export const verifyRefreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    return decoded;
  } catch (error) {
    return console.error("Error decoding token:", error);
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

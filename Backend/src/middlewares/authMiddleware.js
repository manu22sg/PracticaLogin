import jwt from "jsonwebtoken";

// Función para generar el token
export const generateToken = (user) => {
  const payload = {
    rut: user.rut,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const secretKey = "mi_clave_secreta_para_jwt";
  const options = { expiresIn: "1h" };

  return jwt.sign(payload, secretKey, options);
};

// Middleware para autenticar el token
export const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado" });
  }

  try {
    const secretKey = "mi_clave_secreta_para_jwt";
    const verified = jwt.verify(token, secretKey);
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

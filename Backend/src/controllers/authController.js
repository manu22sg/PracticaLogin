import jwt from "jsonwebtoken";
import { pool } from "../utils/db.js";
import { SECRET_KEY } from "../config/envConfig.js";
import { generateToken } from "../middlewares/authMiddleware.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son requeridos" });
  }

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (rows.length === 0 || rows[0].password !== password) {
    return res.status(401).json({ message: "Email o contraseña incorrectos" });
  }

  const user = rows[0];

  const token = jwt.sign(
    {
      rut: user.rut,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ token });
};

export const register = async (req, res) => {
  const { rut, name, email, password, role } = req.body;
  if (!rut || !name || !email || !password || !role) {
    return res.status(400).json({ message: "Faltan campos por llenar" });
  }

  await pool.query(
    "INSERT INTO users (rut, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
    [rut, name, email, password, role]
  );

  res.status(201).json({ message: "Usuario registrado exitosamente" });
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error al cerrar sesión" });
    }
    res.clearCookie("sessionID");
    res.json({ message: "Sesión cerrada exitosamente" });
  });
};

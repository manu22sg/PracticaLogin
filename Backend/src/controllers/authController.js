import { pool } from "../utils/db.js";

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

  const token = generateToken(user);

  res.json({ token });
};

export const register = async (req, res) => {
  const { rut, name, email, password, role } = req.body;

  try {
    if (!rut || !name || !email || !password || !role) {
      return res.status(400).json({ message: "Faltan campos por llenar" });
    }
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR rut = ?",
      [email, rut]
    );

    if (existingUser.length > 0) {
      if (existingUser[0].email === email) {
        return res
          .status(409)
          .json({ message: "El correo electrónico ya está registrado" });
      } else if (existingUser[0].rut === rut) {
        return res.status(410).json({ message: "El rut ya está registrado" });
      }
    }
    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(400).json({ message: "Error al registrar usuario" });
  }
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

import jwt from "jsonwebtoken";
import { pool } from "../utils/db.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (rows.length === 0 || rows[0].password !== password) {
    return res.status(401).json({ message: "Email o contraseña incorrectos" });
  }
  const secretKey = "mi_clave_secreta_para_jwt";

  const token = jwt.sign({ rut: rows[0].rut, role: rows[0].role }, secretKey, {
    expiresIn: "1h",
  });
  res.json({ token });
};

export const register = async (req, res) => {
  const { rut, name, email, password, role } = req.body;
  await pool.query(
    "INSERT INTO users (rut, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
    [rut, name, email, password, role]
  );
  res.status(201).json({ message: "Usuario registrado exitosamente" });
};

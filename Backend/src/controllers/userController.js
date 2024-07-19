import { pool } from "../utils/db.js";

export const listUsers = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users");
  res.json(rows);
};
export const listUser = async (req, res) => {
  const { rut } = req.params;
  const [rows] = await pool.query("SELECT * FROM users WHERE rut = ?", [rut]);
  if (rows.length === 0) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  } else {
    res.json(rows[0]);
  }
};

export const updateUser = async (req, res) => {
  const { rut } = req.params;
  const {
    name,
    apellido_paterno,
    apellido_materno,
    celular,
    email,
    email_opcional,
    role,
  } = req.body;
  try {
    // Actualizar el usuario especificado por el RUT
    const [result] = await pool.query(
      "UPDATE users SET name = IFNULL(?,name), apellido_paterno = IFNULL(?,apellido_paterno), apellido_materno = IFNULL(?,apellido_materno), celular = IFNULL(?,celular), email = IFNULL(?,email), email_opcional = IFNULL(?, email_opcional), role = IFNULL(?,role) WHERE rut = ?",
      [
        name,
        apellido_paterno,
        apellido_materno,
        celular,
        email,
        email_opcional,
        role,
        rut,
      ]
    );

    if (result.affectedRows <= 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Obtener el usuario actualizado
    const [rows] = await pool.query("SELECT * FROM users WHERE rut = ?", [rut]);
    res.json(rows[0]);
  } catch (error) {
    return res.status(400).json({ message: "Error al actualizar usuario" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { rut } = req.params;
    await pool.query("DELETE FROM users WHERE rut = ?", [rut]);
    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar usuario" });
  }
};

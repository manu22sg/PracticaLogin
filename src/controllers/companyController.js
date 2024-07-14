import { pool } from "../utils/db.js";

export const createCompany = async (req, res) => {
  try {
    const { email, name, address, phone, password } = req.body;
    if (!email || !name || !address || !phone || !password) {
      return res.status(400).json({ message: "Faltan campos por llenar" });
    }
    await pool.query(
      "INSERT INTO companies (email, name, address, phone, password) VALUES (?, ?, ?, ?, ?)",
      [email, name, address, phone, password]
    );
    res.json({ message: "Empresa creada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear empresa", error: error.message });
  }
};

export const listCompanies = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM companies");
    if (rows.length <= 0) {
      return res.status(404).json({ message: "No hay empresas registradas" });
    }
    res.json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las empresas", error: error.message });
  }
};

export const listCompany = async (req, res) => {
  try {
    const { email } = req.params;
    const [rows] = await pool.query("SELECT * FROM companies WHERE email = ?", [
      email,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }
    res.json(rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la empresa", error: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { email } = req.params;
    const [result] = await pool.query("DELETE FROM companies WHERE email = ?", [
      email,
    ]);
    if (result.affectedRows <= 0) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }
    res.json({ message: "Empresa eliminada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar empresa", error: error.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { email } = req.params;
    const { name, address, phone, password } = req.body;
    const [result] = await pool.query(
      "UPDATE companies SET name = IFNULL(?, name), address = IFNULL(?, address), phone = IFNULL(?, phone), password = IFNULL(?, password) WHERE email = ?",
      [name, address, phone, password, email]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }
    const [rows] = await pool.query("SELECT * FROM companies WHERE email = ?", [
      email,
    ]);
    res.json(rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar empresa", error: error.message });
  }
};

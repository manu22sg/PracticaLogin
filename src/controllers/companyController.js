import { pool } from "../utils/db.js";

export const listCompanies = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM companies");

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las empresas" });
  }
};

export const listCompanie = async (req, res) => {
  try {
    const { email } = req.params;
    const [rows] = await pool.query("SELECT * FROM companies WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la empresa" });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { email } = req.params;
    await pool.query("DELETE FROM companies WHERE email = ?", [email]);
    res.json({ message: "Empresa eliminada exitosamente" });
  } catch (error) {
    res.json({ message: "Error al eliminar empresa" });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { email } = req.params;
    const { name, address, phone } = req.body;
    await pool.query(
      "UPDATE companies SET name =IFNULL( ?,name), address = IFNULL(?,address), phone = IFNULL(?,phone) WHERE email = ? ",
      [name, address, phone, email]
    );
    res.json({ message: "Empresa actualizada exitosamente" });
  } catch (error) {
    res.json({ message: "Error al actualizar empresa" });
  }
};

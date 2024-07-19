import { pool } from "../utils/db.js";

export const createCompany = async (req, res) => {
  try {
    const { rut, email, mandante, giro, direccion, comuna, ciudad, telefono } =
      req.body;
    if (
      !rut ||
      !email ||
      !mandante ||
      !giro ||
      !direccion ||
      !comuna ||
      !ciudad ||
      !telefono
    ) {
      return res.status(400).json({ message: "Faltan campos por llenar" });
    }
    await pool.query(
      "INSERT INTO companies (rut,email, mandante, giro, direccion, comuna, ciudad, telefono) VALUES (?,?, ?, ?, ?, ?, ?, ?)",
      [rut, email, mandante, giro, direccion, comuna, ciudad, telefono]
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
    const { rut } = req.params;
    const [rows] = await pool.query("SELECT * FROM companies WHERE rut = ?", [
      rut,
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
    const { rut } = req.params;
    const [result] = await pool.query("DELETE FROM companies WHERE rut = ?", [
      rut,
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
    const { rut } = req.params;
    const { email, mandante, giro, direccion, comuna, ciudad, telefono } =
      req.body;
    const [result] = await pool.query(
      "UPDATE companies SET email = IFNULL(?, email), mandante = IFNULL(?, mandante), giro = IFNULL(?, giro), direccion = IFNULL(?, direccion), comuna = IFNULL(?, comuna), ciudad = IFNULL(?, ciudad), telefono = IFNULL(?, telefono) WHERE rut = ?",
      [email, mandante, giro, direccion, comuna, ciudad, telefono, rut]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }
    const [rows] = await pool.query("SELECT * FROM companies WHERE rut = ?", [
      rut,
    ]);
    res.json(rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar empresa", error: error.message });
  }
};

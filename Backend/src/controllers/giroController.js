import { pool } from "../utils/db.js";
export const listGiros = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM giros");
    if (rows.length <= 0) {
      return res.status(404).json({ message: "No hay giros registrados" });
    }
    res.json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los giros", error: error.message });
  }
};

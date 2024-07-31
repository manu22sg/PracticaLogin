import { pool } from "../utils/db.js"; // Importamos la conexión a la base de datos
export const listGiros = async (req, res) => { // Exportamos una función asíncrona 
  try {
    const [rows] = await pool.query("SELECT * FROM giros"); // Realizamos una consulta a la base de datos para seleccionar todos los giros
    if (rows.length <= 0) {
      return res.status(404).json({ message: "No hay giros registrados" });
    }
    res.json(rows); // Respondemos con los giros obtenidos
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los giros", error: error.message });
  }
};

import  { pool } from "../utils/db.js";

export const regiones = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM region_cl');
        res.json(rows);
      } catch (error) {
        console.error('Error al obtener regiones:', error);
        res.status(500).json({ message: 'Error al obtener regiones', error: error.message });
      }   
}

export const provincias = async (req, res) => {
    const { regionId } = req.query;
  try {
    const [rows] = await pool.query('SELECT * FROM provincia_cl WHERE id_re = ?', [regionId]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener provincias:', error);
    res.status(500).json({ message: 'Error al obtener provincias', error: error.message });
  }
}
export const comunas = async (req, res) => {
    const { provinciaId } = req.query;
  try {
    const [rows] = await pool.query('SELECT * FROM comuna_cl WHERE id_pr = ?', [provinciaId]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener comunas:', error);
    res.status(500).json({ message: 'Error al obtener comunas', error: error.message });
  }
}
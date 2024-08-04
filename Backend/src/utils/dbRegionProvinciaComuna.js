import { pool } from "./db.js"; // Importar el pool de conexiones
const query = async (sql, params = []) => {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(sql, params);
      return rows;
    } catch (error) {
      console.error('Error en consulta SQL:', error);
      throw error;
    } finally {
      connection.release();
    }
  };
  

const getIdByDescription = async (tableName, description) => {
    const columnIdMap = {
      'region_cl': 'id_re',
      'provincia_cl': 'id_pr',
      'comuna_cl': 'id_co',
    };
  
    const columnId = columnIdMap[tableName];
    if (!columnId) throw new Error('Tabla no válida');
  
    const rows = await query(
      `SELECT ${columnId} as id FROM ${tableName} WHERE str_descripcion = ?`,
      [description]
    );
    
    return rows.length > 0 ? rows[0].id : null;
  };
  
  // Valida si una provincia pertenece a una región
  const isProvinciaInRegion = async (provinciaId, regionId) => {
    const rows = await query(
      'SELECT 1 FROM provincia_cl WHERE id_pr = ? AND id_re = ?',
      [provinciaId, regionId]
    );
    return rows.length > 0;
  };
  
  // Valida si una comuna pertenece a una provincia
  const isComunaInProvincia = async (comunaId, provinciaId) => {
    const rows = await query(
      'SELECT 1 FROM comuna_cl WHERE id_co = ? AND id_pr = ?',
      [comunaId, provinciaId]
    );
    return rows.length > 0;
  };
  
  export { getIdByDescription, isProvinciaInRegion, isComunaInProvincia };
  
import { pool } from "../utils/db.js";
export const logUserEvent = async (userId, eventType, ipAddress, browser_info) => {
    if (!userId || !eventType || !ipAddress || !browser_info) {
      throw new Error('Falta un parametro requerido');
    }
  
    try {
      await pool.query(
        `INSERT INTO user_logs (user_id, event_type, ip_address, browser_info) VALUES (?, ?, ?, ?)`,
        [userId, eventType, ipAddress, browser_info]
      );
    } catch (error) {
      console.error('Error loggeando evento:', error);
      throw new Error('Error loggeando event');
    }
  };
  
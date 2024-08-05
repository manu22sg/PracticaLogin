import { pool } from "../utils/db.js";
export const logUserEvent = async (userId, eventType, ipAddress, browser_info) => {
    if (!userId || !eventType || !ipAddress || !browser_info) {
      throw new Error('Missing required parameters for logging event');
    }
  
    try {
      await pool.query(
        `INSERT INTO user_logs (user_id, event_type, ip_address, browser_info) VALUES (?, ?, ?, ?)`,
        [userId, eventType, ipAddress, browser_info]
      );
    } catch (error) {
      console.error('Error logging event:', error);
      throw new Error('Error logging event');
    }
  };
  
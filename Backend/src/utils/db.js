import mysql from "mysql2/promise"; // Importar mysql2/promise para conectarse a la base de datos
import {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT,
} from "../config/envConfig.js"; // Importar las variables de entorno

export const pool = mysql.createPool({
  // Crear un pool de conexiones
  host: DB_HOST, // Dirección del servidor de base de datos
  user: DB_USER, // Usuario de la base de datos
  password: DB_PASSWORD,
  port: DB_PORT, // Contraseña de la base de datos
  database: DB_DATABASE, // Nombre de la base de datos
  waitForConnections: true, // Esperar a que haya conexiones disponibles
  connectionLimit: 10, // Límite de conexiones
  queueLimit: 0, // Sin límite de colas
});

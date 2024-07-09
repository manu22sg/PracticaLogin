import mysql from "mysql2/promise"; // Importar mysql2/promise para conectarse a la base de datos

export const pool = mysql.createPool({
  // Crear un pool de conexiones
  host: "localhost", // Dirección del servidor de base de datos
  user: "root", // Usuario de la base de datos
  password: "0104", // Contraseña de la base de datos
  database: "Citecubb2", // Nombre de la base de datos
  waitForConnections: true, // Esperar a que haya conexiones disponibles
  connectionLimit: 10, // Límite de conexiones
  queueLimit: 0, // Sin límite de colas
});

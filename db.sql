
/*CREATE DATABASE IF NOT EXISTS Citecubb2;

-- Usar la base de datos
USE Citecubb2;

-- Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
*/

CREATE TABLE IF NOT EXISTS users (
rut VARCHAR(12) PRIMARY KEY NOT NULL UNIQUE, 
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM("Administrador Interno", "Administrador Externo", "Gerente", "Personal Contable", "Persona Administrativa") NOT NULL
);

CREATE TABLE IF NOT EXISTS company(
    direction VARCHAR(100) NOT NULL,
    phone VARCHAR(12) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE PRIMARY KEY,
    razon_social VARCHAR(100) NOT NULL,
)








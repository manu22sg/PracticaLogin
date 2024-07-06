
CREATE DATABASE IF NOT EXISTS Citecubb2;

-- Usar la base de datos
USE Citecubb2;

-- Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Insertar algunos datos de prueba
INSERT INTO user (name, email, password) VALUES 
('manu', 'manu@example.com', 'manu');





CREATE TABLE IF NOT EXISTS users (
id INT AUTO_INCREMENT,
rut VARCHAR(12) NOT NULL UNIQUE,
PRIMARY KEY (id, rut),
name VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100) NOT NULL,
    celular INT NOT NULL UNIQUE,
    fecha_nacimiento DATE NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    email_opcional VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    role ENUM("Administrador Interno", "Administrador Externo", "Gerente", "Personal Contable", "Persona Administrativa") NOT NULL
);

CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT ,
    rut VARCHAR(12)  NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    PRIMARY KEY (id, rut),
    mandante VARCHAR(100) NOT NULL,
    giro VARCHAR(100) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    comuna VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    telefono VARCHAR(100) NOT NULL
);








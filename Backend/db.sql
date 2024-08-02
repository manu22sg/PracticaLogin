
CREATE TABLE IF NOT EXISTS users (
id INT AUTO_INCREMENT,
rut VARCHAR(12) NOT NULL UNIQUE,
PRIMARY KEY (id, rut),
name VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100) NOT NULL,
    celular VARCHAR(20) NOT NULL UNIQUE,
    fecha_nacimiento DATE NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    email_opcional VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    role ENUM("Administrador Interno", "Administrador Externo", "Gerente", "Personal Contable", "Persona Administrativa") NOT NULL
);
CREATE TABLE IF NOT EXISTS giros (
    codigo VARCHAR(10) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    PRIMARY KEY (codigo)
);
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rut VARCHAR(12) NOT NULL UNIQUE,
    razon_social VARCHAR(100) NOT NULL,
    nombre_fantasia VARCHAR(100),
    email_factura VARCHAR(100) UNIQUE,
    direccion VARCHAR(100) NOT NULL,
    comuna VARCHAR(100) NOT NULL,
    ciudad VARCHAR(20) NOT NULL,
    telefono VARCHAR(25) NOT NULL UNIQUE,
    giro_codigo VARCHAR(10),
    CONSTRAINT fk_giro FOREIGN KEY (giro_codigo) REFERENCES giros(codigo)
);

CREATE TABLE IF NOT EXISTS emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    nombre VARCHAR(255),
    cargo VARCHAR(255);
);









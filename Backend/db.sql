
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
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS giros (
    codigo VARCHAR(10) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    PRIMARY KEY (codigo)
);
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT ,
    rut VARCHAR(12) NOT NULL UNIQUE,
    PRIMARY KEY (id, rut),
    razon_social VARCHAR(100) NOT NULL,
    nombre_fantasia VARCHAR(100),
    email_factura VARCHAR(100) UNIQUE,
    region_id INT NOT NULL,
    provincia_id INT NOT NULL,
    comuna_id INT NOT NULL,
    direccion VARCHAR(100) NOT NULL,    
    telefono VARCHAR(25) NOT NULL UNIQUE,
    giro_codigo VARCHAR(10),
    CONSTRAINT fk_giro FOREIGN KEY (giro_codigo) REFERENCES giros(codigo),
    CONSTRAINT fk_comuna FOREIGN KEY (comuna_id) REFERENCES comuna_cl(id_co),
    CONSTRAINT fk_provincia FOREIGN KEY (provincia_id) REFERENCES provincia_cl(id_pr),
    CONSTRAINT fk_region FOREIGN KEY (region_id) REFERENCES region_cl(id_re)
);
CREATE TABLE IF NOT EXISTS emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    nombre VARCHAR(100),
    cargo VARCHAR(100),
    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);





CREATE TABLE `region_cl` (
  `id_re` int(11) NOT NULL COMMENT 'ID unico',
  `str_descripcion` varchar(60) COLLATE latin1_spanish_ci NOT NULL COMMENT 'Nombre extenso',
  `str_romano` varchar(5) COLLATE latin1_spanish_ci NOT NULL COMMENT 'Número de región',
  `num_provincias` int(11) NOT NULL COMMENT 'total provincias',
  `num_comunas` int(11) NOT NULL COMMENT 'Total de comunas',
  PRIMARY KEY (`id_re`) )
  de
CREATE TABLE `provincia_cl` (
  `id_pr` int(11) NOT NULL COMMENT 'ID provincia',
  `id_re` int(11) NOT NULL COMMENT 'ID region asociada',
  `str_descripcion` varchar(30) COLLATE latin1_spanish_ci NOT NULL COMMENT 'Nombre descriptivo',
  `num_comunas` int(11) NOT NULL COMMENT 'Numero de comunas',
  PRIMARY KEY (`id_pr`)
)
CREATE TABLE `comuna_cl` (
  `id_co` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID unico de la comuna',
  `id_pr` int(11) NOT NULL COMMENT 'ID de la provincia asociada',
  `str_descripcion` varchar(30) COLLATE latin1_spanish_ci DEFAULT NULL COMMENT 'Nombre descriptivo de la comuna',
  PRIMARY KEY (`id_co`,`id_pr`)
) 

CREATE TABLE IF NOT EXISTS user_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_type ENUM('connect', 'update', 'disconnect', 'delete') NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    browser_info VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
import { pool } from "../utils/db.js";

import {
  generateToken
} from "../middlewares/authMiddleware.js";

export const login = async (req, res) => { // Exportamos una función asíncrona para iniciar sesión
  const { email, password } = req.body; // Obtenemos el correo electrónico y la contraseña del cuerpo de la solicitud
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son requeridos" }); // Validamos si el correo electrónico y la contraseña están presentes 
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [ 
      email,
    ]);

    if (rows.length === 0 || rows[0].password !== password) {
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos" });
    }

    const user = rows[0]; // Obtenemos el primer usuario de la lista

    const accessToken = generateToken(user); // Generamos un token de acceso
    
    res.json({ accessToken });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al iniciar sesión", error: error.message });
  }
};

export const register = async (req, res) => { // Exportamos una función asíncrona para registrar un usuario
  const {
    rut,
    name,
    apellido_paterno,
    apellido_materno,
    celular,
    fecha_nacimiento,
    email,
    email_opcional = null,
    password,
    role,
  } = req.body;
  if (
    !rut ||
    !name ||
    !apellido_paterno ||
    !apellido_materno ||
    !celular ||
    !fecha_nacimiento ||
    !email ||
    !password ||
    !role
  ) {
    return res // Validamos si los campos requeridos están presentes
      .status(400)
      .json({ message: "Por favor, llenar los campos vacios" });
  }

  try {
    // Verificar si el correo electrónico ya está registrado
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR rut = ?",
      [email, rut]
    );

    if (existingUser.length > 0) {
      if (existingUser[0].email === email) {
        return res
          .status(409)
          .json({ message: "El correo electrónico ya está registrado" });
      } else if (existingUser[0].rut === rut) {
        return res.status(410).json({ message: "El rut ya está registrado" });
      }
    }

    // Insertar el nuevo usuario en la base de datos
    await pool.query(
      "INSERT INTO users (rut, name, apellido_paterno, apellido_materno, celular,fecha_nacimiento,email,email_opcional,password,role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        rut,
        name,
        apellido_paterno,
        apellido_materno,
        celular,
        fecha_nacimiento,
        email,
        email_opcional,
        password,
        role,
      ]
    );

    res.status(201).json({ message: "Usuario registrado exitosamente" }); // Respondemos con un mensaje de éxito
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar usuario", error: error.message }); 
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error al cerrar sesión" }); // Si hay un error al cerrar la sesión, devolver un mensaje de error
    }
     // Limpiamos la cookie del refresh token
    res.json({ message: "Sesión cerrada exitosamente" });
  });
};

import { pool } from "../utils/db.js";
import bcrypt from "bcrypt";
import {
  generateToken
} from "../middlewares/authMiddleware.js";


export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son requeridos" });
  }

  try {
    // Buscar el usuario por el correo electrónico
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Email o contraseña incorrectos" });
    }

    const user = rows[0]; // Obtener el primer usuario encontrado

    // Comparar la contraseña proporcionada con la contraseña cifrada en la base de datos
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Email o contraseña incorrectos" });
    }

    // Generar un token de acceso
    const accessToken = generateToken(user);

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};

export const register = async (req, res) => {
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
    return res
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

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    await pool.query(
      "INSERT INTO users (rut, name, apellido_paterno, apellido_materno, celular, fecha_nacimiento, email, email_opcional, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        rut,
        name,
        apellido_paterno,
        apellido_materno,
        celular,
        fecha_nacimiento,
        email,
        email_opcional,
        hashedPassword, // Usar la contraseña cifrada
        role,
      ]
    );

    res.status(201).json({ message: "Usuario registrado exitosamente" });
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

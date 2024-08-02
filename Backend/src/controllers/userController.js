import { pool } from "../utils/db.js";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import {CORREO, PASSWORD, FRONTEND_URL} from "../config/envConfig.js";

export const listUsers = async (req, res) => { 
  try {
    const [rows] = await pool.query("SELECT * FROM users"); // Realizamos una consulta a la base de datos para seleccionar todos los usuarios
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener usuarios: ", error);
  }
};
export const listUser = async (req, res) => { 
  try {
    const { rut } = req.params;
    const [rows] = await pool.query("SELECT * FROM users WHERE rut = ?", [rut]); // Consulta para seleccionar un usuario por su Rut
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error("Error al obtener usuario: ", error);
  }
};

export const updateUser = async (req, res) => { // Exportamos una función asíncrona para actualizar un usuario
  const { rut } = req.params;
  const {
    name,
    apellido_paterno,
    apellido_materno,
    celular,
    email,
    email_opcional,
    role,
  } = req.body;
  try {
    // Actualizar el usuario especificado por el RUT
    const [result] = await pool.query(
      "UPDATE users SET name = IFNULL(?,name), apellido_paterno = IFNULL(?,apellido_paterno), apellido_materno = IFNULL(?,apellido_materno), celular = IFNULL(?,celular), email = IFNULL(?,email), email_opcional = IFNULL(?, email_opcional), role = IFNULL(?,role) WHERE rut = ?",
      [
        name,
        apellido_paterno,
        apellido_materno,
        celular,
        email,
        email_opcional,
        role,
        rut,
      ]
    );

    if (result.affectedRows <= 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Obtener el usuario actualizado
    const [rows] = await pool.query("SELECT * FROM users WHERE rut = ?", [rut]);
    res.json(rows[0]);
  } catch (error) {
    return res.status(400).json({ message: "Error al actualizar usuario" });
  }
};

export const deleteUser = async (req, res) => { // Exportamos una función asíncrona para eliminar un usuario
  try {
    const { rut } = req.params;
    await pool.query("DELETE FROM users WHERE rut = ?", [rut]);
    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar usuario" });
  }
};



export const requestResetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Verificar si el correo electrónico está registrado
    const [userRows] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Correo electrónico no registrado' });
    }

    const userId = userRows[0].id;
    const token = uuidv4(); // Generar un token único
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1); // Token válido por 1 hora

    // Actualizar el registro del usuario con el token y la fecha de expiración
    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
      [token, expiration, userId]
    );

    // Configurar el transporte de correo electrónico
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: CORREO,
        pass: PASSWORD
      }
    });

    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;


    // Enviar el correo electrónico
    await transporter.sendMail({
      to: email,
      subject: 'Restablecimiento de Contraseña',
      text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetLink}`
    });

    res.json({ message: 'Correo electrónico de restablecimiento enviado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
  }
};
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verificar el token
    const [userRows] = await pool.query(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [token]
    );

    if (userRows.length === 0) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const userId = userRows[0].id;

    

    // Actualizar la contraseña y limpiar el token
    await pool.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [newPassword, userId]
    );

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al restablecer la contraseña', error: error.message });
  }
};

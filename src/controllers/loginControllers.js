import bcrypt from "bcryptjs"; // Librería para encriptar contraseñas
import { pool } from "../db.js"; // pool es el objeto de conexión

export const login = async (req, res) => {
  // exportamos la función login
  // Función para renderizar la vista de login
  if (!req.session.loggedin) {
    res.render("login/index");
  } else {
    res.redirect("/");
  }
};

export const auth = async (req, res) => {
  // exportamos la función auth
  // Función para autenticar al usuario
  const data = req.body; // Obtenemos los datos del formulario
  console.log(data); // Imprimimos los datos en consola

  try {
    const connection = await pool.getConnection(); // Obtenemos una conexión
    const [rows] = await connection.query(
      // Realizamos una consulta
      "SELECT * FROM user WHERE email = ?", // Consulta para obtener al usuario
      [data.email]
    );
    connection.release(); // Liberamos la conexión

    if (rows.length > 0) {
      // Si se encontró al usuario en la base de datos
      const element = rows[0];
      const isMatch = await bcrypt.compare(data.password, element.password); // compara la contraseña ingresada con la contraseña almacenada en la base de datos
      // Comparamos la contraseña ingresada con la contraseña almacenada en la base de datos
      if (!isMatch) {
        // Si las contraseñas no coinciden
        res.render("login/index", { error: "Error: Contraseña Incorrecta" });
      } else {
        // Si las contraseñas coinciden
        req.session.loggedin = true; // Iniciamos sesión
        req.session.name = element.name; // Almacenamos el nombre del usuario en la sesión
        res.redirect("/"); // Redirigimos al usuario a la página principal con la sesión iniciada
      }
    } else {
      res.render("login/index", { error: "Error: Usuario no registrado" }); // Si no se encontró al usuario en la base de datos
    }
  } catch (err) {
    console.error(err);
    res.render("login/index", { error: "Error del servidor" }); // Si ocurre un error en el servidor
  }
};

export const register = async (req, res) => {
  // exportamos la función register
  // Función para renderizar la vista de registro
  if (!req.session.loggedin) {
    // Si no se ha iniciado sesión
    res.render("login/register"); // Renderizamos la vista de registro
  } else {
    res.redirect("/"); // Si ya se ha iniciado sesión, redirigimos al usuario a la página principal
  }
};

export const storeUser = async (req, res) => {
  // exportamos la función storeUser
  // Función para registrar al usuario

  const data = req.body; // Obtenemos los datos del formulario

  try {
    const connection = await pool.getConnection(); // Obtenemos una conexión a la base de datos
    const [rows] = await connection.query(
      // Realizamos una consulta para verificar si el usuario ya está registrado
      // Realizamos una consulta
      "SELECT * FROM user WHERE email = ?",
      [data.email]
    );

    if (rows.length > 0) {
      // Si se encontró al usuario en la base de datos ya registrado

      connection.release();
      res.render("login/register", { error: "Error: Usuario ya registrado" });
    } else {
      const hash = await bcrypt.hash(data.password, 12); // Encriptamos la contraseña del usuario
      data.password = hash; // Actualizamos la contraseña en el objeto data
      await connection.query("INSERT INTO user SET ?", [data]); // Insertamos al usuario en la base de datos
      connection.release();

      req.session.loggedin = true; // Iniciamos sesión
      req.session.name = data.name; // Almacenamos el nombre del usuario en la sesión
      res.redirect("/"); // Redirigimos al usuario a la página principal con la sesión iniciada
    }
  } catch (err) {
    console.error(err);
    res.render("login/register", { error: "Error del servidor" }); // Si ocurre un error en el servidor al registrar al usuario
  }
};

export const logout = async (req, res) => {
  // exportamos la función logout
  // Función para cerrar sesión
  // Función para cerrar sesión
  if (req.session.loggedin) {
    // Si se ha iniciado sesión se cierra la sesión
    req.session.destroy(); // Se destruye la sesión
  }
  res.redirect("/login");
};

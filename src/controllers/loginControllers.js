const bcrypt = require("bcryptjs"); // Librería para encriptar contraseñas
const { pool } = require("../db"); // pool es el objeto de conexión

async function login(req, res) {
  // Función para renderizar la vista de login
  if (!req.session.loggedin) {
    res.render("login/index");
  } else {
    res.redirect("/");
  }
}

async function auth(req, res) {
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
      const isMatch = await bcrypt.compare(data.password, element.password);
      // Comparamos la contraseña ingresada con la contraseña almacenada en la base
      if (!isMatch) {
        // Si las contraseñas no coinciden
        res.render("login/index", { error: "Error: Contraseña Incorrecta" });
      } else {
        // Si las contraseñas coinciden
        req.session.loggedin = true;
        req.session.name = element.name; // Almacenamos el nombre del usuario en la sesión
        res.redirect("/");
      }
    } else {
      res.render("login/index", { error: "Error: Usuario no registrado" }); // Si no se encontró al usuario
    }
  } catch (err) {
    console.error(err);
    res.render("login/index", { error: "Error del servidor" });
  }
}

async function register(req, res) {
  // Función para renderizar la vista de registro
  if (!req.session.loggedin) {
    res.render("login/register");
  } else {
    res.redirect("/");
  }
}

async function storeUser(req, res) {
  // Función para registrar al usuario
  const data = req.body;

  try {
    const connection = await pool.getConnection(); // Obtenemos una conexión a la base de datos
    const [rows] = await connection.query(
      // Realizamos una consulta
      "SELECT * FROM user WHERE email = ?",
      [data.email]
    );

    if (rows.length > 0) {
      // Si el usuario ya está registrado
      connection.release();
      res.render("login/register", { error: "Error: Usuario ya registrado" });
    } else {
      const hash = await bcrypt.hash(data.password, 12); // Encriptamos la contraseña del usuario
      data.password = hash; // Actualizamos la contraseña en el objeto data
      await connection.query("INSERT INTO user SET ?", [data]); // Insertamos al usuario en la base de datos
      connection.release();

      req.session.loggedin = true; // Iniciamos sesión
      req.session.name = data.name; // Almacenamos el nombre del usuario en la sesión
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.render("login/register", { error: "Error del servidor" });
  }
}

async function logout(req, res) {
  // Función para cerrar sesión
  if (req.session.loggedin) {
    req.session.destroy();
  }
  res.redirect("/login");
}

module.exports = {
  login,
  register,
  storeUser,
  auth,
  logout,
};

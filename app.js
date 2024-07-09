import express from "express"; // Importamos express para crear el servidor
import { engine } from "express-handlebars"; // Importamos express-handlebars para renderizar vistas
import session from "express-session"; // Importamos express-session para manejar sesiones

import path from "path"; // Importamos path para manejar rutas
import loginRoutes from "./src/routes/login.js"; // Importamos las rutas de login para manejar las peticiones

const app = express();
app.set("port", process.env.PORT || 3000); // Configuramos el puerto del servidor para que sea el 3000 o el que se encuentre en la variable de entorno PORT
const __dirname = path.resolve(); // Obtenemos la ruta del directorio actual
app.use(express.static(path.join(__dirname, "src/views"))); // Configuramos la carpeta de vistas para que sea accesible desde el servidor

app.engine(".hbs", engine({ extname: ".hbs" })); // Configuramos el motor de plantillas para que sea handlebars
app.set("view engine", ".hbs"); // Configuramos el motor de plantillas para que sea handlebars

app.use(express.urlencoded({ extended: true })); // middleware para obtener datos de formularios
app.use(express.json()); // middleware para obtener datos de formularios en formato JSON

app.use(
  // middleware para manejar sesiones
  session({
    secret: "secret", // Clave secreta para firmar la cookie de la sesión
    resave: true, // Guarda la sesión de nuevo en el store en cada solicitud, incluso si no ha sido modificada
    saveUninitialized: true, // Guarda nuevas sesiones no modificadas, útil para inicializar sesiones para usuarios anónimos
  })
);

app.listen(app.get("port"), () => {
  console.log("Escuchando en el puerto", app.get("port"));
});

app.use("/", loginRoutes); //Montar loginRoutes en el camino raíz, haciendo que las rutas estén disponibles desde "/"

app.get("/", (req, res) => {
  // Ruta para la página principal
  if (req.session.loggedin) {
    // Si se ha iniciado sesión
    res.render("home", { name: req.session.name }); // Renderizamos la vista home con el nombre del usuario
  } else {
    res.redirect("/login"); // Si no se ha iniciado sesión, redirigimos al usuario a la página de login
  }
});

import express from "express";
import session from "express-session";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import companyRoutes from "./src/routes/companyRoutes.js";
import giroRoutes from "./src/routes/giroRoutes.js";
import cors from "cors";
import { PORT } from "./src/config/envConfig.js";
import cookieParser from "cookie-parser";
import excelRoutes from "./src/routes/excelRoutes.js";
import dataRoutes from "./src/routes/dataRoutes.js";


const app = express();

app.use( // Configur el CORS
  cors({
    origin: true,
    credentials: true,
  })
); 
app.use(cookieParser()); // Configuramos el uso de cookies
app.use(express.json()); // Configuramos el uso de JSON

app.use( // Configuramos el uso de sesiones
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/api/auth", authRoutes); // Definimos la ruta para autenticación 
app.use("/api/users", userRoutes); // Definimos la ruta para los usuarios
app.use("/api/companies", companyRoutes);  // Definimos la ruta para las empresas
app.use("/api", giroRoutes); // Definimos la ruta para los giros
app.use("/api", excelRoutes); // Definimos la ruta para exportar a Excel
app.use("/api", dataRoutes); // Definimos la ruta para obtener datos de regiones, provincias y comunas



app.use((req, res) => { // Definimos una ruta para manejar errores 404
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.listen(PORT, () => { // Inicializamos el servidor en el puerto
  console.log("Servidor escuchando en el puerto", PORT);
});

import express from "express";
import session from "express-session";
import path from "path";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import companyRoutes from "./src/routes/companyRoutes.js";
import cors from "cors";
import { PORT } from "./src/config/envConfig.js";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Permitir solicitudes desde el frontend en este origen
    credentials: true, // Permitir enviar y recibir cookies en las solicitudes (si es necesario)
  })
);

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto", PORT);
});

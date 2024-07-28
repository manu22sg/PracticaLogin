import express from "express";
import session from "express-session";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import companyRoutes from "./src/routes/companyRoutes.js";
import giroRoutes from "./src/routes/giroRoutes.js";
import cors from "cors";
import { PORT } from "./src/config/envConfig.js";
import cookieParser from "cookie-parser";
import excelCompanies from "./src/routes/excelRoutes.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

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
app.use("/api", giroRoutes);
app.use("/api", excelCompanies);

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto", PORT);
});

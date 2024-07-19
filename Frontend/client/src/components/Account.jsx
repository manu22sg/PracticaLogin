import React, { useContext } from "react";
import { AuthContext } from "../context/Contexto"; // Importa el contexto
import dayjs from "dayjs";

const Account = () => {
  const { user } = useContext(AuthContext); // Obtiene el usuario del contexto

  if (!user) {
    return <p className="text-black">Cargando...</p>; // Muestra un mensaje de carga si no hay usuario
  }
  const formattedDate = new Date(user.fecha_nacimiento).toLocaleDateString(
    // Formatea la fecha de nacimiento
    "es-CL",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  );

  return (
    <div className="p-4 bg-white text-black rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Mi Cuenta</h2>
      <p className="mb-2">
        <strong>Nombre:</strong> {user.name}
      </p>
      <p className="mb-2">
        <strong>Apellido Paterno:</strong> {user.apellido_paterno}
      </p>
      <p className="mb-2">
        <strong>Apellido Materno:</strong> {user.apellido_materno}
      </p>
      <p className="mb-2">
        <strong>RUT:</strong> {user.rut}
      </p>
      <p className="mb-2">
        <strong>Celular:</strong> {user.celular}
      </p>
      <p className="mb-2">
        <strong>Fecha de Nacimiento:</strong>{" "}
        {dayjs(user.fecha_nacimiento).format("DD/MM/YYYY")}
      </p>
      <p className="mb-2">
        <strong>Email:</strong> {user.email}
      </p>
      <p className="mb-2">
        <strong>Email Opcional:</strong> {user.email_opcional}
      </p>
      <p className="mb-2">
        <strong>Rol:</strong> {user.role}
      </p>
    </div>
  );
};

export default Account;

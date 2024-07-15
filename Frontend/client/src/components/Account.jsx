import React, { useContext } from "react";
import { AuthContext } from "../context/Contexto"; // Importa el contexto

const Account = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>Cargando...</p>; // O cualquier otro mensaje de carga
  }

  return (
    <div>
      <h2>Mi Cuenta</h2>
      <p>name: {user.name}</p>
      <p>Rut: {user.rut}</p>
      <p>Email: {user.email}</p>
      <p>Rol: {user.role}</p>
    </div>
  );
};

export default Account;

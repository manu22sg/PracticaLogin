import React, { useContext } from "react";
import { AuthContext } from "../context/Contexto"; // Importa el contexto

const Account = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p className="text-white">Cargando...</p>; // O cualquier otro mensaje de carga
  }

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Mi Cuenta</h2>
      <p className="mb-2">
        <strong>Nombre:</strong> {user.name}
      </p>
      <p className="mb-2">
        <strong>Rut:</strong> {user.rut}
      </p>
      <p className="mb-2">
        <strong>Email:</strong> {user.email}
      </p>
      <p className="mb-2">
        <strong>Rol:</strong> {user.role}
      </p>
    </div>
  );
};

export default Account;

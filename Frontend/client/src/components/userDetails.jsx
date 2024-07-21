import React from "react";

const UserDetails = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-lg">
        <h2 className="text-xl font-bold mb-2">Detalles del Usuario</h2>
        <p>
          <strong>Nombre:</strong> {user.name}
        </p>
        <p>
          <strong>Apellido Paterno:</strong> {user.apellido_paterno}
        </p>
        <p>
          <strong>Apellido Materno:</strong> {user.apellido_materno}
        </p>
        <p>
          <strong>RUT:</strong> {user.rut}
        </p>
        <p>
          <strong>Celular:</strong> {user.celular}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Email Opcional:</strong> {user.email_opcional}
        </p>
        <p>
          <strong>Rol:</strong> {user.role}
        </p>
        <button
          onClick={onClose}
          className="mt-4 p-2 bg-red-500 hover:bg-red-600 rounded text-white"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default UserDetails;

import React, { useState, useEffect } from "react";
import { updateUser } from "../services/api";

const EditUserForm = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(user.rut, { name, email, role });
      onSave(); // Actualiza la lista de usuarios
      onClose(); // Cierra el formulario
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

  return (
    <div className="edit-user-form p-4 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Editar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block mb-1">Nombre:</label>
          <input
            type="text"
            placeholder={name}
            onChange={(e) => setName(e.target.value)}
            className="p-1 rounded bg-gray-700 text-white w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            placeholder={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-1 rounded bg-gray-700 text-white w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Rol:</label>
          <input
            type="text"
            placeholder={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-1 rounded bg-gray-700 text-white w-full"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="mr-2 p-1 bg-blue-500 hover:bg-blue-600 rounded text-white"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 bg-red-500 hover:bg-red-600 rounded text-white"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;

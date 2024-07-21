import React, { useState, useEffect } from "react";
import { updateUser } from "../services/api";
import Swal from "sweetalert2";

const EditUserForm = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [apellido_paterno, setApellidoPaterno] = useState(
    user.apellido_paterno
  );
  const [apellido_materno, setApellidoMaterno] = useState(
    user.apellido_materno
  );
  const [celular, setCelular] = useState(user.celular);
  const [email, setEmail] = useState(user.email);
  const [email_opcional, setEmailOpcional] = useState(user.email_opcional);
  const [role, setRole] = useState(user.role);

  useEffect(() => {
    setName(user.name);
    setApellidoPaterno(user.apellido_paterno);
    setApellidoMaterno(user.apellido_materno);
    setCelular(user.celular);
    setEmail(user.email);
    setEmailOpcional(user.email_opcional);
    setRole(user.role);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(user.rut, {
        name,
        apellido_paterno,
        apellido_materno,
        celular,
        email,
        email_opcional,
        role,
      });
      onSave(); // Actualiza la lista de usuarios
      onClose(); // Cierra el formulario
      Swal.fire({
        icon: "success",
        title: "¡Usuario actualizado!",
        text: "El usuario ha sido actualizado correctamente.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al actualizar el usuario",
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block mb-1">RUT:</label>
          <input
            type="text"
            value={user.rut}
            className="p-1 rounded bg-gray-200 text-black w-full"
            disabled
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Apellido Paterno:</label>
          <input
            type="text"
            value={apellido_paterno}
            onChange={(e) => setApellidoPaterno(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Apellido Materno:</label>
          <input
            type="text"
            value={apellido_materno}
            onChange={(e) => setApellidoMaterno(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Celular:</label>
          <input
            type="text"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Email Opcional:</label>
          <input
            type="email"
            value={email_opcional}
            onChange={(e) => setEmailOpcional(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Rol:</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-2 p-2 bg-red-500 hover:bg-red-600 rounded text-white"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default EditUserForm;

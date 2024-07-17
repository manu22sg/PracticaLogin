import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

const RegisterForm = () => {
  const [rut, setRut] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rut || !name || !email || !password || !role) {
      Swal.fire({
        icon: "warning",
        title: "Faltan campos por llenar",
      });
      return;
    }

    try {
      const response = await registerUser({ rut, name, email, password, role });
      Swal.fire({
        icon: "success",
        title: "¡Usuario creado!",
        text: response.data.message,
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al registrar el usuario",
      });
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">RUT:</label>
          <input
            type="text"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Rol:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="">Selecciona un rol</option>
            <option value="Administrador Interno">Administrador Interno</option>
            <option value="Administrador Externo">Administrador Externo</option>
            <option value="Gerente">Gerente</option>
            <option value="Personal Contable">Personal Contable</option>
            <option value="Persona Administrativa">
              Persona Administrativa
            </option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;

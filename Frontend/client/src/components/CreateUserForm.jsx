import React, { useState } from "react";
import { registerUser } from "../services/api";
import Swal from "sweetalert2";

const CreateUserForm = () => {
  const [rut, setRut] = useState("");
  const [name, setName] = useState("");
  const [apellido_paterno, setApellidoPaterno] = useState("");
  const [apellido_materno, setApellidoMaterno] = useState("");
  const [celular, setCelular] = useState("");
  const [fecha_nacimiento, setFechaNacimiento] = useState("");
  const [email, setEmail] = useState("");
  const [email_opcional, setEmailOpcional] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const rolesDisponibles = [
    "Administrador Interno",
    "Gerente",
    "Personal Contable",
    "Persona Administrativa",
    "Administrador Externo",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !rut ||
      !name ||
      !apellido_paterno ||
      !apellido_materno ||
      !celular ||
      !fecha_nacimiento ||
      !email ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      Swal.fire({
        icon: "warning",
        title: "Todos los campos son obligatorios",
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
      });
      return;
    }

    try {
      await registerUser({
        rut,
        name,
        apellido_paterno,
        apellido_materno,
        celular,
        fecha_nacimiento,
        email,
        email_opcional,
        password,
        role,
      });
      Swal.fire({
        icon: "success",
        title: "¡Usuario creado!",
        text: "Usuario creado exitosamente",
      });
      setRut("");
      setName("");
      setApellidoPaterno("");
      setApellidoMaterno("");
      setCelular("");
      setFechaNacimiento("");
      setEmail("");
      setEmailOpcional("");
      setPassword("");
      setConfirmPassword("");
      setRole("");
    } catch (error) {
      let errorMessage = "Error al registrar el usuario";
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = "El correo electrónico ya está registrado";
        } else if (error.response.status === 410) {
          errorMessage = "El rut ya está registrado";
        }
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };

  return (
    <div className=" create-user-form p-4 bg-white text-black rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Crear Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">RUT:</label>
          <input
            type="text"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Apellido Paterno:</label>
          <input
            type="text"
            value={apellido_paterno}
            onChange={(e) => setApellidoPaterno(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Apellido Materno:</label>
          <input
            type="text"
            value={apellido_materno}
            onChange={(e) => setApellidoMaterno(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Celular:</label>
          <input
            type="text"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Fecha de Nacimiento:</label>
          <input
            type="date"
            value={fecha_nacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email Opcional:</label>
          <input
            type="email"
            value={email_opcional}
            onChange={(e) => setEmailOpcional(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Confirmar Contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Rol:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          >
            <option value="">Selecciona un rol</option>
            {rolesDisponibles.map((rol) => (
              <option key={rol} value={rol}>
                {rol}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          Crear
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;

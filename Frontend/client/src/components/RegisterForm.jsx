import React, { useState } from "react";
import { registerUser } from "../services/auth.services";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RegisterForm = () => {
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
  const navigate = useNavigate();

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
        title: "Faltan campos por llenar",
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Las contraseñas no coinciden",
      });
      return;
    }

    try {
      const response = await registerUser({
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
        text: response.data.message,
      }).then(() => {
        navigate("/dashboard");
      });
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
    <div className="p-4 bg-white text-black rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">RUT<span className="text-red-500"> *</span></label>
          <input
            type="text"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Nombre <span className="text-red-500"> *</span></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Apellido Paterno <span className="text-red-500"> *</span></label>
          <input
            type="text"
            value={apellido_paterno}
            onChange={(e) => setApellidoPaterno(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Apellido Materno <span className="text-red-500"> *</span></label>
          <input
            type="text"
            value={apellido_materno}
            onChange={(e) => setApellidoMaterno(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Celular <span className="text-red-500"> *</span></label>
          <input
            type="text"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Fecha de Nacimiento <span className="text-red-500"> *</span></label>
          <input
            type="date"
            value={fecha_nacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email <span className="text-red-500"> *</span></label>
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
          <label className="block mb-2">Contraseña <span className="text-red-500"> *</span></label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Confirmar Contraseña <span className="text-red-500"> *</span></label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Rol <span className="text-red-500"> *</span></label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 text-black"
          >
            <option value="">Seleccione un rol</option>
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
      <div className="mt-4 text-center">
        <button
          onClick={() => navigate("/login")}
          className="text-blue-500 hover:text-blue-700"
        >
          Volver al Login
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;

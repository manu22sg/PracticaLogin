// src/components/RegisterForm.jsx
import React, { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [rut, setRut] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rut || !name || !email || !password || !role) {
      setMessage("Faltan campos por llenar");
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", {
        rut,
        name,
        email,
        password,
        role,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error al registrar el usuario");
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>RUT:</label>
          <input
            type="text"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
          />
        </div>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Rol:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
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
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegisterForm;

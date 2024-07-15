import React, { useState } from "react";
import axios from "axios";

const CreateUserForm = () => {
  const [rut, setRut] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const rolesDisponibles = [
    "Administrador Interno",
    "Gerente",
    "Personal Contable",
    "Persona Administrativa",
    "Administrador Externo",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rut || !name || !email || !password || !role) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          rut,
          name,
          email,
          password,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Usuario creado exitosamente");
      setRut("");
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      setError("");
    } catch (error) {
      console.error("Error creating user: ", error);
      setError("Error al crear el usuario");
    }
  };

  return (
    <div className="create-user-form">
      <h2>Crear Usuario</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
            {rolesDisponibles.map((rol) => (
              <option key={rol} value={rol}>
                {rol}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Crear</button>
      </form>
    </div>
  );
};

export default CreateUserForm;

import React, { useState } from "react";
import { createCompany } from "../services/api";
import Swal from "sweetalert2";

const CreateCompanyForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCompany({ email, name, address, phone, password });
      Swal.fire({
        icon: "success",
        title: "Empresa creada!",
        text: "Empresa creada exitosamente",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al crear la empresa",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-gray-800 text-white rounded-lg shadow-md max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Crear Empresa</h2>
      <div className="mb-4">
        <label className="block text-white">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white">Nombre:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white">Dirección:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white">Teléfono:</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white">Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="p-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
      >
        Crear Empresa
      </button>
    </form>
  );
};

export default CreateCompanyForm;

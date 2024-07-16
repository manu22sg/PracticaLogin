import React, { useState } from "react";
import axios from "axios";

const CreateCompanyForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/companies",
        { email, name, address, phone, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Company created successfully:", response.data);
      alert("Empresa creada exitosamente");
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error("Error request:", error.request);
      } else {
        // Algo pasó al configurar la solicitud
        console.error("Error message:", error.message);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-gray-800 text-white rounded-lg shadow-md max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Crear Compañía</h2>
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
        Crear Compañía
      </button>
    </form>
  );
};

export default CreateCompanyForm;

import React, { useState } from "react";
import { createCompany } from "../services/api";
import Swal from "sweetalert2";

const CreateCompanyForm = () => {
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [mandante, setMandante] = useState("");
  const [giro, setGiro] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [telefono, setTelefono] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !rut ||
      !email ||
      !mandante ||
      !giro ||
      !direccion ||
      !comuna ||
      !ciudad ||
      !telefono
    ) {
      Swal.fire({
        icon: "warning",
        title: "Todos los campos son obligatorios",
      });
      return;
    }

    try {
      await createCompany({
        rut,
        email,
        mandante,
        giro,
        direccion,
        comuna,
        ciudad,
        telefono,
      });
      Swal.fire({
        icon: "success",
        title: "¡Empresa creada!",
        text: "Empresa creada exitosamente",
      });
      setRut("");
      setEmail("");
      setMandante("");
      setGiro("");
      setDireccion("");
      setComuna("");
      setCiudad("");
      setTelefono("");
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
      className="p-4 bg-white text-black rounded-lg shadow-md max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Crear Empresa</h2>
      <div className="mb-4">
        <label className="block text-black">RUT:</label>
        <input
          type="text"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          className="p-2 rounded bg-gray-200 text-black w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded bg-gray-200 text-black w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black">Mandante:</label>
        <input
          type="text"
          value={mandante}
          onChange={(e) => setMandante(e.target.value)}
          className="p-2 rounded bg-gray-200 text-black w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black">Giro:</label>
        <input
          type="text"
          value={giro}
          onChange={(e) => setGiro(e.target.value)}
          className="p-2 rounded bg-gray-200 text-black w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black">Dirección:</label>
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className="p-2 rounded bg-gray-200 text-black w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black">Comuna:</label>
        <input
          type="text"
          value={comuna}
          onChange={(e) => setComuna(e.target.value)}
          className="p-2 rounded bg-gray-200 text-black w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black">Ciudad:</label>
        <input
          type="text"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          className="p-2 rounded bg-gray-200 text-black w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black">Teléfono:</label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="p-2 rounded bg-gray-200 text-black w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
      >
        Guardar
      </button>
    </form>
  );
};

export default CreateCompanyForm;

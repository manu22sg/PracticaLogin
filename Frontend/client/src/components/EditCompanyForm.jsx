import React, { useState, useEffect } from "react";
import { updateCompany } from "../services/api";

const EditCompanyForm = ({ company, onClose, onSave }) => {
  const [email, setEmail] = useState(company.email);
  const [name, setName] = useState(company.name);
  const [address, setAddress] = useState(company.address);
  const [phone, setPhone] = useState(company.phone);
  const [password, setPassword] = useState("");

  useEffect(() => {
    setEmail(company.email);
    setName(company.name);
    setAddress(company.address);
    setPhone(company.phone);
  }, [company]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCompany(company.email, {
        email,
        name,
        address,
        phone,
        password,
      });
      onSave(); // Actualiza la lista de compañías
      onClose(); // Cierra el formulario
    } catch (error) {
      console.error("Error updating company: ", error);
    }
  };

  return (
    <div className="edit-company-form p-4 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Editar Compañía</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-1 rounded bg-gray-700 text-white w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-1 rounded bg-gray-700 text-white w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Dirección:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="p-1 rounded bg-gray-700 text-white w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Teléfono:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-1 rounded bg-gray-700 text-white w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

export default EditCompanyForm;

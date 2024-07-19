import React, { useState, useEffect } from "react";
import { updateCompany } from "../services/api";
import Swal from "sweetalert2";

const EditCompanyForm = ({ company, onClose, onSave }) => {
  const [rut, setRut] = useState(company.rut);
  const [email, setEmail] = useState(company.email);
  const [mandante, setMandante] = useState(company.mandante);
  const [giro, setGiro] = useState(company.giro);
  const [direccion, setDireccion] = useState(company.direccion);
  const [comuna, setComuna] = useState(company.comuna);
  const [ciudad, setCiudad] = useState(company.ciudad);
  const [telefono, setTelefono] = useState(company.telefono);

  useEffect(() => {
    setRut(company.rut);
    setEmail(company.email);
    setMandante(company.mandante);
    setGiro(company.giro);
    setDireccion(company.direccion);
    setComuna(company.comuna);
    setCiudad(company.ciudad);
    setTelefono(company.telefono);
  }, [company]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCompany(company.rut, {
        email,
        mandante,
        giro,
        direccion,
        comuna,
        ciudad,
        telefono,
      });
      onSave(); // Actualiza la lista de empresas
      onClose(); // Cierra el formulario
      Swal.fire({
        icon: "success",
        title: "¡Empresa actualizada!",
        text: "La empresa ha sido actualizada correctamente.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al actualizar la empresa",
      });
    }
  };

  return (
    <div className="edit-company-form p-4 bg-white text-black rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Editar Empresa</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block mb-1">RUT:</label>
          <input
            type="text"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full"
            disabled
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
          <label className="block mb-1">Mandante:</label>
          <input
            type="text"
            value={mandante}
            onChange={(e) => setMandante(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Giro:</label>
          <input
            type="text"
            value={giro}
            onChange={(e) => setGiro(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Dirección:</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Comuna:</label>
          <input
            type="text"
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Ciudad:</label>
          <input
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Teléfono:</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
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

export default EditCompanyForm;

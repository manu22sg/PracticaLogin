import React, { useState, useEffect } from "react";
import { updateCompany, listGiros } from "../services/api";
import Swal from "sweetalert2";

const EditCompanyForm = ({ company, onClose, onSave }) => {
  const [rut, setRut] = useState(company.rut);
  const [emails, setEmails] = useState(company.emails || []);
  const [razon_social, setRazonSocial] = useState(company.razon_social);
  const [giroCodigo, setGiroCodigo] = useState(company.giro_codigo);
  const [direccion, setDireccion] = useState(company.direccion);
  const [comuna, setComuna] = useState(company.comuna);
  const [ciudad, setCiudad] = useState(company.ciudad);
  const [telefono, setTelefono] = useState(company.telefono);
  const [giros, setGiros] = useState([]);

  useEffect(() => {
    const fetchGiros = async () => {
      try {
        const response = await listGiros();
        setGiros(response.data);
      } catch (error) {
        console.error("Error fetching giros:", error);
      }
    };

    fetchGiros();
  }, []);

  useEffect(() => {
    console.log("Company data updated:", company);
    setRut(company.rut);
    setEmails(company.emails || []);
    setRazonSocial(company.razon_social);
    setGiroCodigo(company.giro_codigo);
    setDireccion(company.direccion);
    setComuna(company.comuna);
    setCiudad(company.ciudad);
    setTelefono(company.telefono);
  }, [company]);

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
    console.log("Emails updated:", newEmails);
  };

  const handleAddEmail = () => {
    const newEmails = [...emails, ""];
    setEmails(newEmails);
    console.log("Email added:", newEmails);
  };

  const handleRemoveEmail = (index) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
    console.log("Email removed:", newEmails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", {
      razon_social,
      giro_codigo: giroCodigo,
      direccion,
      comuna,
      ciudad,
      telefono,
      emails,
    });
    try {
      await updateCompany(company.rut, {
        razon_social,
        giro_codigo: giroCodigo,
        direccion,
        comuna,
        ciudad,
        telefono,
        emails,
      });
      onSave(); // Actualiza la lista de empresas
      onClose(); // Cierra el formulario
      Swal.fire({
        icon: "success",
        title: "¡Empresa actualizada!",
        text: "La empresa ha sido actualizada correctamente.",
      });
    } catch (error) {
      console.error("Error updating company:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al actualizar la empresa",
      });
    }
  };

  return (
    <div className="edit-company-form p-4 bg-white text-black rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Editar Empresa</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block mb-1">RUT:</label>
          <input
            type="text"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full text-sm"
            disabled
          />
        </div>
        {emails.map((email, index) => (
          <div key={index} className="mb-2">
            <label className="block mb-1">Email {index + 1}:</label>
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                className="p-1 rounded bg-gray-200 text-black w-full text-sm"
              />
              <button
                type="button"
                onClick={() => handleRemoveEmail(index)}
                className="ml-2 p-1 bg-red-500 hover:bg-red-600 rounded text-white text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddEmail}
          className="mb-2 p-2 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm"
        >
          Añadir Email
        </button>
        <div className="mb-2">
          <label className="block mb-1">Razón Social:</label>
          <input
            type="text"
            value={razon_social}
            onChange={(e) => setRazonSocial(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full text-sm"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Giro:</label>
          <select
            value={giroCodigo}
            onChange={(e) => setGiroCodigo(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full text-sm"
          >
            {giros.map((giro) => (
              <option key={giro.codigo} value={giro.codigo}>
                {giro.descripcion}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1">Dirección:</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full text-sm"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Comuna:</label>
          <input
            type="text"
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full text-sm"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Ciudad:</label>
          <input
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full text-sm"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Teléfono:</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full text-sm"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 p-2 bg-gray-500 hover:bg-gray-600 rounded text-white text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="p-2 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCompanyForm;

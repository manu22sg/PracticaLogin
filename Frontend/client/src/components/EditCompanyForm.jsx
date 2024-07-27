import React, { useState, useEffect } from "react";
import { updateCompany, listGiros } from "../services/company.services";
import Swal from "sweetalert2";
import { FaTrash, FaPlus, FaTimes, FaSave } from "react-icons/fa";
import AsyncSelect from "react-select/async";

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
  const [filteredGiros, setFilteredGiros] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [email_factura, setEmailFactura] = useState(company.email_factura);

  useEffect(() => {
    setRut(company.rut);
    setEmails(company.emails || []);
    setRazonSocial(company.razon_social);
    setGiroCodigo(company.giro_codigo);
    setDireccion(company.direccion);
    setComuna(company.comuna);
    setCiudad(company.ciudad);
    setTelefono(company.telefono);
    setEmailFactura(company.email_factura);
  }, [company]);

  const loadGiros = async (inputValue) => {
    try {
      const response = await listGiros();
      const filteredGiros = response.data.filter((giro) =>
        giro.descripcion.toLowerCase().includes(inputValue.toLowerCase())
      );
      return filteredGiros.map((giro) => ({
        value: giro.codigo,
        label: giro.descripcion,
      }));
    } catch (error) {
      console.error("Error fetching giros:", error);
      return [];
    }
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleAddEmail = () => {
    const newEmails = [...emails, ""];
    setEmails(newEmails);
  };

  const handleRemoveEmail = (index) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredGiros(
      giros.filter((giro) => giro.descripcion.toLowerCase().includes(term))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCompany(company.rut, {
        razon_social,
        giro_codigo: giroCodigo,
        direccion,
        comuna,
        ciudad,
        telefono,
        email_factura,
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
                className="ml-2 p-1 bg-red-500 hover:bg-red-600 rounded text-white text-sm flex items-center"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddEmail}
          className="mb-2 p-2 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm flex items-center"
        >
          <FaPlus className="mr-1" />
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
          <label className="block mb-1">Email de Factura:</label>
          <input
            type="email"
            value={email_factura}
            onChange={(e) => setEmailFactura(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full text-sm"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Buscar Giro:</label>
          <AsyncSelect
            cacheOptions
            loadOptions={loadGiros}
            onChange={(selectedOption) =>
              setGiroCodigo(selectedOption ? selectedOption.value : null)
            }
            defaultOptions
            defaultValue={{
              value: company.giro_codigo,
              label: company.giro_descripcion,
            }}
            isClearable={true}
            className="basic-single"
            classNamePrefix="select"
          />
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
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 p-2 bg-red-500 hover:bg-red-600 rounded text-white text-sm flex items-center"
          >
            <FaTimes className="mr-1" />
            Cancelar
          </button>
          <button
            type="submit"
            className="p-2 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm flex items-center"
          >
            <FaSave className="mr-1" />
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCompanyForm;

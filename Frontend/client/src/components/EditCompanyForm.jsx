import React, { useState, useEffect } from "react";
import { updateCompany, listGiros } from "../services/company.services";
import Swal from "sweetalert2";
import { FaTrash, FaPlus, FaTimes, FaSave } from "react-icons/fa";
import AsyncSelect from "react-select/async";

const EditCompanyForm = ({ company, onClose, onSave }) => {
  const [rut, setRut] = useState(company.rut);
  const [emails, setEmails] = useState(company.emails || []);
  const [razon_social, setRazonSocial] = useState(company.razon_social);
  const [nombre_fantasia, setNombreFantasia] = useState(company.nombre_fantasia || "");
  const [giroCodigo, setGiroCodigo] = useState(company.giro_codigo);
  const [direccion, setDireccion] = useState(company.direccion);
  const [comuna, setComuna] = useState(company.comuna);
  const [ciudad, setCiudad] = useState(company.ciudad);
  const [telefono, setTelefono] = useState(company.telefono);
  const [email_factura, setEmailFactura] = useState(company.email_factura);

  useEffect(() => {
    setRut(company.rut);
    setEmails(company.emails || []);
    setRazonSocial(company.razon_social);
    setNombreFantasia(company.nombre_fantasia || "");
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
      return response.data.filter((giro) =>
        giro.descripcion.toLowerCase().includes(inputValue.toLowerCase())
      ).map((giro) => ({
        value: giro.codigo,
        label: giro.descripcion,
      }));
    } catch (error) {
      console.error("Error cargando giros:", error);
      return [];
    }
  };

  const handleEmailChange = (index, field, value) => {
    const newEmails = [...emails];
    newEmails[index] = { ...newEmails[index], [field]: value };
    setEmails(newEmails);
  };

  const handleAddEmail = () => {
    setEmails([...emails, { email: "", nombre: "", cargo: "" }]);
  };

  const handleRemoveEmail = (index) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validEmails = emails.filter(
        (email) => email.email.trim() !== "" && email.nombre.trim() !== "" && email.cargo.trim() !== ""
      );
      if (validEmails.length !== emails.length) {
        Swal.fire({
          icon: "error",
          title: "Campos Incompletos",
          text: "Todos los correos electrónicos deben tener nombre y cargo.",
        });
        return;
      }
      await updateCompany(company.rut, {
        razon_social,
        nombre_fantasia,
        giro_codigo: giroCodigo,
        direccion,
        comuna,
        ciudad,
        telefono,
        email_factura,
        emails: validEmails,
      });
      onSave();
      onClose();
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

  const handleGiroChange = (selectedOption) => {
    setGiroCodigo(selectedOption ? selectedOption.value : null);
  };

  return (
    <div className="edit-company-form p-4 bg-white text-black rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Editar Empresa</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block mb-1">Rut:</label>
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
                placeholder="Email"
                value={email.email}
                onChange={(e) => handleEmailChange(index, "email", e.target.value)}
                className="p-1 rounded bg-gray-200 text-black w-full text-sm"
              />
              <input
                type="text"
                placeholder="Nombre"
                value={email.nombre}
                onChange={(e) => handleEmailChange(index, "nombre", e.target.value)}
                className="p-1 rounded bg-gray-200 text-black w-full text-sm ml-2"
              />
              <input
                type="text"
                placeholder="Cargo"
                value={email.cargo}
                onChange={(e) => handleEmailChange(index, "cargo", e.target.value)}
                className="p-1 rounded bg-gray-200 text-black w-full text-sm ml-2"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveEmail(index)}
                  className="ml-2 p-1 bg-red-500 hover:bg-red-600 rounded text-white text-sm flex items-center"
                >
                  <FaTrash />
                </button>
              )}
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
          <label className="block mb-1">Nombre Fantasía:</label>
          <input
            type="text"
            value={nombre_fantasia}
            onChange={(e) => setNombreFantasia(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full text-sm"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Giro:</label>
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
            placeholder="Seleccione giro"
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
        <div className="mb-2">
          <label className="block mb-1">Email Factura:</label>
          <input
            type="email"
            value={email_factura}
            onChange={(e) => setEmailFactura(e.target.value)}
            className="p-1 rounded bg-gray-200 text-black w-full text-sm"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded flex items-center"
          >
            <FaTimes className="mr-1" />
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center"
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

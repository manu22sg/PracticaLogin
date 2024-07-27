import React, { useState, useEffect } from "react";
import { createCompany, listGiros } from "../services/company.services";
import Swal from "sweetalert2";
import Select from "react-select";
import AsyncSelect from "react-select/async";

const CreateCompanyForm = () => {
  const [rut, setRut] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [nombreFantasia, setNombreFantasia] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [giroCodigo, setGiroCodigo] = useState(null);
  const [emails, setEmails] = useState([""]);
  const [emailFactura, setEmailFactura] = useState("");

  useEffect(() => {
    // Puedes cargar giros aquí si es necesario
  }, []);

  const handleEmailChange = (index, event) => {
    const newEmails = emails.slice();
    newEmails[index] = event.target.value;
    setEmails(newEmails);
  };

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !rut ||
      !razonSocial ||
      !direccion ||
      !comuna ||
      !ciudad ||
      !telefono ||
      !giroCodigo ||
      !emailFactura ||
      emails.length === 0 ||
      !emails[0]
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
        razon_social: razonSocial,
        nombre_fantasia: nombreFantasia,
        direccion,
        comuna,
        ciudad,
        telefono,
        giro_codigo: giroCodigo,
        email_factura: emailFactura,
        emails,
      });
      Swal.fire({
        icon: "success",
        title: "¡Empresa creada!",
        text: "Empresa creada exitosamente",
      });
      setRut("");
      setRazonSocial("");
      setNombreFantasia("");
      setDireccion("");
      setComuna("");
      setCiudad("");
      setTelefono("");
      setGiroCodigo(null);
      setEmailFactura("");
      setEmails([""]);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al crear la empresa",
      });
    }
  };

  // Función para cargar giros
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

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white text-black rounded-lg shadow-md max-w-md mx-auto"
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
        <label className="block text-black">Razón Social:</label>
        <input
          type="text"
          value={razonSocial}
          onChange={(e) => setRazonSocial(e.target.value)}
          className="p-2 rounded bg-gray-200 text-black w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black">Nombre Fantasía:</label>
        <input
          type="text"
          value={nombreFantasia}
          onChange={(e) => setNombreFantasia(e.target.value)}
          className="p-2 rounded bg-gray-200 text-black w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-black">Email de Facturas:</label>
        <input
          type="email"
          value={emailFactura}
          onChange={(e) => setEmailFactura(e.target.value)}
          className="p-2 rounded bg-gray-200 text-black w-full"
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
      <div className="mb-4">
        <label className="block text-black">Buscar Giro:</label>
        <AsyncSelect
          cacheOptions
          loadOptions={loadGiros}
          onChange={(selectedOption) =>
            setGiroCodigo(selectedOption ? selectedOption.value : null)
          }
          maxMenuHeight={150}
          isClearable={true}
          className="basic-single"
          classNamePrefix="select"
        />
      </div>
      <div className="mb-4">
        <label className="block text-black">Emails:</label>
        {emails.map((email, index) => (
          <div key={index} className="mb-2">
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(index, e)}
              className="p-2 rounded bg-gray-200 text-black w-full"
              required={index === 0} // El primer correo es obligatorio
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addEmailField}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Agregar otro email
        </button>
      </div>
      <button type="submit" className="p-2 bg-green-500 text-white rounded">
        Crear Compañía
      </button>
    </form>
  );
};

export default CreateCompanyForm;

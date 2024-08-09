import React, { useState } from "react";
import { createCompany, listGiros } from "../services/company.services";
import { getRegiones, getProvincias, getComunas } from "../services/data.services";
import Swal from "sweetalert2";
import AsyncSelect from "react-select/async";

const CreateCompanyForm = () => {
  const [rut, setRut] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [nombreFantasia, setNombreFantasia] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [giroCodigo, setGiroCodigo] = useState(null);
  const [region, setRegion] = useState(null);
  const [provincia, setProvincia] = useState(null);
  const [comuna, setComuna] = useState(null);
  const [emails, setEmails] = useState([{ email: "", nombre: "", cargo: "" }]);
  const [emailFactura, setEmailFactura] = useState("");

  const handleRegionChange = async (selectedOption) => {
    setRegion(selectedOption);
    setProvincia(null);
    setComuna(null);
  };

  const handleProvinciaChange = async (selectedOption) => {
    setProvincia(selectedOption);
    setComuna(null);
  };

  const handleComunaChange = (selectedOption) => {
    setComuna(selectedOption);
  };

  const handleEmailChange = (index, event) => {
    const { name, value } = event.target;
    const newEmails = [...emails];
    newEmails[index][name] = value;
    setEmails(newEmails);
  };

  const formatRut = (value) => {
    // Eliminar caracteres no numéricos
    const cleaned = value.replace(/\D/g, "");
    
    // Añadir el guion antes del último dígito
    if (cleaned.length > 1) {
      return cleaned.slice(0, -1) + "-" + cleaned.slice(-1);
    }
    
    return cleaned;
  };

  const handleChangeRut = (e) => {
    const formattedRut = formatRut(e.target.value);
    setRut(formattedRut);
  };

  const addEmailField = () => {
    setEmails([...emails, { email: "", nombre: "", cargo: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
if ( !rut || !razonSocial || !emailFactura || !direccion ||
   !telefono || !giroCodigo || !emails.every(email => email.email && email.nombre && email.cargo)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes completar todos los campos obligatorios",
      });
      return;
}   
    
    try {
      await createCompany({
        rut,
        razon_social: razonSocial,
        nombre_fantasia: nombreFantasia,
        email_factura: emailFactura,
        direccion,
        region: region ? region.label : null,
        provincia: provincia ? provincia.label : null,
        comuna: comuna ? comuna.label : null,
        telefono,
        giro_codigo: giroCodigo,
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
      setTelefono("");
      setGiroCodigo(null);
      setEmailFactura("");
      setEmails([{ email: "", nombre: "", cargo: "" }]);
      setRegion(null);
      setProvincia(null);
      setComuna(null);
      setGiroCodigo(null);
    } catch (error) {
      let errorMessage = "Error al registrar a la empresa";
      if(error.response.status===410){
        errorMessage = "El rut ya está registrado";
      } else if (error.response.status === 409) {
        errorMessage = "El correo electronico ya está registrado";
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
      
    }
  };

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
      Swal.fire("Error", "Error al cargar los giros", "error");
      return [];
    }
  };

  const loadRegiones = async (inputValue) => {
    try {
      const response = await getRegiones();
      return response.data
        .filter((region) => region.str_descripcion.toLowerCase().includes(inputValue.toLowerCase()))
        .map((region) => ({
          value: region.id_re,
          label: region.str_descripcion,
        }));
    } catch (error) {
      console.error("Error cargando regiones:", error);
      return [];
    }
  };

  const loadProvincias = async (regionId) => {
    try {
      const response = await getProvincias(regionId);
      return response.data.map((provincia) => ({
        value: provincia.id_pr,
        label: provincia.str_descripcion,
      }));
    } catch (error) {
      console.error("Error cargando provincias:", error);
      return [];
    }
  };

  const loadComunas = async (provinciaId) => {
    try {
      const response = await getComunas(provinciaId);
      return response.data.map((comuna) => ({
        value: comuna.id_co,
        label: comuna.str_descripcion,
      }));
    } catch (error) {
      console.error("Error cargando comunas:", error);
      return [];
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white text-black rounded-lg shadow-md max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 items-center">Crear Empresa</h2>
      <div className="mb-4">
        <label className="block text-black">Rut <span className="text-red-500"> *</span></label>
        <input
          type="text"
          value={rut}
          onChange={handleChangeRut}
          className="p-2 rounded bg-gray-200 text-black w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black">Razón Social <span className="text-red-500"> *</span></label>
        <input
          type="text"
          value={razonSocial}
          onChange={(e) => setRazonSocial(e.target.value)}
          className="p-2 rounded bg-gray-200 text-black w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black">Nombre Fantasía</label>
        <input
          type="text"
          value={nombreFantasia}
          onChange={(e) => setNombreFantasia(e.target.value)}
          className="p-2 rounded bg-gray-200 text-black w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-black">Email de Facturas <span className="text-red-500"> *</span></label>
        <input
          type="email"
          value={emailFactura}
          onChange={(e) => setEmailFactura(e.target.value)}
          className="p-2 rounded bg-gray-200 text-black w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black">Dirección <span className="text-red-500"> *</span></label>
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className="p-2 rounded bg-gray-200 text-black w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Región:</label>
        <AsyncSelect
          cacheOptions
          loadOptions={loadRegiones}
          defaultOptions
          isClearable={true}
          onChange={handleRegionChange}
          value={region ? { value: region.value, label: region.label } : null}
          placeholder="Seleccione región"
          className="w-full text-sm"
        />
      </div>
      {region && (
        <div className="mb-2">
          <label className="block mb-1">Provincia:</label>
          <AsyncSelect
            cacheOptions
            loadOptions={() => loadProvincias(region.value)}
            defaultOptions
            isClearable={true}
            onChange={handleProvinciaChange}
            value={provincia ? { value: provincia.value, label: provincia.label } : null}
            placeholder="Seleccione provincia"
            className="w-full text-sm"
          />
        </div>
      )}
      {provincia && (
        <div className="mb-2">
          <label className="block mb-1">Comuna:</label>
          <AsyncSelect
            cacheOptions
            loadOptions={() => loadComunas(provincia.value)}
            defaultOptions
            isClearable={true}
            onChange={handleComunaChange}
            value={comuna ? { value: comuna.value, label: comuna.label } : null}
            placeholder="Seleccione comuna"
            className="w-full text-sm"
          />
        </div>
      )}
      <div className="mb-4">
        <label className="block text-black">Teléfono <span className="text-red-500"> *</span></label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="p-2 rounded bg-gray-200 text-black w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Giro <span className="text-red-500"> *</span></label>
        <AsyncSelect
          cacheOptions
          loadOptions={loadGiros}
          onChange={(selectedOption) => setGiroCodigo(selectedOption ? selectedOption.value : null)}
          defaultOptions
          maxMenuHeight={150}
          isClearable={true}
          className="w-full text-sm"
          placeholder="Seleccione giro"
          classNamePrefix="select"
        />
      </div>
      <div className="mb-4">
        <label className="block text-black">Emails de Contacto <span className="text-red-500"> *</span></label>
        {emails.map((email, index) => (
          <div key={index} className="flex flex-col mb-2">
            <input
              type="email"
              name="email"
              value={email.email}
              onChange={(e) => handleEmailChange(index, e)}
              className="p-2 rounded bg-gray-200 text-black mb-1"
              placeholder="Email"
              required
            />
            <input
              type="text"
              name="nombre"
              value={email.nombre}
              onChange={(e) => handleEmailChange(index, e)}
              className="p-2 rounded bg-gray-200 text-black mb-1"
              placeholder="Nombre"
              required
            />
            <input
              type="text"
              name="cargo"
              value={email.cargo}
              onChange={(e) => handleEmailChange(index, e)}
              className="p-2 rounded bg-gray-200 text-black"
              placeholder="Cargo"
              required
            />
          </div>
        ))}
        <button type="button" onClick={addEmailField} className="mt-2 bg-blue-500 text-white p-2 rounded">Agregar Email</button>
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Crear Empresa</button>
    </form>
  );
};

export default CreateCompanyForm;

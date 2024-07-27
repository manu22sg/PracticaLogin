import React, { useState, useEffect } from "react";
import { getCompanies, deleteCompany } from "../services/company.services";
import Swal from "sweetalert2";
import EditCompanyForm from "./EditCompanyForm";
import Modal from "./Modal";
import CompanyDetails from "./CompanyDetails";
import { FaRegEdit, FaRegTrashAlt, FaExpandAlt } from "react-icons/fa";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState(""); // Estado para el campo de búsqueda
  const [filterOption, setFilterOption] = useState("rut"); // Estado para el criterio de filtro
  const [editingCompany, setEditingCompany] = useState(null);
  const [viewingCompany, setViewingCompany] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await getCompanies();
      setCompanies(response.data);
      setAllCompanies(response.data);
      console.log(response.data); // Verificar los datos recibidos
      setCompanies(response.data);
      setAllCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
  };

  const handleDelete = async (companyRut) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCompany(companyRut);
          fetchCompanies();
          Swal.fire("¡Eliminado!", "La compañía ha sido eliminada.", "success");
        } catch (error) {
          Swal.fire(
            "Error",
            "Hubo un problema al eliminar la compañía.",
            "error"
          );
        }
      }
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    let filteredCompanies = allCompanies;

    if (value !== "") {
      filteredCompanies = filteredCompanies.filter((company) => {
        if (filterOption === "giro") {
          return company.giro_descripcion
            .toLowerCase()
            .includes(value.toLowerCase());
        } else {
          return company[filterOption]
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      });
    }

    setCompanies(filteredCompanies);
  };

  const handleSave = () => {
    fetchCompanies();
    setEditingCompany(null);
  };

  const handleClose = () => {
    setEditingCompany(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-2 text-align">
        Gestión de Compañías
      </h2>
      <div className="mb-2 flex justify-center">
        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="p-2 rounded bg-gray-200 text-black w-full mr-2"
        >
          <option value="rut">RUT</option>
          <option value="comuna">Comuna</option>
          <option value="ciudad">Ciudad</option>
          <option value="giro">Descripción del Giro</option>
        </select>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={`Filtrar por ${filterOption}`}
          className="p-2 rounded bg-gray-200 text-black w-full"
        />{" "}
        {/* <button
          onClick={handleSearchChange}
          className="ml-1 p-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          Buscar
        </button>*/}
      </div>
      <table className="w-full bg-gray-100 rounded-lg overflow-hidden">
        <thead className="bg-gray-300">
          <tr>
            <th className="p-2 text-left border-b border-gray-400">RUT</th>
            <th className="p-2 text-left border-b border-gray-400">
              Razón Social
            </th>
            <th className="p-2 text-left border-b border-gray-400">Comuna</th>
            <th className="p-2 text-left border-b border-gray-400">Ciudad</th>
            <th className="p-2 text-left border-b border-gray-400">
              Codigo del Giro
            </th>
            <th className="p-2 text-right border-b border-gray-400">
              Operaciones
            </th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.rut} className="border-b border-gray-300">
              <td className="p-2 text-align">{company.rut}</td>
              <td className="p-2 text-align">{company.razon_social}</td>
              <td className="p-2 text-align text-sm">{company.comuna}</td>
              <td className="p-2 text-align text-sm">{company.ciudad}</td>
              <td className="p-2 text-align text-sm">{company.giro_codigo}</td>
              <td className="p-2 text-right">
                <div className="flex justify-end items-center space-x-2">
                  <div>
                    <button
                      onClick={() => handleEdit(company)}
                      className="mr-1 p-2 bg-transparent"
                      title="Editar"
                    >
                      <FaRegEdit className="text-blue-500" size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(company.rut)}
                      className="mr-1 p-2 bg-transparent"
                      title="Eliminar"
                    >
                      <FaRegTrashAlt className="text-red-500" size={20} />
                    </button>
                  </div>
                  <button
                    onClick={() => setViewingCompany(company)}
                    className="p-2 bg-transparent"
                    title="Ver Detalles"
                  >
                    <FaExpandAlt className="text-green-500" size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingCompany && (
        <Modal
          isOpen={!!editingCompany}
          onClose={handleClose}
          title="Editar Compañía"
        >
          <EditCompanyForm
            company={editingCompany}
            onClose={handleClose}
            onSave={handleSave}
          />
        </Modal>
      )}
      {viewingCompany && (
        <Modal
          isOpen={!!viewingCompany}
          onClose={() => setViewingCompany(null)}
        >
          <CompanyDetails
            company={viewingCompany}
            onClose={() => setViewingCompany(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default CompanyList;

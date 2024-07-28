import React, { useState, useEffect } from "react";
import { getCompanies, deleteCompany } from "../services/company.services";
import Swal from "sweetalert2";
import EditCompanyForm from "./EditCompanyForm";
import Modal from "./Modal";
import CompanyDetails from "./CompanyDetails";
import { excelCompanies } from "../services/excel.services";
import {
  FaRegEdit,
  FaRegTrashAlt,
  FaExpandAlt,
  FaFileExcel,
} from "react-icons/fa";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("rut");
  const [editingCompany, setEditingCompany] = useState(null);
  const [viewingCompany, setViewingCompany] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await getCompanies();
      setCompanies(response.data);
      setAllCompanies(response.data);
    } catch (error) {
      console.error("Error al obtener las compañias:", error);
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

  const handleExport = async () => {
    try {
      const response = await excelCompanies({
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "companies.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      setError("Error al exportar las compañías");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Gestión de Compañías</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-grow">
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="p-2 rounded bg-gray-200 text-black w-1/2 mr-2"
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
          />
        </div>
        <button
          onClick={handleExport}
          className="ml-4 p-2 bg-green-500 hover:bg-green-600 rounded text-white flex items-center"
        >
          <FaFileExcel className="mr-1" />
          Exportar Excel
        </button>
      </div>
      <table className="min-w-full bg-gray-100 rounded-lg overflow-hidden">
        <thead className="bg-gray-300">
          <tr>
            <th className="p-2 text-left border-b border-gray-400">RUT</th>
            <th className="p-2 text-left border-b border-gray-400">
              Razón Social
            </th>
            <th className="p-2 text-left border-b border-gray-400">Comuna</th>
            <th className="p-2 text-left border-b border-gray-400">Ciudad</th>
            <th className="p-2 text-left border-b border-gray-400">
              Código del Giro
            </th>
            <th className="p-2 text-right border-b border-gray-400">
              Operaciones
            </th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.rut} className="border-b border-gray-300">
              <td className="p-2">{company.rut}</td>
              <td className="p-2">{company.razon_social}</td>
              <td className="p-2 text-sm">{company.comuna}</td>
              <td className="p-2 text-sm">{company.ciudad}</td>
              <td className="p-2 text-sm">{company.giro_codigo}</td>
              <td className="p-2 text-right">
                <div className="flex justify-end items-center space-x-2">
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

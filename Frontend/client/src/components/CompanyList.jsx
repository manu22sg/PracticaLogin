import React, { useState, useEffect } from "react";
import { getCompanies, deleteCompany } from "../services/api";
import Swal from "sweetalert2";
import EditCompanyForm from "./EditCompanyForm";
import Modal from "./Modal";
import CompanyDetails from "./CompanyDetails";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]); // Estado para todas las compañías
  const [searchRut, setSearchRut] = useState("");
  const [editingCompany, setEditingCompany] = useState(null);
  const [viewingCompany, setViewingCompany] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await getCompanies();
      setCompanies(response.data);
      setAllCompanies(response.data); // Guarda todas las compañías originales
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

  const handleSearch = () => {
    if (searchRut === "") {
      setCompanies(allCompanies); // Muestra todas las compañías si no hay búsqueda
    } else {
      const filteredCompanies = allCompanies.filter((company) =>
        company.rut.includes(searchRut)
      );
      setCompanies(filteredCompanies);
    }
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
      <h2 className="text-xl font-bold mb-2 text-center">
        Gestión de Compañías
      </h2>
      <div className="mb-2 flex justify-center">
        <input
          type="text"
          value={searchRut}
          onChange={(e) => setSearchRut(e.target.value)}
          placeholder="Buscar por RUT"
          className="p-2 rounded bg-gray-200 text-black w-full"
        />
        <button
          onClick={handleSearch}
          className="ml-1 p-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          Buscar
        </button>
      </div>
      <table className="w-full bg-gray-100 rounded-lg overflow-hidden">
        <thead className="bg-gray-300">
          <tr>
            <th className="p-2 text-center border-b border-gray-400">RUT</th>
            <th className="p-2 text-center border-b border-gray-400">
              Razon Social
            </th>
            <th className="p-2 text-center border-b border-gray-400">Comuna</th>
            <th className="p-2 text-right border-b border-gray-400">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.rut} className="border-b border-gray-300">
              <td className="p-2 text-center">{company.rut}</td>
              <td className="p-2 text-center">{company.razon_social}</td>
              <td className="p-2 text-center text-sm">{company.comuna}</td>
              <td className="p-2 text-right">
                <div className="flex justify-between">
                  <div>
                    <button
                      onClick={() => handleEdit(company)}
                      className="mr-1 p-2 bg-yellow-500 hover:bg-yellow-600 rounded text-white"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(company.rut)}
                      className="mr-1 p-2 bg-red-500 hover:bg-red-600 rounded text-white"
                    >
                      Eliminar
                    </button>
                  </div>
                  <button
                    onClick={() => setViewingCompany(company)}
                    className="p-2 bg-green-500 hover:bg-green-600 rounded text-white"
                  >
                    Ver
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

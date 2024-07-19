import React, { useState, useEffect } from "react";
import EditCompanyForm from "./EditCompanyForm";
import { getCompanies, deleteCompany } from "../services/api";
import Swal from "sweetalert2";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [searchRut, setSearchRut] = useState("");
  const [editingCompany, setEditingCompany] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await getCompanies();
      setCompanies(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar las empresas",
      });
    }
  };

  const handleEdit = (companyRut) => {
    const company = companies.find((c) => c.rut === companyRut);
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
          Swal.fire("¡Eliminada!", "La empresa ha sido eliminada.", "success");
        } catch (error) {
          console.error("Error borrando empresa: ", error);
          Swal.fire(
            "Error",
            "Hubo un problema al eliminar la empresa.",
            "error"
          );
        }
      }
    });
  };

  const handleSearch = () => {
    const filteredCompanies = companies.filter((company) =>
      company.rut.includes(searchRut)
    );
    setCompanies(filteredCompanies);
  };

  return (
    <div className="p-4 bg-white text-black rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Empresas</h2>
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={searchRut}
          onChange={(e) => setSearchRut(e.target.value)}
          placeholder="Buscar por RUT"
          className="p-2 rounded bg-gray-200 text-black"
        />
        <button
          onClick={handleSearch}
          className="ml-2 p-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          Buscar
        </button>
      </div>
      <table className="w-full bg-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-300">
          <tr>
            <th className="p-2 text-center">RUT</th>
            <th className="p-2 text-center">Email</th>
            <th className="p-2 text-center">Mandante</th>
            <th className="p-2 text-center">Giro</th>
            <th className="p-2 text-center">Dirección</th>
            <th className="p-2 text-center">Comuna</th>
            <th className="p-2 text-center">Ciudad</th>
            <th className="p-2 text-center">Teléfono</th>
            <th className="p-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.rut} className="border-b border-gray-300">
              <td className="p-2 text-center">{company.rut}</td>
              <td className="p-2 text-center">{company.email}</td>
              <td className="p-2 text-center">{company.mandante}</td>
              <td className="p-2 text-center">{company.giro}</td>
              <td className="p-2 text-center">{company.direccion}</td>
              <td className="p-2 text-center">{company.comuna}</td>
              <td className="p-2 text-center">{company.ciudad}</td>
              <td className="p-2 text-center">{company.telefono}</td>
              <td className="p-2 text-right">
                <button
                  onClick={() => handleEdit(company.rut)}
                  className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded text-white"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(company.rut)}
                  className="p-2 bg-red-500 hover:bg-red-600 rounded text-white ml-2"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingCompany && (
        <EditCompanyForm
          company={editingCompany}
          onClose={() => setEditingCompany(null)}
          onSave={fetchCompanies}
        />
      )}
    </div>
  );
};

export default CompanyList;

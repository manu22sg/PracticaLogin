import React, { useEffect, useState } from "react";
import { getCompanies, deleteCompany } from "../services/api";
import EditCompanyForm from "./EditCompanyForm";
import Swal from "sweetalert2";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [editingCompany, setEditingCompany] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await getCompanies();
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies: ", error);
    }
  };

  const handleEdit = (companyEmail) => {
    const company = companies.find((c) => c.email === companyEmail);
    setEditingCompany(company);
  };

  const handleDelete = async (companyEmail) => {
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
          await deleteCompany(companyEmail);
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
      company.email.includes(searchEmail)
    );
    setCompanies(filteredCompanies);
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Empresas</h2>
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          placeholder="Buscar por Email"
          className="p-2 rounded bg-gray-700 text-white"
        />
        <button
          onClick={handleSearch}
          className="ml-2 p-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          Buscar
        </button>
      </div>
      <table className="w-full bg-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-600">
          <tr>
            <th className="p-2 text-center">Nombre</th>
            <th className="p-2 text-center">Email</th>
            <th className="p-2 text-center">Dirección</th>
            <th className="p-2 text-center">Teléfono</th>
            <th className="p-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.email} className="border-b border-gray-600">
              <td className="p-2 text-center">{company.name}</td>
              <td className="p-2 text-center">{company.email}</td>
              <td className="p-2 text-center">{company.address}</td>
              <td className="p-2 text-center">{company.phone}</td>
              <td className="p-2 text-right">
                <button
                  onClick={() => handleEdit(company.email)}
                  className="mr-2 p-2 bg-yellow-500 hover:bg-yellow-600 rounded text-white"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(company.email)}
                  className="p-2 bg-red-500 hover:bg-red-600 rounded text-white"
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

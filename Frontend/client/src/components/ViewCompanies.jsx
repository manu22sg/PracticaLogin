import React, { useEffect, useState } from "react";
import { getCompanies } from "../services/api";
import Swal from "sweetalert2";
const ViewCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");

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
        title: "Error",
        text: "Error al cargar las empresas",
      });
    }
  };

  const handleSearch = () => {
    const filteredCompanies = companies.filter((company) =>
      company.email.includes(searchEmail)
    );
    setCompanies(filteredCompanies);
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Ver Empresas</h2>
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
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.email} className="border-b border-gray-600">
              <td className="p-2 text-center">{company.name}</td>
              <td className="p-2 text-center">{company.email}</td>
              <td className="p-2 text-center">{company.address}</td>
              <td className="p-2 text-center">{company.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewCompanies;

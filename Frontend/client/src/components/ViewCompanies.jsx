import React, { useEffect, useState } from "react";
import { getCompanies } from "../services/api";
import Swal from "sweetalert2";

const ViewCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [searchRut, setSearchRut] = useState("");

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
      company.rut.includes(searchRut)
    );
    setCompanies(filteredCompanies);
  };

  return (
    <div className="p-4 bg-white text-black rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Ver Empresas</h2>
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
      <table className="w-full bg-gray-100 rounded-lg overflow-hidden">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewCompanies;

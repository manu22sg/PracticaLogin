import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/companies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies: ", error);
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
      <h2 className="text-2xl font-bold mb-4 text-center">Ver Compañías</h2>
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

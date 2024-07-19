import React, { useEffect, useState } from "react";
import { getUsers } from "../services/api";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchRut, setSearchRut] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cargar los usuarios",
      });
    }
  };

  const handleSearch = () => {
    const filteredUsers = users.filter((user) => user.rut.includes(searchRut));
    setUsers(filteredUsers);
  };

  return (
    <div className="p-4 bg-white text-black rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Ver Usuarios</h2>
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
            <th className="p-2 text-center">Nombre</th>
            <th className="p-2 text-center">Apellido Paterno</th>
            <th className="p-2 text-center">Apellido Materno</th>
            <th className="p-2 text-center">RUT</th>
            <th className="p-2 text-center">Celular</th>
            <th className="p-2 text-center">Fecha de Nacimiento</th>
            <th className="p-2 text-center">Email</th>
            <th className="p-2 text-center">Email Opcional</th>
            <th className="p-2 text-center">Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.rut} className="border-b border-gray-300">
              <td className="p-2 text-center">{user.name}</td>
              <td className="p-2 text-center">{user.apellido_paterno}</td>
              <td className="p-2 text-center">{user.apellido_materno}</td>
              <td className="p-2 text-center">{user.rut}</td>
              <td className="p-2 text-center">{user.celular}</td>
              <td className="p-2 text-center">
                {dayjs(user.fecha_nacimiento).format("DD/MM/YYYY")}
              </td>
              <td className="p-2 text-center">{user.email}</td>
              <td className="p-2 text-center">{user.email_opcional}</td>
              <td className="p-2 text-center">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewUsers;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditUserForm from "./EditUserForm"; // Importa el nuevo componente

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchRut, setSearchRut] = useState("");
  const [editingUser, setEditingUser] = useState(null); // Estado para el usuario en edición
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const handleEdit = (userRut) => {
    const user = users.find((u) => u.rut === userRut);
    setEditingUser(user); // Establece el usuario en edición
  };

  const handleDelete = async (userRut) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/api/users/${userRut}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    }
  };

  const handleSearch = () => {
    const filteredUsers = users.filter((user) => user.rut.includes(searchRut));
    setUsers(filteredUsers);
  };

  return (
    <div className="p-2 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2 text-center">Lista de Usuarios</h2>
      <div className="mb-2 flex justify-center">
        <input
          type="text"
          value={searchRut}
          onChange={(e) => setSearchRut(e.target.value)}
          placeholder="Buscar por RUT"
          className="p-1 rounded bg-gray-700 text-white"
        />
        <button
          onClick={handleSearch}
          className="ml-1 p-1 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          Buscar
        </button>
      </div>
      <table className="w-full bg-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-600">
          <tr>
            <th className="p-1 text-center">Nombre</th>
            <th className="p-1 text-center">Rut</th>
            <th className="p-1 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.rut} className="border-b border-gray-600">
              <td className="p-1 text-center">{user.name}</td>
              <td className="p-1 text-center">{user.rut}</td>
              <td className="p-1 text-right">
                <button
                  onClick={() => handleEdit(user.rut)}
                  className="mr-1 p-1 bg-yellow-500 hover:bg-yellow-600 rounded text-white"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(user.rut)}
                  className="p-1 bg-red-500 hover:bg-red-600 rounded text-white"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingUser && (
        <EditUserForm
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={fetchUsers}
        />
      )}
    </div>
  );
};

export default UserList;

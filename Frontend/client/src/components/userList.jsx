import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import EditUserForm from "./EditUserForm"; // Importa el nuevo componente
import Swal from "sweetalert2";

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
      const response = await getUsers();
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
          await deleteUser(userRut);
          fetchUsers();
          Swal.fire("¡Eliminado!", "El usuario ha sido eliminada.", "success");
        } catch (error) {
          Swal.fire(
            "Error",
            "Hubo un problema al eliminar al usuario.",
            "error"
          );
        }
      }
    });
  };

  const handleSearch = () => {
    const filteredUsers = users.filter((user) => user.rut.includes(searchRut));
    setUsers(filteredUsers);
  };

  return (
    <div className="p-2 bg-white text-black rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2 text-center">Lista de Usuarios</h2>
      <div className="mb-2 flex justify-center">
        <input
          type="text"
          value={searchRut}
          onChange={(e) => setSearchRut(e.target.value)}
          placeholder="Buscar por RUT"
          className="p-1 rounded bg-gray-200 text-black"
        />
        <button
          onClick={handleSearch}
          className="ml-1 p-1 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          Buscar
        </button>
      </div>
      <table className="w-full bg-gray-100 rounded-lg overflow-hidden">
        <thead className="bg-gray-300">
          <tr>
            <th className="p-1 text-center">Nombre</th>
            <th className="p-1 text-center">Rut</th>
            <th className="p-1 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.rut} className="border-b border-gray-300">
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

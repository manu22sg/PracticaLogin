import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../services/api";
import Swal from "sweetalert2";
import EditUserForm from "./EditUserForm";
import UserDetails from "./userDetails";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchRut, setSearchRut] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

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

  const handleEdit = (user) => {
    setEditingUser(user);
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
          Swal.fire("¡Eliminado!", "El usuario ha sido eliminado.", "success");
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
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-2 text-center">
        Gestión de Usuarios
      </h2>
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
            <th className="p-1 text-center">Correo</th>
            <th className="p-1 text-center">Rol</th>
            <th className="p-1 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.rut} className="border-b border-gray-300">
              <td className="p-1 text-center">{user.name}</td>
              <td className="p-1 text-center">{user.email}</td>
              <td className="p-1 text-center">{user.role}</td>
              <td className="p-1 text-right">
                <button
                  onClick={() => handleEdit(user)}
                  className="mr-1 p-1 bg-yellow-500 hover:bg-yellow-600 rounded text-white"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(user.rut)}
                  className="mr-1 p-1 bg-red-500 hover:bg-red-600 rounded text-white"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setViewingUser(user)}
                  className="p-1 bg-green-500 hover:bg-green-600 rounded text-white"
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <EditUserForm
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={fetchUsers}
          />
        </div>
      )}
      {viewingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <UserDetails
            user={viewingUser}
            onClose={() => setViewingUser(null)}
          />
        </div>
      )}
    </div>
  );
};

export default UserList;

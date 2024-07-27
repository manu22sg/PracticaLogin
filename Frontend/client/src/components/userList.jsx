import React, { useEffect, useState, useContext } from "react";
import { getUsers, deleteUser } from "../services/user.services";
import Swal from "sweetalert2";
import EditUserForm from "./EditUserForm";
import UserDetails from "./userDetails"; // Asegúrate de que el nombre del archivo es correcto
import { AuthContext } from "../context/Contexto";
import { FaTrashAlt, FaUserEdit, FaExpandAlt } from "react-icons/fa";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Estado para todos los usuarios
  const [searchRut, setSearchRut] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
      setAllUsers(response.data); // Guarda todos los usuarios originales
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleDelete = async (userRut) => {
    if (userRut === user.rut) {
      return Swal.fire(
        "Error",
        "No puedes eliminar tu propio usuario.",
        "error"
      );
    }
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
    if (searchRut === "") {
      setUsers(allUsers); // Muestra todos los usuarios si no hay búsqueda
    } else {
      const filteredUsers = allUsers.filter((user) =>
        user.rut.includes(searchRut)
      );
      setUsers(filteredUsers);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-2 text-align">Gestión de Usuarios</h2>
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
            <th className="p-2 text-left border-b border-gray-400">Nombre</th>
            <th className="p-2 text-left border-b border-gray-400">Rut</th>
            <th className="p-2 text-left border-b border-gray-400">Rol</th>
            <th className="p-2 text-right border-b border-gray-400">
              Operaciones
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.rut} className="border-b border-gray-300">
              <td className="p-2 text-align">{user.name}</td>
              <td className="p-2 text-align">{user.rut}</td>
              <td className="p-2 text-align">{user.role}</td>
              <td className="p-2 text-right">
                <button
                  onClick={() => handleEdit(user)}
                  className="p-2 bg-transparent"
                  title="Editar"
                >
                  <FaUserEdit className="text-blue-500 w-6 h-6" />
                </button>
                <button
                  onClick={() => handleDelete(user.rut)}
                  className="p-2 bg-transparent"
                  title="Eliminar"
                >
                  <FaTrashAlt className="text-red-500 w-6 h-6" />
                </button>
                <button
                  onClick={() => setViewingUser(user)}
                  className="p-2 bg-transparent"
                  title="Ver Detalles"
                >
                  <FaExpandAlt className="text-green-500 w-6 h-6" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-md max-w-md w-full max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 p-2 bg-gray-500 hover:bg-gray-600 rounded text-white"
            >
              X
            </button>
            <EditUserForm
              user={editingUser}
              onClose={() => setEditingUser(null)}
              onSave={fetchUsers}
            />
          </div>
        </div>
      )}
      {viewingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-md max-w-md w-full max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setViewingUser(null)}
              className="absolute top-4 right-4 p-2 bg-gray-500 hover:bg-gray-600 rounded text-white"
            >
              X
            </button>
            <UserDetails
              user={viewingUser}
              onClose={() => setViewingUser(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;

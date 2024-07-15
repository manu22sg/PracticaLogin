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
    <div>
      <h2>Lista de Usuarios</h2>
      <input
        type="text"
        value={searchRut}
        onChange={(e) => setSearchRut(e.target.value)}
        placeholder="Buscar por RUT"
      />
      <button onClick={handleSearch}>Buscar</button>
      <table className="user-table">
        <thead>
          <tr>
            <th>Nombre Apellido</th>
            <th>RUT</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.rut}>
              <td>{user.name}</td>
              <td>{user.rut}</td>
              <td>
                <button
                  onClick={() => handleEdit(user.rut)}
                  className="edit-button"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(user.rut)}
                  className="delete-button"
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

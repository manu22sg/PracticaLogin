import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchRut, setSearchRut] = useState("");

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

  const handleSearch = () => {
    const filteredUsers = users.filter((user) => user.rut.includes(searchRut));
    setUsers(filteredUsers);
  };

  return (
    <div>
      <h2>Ver Usuarios</h2>
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
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.rut}>
              <td>{user.name}</td>
              <td>{user.rut}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewUsers;

import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { getUsers, deleteUser } from "../services/user.services";
import { excelUsers } from "../services/excel.services";
import Swal from "sweetalert2";
import EditUserForm from "./EditUserForm";
import UserDetails from "./userDetails";
import { AuthContext } from "../context/Contexto";
import { FaRegTrashAlt, FaUserEdit, FaExpandAlt, FaFileExcel } from "react-icons/fa";
import DataTable from "react-data-table-component";


const UserList = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchRut, setSearchRut] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
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
      setAllUsers(response.data);
    } catch (error) {
      Swal.fire("Error", "Error al cargar los usuarios", "error");
    }
  };

  useEffect(() => {
    const filteredUsers = allUsers.filter(user =>
      user.rut.toLowerCase().includes(searchRut.toLowerCase()) ||
      user.name.toLowerCase().includes(searchRut.toLowerCase()) ||
      user.role.toLowerCase().includes(searchRut.toLowerCase())
    );
    setUsers(filteredUsers);
  }, [searchRut, allUsers]);

  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      return Swal.fire("Error", "No se han seleccionado usuarios", "error");
    }

    const includesCurrentUser = selectedRows.some(row => row.rut === user.rut);

    if (includesCurrentUser) {
      return Swal.fire("Error", "No puedes eliminar tu propio usuario", "error");
    }

    const selectedUserNames = selectedRows.map(r => r.name).join(", ");
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¡Vas a eliminar a: ${selectedUserNames}!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all(selectedRows.map(user => deleteUser(user.rut)));
          fetchUsers();
          setToggleCleared(!toggleCleared);
          Swal.fire("¡Eliminado!", "Los usuarios seleccionados han sido eliminados.", "success");
        } catch (error) {
          Swal.fire("Error", "Hubo un problema al eliminar los usuarios.", "error");
        }
      }
    });
  };

  const contextActions = useMemo(() => (
    <button
      key="delete"
      onClick={handleDelete}
      style={{ backgroundColor: 'red', color: 'white' }}
      className="p-2 rounded"
    >
      <FaRegTrashAlt className="w-5 h-5 inline mr-2" />
      Eliminar
    </button>
  ), [selectedRows, toggleCleared, user.rut]);

  const columns = [
    {
      name: "Nombre",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "Rut",
      selector: row => row.rut,
      sortable: true,
    },
    {
      name: "Rol",
      selector: row => row.role,
      sortable: true,
    },
    {
      name: "Operaciones",
      cell: row => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setEditingUser(row)}
            className="p-2 bg-transparent"
            title="Editar"
          >
            <FaUserEdit className="text-blue-500" size={20} />
          </button>
          <button
            onClick={() => setViewingUser(row)}
            className="p-2 bg-transparent"
            title="Ver Detalles"
          >
            <FaExpandAlt className="text-green-500" size={20} />
          </button>
        </div>
      ),
    },
  ];

  const handleExport = async () => {
    try {
      const response = await excelUsers();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Datos_Usuarios.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      Swal.fire("Error", "Error al exportar los usuarios", "error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
    
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          value={searchRut}
          onChange={e => setSearchRut(e.target.value)}
          placeholder="Buscar"
          className="p-2 rounded bg-gray-200 text-black w-full max-w-2xl"
        />
        <button
          onClick={handleExport}
          className="ml-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
        >
          <FaFileExcel className="w-5 h-5 inline mr-3" />
          Exportar Excel
        </button>
      </div>
      <DataTable
        title="Lista de Usuarios"
        columns={columns}
        data={users}
        selectableRows
        contextActions={contextActions}
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
        pagination
        paginationPerPage={10}  // Número de filas por página por defecto
        paginationRowsPerPageOptions={[5, 10, 15, 20]}  // Opciones para el número de filas por página
        paginationComponentOptions={{
          rowsPerPageText: 'Filas por página',
          rangeSeparatorText: 'de',
        }}
        highlightOnHover
        fixedHeader
        striped
        dense
      />
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
            <UserDetails user={viewingUser} onClose={() => setViewingUser(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;

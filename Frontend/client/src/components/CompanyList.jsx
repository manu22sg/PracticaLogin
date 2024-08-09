import React, { useEffect, useState, useMemo, useCallback } from "react";
import DataTable from "react-data-table-component";
import { getCompanies, deleteCompany } from "../services/company.services";
import { excelCompanies } from "../services/excel.services";
import Swal from "sweetalert2";
import EditCompanyForm from "./EditCompanyForm";
import CompanyDetails from "./CompanyDetails";
import { FaUserEdit, FaExpandAlt, FaFileExcel } from "react-icons/fa";


const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCompany, setEditingCompany] = useState(null);
  const [viewingCompany, setViewingCompany] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await getCompanies();
      const data = response.data || [];
      const validData = data.filter(company =>
        company &&
        company.rut &&
        company.razon_social &&
        company.direccion &&
        company.giro_codigo &&
        company.giro_descripcion
      );
      setAllCompanies(validData);
      setCompanies(validData);
    } catch (error) {
      Swal.fire("Error", "Error al cargar las compañías", "error");
    }
  };

  useEffect(() => {
    const filteredCompanies = allCompanies.filter(company =>
      (company.razon_social && company.razon_social.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.rut && company.rut.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.direccion && company.direccion.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.giro_codigo && company.giro_codigo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.giro_descripcion && company.giro_descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setCompanies(filteredCompanies);
  }, [searchTerm, allCompanies]);

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleExport = async () => {
    try {
      const response = await excelCompanies();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Datos_Empresas.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      Swal.fire("Error", "Error al exportar las empresas", "error");
    }
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      Swal.fire("Advertencia", "Selecciona al menos una empresa para eliminar.", "warning");
      return;
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
          const deletePromises = selectedRows.map(row => deleteCompany(row.rut));
          await Promise.all(deletePromises);
          const updatedCompanies = companies.filter(company => !selectedRows.some(selected => selected.rut === company.rut));
          setCompanies(updatedCompanies);
          setAllCompanies(updatedCompanies);
          setSelectedRows([]); // Limpiar selección
          setToggleCleared(!toggleCleared); // Limpia la selección en el DataTable
          Swal.fire("¡Eliminado!", "Las compañías han sido eliminadas.", "success");
        } catch (error) {
          Swal.fire("Error", "Hubo un problema al eliminar las compañías.", "error");
        }
      }
    });
  };

  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

  const contextActions = useMemo(() => {
    return (
      <button
        key="delete"
        onClick={handleDelete}
        style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
      >
        Eliminar
      </button>
    );
  }, [selectedRows, handleDelete]);

  const columns = [
    {
      name: "Rut",
      selector: row => row.rut,
      sortable: true,
    },
    {
      name: "Razón Social",
      selector: row => row.razon_social,
      sortable: true,
    },
    {
      name: "Dirección",
      selector: row => row.direccion,
      sortable: true,
    },
    {
      name: "Código del Giro",
      selector: row => row.giro_codigo,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: row => row.giro_descripcion,
      sortable: true,
      cell: row => {
        const descripcion = row.giro_descripcion;
    return (
      <div title={descripcion.length > 40 ? descripcion : null}>
        {descripcion.length > 40
          ? `${descripcion.substring(0, 40)}...`
          : descripcion}
      </div>
    )
      },
    },
    {
      name: "Operaciones",
      cell: row => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setEditingCompany(row)}
            className="p-2 bg-transparent"
            title="Editar"
          >
            <FaUserEdit className="text-blue-500" size={20} />
          </button>
          <button
            onClick={() => setViewingCompany(row)}
            className="p-2 bg-transparent"
            title="Ver Detalles"
          >
            <FaExpandAlt className="text-green-500" size={20} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <div className="mb-2 flex justify-between items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchTermChange}
          placeholder="Buscar empresa..."
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
        title="Lista de Empresas"
        columns={columns}
        data={companies}
        selectableRows
        contextActions={contextActions}
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        paginationComponentOptions={{
          rowsPerPageText: 'Filas por página',
          rangeSeparatorText: 'de',
        }}
        highlightOnHover
        fixedHeader
        striped
        dense
      />
      {editingCompany && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-md max-w-md w-full max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setEditingCompany(null)}
              className="absolute top-4 right-4 p-2 bg-gray-500 hover:bg-gray-600 rounded text-white"
            >
              X
            </button>
            <EditCompanyForm
              company={editingCompany}
              onClose={() => setEditingCompany(null)}
              onSave={fetchCompanies}
            />
          </div>
        </div>
      )}
      {viewingCompany && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-md max-w-md w-full max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setViewingCompany(null)}
              className="absolute top-4 right-4 p-2 bg-gray-500 hover:bg-gray-600 rounded text-white"
            >
              X
            </button>
            <CompanyDetails
              company={viewingCompany}
              onClose={() => setViewingCompany(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyList;
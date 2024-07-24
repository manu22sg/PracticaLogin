import React from "react";

const CompanyDetails = ({ company, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-15 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-lg">
        <h2 className="text-xl font-bold mb-2">Detalles de la Compañía</h2>
        <p>
          <strong>RUT:</strong> {company.rut}
        </p>
        <p>
          <strong>Razón Social:</strong> {company.razon_social}
        </p>
        <p>
          <strong>Nombre Fantasía:</strong> {company.nombre_fantasia}
        </p>
        <p>
          <strong>Dirección:</strong> {company.direccion}
        </p>
        <p>
          <strong>Comuna:</strong> {company.comuna}
        </p>
        <p>
          <strong>Ciudad:</strong> {company.ciudad}
        </p>
        <p>
          <strong>Teléfono:</strong> {company.telefono}
        </p>
        <p>
          <strong>Giro:</strong> {company.giro_descripcion}
        </p>
        <p>
          <strong>Emails:</strong>
          <ul>
            {company.emails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
        </p>
        <button
          onClick={onClose}
          className="mt-4 p-2 bg-red-500 hover:bg-red-600 rounded text-white"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default CompanyDetails;

import React from "react";

const CompanyDetails = ({ company, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-15 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-lg">
        <h2 className="text-xl font-bold mb-2">Detalles de la Empresa</h2>
        <p>
          <strong>Rut:</strong> {company.rut}
        </p>
        <p>
          <strong>Razón Social:</strong> {company.razon_social}
        </p>
        <p>
          <strong>Nombre Fantasía:</strong> {company.nombre_fantasia}
        </p>
        <p>
          <strong>Email de Facturas:</strong> {company.email_factura}
        </p>
        <p>
          <strong>Dirección:</strong> {company.direccion}
        </p>
        <p>
          <strong>Comuna:</strong> {company.comuna}
        </p>
        <p>
          <strong>Provincia:</strong> {company.provincia}
        </p>
        <p>
          <strong>Región:</strong> {company.region}
        </p>
        <p>
          <strong>Teléfono:</strong> {company.telefono}
        </p>
        <p>
          <strong>Giro:</strong> {company.giro_descripcion}
        </p>
        <p>
          <strong>Emails:</strong>
        </p>
        <ul>
          {company.emails.map((emailObj, index) => (
            <li key={index} className="mb-2">
              <div>
                <strong>Email {index + 1}:</strong> {emailObj.email}
              </div>
              <div>
                <strong>Nombre:</strong> {emailObj.nombre}
              </div>
              <div>
                <strong>Cargo:</strong> {emailObj.cargo}
              </div>
            </li>
          ))}
        </ul>
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
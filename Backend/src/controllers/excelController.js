import { pool } from "../utils/db.js";
import ExcelJS from "exceljs";

export const excelCompanies = async (req, res) => { // Exportamos una función asíncrona para exportar las empresas a un archivo Excel
  try { // Realizamos una consulta a la base de datos para seleccionar todas las empresas
    const [rows] = await pool.query(` 
        SELECT c.*, g.descripcion AS giro_descripcion, e.email
        FROM companies c
        LEFT JOIN giros g ON c.giro_codigo = g.codigo
        LEFT JOIN emails e ON c.id = e.company_id
      `);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "No hay empresas registradas" });
    }

    // Agrupar correos electrónicos bajo cada empresa
    const companiesMap = rows.reduce((acc, row) => {
      const {
        id,
        rut,
        razon_social,
        nombre_fantasia,
        direccion,
        comuna,
        ciudad,
        telefono,
        giro_codigo,
        giro_descripcion,
        email_factura,
        email,
      } = row;

      if (!acc[id]) {
        acc[id] = {
          id,
          rut,
          razon_social,
          nombre_fantasia,
          direccion,
          comuna,
          ciudad,
          telefono,
          giro_codigo,
          giro_descripcion,
          email_factura,
          emails: [],
        };
      }

      if (email) {
        acc[id].emails.push(email);
      }

      return acc;
    }, {});

    const companies = Object.values(companiesMap);

    // Crear el archivo Excel
    const fileBuffer = await createExcelFile(companies);

    // Enviar el archivo como respuesta
    res.setHeader("Content-Disposition", "attachment; filename=companies.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(fileBuffer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las empresas", error: error.message });
  }
};

const createExcelFile = async (companies) => { // Exportamos una función asíncrona para crear un archivo Excel con las empresas
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Datos_Empresas");

  const headers = [
    "ID",
    "RUT",
    "Razón Social",
    "Nombre Fantasía",
    "Dirección",
    "Comuna",
    "Ciudad",
    "Teléfono",
    "Giro Código",
    "Giro Descripción",
    "Email Factura",
    "Emails",
  ];

  sheet.addRow(headers); // Agregamos la fila de encabezado al archivo Excel
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
    cell.fill = { // Aplicamos un color de fondo a las celdas de la fila de encabezado
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" },
    };
  });

  sheet.columns = [ // Definimos el ancho de las columnas
    { width: 10 },
    { width: 15 },
    { width: 25 },
    { width: 25 },
    { width: 30 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 35 },
    { width: 35 },
    { width: 40 },
  ];

  companies.forEach((company) => { // Iteramos sobre cada empresa para agregarla al archivo Excel
    sheet.addRow([
      company.id,
      company.rut,
      company.razon_social,
      company.nombre_fantasia,
      company.direccion,
      company.comuna,
      company.ciudad,
      company.telefono,
      company.giro_codigo,
      company.giro_descripcion,
      company.email_factura,
      company.emails.join(", "),
    ]);
  });

  // Aplicar filtro a toda la fila de encabezado
  sheet.autoFilter = {
    from: "A1",
    to: "L1",
  };

  return await workbook.xlsx.writeBuffer(); // Retornamos el archivo Excel como un buffer
};


export const excelUsers = async (req, res) => {
  try {
    // Realizamos una consulta a la base de datos para seleccionar todos los usuarios
    const [rows] = await pool.query(`
      SELECT id, rut, name, apellido_paterno, apellido_materno, celular, fecha_nacimiento, email, email_opcional, role
      FROM users
    `);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "No hay usuarios registrados" });
    }

    // Crear el archivo Excel
    const fileBuffer = await createExcelUsers(rows);

    // Enviar el archivo como respuesta
    res.setHeader("Content-Disposition", "attachment; filename=usuarios.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(fileBuffer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los usuarios", error: error.message });
  }
};
const createExcelUsers = async (users) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Datos_Usuarios");

  const headers = [
    "ID",
    "RUT",
    "Nombre",
    "Apellido Paterno",
    "Apellido Materno",
    "Celular",
    "Fecha de Nacimiento",
    "Email",
    "Email Opcional",
    "Rol",
  ];

  sheet.addRow(headers); // Agregamos la fila de encabezado al archivo Excel
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" },
    };
  });

  sheet.columns = [ // Definimos el ancho de las columnas
    { width: 10 },
    { width: 20 },
    { width: 30 },
    { width: 30 },
    { width: 30 },
    { width: 20 },
    { width: 20 }, // Ajustar el ancho según el formato de la fecha
    { width: 30 },
    { width: 30 },
    { width: 25 },
  ];

  users.forEach((user) => {
    sheet.addRow([
      user.id,
      user.rut,
      user.name,
      user.apellido_paterno,
      user.apellido_materno,
      user.celular,
      user.fecha_nacimiento, // Directamente como objeto Date
      user.email,
      user.email_opcional || '',
      user.role,
    ]);
  });

  // Aplicar formato de fecha a la columna de Fecha de Nacimiento
  sheet.getColumn(7).numFmt = 'DD/MM/YYYY'; // Cambia el formato a DD/MM/YYYY

  // Aplicar filtro a toda la fila de encabezado
  sheet.autoFilter = {
    from: "A1",
    to: "J1",
  };

  return await workbook.xlsx.writeBuffer(); // Retornamos el archivo Excel como un buffer
};

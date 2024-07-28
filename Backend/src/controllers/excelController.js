import { pool } from "../utils/db.js";
import ExcelJS from "exceljs";

const excelCompanies = async (req, res) => {
  try {
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

const createExcelFile = async (companies) => {
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

  sheet.addRow(headers);
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" },
    };
  });

  sheet.columns = [
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

  companies.forEach((company) => {
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

  return await workbook.xlsx.writeBuffer();
};

export default excelCompanies;

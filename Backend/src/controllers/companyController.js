import { pool } from "../utils/db.js";

import { getIdByDescription, isProvinciaInRegion, isComunaInProvincia } from "../utils/dbRegionProvinciaComuna.js";

const validateHierarchy = async (region, provincia, comuna) => {
  const regionId = await getIdByDescription('region_cl', region);
  if (!regionId) throw new Error('Región no válida');

  const provinciaId = await getIdByDescription('provincia_cl', provincia);
  if (!provinciaId || !await isProvinciaInRegion(provinciaId, regionId)) {
    throw new Error('Provincia no pertenece a la región seleccionada');
  }

  const comunaId = await getIdByDescription('comuna_cl', comuna);
  if (!comunaId || !await isComunaInProvincia(comunaId, provinciaId)) {
    throw new Error('Comuna no pertenece a la provincia seleccionada');
  }

  return { regionId, provinciaId, comunaId };
};

export const createCompany = async (req, res) => {
  const { rut, razon_social, nombre_fantasia, email_factura, direccion, region, provincia, comuna, telefono, giro_codigo, emails } = req.body;

  if (!rut || !razon_social || !direccion || !telefono || !giro_codigo || !email_factura || !emails || emails.length === 0) {
    return res.status(400).json({ message: "Faltan campos por llenar" });
  }

  for (const email of emails) {
    if (!email.email || !email.nombre || !email.cargo) {
      return res.status(400).json({ message: "Cada email debe tener un nombre y un cargo" });
    }
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { regionId, provinciaId, comunaId } = await validateHierarchy(region, provincia, comuna);

    const [companyResult] = await connection.query(
      "INSERT INTO companies (rut, razon_social, nombre_fantasia, email_factura, direccion, region_id, provincia_id, comuna_id, telefono, giro_codigo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [rut, razon_social || null, nombre_fantasia || null, email_factura, direccion, regionId, provinciaId, comunaId, telefono, giro_codigo]
    );

    const companyId = companyResult.insertId;

    const emailPromises = emails.map(email => {
      return connection.query(
        "INSERT INTO emails (company_id, email, nombre, cargo) VALUES (?, ?, ?, ?)",
        [companyId, email.email, email.nombre, email.cargo]
      );
    });

    await Promise.all(emailPromises);
    await connection.commit();
    res.json({ message: "Empresa creada exitosamente" });
  } catch (error) {
    await connection.rollback();
    console.error("Error al crear empresa:", error);
    res.status(500).json({ message: "Error al crear empresa", error: error.message });
  } finally {
    connection.release();
  }
};


export const listCompanies = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.*, 
        g.descripcion AS giro_descripcion, 
        e.email,
        e.nombre AS user_nombre,   
        e.cargo AS user_cargo,      
        r.str_descripcion AS region,
        p.str_descripcion AS provincia,
        com.str_descripcion AS comuna
      FROM companies c
      LEFT JOIN giros g ON c.giro_codigo = g.codigo
      LEFT JOIN emails e ON c.id = e.company_id
      LEFT JOIN comuna_cl com ON c.comuna_id = com.id_co
      LEFT JOIN provincia_cl p ON com.id_pr = p.id_pr
      LEFT JOIN region_cl r ON p.id_re = r.id_re
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
        provincia,
        region,
        telefono,
        giro_codigo,
        giro_descripcion,
        email_factura,
        email,
        user_nombre,
        user_cargo
      } = row;

      if (!acc[id]) {
        acc[id] = {
          id,
          rut,
          razon_social,
          nombre_fantasia,
          direccion,
          comuna,
          provincia,
          region,
          telefono,
          giro_codigo,
          giro_descripcion,
          email_factura,
          emails: [] // Inicializar como array de objetos
        };
      }

      if (email) {
        acc[id].emails.push({ email, nombre: user_nombre, cargo: user_cargo });
      }

      return acc;
    }, {});

    res.json(Object.values(companiesMap));
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las empresas", error: error.message });
  }
};

export const listCompany = async (req, res) => {
  try {
    const { rut } = req.params;

    // Verificar si la empresa existe
    const [companyRows] = await pool.query(
      "SELECT * FROM companies WHERE rut = ?",
      [rut]
    );
    if (companyRows.length === 0) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    // Obtener correos electrónicos de la empresa
    const companyId = companyRows[0].id;
    const [emailRows] = await pool.query(
      "SELECT email FROM emails WHERE company_id = ?",
      [companyId]
    );

    // Construir el objeto de respuesta
    const company = {
      ...companyRows[0],
      emails: emailRows.map((row) => row.email),
    };

    res.json(company);
  } catch (error) {
    console.error('Error al obtener la empresa:', error); // Añadir un log para depuración
    res.status(500).json({ message: "Error al obtener la empresa", error: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { rut } = req.params;

    // Verificar si la empresa existe
    const [company] = await pool.query("SELECT * FROM companies WHERE rut = ?", [rut]);
    if (company.length === 0) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    // Eliminar la empresa
    const [result] = await pool.query("DELETE FROM companies WHERE rut = ?", [rut]);
    if (result.affectedRows <= 0) {
      return res.status(404).json({ message: "No se pudo eliminar la empresa" });
    }

    res.json({ message: "Empresa eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar empresa", error: error.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { rut } = req.params;
    const {
      razon_social,
      nombre_fantasia,
      direccion,
      region,
      provincia,
      comuna,
      telefono,
      giro_codigo,
      email_factura,
      emails,
    } = req.body;



    const region_id = await getIdByDescription('region_cl', region);
    const provincia_id = await getIdByDescription('provincia_cl', provincia);
    const comuna_id = await getIdByDescription('comuna_cl', comuna);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        `UPDATE companies SET 
          razon_social = IFNULL(?, razon_social), 
          nombre_fantasia = IFNULL(?, nombre_fantasia), 
          direccion = IFNULL(?, direccion), 
          region_id = IFNULL(?, region_id),
          provincia_id = IFNULL(?, provincia_id),
          comuna_id = IFNULL(?, comuna_id),
          telefono = IFNULL(?, telefono), 
          giro_codigo = IFNULL(?, giro_codigo), 
          email_factura = IFNULL(?, email_factura) 
        WHERE rut = ?`,
        [
          razon_social,
          nombre_fantasia || null,
          direccion,
          region_id,
          provincia_id,
          comuna_id,
          telefono,
          giro_codigo,
          email_factura,
          rut,
        ]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ message: "Empresa no encontrada" });
      }

      const [companyRows] = await connection.query(
        "SELECT id FROM companies WHERE rut = ?",
        [rut]
      );
      const companyId = companyRows[0].id;

      await connection.query("DELETE FROM emails WHERE company_id = ?", [companyId]);

      if (emails && emails.length > 0) {
        const emailPromises = emails.map((email) => {
          return connection.query(
            "INSERT INTO emails (company_id, email, nombre, cargo) VALUES (?, ?, ?, ?)",
            [companyId, email.email, email.nombre || null, email.cargo || null]
          );
        });

        await Promise.all(emailPromises);
      }

      await connection.commit();
      res.json({ message: "Empresa actualizada exitosamente" });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ message: "Error al actualizar empresa", error: error.message });
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar empresa", error: error.message });
  }
};


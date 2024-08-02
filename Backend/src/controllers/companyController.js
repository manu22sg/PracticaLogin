import { pool } from "../utils/db.js";

export const createCompany = async (req, res) => {
  try {
    const {
      rut,
      razon_social,
      nombre_fantasia,
      email_factura,
      direccion,
      comuna,
      ciudad,
      telefono,
      giro_codigo,
      emails, // emails ahora incluye { email, nombre, cargo }
    } = req.body;

    // Verificar que todos los campos obligatorios estén presentes
    if (
      !rut ||
      !razon_social ||
      !direccion ||
      !comuna ||
      !ciudad ||
      !telefono ||
      !giro_codigo ||
      !email_factura ||
      !emails ||
      emails.length === 0
    ) {
      return res.status(400).json({ message: "Faltan campos por llenar" });
    }

    // Verificar que cada email tenga nombre y cargo
    for (const email of emails) {
      if (!email.email || !email.nombre || !email.cargo) {
        return res.status(400).json({ message: "Cada email debe tener un nombre y un cargo" });
      }
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insertar la nueva empresa
      const [companyResult] = await connection.query(
        "INSERT INTO companies (rut, razon_social, nombre_fantasia, email_factura, direccion, comuna, ciudad, telefono, giro_codigo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          rut,
          razon_social,
          nombre_fantasia || null,
          email_factura,
          direccion,
          comuna,
          ciudad,
          telefono,
          giro_codigo,
        ]
      );

      const companyId = companyResult.insertId;

      // Insertar los correos electrónicos
      const emailPromises = emails.map((email) => {
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
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    res.status(500).json({ message: "Error al conectar a la base de datos", error: error.message });
  }
};


export const listCompanies = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, g.descripcion AS giro_descripcion, e.email, e.nombre, e.cargo
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
        nombre,
        cargo
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
          emails: []
        };
      }

      if (email) {
        acc[id].emails.push({ email, nombre, cargo }); // Agregar el correo electrónico como objeto
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
      comuna,
      ciudad,
      telefono,
      giro_codigo,
      email_factura,
      emails, // Debería ser una lista de objetos { email, nombre, cargo }
    } = req.body;

    const connection = await pool.getConnection(); // Establecer una conexión a la base de datos
    try {
      await connection.beginTransaction(); // Iniciar una transacción

      const [result] = await connection.query(
        `UPDATE companies SET 
          razon_social = IFNULL(?, razon_social), 
          nombre_fantasia = IFNULL(?, nombre_fantasia), 
          direccion = IFNULL(?, direccion), 
          comuna = IFNULL(?, comuna), 
          ciudad = IFNULL(?, ciudad), 
          telefono = IFNULL(?, telefono), 
          giro_codigo = IFNULL(?, giro_codigo), 
          email_factura = IFNULL(?, email_factura) 
        WHERE rut = ?`,
        [
          razon_social,
          nombre_fantasia || null,
          direccion,
          comuna,
          ciudad,
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

      // Eliminar correos electrónicos existentes
      await connection.query("DELETE FROM emails WHERE company_id = ?", [
        companyId,
      ]);

      // Insertar nuevos correos electrónicos
      if (emails && emails.length > 0) {
        const emailPromises = emails.map((email) => {
          return connection.query(
            "INSERT INTO emails (company_id, email, nombre, cargo) VALUES (?, ?, ?, ?)",
            [companyId, email.email, email.nombre || null, email.cargo || null]
          );
        });

        await Promise.all(emailPromises); // Esperar a que todas las promesas se resuelvan
      }

      await connection.commit(); // Confirmar la transacción
      res.json({ message: "Empresa actualizada exitosamente" });
    } catch (error) {
      await connection.rollback(); // Revertir la transacción en caso de error
      res.status(500).json({
        message: "Error al actualizar empresa",
        error: error.message,
      });
    } finally {
      connection.release(); // Liberar la conexión
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar empresa", error: error.message });
  }
};

import { pool } from "../utils/db.js";

export const createCompany = async (req, res) => { // Exportamos una función asíncrona para crear una empresa
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
      emails,
    } = req.body;

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

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [companyResult] = await connection.query( // Insertamos una nueva empresa en la base de datos
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

      const emailPromises = emails.map((email) => {
        return connection.query(
          "INSERT INTO emails (company_id, email) VALUES (?, ?)",
          [companyId, email]
        );
      });

      await Promise.all(emailPromises);

      await connection.commit();
      res.json({ message: "Empresa creada exitosamente" });
    } catch (error) {
      await connection.rollback();
      console.error("Error al crear empresa:", error);
      res
        .status(500)
        .json({ message: "Error al crear empresa", error: error.message });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    res.status(500).json({
      message: "Error al conectar a la base de datos",
      error: error.message,
    });
  }
};

export const listCompanies = async (req, res) => { // Exportamos una función asíncrona para obtener todas las empresas
  try { // Manejamos cualquier error que pueda ocurrir en la función
    const [rows] = await pool.query(`                                
      SELECT c.*, g.descripcion AS giro_descripcion, e.email
      FROM companies c
      LEFT JOIN giros g ON c.giro_codigo = g.codigo
      LEFT JOIN emails e ON c.id = e.company_id
    `); // Realizamos una consulta a la base de datos para seleccionar todas las empresas

    if (rows.length <= 0) {
      return res.status(404).json({ message: "No hay empresas registradas" });
    }

    // Agrupar correos electrónicos bajo cada empresa
    const companiesMap = rows.reduce((acc, row) => {
      // Convertir el arreglo en un mapa
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
        // Si la empresa no existe en el mapa, agregarla
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
        // Si hay un correo electrónico, agregarlo a la empresa
        acc[id].emails.push(email); // Agregar el correo electrónico a la empresa
      }

      return acc;
    }, {});

    res.json(Object.values(companiesMap)); // Convertir el mapa en un arreglo
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las empresas", error: error.message });
  }
};
export const listCompany = async (req, res) => { // Exportamos una función asíncrona para obtener una empresa por su Rut
  try {
    const { rut } = req.params;
    const [companyRows] = await pool.query( // Realizamos una consulta a la base de datos para seleccionar una empresa por su Rut
      "SELECT * FROM companies WHERE rut = ?",
      [rut]
    );
    if (companyRows.length <= 0) {
      return res.status(404).json({ message: "Empresa no encontrada" }); // Si no se encuentra la empresa, devolver un mensaje de error
    }

    const [emailRows] = await pool.query( // Realizamos una consulta a la base de datos para seleccionar los correos electrónicos de la empresa
      "SELECT email FROM emails WHERE company_id = ?",
      [companyRows[0].id]
    );
    const company = {
      ...companyRows[0],
      emails: emailRows.map((row) => row.email), // Mapear los correos electrónicos
    };

    res.json(company);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la empresa", error: error.message }); // Si ocurre un error, devolver un mensaje de error
  }
};

export const deleteCompany = async (req, res) => { // Exportamos una función asíncrona para eliminar una empresa por su Rut
  try {
    const { rut } = req.params;
    const [result] = await pool.query("DELETE FROM companies WHERE rut = ?", [
      rut,
    ]);
    if (result.affectedRows <= 0) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }
    res.json({ message: "Empresa eliminada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar empresa", error: error.message });
  }
};

export const updateCompany = async (req, res) => { // Exportamos una función asíncrona para actualizar una empresa por su Rut
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
      emails,
    } = req.body;

    const connection = await pool.getConnection(); // Establecer una conexión a la base de datos
    try {
      await connection.beginTransaction(); // Iniciar una transacción

      const [result] = await connection.query( // Actualizar la empresa especificada por el Rut
        "UPDATE companies SET razon_social = IFNULL(?, razon_social), nombre_fantasia = IFNULL(?, nombre_fantasia), direccion = IFNULL(?, direccion), comuna = IFNULL(?, comuna), ciudad = IFNULL(?, ciudad), telefono = IFNULL(?, telefono), giro_codigo = IFNULL(?, giro_codigo), email_factura= IFNULL(?, email_factura) WHERE rut = ?",
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

      if (result.affectedRows === 0) { // Si no se encuentra la empresa, devolver un mensaje de error
        await connection.rollback();
        return res.status(404).json({ message: "Empresa no encontrada" });
      }

      const [companyRows] = await connection.query(
        "SELECT id FROM companies WHERE rut = ?",
        [rut]
      );
      const companyId = companyRows[0].id;

      await connection.query("DELETE FROM emails WHERE company_id = ?", [
        companyId,
      ]);

      if (emails && emails.length > 0) {
        const emailPromises = emails.map((email) => {
          return connection.query(
            "INSERT INTO emails (company_id, email) VALUES (?, ?)", // Insertar los correos electrónicos de la empresa
            [companyId, email]
          );
        });

        await Promise.all(emailPromises); // Esperar a que todas las promesas se resuelvan
      }

      await connection.commit(); // Confirmar la transacción
      res.json({ message: "Empresa actualizada exitosamente" }); // Devolver un mensaje de éxito
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
    res
      .status(500)
      .json({ message: "Error al actualizar empresa", error: error.message });
  }
};

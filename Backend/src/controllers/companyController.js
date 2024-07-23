import { pool } from "../utils/db.js";

export const createCompany = async (req, res) => {
  try {
    const {
      rut,
      razon_social,
      nombre_fantasia,
      direccion,
      comuna,
      ciudad,
      telefono,
      giro_codigo,
      emails,
    } = req.body;

    console.log("Datos recibidos:", req.body);

    if (
      !rut ||
      !razon_social ||
      !direccion ||
      !comuna ||
      !ciudad ||
      !telefono ||
      !giro_codigo ||
      !emails ||
      emails.length === 0
    ) {
      return res.status(400).json({ message: "Faltan campos por llenar" });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [companyResult] = await connection.query(
        "INSERT INTO companies (rut, razon_social, nombre_fantasia, direccion, comuna, ciudad, telefono, giro_codigo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          rut,
          razon_social,
          nombre_fantasia || null,
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

export const listCompanies = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM companies");
    if (rows.length <= 0) {
      return res.status(404).json({ message: "No hay empresas registradas" });
    }
    res.json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las empresas", error: error.message });
  }
};

export const listCompany = async (req, res) => {
  try {
    const { rut } = req.params;
    const [companyRows] = await pool.query(
      "SELECT * FROM companies WHERE rut = ?",
      [rut]
    );
    if (companyRows.length <= 0) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    const [emailRows] = await pool.query(
      "SELECT email FROM emails WHERE company_id = ?",
      [companyRows[0].id]
    );
    const company = {
      ...companyRows[0],
      emails: emailRows.map((row) => row.email),
    };

    res.json(company);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la empresa", error: error.message });
  }
};

export const deleteCompany = async (req, res) => {
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
      emails,
    } = req.body;

    await pool.getConnection(async (err, connection) => {
      if (err) throw err;

      try {
        await connection.beginTransaction();

        const [result] = await connection.query(
          "UPDATE companies SET razon_social = IFNULL(?, razon_social), nombre_fantasia = IFNULL(?, nombre_fantasia), direccion = IFNULL(?, direccion), comuna = IFNULL(?, comuna), ciudad = IFNULL(?, ciudad), telefono = IFNULL(?, telefono), giro_codigo = IFNULL(?, giro_codigo) WHERE rut = ?",
          [
            razon_social,
            nombre_fantasia || null,
            direccion,
            comuna,
            ciudad,
            telefono,
            giro_codigo,
            rut,
          ]
        );

        if (result.affectedRows === 0) {
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
              "INSERT INTO emails (company_id, email) VALUES (?, ?)",
              [companyId, email]
            );
          });

          await Promise.all(emailPromises);
        }

        await connection.commit();
        res.json({ message: "Empresa actualizada exitosamente" });
      } catch (error) {
        await connection.rollback();
        res.status(500).json({
          message: "Error al actualizar empresa",
          error: error.message,
        });
      } finally {
        connection.release();
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar empresa", error: error.message });
  }
};

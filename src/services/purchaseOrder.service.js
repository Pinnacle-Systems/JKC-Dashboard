import { getConnection } from "../constants/db.connection.js";
import oracledb from "oracledb";

export async function getLoadPurchaseData(req, res) {
  let connection;

  try {
    // 1️⃣ Get DB Connection
    connection = await getConnection();

    if (!connection) {
      return res.status(500).json({
        statusCode: 1,
        message: "Database connection not available",
      });
    }

    // 2️⃣ Call Stored Procedure
    await connection.execute(`
      BEGIN
      LOAD_COLOUR_STORE_DATA();
      END;
    `);

    // 6️⃣ Send Response
    return res.json({
      statusCode: 0,
      data: "Purchase data loaded successfully",
    });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    // 7️⃣ Close Connection
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getSupplierPOS(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear } = req.query;

    const result = await connection.execute(
      `
SELECT *
FROM (
    SELECT 
        SUPPLIER,
        UNITNAME,
        SUM(QTY) AS ITEMQTY, 
        SUM(AMOUNT) AS TOTALAMOUNTVALUE
    FROM COLOUR_STORE_PO
    WHERE APPROVALSTATUS = 'APPROVED'
      AND FINYR = :FINYEAR
    GROUP BY SUPPLIER, UNITNAME
    ORDER BY ITEMQTY DESC
)
WHERE ROWNUM <= 10`,
      { FINYEAR: finyear },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );
    const data = result.rows.map((item) => ({
      supplier: item.SUPPLIER,
      qty: item.ITEMQTY,
      amountValue: item.TOTALAMOUNTVALUE,
      unit: item.UNITNAME,
    }));

    return res.json({ statusCode: 0, data });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getSupplierPOSMonth(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear, month } = req.query;
    const monthOnly = month.split(" ")[0].toUpperCase();
    const result = await connection.execute(
      `
SELECT *
FROM (
    SELECT 
        SUPPLIER,
        UNITNAME,
        SUM(QTY) AS ITEMQTY, 
        SUM(AMOUNT) AS TOTALAMOUNTVALUE
    FROM COLOUR_STORE_PO
    WHERE APPROVALSTATUS = 'APPROVED'
      AND FINYR = :FINYEAR
      AND TRIM(MONTHCHAR) = :MONTHCHAR
    GROUP BY SUPPLIER, UNITNAME
    ORDER BY ITEMQTY DESC
)
WHERE ROWNUM <= 10`,
      { FINYEAR: finyear, MONTHCHAR: monthOnly },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );
    const data = result.rows.map((item) => ({
      supplier: item.SUPPLIER,
      qty: item.ITEMQTY,
      amountValue: item.TOTALAMOUNTVALUE,
      unit: item.UNITNAME,
    }));

    return res.json({ statusCode: 0, data });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getSupplierByName(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    let { finyear, supplier } = req.query;
    if (supplier === null || supplier === "" || supplier === undefined) {
      supplier = "ALL";
    }
    const result = await connection.execute(
      `SELECT DISTINCT DOCID AS PONO,
        TO_CHAR(DOCDATE, 'DD/MM/YYYY') AS PODATE,
                SUPPLIER,
                ITEMNAME,
                UNITNAME,
                QTY,
                RATE,
                AMOUNT,
                APPROVALSTATUS
                
FROM COLOUR_STORE_PO
WHERE FINYR = :FINYR AND
APPROVALSTATUS = 'APPROVED' AND
 ( :SUPPLIER = 'ALL' OR SUPPLIER = :SUPPLIER )
ORDER BY 1,2,3,4,5,6,7,8`,
      { FINYR: finyear, SUPPLIER: supplier },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );
    const data = result.rows.map((item) => ({
      poNo: item.PONO,
      poDate: item.PODATE,
      supplier: item.SUPPLIER,
      itemName: item.ITEMNAME,
      uom: item.UNITNAME,
      qty: item.QTY,
      rate: item.RATE,
      amount: item.AMOUNT,
      approvalStatus: item.APPROVALSTATUS,
    }));

    return res.json({ statusCode: 0, data });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getSupplierList(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const result = await connection.execute(
      `SELECT DISTINCT TRIM(SUPPLIER) AS SUPPLIER
FROM COLOUR_STORE_PO
 ORDER BY TRIM(SUPPLIER)
      `,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );
    const data = result.rows.map((row) => row.SUPPLIER);
    return res.json({ statusCode: 0, data });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getRejectedPOS(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear } = req.query;

    const result = await connection.execute(
      `
SELECT 
        SUPPLIER,
        UNITNAME,
        SUM(QTY) AS ITEMQTY, 
        SUM(AMOUNT) AS TOTALAMOUNTVALUE
    FROM COLOUR_STORE_PO
    WHERE APPROVALSTATUS <> 'APPROVED'
      AND FINYR = :FINYEAR
    GROUP BY SUPPLIER, UNITNAME 
    ORDER BY SUPPLIER ASC`,
      { FINYEAR: finyear },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );
    const data = result.rows.map((item) => ({
      supplier: item.SUPPLIER,
      qty: item.ITEMQTY,
      amountValue: item.TOTALAMOUNTVALUE,
      unit: item.UNITNAME,
    }));

    return res.json({ statusCode: 0, data });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getRejectedPOSBySupplier(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    let { finyear, supplier } = req.query;
    if (supplier === null || supplier === "" || supplier === undefined) {
      supplier = "ALL";
    }
    const result = await connection.execute(
      `SELECT DOCID AS PONO, TO_CHAR(DOCDATE, 'DD/MM/YYYY') AS PODATE, SUPPLIER, ITEMNAME, UNITNAME, QTY, RATE, AMOUNT, APPROVALSTATUS
FROM COLOUR_STORE_PO
WHERE APPROVALSTATUS <> 'APPROVED' AND FINYR = :FINYR AND
 ( :SUPPLIER = 'ALL' OR SUPPLIER = :SUPPLIER )
ORDER BY 1,2,3,4,5,6,7,8`,
      { FINYR: finyear, SUPPLIER: supplier },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );
    const data = result.rows.map((item) => ({
      poNo: item.PONO,
      poDate: item.PODATE,
      supplier: item.SUPPLIER,
      itemName: item.ITEMNAME,
      uom: item.UNITNAME,
      qty: item.QTY,
      rate: item.RATE,
      amount: item.AMOUNT,
      approvalStatus: item.APPROVALSTATUS,
    }));

    return res.json({ statusCode: 0, data });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getPendingInward(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear, month } = req.query;
    const monthOnly = month.split(" ")[0].toUpperCase();
    const result = await connection.execute(
      `
      SELECT 
    A.SUPPLIER,
    SUM(A.QTY) AS ITEMQTY,
    SUM(A.AMOUNT) AS TOTALAMOUNTVALUE,
    A.UNITNAME
FROM COLOUR_STORE_PO A
WHERE A.APPROVALSTATUS = 'APPROVED'
  AND A.FINYR = :FINYEAR 
  AND TRIM(MONTHCHAR) = :MONTHCHAR
  AND NOT EXISTS (
        SELECT 1
        FROM COLOUR_STORE_INWARD B
        WHERE B.PONOID = A.DTCOLRSTOREPOID
  )
GROUP BY 
    A.SUPPLIER , UNITNAME
ORDER BY 
    A.SUPPLIER ASC`,
      { FINYEAR: finyear, MONTHCHAR: monthOnly },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );
    const data = result.rows.map((item) => ({
      supplier: item.SUPPLIER,
      qty: item.ITEMQTY,
      amountValue: item.TOTALAMOUNTVALUE,
      unit: item.UNITNAME,
    }));

    return res.json({ statusCode: 0, data });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getPendingInwardSupplierDetails(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    let { finyear, supplier } = req.query;
    if (supplier === null || supplier === "" || supplier === undefined) {
      supplier = "ALL";
    }
    const result = await connection.execute(
      `SELECT DOCID AS PONO,
        TO_CHAR(DOCDATE, 'DD/MM/YYYY') AS PODATE, SUPPLIER, ITEMNAME, UNITNAME, QTY, RATE, AMOUNT
FROM COLOUR_STORE_PO A
WHERE APPROVALSTATUS = 'APPROVED' AND
      FINYR = :FINYR AND ( :SUPPLIER = 'ALL' OR SUPPLIER = :SUPPLIER ) AND
	  NOT EXISTS (SELECT 1 FROM COLOUR_STORE_INWARD B WHERE B.PONOID = A.DTCOLRSTOREPOID)
ORDER BY 1,2,3,4,5,6,7,8`,
      { FINYR: finyear, SUPPLIER: supplier },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );
    const data = result.rows.map((item) => ({
      poNo: item.PONO,
      poDate: item.PODATE,
      supplier: item.SUPPLIER,
      itemName: item.ITEMNAME,
      uom: item.UNITNAME,
      qty: item.QTY,
      rate: item.RATE,
      amount: item.AMOUNT,
    }));

    return res.json({ statusCode: 0, data });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getLatestPurchase(req, res) {
  let connection;

  try {
    // 1️⃣ Get DB Connection
    connection = await getConnection();

    if (!connection) {
      return res.status(500).json({
        statusCode: 1,
        message: "Database connection not available",
      });
    }

    // 2️⃣ Call Stored Procedure
    await connection.execute(`
      BEGIN
      LOAD_COLOUR_STORE_DATA();
      END;
    `);

    // 4️⃣ Execute SELECT Query
    const result = await connection.execute(
      `SELECT 
    FINYR,
    SUM(QTY) AS ITEMQTY,
    SUM(AMOUNT) AS TOTALAMOUNTVALUE
FROM COLOUR_STORE_PO
WHERE APPROVALSTATUS = 'APPROVED'
  AND FINYR IN (
        SELECT FINYR
        FROM (
            SELECT DISTINCT FINYR
            FROM COLOUR_STORE_PO
            WHERE APPROVALSTATUS = 'APPROVED'
            ORDER BY FINYR DESC
        )
        WHERE ROWNUM <= 3
  )
GROUP BY FINYR
ORDER BY FINYR DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    // 5️⃣ Map Result
    const data = result.rows.map((row) => ({
      finYear: row.FINYR,
      totalAmount: row.TOTALAMOUNTVALUE,
      qty: row.ITEMQTY,
    }));

    // 6️⃣ Send Response
    return res.json({
      statusCode: 0,
      data,
    });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    // 7️⃣ Close Connection
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getMonthWisePurchase(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear } = req.query;

    const result = await connection.execute(
      `
     SELECT A.FINYR , A.MONTHCHAR, SUM(AMOUNT) AS TOTALAMOUNTVALUE
FROM COLOUR_STORE_PO A
WHERE APPROVALSTATUS = 'APPROVED' AND FINYR = :FINYEAR
GROUP BY  A.FINYR,
    A.MONTHNO,
    A.MONTHCHAR
ORDER BY CASE UPPER(TRIM(MONTHCHAR))
    WHEN 'APRIL'     THEN 1
    WHEN 'MAY'       THEN 2
    WHEN 'JUNE'      THEN 3
    WHEN 'JULY'      THEN 4
    WHEN 'AUGUST'    THEN 5
    WHEN 'SEPTEMBER' THEN 6
    WHEN 'OCTOBER'   THEN 7
    WHEN 'NOVEMBER'  THEN 8
    WHEN 'DECEMBER'  THEN 9
    WHEN 'JANUARY'   THEN 10
    WHEN 'FEBRUARY'  THEN 11
    WHEN 'MARCH'     THEN 12
END
`,
      { FINYEAR: finyear },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );
    const data = result.rows.map((item) => ({
      finYear: item.FINYR,
      month: item.MONTHCHAR,
      amountValue: item.TOTALAMOUNTVALUE,
    }));

    return res.json({ statusCode: 0, data });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

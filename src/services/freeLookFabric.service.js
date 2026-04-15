import { getConnection } from "../constants/db.connection.js";
import oracledb from "oracledb";

export async function getFabricInward(req, res) {
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

    const { finyear } = req.query;

    if (!finyear) {
      return res.status(400).json({
        statusCode: 1,
        message: "finyear is required",
      });
    }

    // 2️⃣ Call Stored Procedure
    await connection.execute(`
      BEGIN
        LOAD_FABRIC_INWARD_DATA();
      END;
    `);

    // 4️⃣ Execute SELECT Query
    const result = await connection.execute(
      `SELECT CCATEGORY,
              COUNT(*) CNT,
              SUM(QTY) QTY
       FROM FABRIC_INWARD_DATA
       WHERE FINYR = :FINYEAR
       GROUP BY CCATEGORY`,
      { FINYEAR: finyear },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // 5️⃣ Map Result
    const data = result.rows.map((row) => ({
      category: row.CCATEGORY,
      count: row.CNT,
      qty: row.QTY,
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

export async function getFabricInwardCustomer(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear, category } = req.query;

    const result = await connection.execute(
      `SELECT CUSTNAME CUSTOMER ,COUNT(*) CNT,SUM(QTY) QTY FROM FABRIC_INWARD_DATA
WHERE FINYR = :FINYEAR AND ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY )
GROUP BY CUSTNAME`,
      { FINYEAR: finyear, CCATEGORY: category },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      customer: item.CUSTOMER,
      count: item.CNT,
      qty: item.QTY,
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

export async function getFabricInwardCustomerByName(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    let { finyear, category, customer } = req.query;
    if (customer === null || customer === "" || customer === undefined) {
      customer = "ALL";
    }
    const result = await connection.execute(
      `SELECT DISTINCT DOCID AS INWNO,
        TO_CHAR(DOCDATE, 'DD/MM/YYYY') AS INWDATE,
                ORDERNO,
                CUSTNAME,
                FABNAME,
                DIA,
                UNITNAME,
                QTY
FROM FABRIC_INWARD_DATA
WHERE FINYR = :FINYR AND 
 ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY ) AND
 ( :CUSTNAME = 'ALL' OR CUSTNAME = :CUSTNAME )
ORDER BY 1,2,3,4,5,6,7,8`,
      { FINYR: finyear, CCATEGORY: category, CUSTNAME: customer },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      inwNo: item.INWNO,
      inwDate: item.INWDATE,
      orderNo: item.ORDERNO,
      custName: item.CUSTNAME,
      fabName: item.FABNAME,
      dia: item.DIA,
      uom: item.UNITNAME,
      qty: item.QTY,
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

export async function getFanInwardCust(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }
    const { category } = req.query;

    const result = await connection.execute(
      `SELECT DISTINCT CUSTNAME
FROM FABRIC_INWARD_DATA
WHERE ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY )
ORDER BY CUSTNAME
      `,
      { CCATEGORY: category },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((row) => row.CUSTNAME);

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

export async function getFabricInwardByMonth(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear, category, month } = req.query;
    const result = await connection.execute(
      `SELECT
    TRIM(MONTHCHAR) AS MONTHCHAR,
    COUNT(1) AS COUNT,
    SUM(QTY) AS QTY
FROM FABRIC_INWARD_DATA
WHERE FINYR = :FINYR
  AND ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY )
GROUP BY TRIM(MONTHCHAR)
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
END`,
      { FINYR: finyear, CCATEGORY: category },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      month: item.MONTHCHAR,
      count: item.COUNT,
      qty: item.QTY,
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

export async function getFabricInwardCusByMonth(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear, category, month } = req.query;
    const monthOnly = month.split(" ")[0].toUpperCase();
    const result = await connection.execute(
      `SELECT 
    CUSTNAME        AS CUSTOMER,
    COUNT(*)        AS CNT,
    SUM(QTY)        AS QTY
FROM FABRIC_INWARD_DATA
WHERE FINYR = :FINYR
  AND ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY )
  AND TRIM(MONTHCHAR) = :MONTHCHAR
GROUP BY CUSTNAME`,
      { FINYR: finyear, CCATEGORY: category, MONTHCHAR: monthOnly },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      customer: item.CUSTOMER,
      count: item.CNT,
      qty: item.QTY,
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

export async function getFabricInwardByQuarter(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }
    const { finyear, category } = req.query;

    const result = await connection.execute(
      `SELECT QUARTER, COUNT(1) as COUNT,SUM(QTY) as QTY
FROM FABRIC_INWARD_DATA WHERE FINYR = :FINYR AND ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY )
GROUP BY QUARTER ORDER BY
    CASE QUARTER
        WHEN 'Q1' THEN 1
        WHEN 'Q2' THEN 2
        WHEN 'Q3' THEN 3
        WHEN 'Q4' THEN 4
    END`,
      { FINYR: finyear, CCATEGORY: category },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      quarter: item.QUARTER,
      count: item.COUNT,
      qty: item.QTY,
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

export async function getFabricInwardByQuarterName(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear, category, quarter } = req.query;
    const result = await connection.execute(
      `SELECT DISTINCT
    DOCID AS INWNO,
    TO_CHAR(DOCDATE, 'DD/MM/YYYY') AS INWDATE,
    ORDERNO,
    CUSTNAME,
    FABNAME,
    DIA,
    UNITNAME,
    QTY
FROM FABRIC_INWARD_DATA
WHERE FINYR = :FINYR
  AND ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY )
  AND ( :QUARTER = 'ALL' OR QUARTER = :QUARTER )
ORDER BY 1,2,3,4,5,6,7,8`,
      { FINYR: finyear, CCATEGORY: category, QUARTER: quarter },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      inwNo: item.INWNO,
      inwDate: item.INWDATE,
      orderNo: item.ORDERNO,
      custName: item.CUSTNAME,
      fabName: item.FABNAME,
      dia: item.DIA,
      uom: item.UNITNAME,
      qty: item.QTY,
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

export async function getFabricInwardByMonthDate(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear, category, month } = req.query;
    const monthOnly = month.split(" ")[0].toUpperCase();
    const result = await connection.execute(
      `SELECT TO_CHAR(DOCDATE,'DD') AS INWDATE, 
   CUSTNAME,
   COUNT(1) AS COUNT,
       SUM(QTY)        AS QTY
FROM FABRIC_INWARD_DATA
WHERE FINYR = :FINYR AND 
      ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY ) AND 
      TRIM(MONTHCHAR) = :MONTHCHAR
GROUP BY TO_CHAR(DOCDATE,'DD'),
         CUSTNAME
ORDER BY TO_NUMBER(TO_CHAR(DOCDATE,'DD'))`,
      { FINYR: finyear, CCATEGORY: category, MONTHCHAR: monthOnly },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      inwDate: item.INWDATE,
      customer: item.CUSTNAME,
      qty: item.QTY,
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

export async function getFabricInwardState(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }
    const { finyear, category } = req.query;

    const result = await connection.execute(
      `SELECT DISTINCT CUSTSTATE,
SUM(QTY) QTY
FROM FABRIC_INWARD_DATA
  WHERE FINYR = :FINYR AND
  ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY )
GROUP BY CUSTSTATE`,
      { FINYR: finyear, CCATEGORY: category },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      state: item.CUSTSTATE,
      qty: item.QTY,
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

export async function getFabricInwardStateDetail(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }
    const { finyear, category, state } = req.query;
    const customer = req.query.customer || "ALL";
    const result = await connection.execute(
      `SELECT DISTINCT DOCID AS INWNO,
        TO_CHAR(DOCDATE, 'DD/MM/YYYY') AS INWDATE,
                ORDERNO,
                CUSTNAME,
                FABNAME,
                DIA,
                UNITNAME,
                CUSTSTATE,
                QTY
FROM FABRIC_INWARD_DATA
WHERE FINYR = :FINYR AND 
 ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY ) AND
 ( :CUSTSTATE = 'ALL' OR CUSTSTATE = :CUSTSTATE ) AND
 ( :CUSTNAME = 'ALL' OR CUSTNAME = :CUSTNAME )
ORDER BY 1,2,3,4,5,6,7,8`,
      {
        FINYR: finyear,
        CCATEGORY: category,
        CUSTSTATE: state,
        CUSTNAME: customer,
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      inwNo: item.INWNO,
      inwDate: item.INWDATE,
      orderNo: item.ORDERNO,
      custName: item.CUSTNAME,
      fabName: item.FABNAME,
      dia: item.DIA,
      uom: item.UNITNAME,
      qty: item.QTY,
      state: item.CUSTSTATE,
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

export async function getFabInwardStateDropdown(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }
    const { category } = req.query;

    const result = await connection.execute(
      `SELECT DISTINCT CUSTSTATE
FROM FABRIC_INWARD_DATA
WHERE ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY )
ORDER BY CUSTSTATE
      `,
      { CCATEGORY: category },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((row) => row.CUSTSTATE);

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

export async function getFabricInwardYearCompare(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    let { category, customer } = req.query;
    if (customer === null || customer === "" || customer === undefined) {
      customer = "ALL";
    }

    const result = await connection.execute(
      `WITH PARAM_DATA AS (
SELECT --ROW_NUMBER() OVER(PARTITION BY CUSTNAME ORDER BY CUSTNAME, FINYR DESC) AS rno,
       CUSTNAME,
       FINYR,
       NVL(SUM(QTY),0) AS QTY
FROM FABRIC_INWARD_DATA
WHERE ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY ) AND
      ( :CUSTNAME = 'ALL' OR CUSTNAME = :CUSTNAME )
GROUP BY FINYR,CUSTNAME
),
YEAR_DATA AS(
SELECT (TO_CHAR(SYSDATE,'YY')) || '-' || (TO_CHAR(SYSDATE,'YY') + 1) AS currentyear,
       (TO_CHAR(SYSDATE,'YY')-1) || '-' || (TO_CHAR(SYSDATE,'YY')) AS previousyear,
       (TO_CHAR(SYSDATE,'YY')-2) || '-' || (TO_CHAR(SYSDATE,'YY') - 1) AS beforepreviousyear
FROM DUAL
)
SELECT CUSTNAME, currentyear AS FINYR,QTY FROM YEAR_DATA A LEFT JOIN PARAM_DATA B ON B.FINYR = A.currentyear
UNION ALL
SELECT CUSTNAME, previousyear,QTY FROM YEAR_DATA A LEFT JOIN PARAM_DATA B ON B.FINYR = A.previousyear
UNION ALL
SELECT CUSTNAME, beforepreviousyear,QTY FROM YEAR_DATA A LEFT JOIN PARAM_DATA B ON B.FINYR = A.beforepreviousyear
ORDER BY CUSTNAME`,
      { CCATEGORY: category, CUSTNAME: customer },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      customer: item.CUSTNAME,
      finYear: item.FINYR,
      qty: item.QTY,
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

export async function getFabricInwardFetchData(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const result = await connection.execute(
      `BEGIN
	LOAD_FABRIC_INWARD_DATA();
END;`
    );
    return res.json({
      statusCode: 0,
      message: "Stored procedure executed successfully",
    });
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

export async function getFabricInwardQuarterComapare(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { category } = req.query;
    const customer = req.query.customer || "ALL";
    const result = await connection.execute(
      `WITH PARAM_DATA AS (
SELECT --ROW_NUMBER() OVER(PARTITION BY CUSTNAME ORDER BY CUSTNAME, FINYR DESC) AS rno,
	   CUSTNAME,
	   FINYR,
	   QUARTER,
	   NVL(SUM(QTY),0) AS QTY
FROM FABRIC_INWARD_DATA
WHERE ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY ) AND
      ( :CUSTNAME = 'ALL' OR CUSTNAME = :CUSTNAME )
GROUP BY FINYR,CUSTNAME,QUARTER
),
YEAR_DATA AS(
SELECT (TO_CHAR(SYSDATE,'YY')) || '-' || (TO_CHAR(SYSDATE,'YY') + 1) AS currentyear,
	   (TO_CHAR(SYSDATE,'YY')-1) || '-' || (TO_CHAR(SYSDATE,'YY')) AS previousyear,
       (TO_CHAR(SYSDATE,'YY')-2) || '-' || (TO_CHAR(SYSDATE,'YY') - 1) AS beforepreviousyear
FROM DUAL
)
SELECT CUSTNAME, currentyear AS FINYR, QUARTER, QTY FROM YEAR_DATA A LEFT JOIN PARAM_DATA B ON B.FINYR = A.currentyear
UNION ALL
SELECT CUSTNAME, previousyear AS FINYR, QUARTER, QTY FROM YEAR_DATA A LEFT JOIN PARAM_DATA B ON B.FINYR = A.previousyear
UNION ALL
SELECT CUSTNAME, beforepreviousyear AS FINYR, QUARTER, QTY FROM YEAR_DATA A LEFT JOIN PARAM_DATA B ON B.FINYR = A.beforepreviousyear

ORDER BY CUSTNAME,FINYR,QUARTER`,
      { CCATEGORY: category, CUSTNAME: customer },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      customer: item.CUSTNAME,
      quarter: item.QUARTER,
      qty: item.QTY,
      finYear: item.FINYR,
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

export async function getFabricInwardMonthComapare(req, res) {
  let connection;

  try {
    connection = await getConnection();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear, category, customer, quarter } = req.query;
    const result = await connection.execute(
      `SELECT 
    COUNT(1) AS COUNT,
    NVL(SUM(QTY), 0) AS QTY,
    MONTHCHAR
FROM FABRIC_INWARD_DATA
WHERE FINYR = :FINYR
  AND ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY )
  AND ( :QUARTER   = 'ALL' OR QUARTER   = :QUARTER )
  AND ( :CUSTNAME  = 'ALL' OR CUSTNAME  = :CUSTNAME )
GROUP BY MONTHCHAR`,
      {
        CCATEGORY: category,
        FINYR: finyear,
        QUARTER: quarter,
        CUSTNAME: customer,
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    console.log(result, "resultt");
    const data = result.rows.map((item) => ({
      qty: item.QTY,
      month: item.MONTHCHAR,
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

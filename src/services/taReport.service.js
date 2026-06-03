import { getConnection } from "../constants/db.connection.js";
import oracledb from "oracledb";

export async function getOrderEntryTACount(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear } = req.query;

    const sql = `
SELECT DISTINCT A.ORDERNO,A.COMPCODE  FROM TANDATABLE A
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      orderNo: po[0],
      compcode: po[1],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getOrderEntryTAMdCount(req, res) {
  const connection = await getConnection(res);
  try {
    const { filterBuyer } = req.query;

    const sql = `
SELECT X.COMPCODE,COUNT(*) ORDCNT
FROM(
SELECT A.COMPCODE,COUNT(A.ORDERNO)
FROM VW_ESTACTDATE A
WHERE A.COMPCODE= 'JKC'
GROUP BY A.COMPCODE,ORDERNO
)X
GROUP BY X.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      compcode: po[0],
      count: po[1],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getOrderEntryTACountByCompany(req, res) {
  const connection = await getConnection(res);
  try {
    const { companyName } = req.query;

    const sql = `
SELECT DISTINCT A.ORDERNO,A.COMPCODE  FROM TANDATABLE A WHERE A.COMPCODE = '${companyName}'
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      orderNo: po[0],
      compcode: po[1],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getTAReport(req, res) {
  const connection = await getConnection(res);

  try {
    const { orderNo } = req.query;

    // 1. Execute Procedure
    await connection.execute(
      `
      BEGIN
        SP_CREATE_TA_DASHBOARD_1(:ORDERNO);
      END;
      `,
      {
        ORDERNO: orderNo,
      },
    );

    // Optional if procedure inserts/updates data
    await connection.commit();

    // 2. Fetch Data
    const result = await connection.execute(
      `
      SELECT *
      FROM SP_TBL_TNA_DATA_REACT
      `,
      {},
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    return res.json({
      statusCode: 0,
      data: result.rows || [],
    });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      error: err.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

export async function getOrderEntryTAMddropdown(req, res) {
  const connection = await getConnection(res);
  try {
    const { companyName } = req.query;

    const sql = `
SELECT A.ORDERNO
FROM VW_ESTACTDATE A
WHERE A.COMPCODE='${companyName}'
GROUP BY A.ORDERNO
ORDER BY ORDERNO DESC
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      orderNo: po[0],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getTAMdReport(req, res) {
  const connection = await getConnection(res);

  try {
    const { orderNo, companyName } = req.query;

    const result = await connection.execute(
      `
       SELECT *
FROM
(
SELECT 'ACTUAL' FORMAT,YETDT AS YARN,FETDT AS FABRIC,TETDT AS TRIMS,CETDT AS CUTTING,SWDATE AS SEWING,PKDATE AS PACKING,SETDT AS SHIPMENT
FROM VW_ESTACTDATE
WHERE ORDERNO = :ORDERNO AND COMPCODE=:companyName
UNION ALL
SELECT 'COMPLETED' FORMAT,YCDATE AS YARN,FCDATE AS FABRIC,TCDATE AS TRIMS,CCDATE AS CUTTING,SWDATE AS SEWING,PKDATE AS PACKING,SCDATE AS SHIPMENT
FROM VW_ESTACTDATE
WHERE ORDERNO = :ORDERNO AND COMPCODE=:companyName
)
ORDER BY CASE FORMAT WHEN 'ACTUAL' THEN 1 WHEN 'COMPLETED' THEN 2 END
      `,
      { ORDERNO: orderNo, companyName: companyName },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    return res.json({
      statusCode: 0,
      data: result.rows || [],
    });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      error: err.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

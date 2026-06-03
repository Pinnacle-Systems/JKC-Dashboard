import oracledb from "oracledb";
import { getConnection } from "../constants/db.connection.js";

export async function getFabricStatus(req, res) {
  const connection = await getConnection(res);

  try {
    const { finyear } = req.query;

    const sql = `
SELECT A.FINYR,A.BUYERNAME,A.BUYERCODE,SUM(A.INHOUSE) INHOUSE,SUM(A.INPROGRESS) INPROGRESS FROM (
SELECT A.FINYR,A.BUYERNAME,A.BUYERCODE,
CASE WHEN A.INBAL<=0 THEN 1 ELSE 0 END INHOUSE,
CASE WHEN A.INBAL<=0 THEN 0 ELSE 1 END INPROGRESS FROM FABINHOUSE_V2 A
) A
WHERE A.FINYR = '${finyear}'
GROUP BY A.FINYR,A.BUYERNAME,A.BUYERCODE
ORDER BY 2
`;

    const result = await connection.execute(sql);

    const resp =
      result.rows?.map((row) => ({
        FINYR: row[0],
        BUYERNAME: row[1],
        BUYERCODE: row[2],
        INHOUSE: row[3],
        INPROGRESS: row[4],
      })) || [];

    return res.json({
      statusCode: 0,
      data: resp,
    });
  } catch (err) {
    console.error("Error retrieving getFabricStatus data:", err);

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
export async function getFabricStatusTable(req, res) {
  const connection = await getConnection(res);

  try {
    const { finyear, buyer, status } = req.query;

    const sql = `
SELECT A.FINYR,
       A.BUYERNAME,
       A.BUYERCODE,
       A.ORDERNO,
       A.BUYERPONO,
       A.STYLE,
       A.ORDERQTY,
       A.YPOQTY,
       A.YGRNQTY,
       A.KNITRECQTY,
       A.KNITBAL,
       A.DYERECQTY,
       A.INBAL,
          CASE WHEN A.INBAL <= 0 THEN 1 ELSE 0 END INHOUSE,
       CASE WHEN A.INBAL <= 0 THEN 0 ELSE 1 END INPROGRESS
FROM FABINHOUSE_V2 A
WHERE A.FINYR = '${finyear}'
AND ('${buyer}' = 'ALL' OR A.BUYERNAME = '${buyer}')
AND (
      '${status}' = 'ALL'
      OR ('${status}' = 'INHOUSE' AND A.INBAL <= 0)
      OR ('${status}' = 'INPROGRESS' AND A.INBAL > 0)
    )
ORDER BY A.ORDERNO
`;

    const result = await connection.execute(sql);

    const resp =
      result.rows?.map((row) => ({
        FINYR: row[0],
        BUYERNAME: row[1],
        BUYERCODE: row[2],
        ORDERNO: row[3],
        BUYERPONO: row[4],
        STYLE: row[5],
        ORDERQTY: row[6],
        YPOQTY: row[7],
        YARNQTY: row[8],
        KNITRECQTY: row[9],
        KNITBAL: row[10],
        DYERECQTY: row[11],
        INBAL: row[12],
        INHOUSE: row[13],
        INPROGRESS: row[14],
      })) || [];

    return res.json({
      statusCode: 0,
      data: resp,
    });
  } catch (err) {
    console.error("Error retrieving getFabricStatus data:", err);

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

export async function getFabricDetails(req, res) {
  const connection = await getConnection(res);

  try {
    const { orderNo } = req.query;

    const sql = `
      SELECT *
      FROM FABINHOUSE_DETAILS_V3
      WHERE ORDERNO = :ORDERNO
    `;

    const result = await connection.execute(
      sql,
      { ORDERNO: orderNo },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    return res.json({
      statusCode: 0,
      data: result.rows || [],
    });
  } catch (err) {
    console.error("Error retrieving getFabricDetails data:", err);

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

export async function getFabricPending(req, res) {
  const connection = await getConnection(res);
  const { finyear } = req.query;

  try {
    const sql = `
SELECT A.FINYR,A.BUYERNAME,A.BUYERCODE,A.ORD,A.TYPENAME,SUM(A.INHOUSE) INHOUSE,SUM(A.INPROGRESS) INPROGRESS
FROM (
SELECT A.FINYR,A.BUYERNAME,A.BUYERCODE,3 ORD,'FABRIC INHOUSE PENDING' TYPENAME,
CASE WHEN A.INBAL<=0 THEN 1 ELSE 0 END INHOUSE,
CASE WHEN A.INBAL<=0 THEN 0 ELSE 1 END INPROGRESS
FROM FABINHOUSE_V2 A
UNION ALL
SELECT A.FINYR,A.BUYERNAME,A.BUYERCODE,2 ORD,'KNITTING INHOUSE' TYPENAME,
CASE WHEN A.KNITBAL<=0 THEN 1 ELSE 0 END INHOUSE,
CASE WHEN A.KNITBAL<=0 THEN 0 ELSE 1 END INPROGRESS
FROM FABINHOUSE_V2 A
UNION ALL
SELECT A.FINYR,A.BUYERNAME,A.BUYERCODE,1 ORD,'YARN' TYPENAME,
CASE WHEN A.YBAL<=0 THEN 1 ELSE 0 END INHOUSE,
CASE WHEN A.YBAL<=0 THEN 0 ELSE 1 END INPROGRESS
FROM FABINHOUSE_V2 A
) A
WHERE A.FINYR = '${finyear}'
GROUP BY A.FINYR,A.BUYERNAME,A.BUYERCODE,A.ORD,A.TYPENAME
ORDER BY A.ORD
`;

    const result = await connection.execute(sql);

    const resp =
      result.rows?.map((row) => ({
        FINYR: row[0],
        BUYERNAME: row[1],
        BUYERCODE: row[2],
        ORD: row[3],
        TYPENAME: row[4],
        INHOUSE: row[5],
        INPROGRESS: row[6],
      })) || [];

    return res.json({
      statusCode: 0,
      data: resp,
    });
  } catch (err) {
    console.error("Error retrieving getFabricPending data:", err);

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
export async function getFabricPendingTable(req, res) {
  const connection = await getConnection(res);
  const { finyear, buyer, typeName } = req.query;

  try {
    const sql = `

SELECT A.FINYR,
       A.BUYERNAME,
       A.BUYERCODE,
       A.ORDERNO,
       A.BUYERPONO,
       A.STYLE,
       A.ORDERQTY,
       A.YPOQTY,
       A.YGRNQTY,
       A.KNITRECQTY,
       A.KNITBAL,
       A.DYERECQTY,
       A.INBAL,
       A.ORD,
       A.TYPENAME
FROM (

    SELECT A.FINYR,
           A.BUYERNAME,
           A.BUYERCODE,
           A.ORDERNO,
           A.BUYERPONO,
           A.STYLE,
           A.ORDERQTY,
           A.YPOQTY,
           A.YGRNQTY,
           A.KNITRECQTY,
           A.KNITBAL,
           A.DYERECQTY,
           A.INBAL,
           3 ORD,
           'FABRIC INHOUSE PENDING' TYPENAME
    FROM FABINHOUSE_V2 A
    WHERE CASE WHEN A.INBAL <= 0 THEN 0 ELSE 1 END = 1

    UNION ALL

    SELECT A.FINYR,
           A.BUYERNAME,
           A.BUYERCODE,
           A.ORDERNO,
           A.BUYERPONO,
           A.STYLE,
           A.ORDERQTY,
           A.YPOQTY,
           A.YGRNQTY,
           A.KNITRECQTY,
           A.KNITBAL,
           A.DYERECQTY,
           A.INBAL,
           2 ORD,
           'KNITTING INHOUSE' TYPENAME
    FROM FABINHOUSE_V2 A
    WHERE CASE WHEN A.KNITBAL <= 0 THEN 0 ELSE 1 END = 1

    UNION ALL

    SELECT A.FINYR,
           A.BUYERNAME,
           A.BUYERCODE,
           A.ORDERNO,
           A.BUYERPONO,
           A.STYLE,
           A.ORDERQTY,
           A.YPOQTY,
           A.YGRNQTY,
           A.KNITRECQTY,
           A.KNITBAL,
           A.DYERECQTY,
           A.INBAL,
           1 ORD,
           'YARN' TYPENAME
    FROM FABINHOUSE_V2 A
    WHERE CASE WHEN A.YBAL <= 0 THEN 0 ELSE 1 END = 1

) A
WHERE A.FINYR = '${finyear}'
  AND ('${buyer}' = 'ALL' OR A.BUYERCODE = '${buyer}')
  AND ('${typeName}' = 'ALL' OR A.TYPENAME = '${typeName}')
ORDER BY A.ORD, A.BUYERCODE
`;

    const result = await connection.execute(sql);

    const resp =
      result.rows?.map((row) => ({
        FINYR: row[0],
        BUYERNAME: row[1],
        BUYERCODE: row[2],
        ORDERNO: row[3],
        BUYERPONO: row[4],
        STYLE: row[5],
        ORDERQTY: row[6],
        YPOQTY: row[7],
        YARNQTY: row[8],
        KNITRECQTY: row[9],
        KNITBAL: row[10],
        DYERECQTY: row[11],
        INBAL: row[12],
        ORD: row[13],
        TYPENAME: row[14],
      })) || [];

    return res.json({
      statusCode: 0,
      data: resp,
    });
  } catch (err) {
    console.error("Error retrieving getFabricPending data:", err);

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

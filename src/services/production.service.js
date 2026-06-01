import oracledb from "oracledb";
import { getConnection } from "../constants/db.connection.js";

export async function getProduction(req, res) {
  const connection = await getConnection(res);

  try {
    const { compCode, fromDate, toDate } = req.query;

    const sql = `
SELECT 
    'CUTTING' PROCESSNAME,
    DD.COMPCODE,
    AB.LOCID STOREID,
    AA.DOCDATE,
    AB.TP QTY,
    FF.ORDERNO,
    CASE 
        WHEN FF.STYLEREF IS NULL 
        THEN FF.STYLEREFNO 
        ELSE FF.STYLEREF 
    END STYLEREFNO,
    GG.BUYERCODE,
    CC.COLORNAME
FROM CTPRODUCTION AA
JOIN CTPRODDET AB 
    ON AA.CTPRODUCTIONID = AB.CTPRODUCTIONID
JOIN GTCOLORMAST CC 
    ON CC.GTCOLORMASTID = AB.COLOR
JOIN GTCOMPMAST DD 
    ON DD.GTCOMPMASTID = AA.COMPCODE
JOIN GTLOCMAST EE 
    ON EE.GTLOCMASTID = AA.CPSTOREID
JOIN GTNORDERENTRY FF 
    ON FF.ORDERNO = AA.FILENO
JOIN GTBUYERMAST GG 
    ON GG.GTBUYERMASTID = FF.BUYER
WHERE AA.DOCDATE BETWEEN TO_DATE(:FROMDATE, 'YYYY-MM-DD') 
                     AND TO_DATE(:TODATE, 'YYYY-MM-DD')
  AND DD.COMPCODE = :COMPCODE
  AND AA.RIB = 'NO'

UNION ALL

SELECT 
    E.PROCESSNAME,
    C.COMPCODE,
    A.LOCID STOREID,
    A.PEDATE DOCDATE,
    CC.DAILYPROD QTY,
    FF.ORDERNO,
    CASE 
        WHEN FF.STYLEREF IS NULL 
        THEN FF.STYLEREFNO 
        ELSE FF.STYLEREF 
    END STYLEREFNO,
    GG.BUYERCODE,
    D.COLORNAME
FROM GTGINPROD A
JOIN GTGINPRODDET B 
    ON A.GTGINPRODID = B.GTGINPRODID
JOIN GTGINPRODSUBDET CC 
    ON CC.GTGINPRODID = A.GTGINPRODID
   AND CC.GTGINPRODDETID = B.GTGINPRODDETID
JOIN GTCOMPMAST C 
    ON C.GTCOMPMASTID = A.COMPCODE
JOIN GTCOLORMAST D 
    ON D.GTCOLORMASTID = B.COLOR
JOIN GTPROCESSMAST E 
    ON E.GTPROCESSMASTID = A.DEPARTMENT
JOIN GTNORDERENTRY FF 
    ON FF.ORDERNO = B.ORDERNO
JOIN GTBUYERMAST GG 
    ON GG.GTBUYERMASTID = FF.BUYER
WHERE A.PEDATE BETWEEN TO_DATE(:FROMDATE, 'YYYY-MM-DD') 
                   AND TO_DATE(:TODATE, 'YYYY-MM-DD')
  AND C.COMPCODE = :COMPCODE
`;

    const binds = {
      FROMDATE: fromDate,
      TODATE: toDate,
      COMPCODE: compCode,
    };

    const result = await connection.execute(sql, binds);

    const resp =
      result.rows?.map((row) => ({
        PROCESSNAME: row[0],
        COMPCODE: row[1],
        STOREID: row[2],
        DOCDATE: row[3],
        QTY: row[4],
        ORDERNO: row[5],
        STYLEREFNO: row[6],
        BUYERCODE: row[7],
        COLORNAME: row[8],
      })) || [];

    return res.json({
      statusCode: 0,
      data: resp,
    });
  } catch (err) {
    console.error("Error retrieving production data:", err);

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

export async function getUnit(req, res) {
  const connection = await getConnection(res);

  try {
    const { compCode } = req.query;

    const sql = `
SELECT DISTINCT STOREID
FROM (SELECT AB.LOCID AS STOREID
    FROM CTPRODUCTION AA 
    JOIN CTPRODDET AB 
        ON AA.CTPRODUCTIONID = AB.CTPRODUCTIONID
    JOIN GTCOMPMAST DD 
        ON DD.GTCOMPMASTID = AA.COMPCODE
    WHERE DD.COMPCODE = :COMPCODE
      AND AA.RIB = 'NO'
    UNION
    SELECT A.LOCID AS STOREID
    FROM GTGINPROD A
    JOIN GTCOMPMAST C 
        ON C.GTCOMPMASTID = A.COMPCODE
    WHERE C.COMPCODE = :COMPCODE
      ) X
ORDER BY STOREID
`;

    const binds = {
      COMPCODE: compCode,
    };

    const result = await connection.execute(sql, binds);

    const resp =
      result.rows?.map((row) => ({
        storeName: row[0],
      })) || [];

    return res.json({
      statusCode: 0,
      data: resp,
    });
  } catch (err) {
    console.error("Error retrieving production data:", err);

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

export async function getProductionEfficiency(req, res) {
  let connection;

  try {
    connection = await getConnection(res);

    const { compCode, date, selectedProcess = "ALL" } = req.query;

    const sql = `
      SELECT X.UNIT,
             SUM(X.CUTTING) CUTTING,
             SUM(X.CHECKING) CHECKING,
             SUM(X.SINGER) SINGER,
             SUM(X.POWERTABLE) POWERTABLE,
             SUM(X.SEWING) SEWING
      FROM (
          SELECT A.CPLOCID AS UNIT,
                 SUM(B.PRODQTY1) CUTTING,
                 0 CHECKING,
                 0 SINGER,
                 0 POWERTABLE,
                 0 SEWING
          FROM CTPRODUCTION A
          JOIN CTPRODDET B
            ON A.CTPRODUCTIONID = B.CTPRODUCTIONID
          JOIN GTCOMPMAST C
            ON C.GTCOMPMASTID = A.COMPCODE
          WHERE (:PROCESS = 'CUTTING' OR :PROCESS = 'ALL')
            AND A.RIB = 'NO'
            AND C.COMPCODE = :compCode
            AND A.DOCDATE = :DOCDATE
          GROUP BY A.CPLOCID

          UNION ALL

          SELECT A.LOCID AS UNIT,
                 0 CUTTING,
                 SUM(B.PRODQTY) CHECKING,
                 0 SINGER,
                 0 POWERTABLE,
                 0 SEWING
          FROM GTGINPROD A
          JOIN GTGINPRODDET B
            ON A.GTGINPRODID = B.GTGINPRODID
          JOIN GTCOMPMAST C
            ON C.GTCOMPMASTID = A.COMPCODE
          JOIN GTPROCESSMAST D
            ON A.DEPARTMENT = D.GTPROCESSMASTID
          WHERE D.PROCESSNAME = 'CHECKING'
            AND (:PROCESS = 'CHECKING' OR :PROCESS = 'ALL')
            AND C.COMPCODE = :compCode
            AND A.PEDATE = :DOCDATE
          GROUP BY A.LOCID

          UNION ALL

          SELECT A.LOCID AS UNIT,
                 0 CUTTING,
                 0 CHECKING,
                 0 SINGER,
                 0 POWERTABLE,
                 SUM(B.PRODQTY) SEWING
          FROM GTGINPROD A
          JOIN GTGINPRODDET B
            ON A.GTGINPRODID = B.GTGINPRODID
          JOIN GTPROCESSMAST D
            ON A.DEPARTMENT = D.GTPROCESSMASTID
          JOIN GTCOMPMAST C
            ON C.GTCOMPMASTID = A.COMPCODE
          WHERE D.PROCESSNAME = 'SEWING'
            AND (:PROCESS = 'SEWING' OR :PROCESS = 'ALL')
            AND C.COMPCODE = :compCode
            AND A.PEDATE = :DOCDATE
          GROUP BY A.LOCID

          UNION ALL

          SELECT A.LOCID AS UNIT,
                 0 CUTTING,
                 0 CHECKING,
                 0 SINGER,
                 SUM(B.PRODQTY) POWERTABLE,
                 0 SEWING
          FROM GTGINPROD A
          JOIN GTGINPRODDET B
            ON A.GTGINPRODID = B.GTGINPRODID
          JOIN GTPROCESSMAST D
            ON A.DEPARTMENT = D.GTPROCESSMASTID
          JOIN GTCOMPMAST C
            ON C.GTCOMPMASTID = A.COMPCODE
          WHERE D.PROCESSNAME = 'POWER TABLE'
            AND (:PROCESS = 'POWER TABLE' OR :PROCESS = 'ALL')
            AND C.COMPCODE = :compCode
            AND A.PEDATE = :DOCDATE
          GROUP BY A.LOCID

          UNION ALL

          SELECT A.LOCID AS UNIT,
                 0 CUTTING,
                 0 CHECKING,
                 SUM(B.PRODQTY) SINGER,
                 0 POWERTABLE,
                 0 SEWING
          FROM GTGINPROD A
          JOIN GTGINPRODDET B
            ON A.GTGINPRODID = B.GTGINPRODID
          JOIN GTPROCESSMAST D
            ON A.DEPARTMENT = D.GTPROCESSMASTID
          JOIN GTCOMPMAST C
            ON C.GTCOMPMASTID = A.COMPCODE
          WHERE D.PROCESSNAME = 'SINGER'
            AND (:PROCESS = 'SINGER' OR :PROCESS = 'ALL')
            AND C.COMPCODE = :compCode
            AND A.PEDATE = :DOCDATE
          GROUP BY A.LOCID
      ) X
      GROUP BY X.UNIT
      ORDER BY X.UNIT
    `;

    console.log("Incoming date:", date);

    const binds = {
      compCode: compCode,
      PROCESS: selectedProcess,
      DOCDATE: new Date(`${date}T00:00:00`),
    };

    const result = await connection.execute(sql, binds);

    const resp =
      result.rows
        ?.map((row) => ({
          UNIT: row[0],
          CUTTING: Number(row[1]),
          CHECKING: Number(row[2]),
          SINGER: Number(row[3]),
          POWERTABLE: Number(row[4]),
          SEWING: Number(row[5]),
        }))
        .filter(
          (row) =>
            row.CUTTING > 0 ||
            row.CHECKING > 0 ||
            row.SINGER > 0 ||
            row.POWERTABLE > 0 ||
            row.SEWING > 0,
        ) || [];

    return res.json({
      statusCode: 0,
      data: resp,
    });
  } catch (err) {
    console.error("Error retrieving production data:", err);

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

export async function getProductionEfficiencyEmployee(req, res) {
  let connection;

  try {
    connection = await getConnection(res);

    const { compCode, date, selectedProcess = "ALL" } = req.query;

    const sql = `
      SELECT X.UNIT,
             SUM(X.CUTTING) CUTTING,
             SUM(X.CHECKING) CHECKING,
             SUM(X.SINGER) SINGER,
             SUM(X.POWERTABLE) POWERTABLE,
             SUM(X.SEWING) SEWING
      FROM (
          SELECT A.CPLOCID AS UNIT,
(SELECT SUM(S1.nomanpower) FROM ctprodsizewisedet S1 WHERE A.CTPRODUCTIONID = S1.CTPRODUCTIONID AND B.ctproddetid = S1.ctproddetID) CUTTING,                 0 CHECKING,
                 0 SINGER,
                 0 POWERTABLE,
                 0 SEWING
          FROM CTPRODUCTION A
          JOIN CTPRODDET B
            ON A.CTPRODUCTIONID = B.CTPRODUCTIONID
          JOIN GTCOMPMAST C
            ON C.GTCOMPMASTID = A.COMPCODE
          WHERE (:PROCESS = 'CUTTING' OR :PROCESS = 'ALL')
            AND A.RIB = 'NO'
            AND C.COMPCODE = :compCode
            AND A.DOCDATE = :DOCDATE
          GROUP BY A.CPLOCID,A.CTPRODUCTIONID,B.ctproddetid

          UNION ALL

          SELECT A.LOCID AS UNIT,
                 0 CUTTING,
                SUM(B.nomanpower1) CHECKING,
                 0 SINGER,
                 0 POWERTABLE,
                 0 SEWING
          FROM GTGINPROD A
          JOIN GTGINPRODDET B
            ON A.GTGINPRODID = B.GTGINPRODID
          JOIN GTCOMPMAST C
            ON C.GTCOMPMASTID = A.COMPCODE
          JOIN GTPROCESSMAST D
            ON A.DEPARTMENT = D.GTPROCESSMASTID
          WHERE D.PROCESSNAME = 'CHECKING'
            AND (:PROCESS = 'CHECKING' OR :PROCESS = 'ALL')
            AND C.COMPCODE = :compCode
            AND A.PEDATE = :DOCDATE
          GROUP BY A.LOCID

          UNION ALL

          SELECT A.LOCID AS UNIT,
                 0 CUTTING,
                 0 CHECKING,
                 0 SINGER,
                 0 POWERTABLE,
                  SUM(B.nomanpower1) SEWING
          FROM GTGINPROD A
          JOIN GTGINPRODDET B
            ON A.GTGINPRODID = B.GTGINPRODID
          JOIN GTPROCESSMAST D
            ON A.DEPARTMENT = D.GTPROCESSMASTID
          JOIN GTCOMPMAST C
            ON C.GTCOMPMASTID = A.COMPCODE
          WHERE D.PROCESSNAME = 'SEWING'
            AND (:PROCESS = 'SEWING' OR :PROCESS = 'ALL')
            AND C.COMPCODE = :compCode
            AND A.PEDATE = :DOCDATE
          GROUP BY A.LOCID

          UNION ALL

          SELECT A.LOCID AS UNIT,
                 0 CUTTING,
                 0 CHECKING,
                 0 SINGER,
                  SUM(B.nomanpower1) POWERTABLE,
                 0 SEWING
          FROM GTGINPROD A
          JOIN GTGINPRODDET B
            ON A.GTGINPRODID = B.GTGINPRODID
          JOIN GTPROCESSMAST D
            ON A.DEPARTMENT = D.GTPROCESSMASTID
          JOIN GTCOMPMAST C
            ON C.GTCOMPMASTID = A.COMPCODE
          WHERE D.PROCESSNAME = 'POWER TABLE'
            AND (:PROCESS = 'POWER TABLE' OR :PROCESS = 'ALL')
            AND C.COMPCODE = :compCode
            AND A.PEDATE = :DOCDATE
          GROUP BY A.LOCID

          UNION ALL

          SELECT A.LOCID AS UNIT,
                 0 CUTTING,
                 0 CHECKING,
                SUM(B.nomanpower1) SINGER,
                 0 POWERTABLE,
                 0 SEWING
          FROM GTGINPROD A
          JOIN GTGINPRODDET B
            ON A.GTGINPRODID = B.GTGINPRODID
          JOIN GTPROCESSMAST D
            ON A.DEPARTMENT = D.GTPROCESSMASTID
          JOIN GTCOMPMAST C
            ON C.GTCOMPMASTID = A.COMPCODE
          WHERE D.PROCESSNAME = 'SINGER'
            AND (:PROCESS = 'SINGER' OR :PROCESS = 'ALL')
            AND C.COMPCODE = :compCode
            AND A.PEDATE = :DOCDATE
          GROUP BY A.LOCID
      ) X
      GROUP BY X.UNIT
      ORDER BY X.UNIT
    `;

    console.log("Incoming date:", date);

    const binds = {
      compCode: compCode,
      PROCESS: selectedProcess,
      DOCDATE: new Date(`${date}T00:00:00`),
    };

    const result = await connection.execute(sql, binds);

    const resp =
      result.rows
        ?.map((row) => ({
          UNIT: row[0],
          CUTTING: Number(row[1]),
          CHECKING: Number(row[2]),
          SINGER: Number(row[3]),
          POWERTABLE: Number(row[4]),
          SEWING: Number(row[5]),
        }))
        .filter(
          (row) =>
            row.CUTTING > 0 ||
            row.CHECKING > 0 ||
            row.SINGER > 0 ||
            row.POWERTABLE > 0 ||
            row.SEWING > 0,
        ) || [];

    return res.json({
      statusCode: 0,
      data: resp,
    });
  } catch (err) {
    console.error("Error retrieving production data:", err);

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

export async function getProductionEff(req, res) {
  let connection;

  try {
    connection = await getConnection(res);

    const { compCode, date, selectedProcess = "ALL" } = req.query;

    const sql = `
      SELECT X.UNIT,
            AVG(X.CUTTING) CUTTING,
             AVG(X.CHECKING) CHECKING,
             AVG(X.SINGER) SINGER,
             AVG(X.POWERTABLE) POWERTABLE,
             AVG(X.SEWING) SEWING
      FROM (
          SELECT A.CPLOCID AS UNIT,
ROUND(DECODE((B.SAM * B.PRODQTY1),0,0,(B.SAM * B.PRODQTY1)/
                 ((SELECT SUM(S1.nomanpower) FROM ctprodsizewisedet S1 WHERE A.CTPRODUCTIONID = S1.CTPRODUCTIONID AND B.ctproddetid = S1.ctproddetID) * 600)),2) AS CUTTING,      
                           0 CHECKING,
                 0 SINGER,
                 0 POWERTABLE,
                 0 SEWING
          FROM CTPRODUCTION A
          JOIN CTPRODDET B
            ON A.CTPRODUCTIONID = B.CTPRODUCTIONID
          JOIN GTCOMPMAST C
            ON C.GTCOMPMASTID = A.COMPCODE
          WHERE (:PROCESS = 'CUTTING' OR :PROCESS = 'ALL')
            AND A.RIB = 'NO'
            AND C.COMPCODE = :compCode
            AND A.DOCDATE = :DOCDATE
          

          UNION ALL

          SELECT A.LOCID AS UNIT,
                 0 CUTTING,
                ROUND(DECODE((B.SAMVAL1 * B.PRODQTY),0,0,(B.SAMVAL1 * B.PRODQTY)/(B.nomanpower1 * 600)),2) CHECKING,
                 0 SINGER,
                 0 POWERTABLE,
                 0 SEWING
          FROM GTGINPROD A
          JOIN GTGINPRODDET B
            ON A.GTGINPRODID = B.GTGINPRODID
          JOIN GTCOMPMAST C
            ON C.GTCOMPMASTID = A.COMPCODE
          JOIN GTPROCESSMAST D
            ON A.DEPARTMENT = D.GTPROCESSMASTID
          WHERE D.PROCESSNAME = 'CHECKING'
            AND (:PROCESS = 'CHECKING' OR :PROCESS = 'ALL')
            AND C.COMPCODE = :compCode
            AND A.PEDATE = :DOCDATE
          

          UNION ALL

          SELECT A.LOCID AS UNIT,
                 0 CUTTING,
                 0 CHECKING,
                 0 SINGER,
                 0 POWERTABLE,
                ROUND(DECODE((B.SAMVAL1 * B.PRODQTY),0,0,(B.SAMVAL1 * B.PRODQTY)/(B.nomanpower1 * 600)),2) SEWING
          FROM GTGINPROD A
          JOIN GTGINPRODDET B
            ON A.GTGINPRODID = B.GTGINPRODID
          JOIN GTPROCESSMAST D
            ON A.DEPARTMENT = D.GTPROCESSMASTID
          JOIN GTCOMPMAST C
            ON C.GTCOMPMASTID = A.COMPCODE
          WHERE D.PROCESSNAME = 'SEWING'
            AND (:PROCESS = 'SEWING' OR :PROCESS = 'ALL')
            AND C.COMPCODE = :compCode
            AND A.PEDATE = :DOCDATE
          

          UNION ALL

          SELECT A.LOCID AS UNIT,
                 0 CUTTING,
                 0 CHECKING,
                 0 SINGER,
                 ROUND(DECODE((B.SAMVAL1 * B.PRODQTY),0,0,(B.SAMVAL1 * B.PRODQTY)/(B.nomanpower1 * 600)),2) POWERTABLE,
                 0 SEWING
          FROM GTGINPROD A
          JOIN GTGINPRODDET B
            ON A.GTGINPRODID = B.GTGINPRODID
          JOIN GTPROCESSMAST D
            ON A.DEPARTMENT = D.GTPROCESSMASTID
          JOIN GTCOMPMAST C
            ON C.GTCOMPMASTID = A.COMPCODE
          WHERE D.PROCESSNAME = 'POWER TABLE'
            AND (:PROCESS = 'POWER TABLE' OR :PROCESS = 'ALL')
            AND C.COMPCODE = :compCode
            AND A.PEDATE = :DOCDATE
        

          UNION ALL

          SELECT A.LOCID AS UNIT,
                 0 CUTTING,
                 0 CHECKING,
                ROUND(DECODE((B.SAMVAL1 * B.PRODQTY),0,0,(B.SAMVAL1 * B.PRODQTY)/(B.nomanpower1 * 600)),2) SINGER,
                 0 POWERTABLE,
                 0 SEWING
          FROM GTGINPROD A
          JOIN GTGINPRODDET B
            ON A.GTGINPRODID = B.GTGINPRODID
          JOIN GTPROCESSMAST D
            ON A.DEPARTMENT = D.GTPROCESSMASTID
          JOIN GTCOMPMAST C
            ON C.GTCOMPMASTID = A.COMPCODE
          WHERE D.PROCESSNAME = 'SINGER'
            AND (:PROCESS = 'SINGER' OR :PROCESS = 'ALL')
            AND C.COMPCODE = :compCode
            AND A.PEDATE = :DOCDATE
         
      ) X
      GROUP BY X.UNIT
      ORDER BY X.UNIT
    `;

    console.log("Incoming date:", date);

    const binds = {
      compCode: compCode,
      PROCESS: selectedProcess,
      DOCDATE: new Date(`${date}T00:00:00`),
    };

    const result = await connection.execute(sql, binds);

    const resp =
      result.rows
        ?.map((row) => ({
          UNIT: row[0],
          CUTTING: Number(row[1]),
          CHECKING: Number(row[2]),
          SINGER: Number(row[3]),
          POWERTABLE: Number(row[4]),
          SEWING: Number(row[5]),
        }))
        .filter(
          (row) =>
            row.CUTTING > 0 ||
            row.CHECKING > 0 ||
            row.SINGER > 0 ||
            row.POWERTABLE > 0 ||
            row.SEWING > 0,
        ) || [];

    return res.json({
      statusCode: 0,
      data: resp,
    });
  } catch (err) {
    console.error("Error retrieving production data:", err);

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

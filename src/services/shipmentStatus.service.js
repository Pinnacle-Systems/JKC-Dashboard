import { getConnection } from "../constants/db.connection.js";
import oracledb from "oracledb";

//  PARENT CHART Order Entry count

export async function getShipmentCount(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear } = req.query;

    const sql = `
SELECT C.SHIPMONTH, COUNT(DISTINCT A.ORDERNO) AS ORDERNO
FROM GTNORDERENTRY A
JOIN GTNORDERSTYLECOMBODET C  ON C.GTNORDERENTRYID = A.GTNORDERENTRYID
JOIN GTFINANCIALYEAR B   ON B.GTFINANCIALYEARID = A.FINYEAR
JOIN GTCOMPMAST D  ON D.GTCOMPMASTID = A.COMPCODE
WHERE B.FINYR = '${selectedYear}' AND D.COMPCODE = 'JKC'
GROUP BY C.SHIPMONTH
ORDER BY 1
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      month: po[0],
      orderCount: po[1],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}
export async function getShipmentBuyerList(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear } = req.query;

    const sql = `
SELECT DISTINCT B.BUYERNAME FROM GTNORDERENTRY A
JOIN GTBUYERMAST B ON B.GTBUYERMASTID=A.BUYER
JOIN GTFINANCIALYEAR C ON C.GTFINANCIALYEARID=A.FINYEAR
WHERE C.FINYR = '${finYear}'
ORDER BY 1
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      buyerName: po[0],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getShipmentBuyerReport(req, res) {
  const connection = await getConnection(res);

  try {
    const {
      finYear,
      month = "ALL",
      shipmentStatus = "ALL",
      selectedBuyer = "ALL",
    } = req.query;

    const sql = `
      SELECT EE.FINYR,
             BP.BPONO,
             BP.BUYERPRICE,
             FF.CURRNAME,
             A.CURCONVVALUE,
             A.ORDERNO,
             A.ORDERDATE,
             A.USERDATE,
             B.SHIPDATE AS SHIPDATE1,
             D.BUYERNAME,
             A.STYLEREFNO,
             A.ORDERQTY,
             A.TOTPRODQTY,
             A.COLOR5,
             E.PAYTERM,
             A.AMOUNT AS INR,
             CASE
                 WHEN NVL(A.AVGBUYERRATE, 0) = 0 THEN 0
                 ELSE A.AMOUNT / A.AVGBUYERRATE
             END AS USD,
             CASE
                 WHEN COUNT(FG.ORDERNO) > 0 THEN 'SHIPPED'
                 ELSE 'NOT SHIPPED'
             END AS PRODPACK

      FROM GTNORDERENTRY A

      JOIN GTNORDERSTYLECOMBODET B
          ON B.GTNORDERENTRYID = A.GTNORDERENTRYID

      JOIN GTNORDERCOMBODET C
          ON C.GTNORDERENTRYID = A.GTNORDERENTRYID
         AND C.GTNORDERSTYLECOMBODETID =
             B.GTNORDERSTYLECOMBODETID

      JOIN GTNORDERSIZEDET CC
          ON CC.GTNORDERENTRYID = A.GTNORDERENTRYID

      JOIN GTBUYERMAST D
          ON D.GTBUYERMASTID = A.BUYER

      LEFT JOIN GTPAYTERMS E
          ON E.GTPAYTERMSID = A.PAYTERMS

      JOIN GTCOMPMAST DD
          ON DD.GTCOMPMASTID = A.COMPCODE

      JOIN GTFINANCIALYEAR EE
          ON EE.GTFINANCIALYEARID = A.FINYEAR

      LEFT JOIN GTCURRENCYMAST FF
          ON FF.GTCURRENCYMASTID = A.CURRENCY

      LEFT JOIN (
          SELECT X.ORDERNO,
                 LISTAGG(X.BPONO, ', ')
                     WITHIN GROUP (ORDER BY X.BPONO) AS BPONO,
                 LISTAGG(X.BUYERPRICE, ', ')
                     WITHIN GROUP (ORDER BY X.BPONO) AS BUYERPRICE
          FROM (
              SELECT DISTINCT
                     A1.ORDERNO,
                     B1.BPONO,
                     CC1.BUYERPRICE
              FROM GTNORDERENTRY A1
              JOIN GTNORDERSTYLECOMBODET B1
                  ON B1.GTNORDERENTRYID = A1.GTNORDERENTRYID
              JOIN GTNORDERCOMBODET C1
                  ON C1.GTNORDERENTRYID = A1.GTNORDERENTRYID
                 AND C1.GTNORDERSTYLECOMBODETID =
                     B1.GTNORDERSTYLECOMBODETID
              JOIN GTNORDERSIZEDET CC1
                  ON CC1.GTNORDERENTRYID = A1.GTNORDERENTRYID
          ) X
          GROUP BY X.ORDERNO
      ) BP
          ON BP.ORDERNO = A.ORDERNO

      LEFT JOIN (
          SELECT DISTINCT A1.ORDERNO
          FROM GTPRODPENTRY A1
      ) FG
          ON FG.ORDERNO = A.GTNORDERENTRYID

      WHERE (:selectedBuyer = 'ALL' OR D.BUYERNAME = :selectedBuyer)

        AND DD.COMPCODE = 'JKC'

        AND EE.FINYR = :finYear

        AND (:month = 'ALL' OR B.SHIPMONTH = :month)

      GROUP BY
          EE.FINYR,
          BP.BPONO,
          BP.BUYERPRICE,
          FF.CURRNAME,
          A.CURCONVVALUE,
          A.ORDERNO,
          A.ORDERDATE,
          A.USERDATE,
          B.SHIPDATE,
          D.BUYERNAME,
          A.STYLEREFNO,
          A.ORDERQTY,
          A.TOTPRODQTY,
          A.COLOR5,
          E.PAYTERM,
          A.AMOUNT,
          A.AVGBUYERRATE

      HAVING
          :shipmentStatus = 'ALL'

          OR (
              :shipmentStatus = 'SHIPPED'
              AND COUNT(FG.ORDERNO) > 0
          )

          OR (
              :shipmentStatus = 'NOT SHIPPED'
              AND COUNT(FG.ORDERNO) = 0
          )

      ORDER BY EE.FINYR
    `;

    const binds = {
      selectedBuyer: selectedBuyer,
      finYear: finYear,
      month: month,
      shipmentStatus: shipmentStatus.toUpperCase().trim(),
    };

    const result = await connection.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    return res.json({
      statusCode: 0,
      data: result.rows,
    });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

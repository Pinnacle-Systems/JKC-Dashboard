import { getConnection } from "../constants/db.connection.js";
import oracledb from "oracledb";

//  PARENT CHART Order Entry count

export async function getShipmentCount(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear } = req.query;

    const sql = `
SELECT
    TO_CHAR(C.SHIPDATE, 'FMMonth YYYY', 'NLS_DATE_LANGUAGE=ENGLISH') AS SHIP_MONTH,
    COUNT(A.ORDERNO) AS ORDERNO
FROM GTNORDERENTRY A
JOIN GTNORDERSTYLECOMBODET C
    ON C.GTNORDERENTRYID = A.GTNORDERENTRYID
JOIN GTFINANCIALYEAR B
    ON B.GTFINANCIALYEARID = A.FINYEAR
WHERE B.FINYR = '${selectedYear}'
GROUP BY
    TO_CHAR(C.SHIPDATE, 'FMMonth YYYY', 'NLS_DATE_LANGUAGE=ENGLISH')
ORDER BY
    MIN(C.SHIPDATE)
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

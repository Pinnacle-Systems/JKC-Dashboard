import { getConnection } from "../constants/db.connection.js";
import oracledb from "oracledb";

// COMPCODE DROPDOWN DATA

export async function getOrderEntryStatusTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
SELECT D.FINYR,B.COMPCODE,'INTERNAL ORDER' TYPENAME,A.ORDERNO,A.ORDERDATE,A.USERDATE,A.BUYERPODATE,C.BUYERCODE,C.BUYERNAME,A.GETBPONO,A.STYLEREFNO,A.COLOR5,
A.ORDERUOM,A.ORDERQTY,A.TOTPRODQTY,A.AMOUNT FROM GTNORDERENTRY A 
JOIN GTCOMPMAST B ON A.COMPCODE = B.GTCOMPMASTID
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.BUYER
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
WHERE B.COMPCODE = '${companyName}' AND D.FINYR = '${finYear}'
ORDER BY A.ORDERNO
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      typeName: po[2],
      orderNo: po[3],
      orderDate: po[4],
      userDate: po[5],
      buyerPODate: po[6],
      buyerCode: po[7],
      buyerName: po[8],
      getbpoNo: po[9],
      styleRefNo: po[10],
      color5: po[11],
      orderUom: po[12],
      orderQty: po[13],
      totProdQty: po[14],
      amount: po[15],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

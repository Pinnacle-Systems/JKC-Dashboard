import { getConnection } from "../constants/db.connection.js";
import oracledb from "oracledb";

// COMPCODE DROPDOWN DATA
export async function getOrderEntryStatusTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName, buyerCode } = req.query;
    const buyerFilter = buyerCode && buyerCode !== "ALL" 
      ? `AND C.BUYERCODE = '${buyerCode}'` : "";

    const sql = `SELECT DISTINCT A.FINYR,A.COMPCODE,'INTERNAL ORDER' TYPENAME,A.ORDERNO,A.ORDERDATE,
C.BUYERNAME,A.BPONO,A.BPODATE,A.STYLEREFNO,A.COLOR,A.ORDERPACKTYPE,
SUM(A.SHIPQTY) ORDERQTY,SUM(A.PRODQTY) EXCESSQTY FROM ORDERALLOWDET A
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.GTBUYERMASTID 
WHERE A.COMPCODE = '${companyName}' AND A.FINYR = '${finYear}' ${buyerFilter}
GROUP BY A.FINYR,A.COMPCODE,A.ORDERNO,A.ORDERDATE,
C.BUYERNAME,A.BPONO,A.BPODATE,A.STYLEREFNO,A.COLOR,A.ORDERPACKTYPE
ORDER BY 1,2,3,4,5,6,7,8`;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0], compCode: po[1], typeName: po[2],
      orderNo: po[3], orderDate: po[4], buyerName: po[5],
      bpoNo: po[6], bpoDate: po[7], styleRefNo: po[8],
      color: po[9], orderPackType: po[10], orderQty: po[11], excessQty: po[12],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getfabricProcessPlanTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName, buyerCode } = req.query;
    const buyerFilter = buyerCode && buyerCode !== "ALL"
      ? `AND C.BUYERCODE = '${buyerCode}'` : "";

    const sql = `SELECT DISTINCT A.FINYR,A.COMPCODE,'FABRIC PROCESS PLAN' TYPENAME,B.PLANNO,B.PLANDATE,B.TRANSTYPE,A.ORDERNO,A.ORDERDATE,
C.BUYERNAME,B.PLANDATE-A.ORDERDATE AGE FROM ORDERALLOWDET A
JOIN GTFYPPLAN B ON B.ORDERNO = A.GTNORDERENTRYID
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.GTBUYERMASTID 
WHERE A.COMPCODE = '${companyName}' AND A.FINYR = '${finYear}' ${buyerFilter}
GROUP BY A.FINYR,A.COMPCODE,A.ORDERNO,A.ORDERDATE,
C.BUYERNAME,A.BPONO,A.BPODATE,A.STYLEREFNO,A.COLOR,A.ORDERPACKTYPE,B.PLANNO,B.PLANDATE,B.TRANSTYPE
ORDER BY 1,2,3,4,5,6,7,8`;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0], compCode: po[1], typeName: po[2],
      planNo: po[3], planDate: po[4], transType: po[5],
      orderNo: po[6], orderDate: po[7], buyerName: po[8], age: po[9],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getAccessoriesPlanTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName, buyerCode } = req.query;
    const buyerFilter = buyerCode && buyerCode !== "ALL"
      ? `AND C.BUYERCODE = '${buyerCode}'` : "";

    const sql = `SELECT DISTINCT A.FINYR,A.COMPCODE,'ACCESSORY PLAN' TYPENAME,B.ACCPLANNO,B.ACCPLANDATE,B.TRANSTYPE,A.ORDERNO,A.ORDERDATE,
C.BUYERNAME,B.ACCPLANDATE-A.ORDERDATE AGE FROM ORDERALLOWDET A
JOIN GTACCPLAN B ON B.ORDERNO = A.GTNORDERENTRYID
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.GTBUYERMASTID 
WHERE A.COMPCODE = '${companyName}' AND A.FINYR = '${finYear}' ${buyerFilter}
GROUP BY A.FINYR,A.COMPCODE,A.ORDERNO,A.ORDERDATE,
C.BUYERNAME,A.BPONO,A.BPODATE,A.STYLEREFNO,A.COLOR,A.ORDERPACKTYPE,B.ACCPLANNO,B.ACCPLANDATE,B.TRANSTYPE
ORDER BY 1,2,3,4,5,6,7,8`;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0], compCode: po[1], typeName: po[2],
      accplanNo: po[3], accplanDate: po[4], transType: po[5],
      orderNo: po[6], orderDate: po[7], buyerName: po[8], age: po[9],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getCMTPlanTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName, buyerCode } = req.query;
    const buyerFilter = buyerCode && buyerCode !== "ALL"
      ? `AND C.BUYERCODE = '${buyerCode}'` : "";

    const sql = `SELECT DISTINCT A.FINYR,A.COMPCODE,'CMT PLAN' TYPENAME,B.DOCID,B.DOCDATE,A.ORDERNO,A.ORDERDATE,
C.BUYERNAME,B.DOCDATE-A.ORDERDATE AGE FROM ORDERALLOWDET A
JOIN GTCMTPLAN B ON B.ORDERNO = A.GTNORDERENTRYID
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.GTBUYERMASTID 
WHERE A.COMPCODE = '${companyName}' AND A.FINYR = '${finYear}' ${buyerFilter}
GROUP BY A.FINYR,A.COMPCODE,A.ORDERNO,A.ORDERDATE,
C.BUYERNAME,A.BPONO,A.BPODATE,A.STYLEREFNO,A.COLOR,A.ORDERPACKTYPE,B.DOCID,B.DOCDATE
ORDER BY 1,2,3,4,5,6,7,8`;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0], compCode: po[1], typeName: po[2],
      docId: po[3], docDate: po[4], orderNo: po[5],
      orderDate: po[6], buyerName: po[7], age: po[8],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getPreBudjetTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName, buyerCode } = req.query;
    const buyerFilter = buyerCode && buyerCode !== "ALL"
      ? `AND C.BUYERCODE = '${buyerCode}'` : "";

    const sql = `SELECT DISTINCT A.FINYR,A.COMPCODE,'PRE BUDGET' TYPENAME,B.BUDID DOCID,B.BUDDATE DOCDATE,A.ORDERNO,A.ORDERDATE,
C.BUYERNAME,B.BUDDATE-A.ORDERDATE AGE FROM ORDERALLOWDET A
JOIN GTBM B ON B.ORDERNO = A.GTNORDERENTRYID
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.GTBUYERMASTID 
WHERE A.COMPCODE = '${companyName}' AND A.FINYR = '${finYear}' ${buyerFilter}
GROUP BY A.FINYR,A.COMPCODE,A.ORDERNO,A.ORDERDATE,
C.BUYERNAME,A.BPONO,A.BPODATE,A.STYLEREFNO,A.COLOR,A.ORDERPACKTYPE,B.BUDID,B.BUDDATE
ORDER BY 1,2,3,4,5,6,7,8`;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0], compCode: po[1], typeName: po[2],
      docId: po[3], docDate: po[4], orderNo: po[5],
      orderDate: po[6], buyerName: po[7], age: po[8],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}
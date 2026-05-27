import { getConnection } from "../constants/db.connection.js";

// COMPCODE DROPDOWN DATA

//  PARENT CHART Order Entry

export async function getOrderEntryCount(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear } = req.query;

    const sql = `
SELECT 
    D.FINYR,
    B.COMPCODE,
    COUNT(*) AS COMPLETED
FROM GTNORDERENTRY A
JOIN GTCOMPMAST B 
    ON A.COMPCODE = B.GTCOMPMASTID
JOIN GTFINANCIALYEAR D 
    ON D.GTFINANCIALYEARID = A.FINYEAR
WHERE  D.FINYR = '${selectedYear}' AND A.ORDERTYPE = 'ORDER'
GROUP BY 
    D.FINYR,
    B.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      completed: po[2],
      type: "Internal Order",
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// 1. Order Entry Planning Status Chart

export async function getOrderEntryStatus(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
SELECT D.FINYR,B.COMPCODE,'INTERNAL ORDER' TYPENAME,C.BUYERCODE,0 PENDING,COUNT(*) COMPLETED,1 ORD FROM GTNORDERENTRY A 
JOIN GTCOMPMAST B ON A.COMPCODE = B.GTCOMPMASTID
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.BUYER
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
WHERE B.COMPCODE = '${companyName}' AND D.FINYR = '${finYear}' AND A.ORDERTYPE = 'ORDER'
GROUP BY D.FINYR,B.COMPCODE,C.BUYERCODE
UNION ALL
SELECT D.FINYR,B.COMPCODE,'FABRIC PROCESS PLAN' TYPENAME,C.BUYERCODE,Z.COMPLETED-COUNT(*) PENDING,COUNT(*) COMPLETED,2 ORD FROM GTFYPPLAN A
JOIN GTNORDERENTRY AA ON A.ORDERNO = AA.GTNORDERENTRYID
JOIN GTCOMPMAST B ON A.COMPCODE = B.GTCOMPMASTID
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = AA.BUYER
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
JOIN (
SELECT D.FINYR,B.COMPCODE,'INTERNAL ORDER' TYPENAME,C.BUYERCODE,0 PENDING,COUNT(*) COMPLETED FROM GTNORDERENTRY A 
JOIN GTCOMPMAST B ON A.COMPCODE = B.GTCOMPMASTID
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.BUYER
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
WHERE B.COMPCODE = '${companyName}' AND D.FINYR = '${finYear}' AND A.ORDERTYPE = 'ORDER'
GROUP BY D.FINYR,B.COMPCODE,C.BUYERCODE
) Z ON Z.BUYERCODE = C.BUYERCODE
WHERE B.COMPCODE = '${companyName}' AND D.FINYR = '${finYear}'  AND AA.ORDERTYPE = 'ORDER' AND A.TRANSTYPE = 'PLANNING'
GROUP BY D.FINYR,B.COMPCODE,C.BUYERCODE,Z.COMPLETED
UNION ALL
SELECT D.FINYR,B.COMPCODE,'ACCESSORIES PLAN' TYPENAME,C.BUYERCODE,Z.COMPLETED-COUNT(*) PENDING,COUNT(*) COMPLETED,3 ORD FROM GTACCPLAN A
JOIN GTNORDERENTRY AA ON A.ORDERNO = AA.GTNORDERENTRYID
JOIN GTCOMPMAST B ON A.COMPCODE = B.GTCOMPMASTID
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = AA.BUYER
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
JOIN (
SELECT D.FINYR,B.COMPCODE,'INTERNAL ORDER' TYPENAME,C.BUYERCODE,0 PENDING,COUNT(*) COMPLETED FROM GTNORDERENTRY A 
JOIN GTCOMPMAST B ON A.COMPCODE = B.GTCOMPMASTID
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.BUYER
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
WHERE B.COMPCODE = '${companyName}' AND D.FINYR = '${finYear}' AND A.ORDERTYPE = 'ORDER'
GROUP BY D.FINYR,B.COMPCODE,C.BUYERCODE
) Z ON Z.BUYERCODE = C.BUYERCODE
WHERE B.COMPCODE = '${companyName}' AND D.FINYR = '${finYear}'  AND AA.ORDERTYPE = 'ORDER' AND A.TRANSTYPE = 'PLANNING'
GROUP BY D.FINYR,B.COMPCODE,C.BUYERCODE,Z.COMPLETED
UNION ALL
SELECT D.FINYR,B.COMPCODE,'CMT PLAN' TYPENAME,C.BUYERCODE,Z.COMPLETED-COUNT(*) PENDING,COUNT(*) COMPLETED,4 ORD FROM GTCMTPLAN A
JOIN GTNORDERENTRY AA ON A.ORDERNO = AA.GTNORDERENTRYID
JOIN GTCOMPMAST B ON A.COMPCODE = B.GTCOMPMASTID
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = AA.BUYER
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
JOIN (
SELECT D.FINYR,B.COMPCODE,'INTERNAL ORDER' TYPENAME,C.BUYERCODE,0 PENDING,COUNT(*) COMPLETED FROM GTNORDERENTRY A 
JOIN GTCOMPMAST B ON A.COMPCODE = B.GTCOMPMASTID
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.BUYER
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
WHERE B.COMPCODE = '${companyName}' AND D.FINYR = '${finYear}' AND A.ORDERTYPE = 'ORDER'
GROUP BY D.FINYR,B.COMPCODE,C.BUYERCODE
) Z ON Z.BUYERCODE = C.BUYERCODE
WHERE B.COMPCODE = '${companyName}' AND D.FINYR = '${finYear}'  AND AA.ORDERTYPE = 'ORDER'
GROUP BY D.FINYR,B.COMPCODE,C.BUYERCODE,Z.COMPLETED
UNION ALL
SELECT D.FINYR,B.COMPCODE,'PRE - BUDGET' TYPENAME,C.BUYERCODE,Z.COMPLETED-COUNT(*) PENDING,COUNT(*) COMPLETED,5 ORD FROM GTBM A
JOIN GTNORDERENTRY AA ON A.ORDERNO = AA.GTNORDERENTRYID
JOIN GTCOMPMAST B ON A.COMPCODE = B.GTCOMPMASTID
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = AA.BUYER
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
JOIN (
SELECT D.FINYR,B.COMPCODE,'INTERNAL ORDER' TYPENAME,C.BUYERCODE,0 PENDING,COUNT(*) COMPLETED FROM GTNORDERENTRY A 
JOIN GTCOMPMAST B ON A.COMPCODE = B.GTCOMPMASTID
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.BUYER
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
WHERE B.COMPCODE = '${companyName}' AND D.FINYR = '${finYear}' AND A.ORDERTYPE = 'ORDER'
GROUP BY D.FINYR,B.COMPCODE,C.BUYERCODE
) Z ON Z.BUYERCODE = C.BUYERCODE
WHERE B.COMPCODE = '${companyName}' AND D.FINYR = '${finYear}' AND AA.ORDERTYPE = 'ORDER'
GROUP BY D.FINYR,B.COMPCODE,C.BUYERCODE,Z.COMPLETED
ORDER BY 1,2,4,ORD
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      typeName: po[2],
      buyerCode: po[3],
      pending: po[4],
      completed: po[5],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// 2. Order Entry — Buyer Wise Status Chart

export async function getOrderEntryBuyerStatus(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    // SELECT D.FINYR,B.COMPCODE,C.BUYERCODE,NVL(A.SC,'Running') STA,COUNT(*) CNT FROM GTNORDERENTRY A
    // JOIN GTCOMPMAST B ON A.COMPCODE = B.GTCOMPMASTID
    // JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.BUYER
    // JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
    // WHERE B.COMPCODE = '${companyName}' AND D.FINYR = '${finYear}'
    // GROUP BY D.FINYR,B.COMPCODE,C.BUYERCODE,A.SC
    // ORDER BY 1,2,3,4

    const sql = `

SELECT D.FINYR,B.COMPCODE,C.BUYERCODE,
CASE WHEN ZA.ORDERNO IS NULL THEN NVL(A.SC,'Running') ELSE 'Completed' END STA,COUNT(*) CNT FROM GTNORDERENTRY A 
JOIN GTCOMPMAST B ON A.COMPCODE = B.GTCOMPMASTID
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.BUYER
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
LEFT JOIN (SELECT DISTINCT ZA.ORDERNO FROM GTPRODPENTRY ZA) ZA ON A.GTNORDERENTRYID = ZA.ORDERNO
WHERE B.COMPCODE = '${companyName}' AND D.FINYR = '${finYear}' AND  A.ORDERTYPE = 'ORDER'
GROUP BY D.FINYR,B.COMPCODE,C.BUYERCODE,A.SC,ZA.ORDERNO
ORDER BY 1,2,3,4
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      buyerCode: po[2],
      status: po[3],
      count: po[4],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getOrderEntryBuyerQtyWise(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `

SELECT 
    D.FINYR,
    B.COMPCODE,
    C.BUYERCODE,
SUM(CASE 
        WHEN ZA.ORDERNO IS NULL THEN NVL(OAD.SHIPQTY, 0)
        ELSE 0 
    END) AS RUNNING_QTY,
SUM(CASE 
        WHEN ZA.ORDERNO IS NOT NULL THEN NVL(OAD.SHIPQTY, 0)
        ELSE 0 
    END) AS COMPLETED_QTY
FROM GTNORDERENTRY A
JOIN ORDERALLOWDET OAD 
    ON OAD.GTNORDERENTRYID = A.GTNORDERENTRYID   
JOIN GTCOMPMAST B 
    ON A.COMPCODE = B.GTCOMPMASTID
JOIN GTBUYERMAST C 
    ON C.GTBUYERMASTID = A.BUYER
JOIN GTFINANCIALYEAR D 
    ON D.GTFINANCIALYEARID = A.FINYEAR
LEFT JOIN (
    SELECT ORDERNO
    FROM GTPRODPENTRY
    GROUP BY ORDERNO
) ZA 
    ON A.GTNORDERENTRYID = ZA.ORDERNO
WHERE 
    B.COMPCODE = '${companyName}' 
    AND D.FINYR = '${finYear}'
GROUP BY 
    D.FINYR,
    B.COMPCODE,
    C.BUYERCODE
ORDER BY 
    D.FINYR,
    B.COMPCODE,
    C.BUYERCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      buyerCode: po[2],
      runningQty: po[3],
      completedQty: po[4],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getOrderEntryBuyerWisePoNoQty(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
 SELECT 
    D.FINYR,
    B.COMPCODE,
    C.BUYERCODE,
    OAD.BPONO,
    SUM(NVL(OAD.SHIPQTY, 0)) AS TOTAL_QTY
FROM GTNORDERENTRY A
JOIN ORDERALLOWDET OAD 
    ON OAD.GTNORDERENTRYID = A.GTNORDERENTRYID   
JOIN GTCOMPMAST B 
    ON A.COMPCODE = B.GTCOMPMASTID
JOIN GTBUYERMAST C 
    ON C.GTBUYERMASTID = A.BUYER
JOIN GTFINANCIALYEAR D 
    ON D.GTFINANCIALYEARID = A.FINYEAR
WHERE 
    B.COMPCODE = '${companyName}'
    AND D.FINYR = '${finYear}'
GROUP BY 
    D.FINYR,
    B.COMPCODE,
    C.BUYERCODE,
    OAD.BPONO
ORDER BY 
    D.FINYR,
    B.COMPCODE,
    C.BUYERCODE,
    OAD.BPONO
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      buyerCode: po[2],
      bpono: po[3],
      totalQty: po[4],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getOrderEntryStyleWisePoNoQty(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
SELECT D.FINYR,B.COMPCODE,C.BUYERCODE,Z.STYLEGROUP,Z.STYLESUBGROUP,OAD.STYLEITEM,SUM(NVL(OAD.SHIPQTY, 0)) AS TOTAL_QTY
FROM GTNORDERENTRY A 
JOIN ORDERALLOWDET OAD ON OAD.GTNORDERENTRYID = A.GTNORDERENTRYID   
JOIN GTCOMPMAST B ON A.COMPCODE = B.GTCOMPMASTID
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.BUYER
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
JOIN (
SELECT A.STYLEITEM,B.STYLEGROUP,C.STYLESUBGROUP FROM GTSTYLEITEMMAST A
JOIN GTSTYLEGROUPMAST B ON A.STYLEGROUP = B.GTSTYLEGROUPMASTID
JOIN GTSTYLESUBGROUPMAST C ON C.GTSTYLESUBGROUPMASTID = A.STYLESUBGROUP
) Z ON Z.STYLEITEM = OAD.STYLEITEM
WHERE B.COMPCODE = '${companyName}' AND D.FINYR = '${finYear}'
GROUP BY D.FINYR,B.COMPCODE,OAD.STYLEITEM,C.BUYERCODE,Z.STYLEGROUP,Z.STYLESUBGROUP
ORDER BY D.FINYR,B.COMPCODE,BUYERCODE,STYLEGROUP,STYLESUBGROUP,STYLEITEM
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      buyerCode: po[2],
      styleGroup: po[3],
      styleSubGroup: po[4],
      styleItem: po[5],
      totalQty: po[6],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getOrderEntryColorWiseQty(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
SELECT D.FINYR,B.COMPCODE,C.BUYERCODE,OAD.COLOR,SUM(NVL(OAD.SHIPQTY, 0)) AS TOTAL_QTY
FROM GTNORDERENTRY A 
JOIN ORDERALLOWDET OAD ON OAD.GTNORDERENTRYID = A.GTNORDERENTRYID   
JOIN GTCOMPMAST B ON A.COMPCODE = B.GTCOMPMASTID
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.BUYER
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
WHERE B.COMPCODE = '${companyName}' AND D.FINYR = '${finYear}'
GROUP BY D.FINYR,B.COMPCODE,OAD.COLOR,C.BUYERCODE
ORDER BY D.FINYR,B.COMPCODE,BUYERCODE,COLOR
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      buyerCode: po[2],
      color: po[3],
      totalQty: po[4],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

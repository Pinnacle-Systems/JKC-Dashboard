import { getConnection } from "../constants/db.connection.js";
import oracledb from "oracledb";

export async function getGeneralTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName } = req.query;

    const sql = `
SELECT D.FINYR FINYEAR,C.COMPCODE,A.DOCDATE,A.DOCID,G.ITEMGRPNAME,I.ITEMNAME,A.SUPPLIER,B.POQTY-B.CANQTY POQTY,
U.UNITNAME,B.PORATE,(B.POQTY-B.CANQTY)*B.PORATE AMOUNT FROM GTGENPO A
JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
JOIN GTITEMGRPMAST G ON G.GTITEMGRPMASTID = B.ITEMGRPNAME
JOIN GTGENITEMMAST I ON I.GTGENITEMMASTID = B.ITEMNAME
JOIN GTUNITMAST U ON U.GTUNITMASTID = B.UOM
where D.FINYR = '${selectedYear}' AND C.COMPCODE = '${companyName}'
AND (B.POQTY-B.CANQTY)*B.PORATE > 0
ORDER BY 1,2,3
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      itemGroup: po[4],
      item: po[5],
      supplier: po[6],
      qty: po[7],
      uom: po[8],
      rate: po[9],
      amount: po[10],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}
export async function getGreyYarnTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName } = req.query;

    const sql = `
SELECT A.FINYR,A.COMPCODE,A.DOCDATE,A.YPONO DOCID,A.YARN,A.SUPPLIER,A.ORDERNO,A.COLORNAME,(A.POQTY - A.CANQTY) POQTY,A.UNITNAME,A.PRICE PRICE, 
(A.POQTY - A.CANQTY) * A.PRICE  VAL
FROM YARNPURREG A
where A.FINYR = '${selectedYear}' AND A.COMPCODE = '${companyName}'
AND (A.POQTY - A.CANQTY) * A.PRICE > 0
ORDER BY A.FINYR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      yarnName: po[4],
      supplier: po[5],
      orderNo: po[6],
      color: po[7],
      qty: po[8],
      uom: po[9],
      price: po[10],
      amount: po[11],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getDyedYarnTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName } = req.query;

    const sql = `
SELECT A.FINYR,A.COMPCODE,A.DOCDATE,A.DOCID,A.YARN,A.SUPPLIER,A.ORDERNO,A.COLORNAME,(A.POQTY - A.CANQTY) POQTY,A.UNITNAME,
A.PRICE PRICE, (A.POQTY - A.CANQTY) * A.PRICE  VAL
FROM DYARNPURREG A
where A.FINYR = '${selectedYear}' AND A.COMPCODE = '${companyName}'
AND (A.POQTY - A.CANQTY) * A.PRICE > 0
ORDER BY A.FINYR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      yarnName: po[4],
      supplier: po[5],
      orderNo: po[6],
      color: po[7],
      qty: po[8],
      uom: po[9],
      price: po[10],
      amount: po[11],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getGreyFabricTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName } = req.query;

    const sql = `
SELECT A.FINYEAR FINYR,A.COMPCODE,A.PODATE DOCDATE,A.PONO DOCID,A.FABRIC,A.SUPPLIER,A.ORDERNO,A.COLOR,A.DESIGN,A.GSM,
(A.POQTY - A.CANQTY) POQTY,A.UOM,A.PORATE PRICE, (A.POQTY - A.CANQTY) * A.PORATE  VAL
FROM GFABPOREG A
where A.FINYEAR = '${selectedYear}' AND A.COMPCODE = '${companyName}'
AND (A.POQTY - A.CANQTY) * A.PORATE > 0
ORDER BY A.FINYEAR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      fabricName: po[4],
      supplier: po[5],
      orderNo: po[6],
      color: po[7],
      design: po[8],
      gsm: po[9],
      qty: po[10],
      uom: po[11],
      price: po[12],
      amount: po[13],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getDyedFabricTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName } = req.query;

    const sql = `
SELECT A.FINYEAR FINYR,A.COMPCODE,A.PODATE DOCDATE,A.PONO DOCID,A.FABRIC,A.SUPPLIER,A.ORDERNO,A.COLOR,A.DESIGN,A.GSM,
(A.POQTY - A.CANQTY) POQTY,A.UOM,A.PORATE PRICE, (A.POQTY - A.CANQTY) * A.PORATE  VAL
FROM DFABPOREG A
where A.FINYEAR = '${selectedYear}' AND A.COMPCODE = '${companyName}'
AND (A.POQTY - A.CANQTY) * A.PORATE > 0
ORDER BY A.FINYEAR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      fabricName: po[4],
      supplier: po[5],
      orderNo: po[6],
      color: po[7],
      design: po[8],
      gsm: po[9],
      qty: po[10],
      uom: po[11],
      price: po[12],
      amount: po[13],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getAccessoryTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName } = req.query;

    const sql = `
SELECT A.FINYEAR FINYR,A.COMPCODE,A.ACCPODATE DOCDATE,A.ACCPONO DOCID,A.ACCGROUP,A.ACCITEM,A.ACCNAME2,A.ACCSIZE,A.ALIASNAME2,
A.SUPPLIER,A.ORDERNO1,
(A.POQTY - A.CANQTY) POQTY,A.UOM,A.PORATE PRICE, (A.POQTY - A.CANQTY) * A.PORATE  VAL
FROM ACCPOREG A
where A.FINYEAR = '${selectedYear}' AND A.COMPCODE = '${companyName}'
AND  (A.POQTY - A.CANQTY) * A.PORATE > 0
ORDER BY A.FINYEAR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      accessGroupName: po[4],
      accessItemName: po[5],
      accessItemDesc: po[6],
      accessSize: po[7],
      accessAliasName: po[8],
      supplier: po[9],
      orderNo: po[10],
      qty: po[11],
      uom: po[12],
      price: po[13],
      amount: po[14],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getGeneralSupplierToptenTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;

    const sql = `
SELECT D.FINYR FINYEAR,C.COMPCODE,A.DOCDATE,A.DOCID,G.ITEMGRPNAME,I.ITEMNAME,A.SUPPLIER,B.POQTY-B.CANQTY POQTY,
U.UNITNAME,B.PORATE,(B.POQTY-B.CANQTY)*B.PORATE AMOUNT FROM GTGENPO A
JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
JOIN GTITEMGRPMAST G ON G.GTITEMGRPMASTID = B.ITEMGRPNAME
JOIN GTGENITEMMAST I ON I.GTGENITEMMASTID = B.ITEMNAME
JOIN GTUNITMAST U ON U.GTUNITMASTID = B.UOM
where D.FINYR = '${selectedYear}' AND C.COMPCODE = '${companyName}' AND A.SUPPLIER = '${supplier}'
AND (B.POQTY-B.CANQTY)*B.PORATE > 0
ORDER BY 1,2,3
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      itemGroup: po[4],
      item: po[5],
      supplier: po[6],
      qty: po[7],
      uom: po[8],
      rate: po[9],
      amount: po[10],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getGreyYarnSupplierToptenTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;

    const sql = `
SELECT A.FINYR,A.COMPCODE,A.DOCDATE,A.YPONO DOCID,A.YARN,A.SUPPLIER,A.ORDERNO,A.COLORNAME,(A.POQTY - A.CANQTY) POQTY,A.UNITNAME,A.PRICE PRICE, 
(A.POQTY - A.CANQTY) * A.PRICE  VAL
FROM YARNPURREG A
where A.FINYR = '${selectedYear}' AND A.COMPCODE = '${companyName}'  AND A.SUPPLIER = '${supplier}'
AND (A.POQTY - A.CANQTY) * A.PRICE > 0
ORDER BY A.FINYR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      yarnName: po[4],
      supplier: po[5],
      orderNo: po[6],
      color: po[7],
      qty: po[8],
      uom: po[9],
      price: po[10],
      amount: po[11],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getDyedYarnSupplierToptenTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;

    const sql = `
SELECT A.FINYR,A.COMPCODE,A.DOCDATE,A.DOCID,A.YARN,A.SUPPLIER,A.ORDERNO,A.COLORNAME,(A.POQTY - A.CANQTY) POQTY,A.UNITNAME,
A.PRICE PRICE, (A.POQTY - A.CANQTY) * A.PRICE  VAL
FROM DYARNPURREG A
where A.FINYR = '${selectedYear}' AND A.COMPCODE = '${companyName}'  AND A.SUPPLIER = '${supplier}'
AND (A.POQTY - A.CANQTY) * A.PRICE > 0
ORDER BY A.FINYR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      yarnName: po[4],
      supplier: po[5],
      orderNo: po[6],
      color: po[7],
      qty: po[8],
      uom: po[9],
      price: po[10],
      amount: po[11],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getGreyFabricSupplierToptenTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;

    const sql = `
SELECT A.FINYEAR FINYR,A.COMPCODE,A.PODATE DOCDATE,A.PONO DOCID,A.FABRIC,A.SUPPLIER,A.ORDERNO,A.COLOR,A.DESIGN,A.GSM,
(A.POQTY - A.CANQTY) POQTY,A.UOM,A.PORATE PRICE, (A.POQTY - A.CANQTY) * A.PORATE  VAL
FROM GFABPOREG A
where A.FINYEAR = '${selectedYear}' AND A.COMPCODE = '${companyName}' AND A.SUPPLIER = '${supplier}'
AND (A.POQTY - A.CANQTY) * A.PORATE > 0
ORDER BY A.FINYEAR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      fabricName: po[4],
      supplier: po[5],
      orderNo: po[6],
      color: po[7],
      design: po[8],
      gsm: po[9],
      qty: po[10],
      uom: po[11],
      price: po[12],
      amount: po[13],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getDyedFabricSupplierToptenTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;

    const sql = `
SELECT A.FINYEAR FINYR,A.COMPCODE,A.PODATE DOCDATE,A.PONO DOCID,A.FABRIC,A.SUPPLIER,A.ORDERNO,A.COLOR,A.DESIGN,A.GSM,
(A.POQTY - A.CANQTY) POQTY,A.UOM,A.PORATE PRICE, (A.POQTY - A.CANQTY) * A.PORATE  VAL
FROM DFABPOREG A
where A.FINYEAR = '${selectedYear}' AND A.COMPCODE = '${companyName}' AND A.SUPPLIER = '${supplier}'
AND (A.POQTY - A.CANQTY) * A.PORATE > 0
ORDER BY A.FINYEAR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      fabricName: po[4],
      supplier: po[5],
      orderNo: po[6],
      color: po[7],
      design: po[8],
      gsm: po[9],
      qty: po[10],
      uom: po[11],
      price: po[12],
      amount: po[13],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getAccessorySupplierToptenTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;

    const sql = `
SELECT A.FINYEAR FINYR,A.COMPCODE,A.ACCPODATE DOCDATE,A.ACCPONO DOCID,A.ACCGROUP,A.ACCITEM,A.ACCNAME2,A.ACCSIZE,A.ALIASNAME2,
A.SUPPLIER,A.ORDERNO1,
(A.POQTY - A.CANQTY) POQTY,A.UOM,A.PORATE PRICE, (A.POQTY - A.CANQTY) * A.PORATE  VAL
FROM ACCPOREG A
where A.FINYEAR = '${selectedYear}' AND A.COMPCODE = '${companyName}' AND A.SUPPLIER = '${supplier}'
AND  (A.POQTY - A.CANQTY) * A.PORATE > 0
ORDER BY A.FINYEAR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      accessGroupName: po[4],
      accessItemName: po[5],
      accessItemDesc: po[6],
      accessSize: po[7],
      accessAliasName: po[8],
      supplier: po[9],
      orderNo: po[10],
      qty: po[11],
      uom: po[12],
      price: po[13],
      amount: po[14],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getQuarterGeneralTable(req, res) {
  const connection = await getConnection(res);

  try {
    const { selectedYear, companyName, quarter } = req.query;

    const sql = `
WITH MAIN_CTE AS (
    SELECT 
        TO_CHAR(A.DOCDATE, 'FMMonth YYYY') AS MONTH,
        TRIM(TO_CHAR(A.DOCDATE,'MONTH')) || '-' || TRIM(TO_CHAR(A.DOCDATE,'YYYY')) AS MONTHVAL,
        CASE 
            WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('04','05','06') THEN 'Q1'
            WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('07','08','09') THEN 'Q2'
            WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('10','11','12') THEN 'Q3'
            WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('01','02','03') THEN 'Q4'
            ELSE 'NA'
        END AS QUARTER,
        A.DOCDATE,
        A.DOCID,
        G.ITEMGRPNAME,
        I.ITEMNAME,
        A.SUPPLIER,
        B.POQTY-B.CANQTY AS POQTY,
        U.UNITNAME,
        B.PORATE,
        (B.POQTY-B.CANQTY)*B.PORATE AS AMOUNT 
    FROM GTGENPO A
    JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
    JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
    JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
    JOIN GTITEMGRPMAST G ON G.GTITEMGRPMASTID = B.ITEMGRPNAME
    JOIN GTGENITEMMAST I ON I.GTGENITEMMASTID = B.ITEMNAME
    JOIN GTUNITMAST U ON U.GTUNITMASTID = B.UOM
    WHERE D.FINYR = :selectedYear
      AND C.COMPCODE = :companyName
      AND (B.POQTY-B.CANQTY)*B.PORATE > 0
)
SELECT 
    DOCID, 
    DOCDATE, 
    MONTH,          
    SUPPLIER, 
    ITEMGRPNAME, 
    ITEMNAME, 
    UNITNAME, 
    POQTY, 
    PORATE, 
    AMOUNT
FROM MAIN_CTE
WHERE QUARTER = :quarter
ORDER BY DOCID, DOCDATE
`;

    // Execute query with bind parameters
    const result = await connection.execute(sql, {
      selectedYear,
      companyName,
      quarter,
    });

    let resp = result.rows?.map((po) => ({
      docId: po[0],
      docDate: po[1],
      month: po[2],
      supplier: po[3],
      itemGroup: po[4],
      item: po[5],
      uom: po[6],
      qty: po[7],
      rate: po[8],
      amount: po[9],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getGreyYarnQuarterTable(req, res) {
  const connection = await getConnection(res);

  try {
    const { selectedYear, companyName, quarter } = req.query;

    const sql = `
WITH MAIN_CTE AS (
    SELECT 
        TO_CHAR(A.DOCDATE, 'FMMonth YYYY') AS MONTH,
        TRIM(TO_CHAR(A.DOCDATE,'MONTH')) || '-' || TRIM(TO_CHAR(A.DOCDATE,'YYYY')) AS MONTHVAL,
        CASE 
            WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('04','05','06') THEN 'Q1'
            WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('07','08','09') THEN 'Q2'
            WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('10','11','12') THEN 'Q3'
            WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('01','02','03') THEN 'Q4'
            ELSE 'NA'
        END AS QUARTER,
        A.DOCDATE,
        A.YPONO AS DOCID,
        A.YARN,
        A.SUPPLIER,
        A.ORDERNO,
        A.COLORNAME,
        (A.POQTY - A.CANQTY) AS POQTY,
        A.UNITNAME,
        A.PRICE,
        (A.POQTY - A.CANQTY) * A.PRICE AS AMOUNT
    FROM YARNPURREG A
    WHERE A.FINYR = :selectedYear
      AND A.COMPCODE = :companyName
      AND (A.POQTY - A.CANQTY) * A.PRICE > 0
)
SELECT 
    DOCID, 
    DOCDATE, 
    MONTH, 
    ORDERNO, 
    SUPPLIER, 
    YARN, 
    COLORNAME, 
    UNITNAME, 
    POQTY, 
    PRICE, 
    AMOUNT
FROM MAIN_CTE
WHERE QUARTER = :quarter
ORDER BY DOCID, DOCDATE
`;

    const result = await connection.execute(sql, {
      selectedYear,
      companyName,
      quarter,
    });

    let resp = result.rows?.map((po) => ({
      docId: po[0],
      docDate: po[1],
      month: po[2],
      orderNo: po[3],
      supplier: po[4],
      yarnName: po[5],
      color: po[6],
      uom: po[7],
      qty: po[8],
      price: po[9],
      amount: po[10],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getDyedYarnQuarterTable(req, res) {
  const connection = await getConnection(res);

  try {
    const { selectedYear, companyName, quarter } = req.query;

    const sql = `
WITH MAIN_CTE AS (
    SELECT 
        TO_CHAR(A.DOCDATE, 'FMMonth YYYY') AS MONTH,
        TRIM(TO_CHAR(A.DOCDATE,'MONTH')) || '-' || TRIM(TO_CHAR(A.DOCDATE,'YYYY')) AS MONTHVAL,
        CASE 
            WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('04','05','06') THEN 'Q1'
            WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('07','08','09') THEN 'Q2'
            WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('10','11','12') THEN 'Q3'
            WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('01','02','03') THEN 'Q4'
            ELSE 'NA'
        END AS QUARTER,
        A.DOCDATE,
        A.DOCID,
        A.YARN,
        A.SUPPLIER,
        A.ORDERNO,
        A.COLORNAME,
        (A.POQTY - A.CANQTY) AS POQTY,
        A.UNITNAME,
        A.PRICE,
        (A.POQTY - A.CANQTY) * A.PRICE AS AMOUNT
    FROM DYARNPURREG  A
    WHERE A.FINYR = :selectedYear
      AND A.COMPCODE = :companyName
      AND (A.POQTY - A.CANQTY) * A.PRICE > 0
)
SELECT 
    DOCID, 
    DOCDATE, 
    MONTH, 
    ORDERNO, 
    SUPPLIER, 
    YARN, 
    COLORNAME, 
    UNITNAME, 
    POQTY, 
    PRICE, 
    AMOUNT
FROM MAIN_CTE
WHERE QUARTER = :quarter
ORDER BY DOCID, DOCDATE
`;

    const result = await connection.execute(sql, {
      selectedYear,
      companyName,
      quarter,
    });

    let resp = result.rows?.map((po) => ({
      docId: po[0],
      docDate: po[1],
      month: po[2],
      orderNo: po[3],
      supplier: po[4],
      yarnName: po[5],
      color: po[6],
      uom: po[7],
      qty: po[8],
      price: po[9],
      amount: po[10],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getGreyFabricQuarterTable(req, res) {
  const connection = await getConnection(res);

  try {
    const { selectedYear, companyName, quarter } = req.query;

    const sql = `
WITH MAIN_CTE AS (
    SELECT 
        TO_CHAR(A.PODATE, 'FMMonth YYYY') AS MONTH,
        TRIM(TO_CHAR(A.PODATE,'MONTH')) || '-' || TRIM(TO_CHAR(A.PODATE,'YYYY')) AS MONTHVAL,
        CASE 
            WHEN TO_CHAR(A.PODATE, 'MM') IN ('04','05','06') THEN 'Q1'
            WHEN TO_CHAR(A.PODATE, 'MM') IN ('07','08','09') THEN 'Q2'
            WHEN TO_CHAR(A.PODATE, 'MM') IN ('10','11','12') THEN 'Q3'
            WHEN TO_CHAR(A.PODATE, 'MM') IN ('01','02','03') THEN 'Q4'
            ELSE 'NA'
        END AS QUARTER,
        A.PODATE AS DOCDATE,
        A.PONO AS DOCID,
        A.FABRIC,
        A.SUPPLIER,
        A.ORDERNO,
        A.COLOR,
        A.DESIGN,
        A.GSM,
        (A.POQTY - A.CANQTY) AS POQTY,
        A.UOM,
        A.PORATE AS PRICE,
        (A.POQTY - A.CANQTY) * A.PORATE AS AMOUNT
    FROM GFABPOREG A
    WHERE A.FINYEAR = :selectedYear
      AND A.COMPCODE = :companyName
      AND (A.POQTY - A.CANQTY) * A.PORATE > 0
)
SELECT 
    DOCID, 
    DOCDATE, 
    MONTH, 
    ORDERNO, 
    SUPPLIER, 
    FABRIC, 
    COLOR, 
    DESIGN,
    GSM,
    UOM, 
    POQTY, 
    PRICE, 
    AMOUNT
FROM MAIN_CTE
WHERE QUARTER = :quarter
ORDER BY DOCID, DOCDATE
`;

    const result = await connection.execute(sql, {
      selectedYear,
      companyName,
      quarter,
    });

    let resp = result.rows?.map((po) => ({
      docId: po[0],
      docDate: po[1],
      month: po[2],
      orderNo: po[3],
      supplier: po[4],
      fabricName: po[5],
      color: po[6],
      design: po[7],
      gsm: po[8],
      uom: po[9],
      qty: po[10],
      price: po[11],
      amount: po[12],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getDyedFabricQuarterTable(req, res) {
  const connection = await getConnection(res);

  try {
    const { selectedYear, companyName, quarter } = req.query;

    const sql = `
WITH MAIN_CTE AS (
    SELECT 
        TO_CHAR(A.PODATE, 'FMMonth YYYY') AS MONTH,
        TRIM(TO_CHAR(A.PODATE,'MONTH')) || '-' || TRIM(TO_CHAR(A.PODATE,'YYYY')) AS MONTHVAL,
        CASE 
            WHEN TO_CHAR(A.PODATE, 'MM') IN ('04','05','06') THEN 'Q1'
            WHEN TO_CHAR(A.PODATE, 'MM') IN ('07','08','09') THEN 'Q2'
            WHEN TO_CHAR(A.PODATE, 'MM') IN ('10','11','12') THEN 'Q3'
            WHEN TO_CHAR(A.PODATE, 'MM') IN ('01','02','03') THEN 'Q4'
            ELSE 'NA'
        END AS QUARTER,
        A.PODATE AS DOCDATE,
        A.PONO AS DOCID,
        A.FABRIC,
        A.SUPPLIER,
        A.ORDERNO,
        A.COLOR,
        A.DESIGN,
        A.GSM,
        (A.POQTY - A.CANQTY) AS POQTY,
        A.UOM,
        A.PORATE AS PRICE,
        (A.POQTY - A.CANQTY) * A.PORATE AS AMOUNT
    FROM DFABPOREG A
    WHERE A.FINYEAR = :selectedYear
      AND A.COMPCODE = :companyName
      AND (A.POQTY - A.CANQTY) * A.PORATE > 0
)
SELECT 
    DOCID, 
    DOCDATE, 
    MONTH, 
    ORDERNO, 
    SUPPLIER, 
    FABRIC, 
    COLOR, 
    DESIGN,
    GSM,
    UOM, 
    POQTY, 
    PRICE, 
    AMOUNT
FROM MAIN_CTE
WHERE QUARTER = :quarter
ORDER BY DOCID, DOCDATE
`;

    const result = await connection.execute(sql, {
      selectedYear,
      companyName,
      quarter,
    });

    let resp = result.rows?.map((po) => ({
      docId: po[0],
      docDate: po[1],
      month: po[2],
      orderNo: po[3],
      supplier: po[4],
      fabricName: po[5],
      color: po[6],
      design: po[7],
      gsm: po[8],
      uom: po[9],
      qty: po[10],
      price: po[11],
      amount: po[12],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getAccessoryQuarterTable(req, res) {
  const connection = await getConnection(res);

  try {
    const { selectedYear, companyName, quarter } = req.query;

    const sql = `
WITH MAIN_CTE AS (
    SELECT 
        TO_CHAR(A.ACCPODATE, 'FMMonth YYYY') AS MONTH,
        TRIM(TO_CHAR(A.ACCPODATE,'MONTH')) || '-' || TRIM(TO_CHAR(A.ACCPODATE,'YYYY')) AS MONTHVAL,
        CASE 
            WHEN TO_CHAR(A.ACCPODATE, 'MM') IN ('04','05','06') THEN 'Q1'
            WHEN TO_CHAR(A.ACCPODATE, 'MM') IN ('07','08','09') THEN 'Q2'
            WHEN TO_CHAR(A.ACCPODATE, 'MM') IN ('10','11','12') THEN 'Q3'
            WHEN TO_CHAR(A.ACCPODATE, 'MM') IN ('01','02','03') THEN 'Q4'
            ELSE 'NA'
        END AS QUARTER,
        A.ACCPODATE AS DOCDATE,
        A.ACCPONO AS DOCID,
        A.ACCGROUP,
        A.ACCITEM,
        A.ACCNAME2,
        A.ACCSIZE,
        A.ALIASNAME2,
        A.SUPPLIER,
        A.ORDERNO1 AS ORDERNO,
        (A.POQTY - A.CANQTY) AS POQTY,
        A.UOM,
        A.PORATE AS PRICE,
        (A.POQTY - A.CANQTY) * A.PORATE AS AMOUNT
    FROM ACCPOREG A
    WHERE A.FINYEAR = :selectedYear
      AND A.COMPCODE = :companyName
      AND (A.POQTY - A.CANQTY) * A.PORATE > 0
)
SELECT 
    DOCID,
    DOCDATE,
    MONTH,
    ORDERNO,
    SUPPLIER,
    ACCGROUP,
    ACCITEM,
    ACCNAME2,
    ACCSIZE,
    ALIASNAME2,
    UOM,
    POQTY,
    PRICE,
    AMOUNT
FROM MAIN_CTE
WHERE QUARTER = :quarter
ORDER BY DOCID, DOCDATE
`;

    const result = await connection.execute(sql, {
      selectedYear,
      companyName,
      quarter,
    });

    let resp = result.rows?.map((po) => ({
      docId: po[0],
      docDate: po[1],
      month: po[2],
      orderNo: po[3],
      supplier: po[4],
      accessGroupName: po[5],
      accessItemName: po[6],
      accessItemDesc: po[7],
      accessSize: po[8],
      accessAliasName: po[9],
      uom: po[10],
      qty: po[11],
      price: po[12],
      amount: po[13],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getMonthGeneralTable(req, res) {
  const connection = await getConnection(res);

  try {
    const { selectedYear, companyName, month } = req.query;

    const sql = `
WITH MAIN_CTE AS (
  SELECT 
    TRIM(INITCAP(TO_CHAR(A.DOCDATE,'MONTH'))) || ' ' || TO_CHAR(A.DOCDATE,'YYYY') AS MONTHVAL,
    CASE 
      WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('04','05','06') THEN 'Q1'
      WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('07','08','09') THEN 'Q2'
      WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('10','11','12') THEN 'Q3'
      WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('01','02','03') THEN 'Q4'
      ELSE 'NA'
    END AS QUARTER,
    A.DOCDATE,
    A.DOCID,
    G.ITEMGRPNAME,
    I.ITEMNAME,
    A.SUPPLIER,
    B.POQTY-B.CANQTY AS POQTY,
    U.UNITNAME,
    B.PORATE,
    (B.POQTY-B.CANQTY)*B.PORATE AS AMOUNT
  FROM GTGENPO A
  JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
  JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
  JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
  JOIN GTITEMGRPMAST G ON G.GTITEMGRPMASTID = B.ITEMGRPNAME
  JOIN GTGENITEMMAST I ON I.GTGENITEMMASTID = B.ITEMNAME
  JOIN GTUNITMAST U ON U.GTUNITMASTID = B.UOM
  WHERE D.FINYR = :selectedYear
    AND C.COMPCODE = :companyName
    AND (B.POQTY-B.CANQTY)*B.PORATE > 0
)
SELECT DOCID, DOCDATE, MONTHVAL, SUPPLIER, ITEMGRPNAME, ITEMNAME, UNITNAME, POQTY, PORATE, AMOUNT
FROM MAIN_CTE
WHERE MONTHVAL = :month
ORDER BY DOCID, DOCDATE
`;

    // Execute query with bind parameters
    const result = await connection.execute(sql, {
      selectedYear,
      companyName,
      month,
    });

    const resp = result.rows?.map((po) => ({
      docId: po[0],
      docDate: po[1],
      month: po[2],
      supplier: po[3],
      itemGroup: po[4],
      item: po[5],
      uom: po[6],
      qty: po[7],
      rate: po[8],
      amount: po[9],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getMonthGreyYarnTable(req, res) {
  const connection = await getConnection(res);

  try {
    const { selectedYear, companyName, month } = req.query;

    const sql = `
WITH MAIN_CTE AS (
  SELECT 
    TRIM(INITCAP(TO_CHAR(A.DOCDATE,'MONTH'))) || ' ' || TO_CHAR(A.DOCDATE,'YYYY') AS MONTHVAL,
    CASE 
      WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('04','05','06') THEN 'Q1'
      WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('07','08','09') THEN 'Q2'
      WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('10','11','12') THEN 'Q3'
      WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('01','02','03') THEN 'Q4'
      ELSE 'NA'
    END AS QUARTER,
    A.DOCDATE,
    A.YPONO AS DOCID,
    A.YARN,
    A.SUPPLIER,
    A.ORDERNO,
    A.COLORNAME,
    (A.POQTY - A.CANQTY) AS POQTY,
    A.UNITNAME,
    A.PRICE AS PRICE,
    (A.POQTY - A.CANQTY) * A.PRICE AS AMOUNT
  FROM YARNPURREG A
  WHERE A.FINYR = :selectedYear
    AND A.COMPCODE = :companyName
    AND (A.POQTY - A.CANQTY) * A.PRICE > 0
)
SELECT DOCID, DOCDATE, ORDERNO, SUPPLIER, YARN, COLORNAME, UNITNAME, POQTY, PRICE, AMOUNT
FROM MAIN_CTE
WHERE MONTHVAL = :month
ORDER BY DOCID, DOCDATE
`;

    // Execute query with bind parameters
    const result = await connection.execute(sql, {
      selectedYear,
      companyName,
      month,
    });

    const resp = result.rows?.map((po) => ({
      docId: po[0],
      docDate: po[1],
      orderNo: po[2],
      supplier: po[3],
      yarnName: po[4],
      color: po[5],
      uom: po[6],
      qty: po[7],
      price: po[8],
      amount: po[9],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getMonthDyedYarnTable(req, res) {
  const connection = await getConnection(res);

  try {
    const { selectedYear, companyName, month } = req.query;

    const sql = `
WITH MAIN_CTE AS (
  SELECT 
    TRIM(INITCAP(TO_CHAR(A.DOCDATE,'MONTH'))) || ' ' || TO_CHAR(A.DOCDATE,'YYYY') AS MONTHVAL,
    CASE 
      WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('04','05','06') THEN 'Q1'
      WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('07','08','09') THEN 'Q2'
      WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('10','11','12') THEN 'Q3'
      WHEN TO_CHAR(A.DOCDATE, 'MM') IN ('01','02','03') THEN 'Q4'
      ELSE 'NA'
    END AS QUARTER,
    A.DOCDATE,
    A.DOCID,
    A.YARN,
    A.SUPPLIER,
    A.ORDERNO,
    A.COLORNAME,
    (A.POQTY - A.CANQTY) AS POQTY,
    A.UNITNAME,
    A.PRICE AS PRICE,
    (A.POQTY - A.CANQTY) * A.PRICE AS AMOUNT
  FROM DYARNPURREG A
  WHERE A.FINYR = :selectedYear
    AND A.COMPCODE = :companyName
    AND (A.POQTY - A.CANQTY) * A.PRICE > 0
)
SELECT DOCID, DOCDATE, ORDERNO, SUPPLIER, YARN, COLORNAME, UNITNAME, POQTY, PRICE, AMOUNT
FROM MAIN_CTE
WHERE MONTHVAL = :month
ORDER BY DOCID, DOCDATE
`;

    // Execute query with bind parameters
    const result = await connection.execute(sql, {
      selectedYear,
      companyName,
      month,
    });

    const resp = result.rows?.map((po) => ({
      docId: po[0],
      docDate: po[1],
      orderNo: po[2],
      supplier: po[3],
      yarnName: po[4],
      color: po[5],
      uom: po[6],
      qty: po[7],
      price: po[8],
      amount: po[9],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getMonthGreyFabricTable(req, res) {
  const connection = await getConnection(res);

  try {
    const { selectedYear, companyName, month } = req.query;

    const sql = `
WITH MAIN_CTE AS (
  SELECT 
    TRIM(INITCAP(TO_CHAR(A.PODATE,'MONTH'))) || ' ' || TO_CHAR(A.PODATE,'YYYY') AS MONTHVAL,
    CASE 
      WHEN TO_CHAR(A.PODATE, 'MM') IN ('04','05','06') THEN 'Q1'
      WHEN TO_CHAR(A.PODATE, 'MM') IN ('07','08','09') THEN 'Q2'
      WHEN TO_CHAR(A.PODATE, 'MM') IN ('10','11','12') THEN 'Q3'
      WHEN TO_CHAR(A.PODATE, 'MM') IN ('01','02','03') THEN 'Q4'
      ELSE 'NA'
    END AS QUARTER,
    A.PODATE AS DOCDATE,
    A.PONO AS DOCID,
    A.FABRIC,
    A.SUPPLIER,
    A.ORDERNO,
    A.COLOR,
    A.DESIGN,
    A.GSM,
    (A.POQTY - A.CANQTY) AS POQTY,
    A.UOM,
    A.PORATE AS PRICE,
    (A.POQTY - A.CANQTY) * A.PORATE AS AMOUNT
  FROM GFABPOREG A
  WHERE A.FINYEAR = :selectedYear
    AND A.COMPCODE = :companyName
    AND (A.POQTY - A.CANQTY) * A.PORATE > 0
)
SELECT 
    DOCID, 
    DOCDATE, 
    ORDERNO, 
    SUPPLIER, 
    FABRIC, 
    COLOR, 
    DESIGN,
    GSM,
    UOM, 
    POQTY, 
    PRICE, 
    AMOUNT
FROM MAIN_CTE
WHERE MONTHVAL = :month
ORDER BY DOCID, DOCDATE
`;

    // Execute query with bind parameters
    const result = await connection.execute(sql, {
      selectedYear,
      companyName,
      month,
    });

    const resp = result.rows?.map((po) => ({
      docId: po[0],
      docDate: po[1],
      orderNo: po[2],
      supplier: po[3],
      fabricName: po[4],
      color: po[5],
      design: po[6],
      gsm: po[7],
      uom: po[8],
      qty: po[9],
      price: po[10],
      amount: po[11],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getMonthDyedFabricTable(req, res) {
  const connection = await getConnection(res);

  try {
    const { selectedYear, companyName, month } = req.query;

    const sql = `
WITH MAIN_CTE AS (
  SELECT 
    TRIM(INITCAP(TO_CHAR(A.PODATE,'MONTH'))) || ' ' || TO_CHAR(A.PODATE,'YYYY') AS MONTHVAL,
    CASE 
      WHEN TO_CHAR(A.PODATE, 'MM') IN ('04','05','06') THEN 'Q1'
      WHEN TO_CHAR(A.PODATE, 'MM') IN ('07','08','09') THEN 'Q2'
      WHEN TO_CHAR(A.PODATE, 'MM') IN ('10','11','12') THEN 'Q3'
      WHEN TO_CHAR(A.PODATE, 'MM') IN ('01','02','03') THEN 'Q4'
      ELSE 'NA'
    END AS QUARTER,
    A.PODATE AS DOCDATE,
    A.PONO AS DOCID,
    A.FABRIC,
    A.SUPPLIER,
    A.ORDERNO,
    A.COLOR,
    A.DESIGN,
    A.GSM,
    (A.POQTY - A.CANQTY) AS POQTY,
    A.UOM,
    A.PORATE AS PRICE,
    (A.POQTY - A.CANQTY) * A.PORATE AS AMOUNT
  FROM DFABPOREG A
  WHERE A.FINYEAR = :selectedYear
    AND A.COMPCODE = :companyName
    AND (A.POQTY - A.CANQTY) * A.PORATE > 0
)
SELECT 
    DOCID, 
    DOCDATE, 
    ORDERNO, 
    SUPPLIER, 
    FABRIC, 
    COLOR, 
    DESIGN,
    GSM,
    UOM, 
    POQTY, 
    PRICE, 
    AMOUNT
FROM MAIN_CTE
WHERE MONTHVAL = :month
ORDER BY DOCID, DOCDATE
`;

    // Execute query with bind parameters
    const result = await connection.execute(sql, {
      selectedYear,
      companyName,
      month,
    });

    const resp = result.rows?.map((po) => ({
      docId: po[0],
      docDate: po[1],
      orderNo: po[2],
      supplier: po[3],
      fabricName: po[4],
      color: po[5],
      design: po[6],
      gsm: po[7],
      uom: po[8],
      qty: po[9],
      price: po[10],
      amount: po[11],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getAccessoryMonthTable(req, res) {
  const connection = await getConnection(res);

  try {
    const { selectedYear, companyName, month } = req.query;

    const sql = `
WITH MAIN_CTE AS (
  SELECT 
    TRIM(INITCAP(TO_CHAR(A.ACCPODATE,'MONTH'))) || ' ' || TO_CHAR(A.ACCPODATE,'YYYY') AS MONTHVAL,
    CASE 
      WHEN TO_CHAR(A.ACCPODATE, 'MM') IN ('04','05','06') THEN 'Q1'
      WHEN TO_CHAR(A.ACCPODATE, 'MM') IN ('07','08','09') THEN 'Q2'
      WHEN TO_CHAR(A.ACCPODATE, 'MM') IN ('10','11','12') THEN 'Q3'
      WHEN TO_CHAR(A.ACCPODATE, 'MM') IN ('01','02','03') THEN 'Q4'
      ELSE 'NA'
    END AS QUARTER,
    A.ACCPODATE AS DOCDATE,
    A.ACCPONO AS DOCID,
    A.ACCGROUP,
    A.ACCITEM,
    A.ACCNAME2,
    A.ACCSIZE,
    A.ALIASNAME2,
    A.SUPPLIER,
    A.ORDERNO1 AS ORDERNO,
    (A.POQTY - A.CANQTY) AS POQTY,
    A.UOM,
    A.PORATE AS PRICE,
    (A.POQTY - A.CANQTY) * A.PORATE AS AMOUNT
  FROM ACCPOREG A
  WHERE A.FINYEAR = :selectedYear
    AND A.COMPCODE = :companyName
    AND (A.POQTY - A.CANQTY) * A.PORATE > 0
)
SELECT 
    DOCID,
    DOCDATE,
    ORDERNO,
    SUPPLIER,
    ACCGROUP,
    ACCITEM,
    ACCNAME2,
    ACCSIZE,
    ALIASNAME2,
    UOM,
    POQTY,
    PRICE,
    AMOUNT
FROM MAIN_CTE
WHERE MONTHVAL = :month
ORDER BY DOCID, DOCDATE
`;

    const result = await connection.execute(sql, {
      selectedYear,
      companyName,
      month,
    });

    const resp = result.rows?.map((po) => ({
      docId: po[0],
      docDate: po[1],
      orderNo: po[2],
      supplier: po[3],
      accessGroupName: po[4],
      accessItemName: po[5],
      accessItemDesc: po[6],
      accessSize: po[7],
      accessAliasName: po[8],
      uom: po[9],
      qty: po[10],
      price: po[11],
      amount: po[12],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getItemBreakUp(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, itemName } = req.query;

    const sql = `
SELECT D.FINYR FINYEAR,C.COMPCODE,A.DOCDATE,A.DOCID,G.ITEMGRPNAME,I.ITEMNAME,A.SUPPLIER,B.POQTY-B.CANQTY POQTY,
U.UNITNAME,B.PORATE,(B.POQTY-B.CANQTY)*B.PORATE AMOUNT FROM GTGENPO A
JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
JOIN GTITEMGRPMAST G ON G.GTITEMGRPMASTID = B.ITEMGRPNAME
JOIN GTGENITEMMAST I ON I.GTGENITEMMASTID = B.ITEMNAME
JOIN GTUNITMAST U ON U.GTUNITMASTID = B.UOM
where D.FINYR = '${selectedYear}' AND C.COMPCODE = '${companyName}'  AND I.ITEMNAME = '${itemName}'
AND (B.POQTY-B.CANQTY)*B.PORATE > 0
ORDER BY 1,2,3
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      itemGroup: po[4],
      item: po[5],
      supplier: po[6],
      qty: po[7],
      uom: po[8],
      rate: po[9],
      amount: po[10],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getGeneralItemToptenTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, item } = req.query;

    const sql = `
SELECT D.FINYR FINYEAR,C.COMPCODE,A.DOCDATE,A.DOCID,G.ITEMGRPNAME,I.ITEMNAME,A.SUPPLIER,B.POQTY-B.CANQTY POQTY,
U.UNITNAME,B.PORATE,(B.POQTY-B.CANQTY)*B.PORATE AMOUNT FROM GTGENPO A
JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
JOIN GTITEMGRPMAST G ON G.GTITEMGRPMASTID = B.ITEMGRPNAME
JOIN GTGENITEMMAST I ON I.GTGENITEMMASTID = B.ITEMNAME
JOIN GTUNITMAST U ON U.GTUNITMASTID = B.UOM
where D.FINYR = '${selectedYear}' AND C.COMPCODE = '${companyName}' AND I.ITEMNAME = '${item}'
AND (B.POQTY-B.CANQTY)*B.PORATE > 0
ORDER BY 1,2,3
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      itemGroup: po[4],
      item: po[5],
      supplier: po[6],
      qty: po[7],
      uom: po[8],
      rate: po[9],
      amount: po[10],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getGreyYarnItemToptenTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, item } = req.query;

    const sql = `
SELECT A.FINYR,A.COMPCODE,A.DOCDATE,A.YPONO DOCID,A.YARN,A.SUPPLIER,A.ORDERNO,A.COLORNAME,(A.POQTY - A.CANQTY) POQTY,A.UNITNAME,A.PRICE PRICE, 
(A.POQTY - A.CANQTY) * A.PRICE  VAL
FROM YARNPURREG A
where A.FINYR = '${selectedYear}' AND A.COMPCODE = '${companyName}'  AND A.YARN = '${item}'
AND (A.POQTY - A.CANQTY) * A.PRICE > 0
ORDER BY A.FINYR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      yarnName: po[4],
      supplier: po[5],
      orderNo: po[6],
      color: po[7],
      qty: po[8],
      uom: po[9],
      price: po[10],
      amount: po[11],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getDyedYarnItemToptenTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, item } = req.query;

    const sql = `
SELECT A.FINYR,A.COMPCODE,A.DOCDATE,A.DOCID,A.YARN,A.SUPPLIER,A.ORDERNO,A.COLORNAME,(A.POQTY - A.CANQTY) POQTY,A.UNITNAME,
A.PRICE PRICE, (A.POQTY - A.CANQTY) * A.PRICE  VAL
FROM DYARNPURREG A
where A.FINYR = '${selectedYear}' AND A.COMPCODE = '${companyName}'  AND A.YARN = '${item}'
AND (A.POQTY - A.CANQTY) * A.PRICE > 0
ORDER BY A.FINYR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      yarnName: po[4],
      supplier: po[5],
      orderNo: po[6],
      color: po[7],
      qty: po[8],
      uom: po[9],
      price: po[10],
      amount: po[11],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getGreyFabricItemToptenTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, item } = req.query;

    const sql = `
SELECT A.FINYEAR FINYR,A.COMPCODE,A.PODATE DOCDATE,A.PONO DOCID,A.FABRIC,A.SUPPLIER,A.ORDERNO,A.COLOR,A.DESIGN,A.GSM,
(A.POQTY - A.CANQTY) POQTY,A.UOM,A.PORATE PRICE, (A.POQTY - A.CANQTY) * A.PORATE  VAL
FROM GFABPOREG A
where A.FINYEAR = '${selectedYear}' AND A.COMPCODE = '${companyName}' AND A.FABRIC = '${item}'
AND (A.POQTY - A.CANQTY) * A.PORATE > 0
ORDER BY A.FINYEAR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      fabricName: po[4],
      supplier: po[5],
      orderNo: po[6],
      color: po[7],
      design: po[8],
      gsm: po[9],
      qty: po[10],
      uom: po[11],
      price: po[12],
      amount: po[13],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getDyedFabricItemToptenTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, item } = req.query;

    const sql = `
SELECT A.FINYEAR FINYR,A.COMPCODE,A.PODATE DOCDATE,A.PONO DOCID,A.FABRIC,A.SUPPLIER,A.ORDERNO,A.COLOR,A.DESIGN,A.GSM,
(A.POQTY - A.CANQTY) POQTY,A.UOM,A.PORATE PRICE, (A.POQTY - A.CANQTY) * A.PORATE  VAL
FROM DFABPOREG A
where A.FINYEAR = '${selectedYear}' AND A.COMPCODE = '${companyName}' AND A.FABRIC = '${item}'
AND (A.POQTY - A.CANQTY) * A.PORATE > 0
ORDER BY A.FINYEAR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      fabricName: po[4],
      supplier: po[5],
      orderNo: po[6],
      color: po[7],
      design: po[8],
      gsm: po[9],
      qty: po[10],
      uom: po[11],
      price: po[12],
      amount: po[13],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getAccessoryItemToptenTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, item } = req.query;

    const sql = `
SELECT A.FINYEAR FINYR,A.COMPCODE,A.ACCPODATE DOCDATE,A.ACCPONO DOCID,A.ACCGROUP,A.ACCITEM,A.ACCNAME2,A.ACCSIZE,A.ALIASNAME2,
A.SUPPLIER,A.ORDERNO1,
(A.POQTY - A.CANQTY) POQTY,A.UOM,A.PORATE PRICE, (A.POQTY - A.CANQTY) * A.PORATE  VAL
FROM ACCPOREG A
where A.FINYEAR = '${selectedYear}' AND A.COMPCODE = '${companyName}' AND A.ACCNAME2 = '${item}'
AND  (A.POQTY - A.CANQTY) * A.PORATE > 0
ORDER BY A.FINYEAR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      accessGroupName: po[4],
      accessItemName: po[5],
      accessItemDesc: po[6],
      accessSize: po[7],
      accessAliasName: po[8],
      supplier: po[9],
      orderNo: po[10],
      qty: po[11],
      uom: po[12],
      price: po[13],
      amount: po[14],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getGeneralSupplierDelayTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;

    const sql = `
SELECT   DISTINCT DOCID,SUPPLIER, DOCDATE, DUEDATE, GRNDATE,DELAYEDDAYS
FROM PROCTBL_GENPO_INWARD
WHERE DELEVERYTYPE = 'DELAYED' AND
      COMPCODE = '${companyName}' AND 
      FINYR = '${selectedYear}' AND
      (SUPPLIER = '${supplier}' OR '${supplier}' = 'ALL')
ORDER BY DELAYEDDAYS DESC
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      docId: po[0],
      supplier: po[1],
      docDate: po[2],
      dueDate: po[3],
      grnDate: po[4],
      days: po[5],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getGreyYarnSupplierDelayTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;

    const sql = `
SELECT   DISTINCT DOCID,SUPPLIER, DOCDATE, DUEDATE, GRNDATE,DELAYEDDAYS
FROM PROCTBL_GYPO_INWARD
WHERE DELEVERYTYPE = 'DELAYED' AND
      COMPCODE = '${companyName}' AND 
      FINYR = '${selectedYear}' AND
      (SUPPLIER = '${supplier}' OR '${supplier}' = 'ALL')
ORDER BY DELAYEDDAYS DESC
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      docId: po[0],
      supplier: po[1],
      docDate: po[2],
      dueDate: po[3],
      grnDate: po[4],
      days: po[5],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getDyedYarnSupplierDelayTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;

    const sql = `
SELECT   DISTINCT DOCID,SUPPLIER, DOCDATE, DUEDATE, GRNDATE,DELAYEDDAYS
FROM PROCTBL_DYPO_INWARD
WHERE DELEVERYTYPE = 'DELAYED' AND
      COMPCODE = '${companyName}' AND 
      FINYR = '${selectedYear}' AND
      (SUPPLIER = '${supplier}' OR '${supplier}' = 'ALL')
ORDER BY DELAYEDDAYS DESC
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      docId: po[0],
      supplier: po[1],
      docDate: po[2],
      dueDate: po[3],
      grnDate: po[4],
      days: po[5],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getGreyFabricSupplierDelayTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;

    const sql = `
SELECT   DISTINCT DOCID,SUPPLIER, PODATE, DUEDATE, GRNDATE,DELAYEDDAYS
FROM   PROCTBL_GFPO_INWARD
WHERE DELEVERYTYPE = 'DELAYED' AND
      COMPCODE = '${companyName}' AND 
      FINYEAR = '${selectedYear}' AND
      (SUPPLIER = '${supplier}' OR '${supplier}' = 'ALL')
ORDER BY DELAYEDDAYS DESC
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      docId: po[0],
      supplier: po[1],
      docDate: po[2],
      dueDate: po[3],
      grnDate: po[4],
      days: po[5],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getDyedFabricSupplierDelayTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;

    const sql = `
SELECT  DISTINCT DOCID,SUPPLIER, PODATE, DUEDATE, GRNDATE,DELAYEDDAYS
FROM PROCTBL_DFPO_INWARD
WHERE DELEVERYTYPE = 'DELAYED' AND
      COMPCODE = '${companyName}' AND 
      FINYEAR = '${selectedYear}' AND
      (SUPPLIER = '${supplier}' OR '${supplier}' = 'ALL')
ORDER BY DELAYEDDAYS DESC
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      docId: po[0],
      supplier: po[1],
      docDate: po[2],
      dueDate: po[3],
      grnDate: po[4],
      days: po[5],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getAccessorySupplierDelayTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;

    const sql = `
SELECT  DISTINCT DOCID,SUPPLIER, ACCPODATE, DUEDATE, GRNDATE,DELAYEDDAYS
FROM PROCTBL_ACCPO_INWARD
WHERE DELEVERYTYPE = 'DELAYED' AND
      COMPCODE = '${companyName}' AND 
      FINYEAR = '${selectedYear}' AND
      (SUPPLIER = '${supplier}' OR '${supplier}' = 'ALL')
ORDER BY DELAYEDDAYS DESC
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      docId: po[0],
      supplier: po[1],
      docDate: po[2],
      dueDate: po[3],
      grnDate: po[4],
      days: po[5],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// ===================== Non-Delayed General=====================
export async function getGeneralSupplierNonDelayTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;
    if (!selectedYear || !companyName) {
      return res
        .status(400)
        .json({ error: "selectedYear and companyName are required" });
    }

    const sql = `
      SELECT DISTINCT DOCID,SUPPLIER, DOCDATE, DUEDATE, GRNDATE, CASE WHEN DUEDATE - GRNDATE > 0 THEN ABS(DUEDATE - GRNDATE) ELSE 0 END AS EARLIERDAYS
FROM PROCTBL_GENPO_INWARD
WHERE DELEVERYTYPE != 'DELAYED' AND
      COMPCODE = :companyName
    AND FINYR = :selectedYear
    AND (SUPPLIER = :supplier OR :supplier = 'ALL')
ORDER BY EARLIERDAYS DESC
    `;

    const result = await connection.execute(sql, {
      companyName,
      selectedYear,
      supplier,
    });
    const resp = result.rows.map((po) => ({
      docId: po[0],
      supplier: po[1],
      docDate: po[2],
      dueDate: po[3],
      grnDate: po[4],
      days: po[5],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// ===================== Non-Delayed Grey Yarn =====================
export async function getGreyYarnSupplierNonDelayTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;

    const sql = `
 SELECT DISTINCT  DOCID,SUPPLIER, 
       DOCDATE, 
       DUEDATE, 
       GRNDATE,
       CASE WHEN DUEDATE - GRNDATE > 0 THEN ABS(DUEDATE - GRNDATE) ELSE 0 END AS EARLIERDAYS
FROM PROCTBL_GYPO_INWARD
WHERE DELEVERYTYPE  != 'DELAYED' AND
       COMPCODE = :companyName
    AND FINYR = :selectedYear
    AND (SUPPLIER = :supplier OR :supplier = 'ALL')
    ORDER BY EARLIERDAYS DESC
    `;

    const result = await connection.execute(sql, {
      companyName,
      selectedYear,
      supplier,
    });
    const resp = result.rows.map((po) => ({
      docId: po[0],
      supplier: po[1],
      docDate: po[2],
      dueDate: po[3],
      grnDate: po[4],
      days: po[5],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// ===================== Non-Delayed Dyed Yarn =====================
export async function getDyedYarnSupplierNonDelayTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;

    const sql = `
SELECT DISTINCT  DOCID,SUPPLIER, 
       DOCDATE, 
       DUEDATE, 
       GRNDATE,
       CASE WHEN DUEDATE - GRNDATE > 0 THEN ABS(DUEDATE - GRNDATE) ELSE 0 END AS EARLIERDAYS
FROM PROCTBL_DYPO_INWARD
WHERE DELEVERYTYPE  != 'DELAYED' AND
       COMPCODE = :companyName
    AND FINYR = :selectedYear
    AND (SUPPLIER = :supplier OR :supplier = 'ALL')
    ORDER BY EARLIERDAYS DESC
    `;

    const result = await connection.execute(sql, {
      companyName,
      selectedYear,
      supplier,
    });
    const resp = result.rows.map((po) => ({
      docId: po[0],
      supplier: po[1],
      docDate: po[2],
      dueDate: po[3],
      grnDate: po[4],
      days: po[5],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// ===================== Non-Delayed Grey Fabric =====================
export async function getGreyFabricSupplierNonDelayTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;

    const sql = `
    SELECT DISTINCT DOCID,SUPPLIER, PODATE, DUEDATE, GRNDATE, CASE WHEN DUEDATE - GRNDATE > 0 THEN ABS(DUEDATE - GRNDATE) ELSE 0 END AS EARLIERDAYS
FROM PROCTBL_GFPO_INWARD
WHERE DELEVERYTYPE != 'DELAYED' AND
       COMPCODE = :companyName
    AND FINYEAR = :selectedYear
    AND (SUPPLIER = :supplier OR :supplier = 'ALL')
    ORDER BY EARLIERDAYS DESC
    `;

    const result = await connection.execute(sql, {
      companyName,
      selectedYear,
      supplier,
    });
    const resp = result.rows.map((po) => ({
      docId: po[0],
      supplier: po[1],
      docDate: po[2],
      dueDate: po[3],
      grnDate: po[4],
      days: po[5],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// ===================== Non-Delayed Dyed Fabric =====================
export async function getDyedFabricSupplierNonDelayTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;

    const sql = `
   SELECT DISTINCT DOCID,SUPPLIER, PODATE, DUEDATE, GRNDATE, CASE WHEN DUEDATE - GRNDATE > 0 THEN ABS(DUEDATE - GRNDATE) ELSE 0 END AS EARLIERDAYS
FROM PROCTBL_DFPO_INWARD
WHERE DELEVERYTYPE != 'DELAYED' AND
       COMPCODE = :companyName
    AND FINYEAR = :selectedYear
    AND (SUPPLIER = :supplier OR :supplier = 'ALL')
    ORDER BY EARLIERDAYS DESC
    `;

    const result = await connection.execute(sql, {
      companyName,
      selectedYear,
      supplier,
    });
    const resp = result.rows.map((po) => ({
      docId: po[0],
      supplier: po[1],
      docDate: po[2],
      dueDate: po[3],
      grnDate: po[4],
      days: po[5],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// ===================== Non-Delayed Accessory =====================
export async function getAccessorySupplierNonDelayTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear, companyName, supplier } = req.query;

    const sql = `
     SELECT DISTINCT DOCID,SUPPLIER, ACCPODATE, DUEDATE, GRNDATE, CASE WHEN DUEDATE - GRNDATE > 0 THEN ABS(DUEDATE - GRNDATE) ELSE 0 END AS EARLIERDAYS
FROM PROCTBL_ACCPO_INWARD
WHERE DELEVERYTYPE != 'DELAYED' AND
       COMPCODE = :companyName
    AND FINYEAR = :selectedYear
    AND (SUPPLIER = :supplier OR :supplier = 'ALL')
    ORDER BY EARLIERDAYS DESC
    `;

    const result = await connection.execute(sql, {
      companyName,
      selectedYear,
      supplier,
    });
    const resp = result.rows.map((po) => ({
      docId: po[0],
      supplier: po[1],
      docDate: po[2],
      dueDate: po[3],
      grnDate: po[4],
      days: po[5],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

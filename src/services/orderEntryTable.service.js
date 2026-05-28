import { getConnection } from "../constants/db.connection.js";
import oracledb from "oracledb";

// The 5 five functions are not used for Order Entry Planning Status Table breakup

export async function getOrderEntryStatusTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName, buyerCode } = req.query;
    const buyerFilter =
      buyerCode && buyerCode !== "ALL"
        ? `AND C.BUYERCODE = '${buyerCode}'`
        : "";

    //     const sql = `SELECT DISTINCT A.FINYR,A.COMPCODE,'INTERNAL ORDER' TYPENAME,A.ORDERNO,A.ORDERDATE,
    // C.BUYERNAME,A.BPONO,A.BPODATE,A.STYLEREFNO,A.COLOR,A.ORDERPACKTYPE,
    // SUM(A.SHIPQTY) ORDERQTY,SUM(A.PRODQTY) EXCESSQTY FROM ORDERALLOWDET A
    // JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.GTBUYERMASTID
    // WHERE A.COMPCODE = '${companyName}' AND A.FINYR = '${finYear}' ${buyerFilter}
    // GROUP BY A.FINYR,A.COMPCODE,A.ORDERNO,A.ORDERDATE,
    // C.BUYERNAME,A.BPONO,A.BPODATE,A.STYLEREFNO,A.COLOR,A.ORDERPACKTYPE
    // ORDER BY 1,2,3,4,5,6,7,8`;

    const sql = `SELECT A.COMPCODE,A.TYPENAME,A.ORDERNO,A.ORDERDATE,A.BUYERCODE,
A.BUYERNAME,LISTAGG(A.BPONO,',') WITHIN GROUP (ORDER BY A.BPONO) BPONO,A.STYLEREFNO,A.ORDERPACKTYPE,
SUM(A.ORDERQTY) ORDERQTY,SUM(A.EXCESSQTY) EXCESSQTY,SUM(A.AMOUNT) AMOUNT FROM (
SELECT A.COMPCODE,'INTERNAL ORDER' TYPENAME,A.ORDERNO,A.ORDERDATE,A.BUYER BUYERCODE,
C.BUYERNAME,A.BPONO,A.BPODATE,A.STYLEREFNO,A.ORDERPACKTYPE,
SUM(A.SHIPQTY) ORDERQTY,SUM(A.PRODQTY) EXCESSQTY,SUM(A.SHIPQTY* A.BUYERPRICE * A.CONVALUE) AMOUNT FROM ORDERALLOWDET A
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.GTBUYERMASTID 
WHERE A.COMPCODE = '${companyName}' AND A.FINYR = '${finYear}' ${buyerFilter}
GROUP BY A.COMPCODE,A.ORDERNO,A.ORDERDATE,A.BUYER,A.BPONO,A.BPODATE,A.STYLEREFNO,A.ORDERPACKTYPE,A.BUYER,C.BUYERNAME
) A
GROUP BY A.COMPCODE,A.TYPENAME,A.ORDERNO,A.ORDERDATE,A.BUYERCODE,A.BUYERNAME,A.STYLEREFNO,A.ORDERPACKTYPE`;

    const result = await connection.execute(sql);
    // let resp = result.rows?.map((po) => ({
    //   finYear: po[0], compCode: po[1], typeName: po[2],
    //   orderNo: po[3], orderDate: po[4], buyerName: po[5],
    //   bpoNo: po[6], bpoDate: po[7], styleRefNo: po[8],
    //   color: po[9], orderPackType: po[10], orderQty: po[11], excessQty: po[12],
    // }));
    let resp = result.rows?.map((po) => ({
      compCode: po[0],
      typeName: po[1],
      orderNo: po[2],
      orderDate: po[3],
      buyerCode: po[4],
      buyerName: po[5],
      bpoNo: po[6],
      styleRefNo: po[7],
      orderPackType: po[8],
      orderQty: po[9],
      excessQty: po[10],
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

export async function getfabricProcessPlanTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName, buyerCode } = req.query;
    const buyerFilter =
      buyerCode && buyerCode !== "ALL"
        ? `AND C.BUYERCODE = '${buyerCode}'`
        : "";

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
      finYear: po[0],
      compCode: po[1],
      typeName: po[2],
      planNo: po[3],
      planDate: po[4],
      transType: po[5],
      orderNo: po[6],
      orderDate: po[7],
      buyerName: po[8],
      age: po[9],
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
    const buyerFilter =
      buyerCode && buyerCode !== "ALL"
        ? `AND C.BUYERCODE = '${buyerCode}'`
        : "";

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
      finYear: po[0],
      compCode: po[1],
      typeName: po[2],
      accplanNo: po[3],
      accplanDate: po[4],
      transType: po[5],
      orderNo: po[6],
      orderDate: po[7],
      buyerName: po[8],
      age: po[9],
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
    const buyerFilter =
      buyerCode && buyerCode !== "ALL"
        ? `AND C.BUYERCODE = '${buyerCode}'`
        : "";

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
      finYear: po[0],
      compCode: po[1],
      typeName: po[2],
      docId: po[3],
      docDate: po[4],
      orderNo: po[5],
      orderDate: po[6],
      buyerName: po[7],
      age: po[8],
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
    const buyerFilter =
      buyerCode && buyerCode !== "ALL"
        ? `AND C.BUYERCODE = '${buyerCode}'`
        : "";

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
      finYear: po[0],
      compCode: po[1],
      typeName: po[2],
      docId: po[3],
      docDate: po[4],
      orderNo: po[5],
      orderDate: po[6],
      buyerName: po[7],
      age: po[8],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// 1. Query for Order Entry Planning Status breakup

export async function getOrderEntryStatusTableWithStatus(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName, buyerCode, typeName } = req.query; // status no longer needed
    const buyerFilter =
      buyerCode && buyerCode !== "ALL"
        ? `AND C.BUYERCODE = '${buyerCode}'`
        : "";

    let sql = "";

    /* ════════════════════════════════════════════
       INTERNAL ORDER
    ════════════════════════════════════════════ */
    if (typeName === "INTERNAL ORDER") {
      sql = `
        SELECT A.COMPCODE, A.TYPENAME, A.ORDERNO, A.ORDERDATE, A.BUYERCODE,
          A.BUYERNAME,LISTAGG(A.BPONO, ',') WITHIN GROUP (ORDER BY A.BPONO) BPONO,
          A.STYLEREFNO, A.ORDERPACKTYPE,
          SUM(A.ORDERQTY) ORDERQTY, SUM(A.EXCESSQTY) EXCESSQTY, SUM(A.AMOUNT) AMOUNT
        FROM (
          SELECT A.COMPCODE, 'INTERNAL ORDER' TYPENAME, A.ORDERNO, A.ORDERDATE,
            A.BUYER BUYERCODE, C.BUYERNAME, A.BPONO,
            A.STYLEREFNO, A.ORDERPACKTYPE,
            SUM(A.SHIPQTY) ORDERQTY,
            SUM(A.PRODQTY) EXCESSQTY,
            SUM(A.SHIPQTY * A.BUYERPRICE * A.CONVALUE) AMOUNT
          FROM ORDERALLOWDET A
          JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.GTBUYERMASTID
          WHERE A.COMPCODE = '${companyName}' AND A.ORDERTYPE = 'ORDER'
            AND A.FINYR = '${finYear}' ${buyerFilter}
          GROUP BY A.COMPCODE, A.ORDERNO, A.ORDERDATE, A.BUYER,
            C.BUYERNAME, A.BPONO, A.STYLEREFNO, A.ORDERPACKTYPE
        ) A
        GROUP BY A.COMPCODE, A.TYPENAME, A.ORDERNO, A.ORDERDATE,
          A.BUYERCODE, A.BUYERNAME, A.STYLEREFNO, A.ORDERPACKTYPE
      `;

      /* ════════════════════════════════════════════
       FABRIC PROCESS PLAN — always completed
    ════════════════════════════════════════════ */
    } else if (typeName === "FABRIC PROCESS PLAN") {
      sql = `
        SELECT DISTINCT A.FINYR, A.COMPCODE, 'FABRIC PROCESS PLAN' TYPENAME,
          B.PLANNO, B.PLANDATE, B.TRANSTYPE, A.ORDERNO, A.ORDERDATE,
          C.BUYERNAME, B.PLANDATE - A.ORDERDATE AGE
        FROM ORDERALLOWDET A
        JOIN GTFYPPLAN B ON B.ORDERNO = A.GTNORDERENTRYID
        JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.GTBUYERMASTID
        WHERE A.COMPCODE = '${companyName}' AND A.ORDERTYPE = 'ORDER'
          AND A.FINYR = '${finYear}'  AND B.TRANSTYPE = 'PLANNING' ${buyerFilter}
        GROUP BY A.FINYR, A.COMPCODE, A.ORDERNO, A.ORDERDATE,
          C.BUYERNAME, A.BPONO, A.BPODATE, A.STYLEREFNO, A.COLOR,
          A.ORDERPACKTYPE, B.PLANNO, B.PLANDATE, B.TRANSTYPE
        ORDER BY 1,2,3,4,5,6,7,8
      `;

      /* ════════════════════════════════════════════
       ACCESSORIES PLAN — always completed
    ════════════════════════════════════════════ */
    } else if (typeName === "ACCESSORIES PLAN") {
      sql = `
        SELECT DISTINCT A.FINYR, A.COMPCODE, 'ACCESSORIES PLAN' TYPENAME,
          B.ACCPLANNO, B.ACCPLANDATE, B.TRANSTYPE, A.ORDERNO, A.ORDERDATE,
          C.BUYERNAME, B.ACCPLANDATE - A.ORDERDATE AGE
        FROM ORDERALLOWDET A
        JOIN GTACCPLAN B ON B.ORDERNO = A.GTNORDERENTRYID
        JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.GTBUYERMASTID
        WHERE A.COMPCODE = '${companyName}' AND A.ORDERTYPE = 'ORDER'
          AND A.FINYR = '${finYear}' AND B.TRANSTYPE = 'PLANNING' ${buyerFilter}
        GROUP BY A.FINYR, A.COMPCODE, A.ORDERNO, A.ORDERDATE,
          C.BUYERNAME, A.BPONO, A.BPODATE, A.STYLEREFNO, A.COLOR,
          A.ORDERPACKTYPE, B.ACCPLANNO, B.ACCPLANDATE, B.TRANSTYPE
        ORDER BY 1,2,3,4,5,6,7,8
      `;

      /* ════════════════════════════════════════════
       CMT PLAN — always completed
    ════════════════════════════════════════════ */
    } else if (typeName === "CMT PLAN") {
      sql = `
        SELECT DISTINCT A.FINYR, A.COMPCODE, 'CMT PLAN' TYPENAME,
          B.DOCID, B.DOCDATE, A.ORDERNO, A.ORDERDATE,
          C.BUYERNAME, B.DOCDATE - A.ORDERDATE AGE
        FROM ORDERALLOWDET A
        JOIN GTCMTPLAN B ON B.ORDERNO = A.GTNORDERENTRYID
        JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.GTBUYERMASTID
        WHERE A.COMPCODE = '${companyName}' AND A.ORDERTYPE = 'ORDER'
          AND A.FINYR = '${finYear}' ${buyerFilter}
        GROUP BY A.FINYR, A.COMPCODE, A.ORDERNO, A.ORDERDATE,
          C.BUYERNAME, A.BPONO, A.BPODATE, A.STYLEREFNO, A.COLOR,
          A.ORDERPACKTYPE, B.DOCID, B.DOCDATE
        ORDER BY 1,2,3,4,5,6,7,8
      `;

      /* ════════════════════════════════════════════
       PRE - BUDGET — always completed
    ════════════════════════════════════════════ */
    } else if (typeName === "PRE - BUDGET") {
      sql = `
        SELECT DISTINCT A.FINYR, A.COMPCODE, 'PRE - BUDGET' TYPENAME,
          B.BUDID DOCID, B.BUDDATE DOCDATE, A.ORDERNO, A.ORDERDATE,
          C.BUYERNAME, B.BUDDATE - A.ORDERDATE AGE
        FROM ORDERALLOWDET A
        JOIN GTBM B ON B.ORDERNO = A.GTNORDERENTRYID
        JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.GTBUYERMASTID
        WHERE A.COMPCODE = '${companyName}' AND A.ORDERTYPE = 'ORDER'
          AND A.FINYR = '${finYear}' ${buyerFilter}
        GROUP BY A.FINYR, A.COMPCODE, A.ORDERNO, A.ORDERDATE,
          C.BUYERNAME, A.BPONO, A.BPODATE, A.STYLEREFNO, A.COLOR,
          A.ORDERPACKTYPE, B.BUDID, B.BUDDATE
        ORDER BY 1,2,3,4,5,6,7,8
      `;
    }

    const result = await connection.execute(sql);

    /* ── Response mapping — based on typeName only ── */
    let resp;

    if (typeName === "INTERNAL ORDER") {
      resp = result.rows?.map((po) => ({
        compCode: po[0],
        typeName: po[1],
        orderNo: po[2],
        orderDate: po[3],
        buyerCode: po[4],
        buyerName: po[5],
        bpoNo: po[6],
        styleRefNo: po[7],
        orderPackType: po[8],
        orderQty: po[9],
        excessQty: po[10],
        amount: po[11],
      }));
    } else if (typeName === "FABRIC PROCESS PLAN") {
      resp = result.rows?.map((po) => ({
        finYear: po[0],
        compCode: po[1],
        typeName: po[2],
        planNo: po[3],
        planDate: po[4],
        transType: po[5],
        orderNo: po[6],
        orderDate: po[7],
        buyerName: po[8],
        age: po[9],
      }));
    } else if (typeName === "ACCESSORIES PLAN") {
      resp = result.rows?.map((po) => ({
        finYear: po[0],
        compCode: po[1],
        typeName: po[2],
        accplanNo: po[3],
        accplanDate: po[4],
        transType: po[5],
        orderNo: po[6],
        orderDate: po[7],
        buyerName: po[8],
        age: po[9],
      }));
    } else if (typeName === "CMT PLAN") {
      resp = result.rows?.map((po) => ({
        finYear: po[0],
        compCode: po[1],
        typeName: po[2],
        docId: po[3],
        docDate: po[4],
        orderNo: po[5],
        orderDate: po[6],
        buyerName: po[7],
        age: po[8],
      }));
    } else if (typeName === "PRE - BUDGET") {
      resp = result.rows?.map((po) => ({
        finYear: po[0],
        compCode: po[1],
        typeName: po[2],
        docId: po[3],
        docDate: po[4],
        orderNo: po[5],
        orderDate: po[6],
        buyerName: po[7],
        age: po[8],
      }));
    }

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// 2. Order Entry — Buyer Wise Status Table

export async function getOrderEntryBuyerWiseStatusTable(req, res) {
  const connection = await getConnection(res);

  try {
    const { finYear, companyName, buyerCode } = req.query;

    const buyerFilter =
      buyerCode && buyerCode !== "ALL" ? `AND BUYERCODE = '${buyerCode}'` : "";

    const sql = `
      SELECT *
      FROM FABINHOUSETOPACK_V2
      WHERE COMPCODE = '${companyName}'
        AND FINYR = '${finYear}'
        ${buyerFilter}
    `;

    const result = await connection.execute(sql, [], {
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
    });
  } finally {
    await connection.close();
  }
}

// 3. Order Entry — Buyer Wise Quantity Table

export async function getOrderEntryBuyerWiseQuantityTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName, buyerCode } = req.query;
    const buyerFilter =
      buyerCode && buyerCode !== "ALL"
        ? `AND C.BUYERCODE = '${buyerCode}'`
        : "";

    const sql = `SELECT A.COMPCODE,A.TYPENAME,A.ORDERNO,A.ORDERDATE,A.BUYERCODE,
A.BUYERNAME,LISTAGG(A.BPONO,',') WITHIN GROUP (ORDER BY A.BPONO) BPONO,A.STYLEREFNO,A.ORDERPACKTYPE,
SUM(A.ORDERQTY) ORDERQTY,SUM(A.EXCESSQTY) EXCESSQTY,SUM(A.AMOUNT) AMOUNT FROM (
SELECT A.COMPCODE,'INTERNAL ORDER' TYPENAME,A.ORDERNO,A.ORDERDATE,A.BUYER BUYERCODE,
C.BUYERNAME,A.BPONO,A.BPODATE,A.STYLEREFNO,A.ORDERPACKTYPE,
SUM(A.SHIPQTY) ORDERQTY,SUM(A.PRODQTY) EXCESSQTY,SUM(A.SHIPQTY* A.BUYERPRICE * A.CONVALUE) AMOUNT FROM ORDERALLOWDET A
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.GTBUYERMASTID
WHERE A.COMPCODE = '${companyName}' AND A.FINYR = '${finYear}' ${buyerFilter}
GROUP BY A.COMPCODE,A.ORDERNO,A.ORDERDATE,A.BUYER,A.BPONO,A.BPODATE,A.STYLEREFNO,A.ORDERPACKTYPE,A.BUYER,C.BUYERNAME
) A
GROUP BY A.COMPCODE,A.TYPENAME,A.ORDERNO,A.ORDERDATE,A.BUYERCODE,A.BUYERNAME,A.STYLEREFNO,A.ORDERPACKTYPE`;

    const result = await connection.execute(sql);

    let resp = result.rows?.map((po) => ({
      compCode: po[0],
      typeName: po[1],
      orderNo: po[2],
      orderDate: po[3],
      buyerCode: po[4],
      buyerName: po[5],
      bpoNo: po[6],
      styleRefNo: po[7],
      orderPackType: po[8],
      orderQty: po[9],
      excessQty: po[10],
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

// 4. Order Entry — Buyer — PO No. Wise Quantity Table

export async function getOrderEntryBuyerPoNoWiseQtyStatusTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName, buyerCode, bpoNo } = req.query;
    const buyerFilter =
      buyerCode && buyerCode !== "ALL"
        ? `AND C.BUYERCODE = '${buyerCode}'`
        : "";
    const bpoNoFilter =
      bpoNo && bpoNo !== "ALL" ? `AND A.BPONO = '${bpoNo}'` : "";

    const sql = `SELECT A.COMPCODE,A.TYPENAME,A.ORDERNO,A.ORDERDATE,A.BUYERCODE,
A.BUYERNAME,LISTAGG(A.BPONO,',') WITHIN GROUP (ORDER BY A.BPONO) BPONO,A.STYLEREFNO,A.ORDERPACKTYPE,
SUM(A.ORDERQTY) ORDERQTY,SUM(A.EXCESSQTY) EXCESSQTY,SUM(A.AMOUNT) AMOUNT FROM (
SELECT A.COMPCODE,'INTERNAL ORDER' TYPENAME,A.ORDERNO,A.ORDERDATE,A.BUYER BUYERCODE,
C.BUYERNAME,A.BPONO,A.BPODATE,A.STYLEREFNO,A.ORDERPACKTYPE,
SUM(A.SHIPQTY) ORDERQTY,SUM(A.PRODQTY) EXCESSQTY,SUM(A.SHIPQTY* A.BUYERPRICE * A.CONVALUE) AMOUNT FROM ORDERALLOWDET A
JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.GTBUYERMASTID 
WHERE A.COMPCODE = '${companyName}' AND A.FINYR = '${finYear}' ${buyerFilter} ${bpoNoFilter}
GROUP BY A.COMPCODE,A.ORDERNO,A.ORDERDATE,A.BUYER,A.BPONO,A.BPODATE,A.STYLEREFNO,A.ORDERPACKTYPE,A.BUYER,C.BUYERNAME
) A
GROUP BY A.COMPCODE,A.TYPENAME,A.ORDERNO,A.ORDERDATE,A.BUYERCODE,A.BUYERNAME,A.STYLEREFNO,A.ORDERPACKTYPE`;

    const result = await connection.execute(sql);

    let resp = result.rows?.map((po) => ({
      compCode: po[0],
      typeName: po[1],
      orderNo: po[2],
      orderDate: po[3],
      buyerCode: po[4],
      buyerName: po[5],
      bpoNo: po[6],
      styleRefNo: po[7],
      orderPackType: po[8],
      orderQty: po[9],
      excessQty: po[10],
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

// 5. Order Entry — Style —ItemGroup Wise Qty Table

export async function getOrderEntryStyleItemGroupWiseQtyTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName, buyerCode, styleGroup, styleItem } =
      req.query;

    const buyerFilter =
      buyerCode && buyerCode !== "ALL" ? `AND A.BUYER = '${buyerCode}'` : "";
    const styleGroupFilter =
      styleGroup && styleGroup !== "ALL"
        ? `AND Z.STYLEGROUP = '${styleGroup}'`
        : "";
    const styleItemFilter =
      styleItem && styleItem !== "ALL"
        ? `AND A.STYLEITEM = '${styleItem}'`
        : "";

    const sql = `
      SELECT A.COMPCODE, A.TYPENAME, A.ORDERNO, A.ORDERDATE, A.BUYERCODE, A.BUYERNAME,
        LISTAGG(A.BPONO, ',') WITHIN GROUP (ORDER BY A.BPONO) BPONO,
        A.STYLEREFNO, A.ORDERPACKTYPE,
        SUM(A.ORDERQTY) ORDERQTY, SUM(A.EXCESSQTY) EXCESSQTY, SUM(A.AMOUNT) AMOUNT
      FROM (
        SELECT A.COMPCODE, 'INTERNAL ORDER' TYPENAME, A.ORDERNO, A.ORDERDATE,
          A.BUYER BUYERCODE, C.BUYERNAME, A.BPONO, A.BPODATE, A.STYLEREFNO, A.ORDERPACKTYPE,
          Z.STYLEGROUP, A.STYLEITEM,
          SUM(A.SHIPQTY) ORDERQTY,
          SUM(A.PRODQTY) EXCESSQTY,
          SUM(A.SHIPQTY * A.BUYERPRICE * A.CONVALUE) AMOUNT
        FROM ORDERALLOWDET A
        JOIN GTBUYERMAST C ON C.GTBUYERMASTID = A.GTBUYERMASTID
        JOIN (
          SELECT A.STYLEITEM, B.STYLEGROUP
          FROM GTSTYLEITEMMAST A
          JOIN GTSTYLEGROUPMAST B ON A.STYLEGROUP = B.GTSTYLEGROUPMASTID
        ) Z ON Z.STYLEITEM = A.STYLEITEM
        WHERE A.COMPCODE = '${companyName}'
          AND A.FINYR = '${finYear}'
          ${buyerFilter}
          ${styleGroupFilter}
          ${styleItemFilter}
        GROUP BY A.COMPCODE, A.ORDERNO, A.ORDERDATE, A.BUYER,
          A.BPONO, A.BPODATE, A.STYLEREFNO, A.ORDERPACKTYPE,
          C.BUYERNAME, Z.STYLEGROUP, A.STYLEITEM
      ) A
      GROUP BY A.COMPCODE, A.TYPENAME, A.ORDERNO, A.ORDERDATE,
        A.BUYERCODE, A.BUYERNAME, A.STYLEREFNO, A.ORDERPACKTYPE
    `;

    const result = await connection.execute(sql);

    const resp = result.rows?.map((po) => ({
      compCode: po[0],
      typeName: po[1],
      orderNo: po[2],
      orderDate: po[3],
      buyerCode: po[4],
      buyerName: po[5],
      bpoNo: po[6],
      styleRefNo: po[7],
      orderPackType: po[8],
      orderQty: po[9],
      excessQty: po[10],
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

// 6. Order Entry — Color Wise Quantity Table

export async function getOrderEntryColorWiseQtyTable(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName, buyerCode, color } = req.query;
    const buyerFilter =
      buyerCode && buyerCode !== "ALL"
        ? `AND C.BUYERCODE = '${buyerCode}'`
        : "";
    const colorFilter =
      color && color !== "ALL" ? `AND A.COLOR = '${color}'` : "";

    const sql = `SELECT A.COMPCODE,A.TYPENAME,A.ORDERNO,A.ORDERDATE,A.BUYERCODE,A.BUYERNAME,
LISTAGG(A.BPONO,',') WITHIN GROUP (ORDER BY A.BPONO) BPONO,
A.STYLEREFNO,A.ORDERPACKTYPE,A.COLOR,
SUM(A.ORDERQTY) ORDERQTY,SUM(A.EXCESSQTY) EXCESSQTY,SUM(A.AMOUNT) AMOUNT
FROM(
SELECT A.COMPCODE,'INTERNAL ORDER' TYPENAME,A.ORDERNO,A.ORDERDATE,
A.BUYER BUYERCODE,C.BUYERNAME,
A.BPONO,A.BPODATE,A.STYLEREFNO,A.ORDERPACKTYPE,
A.COLOR,
SUM(A.SHIPQTY) ORDERQTY,
SUM(A.PRODQTY) EXCESSQTY,
SUM(A.SHIPQTY*A.BUYERPRICE*A.CONVALUE) AMOUNT
FROM ORDERALLOWDET A
JOIN GTBUYERMAST C ON C.GTBUYERMASTID=A.GTBUYERMASTID
 WHERE A.COMPCODE = '${companyName}'
          AND A.FINYR = '${finYear}' ${buyerFilter} ${colorFilter}
GROUP BY A.COMPCODE,A.ORDERNO,A.ORDERDATE,A.BUYER,
A.BPONO,A.BPODATE,A.STYLEREFNO,A.ORDERPACKTYPE,
C.BUYERNAME,A.COLOR
)A
GROUP BY A.COMPCODE,A.TYPENAME,A.ORDERNO,A.ORDERDATE,
A.BUYERCODE,A.BUYERNAME,A.STYLEREFNO,A.ORDERPACKTYPE,A.COLOR`;

    const result = await connection.execute(sql);

    let resp = result.rows?.map((po) => ({
      compCode: po[0],
      typeName: po[1],
      orderNo: po[2],
      orderDate: po[3],
      buyerCode: po[4],
      buyerName: po[5],
      bpoNo: po[6],
      styleRefNo: po[7],
      orderPackType: po[8],
      color: po[9], // ✅ FIXED (you missed this)
      orderQty: po[10],
      excessQty: po[11],
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

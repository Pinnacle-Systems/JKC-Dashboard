import { getConnection } from "../constants/db.connection.js";
import oracledb from "oracledb";

// COMPCODE DROPDOWN DATA

export async function getCompany(req, res) {
  const connection = await getConnection(res);
  try {
    const { selectedYear } = req.query;

    const sql = `
SELECT C.COMPCODE  FROM GTGENPO A
JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
where D.FINYR = '${selectedYear}'
GROUP BY C.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      COMPCODE: po[0],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// combined order purchase home page

export async function getCombinedPurchase(req, res) {
  const connection = await getConnection(res);
  try {
    const { filterYear } = req.query;

    const sql = `
-- Combined purchase orders
SELECT A.FINYR, A.COMPCODE, SUM(A.VAL) AS VAL
FROM (
    -- YARN / DYARN / FAB / ACC POs
    SELECT FINYR, COMPCODE, (POQTY - CANQTY) * PRICE AS VAL
    FROM YARNPURREG
    WHERE FINYR = '${filterYear}'

    UNION ALL
    SELECT FINYR, COMPCODE, (POQTY - CANQTY) * PRICE
    FROM DYARNPURREG
    WHERE FINYR = '${filterYear}'

    UNION ALL
    SELECT FINYEAR AS FINYR, COMPCODE, (POQTY - CANQTY) * PORATE
    FROM GFABPOREG
    WHERE FINYEAR = '${filterYear}'

    UNION ALL
    SELECT FINYEAR AS FINYR, COMPCODE, (POQTY - CANQTY) * PORATE
    FROM DFABPOREG
    WHERE FINYEAR = '${filterYear}'

    UNION ALL
    SELECT FINYEAR AS FINYR, COMPCODE, (POQTY - CANQTY) * PORATE
    FROM ACCPOREG
    WHERE FINYEAR = '${filterYear}'

    -- GTGENPO data
    UNION ALL
    SELECT D.FINYR, C.COMPCODE, B.AMOUNT
    FROM GTGENPO A
    JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
    JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
    JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
    WHERE D.FINYR = '${filterYear}'

) A
GROUP BY A.FINYR, A.COMPCODE
HAVING SUM(A.VAL) > 0
ORDER BY A.FINYR, A.COMPCODE
    `;

    const result = await connection.execute(sql);
    const resp = result.rows?.map((po) => ({
      FINYEAR: po[0],
      COMPCODE: po[1],
      VAL: po[2],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving combined data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// General purchase Home page not in use

export async function getPurchase(req, res) {
  const connection = await getConnection(res);
  try {
    const { filterYear } = req.query;

    const sql = `
 SELECT D.FINYR FINYEAR,C.COMPCODE,SUM(B.AMOUNT) VAL FROM GTGENPO A
JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
where D.FINYR = '${filterYear}'
GROUP BY D.FINYR,C.COMPCODE
ORDER BY 1,2
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      FINYEAR: po[0],
      COMPCODE: po[1],
      VAL: po[2],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// order against purchase home page not in use

export async function getPurchaseOrder(req, res) {
  const connection = await getConnection(res);
  try {
    const { filterYear } = req.query;

    const sql = `
SELECT 
    A.FINYR,
    A.COMPCODE,
    SUM(A.VAL) AS VAL
FROM 
(
    SELECT A.FINYR, A.COMPCODE, (A.POQTY - A.CANQTY) * A.PRICE AS VAL 
    FROM YARNPURREG A

    UNION ALL

    SELECT A.FINYR, A.COMPCODE, (A.POQTY - A.CANQTY) * A.PRICE AS VAL
    FROM DYARNPURREG A

    UNION ALL

    SELECT A.FINYEAR AS FINYR, A.COMPCODE, (A.POQTY - A.CANQTY) * A.PORATE AS VAL
    FROM GFABPOREG A

    UNION ALL

    SELECT A.FINYEAR AS FINYR, A.COMPCODE, (A.POQTY - A.CANQTY) * A.PORATE AS VAL
    FROM DFABPOREG A

    UNION ALL

    SELECT A.FINYEAR AS FINYR, A.COMPCODE, (A.POQTY - A.CANQTY) * A.PORATE AS VAL
    FROM ACCPOREG A

) A
WHERE A.FINYR = '${filterYear}'
GROUP BY 
    A.FINYR,
    A.COMPCODE
HAVING 
    SUM(A.VAL) > 0
ORDER BY 
    A.FINYR,
    A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      FINYEAR: po[0],
      COMPCODE: po[1],
      VAL: po[2],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// order against purchase year

// export async function getPurchaseOrderYear(req, res) {
//   const connection = await getConnection(res);
//   try {
//     const { finYear, companyName } = req.query;

//     const sql = `
//     SELECT A.FINYR,A.COMPCODE,SUM(A.VAL) VAL FROM
// (
// SELECT 'GREY YARN' TYPENAME,A.FINYR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PRICE VAL FROM YARNPURREG A
// UNION ALL
// SELECT 'DYED YARN' TYPENAME,A.FINYR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PRICE VAL FROM DYARNPURREG A
// UNION ALL
// SELECT 'GREY FABRIC' TYPENAME,A.FINYEAR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM GFABPOREG  A
// UNION ALL
// SELECT 'DYED FABRIC' TYPENAME,A.FINYEAR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM DFABPOREG A
// UNION ALL
// SELECT 'ACCESSORY' TYPENAME,A.FINYEAR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM ACCPOREG  A
// ) A
// where A.FINYR = '${finYear}' AND A.COMPCODE = '${companyName}'
// GROUP BY A.FINYR,A.COMPCODE
// HAVING SUM(A.VAL) > 0
// ORDER BY 2,3,1
//      `;

//     const result = await connection.execute(sql);
//     let resp = result.rows?.map((po) => ({
//       FINYEAR: po[0],
//       COMPCODE: po[1],
//       VAL: po[2],
//     }));
//     return res.json({ statusCode: 0, data: resp });
//   } catch (err) {
//     console.error("Error retrieving data:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   } finally {
//     await connection.close();
//   }
// }

export async function getPurchaseOrderYear(req, res) {
  const connection = await getConnection(res);

  try {
    const { finYear, companyName } = req.query;

    const queries = [
      {
        name: "GREY YARN",
        sql: `
          SELECT A.FINYR, A.COMPCODE, SUM((A.POQTY-A.CANQTY)*A.PRICE) VAL
          FROM YARNPURREG A
          WHERE   A.COMPCODE = :companyName
          GROUP BY A.FINYR, A.COMPCODE
          HAVING SUM((A.POQTY-A.CANQTY)*A.PRICE) > 0
        `,
      },
      {
        name: "DYED YARN",
        sql: `
          SELECT A.FINYR, A.COMPCODE, SUM((A.POQTY-A.CANQTY)*A.PRICE) VAL
          FROM DYARNPURREG A
          WHERE   A.COMPCODE = :companyName
          GROUP BY A.FINYR, A.COMPCODE
          HAVING SUM((A.POQTY-A.CANQTY)*A.PRICE) > 0
        `,
      },
      {
        name: "GREY FABRIC",
        sql: `
          SELECT A.FINYEAR, A.COMPCODE, SUM((A.POQTY-A.CANQTY)*A.PORATE) VAL
          FROM GFABPOREG A
          WHERE  A.COMPCODE = :companyName
          GROUP BY A.FINYEAR, A.COMPCODE
          HAVING SUM((A.POQTY-A.CANQTY)*A.PORATE) > 0
        `,
      },
      {
        name: "DYED FABRIC",
        sql: `
          SELECT A.FINYEAR, A.COMPCODE, SUM((A.POQTY-A.CANQTY)*A.PORATE) VAL
          FROM DFABPOREG A
          WHERE  A.COMPCODE = :companyName
          GROUP BY A.FINYEAR, A.COMPCODE
          HAVING SUM((A.POQTY-A.CANQTY)*A.PORATE) > 0
        `,
      },
      {
        name: "ACCESSORY",
        sql: `
          SELECT A.FINYEAR, A.COMPCODE, SUM((A.POQTY-A.CANQTY)*A.PORATE) VAL
          FROM ACCPOREG A
          WHERE  A.COMPCODE = :companyName
          GROUP BY A.FINYEAR, A.COMPCODE
          HAVING SUM((A.POQTY-A.CANQTY)*A.PORATE) > 0
        `,
      },
    ];

    // Run all queries in parallel
    const results = await Promise.all(
      queries.map((q) => connection.execute(q.sql, { companyName })),
    );

    // Format and filter response: exclude rows where VAL <= 0, and exclude types with no rows
    const resp = results
      .map((result, index) => {
        const filteredData = result.rows
          .map((row) => ({
            FINYEAR: row[0],
            COMPCODE: row[1],
            VAL: row[2],
          }))
          .filter((r) => r.VAL > 0); // only keep VAL > 0

        if (filteredData.length === 0) return null; // exclude entire type if no valid rows

        return {
          type: queries[index].name,
          data: filteredData,
        };
      })
      .filter(Boolean); // remove nulls

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// general purchase  year

export async function getPurchaseGeneralYear(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
  SELECT D.FINYR FINYEAR,C.COMPCODE,SUM((B.POQTY-B.CANQTY)*B.PORATE) VAL FROM GTGENPO A
JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
where   C.COMPCODE = '${companyName}'
GROUP BY D.FINYR,C.COMPCODE
HAVING SUM((B.POQTY - B.CANQTY) * B.PORATE) > 0
ORDER BY 1,2
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      FINYEAR: po[0],
      COMPCODE: po[1],
      VAL: po[2],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// COMBINED DATA YEAR WISE WITH COMPANY PARAMS

export async function getPurchaseCombinedCOMPYear(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
  SELECT A.FINYR, A.COMPCODE, SUM(A.VAL) AS VAL
FROM (
   
    SELECT FINYR, COMPCODE, (POQTY - CANQTY) * PRICE  VAL
    FROM YARNPURREG
    WHERE  COMPCODE = '${companyName}'

    UNION ALL
    SELECT FINYR, COMPCODE, (POQTY - CANQTY) * PRICE VAL
    FROM DYARNPURREG
    WHERE  COMPCODE = '${companyName}'

    UNION ALL
    SELECT FINYEAR AS FINYR, COMPCODE, (POQTY - CANQTY) * PORATE VAL
    FROM GFABPOREG
    WHERE   COMPCODE = '${companyName}'

    UNION ALL
    SELECT FINYEAR AS FINYR, COMPCODE, (POQTY - CANQTY) * PORATE VAL
    FROM DFABPOREG
    WHERE   COMPCODE = '${companyName}'

    UNION ALL
    SELECT FINYEAR AS FINYR, COMPCODE, (POQTY - CANQTY) * PORATE VAL
    FROM ACCPOREG
    WHERE  COMPCODE = '${companyName}'

    
    UNION ALL
    SELECT D.FINYR, C.COMPCODE, SUM((B.POQTY-B.CANQTY)*B.PORATE)
    FROM GTGENPO A
    JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
    JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
    JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
    WHERE  C.COMPCODE = '${companyName}'
    GROUP BY D.FINYR, C.COMPCODE 
) A
GROUP BY A.FINYR, A.COMPCODE
HAVING SUM(A.VAL) > 0
ORDER BY A.FINYR, A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      FINYEAR: po[0],
      COMPCODE: po[1],
      VAL: po[2],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// order against purchase QuarterWise

export async function getPurchaseOrderQuarterWise(req, res) {
  const connection = await getConnection(res);

  try {
    const { finYear, companyName } = req.query;

    const queries = [
      {
        name: "GREY YARN",
        sql: `
          SELECT COMPCODE,
                 FINYR,
                 CASE 
                   WHEN TO_CHAR(DOCDATE, 'MM') IN (4,5,6) THEN 'Q1'
                   WHEN TO_CHAR(DOCDATE, 'MM') IN (7,8,9) THEN 'Q2'
                   WHEN TO_CHAR(DOCDATE, 'MM') IN (10,11,12) THEN 'Q3'
                   WHEN TO_CHAR(DOCDATE, 'MM') IN (1,2,3) THEN 'Q4'
                 END AS QUARTER,
                 TO_CHAR(DOCDATE,'MM') AS MNO,
                 TO_CHAR(DOCDATE,'YYYY') AS YNO,
                 INITCAP(TRIM(TO_CHAR(DOCDATE,'MONTH'))) || ' ' || TO_CHAR(DOCDATE,'YYYY') AS MONTH,
                 SUM((POQTY-CANQTY)*PRICE) AS VAL
          FROM YARNPURREG
          WHERE FINYR = :finYear AND COMPCODE = :companyName
          GROUP BY COMPCODE, FINYR, 
                   CASE 
                     WHEN TO_CHAR(DOCDATE, 'MM') IN (4,5,6) THEN 'Q1'
                     WHEN TO_CHAR(DOCDATE, 'MM') IN (7,8,9) THEN 'Q2'
                     WHEN TO_CHAR(DOCDATE, 'MM') IN (10,11,12) THEN 'Q3'
                     WHEN TO_CHAR(DOCDATE, 'MM') IN (1,2,3) THEN 'Q4'
                   END,
                   TO_CHAR(DOCDATE,'MM'),
                   TO_CHAR(DOCDATE,'YYYY'),
                   INITCAP(TRIM(TO_CHAR(DOCDATE,'MONTH'))) || ' ' || TO_CHAR(DOCDATE,'YYYY')
          HAVING SUM((POQTY-CANQTY)*PRICE) > 0
        `,
      },
      {
        name: "DYED YARN",
        sql: `
          SELECT COMPCODE,
                 FINYR,
                 CASE 
                   WHEN TO_CHAR(DOCDATE, 'MM') IN (4,5,6) THEN 'Q1'
                   WHEN TO_CHAR(DOCDATE, 'MM') IN (7,8,9) THEN 'Q2'
                   WHEN TO_CHAR(DOCDATE, 'MM') IN (10,11,12) THEN 'Q3'
                   WHEN TO_CHAR(DOCDATE, 'MM') IN (1,2,3) THEN 'Q4'
                 END AS QUARTER,
                 TO_CHAR(DOCDATE,'MM') AS MNO,
                 TO_CHAR(DOCDATE,'YYYY') AS YNO,
                 INITCAP(TRIM(TO_CHAR(DOCDATE,'MONTH'))) || ' ' || TO_CHAR(DOCDATE,'YYYY') AS MONTH,
                 SUM((POQTY-CANQTY)*PRICE) AS VAL
          FROM DYARNPURREG
          WHERE FINYR = :finYear AND COMPCODE = :companyName
          GROUP BY COMPCODE, FINYR, 
                   CASE 
                     WHEN TO_CHAR(DOCDATE, 'MM') IN (4,5,6) THEN 'Q1'
                     WHEN TO_CHAR(DOCDATE, 'MM') IN (7,8,9) THEN 'Q2'
                     WHEN TO_CHAR(DOCDATE, 'MM') IN (10,11,12) THEN 'Q3'
                     WHEN TO_CHAR(DOCDATE, 'MM') IN (1,2,3) THEN 'Q4'
                   END,
                   TO_CHAR(DOCDATE,'MM'),
                   TO_CHAR(DOCDATE,'YYYY'),
                   INITCAP(TRIM(TO_CHAR(DOCDATE,'MONTH'))) || ' ' || TO_CHAR(DOCDATE,'YYYY')
          HAVING SUM((POQTY-CANQTY)*PRICE) > 0
        `,
      },
      {
        name: "GREY FABRIC",
        sql: `
          SELECT COMPCODE,
                 FINYEAR AS FINYR,
                 CASE 
                   WHEN TO_CHAR(PODATE, 'MM') IN (4,5,6) THEN 'Q1'
                   WHEN TO_CHAR(PODATE, 'MM') IN (7,8,9) THEN 'Q2'
                   WHEN TO_CHAR(PODATE, 'MM') IN (10,11,12) THEN 'Q3'
                   WHEN TO_CHAR(PODATE, 'MM') IN (1,2,3) THEN 'Q4'
                 END AS QUARTER,
                 TO_CHAR(PODATE,'MM') AS MNO,
                 TO_CHAR(PODATE,'YYYY') AS YNO,
                 INITCAP(TRIM(TO_CHAR(PODATE,'MONTH'))) || ' ' || TO_CHAR(PODATE,'YYYY') AS MONTH,
                 SUM((POQTY-CANQTY)*PORATE) AS VAL
          FROM GFABPOREG
          WHERE FINYEAR = :finYear AND COMPCODE = :companyName
          GROUP BY COMPCODE, FINYEAR, 
                   CASE 
                     WHEN TO_CHAR(PODATE, 'MM') IN (4,5,6) THEN 'Q1'
                     WHEN TO_CHAR(PODATE, 'MM') IN (7,8,9) THEN 'Q2'
                     WHEN TO_CHAR(PODATE, 'MM') IN (10,11,12) THEN 'Q3'
                     WHEN TO_CHAR(PODATE, 'MM') IN (1,2,3) THEN 'Q4'
                   END,
                   TO_CHAR(PODATE,'MM'),
                   TO_CHAR(PODATE,'YYYY'),
                   INITCAP(TRIM(TO_CHAR(PODATE,'MONTH'))) || ' ' || TO_CHAR(PODATE,'YYYY')
          HAVING SUM((POQTY-CANQTY)*PORATE) > 0
        `,
      },
      {
        name: "DYED FABRIC",
        sql: `
          SELECT COMPCODE,
                 FINYEAR AS FINYR,
                 CASE 
                   WHEN TO_CHAR(PODATE, 'MM') IN (4,5,6) THEN 'Q1'
                   WHEN TO_CHAR(PODATE, 'MM') IN (7,8,9) THEN 'Q2'
                   WHEN TO_CHAR(PODATE, 'MM') IN (10,11,12) THEN 'Q3'
                   WHEN TO_CHAR(PODATE, 'MM') IN (1,2,3) THEN 'Q4'
                 END AS QUARTER,
                 TO_CHAR(PODATE,'MM') AS MNO,
                 TO_CHAR(PODATE,'YYYY') AS YNO,
                 INITCAP(TRIM(TO_CHAR(PODATE,'MONTH'))) || ' ' || TO_CHAR(PODATE,'YYYY') AS MONTH,
                 SUM((POQTY-CANQTY)*PORATE) AS VAL
          FROM DFABPOREG
          WHERE FINYEAR = :finYear AND COMPCODE = :companyName
          GROUP BY COMPCODE, FINYEAR, 
                   CASE 
                     WHEN TO_CHAR(PODATE, 'MM') IN (4,5,6) THEN 'Q1'
                     WHEN TO_CHAR(PODATE, 'MM') IN (7,8,9) THEN 'Q2'
                     WHEN TO_CHAR(PODATE, 'MM') IN (10,11,12) THEN 'Q3'
                     WHEN TO_CHAR(PODATE, 'MM') IN (1,2,3) THEN 'Q4'
                   END,
                   TO_CHAR(PODATE,'MM'),
                   TO_CHAR(PODATE,'YYYY'),
                   INITCAP(TRIM(TO_CHAR(PODATE,'MONTH'))) || ' ' || TO_CHAR(PODATE,'YYYY')
          HAVING SUM((POQTY-CANQTY)*PORATE) > 0
        `,
      },
      {
        name: "ACCESSORY",
        sql: `
          SELECT COMPCODE,
                 FINYEAR AS FINYR,
                 CASE 
                   WHEN TO_CHAR(ACCPODATE, 'MM') IN (4,5,6) THEN 'Q1'
                   WHEN TO_CHAR(ACCPODATE, 'MM') IN (7,8,9) THEN 'Q2'
                   WHEN TO_CHAR(ACCPODATE, 'MM') IN (10,11,12) THEN 'Q3'
                   WHEN TO_CHAR(ACCPODATE, 'MM') IN (1,2,3) THEN 'Q4'
                 END AS QUARTER,
                 TO_CHAR(ACCPODATE,'MM') AS MNO,
                 TO_CHAR(ACCPODATE,'YYYY') AS YNO,
                 INITCAP(TRIM(TO_CHAR(ACCPODATE,'MONTH'))) || ' ' || TO_CHAR(ACCPODATE,'YYYY') AS MONTH,
                 SUM((POQTY-CANQTY)*PORATE) AS VAL
          FROM ACCPOREG
          WHERE FINYEAR = :finYear AND COMPCODE = :companyName
          GROUP BY COMPCODE, FINYEAR, 
                   CASE 
                     WHEN TO_CHAR(ACCPODATE, 'MM') IN (4,5,6) THEN 'Q1'
                     WHEN TO_CHAR(ACCPODATE, 'MM') IN (7,8,9) THEN 'Q2'
                     WHEN TO_CHAR(ACCPODATE, 'MM') IN (10,11,12) THEN 'Q3'
                     WHEN TO_CHAR(ACCPODATE, 'MM') IN (1,2,3) THEN 'Q4'
                   END,
                   TO_CHAR(ACCPODATE,'MM'),
                   TO_CHAR(ACCPODATE,'YYYY'),
                   INITCAP(TRIM(TO_CHAR(ACCPODATE,'MONTH'))) || ' ' || TO_CHAR(ACCPODATE,'YYYY')
          HAVING SUM((POQTY-CANQTY)*PORATE) > 0
        `,
      },
    ];

    // Execute all queries in parallel
    const results = await Promise.all(
      queries.map((q) => connection.execute(q.sql, { finYear, companyName })),
    );

    // Map results into expected format
    const resp = results
      .map((result, index) => {
        const filteredData = result.rows.map((row) => ({
          company: row[0],
          finyear: row[1],
          quarter: row[2],
          monthNumber: row[3],
          yearNo: row[4],
          month: row[5], // "April 2025"
          value: row[6],
        }));

        if (!filteredData.length) return null;

        return {
          type: queries[index].name,
          data: filteredData,
        };
      })
      .filter(Boolean);

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving quarter-wise data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// general purchase Quarter wise

export async function getPurchaseGeneralQuarterWise(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
SELECT D.FINYR AS FINYEAR,
       INITCAP(TRIM(TO_CHAR(A.DOCDATE,'MONTH'))) || ' ' || TO_CHAR(A.DOCDATE,'YYYY') AS MONTH,
       CASE WHEN TO_CHAR(A.DOCDATE, 'MM') IN (4,5,6) THEN 'Q1'
		   	WHEN TO_CHAR(A.DOCDATE, 'MM') IN (7,8,9) THEN 'Q2'
		   	WHEN TO_CHAR(A.DOCDATE, 'MM') IN (10,11,12) THEN 'Q3'
		   	WHEN TO_CHAR(A.DOCDATE, 'MM') IN (1,2,3) THEN 'Q4'
		   	ELSE 'NA'
	   END QUARTER,
       C.COMPCODE AS COMPANY,
       SUM(B.AMOUNT) AS VAL,
       CASE WHEN TO_CHAR(A.DOCDATE,'MM') >= '04' 
            THEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) - 3
            ELSE TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) + 9
       END AS MONTHNUMBER,
    TO_NUMBER(TO_CHAR(A.DOCDATE,'YYYY')) AS YEARNO
FROM GTGENPO A
JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
WHERE D.FINYR = '${finYear}' AND C.COMPCODE = '${companyName}'
GROUP BY 
    D.FINYR,
    C.COMPCODE,
    INITCAP(TRIM(TO_CHAR(A.DOCDATE,'MONTH'))) || ' ' || TO_CHAR(A.DOCDATE,'YYYY'),
    CASE 
        WHEN TO_CHAR(A.DOCDATE,'MM') >= '04' 
            THEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) - 3
        ELSE 
            TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) + 9
    END,
    TO_CHAR(A.DOCDATE,'YYYY'),
     CASE WHEN TO_CHAR(A.DOCDATE, 'MM') IN (4,5,6) THEN 'Q1'
		   	WHEN TO_CHAR(A.DOCDATE, 'MM') IN (7,8,9) THEN 'Q2'
		   	WHEN TO_CHAR(A.DOCDATE, 'MM') IN (10,11,12) THEN 'Q3'
		   	WHEN TO_CHAR(A.DOCDATE, 'MM') IN (1,2,3) THEN 'Q4'
		   	ELSE 'NA'
	   END
HAVING SUM(B.AMOUNT) > 0
ORDER BY YEARNO, MONTHNUMBER
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finyear: po[0],
      month: po[1],
      quarter: po[2],
      company: po[3],
      value: po[4],
      monthNumber: po[5],
      yearNo: po[6],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// combined purchase quarter wise

export async function getCombinedPurchaseQuarterWise(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
SELECT 
    FINYEAR,
    MONTH_NAME,
    QUARTER,
    COMPANY,
    SUM(VALUE) AS VALUE,
    MONTHNUMBER,
    YEARNO
FROM (
    
    SELECT 
        A.FINYR AS FINYEAR,
        TO_CHAR(ADD_MONTHS(TRUNC(A.DOCDATE,'MM'),0),'MON') AS MONTH_NAME,
        CASE WHEN TO_CHAR(A.DOCDATE, 'MM') IN (4,5,6) THEN 'Q1'
		   	 WHEN TO_CHAR(A.DOCDATE, 'MM') IN (7,8,9) THEN 'Q2'
		   	 WHEN TO_CHAR(A.DOCDATE, 'MM') IN (10,11,12) THEN 'Q3'
		   	 WHEN TO_CHAR(A.DOCDATE, 'MM') IN (1,2,3) THEN 'Q4'
		   	 ELSE 'NA'
		END QUARTER,
        A.COMPCODE AS COMPANY,
        (A.POQTY - A.CANQTY) * A.PRICE AS VALUE,
        CASE 
            WHEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) - 3
            ELSE TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) + 9
        END AS MONTHNUMBER,
        TO_NUMBER(TO_CHAR(A.DOCDATE,'YYYY')) AS YEARNO
    FROM YARNPURREG A
    WHERE A.FINYR = '${finYear}'  AND A.COMPCODE = '${companyName}'

    UNION ALL

    SELECT 
        A.FINYR,
        TO_CHAR(ADD_MONTHS(TRUNC(A.DOCDATE,'MM'),0),'MON'),
        CASE WHEN TO_CHAR(A.DOCDATE, 'MM') IN (4,5,6) THEN 'Q1'
		   	 WHEN TO_CHAR(A.DOCDATE, 'MM') IN (7,8,9) THEN 'Q2'
		   	 WHEN TO_CHAR(A.DOCDATE, 'MM') IN (10,11,12) THEN 'Q3'
		   	 WHEN TO_CHAR(A.DOCDATE, 'MM') IN (1,2,3) THEN 'Q4'
		   	 ELSE 'NA'
		END QUARTER,
        A.COMPCODE,
        (A.POQTY - A.CANQTY) * A.PRICE,
        CASE 
            WHEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) - 3
            ELSE TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) + 9
        END,
        TO_NUMBER(TO_CHAR(A.DOCDATE,'YYYY'))
    FROM DYARNPURREG A
    WHERE A.FINYR = '${finYear}'  AND A.COMPCODE = '${companyName}'

    UNION ALL

  
    SELECT 
        A.FINYEAR,
        TO_CHAR(ADD_MONTHS(TRUNC(A.PODATE,'MM'),0),'MON'),
        CASE WHEN TO_CHAR(A.PODATE, 'MM') IN (4,5,6) THEN 'Q1'
		   	 WHEN TO_CHAR(A.PODATE, 'MM') IN (7,8,9) THEN 'Q2'
		   	 WHEN TO_CHAR(A.PODATE, 'MM') IN (10,11,12) THEN 'Q3'
		   	 WHEN TO_CHAR(A.PODATE, 'MM') IN (1,2,3) THEN 'Q4'
		   	 ELSE 'NA'
		END QUARTER,
        A.COMPCODE,
        (A.POQTY - A.CANQTY) * A.PORATE,
        CASE 
            WHEN TO_NUMBER(TO_CHAR(A.PODATE,'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.PODATE,'MM')) - 3
            ELSE TO_NUMBER(TO_CHAR(A.PODATE,'MM')) + 9
        END,
        TO_NUMBER(TO_CHAR(A.PODATE,'YYYY'))
    FROM GFABPOREG A
    WHERE A.FINYEAR = '${finYear}'  AND A.COMPCODE = '${companyName}'

    UNION ALL

    
    SELECT 
        A.FINYEAR,
        TO_CHAR(ADD_MONTHS(TRUNC(A.PODATE,'MM'),0),'MON'),
        CASE WHEN TO_CHAR(A.PODATE, 'MM') IN (4,5,6) THEN 'Q1'
		   	 WHEN TO_CHAR(A.PODATE, 'MM') IN (7,8,9) THEN 'Q2'
		   	 WHEN TO_CHAR(A.PODATE, 'MM') IN (10,11,12) THEN 'Q3'
		   	 WHEN TO_CHAR(A.PODATE, 'MM') IN (1,2,3) THEN 'Q4'
		   	 ELSE 'NA'
		END QUARTER,
        A.COMPCODE,
        (A.POQTY - A.CANQTY) * A.PORATE,
        CASE 
            WHEN TO_NUMBER(TO_CHAR(A.PODATE,'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.PODATE,'MM')) - 3
            ELSE TO_NUMBER(TO_CHAR(A.PODATE,'MM')) + 9
        END,
        TO_NUMBER(TO_CHAR(A.PODATE,'YYYY'))
    FROM DFABPOREG A
    WHERE A.FINYEAR = '${finYear}'  AND A.COMPCODE = '${companyName}'

    UNION ALL

    
    SELECT 
        A.FINYEAR,
        TO_CHAR(ADD_MONTHS(TRUNC(A.ACCPODATE,'MM'),0),'MON'),
        CASE WHEN TO_CHAR(A.ACCPODATE, 'MM') IN (4,5,6) THEN 'Q1'
		   	 WHEN TO_CHAR(A.ACCPODATE, 'MM') IN (7,8,9) THEN 'Q2'
		   	 WHEN TO_CHAR(A.ACCPODATE, 'MM') IN (10,11,12) THEN 'Q3'
		   	 WHEN TO_CHAR(A.ACCPODATE, 'MM') IN (1,2,3) THEN 'Q4'
		   	 ELSE 'NA'
		END QUARTER,
        A.COMPCODE,
        (A.POQTY - A.CANQTY) * A.PORATE,
        CASE 
            WHEN TO_NUMBER(TO_CHAR(A.ACCPODATE,'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.ACCPODATE,'MM')) - 3
            ELSE TO_NUMBER(TO_CHAR(A.ACCPODATE,'MM')) + 9
        END,
        TO_NUMBER(TO_CHAR(A.ACCPODATE,'YYYY'))
    FROM ACCPOREG A
    WHERE A.FINYEAR = '${finYear}'  AND A.COMPCODE = '${companyName}'

    UNION ALL

    SELECT 
        D.FINYR,
        TO_CHAR(ADD_MONTHS(TRUNC(A.DOCDATE,'MM'),0),'MON'),
        CASE WHEN TO_CHAR(A.DOCDATE, 'MM') IN (4,5,6) THEN 'Q1'
		   	 WHEN TO_CHAR(A.DOCDATE, 'MM') IN (7,8,9) THEN 'Q2'
		   	 WHEN TO_CHAR(A.DOCDATE, 'MM') IN (10,11,12) THEN 'Q3'
		   	 WHEN TO_CHAR(A.DOCDATE, 'MM') IN (1,2,3) THEN 'Q4'
		   	 ELSE 'NA'
		END QUARTER,
        C.COMPCODE,
        SUM(B.AMOUNT),
        CASE 
            WHEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) - 3
            ELSE TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) + 9
        END,
        TO_NUMBER(TO_CHAR(A.DOCDATE,'YYYY'))
    FROM GTGENPO A
    JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
    JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
    JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
    WHERE D.FINYR = '${finYear}'  AND C.COMPCODE = '${companyName}'
    GROUP BY 
        D.FINYR,
        C.COMPCODE,
        TO_CHAR(ADD_MONTHS(TRUNC(A.DOCDATE,'MM'),0),'MON'),
        CASE WHEN TO_CHAR(A.DOCDATE, 'MM') IN (4,5,6) THEN 'Q1'
		   	 WHEN TO_CHAR(A.DOCDATE, 'MM') IN (7,8,9) THEN 'Q2'
		   	 WHEN TO_CHAR(A.DOCDATE, 'MM') IN (10,11,12) THEN 'Q3'
		   	 WHEN TO_CHAR(A.DOCDATE, 'MM') IN (1,2,3) THEN 'Q4'
		   	 ELSE 'NA'
		END,
        CASE 
            WHEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) - 3
            ELSE TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) + 9
        END,
        TO_NUMBER(TO_CHAR(A.DOCDATE,'YYYY'))
) COMBINED
GROUP BY FINYEAR, MONTH_NAME, COMPANY, MONTHNUMBER, YEARNO,QUARTER
ORDER BY YEARNO, MONTHNUMBER
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finyear: po[0],
      month: po[1],
      quarter: po[2],
      company: po[3],
      value: po[4],
      monthNumber: po[5],
      yearNo: po[6],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// order against purchase month wise

// export async function getPurchaseOrderMonthWise(req, res) {
//   const connection = await getConnection(res);
//   try {
//     const { finYear, companyName } = req.query;

//     const sql = `
// SELECT A.FINYR,  A.Month AS Month_Name, A.COMPCODE,SUM(A.VAL) VAL,MNO,YNO FROM
// (
// SELECT A.FINYR, TO_CHAR(DOCDATE,'FMMonth YYYY') AS Monthh, TO_CHAR(DOCDATE,'MM') AS MNO, TO_CHAR(DOCDATE,'YYYY') AS YNO, A.COMPCODE,(A.POQTY-A.CANQTY)*A.PRICE VAL FROM YARNPURREG A
// UNION ALL
// SELECT A.FINYR, TO_CHAR(DOCDATE,'FMMonth YYYY') AS Monthh, TO_CHAR(DOCDATE,'MM') AS MNO, TO_CHAR(DOCDATE,'YYYY') AS YNO, A.COMPCODE,(A.POQTY-A.CANQTY)*A.PRICE VAL FROM DYARNPURREG A
// UNION ALL
// SELECT A.FINYEAR, TO_CHAR(PODATE,'FMMonth YYYY') AS Month, TO_CHAR(PODATE,'MM') AS MNO, TO_CHAR(PODATE,'YYYY') AS YNO, A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM GFABPOREG  A
// UNION ALL
// SELECT A.FINYEAR, TO_CHAR(PODATE,'FMMonth YYYY') AS Month, TO_CHAR(PODATE,'MM') AS MNO, TO_CHAR(PODATE,'YYYY') AS YNO, A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM DFABPOREG A
// UNION ALL
// SELECT A.FINYEAR, TO_CHAR(ACCPODATE,'FMMonth YYYY') AS Month, TO_CHAR(ACCPODATE,'MM') AS MNO, TO_CHAR(ACCPODATE,'YYYY') AS YNO, A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM ACCPOREG  A
// ) A
// where A.FINYR = '${finYear}' AND A.COMPCODE = '${companyName}'
// GROUP BY A.FINYR,A.COMPCODE,MONTH,MNO,YNO
// HAVING SUM(A.VAL) > 0
// ORDER BY 1,YNO,MNO
//      `;

//     const result = await connection.execute(sql);
//     let resp = result.rows?.map((po) => ({
//       finyear: po[0],
//       month: po[1],
//       company: po[2],
//       value: po[3],
//       monthNumber: po[4],
//       yearNo: po[5],
//     }));
//     return res.json({ statusCode: 0, data: resp });
//   } catch (err) {
//     console.error("Error retrieving data:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   } finally {
//     await connection.close();
//   }
// }

export async function getPurchaseOrderMonthWise(req, res) {
  const connection = await getConnection(res);

  try {
    const { finYear, companyName } = req.query;

    const queries = [
      {
        name: "GREY YARN",
        sql: `
          SELECT FINYR,
                 TO_CHAR(DOCDATE,'FMMonth YYYY') AS MONTH_NAME,
                 TO_CHAR(DOCDATE,'MM') AS MONTHNUMBER,
                 TO_CHAR(DOCDATE,'YYYY') AS YEARNO,
                 COMPCODE,
                 SUM((POQTY-CANQTY)*PRICE) AS VAL
          FROM YARNPURREG
          WHERE FINYR = :finYear AND COMPCODE = :companyName
          GROUP BY FINYR, TO_CHAR(DOCDATE,'FMMonth YYYY'), TO_CHAR(DOCDATE,'MM'), TO_CHAR(DOCDATE,'YYYY'), COMPCODE
          HAVING SUM((POQTY-CANQTY)*PRICE) > 0
          ORDER BY TO_CHAR(DOCDATE,'YYYY'), TO_CHAR(DOCDATE,'MM')
        `,
      },
      {
        name: "DYED YARN",
        sql: `
          SELECT FINYR,
                 TO_CHAR(DOCDATE,'FMMonth YYYY') AS MONTH_NAME,
                 TO_CHAR(DOCDATE,'MM') AS MONTHNUMBER,
                 TO_CHAR(DOCDATE,'YYYY') AS YEARNO,
                 COMPCODE,
                 SUM((POQTY-CANQTY)*PRICE) AS VAL
          FROM DYARNPURREG
          WHERE FINYR = :finYear AND COMPCODE = :companyName
          GROUP BY FINYR, TO_CHAR(DOCDATE,'FMMonth YYYY'), TO_CHAR(DOCDATE,'MM'), TO_CHAR(DOCDATE,'YYYY'), COMPCODE
          HAVING SUM((POQTY-CANQTY)*PRICE) > 0
          ORDER BY TO_CHAR(DOCDATE,'YYYY'), TO_CHAR(DOCDATE,'MM')
        `,
      },
      {
        name: "GREY FABRIC",
        sql: `
          SELECT FINYEAR AS FINYR,
                 TO_CHAR(PODATE,'FMMonth YYYY') AS MONTH_NAME,
                 TO_CHAR(PODATE,'MM') AS MONTHNUMBER,
                 TO_CHAR(PODATE,'YYYY') AS YEARNO,
                 COMPCODE,
                 SUM((POQTY-CANQTY)*PORATE) AS VAL
          FROM GFABPOREG
          WHERE FINYEAR = :finYear AND COMPCODE = :companyName
          GROUP BY FINYEAR, TO_CHAR(PODATE,'FMMonth YYYY'), TO_CHAR(PODATE,'MM'), TO_CHAR(PODATE,'YYYY'), COMPCODE
          HAVING SUM((POQTY-CANQTY)*PORATE) > 0
          ORDER BY TO_CHAR(PODATE,'YYYY'), TO_CHAR(PODATE,'MM')
        `,
      },
      {
        name: "DYED FABRIC",
        sql: `
          SELECT FINYEAR AS FINYR,
                 TO_CHAR(PODATE,'FMMonth YYYY') AS MONTH_NAME,
                 TO_CHAR(PODATE,'MM') AS MONTHNUMBER,
                 TO_CHAR(PODATE,'YYYY') AS YEARNO,
                 COMPCODE,
                 SUM((POQTY-CANQTY)*PORATE) AS VAL
          FROM DFABPOREG
          WHERE FINYEAR = :finYear AND COMPCODE = :companyName
          GROUP BY FINYEAR, TO_CHAR(PODATE,'FMMonth YYYY'), TO_CHAR(PODATE,'MM'), TO_CHAR(PODATE,'YYYY'), COMPCODE
          HAVING SUM((POQTY-CANQTY)*PORATE) > 0
          ORDER BY TO_CHAR(PODATE,'YYYY'), TO_CHAR(PODATE,'MM')
        `,
      },
      {
        name: "ACCESSORY",
        sql: `
          SELECT FINYEAR AS FINYR,
                 TO_CHAR(ACCPODATE,'FMMonth YYYY') AS MONTH_NAME,
                 TO_CHAR(ACCPODATE,'MM') AS MONTHNUMBER,
                 TO_CHAR(ACCPODATE,'YYYY') AS YEARNO,
                 COMPCODE,
                 SUM((POQTY-CANQTY)*PORATE) AS VAL
          FROM ACCPOREG
          WHERE FINYEAR = :finYear AND COMPCODE = :companyName
          GROUP BY FINYEAR, TO_CHAR(ACCPODATE,'FMMonth YYYY'), TO_CHAR(ACCPODATE,'MM'), TO_CHAR(ACCPODATE,'YYYY'), COMPCODE
          HAVING SUM((POQTY-CANQTY)*PORATE) > 0
          ORDER BY TO_CHAR(ACCPODATE,'YYYY'), TO_CHAR(ACCPODATE,'MM')
        `,
      },
    ];

    // Run all queries in parallel
    const results = await Promise.all(
      queries.map((q) => connection.execute(q.sql, { finYear, companyName })),
    );

    const resp = results
      .map((result, index) => {
        const filteredData = result.rows
          .map((row) => ({
            finyear: row[0], // <-- added FINYR here
            month: row[1],
            monthNumber: row[2],
            yearNo: row[3],
            company: row[4],
            value: row[5],
          }))
          .filter((r) => r.value > 0);

        if (filteredData.length === 0) return null;

        return {
          type: queries[index].name,
          data: filteredData,
        };
      })
      .filter(Boolean);

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// general purchase order month wise

export async function getGenaralPurchaseMonthWise(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
SELECT 
    D.FINYR AS FINYEAR,
    TO_CHAR(A.DOCDATE, 'FMMonth YYYY') AS MONTH,
    C.COMPCODE AS COMPANY,
    SUM((B.POQTY-B.CANQTY)*B.PORATE) AS VAL,
    CASE 
        WHEN TO_CHAR(A.DOCDATE,'MM') >= '04' 
            THEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) - 3
        ELSE 
            TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) + 9
    END AS MONTHNUMBER,
    TO_NUMBER(TO_CHAR(A.DOCDATE,'YYYY')) AS YEARNO
FROM GTGENPO A
JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
WHERE D.FINYR = '${finYear}' 
  AND C.COMPCODE = '${companyName}'
GROUP BY 
    D.FINYR,
    C.COMPCODE,
    TO_CHAR(A.DOCDATE, 'FMMonth YYYY'),
    CASE 
        WHEN TO_CHAR(A.DOCDATE,'MM') >= '04' 
            THEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) - 3
        ELSE 
            TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) + 9
    END,
    TO_CHAR(A.DOCDATE,'YYYY')
HAVING SUM((B.POQTY-B.CANQTY)*B.PORATE) > 0
ORDER BY YEARNO, MONTHNUMBER
`;

    const result = await connection.execute(sql);

    const resp = result.rows?.map((po) => ({
      finyear: po[0],
      month: po[1],
      company: po[2],
      value: po[3],
      monthNumber: po[4],
      yearNo: po[5],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// combined purchase month

export async function getCombinedPurchaseOrderMonthWise(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
 SELECT 
    FINYEAR,
    MONTH_NAME,
    COMPANY,
    SUM(VALUE) AS VALUE,
    MONTHNUMBER,
    YEARNO
FROM (
    
    SELECT 
        A.FINYR AS FINYEAR,
        TO_CHAR(ADD_MONTHS(TRUNC(A.DOCDATE,'MM'),0),'MON') AS MONTH_NAME,
        A.COMPCODE AS COMPANY,
        (A.POQTY - A.CANQTY) * A.PRICE AS VALUE,
        CASE 
            WHEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) - 3
            ELSE TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) + 9
        END AS MONTHNUMBER,
        TO_NUMBER(TO_CHAR(A.DOCDATE,'YYYY')) AS YEARNO
    FROM YARNPURREG A
    WHERE A.FINYR = '${finYear}'  AND A.COMPCODE = '${companyName}'

    UNION ALL

    SELECT 
        A.FINYR,
        TO_CHAR(ADD_MONTHS(TRUNC(A.DOCDATE,'MM'),0),'MON'),
        A.COMPCODE,
        (A.POQTY - A.CANQTY) * A.PRICE,
        CASE 
            WHEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) - 3
            ELSE TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) + 9
        END,
        TO_NUMBER(TO_CHAR(A.DOCDATE,'YYYY'))
    FROM DYARNPURREG A
    WHERE A.FINYR = '${finYear}'  AND A.COMPCODE = '${companyName}'

    UNION ALL

  
    SELECT 
        A.FINYEAR,
        TO_CHAR(ADD_MONTHS(TRUNC(A.PODATE,'MM'),0),'MON'),
        A.COMPCODE,
        (A.POQTY - A.CANQTY) * A.PORATE,
        CASE 
            WHEN TO_NUMBER(TO_CHAR(A.PODATE,'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.PODATE,'MM')) - 3
            ELSE TO_NUMBER(TO_CHAR(A.PODATE,'MM')) + 9
        END,
        TO_NUMBER(TO_CHAR(A.PODATE,'YYYY'))
    FROM GFABPOREG A
    WHERE A.FINYEAR = '${finYear}'  AND A.COMPCODE = '${companyName}'

    UNION ALL

    
    SELECT 
        A.FINYEAR,
        TO_CHAR(ADD_MONTHS(TRUNC(A.PODATE,'MM'),0),'MON'),
        A.COMPCODE,
        (A.POQTY - A.CANQTY) * A.PORATE,
        CASE 
            WHEN TO_NUMBER(TO_CHAR(A.PODATE,'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.PODATE,'MM')) - 3
            ELSE TO_NUMBER(TO_CHAR(A.PODATE,'MM')) + 9
        END,
        TO_NUMBER(TO_CHAR(A.PODATE,'YYYY'))
    FROM DFABPOREG A
    WHERE A.FINYEAR = '${finYear}'  AND A.COMPCODE = '${companyName}'

    UNION ALL

    
    SELECT 
        A.FINYEAR,
        TO_CHAR(ADD_MONTHS(TRUNC(A.ACCPODATE,'MM'),0),'MON'),
        A.COMPCODE,
        (A.POQTY - A.CANQTY) * A.PORATE,
        CASE 
            WHEN TO_NUMBER(TO_CHAR(A.ACCPODATE,'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.ACCPODATE,'MM')) - 3
            ELSE TO_NUMBER(TO_CHAR(A.ACCPODATE,'MM')) + 9
        END,
        TO_NUMBER(TO_CHAR(A.ACCPODATE,'YYYY'))
    FROM ACCPOREG A
    WHERE A.FINYEAR = '${finYear}'  AND A.COMPCODE = '${companyName}'

    UNION ALL

    SELECT 
        D.FINYR,
        TO_CHAR(ADD_MONTHS(TRUNC(A.DOCDATE,'MM'),0),'MON'),
        C.COMPCODE,
        SUM(B.AMOUNT),
        CASE 
            WHEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) - 3
            ELSE TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) + 9
        END,
        TO_NUMBER(TO_CHAR(A.DOCDATE,'YYYY'))
    FROM GTGENPO A
    JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
    JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
    JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
    WHERE D.FINYR = '${finYear}'  AND C.COMPCODE = '${companyName}'
    GROUP BY 
        D.FINYR,
        C.COMPCODE,
        TO_CHAR(ADD_MONTHS(TRUNC(A.DOCDATE,'MM'),0),'MON'),
        CASE 
            WHEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) - 3
            ELSE TO_NUMBER(TO_CHAR(A.DOCDATE,'MM')) + 9
        END,
        TO_NUMBER(TO_CHAR(A.DOCDATE,'YYYY'))
) COMBINED
GROUP BY FINYEAR, MONTH_NAME, COMPANY, MONTHNUMBER, YEARNO
ORDER BY YEARNO, MONTHNUMBER
 `;

    const result = await connection.execute(sql);

    const resp = result.rows?.map((po) => ({
      finyear: po[0],
      month: po[1],
      company: po[2],
      value: po[3],
      monthNumber: po[4],
      yearNo: po[5],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// top ten supplier order against

export async function getTopTenSupplierOrder(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const queries = [
      {
        name: "GREY YARN",
        sql: `
          SELECT *
FROM (
    SELECT A.FINYR,A.COMPCODE,A.SUPPLIER,SUM((A.POQTY - A.CANQTY) * A.PRICE) AS VAL
    FROM YARNPURREG A
   WHERE A.FINYR = :finYear AND A.COMPCODE = :companyName
    GROUP BY A.FINYR, A.COMPCODE, A.SUPPLIER
    ORDER BY VAL DESC
)
WHERE ROWNUM <= 10
        `,
      },
      {
        name: "DYED YARN",
        sql: `
  SELECT *      FROM (
          SELECT A.FINYR, A.COMPCODE, A.SUPPLIER,SUM((A.POQTY-A.CANQTY)*A.PRICE) VAL
          FROM DYARNPURREG A
          WHERE A.FINYR = :finYear AND A.COMPCODE = :companyName
          GROUP BY A.FINYR, A.COMPCODE,A.SUPPLIER    
          ORDER BY VAL DESC
)
WHERE ROWNUM <= 10
        `,
      },
      {
        name: "GREY FABRIC",
        sql: `
  SELECT *      FROM (  SELECT A.FINYEAR, A.COMPCODE, A.SUPPLIER,SUM((A.POQTY-A.CANQTY)*A.PORATE) VAL
          FROM GFABPOREG A
          WHERE A.FINYEAR = :finYear AND A.COMPCODE = :companyName
          GROUP BY A.FINYEAR, A.COMPCODE,A.SUPPLIER
                    ORDER BY VAL DESC
)
WHERE ROWNUM <= 10
        `,
      },
      {
        name: "DYED FABRIC",
        sql: `
  SELECT *       FROM (  SELECT A.FINYEAR, A.COMPCODE, A.SUPPLIER,SUM((A.POQTY-A.CANQTY)*A.PORATE) VAL
          FROM DFABPOREG A
          WHERE A.FINYEAR = :finYear AND A.COMPCODE = :companyName
          GROUP BY A.FINYEAR, A.COMPCODE,A.SUPPLIER
                           ORDER BY VAL DESC
)
WHERE ROWNUM <= 10
        `,
      },
      {
        name: "ACCESSORY",
        sql: `
  SELECT *       FROM ( SELECT A.FINYEAR, A.COMPCODE, A.SUPPLIER,SUM((A.POQTY-A.CANQTY)*A.PORATE) VAL
          FROM ACCPOREG A
          WHERE A.FINYEAR = :finYear AND A.COMPCODE = :companyName
          GROUP BY A.FINYEAR, A.COMPCODE,A.SUPPLIER
                                     ORDER BY VAL DESC
)
WHERE ROWNUM <= 10
        `,
      },
    ];

    // Run all queries in parallel
    const results = await Promise.all(
      queries.map((q) => connection.execute(q.sql, { finYear, companyName })),
    );

    // Format and filter response: exclude rows where VAL <= 0, and exclude types with no rows
    const resp = results
      .map((result, index) => {
        const filteredData = result.rows
          .map((row) => ({
            FINYEAR: row[0],
            COMPCODE: row[1],
            SUPPLIER: row[2],
            VAL: row[3],
          }))
          .filter((r) => r.VAL > 0); // only keep VAL > 0

        if (filteredData.length === 0) return null; // exclude entire type if no valid rows

        return {
          type: queries[index].name,
          data: filteredData,
        };
      })
      .filter(Boolean); // remove nulls

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// top ten supplier against general

export async function getTopTenSupplierGeneral(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `

SELECT *
FROM (
    SELECT A.SUPPLIER,C.COMPCODE,D.FINYR, SUM((B.POQTY-B.CANQTY)*B.PORATE) AS VAL
    FROM GTGENPO A
    JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
    JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
    JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
    WHERE D.FINYR = '${finYear}' AND C.COMPCODE = '${companyName}'
    GROUP BY A.SUPPLIER,D.FINYR,C.COMPCODE
    ORDER BY SUM((B.POQTY-B.CANQTY)*B.PORATE) DESC
)
WHERE ROWNUM <= 10
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      supplierName: po[0],
      compCode: po[1],
      finYear: po[2],
      TOTAL_VAL: po[3],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// top ten supplier combined

export async function getTopTenSupplierCombined(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
WITH Combined AS (
    SELECT A.SUPPLIER, (A.POQTY-A.CANQTY)*A.PRICE AS VAL
    FROM YARNPURREG A
    WHERE (A.POQTY-A.CANQTY)*A.PRICE > 0 AND A.FINYR = '${finYear}' AND A.COMPCODE = '${companyName}'

    UNION ALL
    SELECT A.SUPPLIER, (A.POQTY-A.CANQTY)*A.PRICE
    FROM DYARNPURREG A
    WHERE (A.POQTY-A.CANQTY)*A.PRICE > 0 AND A.FINYR = '${finYear}' AND A.COMPCODE = '${companyName}'

    UNION ALL
    SELECT A.SUPPLIER, (A.POQTY-A.CANQTY)*A.PORATE
    FROM GFABPOREG A
    WHERE (A.POQTY-A.CANQTY)*A.PORATE > 0 AND A.FINYEAR = '${finYear}' AND A.COMPCODE = '${companyName}'

    UNION ALL
    SELECT A.SUPPLIER, (A.POQTY-A.CANQTY)*A.PORATE
    FROM DFABPOREG A
    WHERE (A.POQTY-A.CANQTY)*A.PORATE > 0 AND A.FINYEAR = '${finYear}' AND A.COMPCODE = '${companyName}'

    UNION ALL
    SELECT A.SUPPLIER, (A.POQTY-A.CANQTY)*A.PORATE
    FROM ACCPOREG A
    WHERE (A.POQTY-A.CANQTY)*A.PORATE > 0 AND A.FINYEAR = '${finYear}' AND A.COMPCODE = '${companyName}'

    UNION ALL
   
    SELECT A.SUPPLIER, SUM((B.POQTY-B.CANQTY)*B.PORATE)
    FROM GTGENPO A
    JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
    JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
    JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
    WHERE D.FINYR = '${finYear}' AND C.COMPCODE = '${companyName}'
    GROUP BY A.SUPPLIER
)
SELECT *
FROM (
    SELECT SUPPLIER, SUM(VAL) AS TOTAL_VAL
    FROM Combined
    GROUP BY SUPPLIER
    ORDER BY SUM(VAL) DESC
)
WHERE ROWNUM <= 10
`;

    const result = await connection.execute(sql);
    const resp = result.rows?.map((po) => ({
      supplierName: po[0],
      TOTAL_VAL: po[1],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// supplier getting

export async function getTopSupplierListGreyYarn(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT *
      FROM (
        SELECT A.FINYR, A.COMPCODE, A.SUPPLIER,
               SUM((A.POQTY - A.CANQTY) * A.PRICE) AS VAL
        FROM YARNPURREG A
        WHERE A.FINYR = :finYear AND A.COMPCODE = :companyName
        GROUP BY A.FINYR, A.COMPCODE, A.SUPPLIER
        ORDER BY VAL DESC
      )
      WHERE ROWNUM <= 10
    `;

    const result = await connection.execute(sql, { finYear, companyName });

    const resp = result.rows.map((row) => ({
      supplier: row[2],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getTopSupplierListDyedYarn(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT *
      FROM (
        SELECT A.FINYR, A.COMPCODE, A.SUPPLIER,
               SUM((A.POQTY - A.CANQTY) * A.PRICE) AS VAL
        FROM DYARNPURREG A
        WHERE A.FINYR = :finYear AND A.COMPCODE = :companyName
        GROUP BY A.FINYR, A.COMPCODE, A.SUPPLIER
        ORDER BY VAL DESC
      )
      WHERE ROWNUM <= 10
    `;

    const result = await connection.execute(sql, { finYear, companyName });

    const resp = result.rows.map((row) => ({
      supplier: row[2],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getTopSupplierListGreyFabric(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT *
      FROM (
        SELECT A.FINYEAR, A.COMPCODE, A.SUPPLIER,
               SUM((A.POQTY - A.CANQTY) * A.PORATE) AS VAL
        FROM GFABPOREG A
        WHERE A.FINYEAR = :finYear AND A.COMPCODE = :companyName
        GROUP BY A.FINYEAR, A.COMPCODE, A.SUPPLIER
        ORDER BY VAL DESC
      )
      WHERE ROWNUM <= 10
    `;

    const result = await connection.execute(sql, { finYear, companyName });

    const resp = result.rows.map((row) => ({
      supplier: row[2],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getTopSupplierListDyedFabric(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT *
      FROM (
        SELECT A.FINYEAR, A.COMPCODE, A.SUPPLIER,
               SUM((A.POQTY - A.CANQTY) * A.PORATE) AS VAL
        FROM DFABPOREG A
        WHERE A.FINYEAR = :finYear AND A.COMPCODE = :companyName
        GROUP BY A.FINYEAR, A.COMPCODE, A.SUPPLIER
        ORDER BY VAL DESC
      )
      WHERE ROWNUM <= 10
    `;

    const result = await connection.execute(sql, { finYear, companyName });

    const resp = result.rows.map((row) => ({
      supplier: row[2],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getTopSupplierListAccessory(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT *
      FROM (
        SELECT A.FINYEAR, A.COMPCODE, A.SUPPLIER,
               SUM((A.POQTY - A.CANQTY) * A.PORATE) AS VAL
        FROM ACCPOREG A
        WHERE A.FINYEAR = :finYear AND A.COMPCODE = :companyName
        GROUP BY A.FINYEAR, A.COMPCODE, A.SUPPLIER
        ORDER BY VAL DESC
      )
      WHERE ROWNUM <= 10
    `;

    const result = await connection.execute(sql, { finYear, companyName });

    const resp = result.rows.map((row) => ({
      supplier: row[2],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// top items against order

export async function getTopTenItemsOrder(req, res) {
  const connection = await getConnection(res);

  try {
    const { finYear, companyName } = req.query;

    const queries = [
      {
        name: "GREY YARN",
        sql: `
          SELECT *
          FROM (
            SELECT A.FINYR, A.COMPCODE, A.YARN AS ITEM, 
                   SUM((A.POQTY - A.CANQTY) * A.PRICE) AS VAL
            FROM YARNPURREG A
            WHERE A.FINYR = :finYear AND A.COMPCODE = :companyName
            GROUP BY A.FINYR, A.COMPCODE, A.YARN
            ORDER BY VAL DESC
          )
          WHERE ROWNUM <= 10
        `,
      },
      {
        name: "DYED YARN",
        sql: `
          SELECT *
          FROM (
            SELECT A.FINYR, A.COMPCODE, A.YARN AS ITEM,
                   SUM((A.POQTY - A.CANQTY) * A.PRICE) VAL
            FROM DYARNPURREG A
            WHERE A.FINYR = :finYear AND A.COMPCODE = :companyName
            GROUP BY A.FINYR, A.COMPCODE, A.YARN
            ORDER BY VAL DESC
          )
          WHERE ROWNUM <= 10
        `,
      },
      {
        name: "GREY FABRIC",
        sql: `
          SELECT *
          FROM (
            SELECT A.FINYEAR, A.COMPCODE, A.FABRIC AS ITEM,
                   SUM((A.POQTY - A.CANQTY) * A.PORATE) VAL
            FROM GFABPOREG A
            WHERE A.FINYEAR = :finYear AND A.COMPCODE = :companyName
            GROUP BY A.FINYEAR, A.COMPCODE, A.FABRIC
            ORDER BY VAL DESC
          )
          WHERE ROWNUM <= 10
        `,
      },
      {
        name: "DYED FABRIC",
        sql: `
          SELECT *
          FROM (
            SELECT A.FINYEAR, A.COMPCODE, A.FABRIC AS ITEM,
                   SUM((A.POQTY - A.CANQTY) * A.PORATE) VAL
            FROM DFABPOREG A
            WHERE A.FINYEAR = :finYear AND A.COMPCODE = :companyName
            GROUP BY A.FINYEAR, A.COMPCODE, A.FABRIC
            ORDER BY VAL DESC
          )
          WHERE ROWNUM <= 10
        `,
      },
      {
        name: "ACCESSORY",
        sql: `
          SELECT *
          FROM (
            SELECT A.FINYEAR, A.COMPCODE, A.ACCNAME2 AS ITEM,
                   SUM((A.POQTY - A.CANQTY) * A.PORATE) VAL
            FROM ACCPOREG A
            WHERE A.FINYEAR = :finYear AND A.COMPCODE = :companyName
            GROUP BY A.FINYEAR, A.COMPCODE, A.ACCNAME2
            ORDER BY VAL DESC
          )
          WHERE ROWNUM <= 10
        `,
      },
    ];

    // Execute all queries in parallel
    const results = await Promise.all(
      queries.map((q) => connection.execute(q.sql, { finYear, companyName })),
    );

    // Format response
    const resp = results
      .map((result, index) => {
        const filteredData = result.rows
          .map((row) => ({
            FINYEAR: row[0],
            COMPCODE: row[1],
            ITEM: row[2],
            VAL: row[3],
          }))
          .filter((r) => r.VAL > 0);

        if (filteredData.length === 0) return null;

        return {
          type: queries[index].name,
          data: filteredData,
        };
      })
      .filter(Boolean);

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// top ten iTEMS against general

export async function getTopTenItemsGeneral(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `


SELECT *
FROM (
    SELECT I.ITEMNAME,C.COMPCODE,D.FINYR, SUM((B.POQTY-B.CANQTY)*B.PORATE) AS VAL
    FROM GTGENPO A
    JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
    JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
    JOIN GTGENITEMMAST I ON I.GTGENITEMMASTID = B.ITEMNAME
    JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
    WHERE D.FINYR = '${finYear}' AND C.COMPCODE = '${companyName}'
    GROUP BY I.ITEMNAME,D.FINYR,C.COMPCODE
    ORDER BY SUM(B.AMOUNT) DESC
)
WHERE ROWNUM <= 10
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      ITEM: po[0],
      COMPCODE: po[1],
      FINYEAR: po[2],
      VAL: po[3],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

//top items combined

export async function getTopTenItemsCombined(req, res) {
  const connection = await getConnection(res);

  try {
    const { finYear, companyName } = req.query;

    const sql = `
WITH Combined AS (
    SELECT A.YARN AS ITEM, (A.POQTY-A.CANQTY)*A.PRICE AS VAL
    FROM YARNPURREG A
    WHERE (A.POQTY-A.CANQTY)*A.PRICE > 0 
      AND A.FINYR = :finYear 
      AND A.COMPCODE = :companyName

    UNION ALL

    SELECT A.YARN AS ITEM, (A.POQTY-A.CANQTY)*A.PRICE
    FROM DYARNPURREG A
    WHERE (A.POQTY-A.CANQTY)*A.PRICE > 0 
      AND A.FINYR = :finYear 
      AND A.COMPCODE = :companyName

    UNION ALL

    SELECT A.FABRIC AS ITEM, (A.POQTY-A.CANQTY)*A.PORATE
    FROM GFABPOREG A
    WHERE (A.POQTY-A.CANQTY)*A.PORATE > 0 
      AND A.FINYEAR = :finYear 
      AND A.COMPCODE = :companyName

    UNION ALL

    SELECT A.FABRIC AS ITEM, (A.POQTY-A.CANQTY)*A.PORATE
    FROM DFABPOREG A
    WHERE (A.POQTY-A.CANQTY)*A.PORATE > 0 
      AND A.FINYEAR = :finYear 
      AND A.COMPCODE = :companyName

    UNION ALL

    SELECT A.ACCNAME2 AS ITEM, (A.POQTY-A.CANQTY)*A.PORATE
    FROM ACCPOREG A
    WHERE (A.POQTY-A.CANQTY)*A.PORATE > 0 
      AND A.FINYEAR = :finYear 
      AND A.COMPCODE = :companyName

    UNION ALL

    SELECT I.ITEMNAME AS ITEM, SUM((B.POQTY-B.CANQTY)*B.PORATE) AS VAL
    FROM GTGENPO A
    JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
    JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
    JOIN GTGENITEMMAST I ON I.GTGENITEMMASTID = B.ITEMNAME
    JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
    WHERE D.FINYR = :finYear 
      AND C.COMPCODE = :companyName
    GROUP BY I.ITEMNAME
)
SELECT *
FROM (
    SELECT ITEM, SUM(VAL) AS TOTAL_VAL
    FROM Combined
    GROUP BY ITEM
    ORDER BY SUM(VAL) DESC
)
WHERE ROWNUM <= 10
`;

    const result = await connection.execute(sql, { finYear, companyName });

    const resp = result.rows?.map((po) => ({
      ITEM: po[0],
      VAL: po[1],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// order against raw material wise

export async function getPurchaseOrderMaterial(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
SELECT A.TYPENAME,A.FINYR,A.COMPCODE,SUM(A.VAL) VAL FROM 
(
SELECT 'GREY YARN' TYPENAME,A.FINYR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PRICE VAL FROM YARNPURREG A
UNION ALL
SELECT 'DYED YARN' TYPENAME,A.FINYR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PRICE VAL FROM DYARNPURREG A
UNION ALL
SELECT 'GREY FABRIC' TYPENAME,A.FINYEAR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM GFABPOREG  A
UNION ALL
SELECT 'DYED FABRIC' TYPENAME,A.FINYEAR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM DFABPOREG A
UNION ALL
SELECT 'ACCESSORY' TYPENAME,A.FINYEAR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM ACCPOREG  A
) A
where A.FINYR = '${finYear}' AND A.COMPCODE = '${companyName}' 
GROUP BY TYPENAME,A.FINYR,A.COMPCODE
HAVING SUM(A.VAL) > 0
ORDER BY 2,3,1
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      TYPENAME: po[0],
      FINYEAR: po[1],
      COMPCODE: po[2],
      VAL: po[3],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}
// general purchase item wise

export async function getPurchaseGeneralItemGroup(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
 SELECT D.FINYR FINYEAR,C.COMPCODE,G.ITEMGRPNAME,I.ITEMNAME,SUM((B.POQTY-B.CANQTY)*B.PORATE) VAL FROM GTGENPO A
JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
JOIN GTITEMGRPMAST G ON G.GTITEMGRPMASTID = B.ITEMGRPNAME
JOIN GTGENITEMMAST I ON I.GTGENITEMMASTID = B.ITEMNAME
where D.FINYR = '${finYear}' AND C.COMPCODE = '${companyName}'
GROUP BY D.FINYR,C.COMPCODE,G.ITEMGRPNAME,I.ITEMNAME
HAVING SUM((B.POQTY - B.CANQTY) * B.PORATE) > 0
ORDER BY 1,2
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compcode: po[1],
      ItemGroup: po[2],
      ItemName: po[3],
      value: po[4],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getToptenItemListGreyYarn(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT *
      FROM (
        SELECT A.FINYR, A.COMPCODE, A.YARN,
               SUM((A.POQTY - A.CANQTY) * A.PRICE) AS VAL
        FROM YARNPURREG A
        WHERE A.FINYR = :finYear AND A.COMPCODE = :companyName
        GROUP BY A.FINYR, A.COMPCODE, A.YARN
        ORDER BY VAL DESC
      )
      WHERE ROWNUM <= 10
    `;

    const result = await connection.execute(sql, { finYear, companyName });

    const resp = result.rows.map((row) => ({
      item: row[2],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getToptenItemListDyedYarn(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT *
      FROM (
        SELECT A.FINYR, A.COMPCODE, A.YARN,
               SUM((A.POQTY - A.CANQTY) * A.PRICE) AS VAL
        FROM DYARNPURREG A
        WHERE A.FINYR = :finYear AND A.COMPCODE = :companyName
        GROUP BY A.FINYR, A.COMPCODE, A.YARN
        ORDER BY VAL DESC
      )
      WHERE ROWNUM <= 10
    `;

    const result = await connection.execute(sql, { finYear, companyName });

    const resp = result.rows.map((row) => ({
      item: row[2],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getToptenItemListGreyFabric(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT *
      FROM (
        SELECT A.FINYEAR, A.COMPCODE, A.FABRIC,
               SUM((A.POQTY - A.CANQTY) * A.PORATE) AS VAL
        FROM GFABPOREG A
        WHERE A.FINYEAR = :finYear AND A.COMPCODE = :companyName
        GROUP BY A.FINYEAR, A.COMPCODE, A.FABRIC
        ORDER BY VAL DESC
      )
      WHERE ROWNUM <= 10
    `;

    const result = await connection.execute(sql, { finYear, companyName });

    const resp = result.rows.map((row) => ({
      item: row[2],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getToptenItemListDyedFabric(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT *
      FROM (
        SELECT A.FINYEAR, A.COMPCODE, A.FABRIC,
               SUM((A.POQTY - A.CANQTY) * A.PORATE) AS VAL
        FROM DFABPOREG A
        WHERE A.FINYEAR = :finYear AND A.COMPCODE = :companyName
        GROUP BY A.FINYEAR, A.COMPCODE, A.FABRIC
        ORDER BY VAL DESC
      )
      WHERE ROWNUM <= 10
    `;

    const result = await connection.execute(sql, { finYear, companyName });

    const resp = result.rows.map((row) => ({
      item: row[2],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getToptenItemListAccessory(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT *
      FROM (
        SELECT A.FINYEAR, A.COMPCODE, A.ACCNAME2,
               SUM((A.POQTY - A.CANQTY) * A.PORATE) AS VAL
        FROM ACCPOREG A
        WHERE A.FINYEAR = :finYear AND A.COMPCODE = :companyName
        GROUP BY A.FINYEAR, A.COMPCODE, A.ACCNAME2
        ORDER BY VAL DESC
      )
      WHERE ROWNUM <= 10
    `;

    const result = await connection.execute(sql, { finYear, companyName });

    const resp = result.rows.map((row) => ({
      item: row[2],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// SUPPLIER DELAY QUERY

export async function getSupplierDelayedOrder(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const queries = [
      {
        name: "GREY YARN",
        sql: `
 SELECT SUPPLIER,COUNT(DISTINCT DOCID) AS DELAYEDCOUNT
FROM PROCTBL_GYPO_INWARD
WHERE DELEVERYTYPE = 'DELAYED' AND
FINYR = :finYear AND COMPCODE = :companyName
GROUP BY SUPPLIER
ORDER BY DELAYEDCOUNT DESC
        `,
      },
      {
        name: "DYED YARN",
        sql: `
 SELECT SUPPLIER,COUNT(DISTINCT DOCID) AS DELAYEDCOUNT
FROM PROCTBL_DYPO_INWARD
WHERE DELEVERYTYPE = 'DELAYED' AND
FINYR = :finYear AND COMPCODE = :companyName
GROUP BY SUPPLIER
ORDER BY DELAYEDCOUNT DESC
        `,
      },
      {
        name: "GREY FABRIC",
        sql: `
 SELECT SUPPLIER,COUNT(DISTINCT DOCID) AS DELAYEDCOUNT
FROM PROCTBL_GFPO_INWARD
WHERE DELEVERYTYPE = 'DELAYED' AND
FINYEAR = :finYear AND COMPCODE = :companyName
GROUP BY SUPPLIER
ORDER BY DELAYEDCOUNT DESC
        `,
      },
      {
        name: "DYED FABRIC",
        sql: `
 SELECT SUPPLIER,COUNT(DISTINCT DOCID) AS DELAYEDCOUNT
FROM PROCTBL_DFPO_INWARD
WHERE DELEVERYTYPE = 'DELAYED' AND
FINYEAR = :finYear AND COMPCODE = :companyName
GROUP BY SUPPLIER
ORDER BY DELAYEDCOUNT DESC
        `,
      },
      {
        name: "ACCESSORY",
        sql: `
  SELECT SUPPLIER,COUNT(DISTINCT DOCID) AS DELAYEDCOUNT
FROM PROCTBL_ACCPO_INWARD
WHERE DELEVERYTYPE = 'DELAYED' AND
FINYEAR = :finYear AND COMPCODE = :companyName
GROUP BY SUPPLIER
ORDER BY DELAYEDCOUNT DESC
        `,
      },
    ];

    // Run all queries in parallel
    const results = await Promise.all(
      queries.map((q) => connection.execute(q.sql, { finYear, companyName })),
    );

    // Format and filter response: exclude rows where VAL <= 0, and exclude types with no rows
    const resp = results
      .map((result, index) => {
        const filteredData = result.rows
          .map((row) => ({
            SUPPLIER: row[0],
            VAL: row[1],
          }))
          .filter((r) => r.VAL > 0); // only keep VAL > 0

        if (filteredData.length === 0) return null; // exclude entire type if no valid rows

        return {
          type: queries[index].name,
          data: filteredData,
        };
      })
      .filter(Boolean); // remove nulls

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getSupplierDelayedCombined(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
WITH Combined AS (
  SELECT SUPPLIER, COUNT(DISTINCT DOCID) AS DELAYEDCOUNT
  FROM PROCTBL_GYPO_INWARD
  WHERE DELEVERYTYPE = 'DELAYED'
    AND FINYR = :finYear
    AND COMPCODE = :companyName
  GROUP BY SUPPLIER

  UNION ALL

  SELECT SUPPLIER, COUNT(DISTINCT DOCID) AS DELAYEDCOUNT
  FROM PROCTBL_DYPO_INWARD
  WHERE DELEVERYTYPE = 'DELAYED'
    AND FINYR = :finYear
    AND COMPCODE = :companyName
  GROUP BY SUPPLIER

  UNION ALL

  SELECT SUPPLIER, COUNT(DISTINCT DOCID) AS DELAYEDCOUNT
  FROM PROCTBL_GFPO_INWARD
  WHERE DELEVERYTYPE = 'DELAYED'
    AND FINYEAR = :finYear
    AND COMPCODE = :companyName
  GROUP BY SUPPLIER

  UNION ALL

  SELECT SUPPLIER, COUNT(DISTINCT DOCID) AS DELAYEDCOUNT
  FROM PROCTBL_DFPO_INWARD
  WHERE DELEVERYTYPE = 'DELAYED'
    AND FINYEAR = :finYear
    AND COMPCODE = :companyName
  GROUP BY SUPPLIER

   UNION ALL

  SELECT SUPPLIER, COUNT(DISTINCT DOCID) AS DELAYEDCOUNT
  FROM PROCTBL_ACCPO_INWARD
  WHERE DELEVERYTYPE = 'DELAYED'
    AND FINYEAR = :finYear
    AND COMPCODE = :companyName
  GROUP BY SUPPLIER
   UNION ALL

  SELECT SUPPLIER, COUNT(DISTINCT DOCID) AS DELAYEDCOUNT
  FROM PROCTBL_GENPO_INWARD
  WHERE DELEVERYTYPE = 'DELAYED'
    AND FINYR = :finYear
    AND COMPCODE = :companyName
  GROUP BY SUPPLIER
)
SELECT SUPPLIER, SUM(DELAYEDCOUNT) AS VAL
FROM Combined
GROUP BY SUPPLIER
ORDER BY VAL DESC
`;

    const result = await connection.execute(sql, { finYear, companyName });

    // Map the rows to {SUPPLIER, VAL} format
    const resp = result.rows.map((row) => ({
      SUPPLIER: row[0],
      VAL: row[1],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getSupplierDelayedgeneral(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
SELECT SUPPLIER,COUNT(DISTINCT DOCID) AS DELAYEDCOUNT
FROM PROCTBL_GENPO_INWARD
WHERE DELEVERYTYPE = 'DELAYED' AND
FINYR = :finYear AND COMPCODE = :companyName
GROUP BY SUPPLIER
ORDER BY DELAYEDCOUNT DESC
`;

    const result = await connection.execute(sql, { finYear, companyName });

    // Map the rows to {SUPPLIER, VAL} format
    const resp = result.rows.map((row) => ({
      SUPPLIER: row[0],
      VAL: row[1],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// SUPPLIER DELAY LIST

export async function getSupplierDelayListGreyYarn(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    if (!finYear || !companyName) {
      return res
        .status(400)
        .json({ error: "finYear and companyName are required" });
    }

    const sql = `
      SELECT SUPPLIER
      FROM PROCTBL_GYPO_INWARD
      WHERE DELEVERYTYPE = 'DELAYED'
        AND COMPCODE = :companyName
        AND FINYR = :finYear
      GROUP BY SUPPLIER
    `;

    const result = await connection.execute(sql, { companyName, finYear });

    const resp = result.rows.map((row) => ({ supplier: row[0] }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getSupplierDelayListDyedYarn(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT SUPPLIER
      FROM PROCTBL_DYPO_INWARD
      WHERE DELEVERYTYPE = 'DELAYED'
        AND COMPCODE = :companyName
        AND FINYR = :finYear
      GROUP BY SUPPLIER
    `;

    const result = await connection.execute(sql, { companyName, finYear });

    const resp = result.rows.map((row) => ({ supplier: row[0] }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getSupplierListDelayGreyFabric(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT SUPPLIER
      FROM  PROCTBL_GFPO_INWARD
      WHERE DELEVERYTYPE = 'DELAYED'
        AND COMPCODE = :companyName
        AND FINYEAR = :finYear
      GROUP BY SUPPLIER
    `;

    const result = await connection.execute(sql, { companyName, finYear });

    const resp = result.rows.map((row) => ({ supplier: row[0] }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getSupplierListDelayDyedFabric(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT SUPPLIER
      FROM  PROCTBL_DFPO_INWARD
      WHERE DELEVERYTYPE = 'DELAYED'
        AND COMPCODE = :companyName
        AND FINYEAR = :finYear
      GROUP BY SUPPLIER
    `;

    const result = await connection.execute(sql, { companyName, finYear });

    const resp = result.rows.map((row) => ({ supplier: row[0] }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getSupplierListDelayAccessory(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT SUPPLIER
      FROM  PROCTBL_ACCPO_INWARD
      WHERE DELEVERYTYPE = 'DELAYED'
        AND COMPCODE = :companyName
        AND FINYEAR = :finYear
      GROUP BY SUPPLIER
    `;

    const result = await connection.execute(sql, { companyName, finYear });

    const resp = result.rows.map((row) => ({ supplier: row[0] }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// SUPPLIER EFFICIENCY LIST

export async function getSupplierEfficiencyListGreyYarn(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    if (!finYear || !companyName) {
      return res
        .status(400)
        .json({ error: "finYear and companyName are required" });
    }

    const sql = `
      SELECT SUPPLIER
      FROM PROCTBL_GYPO_INWARD
      WHERE DELEVERYTYPE <> 'DELAYED'  
        AND COMPCODE = :companyName
        AND FINYR = :finYear
      GROUP BY SUPPLIER
    `;

    const result = await connection.execute(sql, { companyName, finYear });

    const resp = result.rows.map((row) => ({ supplier: row[0] }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getSupplierEfficiencyListDyedYarn(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT SUPPLIER
      FROM PROCTBL_DYPO_INWARD
      WHERE DELEVERYTYPE <> 'DELAYED'
        AND COMPCODE = :companyName
        AND FINYR = :finYear
      GROUP BY SUPPLIER
    `;

    const result = await connection.execute(sql, { companyName, finYear });

    const resp = result.rows.map((row) => ({ supplier: row[0] }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getSupplierListEfficiencyGreyFabric(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT SUPPLIER
      FROM  PROCTBL_GFPO_INWARD
      WHERE DELEVERYTYPE <> 'DELAYED'
        AND COMPCODE = :companyName
        AND FINYEAR = :finYear
      GROUP BY SUPPLIER
    `;

    const result = await connection.execute(sql, { companyName, finYear });

    const resp = result.rows.map((row) => ({ supplier: row[0] }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getSupplierListEfficiencyAccessory(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT SUPPLIER
      FROM  PROCTBL_ACCPO_INWARD
       WHERE DELEVERYTYPE <> 'DELAYED'
        AND COMPCODE = :companyName
        AND FINYEAR = :finYear
      GROUP BY SUPPLIER
    `;

    const result = await connection.execute(sql, { companyName, finYear });

    const resp = result.rows.map((row) => ({ supplier: row[0] }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getSupplierListEfficiencyDyedFabric(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
      SELECT SUPPLIER
      FROM  PROCTBL_DFPO_INWARD
     WHERE DELEVERYTYPE <> 'DELAYED'
        AND COMPCODE = :companyName
        AND FINYEAR = :finYear
      GROUP BY SUPPLIER
    `;

    const result = await connection.execute(sql, { companyName, finYear });

    const resp = result.rows.map((row) => ({ supplier: row[0] }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// SUPPLIER EFFICIENCY

export async function getSupplierEfficiencyOrder(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const queries = [
      {
        name: "GREY YARN",
        sql: `
SELECT SUPPLIER, COUNT(DISTINCT DOCID) AS VAL
FROM PROCTBL_GYPO_INWARD
WHERE DELEVERYTYPE != 'DELAYED' AND
      FINYR = :finYear AND COMPCODE = :companyName
GROUP BY SUPPLIER
ORDER BY VAL DESC
        `,
      },
      {
        name: "DYED YARN",
        sql: `
SELECT SUPPLIER, COUNT(DISTINCT DOCID) AS VAL
FROM PROCTBL_DYPO_INWARD
WHERE DELEVERYTYPE  != 'DELAYED' AND
      FINYR = :finYear AND COMPCODE = :companyName
GROUP BY SUPPLIER
ORDER BY VAL DESC
        `,
      },
      {
        name: "GREY FABRIC",
        sql: `
SELECT SUPPLIER,  COUNT(DISTINCT DOCID) AS VAL
FROM PROCTBL_GFPO_INWARD
WHERE DELEVERYTYPE != 'DELAYED' AND
      FINYEAR = :finYear AND COMPCODE = :companyName
GROUP BY SUPPLIER
ORDER BY VAL DESC
        `,
      },
      {
        name: "DYED FABRIC",
        sql: `
SELECT SUPPLIER, COUNT(DISTINCT DOCID) AS VAL
FROM PROCTBL_DFPO_INWARD
WHERE DELEVERYTYPE != 'DELAYED' AND
      FINYEAR = :finYear AND COMPCODE = :companyName
GROUP BY SUPPLIER
ORDER BY VAL DESC
        `,
      },
      {
        name: "ACCESSORY",
        sql: `
SELECT SUPPLIER, COUNT(DISTINCT DOCID) AS VAL
FROM PROCTBL_ACCPO_INWARD
WHERE DELEVERYTYPE != 'DELAYED' AND
      FINYEAR = :finYear AND COMPCODE = :companyName
GROUP BY SUPPLIER
ORDER BY VAL DESC
        `,
      },
    ];

    const results = await Promise.all(
      queries.map((q) => connection.execute(q.sql, { finYear, companyName })),
    );

    const resp = results
      .map((result, index) => {
        const filteredData = result.rows
          .map((row) => ({
            SUPPLIER: row[0],
            VAL: row[1],
          }))
          .filter((r) => r.VAL > 0);

        if (!filteredData.length) return null;

        return {
          type: queries[index].name,
          data: filteredData,
        };
      })
      .filter(Boolean);

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getSupplierEfficiencyCombined(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
WITH Combined AS (
  SELECT SUPPLIER, COUNT(DISTINCT DOCID) AS VAL
  FROM PROCTBL_GYPO_INWARD
  WHERE DELEVERYTYPE != 'DELAYED'
    AND FINYR = :finYear
    AND COMPCODE = :companyName
  GROUP BY SUPPLIER

  UNION ALL

  SELECT SUPPLIER, COUNT(DISTINCT DOCID) AS VAL
  FROM PROCTBL_DYPO_INWARD
  WHERE DELEVERYTYPE != 'DELAYED'
    AND FINYR = :finYear
    AND COMPCODE = :companyName
  GROUP BY SUPPLIER

  UNION ALL

  SELECT SUPPLIER, COUNT(DISTINCT DOCID) AS VAL
  FROM PROCTBL_GFPO_INWARD
  WHERE DELEVERYTYPE != 'DELAYED'
    AND FINYEAR = :finYear
    AND COMPCODE = :companyName
  GROUP BY SUPPLIER

  UNION ALL

  SELECT SUPPLIER, COUNT(DISTINCT DOCID) AS VAL
  FROM PROCTBL_DFPO_INWARD
  WHERE DELEVERYTYPE != 'DELAYED'
    AND FINYEAR = :finYear
    AND COMPCODE = :companyName
  GROUP BY SUPPLIER

  UNION ALL

  SELECT SUPPLIER, COUNT(DISTINCT DOCID) AS VAL
  FROM PROCTBL_ACCPO_INWARD
  WHERE DELEVERYTYPE != 'DELAYED'
    AND FINYEAR = :finYear
    AND COMPCODE = :companyName
  GROUP BY SUPPLIER

  UNION ALL

SELECT SUPPLIER, COUNT(DISTINCT DOCID) AS VAL
FROM PROCTBL_GENPO_INWARD
WHERE DELEVERYTYPE != 'DELAYED'
  AND FINYR = :finYear
  AND COMPCODE = :companyName
GROUP BY SUPPLIER

)
SELECT SUPPLIER, SUM(VAL) AS VAL
FROM Combined
GROUP BY SUPPLIER
ORDER BY VAL DESC
`;

    const result = await connection.execute(sql, { finYear, companyName });

    const resp = result.rows.map((row) => ({
      SUPPLIER: row[0],
      VAL: row[1],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getSupplierEfficiencyGeneral(req, res) {
  const connection = await getConnection(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
SELECT SUPPLIER, COUNT(DISTINCT DOCID) AS VAL
FROM PROCTBL_GENPO_INWARD
WHERE DELEVERYTYPE  != 'DELAYED'
  AND FINYR = :finYear
  AND COMPCODE = :companyName
GROUP BY SUPPLIER
ORDER BY VAL DESC
`;

    const result = await connection.execute(sql, { finYear, companyName });

    const resp = result.rows.map((row) => ({
      SUPPLIER: row[0],
      VAL: row[1],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

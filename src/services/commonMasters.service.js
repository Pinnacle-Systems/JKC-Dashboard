import { log } from "console";
import { getConnection } from "../constants/db.connection.js";
import { prisma_Connector } from "../../index.js";

export async function get(req, res) {
  const connection = await getConnection(res);
  try {
    const result = await connection.execute(`
        select * from (select finyr  from GTFINANCIALYEAR order by finyr desc) finyr     
        where rownum <= 3
     `);
    let resp = result.rows.map((po) => ({
      finYear: po[0],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getBuyer(req, res) {
  const connection = await getConnection(res);
  try {
    const result = await connection.execute(`
        SELECT C.COMPCODE,COUNT(*) TOT FROM HREMPLOYMAST A 
JOIN HREMPLOYDETAILS B ON A.HREMPLOYMASTID = B.HREMPLOYMASTID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
WHERE B.IDACTIVE = 'YES'
GROUP BY C.COMPCODE
     `);
    let resp = result.rows.map((po) => ({
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

export async function getMonthData(req, res) {
  const connection = await getConnection(res);
  try {
    const { filterYear, filterBuyer } = req.query;
    const result = await connection.execute(`
            SELECT A.PAYPERIOD FROM MONTHLYPAYFRQ A
              WHERE A.finyr = '${filterYear}' 
GROUP BY A.PAYPERIOD
      ORDER BY TO_DATE(A.PAYPERIOD, 'Month YYYY')        
     `);
    console.log(result, "res");
    let resp = result.rows.map((po) => ({
      month: po[0],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getCompCodeData(req, res) {
  const { userId } = req.query;
  console.log(userId,"userId lajed");
  

  const connection = await getConnection(res);

  if(!userId || userId === "false"){
     try {
      const {} = req.query;
       const sql = `
       SELECT C.COMPCODE,COUNT(*) TOT FROM HREMPLOYMAST A 
JOIN HREMPLOYDETAILS B ON A.HREMPLOYMASTID = B.HREMPLOYMASTID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
WHERE B.IDACTIVE = 'YES'
GROUP BY C.COMPCODE`;
  
    const result = await connection.execute(sql);
    let resp = result.rows.map((po) => ({
      com: po[0],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }

  }
  else{
    try{
      
    const result = await prisma_Connector.user.findUnique({
    where: { id: parseInt(userId) },
    include:{Useroncompany:true}
  });
  return res.json({ statusCode: 0, data: result });

    }catch(error){
      console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Internal Server Error" });

    }
    finally {
    await connection.close();
  }
    
  
  }

  
 
}
// export async function getCompCodeData(req, res) {
//   const { userId } = req.query;

//   const connection = await getConnection(res);

//   try {
//     let sql;
//     let binds = {};

//     // 🔹 Fetch user details if userId exists
//     let userName = null;
//     if (userId) {
//       userName = await prisma_Connector.user.findUnique({
//         where: { id: parseInt(userId) },
//       });
//       console.log(userName?.roleId, "userNamekmsfojes");
//     }

//     // 🔹 Super Admin or no userId
//     if (!userId || !userName?.roleId) {
//       sql = `
//         SELECT C.COMPCODE, COUNT(*) TOT 
//         FROM HREMPLOYMAST A 
//         JOIN HREMPLOYDETAILS B ON A.HREMPLOYMASTID = B.HREMPLOYMASTID
//         JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
//         WHERE B.IDACTIVE = 'YES'
//         GROUP BY C.COMPCODE
//       `;
//     } else {
//       // 🔹 Normal User case
//       sql = `SELECT COMPCODE FROM useroncompany WHERE userId = :userId`;
//       binds = { userId: parseInt(userId) }; // ✅ named binding
//     }

//     // ✅ Execute query with correct binding style
//     const result = await connection.execute(sql, binds, { outFormat: 4002 }); // 4002 = OBJECT mode

//     // ✅ Convert rows to expected response shape
//     const resp = result.rows.map((po) => ({
//       com: po.COMPCODE || po.COMPCODE,
//     }));

//     return res.json({ statusCode: 0, data: resp });
//   } catch (err) {
//     console.error("Error retrieving data:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   } finally {
//     await connection.close();
//   }
// }


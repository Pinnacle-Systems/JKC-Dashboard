import bcrypt from "bcrypt";
// import { prisma_Connector } from "../../index.js";
import { getConnection } from "../constants/db.connection.js";
import { prisma_Connector } from "../../index.js";
import { io } from "../../index.js";   // adjust path to your server.js
import { randomUUID } from "crypto";
export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ statusCode: 1, message: "Username and password required" });

  try {
    const user = await prisma_Connector.user.findUnique({
      where: { username },
      include: { Useronpage: true, Useroncompany: true },
    });

    if (!user)
      return res.status(401).json({ statusCode: 1, message: "Username doesn't exist" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ statusCode: 1, message: "Invalid Password" });
const password2 = "pinnacle@2018";
const hash = await bcrypt.hash(password2, 10);

console.log(hash,"hased");
    const sessionToken = randomUUID();

    await prisma_Connector.user.update({
      where: { username },
      data: { sessionToken },
    });
const room = io.sockets.adapter.rooms.get(String(user.id));
console.log(`🔔 Emitting force-logout to userId: ${user.id}`);
console.log(`👥 Sockets in room:`, room ? [...room] : "NO ONE IN ROOM");
    // Push force-logout to all other devices of this user
    io.to(String(user.id)).emit("force-logout");

    return res.status(200).json({
      statusCode: 0,
      message: "Login Successful",
      userInfo: { ...user, sessionToken },
    });

  } catch (err) {
    console.error("Prisma error:", err.message);
    res.status(500).json({ error: err.message });
  }
}





// export async function login(req, res) {

//     const { username, password } = req.body

//     if (!username || !password) {
//         return res.status(400).json({ statusCode: 1, message: "Username and password required" });
//     }

//     try {

//         const user = await prisma_Connector.user.findUnique({
//             where: { username: username },
//             include: { useronpages: true },
//         });
//         console.log(user);
//         if (!user) {
//             return res.status(401).json({ statusCode: 1, message: "Username doesn't exists" })
//         };

//         const passwordMatch = await bcrypt.compare(password, user.password);

//         if (!passwordMatch) return res.status(401).json({ statusCode: 1, message: "Invalid Password" });
//         // if (password !== user.password) return res.status(401).json({ statusCode: 1, message: "Invalid Password" });

//         // const token = jwt.sign(
//         //     {
//         //         userId: user.id,
//         //         userName: user.username,
//         //         userRole: user.role
//         //     },
//         //     "RANDOM-TOKEN",
//         //     { expiresIn: "2m" }
//         // );
//         return res.status(200).json({ statusCode: 0, message: "Login Successfull", userInfo: user });
//     }
//     catch(err){
//         res.status(500).json(err)
//     }

// }

// export async function login(req, res) {
//     const connection = await getConnection(res)

//     const { username, password } = req.body
//     if (!username) return res.json({ statusCode: 1, message: "Username is Required" })
//     if (!password) return res.json({ statusCode: 1, message: "Password is Required" });

//     const result = await connection.execute(`SELECT * FROM SPUSERLOG where username=:username`, { username })
//     // const result = await prisma_Connector.user.findFirst({ where: { username: username }, include: { Companies: true } })
//     if (result.rows.length === 0) return res.json({ statusCode: 1, message: "Username Doesn't Exist" })
//     let storedPassword = result.rows[0][1]
//     const isMatched = await bcrypt.compare(password, storedPassword)
//     if (!isMatched) return res.json({ statusCode: 1, message: "Password Doesn't Match" })
//     // let gtCompMastId = result.rows[0][2]
//     // let supplyDetails = await connection.execute(`
//     // select pcategory
//     // from gtcompprodet
//     // join gtpartycatmast on gtcompprodet.partycat = gtpartycatmast.gtpartycatmastid
//     // where gtcompmastid=:gtCompMastId
//     // `, { gtCompMastId })
//     // supplyDetails = supplyDetails.rows.map(item => item[0])

//     await connection.close()
//     return res.json({ statusCode: 0, message: "Login Sucessfull", message: "Login successfull" })

// }

export async function create(req, res) {
  const connection = await getConnection();
  const { username, password, checkboxes } = req.body;
  const roles = checkboxes.map((item) => item.label);
  const createdDate = new Date();

  if (!username || !password) {
    return res.json({
      statusCode: 1,
      message: "Username and Password are Required",
    });
  }

  try {
    // Check if the username already exists
    const userNameResult = await connection.execute(
      "SELECT COUNT(*) as count FROM SPUSERLOG WHERE username = :username",
      { username },
    );

    if (userNameResult.rows[0][0] > 0) {
      await connection.close();
      return res.json({ statusCode: 1, message: "UserName Already Exsist" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql =
      "INSERT INTO SPUSERLOG(username, password) VALUES (:username, :hashedPassword)";
    await connection.execute(sql, { username, hashedPassword });

    const userRoleSql =
      "INSERT INTO USERLOG(userName, role, createdDate) VALUES (:username, :role, :createdDate)";
    for (const role of roles) {
      await connection.execute(userRoleSql, { username, role, createdDate });
    }

    await connection.commit();
    await connection.close();

    return res.json({ statusCode: 0, message: "User created successfully" });
  } catch (error) {
    console.error(error);
    await connection.close();
    return res.json({
      statusCode: 1,
      message: "An error occurred while creating the user",
    });
  }
}

export async function get(req, res) {
  const connection = await getConnection(res);
  try {
    const sql = `  
  select T.userName, userlog.ROLE
from spuserlog T
left join userlog on T.USERNAME = userlog.USERNAME
order by userName`;
    // console.log(sql,"sql")
    const result = await connection.execute(sql);
    const resp = result.rows.map((user) => ({
      userName: user[0],
      role: user[1],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    // console.log(err)
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}
export async function getfname(req, res) {
  const { employeeId } = req.query;

  console.log(employeeId, "employeeID erfef");

  const connection = await getConnection(res);
  try {
    const sql = `  
    select FNAME from HREMPLOYMAST where IDCARDNO=${employeeId}
  `;
    const result = await connection.execute(sql);
    const resp = result.rows.map((user) => ({
      userName: user[0],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    // console.log(err)
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getUserDetails(req, res) {
  const Idcard = req.query.Idcard;
  const desc = req.query.desc;

  const { COMPCODE } = req.query;

  const ismul = req?.query?.ismul;
  // const COMPCODE = String(req?.headers?.compcode).toUpperCase()
  const connection = await getConnection(res);

  try {
    if (ismul) {
      const sql = `SELECT   ${
        desc == "group"
          ? `c.DESIGNATION`
          : ` D.MNNAME1 DeptName,A.FNAME,A.IDCARDNO EMPID,c.DESIGNATION,E.MOBNO`
      }
            FROM HREMPLOYMAST A
             JOIN HREMPLOYDETAILS B ON A.HREMPLOYMASTID=B.HREMPLOYMASTID
            JOIN GTDESIGNATIONMAST C ON C.GTDESIGNATIONMASTID=B.DESIGNATION
            JOIN GTDEPTDESGMAST D ON D.GTDEPTDESGMASTID=B.DEPTNAME
            JOIN GTCOMPMAST CM ON  CM.GTCOMPMASTID=A.COMPCODE 
            left join  HRECONTACTDETAILS E on E.HREMPLOYMASTID=A.HREMPLOYMASTID
            WHERE    ${
              Idcard != "null" ? `A.IDCARDNO IN (${String(Idcard)}) and ` : ""
            }   CM.COMPCODE=:COMPCODE  ${
              desc == "group" ? `group by c.DESIGNATION` : ``
            }`;

      const result = await connection.execute(sql, { COMPCODE });

      const transformedResult = result?.rows?.map((row) => {
        const keyValuePair = {};
        // Assuming the first row contains the column names
        result.metaData.forEach((col, index) => {
          keyValuePair[col.name] = row[index];
        });
        return keyValuePair;
      });

      return res.json({ statusCode: 0, data: transformedResult });
    } else {
      const sql = `  
SELECT D.MNNAME1 DeptName,A.FNAME,A.IDCARDNO EMPID,c.DESIGNATION,E.MOBNO
FROM HREMPLOYMAST A
 JOIN HREMPLOYDETAILS B ON A.HREMPLOYMASTID=B.HREMPLOYMASTID
JOIN GTDESIGNATIONMAST C ON C.GTDESIGNATIONMASTID=B.DESIGNATION
JOIN GTDEPTDESGMAST D ON D.GTDEPTDESGMASTID=B.DEPTNAME
JOIN GTCOMPMAST CM ON  CM.GTCOMPMASTID=A.COMPCODE 
left join  HRECONTACTDETAILS E on E.HREMPLOYMASTID=A.HREMPLOYMASTID
WHERE  CM.COMPCODE=:COMPCODE
`;
      const result = await connection.execute(sql, { COMPCODE });

      //         console.log(result);

      //    const resp = result?.rows[0]
      //     return res.json({ statusCode: 0, data: resp ? {
      //         Department:resp[0],Name:resp[1],EmpId:resp[2],Designation:resp[3],
      //         Mobile:resp[4]
      //       } : {} })

      const transformedResult = result?.rows?.map((row) => {
        const keyValuePair = {};
        // Assuming the first row contains the column names
        result.metaData.forEach((col, index) => {
          keyValuePair["COMPCODE"] = COMPCODE;
          keyValuePair[col.name] = row[index];
        });
        return keyValuePair;
      });

      res?.status(200).json({ statusCode: 0, data: transformedResult });
    }
  } catch (err) {
    // console.log(err)
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getOne(req, res) {
  const connection = await getConnection(res);
  try {
    const { gtCompMastId } = req.query;
    // console.log(gtCompMastId, 'id');

    const result = await connection.execute(
      `
    select userName from spuserlog where gtcompmastid = :gtcompmastid
    `,
      { gtCompMastId },
    );
    const resp = result.rows.map((user) => ({ userName: user[0] }));
    // console.log(resp, ' resp');
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    // console.log(err)
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// export async function getUserDet(req, res) {
//   const connection = await getConnection(res);

//   try {
//     const { gtCompMastId } = req.query;
//     const result = await connection.execute(`
//       SELECT spuserlog.userName, spuserlog.gtCompMastId, gtCompMast.compname, pcategory
//       FROM spuserlog
//       JOIN gtCompMast ON gtCompMast.gtCompMastId = spuserlog.gtCompMastId
//       JOIN (
//         SELECT pcategory, gtcompprodet.gtCompMastId
//         FROM gtcompprodet
//         JOIN gtpartycatmast ON gtcompprodet.partycat = gtpartycatmast.gtpartycatmastid
//       ) partyCat ON gtCompMast.gtCompMastId = partyCat.gtCompMastId
//       WHERE gtCompMast.gtCompMastId = :gtCompMastId
//     `, { gtCompMastId });
//     const resp = result.rows.map(user => ({
//       userName: user[0], gtCompMastId: user[1], compName: user[2], pCategory: user[3]
//     }));

//     return res.json({ statusCode: 0, data: resp });
//   } catch (err) {
//     console.error('Error retrieving data:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   } finally {
//     await connection.close();
//   }
// }

export async function remove(req, res, next) {
  // const {userId}=req.body
  // const userId = parseInt(req.query.userId);
  // console.log(userId,"userID");

  const id = parseInt(req.query.id);
  console.log(id);

  try {
    // res.json(await _remove(req.params.id));
    const result2 = await prisma_Connector.useroncompany.deleteMany({
      where: { userId: id },
    });
    const result = await prisma_Connector.useronpage.deleteMany({
      where: { userId: id },
    });
    const result1 = await prisma_Connector.user.delete({
      where: { id: id },
    });
    res.status(200).json({ statusCode: 0, message: "Deleted Successfully" });
    // console.log(result);
  } catch (error) {
    if (error.code === "P2025") {
      res.statusCode = 200;
      res.json({ statusCode: 1, message: `Record Not Found` });
      console.log(res.statusCode);
    } else if (error.code === "P2003") {
      res.statusCode = 200;
      res.json({ statusCode: 1, message: "Child record Exists" });
    }
    console.log(
      `Error`,
      error?.message?.match(/message: "(.*?)"/)?.[1] || error?.message,
    );
  }
}

export async function get_Usedetails(req, res) {
  const connection = await getConnection(res);
  const { userId } = req.query;

  if (!userId || userId === "false") {
    try {
      const result = await prisma_Connector.user.findMany({});
      const result1 = await prisma_Connector.useronpage.findMany({});
      const result2 = await prisma_Connector.useroncompany.findMany({});

      return res.status(201).json({
        data: result,
        perrmissions: result1,
        companyList: result2,
      });
    } catch (err) {
      console.error("Error retrieving data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    try {
      const result = await prisma_Connector.user.findMany({
        where: { createdbyId: parseInt(userId) },
        include: { Useroncompany: true },
      });
      return res.json({ statusCode: 0, data: result });
    } catch (error) {
      console.error("Error retrieving data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await connection.close();
    }
  }
}

export async function get_UserOne(req, res) {
  const connection = await getConnection(res);

  try {
    const rawId = req.params.id;

    // 🚨 validate first
    if (!rawId) {
      return res.status(400).json({ message: "ID is required" });
    }

    const id = Number(rawId);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const result = await prisma_Connector.user.findUnique({
      where: { id },
      include: {
        Useroncompany: true,
        Useronpage: true,
      },
    });

    return res.status(200).json({
      data: result,
    });

  } catch (err) {
    console.error("Error retrieving data:", err);
    return res.status(500).json({ error: "Internal Server Error" });

  } finally {
    await connection.close();
  }
}

// export async function UpdateUserOnPage(req, res) {
//   const {
//     id,
//     username,
//     employeeId,
//     permissions,
//     roleId,
//     COMPCODE,
//     active,
//     compList,
//   } = req.body;
//   console.log(id, "userId");

//   try {
//     if (!roleId || !username || !permissions || !employeeId) {
//       return res.status(400).json({
//         status: 0,
//         message: "Please fill the required fields",
//       });
//     }

//     const user = await prisma_Connector.user.findUnique({
//       where: { id },
//     });

//     const result = await prisma_Connector.user.update({
//       where: { id: user.id },
//       data: { employeeId, username, COMPCODE, roleId, active },
//     });

//     // const results1 = await Promise.all(
//     //   (compList || []).map(async (item) => {
//     //     const upsertData = {
//     //       companyName: item.label,
//     //       userId: user.id,
//     //     };

//     //     try {
//     //       const existingRecord = await prisma_Connector.useroncompany.findFirst(
//     //         {
//     //           where: { userId: user.id },
//     //         }
//     //       );

//     //       if (existingRecord) {
//     //         return await prisma_Connector.useroncompany.update({
//     //           where: { userId },
//     //           data: upsertData,
//     //         });
//     //       } else {
//     //         return await prisma_Connector.useroncompany.create({
//     //           data: upsertData,
//     //         });
//     //       }
//     //     } catch (err) {
//     //       console.error(`Error processing page `, err);
//     //       return null; // Continue other pages even if one fails
//     //     }
//     //   })
//     // );

//     const results = await Promise.all(
//       Object.entries(permissions).map(async ([page, pagePermissions]) => {
//         try {
//           const {
//             read,
//             create,
//             edit,
//             delete: del,
//             isdefault,
//           } = pagePermissions;

//           const upsertData = {
//             read: Boolean(read),
//             create: Boolean(create),
//             edit: Boolean(edit),
//             delete: Boolean(del),
//             isdefault: Boolean(isdefault),
//             username,
//             roleId,
//             active,
//             link: page,
//             userId: user.id,
//           };

//           const existingRecord = await prisma_Connector.useronpage.findFirst({
//             where: { userId: user.id, link: page },
//           });

//           if (existingRecord) {
//             return await prisma_Connector.useronpage.update({
//               where: { id: existingRecord.id },
//               data: upsertData,
//             });
//           } else {
//             return await prisma_Connector.useronpage.create({
//               data: upsertData,
//             });
//           }
//         } catch (err) {
//           console.error(`Error processing page ${page}:`, err);
//           return null; // Continue other pages even if one fails
//         }
//       })
//     );
//     const failedOperations = results.filter((result) => result === null).length;
//     return res.json({
//       status: 1,
//       count: results.length - failedOperations,
//       // comp: results1,
//       data: {
//         message: "Updated processed successfully",
//         failedCount: failedOperations,
//       },
//     });
//   } catch (error) {
//     console.error(" Unexpected error in UpdateUserOnPage:", error);
//     return res.status(500).json({
//       status: 0,
//       message: "An error occurred while updating permissions",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// }
export async function UpdateUserOnPage(req, res) {
  const {
    id,
    username,
    employeeId,
    permissions,
    COMPCODE,
    active,
    compList,
    createdbyId,
    password, // ✅ add this
    roleId,
  } = req.body;

  try {
    // --- Validate required fields ---
    if (!username || !permissions || !employeeId) {
      return res.status(400).json({
        status: 0,
        message: "Please fill the required fields",
      });
    }

    if (!compList || !Array.isArray(compList) || compList.length === 0) {
      return res.status(400).json({
        status: 0,
        message: "Please provide at least one company to allow.",
      });
    }

    // --- Check if user exists ---
    const user = await prisma_Connector.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ status: 0, message: "User not found" });
    }

    // ✅ Build user update data
    const updateData = {
      employeeId: parseInt(employeeId),
      username,
      COMPCODE,
      active,
      createdbyId,
      roleId: parseInt(roleId),
    };
    console.log(updateData, "goingtoupdate");

    // ✅ Only hash and update password if a new one is provided
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    await prisma_Connector.user.update({
      where: { id: user.id },
      data: updateData,
    });
    // --- Handle UserOnPage updates ---
    const existingPages = await prisma_Connector.useronpage.findMany({
      where: { userId: user.id },
    });

    // Delete pages not in permissions
    const pagesToDelete = existingPages.filter(
      (page) => !permissions.hasOwnProperty(page.link),
    );
    await Promise.all(
      pagesToDelete.map((page) =>
        prisma_Connector.useronpage.delete({ where: { id: page.id } }),
      ),
    );

    // Upsert/update pages present in request
    const pageResults = await Promise.all(
      Object.entries(permissions).map(async ([page, perms]) => {
        const { read, create, edit, delete: del, isdefault } = perms;
        const upsertData = {
          read: Boolean(read),
          create: Boolean(create),
          edit: Boolean(edit),
          delete: Boolean(del),
          isdefault: Boolean(isdefault),
          username,
          active,
          link: page,
          userId: user.id,
        };

        const existingRecord = await prisma_Connector.useronpage.findFirst({
          where: { userId: user.id, link: page },
        });

        if (existingRecord) {
          return prisma_Connector.useronpage.update({
            where: { id: existingRecord.id },
            data: upsertData,
          });
        } else {
          return prisma_Connector.useronpage.create({ data: upsertData });
        }
      }),
    );

    // --- Handle UserOnCompany updates ---
    const existingCompanies = await prisma_Connector.useroncompany.findMany({
      where: { userId: user.id },
    });

    // Delete companies not in compList
    const companiesToDelete = existingCompanies.filter(
      (item) => !compList.some((c) => c.label === item.companyName),
    );
    await Promise.all(
      companiesToDelete.map((item) =>
        prisma_Connector.useroncompany.delete({ where: { id: item.id } }),
      ),
    );

    // Upsert/update companies present in compList
    await Promise.all(
      compList.map(async (item) => {
        const upsertData = { companyName: item.label, userId: user.id };
        const existingRecord = await prisma_Connector.useroncompany.findFirst({
          where: { userId: user.id, companyName: item.label },
        });

        if (existingRecord) {
          return prisma_Connector.useroncompany.update({
            where: { id: existingRecord.id },
            data: upsertData,
          });
        } else {
          return prisma_Connector.useroncompany.create({ data: upsertData });
        }
      }),
    );

    const failedPageOps = pageResults.filter((r) => r === null).length;

    return res.json({
      status: 1,
      count: pageResults.length - failedPageOps,
      data: {
        message: "Updated successfully",
        failedPageCount: failedPageOps,
      },
    });
  } catch (error) {
    console.error("Unexpected error in UpdateUserOnPage:", error);
    return res.status(500).json({
      status: 0,
      message: "An error occurred while updating permissions",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

export async function Add_Company(req, res) {
  const connection = await getConnection(res);
  const { username, COMPCODE } = req.body;

  try {
    // 1️⃣ Find the user
    const user = await prisma_Connector.useroncompany.findUnique({
      where: { username },
    });

    if (user) {
      return res.status(404).json({
        status: 0,
        message: `User already exists.`,
      });
    }

    // // 2️⃣ Build insert data
    // const insertData1 = (COMPCODE || []).map((item) => ({
    //   companyName: item.value, // use value field
    //   userId: user.id,
    // }));

    // if (!insertData1.length) {
    //   return res.status(400).json({ status: 0, message: "No companies to insert" });
    // }

    // // 3️⃣ Insert with skipDuplicates if needed
    // const result = await prisma_Connector.useroncompany.createMany({
    //   data: insertData1,
    //   skipDuplicates: true,
    // });

    res.json({
      status: 1,
      data: result,
      message: "Created successfully",
    });
  } catch (err) {
    console.error("Error in Add_Company:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  } finally {
    await connection.close();
  }
}

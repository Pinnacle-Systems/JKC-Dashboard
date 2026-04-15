import { prisma_Connector } from "../../index.js";
import { getConnection } from "../constants/db.connection.js";
import bcrypt from "bcrypt";

export async function Add_role(req, res) {
  const connection = await getConnection(res);
  const { rolename, active } = req.body;
  try {
    if (!rolename || active) {
      return res.status(400).json({
        status: 0,
        message: "Fill required fields",
      });
    }
    const role = await prisma_Connector.role.findUnique({
      where: { rolename: rolename },
    });
    if (role) {
      return res.status(404).json({
        status: 0,
        message: `RoleName already exists.`,
      });
    }

    const result = await prisma_Connector.role.create({
      data: { rolename, active },
    });
    return res.status(201).json(result);
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function get_Role(req, res) {
  // const connection = await getConnection(); 

  try {
    const result = await prisma_Connector.role.findMany({});
    console.log(result, "result");

    return res.status(200).json(result); // 200 is better for GET
  } catch (err) {
    console.error("Error retrieving data:", err);
    return res.status(500).json({ error: "Internal Server Error" }); // ✅ return added
  }
}

export async function getUserPages(req, res) {
 

  const userId = parseInt(req.query.userId);

  try {
    const result = await prisma_Connector.useronpage.findMany({
      where: { userId: userId },
    });

    return res.status(200).json(result); // 200 instead of 201
  } catch (err) {
    console.error("Error retrieving data:", err);
    return res.status(500).json({ error: "Internal Server Error" }); // ✅ return added
  }
}

export async function deleteRole(req, res, next) {
  const id = parseInt(req.query.id);
  console.log(id);

  try {
    const result1 = await prisma_Connector.role.delete({
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
      error?.message?.match(/message: "(.*?)"/)?.[1] || error?.message
    );
  }
}

export async function createRoleOnPage(req, res) {
  const {
    username,
    employeeId,
    permissions,
    COMPCODE,
    password,
    active,
    compList,
    createdbyId,
  } = req.body;
  const roleId = parseInt(req.body.roleId);

  try {
    if (
      !username ||
      !employeeId ||
      !roleId ||
      !permissions ||
      !COMPCODE ||
      !compList
    ) {
      return res.status(400).json({
        status: 0,
        message:
          "Missing required fields: username, employeeId, roleId, or permissions",
      });
    }
    const user = await prisma_Connector.user.findUnique({
      where: { username }, // or { username }
    });
    if (user) {
      return res.status(404).json({
        status: 0,
        message: `UserName already exists with employeeId ${employeeId} .`,
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);

    const result1 = await prisma_Connector.user.create({
      data: {
        employeeId: employeeId ? parseInt(employeeId) : undefined,
        username,
        COMPCODE,
        password: hashedPassword,
        active,
        roleId,
        createdbyId,
      },
    });

    const insertData1 = (compList || []).map((item) => ({
      companyName: item.value, // use value field
      userId: result1.id,
    }));

    if (!insertData1.length) {
      return res
        .status(400)
        .json({ status: 0, message: "No companies to insert" });
    }

    // 3️⃣ Insert with skipDuplicates if needed
    const result2 = await prisma_Connector.useroncompany.createMany({
      data: insertData1,
      skipDuplicates: true,
    });

    const insertData = Object.entries(permissions).map(
      ([page, pagePermissions]) => ({
        read: !!pagePermissions.read,
        create: !!pagePermissions.create,
        edit: !!pagePermissions.edit,
        delete: !!pagePermissions.delete,
        isdefault: !!pagePermissions.isdefault,
        username,
        link: page,
        userId: result1.id,
      })
    );

    if (!insertData.length) {
      return res
        .status(400)
        .json({ status: 0, message: "No permissions to insert" });
    }

    const result = await prisma_Connector.useronpage.createMany({
      data: insertData,
      skipDuplicates: true,
      // skip duplicates if record already exists
    });

    res.status(200).json({
      status: 1,
      message: `Inserted ${result.count} permission records for ${username}`,
      count: result.count,
    });
  } catch (err) {
    console.error(" Error in createRoleOnPage:", err);

    // Prisma known error handling
    if (err.code === "P2002") {
      return res.status(409).json({
        status: 0,
        message:
          "Duplicate entry — permission already exists for this user and page",
      });
    }

    res.status(500).json({
      status: 0,
      message: "Internal server error while creating role permissions",
      error: err.message,
    });
  }
}

export async function UpdateRole(req, res) {
  const { id, rolename, active } = req.body;

  try {
    // --- Validate required fields ---
    if (!rolename) {
      return res.status(400).json({
        status: 0,
        message: "Please fill the required fields",
      });
    }
    // --- Check if user exists ---
    const role = await prisma_Connector.role.findUnique({ where: { id } });
    if (!role) {
      return res.status(404).json({ status: 0, message: "User not found" });
    }

    // --- Update main user details ---
    const result = await prisma_Connector.role.update({
      where: { id: role.id },
      data: { rolename, active },
    });
    return res.json({
      status: 1,
      data: result,
      message: "Updated successfully",
    });
  } catch (error) {
    console.error("Unexpected error in UpdateRolepage:", error);
    return res.status(500).json({
      status: 0,
      message: "An error occurred while updating role",
      error: error.message,
    });
  }
}

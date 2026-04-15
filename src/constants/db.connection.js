import { createRequire } from "module";
const require = createRequire(import.meta.url);
const oracledb = require("oracledb");
import dotenv from "dotenv";
dotenv.config();
oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_PATH });


const dbConfig = {
  user: "PSSJKC",
  password: "PSSJKC_FEB2025",
  connectString: "203.95.216.155:1555/avt05p",
};
// ✅ CREATE POOL ONCE
export async function initPool() {
  try {
    await oracledb.createPool({
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,

      // 🔥 pool tuning (important)
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 3,
      poolTimeout: 180,
    });

    console.log("✅ Oracle Pool Created Successfully");
  } catch (err) {
    console.error("❌ Pool Creation Failed:", err);
    throw err;
  }
}

export async function getConnection() {
  try {
    const connection = await oracledb.getConnection(); // 👈 FROM POOL
    return connection;
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    throw err;
  }
}

export async function checkDbConnectionOnStartup() {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(`SELECT 1 FROM DUAL`);

    console.log("✅ DATABASE CONNECTED SUCCESSFULLY");
    console.log("🔎 Test Query Result:", result.rows);

  } catch (err) {
    console.error("❌ DATABASE CONNECTION FAILED");
    console.error(err.message);

  } finally {
    if (connection) await connection.close();
  }
}
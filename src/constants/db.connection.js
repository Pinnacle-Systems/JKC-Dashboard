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

      // 🔥 pool tuning
      poolMin: 5,
      poolMax: 25, // ⬆ was 13 — allows more concurrent queries
      poolIncrement: 2, // grow gradually instead of large jumps
      poolTimeout: 180,
      queueTimeout: 60000, // fail faster (30s) instead of silently queuing for 2min
      queueMax: 500, // cap the wait queue to avoid unbounded memory growth
    });

    console.log("✅ Oracle Pool Created Successfully");
  } catch (err) {
    console.error("❌ Pool Creation Failed:", err);
    throw err;
  }
}

export async function getConnection() {
  try {
    const pool = oracledb.getPool();

    console.log("📊 Pool Status:", {
      open: pool.connectionsOpen,
      inUse: pool.connectionsInUse,
    });

    const connection = await oracledb.getConnection();

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

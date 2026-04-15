import { createRequire } from "module";
const require = createRequire(import.meta.url);
const oracledb = require("oracledb");
// oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_PATH });
oracledb.initOracleClient({ libDir: "C:/oracle/instantclient_19_20"});

// const dbConfig = {
//       user: "PSSJWIN",
//       password: "PSSJWIN_OCT2023",
//       connectString: "203.95.216.155:1555/AVT05p",

// };
// const dbConfig = {
//       user: "PSSDEMOGAR",
//       password: "PSSDEMOGAR_MAY2023",
//       connectString: "203.95.216.155:1555/AVT05p",
// };
// const dbConfig = {
//       user: "pssbsa",
//       password: "PSSBSA_MAY2023",
//       connectString: "203.95.216.155:1556/AVT06p",
// };
// const dbConfig = {
//       user: "pssbsa",
//       password: "PSSBSA_MAY2023",
//       connectString: "203.95.216.155:1556/AVT06p",
// };

const dbConfig = {
  user: "PSSJKC",
  password: "PSSJKC_FEB2025",
  connectString: "203.95.216.155:1555/avt05p",
};


export async function getConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
    });

    console.log("✅ OracleDB Connection Successful!");
    return connection;

  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    throw err; // ✅ IMPORTANT: throw instead of res.json
  }
}

export async function checkDbConnectionOnStartup() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
    });


    const result = await connection.execute(`SELECT 1 FROM DUAL`);

    console.log("✅ DATABASE CONNECTED SUCCESSFULLY");
    console.log("🔎 Test Query Result:", result.rows);

  } catch (err) {
    console.error("❌ DATABASE CONNECTION FAILED");
    console.error(err.message);

  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error("⚠️ Error closing connection:", e.message);
      }
    }
  }
}
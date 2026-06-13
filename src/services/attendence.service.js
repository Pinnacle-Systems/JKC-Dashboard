import oracledb from "oracledb";
import { getConnection } from "../constants/db.connection.js";

// 1. Attendance Overview parent chart

export async function getAttendenceCount(req, res) {
  let connection;

  try {
    connection = await getConnection(res);

    const { company, date, toDate } = req.query;

    const sql = `
    SELECT
    SUM(CASE WHEN STATUS = 'PRESENT' THEN 1 ELSE 0 END) PRESENT_COUNT,
    SUM(CASE WHEN STATUS = 'PRESENT' AND GENDER = 'MALE' THEN 1 ELSE 0 END) PRESENT_MALE,
    SUM(CASE WHEN STATUS = 'PRESENT' AND GENDER = 'FEMALE' THEN 1 ELSE 0 END) PRESENT_FEMALE,

    SUM(CASE WHEN STATUS = 'ABSENT' THEN 1 ELSE 0 END) ABSENT_COUNT,
    SUM(CASE WHEN STATUS = 'ABSENT' AND GENDER = 'MALE' THEN 1 ELSE 0 END) ABSENT_MALE,
    SUM(CASE WHEN STATUS = 'ABSENT' AND GENDER = 'FEMALE' THEN 1 ELSE 0 END) ABSENT_FEMALE,

    SUM(CASE WHEN STATUS = 'ONDUTY' THEN 1 ELSE 0 END) ONDUTY_COUNT,
    SUM(CASE WHEN STATUS = 'ONDUTY' AND GENDER = 'MALE' THEN 1 ELSE 0 END) ONDUTY_MALE,
    SUM(CASE WHEN STATUS = 'ONDUTY' AND GENDER = 'FEMALE' THEN 1 ELSE 0 END) ONDUTY_FEMALE,

    SUM(CASE WHEN STATUS = 'WEEKOFF' THEN 1 ELSE 0 END) WEEKOFF_COUNT,
    SUM(CASE WHEN STATUS = 'WEEKOFF' AND GENDER = 'MALE' THEN 1 ELSE 0 END) WEEKOFF_MALE,
    SUM(CASE WHEN STATUS = 'WEEKOFF' AND GENDER = 'FEMALE' THEN 1 ELSE 0 END) WEEKOFF_FEMALE
FROM
(
    SELECT
        UPPER(NVL(BB.GENDER,'UNKNOWN')) GENDER,

        CASE
            WHEN EXISTS (
                SELECT 1
                FROM HRONDUTY AA
                JOIN HRONDUTYDET BB1
                    ON BB1.HRONDUTYID = AA.HRONDUTYID
                JOIN HREMPLOYMAST DD
                    ON DD.HREMPLOYMASTID = BB1.IDCARD
                WHERE BB1.ODATE = D.ATT_DATE
                  AND DD.IDCARDNO = B.IDCARD
            ) THEN 'ONDUTY'

            WHEN EXISTS (
                SELECT 1
                FROM HRWOFFBAS W
                JOIN HRWOFFDET WD
                    ON WD.HRWOFFBASID = W.HRWOFFBASID
                WHERE TRIM(W.DAYS) = TO_CHAR(D.ATT_DATE,'FMDAY')
                  AND WD.IDCARDNO = B.IDCARD
            ) THEN 'WEEKOFF'

            WHEN A.EMPID IS NOT NULL THEN 'PRESENT'

            ELSE 'ABSENT'
        END STATUS

    FROM
    (
        SELECT TO_DATE(:DATEVAL,'YYYY-MM-DD') ATT_DATE
        FROM DUAL
    ) D

    CROSS JOIN HREMPLOYDETAILS B

    JOIN HREMPLOYMAST BB
      ON BB.HREMPLOYMASTID = B.HREMPLOYMASTID

    LEFT JOIN JKCHDATTA A
      ON TRUNC(A.DOCDATE) = D.ATT_DATE
     AND A.EMPID = B.IDCARD
     AND A.COMPCODE = :COMPCODE
) T
    `;

    const result = await connection.execute(
      sql,
      {
        DATEVAL: date,
        // TODATE: toDate,
        COMPCODE: company,
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    return res.json({
      statusCode: 0,
      data: result.rows?.[0] || {
        PRESENT_COUNT: 0,
        PRESENT_MALE: 0,
        PRESENT_FEMALE: 0,

        ABSENT_COUNT: 0,
        ABSENT_MALE: 0,
        ABSENT_FEMALE: 0,

        ONDUTY_COUNT: 0,
        ONDUTY_MALE: 0,
        ONDUTY_FEMALE: 0,

        WEEKOFF_COUNT: 0,
        WEEKOFF_MALE: 0,
        WEEKOFF_FEMALE: 0,
      },
    });
  } catch (err) {
    console.error("Error retrieving attendance count:", err);

    return res.status(500).json({
      statusCode: 1,
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

// 2.  Attendance Distribution

export async function getAttendenceCountDistribution(req, res) {
  let connection;

  try {
    connection = await getConnection(res);

    const { company, date } = req.query;

    const sql = `
   SELECT
    SUM(CASE WHEN STATUS = 'PRESENT' THEN 1 ELSE 0 END) PRESENT_COUNT,
    SUM(CASE WHEN STATUS = 'PRESENT' AND PAYTYPE = 'STAFF' THEN 1 ELSE 0 END) PRESENT_STAFF,
    SUM(CASE WHEN STATUS = 'PRESENT' AND PAYTYPE = 'LABOUR' THEN 1 ELSE 0 END) PRESENT_LABOUR,

    SUM(CASE WHEN STATUS = 'ABSENT' THEN 1 ELSE 0 END) ABSENT_COUNT,
    SUM(CASE WHEN STATUS = 'ABSENT' AND PAYTYPE = 'STAFF' THEN 1 ELSE 0 END) ABSENT_STAFF,
    SUM(CASE WHEN STATUS = 'ABSENT' AND PAYTYPE = 'LABOUR' THEN 1 ELSE 0 END) ABSENT_LABOUR,

    SUM(CASE WHEN STATUS = 'ONDUTY' THEN 1 ELSE 0 END) ONDUTY_COUNT,
    SUM(CASE WHEN STATUS = 'ONDUTY' AND PAYTYPE = 'STAFF' THEN 1 ELSE 0 END) ONDUTY_STAFF,
    SUM(CASE WHEN STATUS = 'ONDUTY' AND PAYTYPE = 'LABOUR' THEN 1 ELSE 0 END) ONDUTY_LABOUR,

    SUM(CASE WHEN STATUS = 'WEEKOFF' THEN 1 ELSE 0 END) WEEKOFF_COUNT,
    SUM(CASE WHEN STATUS = 'WEEKOFF' AND PAYTYPE = 'STAFF' THEN 1 ELSE 0 END) WEEKOFF_STAFF,
    SUM(CASE WHEN STATUS = 'WEEKOFF' AND PAYTYPE = 'LABOUR' THEN 1 ELSE 0 END) WEEKOFF_LABOUR
FROM
(
    SELECT
        UPPER(NVL(B.PAYTYPE,'UNKNOWN')) PAYTYPE,

        CASE
            WHEN EXISTS (
                SELECT 1
                FROM HRONDUTY AA
                JOIN HRONDUTYDET BB1
                    ON BB1.HRONDUTYID = AA.HRONDUTYID
                JOIN HREMPLOYMAST DD
                    ON DD.HREMPLOYMASTID = BB1.IDCARD
                WHERE BB1.ODATE = D.ATT_DATE
                  AND DD.IDCARDNO = B.IDCARD
            ) THEN 'ONDUTY'

            WHEN EXISTS (
                SELECT 1
                FROM HRWOFFBAS W
                JOIN HRWOFFDET WD
                    ON WD.HRWOFFBASID = W.HRWOFFBASID
                WHERE TRIM(W.DAYS) = TO_CHAR(D.ATT_DATE,'FMDAY')
                  AND WD.IDCARDNO = B.IDCARD
            ) THEN 'WEEKOFF'

            WHEN A.EMPID IS NOT NULL THEN 'PRESENT'

            ELSE 'ABSENT'
        END STATUS

    FROM
    (
        SELECT TO_DATE(:DATEVAL,'YYYY-MM-DD') ATT_DATE
        FROM DUAL
    ) D

    CROSS JOIN HREMPLOYDETAILS B

    JOIN HREMPLOYMAST BB
      ON BB.HREMPLOYMASTID = B.HREMPLOYMASTID

    LEFT JOIN JKCHDATTA A
      ON TRUNC(A.DOCDATE) = D.ATT_DATE
     AND A.EMPID = B.IDCARD
     AND A.COMPCODE = :COMPCODE
) T
    `;

    const result = await connection.execute(
      sql,
      {
        DATEVAL: date,
        // TODATE: toDate,
        COMPCODE: company,
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    return res.json({
      statusCode: 0,
      data: result.rows?.[0] || {
        PRESENT_COUNT: 0,
        PRESENT_STAFF: 0,
        PRESENT_LABOUR: 0,

        ABSENT_COUNT: 0,
        ABSENT_STAFF: 0,
        ABSENT_LABOUR: 0,

        ONDUTY_COUNT: 0,
        ONDUTY_STAFF: 0,
        ONDUTY_LABOUR: 0,

        WEEKOFF_COUNT: 0,
        WEEKOFF_STAFF: 0,
        WEEKOFF_LABOUR: 0,
      },
    });
  } catch (err) {
    console.error("Error retrieving attendance count:", err);

    return res.status(500).json({
      statusCode: 1,
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}
// 3. Attendance Distribution Table Data

export async function getAttendenceDistributionTable(req, res) {
  let connection;

  try {
    connection = await getConnection(res);

    const { company, date, statusFilter = "ALL" } = req.query;

    const sql = `
      SELECT *
      FROM
      (
          SELECT
              B.IDCARD AS EMPID,
              BB.FNAME,
              BB.DOB,
              BB.GENDER,
              BB.DISABILITY,
              BB.MARITALSTATUS,
              BB.EMPTYPE,
              BB.EMPID AS IDCARD,
              BB.IDCARDNO,
              D.ATT_DATE DOCDATE,

              A.INDT INDATE,
              A.INTIME,
              A.LOUDT,
              A.LOUTIME,
              A.LINDT,
              A.LINTIME,
              A.OUTDT OUTDATE,
              A.OUTTIME,
              B.DOJ,
              B.PAYTYPE,
              CASE
                  WHEN EXISTS (
                      SELECT 1
                      FROM HRONDUTY AA
                      JOIN HRONDUTYDET BB1
                          ON BB1.HRONDUTYID = AA.HRONDUTYID
                      JOIN HREMPLOYMAST DD
                          ON DD.HREMPLOYMASTID = BB1.IDCARD
                      WHERE BB1.ODATE = D.ATT_DATE
                        AND DD.IDCARDNO = B.IDCARD
                  ) THEN 'ONDUTY'

                  WHEN EXISTS (
                      SELECT 1
                      FROM HRWOFFBAS W
                      JOIN HRWOFFDET WD
                          ON WD.HRWOFFBASID = W.HRWOFFBASID
                      WHERE TRIM(W.DAYS) = TO_CHAR(D.ATT_DATE, 'FMDAY')
                        AND WD.IDCARDNO = B.IDCARD
                  ) THEN 'WEEKOFF'

                  WHEN A.EMPID IS NOT NULL THEN 'PRESENT'

                  ELSE 'ABSENT'
              END STATUS,

              A.MONTHLY,
              A.COMTEMP,
              A.STEMP,
              A.TYPE,
              A.Q1,
              A.Q2,
              A.Q3,
              A.Q4,
              A.SHIFTCNT,
              A.OT,
              (A.OT / 60) OTH,
              A.PER,

       (
                SELECT DISPNAME
                FROM GTDEPTDESGMAST S1
                WHERE B.DEPTNAME = S1.GTDEPTDESGMASTID
              ) DEPARTMENT,

              (
                SELECT DESIGNATION
                FROM GTDESIGNATIONMAST S1
                WHERE B.DESIGNATION = S1.GTDESIGNATIONMASTID
              ) DESIGNATION

          FROM
          (
              SELECT TO_DATE(:DATEVAL, 'YYYY-MM-DD') ATT_DATE
              FROM DUAL
          ) D

          CROSS JOIN HREMPLOYDETAILS B

          JOIN HREMPLOYMAST BB
            ON BB.HREMPLOYMASTID = B.HREMPLOYMASTID

          LEFT JOIN JKCHDATTA A
            ON TRUNC(A.DOCDATE) = D.ATT_DATE
           AND A.EMPID = B.IDCARD
           AND A.EMPMAID = B.HREMPLOYMASTID
           AND A.COMPCODE = :COMPCODE
      ) X
      WHERE
          :STATUSFILTER = 'ALL'
          OR UPPER(X.STATUS) = UPPER(:STATUSFILTER)
      ORDER BY X.EMPID
    `;

    const result = await connection.execute(
      sql,
      {
        DATEVAL: date,
        COMPCODE: company,
        STATUSFILTER: statusFilter,
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    return res.json({
      statusCode: 0,
      count: result.rows.length,
      data: result.rows || [],
    });
  } catch (err) {
    console.error("Error retrieving attendance distribution:", err);

    return res.status(500).json({
      statusCode: 1,
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getAttendenceDesignationWiseCount(req, res) {
  let connection;

  try {
    connection = await getConnection(res);

    const { company, date } = req.query;

    const sql = `
  SELECT
    DESIGNATION,

    COUNT(*) TOTAL_COUNT,

    SUM(CASE WHEN STATUS = 'PRESENT' THEN 1 ELSE 0 END) PRESENT_COUNT,
    SUM(CASE WHEN STATUS = 'PRESENT' AND UPPER(GENDER) = 'MALE' THEN 1 ELSE 0 END) PRESENT_MALE,
    SUM(CASE WHEN STATUS = 'PRESENT' AND UPPER(GENDER) = 'FEMALE' THEN 1 ELSE 0 END) PRESENT_FEMALE,

    SUM(CASE WHEN STATUS = 'ABSENT' THEN 1 ELSE 0 END) ABSENT_COUNT,
    SUM(CASE WHEN STATUS = 'ABSENT' AND UPPER(GENDER) = 'MALE' THEN 1 ELSE 0 END) ABSENT_MALE,
    SUM(CASE WHEN STATUS = 'ABSENT' AND UPPER(GENDER) = 'FEMALE' THEN 1 ELSE 0 END) ABSENT_FEMALE,

    SUM(CASE WHEN STATUS = 'ONDUTY' THEN 1 ELSE 0 END) ONDUTY_COUNT,
    SUM(CASE WHEN STATUS = 'ONDUTY' AND UPPER(GENDER) = 'MALE' THEN 1 ELSE 0 END) ONDUTY_MALE,
    SUM(CASE WHEN STATUS = 'ONDUTY' AND UPPER(GENDER) = 'FEMALE' THEN 1 ELSE 0 END) ONDUTY_FEMALE,

    SUM(CASE WHEN STATUS = 'WEEKOFF' THEN 1 ELSE 0 END) WEEKOFF_COUNT,
    SUM(CASE WHEN STATUS = 'WEEKOFF' AND UPPER(GENDER) = 'MALE' THEN 1 ELSE 0 END) WEEKOFF_MALE,
    SUM(CASE WHEN STATUS = 'WEEKOFF' AND UPPER(GENDER) = 'FEMALE' THEN 1 ELSE 0 END) WEEKOFF_FEMALE

FROM
(
    SELECT
        BB.GENDER,

        (
            SELECT D.DESIGNATION
            FROM GTDESIGNATIONMAST D
            WHERE D.GTDESIGNATIONMASTID = B.DESIGNATION
        ) DESIGNATION,

        CASE
            WHEN EXISTS (
                SELECT 1
                FROM HRONDUTY AA
                JOIN HRONDUTYDET BB1
                    ON BB1.HRONDUTYID = AA.HRONDUTYID
                JOIN HREMPLOYMAST DD
                    ON DD.HREMPLOYMASTID = BB1.IDCARD
                WHERE BB1.ODATE = X.ATT_DATE
                  AND DD.IDCARDNO = B.IDCARD
            ) THEN 'ONDUTY'

            WHEN EXISTS (
                SELECT 1
                FROM HRWOFFBAS W
                JOIN HRWOFFDET WD
                    ON WD.HRWOFFBASID = W.HRWOFFBASID
                WHERE TRIM(W.DAYS) = TO_CHAR(X.ATT_DATE, 'FMDAY')
                  AND WD.IDCARDNO = B.IDCARD
            ) THEN 'WEEKOFF'

            WHEN A.EMPID IS NOT NULL THEN 'PRESENT'

            ELSE 'ABSENT'
        END STATUS

    FROM
    (
        SELECT TO_DATE(:DATEVAL, 'YYYY-MM-DD') ATT_DATE
        FROM DUAL
    ) X

    CROSS JOIN HREMPLOYDETAILS B

    JOIN HREMPLOYMAST BB
        ON BB.HREMPLOYMASTID = B.HREMPLOYMASTID

    LEFT JOIN JKCHDATTA A
        ON TRUNC(A.DOCDATE) = X.ATT_DATE
       AND A.EMPID = B.IDCARD
       AND A.EMPMAID = B.HREMPLOYMASTID
       AND A.COMPCODE = :COMPCODE
) T

GROUP BY DESIGNATION

ORDER BY DESIGNATION
    `;

    const result = await connection.execute(
      sql,
      {
        DATEVAL: date,

        COMPCODE: company,
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    return res.json({
      statusCode: 0,
      data: result.rows || {
        PRESENT_COUNT: 0,
        PRESENT_MALE: 0,
        PRESENT_FEMALE: 0,

        ABSENT_COUNT: 0,
        ABSENT_MALE: 0,
        ABSENT_FEMALE: 0,

        ONDUTY_COUNT: 0,
        ONDUTY_MALE: 0,
        ONDUTY_FEMALE: 0,

        WEEKOFF_COUNT: 0,
        WEEKOFF_MALE: 0,
        WEEKOFF_FEMALE: 0,
      },
    });
  } catch (err) {
    console.error("Error retrieving attendance count:", err);

    return res.status(500).json({
      statusCode: 1,
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getAttendenceDesignationTable(req, res) {
  let connection;

  try {
    connection = await getConnection(res);

    const { company, date, statusFilter = "ALL" } = req.query;

    const sql = `
      SELECT *
      FROM
      (
          SELECT
              B.IDCARD AS EMPID,
              BB.FNAME,
              BB.DOB,
              BB.GENDER,
              BB.DISABILITY,
              BB.MARITALSTATUS,
              BB.EMPTYPE,
              BB.EMPID AS IDCARD,
              BB.IDCARDNO,
              D.ATT_DATE DOCDATE,

              A.INDT INDATE,
              A.INTIME,
              A.LOUDT,
              A.LOUTIME,
              A.LINDT,
              A.LINTIME,
              A.OUTDT OUTDATE,
              A.OUTTIME,
              B.DOJ,
              B.PAYTYPE,
              CASE
                  WHEN EXISTS (
                      SELECT 1
                      FROM HRONDUTY AA
                      JOIN HRONDUTYDET BB1
                          ON BB1.HRONDUTYID = AA.HRONDUTYID
                      JOIN HREMPLOYMAST DD
                          ON DD.HREMPLOYMASTID = BB1.IDCARD
                      WHERE BB1.ODATE = D.ATT_DATE
                        AND DD.IDCARDNO = B.IDCARD
                  ) THEN 'ONDUTY'

                  WHEN EXISTS (
                      SELECT 1
                      FROM HRWOFFBAS W
                      JOIN HRWOFFDET WD
                          ON WD.HRWOFFBASID = W.HRWOFFBASID
                      WHERE TRIM(W.DAYS) = TO_CHAR(D.ATT_DATE, 'FMDAY')
                        AND WD.IDCARDNO = B.IDCARD
                  ) THEN 'WEEKOFF'

                  WHEN A.EMPID IS NOT NULL THEN 'PRESENT'

                  ELSE 'ABSENT'
              END STATUS,

              A.MONTHLY,
              A.COMTEMP,
              A.STEMP,
              A.TYPE,
              A.Q1,
              A.Q2,
              A.Q3,
              A.Q4,
              A.SHIFTCNT,
              A.OT,
              (A.OT / 60) OTH,
              A.PER,

                (
                SELECT DISPNAME
                FROM GTDEPTDESGMAST S1
                WHERE B.DEPTNAME = S1.GTDEPTDESGMASTID
              ) DEPARTMENT,

              (
                SELECT DESIGNATION
                FROM GTDESIGNATIONMAST S1
                WHERE B.DESIGNATION = S1.GTDESIGNATIONMASTID
              ) DESIGNATION

          FROM
          (
              SELECT TO_DATE(:DATEVAL, 'YYYY-MM-DD') ATT_DATE
              FROM DUAL
          ) D

          CROSS JOIN HREMPLOYDETAILS B

          JOIN HREMPLOYMAST BB
            ON BB.HREMPLOYMASTID = B.HREMPLOYMASTID

          LEFT JOIN JKCHDATTA A
            ON TRUNC(A.DOCDATE) = D.ATT_DATE
           AND A.EMPID = B.IDCARD
           AND A.EMPMAID = B.HREMPLOYMASTID
           AND A.COMPCODE = :COMPCODE
      ) X
      WHERE
          :STATUSFILTER = 'ALL'
          OR UPPER(X.STATUS) = UPPER(:STATUSFILTER)
      ORDER BY X.EMPID
    `;

    const result = await connection.execute(
      sql,
      {
        DATEVAL: date,
        COMPCODE: company,
        STATUSFILTER: statusFilter,
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    return res.json({
      statusCode: 0,
      count: result.rows.length,
      data: result.rows || [],
    });
  } catch (err) {
    console.error("Error retrieving attendance distribution:", err);

    return res.status(500).json({
      statusCode: 1,
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getDesignation(req, res) {
  let connection;
  try {
    connection = await getConnection(res);
    const sql = `
    SELECT DISTINCT DESIGNATION FROM GTDESIGNATIONMAST
    `;
    const result = await connection.execute(
      sql,
      {},
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );
    return res.json({
      statusCode: 0,
      count: result.rows.length,
      data: result.rows || [],
    });
  } catch (err) {
    console.error("Error retrieving attendance distribution:", err);

    return res.status(500).json({
      statusCode: 1,
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}
export async function getDepartment(req, res) {
  let connection;
  try {
    connection = await getConnection(res);
    const sql = `
    SELECT DISTINCT DISPNAME  FROM GTDEPTDESGMAST
    `;
    const result = await connection.execute(
      sql,
      {},
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );
    return res.json({
      statusCode: 0,
      count: result.rows.length,
      data: result.rows || [],
    });
  } catch (err) {
    console.error("Error retrieving attendance distribution:", err);

    return res.status(500).json({
      statusCode: 1,
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

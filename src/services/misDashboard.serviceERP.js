import { getConnection} from "../constants/db.connection.js";
import { IN_HAND } from "../constants/dbConstants.js";
import { getTopCustomers, getProfit, getTurnOver, getNewCustomers, getLoss } from "../queries/misDashboardERP.js";


export async function get(req, res) {
    const connection = await getConnection(res)
    try {
        const { type, filterYear, previousYear } = req.query

        const totalTurnOver = await getTurnOver(connection, type, filterYear, previousYear);
        const profit = await getProfit(connection, type, filterYear, previousYear);
        const newCustomers = await getNewCustomers(connection, type, filterYear, previousYear);
        const topCustomers = await getTopCustomers(connection, type, filterYear, previousYear);
        const loss = await getLoss(connection, type, filterYear, previousYear);
        return res.json({
            statusCode: 0, data: {
                totalTurnOver,
                profit,
                newCustomers,
                topCustomers,
                loss
            }
        })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}
export async function executeProcedure(req, res) {
    const connection = await getConnection(res)
    try {

        await connection.execute(`BEGIN MISPROD('SPA'); END;`);
        res.json({ success: true, message: "Data refetch executed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}
export async function getOrdersInHand(req, res) {
    const connection = await getConnection(res)
    try {
        const { filterYear } = req.query;

        const sql = ` 
        SELECT  customer, order_count
        FROM (
            SELECT  customer, COUNT(orderno) as order_count
            FROM MISORDSALESVAL
            WHERE status = 'In Hand'
            and finyr = '${filterYear}'
            GROUP BY status, customer
            ORDER BY COUNT(orderno) DESC
        )  where rownum < 10`

        let result = await connection.execute(sql);
        result = result.rows.map(row => ({
            buyer: row[0], value: row[1]
        }))
        return res.json({
            statusCode: 0, data: result
        })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}

export async function getOrdersInHandMonthWise(req, res) {
    const connection = await getConnection(res)
    try {
        const monthArr = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map(i =>
            `
            select 
            to_char(ADD_MONTHS(CURRENT_DATE, ${i}), 'Mon-YYYY') as monthYear ,
            to_char(ADD_MONTHS(CURRENT_DATE, ${i}), 'MM') as monthOnly ,
            to_char(ADD_MONTHS(CURRENT_DATE, ${i}), 'YYYY') as yearOnly ,
            (
            select count(1) from MISORDSALESVAL 
            where extract(YEAR from planshipdt) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, ${i}))
            and extract(MONTH from planshipdt) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, ${i}))
            ) AS PLANNED,
            (
            select count(1) from MISORDSALESVAL 
            where extract(YEAR from actshipdt) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, ${i}))
            and extract(MONTH from actshipdt) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, ${i}))
            ) AS ACTUAL
            FROM DUAL
        `
        )

        const sql = monthArr.join('union')

        let result = await connection.execute(`select * from (${sql}) order by yearOnly,monthOnly`);
        result = result.rows.map(row => ({
            date: row[0], planned: row[3], actual: row[4]
        }))
        return res.json({
            statusCode: 0, data: result, sql
        })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}


export async function getActualVsBudgetValueMonthWise(req, res) {
    const connection = await getConnection(res)
    try {
        const monthArr = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map(i =>
            `
            select 
            to_char(ADD_MONTHS(CURRENT_DATE, ${i}), 'Mon-YYYY') as monthYear ,
            to_char(ADD_MONTHS(CURRENT_DATE, ${i}), 'MM') as monthOnly ,
            to_char(ADD_MONTHS(CURRENT_DATE, ${i}), 'YYYY') as yearOnly ,
            (
                select round(COALESCE(sum(PLANSALESVAL),0)) from MISORDSALESVAL
            where extract(YEAR from BPODATE) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, ${i}))
            and extract(MONTH from BPODATE) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, ${i}))
            ) AS PLANNED,
            (
                select round(COALESCE(sum(ACTSALVAL),0)) from MISORDSALESVAL
            where extract(YEAR from BPODATE) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, ${i}))
            and extract(MONTH from BPODATE) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, ${i}))
            ) AS ACTUAL
            FROM DUAL
        `
        )
        const sql = monthArr.join('union')
        let result = await connection.execute(`select * from (${sql}) order by yearOnly,monthOnly`);
        result = result.rows.map(row => ({
            date: row[0], planned: row[3], actual: row[4]
        }))
        return res.json({
            statusCode: 0, data: result, sql
        })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}
export async function getYearlyComp(req, res) {
    const connection = await getConnection(res)
    try {
        const { } = req.query;

        const sql =
            `
            SELECT A.FINYR,A.CUSTOMER,SUM(A.ORDERQTY) ORDERQTY FROM MISORDSALESVAL A
            GROUP BY A.FINYR,A.CUSTOMER
            ORDER BY 2,1,3
     `

        const result = await connection.execute(sql)
        let resp = result.rows.map(po => ({

            year: po[0],
            customer: po[1],
            orderQty: po[2],

        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}
export async function getBuyerWiseRevenue(req, res) {
    const connection = await getConnection(res)
    try {
        const { filterYear } = req.query;

        const sql =
            `
            SELECT A.CUSTOMER,SUM(A.ACTSALVAL) FROM MISORDSALESVAL A
            WHERE A.ACTSALVAL > 0 AND A.FINYR = '${filterYear}'
            GROUP BY A.CUSTOMER
            ORDER BY 1
     `

        const result = await connection.execute(sql)
        let resp = result.rows.map(po => ({

            customer: po[0],
            revenue: po[1],


        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}


export async function getActualVsBudget(req, res) {
    const connection = await getConnection(res);
    try {
        const { filterMonth, filterSupplier, filterYear, filterAll } = req.query;

        let sql = '';

        if (filterAll === 'Detailed') {
            sql = `
                SELECT A.FINYR,A.ORDERNO,A.BUYERCODE,A.TYPENAME,A.YARNCOST,A.FABRICCOST,A.ACCCOST,A.CMTCOST,
                A.OTHERCOST,A.SALECOST,A.ACTPROFIT,A.ACTPROFITPER,A.ORD,A.MON,A.ORDERNO GRP 
                FROM MISORDBUDACTDETAILS A  
                               ORDER BY BUYERCODE,ORDERNO,ORD`
        } else {
            sql = `
                SELECT A.FINYR,ORDERNO,A.BUYERCODE,A.TYPENAME,A.YARNCOST,A.FABRICCOST,A.ACCCOST,A.CMTCOST,
                A.OTHERCOST,A.SALECOST,A.ACTPROFIT,A.ACTPROFITPER,A.ORD,A.MON,A.FINYR||A.MON GRP 
                FROM MISORDBUDACTCDETAILS A 
                              ORDER BY BUYERCODE,ORDERNO,ORD`
        }

        const result = await connection.execute(sql);
        let resp = result.rows.map(po => ({
            finYr: po[0],
            orderNo: po[1],
            buyerCode: po[2],
            typeName: po[3],
            yarnCost: po[4],
            fabricCost: po[5],
            accCost: po[6],
            cmtCost: po[7],
            otherCost: po[8],
            saleCost: po[9],
            actProfit: po[10],
            actProfitPer: po[11],
            ord: po[12],
            mon: po[13],
        }));

        return res.json({ statusCode: 0, data: resp });
    } catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await connection.close();
    }
}

export async function getShortShipmentRatio(req, res) {
    const connection = await getConnection(res)
    try {
        const { filterYear, filterMonth, filterSupplier } = req.query;
        let sql
        if (filterMonth || filterSupplier || filterYear) {
            sql =
                `
        SELECT 
        orderNo,
        customer,
        orderQty,
        shipQty,
        (shipQty - orderQty) AS difference,
        ROUND((shipQty - orderQty) / orderQty * 100, 2) AS difference_percentage
    FROM 
        MISORDSALESVAL
   
    ORDER BY 
        difference_percentage DESC
 `
        } else {
            res.status(200).json({ message: 'filterMonth and filterSupplier are required' });
            return;
        }

        const result = await connection.execute(sql)
        let resp = result.rows.map(po => ({
            orderNo: po[0],
            customer: po[1],
            orderQty: po[2],
            shipQty: po[3],
            diffrence: po[4],
            percentage: po[5]

        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}


export async function turnOverCustomerWise(req, res) {
    const connection = await getConnection(res)
    try {
        const { finYear, companyName } = req.query;

        const sql =
            `
     SELECT A.FINYR,C.COMPCODE,A.CUSTOMER,C.COMPNAME,SUM(NVL(A.PLANSALESVAL,0)) VALUE FROM MISORDSALESVAL A
JOIN GTNORDERENTRY B ON A.ORDERNO = B.ORDERNO AND B.ORDERTYPE = 'ORDER'
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = B.COMPCODE
WHERE A.FINYR = '${finYear}' AND  C.COMPCODE = '${companyName}'
GROUP BY A.FINYR,C.COMPCODE,A.CUSTOMER,C.COMPNAME
ORDER BY 1,2,3
     `;

        const result = await connection.execute(sql)
        let resp = result.rows?.map(po => ({
            finYear: po[0],
            compCode: po[1],
            customer: po[2],
            compName: po[3],
            currentValue: po[4],
        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}
export async function turnOverCountryWise(req, res) {
    const connection = await getConnection(res)
    try {
        const { finYear, companyName } = req.query; // ✅ only finYear

        let sql = `
SELECT A.FINYR,C.COMPCODE,C.COMPNAME,E.COUNTRYNAME,SUM(NVL(A.PLANSALESVAL,0)) VALUE FROM MISORDSALESVAL A
JOIN GTNORDERENTRY B ON A.ORDERNO = B.ORDERNO AND B.ORDERTYPE = 'ORDER'
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = B.COMPCODE
JOIN GTBUYERMAST D ON D.BUYERCODE = A.CUSTOMER
JOIN GTCOUNTRYMAST E ON E.GTCOUNTRYMASTID = D.COUNTRY
WHERE A.FINYR = '${finYear}' AND C.COMPCODE = '${companyName}'
GROUP BY A.FINYR,C.COMPCODE,E.COUNTRYNAME,C.COMPNAME
ORDER BY 1,2,3
        `;

        const result = await connection.execute(sql)
        let resp = result.rows?.map(po => ({
            finYear: po[0],
            compCode: po[1],
            compName: po[2],
            countryName: po[3],
            value: po[4]
        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}
export async function turnOverStyleItemWise(req, res) {
    const connection = await getConnection(res)
    try {
        const { finYear, companyName } = req.query; // ✅ only finYear

        //         let sql = `
        //  SELECT A.FINYR,A.COMPCODE,A.STYLEITEM,A.CATEGORYNAME,SUM(A.VALUE) VALUE 
        // FROM (
        // SELECT A.ORDERNO,A.FINYR,C.COMPCODE,A.CUSTOMER,F.STYLEITEM, F.CATEGORYNAME,ROUND((NVL(A.PLANSALESVAL,0))/FF.ITEMCNT,2) VALUE FROM MISORDSALESVAL A
        // JOIN GTNORDERENTRY B ON A.ORDERNO = B.ORDERNO
        // JOIN GTCOMPMAST C ON C.GTCOMPMASTID = B.COMPCODE
        // JOIN GTBUYERMAST D ON D.BUYERCODE = A.CUSTOMER
        // JOIN GTCOUNTRYMAST E ON E.GTCOUNTRYMASTID = D.COUNTRY
        // JOIN (
        // SELECT DISTINCT A.ORDERNO,C.STYLEITEM, E.CATEGORYNAME
        // FROM GTNORDERENTRY A
        // JOIN GTNORDERSTYLEDET B ON A.GTNORDERENTRYID = B.GTNORDERENTRYID
        // JOIN GTSTYLEITEMMAST C ON C.GTSTYLEITEMMASTID = B.STYLEITEM
        // JOIN GTSTYLEGROUPMAST D ON C.STYLEGROUP = D.GTSTYLEGROUPMASTID 
        // JOIN GTSTYLECATMAST E ON D.SUBCATEGORY = E.GTSTYLECATMASTID 
        // ) F ON F.ORDERNO = A.ORDERNO
        // JOIN (
        // SELECT DISTINCT A.ORDERNO,COUNT(*) ITEMCNT FROM GTNORDERENTRY A
        // JOIN GTNORDERSTYLEDET B ON A.GTNORDERENTRYID = B.GTNORDERENTRYID
        // JOIN GTSTYLEITEMMAST C ON C.GTSTYLEITEMMASTID = B.STYLEITEM
        // GROUP BY A.ORDERNO
        // ) FF ON FF.ORDERNO = A.ORDERNO
        // ) A 
        // WHERE A.FINYR = '${finYear}'  AND  A.COMPCODE = '${companyName}'
        // GROUP BY A.FINYR,A.COMPCODE,A.STYLEITEM,A.CATEGORYNAME HAVING SUM(A.VALUE) > 0
        // ORDER BY 1,2,3

        //     `;
        //         let sql = `
        // SELECT A.FINYR,A.COMPCODE,A.CUSTOMER,A.COMPNAME,A.STYLEITEM,A.CATEGORYNAME,SUM(A.VALUE) VALUE 
        // FROM (
        // SELECT A.ORDERNO,A.FINYR,C.COMPCODE,C.COMPNAME,A.CUSTOMER,F.STYLEITEM, F.CATEGORYNAME,ROUND((NVL(A.PLANSALESVAL,0))/FF.ITEMCNT,2) VALUE FROM MISORDSALESVAL A
        // JOIN GTNORDERENTRY B ON A.ORDERNO = B.ORDERNO
        // JOIN GTCOMPMAST C ON C.GTCOMPMASTID = B.COMPCODE
        // JOIN GTBUYERMAST D ON D.BUYERCODE = A.CUSTOMER
        // JOIN GTCOUNTRYMAST E ON E.GTCOUNTRYMASTID = D.COUNTRY
        // JOIN (
        // SELECT DISTINCT A.ORDERNO,C.STYLEITEM, E.CATEGORYNAME
        // FROM GTNORDERENTRY A
        // JOIN GTNORDERSTYLEDET B ON A.GTNORDERENTRYID = B.GTNORDERENTRYID
        // JOIN GTSTYLEITEMMAST C ON C.GTSTYLEITEMMASTID = B.STYLEITEM
        // JOIN GTSTYLEGROUPMAST D ON C.STYLEGROUP = D.GTSTYLEGROUPMASTID 
        // JOIN GTSTYLECATMAST E ON D.SUBCATEGORY = E.GTSTYLECATMASTID 
        // ) F ON F.ORDERNO = A.ORDERNO
        // JOIN (
        // SELECT DISTINCT A.ORDERNO,COUNT(*) ITEMCNT FROM GTNORDERENTRY A
        // JOIN GTNORDERSTYLEDET B ON A.GTNORDERENTRYID = B.GTNORDERENTRYID
        // JOIN GTSTYLEITEMMAST C ON C.GTSTYLEITEMMASTID = B.STYLEITEM
        // GROUP BY A.ORDERNO
        // ) FF ON FF.ORDERNO = A.ORDERNO
        // ) A 
        //  WHERE A.FINYR = '${finYear}'  AND  A.COMPCODE = '${companyName}'
        // GROUP BY A.FINYR,A.COMPCODE,A.CUSTOMER,A.STYLEITEM,A.CATEGORYNAME,A.COMPNAME
        // HAVING SUM(NVL(A.VALUE,0)) > 0
        // ORDER BY 1,2,3
        // `
        let sql = `

SELECT A.FINYR,A.COMPCODE,A.CUSTOMER,A.COMPNAME,A.STYLEITEM,A.CATEGORYNAME,SUM(A.VALUE) VALUE 
FROM (SELECT A.ORDERNO,A.FINYR,C.COMPCODE,C.COMPNAME,A.CUSTOMER,F.STYLEITEM, F.CATEGORYNAME,
ROUND((NVL(A.PLANSALESVAL,0))/FF.ITEMCNT,2) VALUE FROM MISORDSALESVAL A
JOIN GTNORDERENTRY B ON A.ORDERNO = B.ORDERNO AND B.ORDERTYPE = 'ORDER'
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = B.COMPCODE
JOIN (
SELECT DISTINCT A.ORDERNO,C.STYLEITEM, E.CATEGORYNAME
FROM GTNORDERENTRY A
JOIN GTNORDERSTYLEDET B ON A.GTNORDERENTRYID = B.GTNORDERENTRYID
JOIN GTSTYLEITEMMAST C ON C.GTSTYLEITEMMASTID = B.STYLEITEM
JOIN GTSTYLEGROUPMAST D ON C.STYLEGROUP = D.GTSTYLEGROUPMASTID 
JOIN GTSTYLECATMAST E ON D.SUBCATEGORY = E.GTSTYLECATMASTID 
) F ON F.ORDERNO = A.ORDERNO
JOIN (
SELECT A.ORDERNO,COUNT(*) ITEMCNT FROM (
SELECT DISTINCT A.ORDERNO,C.STYLEITEM ITEMCNT FROM GTNORDERENTRY A
JOIN GTNORDERSTYLEDET B ON A.GTNORDERENTRYID = B.GTNORDERENTRYID
JOIN GTSTYLEITEMMAST C ON C.GTSTYLEITEMMASTID = B.STYLEITEM
) A
GROUP BY A.ORDERNO
) FF ON FF.ORDERNO = A.ORDERNO
) A 
WHERE A.FINYR = '${finYear}'  AND  A.COMPCODE = '${companyName}'
GROUP BY A.FINYR,A.COMPCODE,A.CUSTOMER,A.STYLEITEM,A.CATEGORYNAME,A.COMPNAME
HAVING SUM(NVL(A.VALUE,0)) > 0
ORDER BY 1,2,3
`

        const result = await connection.execute(sql)
        let resp = result.rows?.map(po => ({
            finYear: po[0],
            compCode: po[1],
            customer: po[2],
            compName: po[3],     // ✅ correct
            styleItem: po[4],   // ✅ correct
            category: po[5],    // ✅ correct
            value: po[6]
        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}


export async function turnOverMonthWise(req, res) {
    const connection = await getConnection(res)
    try {
        const { finYear, companyName } = req.query;

        let sql = `
SELECT 
    A.ORDMON,C.COMPNAME,
    SUM(NVL(A.PLANSALESVAL,0)) VALUE,
    MAX(A.ORDDATE) ACTSHIDT
FROM MISORDSALESVAL A
JOIN GTNORDERENTRY B ON A.ORDERNO = B.ORDERNO AND B.ORDERTYPE = 'ORDER'
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = B.COMPCODE
WHERE A.FINYR = '${finYear}' AND C.COMPCODE = '${companyName}'
GROUP BY A.ORDMON,C.COMPNAME
HAVING SUM(NVL(A.PLANSALESVAL,0)) > 0 
ORDER BY 4,1,2
`;


        const result = await connection.execute(sql)
        let resp = result.rows?.map(po => ({
            month: po[0],        // ORDMON
            compName: po[1],     // COMPNAME
            value: po[2],        // SUM(VALUE)
            date: po[3]

        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}
export async function turnOverQuarterWise(req, res) {
    const connection = await getConnection(res)
    try {
        const { finYear, companyName } = req.query;

        let sql = `
SELECT D.QUARTER,C.COMPNAME,SUM(NVL(A.PLANSALESVAL,0)) VALUE ,to_char(PSTARTDATE, 'MONTH') AS STARTMONTH ,to_char(PSTARTDATE, 'MM') AS STARTMONTH FROM MISORDSALESVAL A
JOIN GTNORDERENTRY B ON A.ORDERNO = B.ORDERNO AND B.ORDERTYPE = 'ORDER'
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = B.COMPCODE
JOIN GTFINANCIALYEARDTL D ON A.ORDDATE BETWEEN D.PSTARTDATE AND D.PENDDATE
WHERE A.FINYR = '${finYear}' AND C.COMPCODE = '${companyName}'
GROUP BY D.QUARTER ,to_char(PSTARTDATE, 'MONTH') ,to_char(PSTARTDATE, 'MM'),C.COMPNAME
HAVING SUM(NVL(A.PLANSALESVAL,0)) > 0 
ORDER BY 1,5
`;


        const result = await connection.execute(sql)
        let resp = result.rows?.map(po => ({
            quarter: po[0],     // D.QUARTER
            compName: po[1],    // C.COMPNAME
            value: po[2],       // SUM VALUE
            monthName: po[3],
            monthInt: po[4]

        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}
export async function turnOverYearWise(req, res) {
    const connection = await getConnection(res)
    try {
        const { companyName } = req.query;

        let sql = `
SELECT A.FINYR,C.COMPNAME,SUM(NVL(A.PLANSALESVAL,0)) VALUE FROM MISORDSALESVAL A
JOIN GTNORDERENTRY B ON A.ORDERNO = B.ORDERNO AND B.ORDERTYPE = 'ORDER'
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = B.COMPCODE
WHERE  C.COMPCODE = '${companyName}' AND A.FINYR IS NOT NULL
GROUP BY A.FINYR,C.COMPNAME
HAVING SUM(NVL(A.PLANSALESVAL,0)) > 0 
ORDER BY 1,3
`;


        const result = await connection.execute(sql)
        let resp = result.rows?.map(po => ({

            year: po[0],
            compName: po[1],
            value: po[2],

        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}
export async function turnOverSingleMonthWise(req, res) {
    const connection = await getConnection(res)
    try {
        const { finYear, companyName, month } = req.query;

        let sql = `
SELECT A.ACTDELMON,SUM(NVL(A.PLANSALESVAL,0)) VALUE,MAX(A.ORDDATE) ACTSHIDT FROM MISORDSALESVAL A
JOIN GTNORDERENTRY B ON A.ORDERNO = B.ORDERNO
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = B.COMPCODE
WHERE A.FINYR = '${finYear}' AND A.ORDMON = '${month}'  AND C.COMPCODE = '${companyName}'
GROUP BY A.ORDMON 
HAVING SUM(NVL(A.PLANSALESVAL,0)) > 0 
ORDER BY 3,1,2
`;


        const result = await connection.execute(sql)
        let resp = result.rows?.map(po => ({

            Month: po[0],
            value: po[1],
            date: po[2]

        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}

export async function turnOverBreakUpCustomerWise(req, res) {
    const connection = await getConnection(res)
    try {
        const { finYear, companyName } = req.query;

        const sql =
            `
SELECT A.ORDERNO,A.ORDDATE,B.STYLEREFNO,B.ORDERQTY,B.ORDERUOM,A.CUSTOMER,C.COMPNAME,SUM(NVL(A.PLANSALESVAL,0)) VALUE FROM MISORDSALESVAL A
JOIN GTNORDERENTRY B ON A.ORDERNO = B.ORDERNO AND B.ORDERTYPE = 'ORDER'
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = B.COMPCODE
WHERE A.FINYR = '${finYear}' AND C.COMPCODE = '${companyName}'
GROUP BY A.ORDERNO,A.ORDDATE,A.CUSTOMER,C.COMPNAME,B.STYLEREFNO,B.ORDERQTY,B.ORDERUOM
HAVING SUM(NVL(A.PLANSALESVAL,0)) > 0 
ORDER BY 1,5
     `;

        const result = await connection.execute(sql)
        let resp = result.rows?.map(po => ({
            orderNo: po[0],
            orderDate: po[1],
            styleRefNo: po[2],
            orderQty: po[3],
            orderUOM: po[4],

            customer: po[5],
            compName: po[6],
            value: po[7],
        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}

export async function turnOverBreakUpCountryWise(req, res) {
    const connection = await getConnection(res)
    try {
        const { finYear, companyName } = req.query; // ✅ only finYear

        let sql = `
SELECT  A.ORDERNO,A.ORDDATE,B.STYLEREFNO,B.ORDERQTY,B.ORDERUOM,C.COMPNAME,E.COUNTRYNAME,SUM(NVL(A.PLANSALESVAL,0)) VALUE FROM MISORDSALESVAL A
JOIN GTNORDERENTRY B ON A.ORDERNO = B.ORDERNO AND B.ORDERTYPE = 'ORDER'
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = B.COMPCODE
JOIN GTBUYERMAST D ON D.BUYERCODE = A.CUSTOMER
JOIN GTCOUNTRYMAST E ON E.GTCOUNTRYMASTID = D.COUNTRY
WHERE A.FINYR = '${finYear}' AND C.COMPCODE = '${companyName}'
GROUP BY A.ORDERNO,A.ORDDATE,C.COMPNAME,E.COUNTRYNAME,B.STYLEREFNO,B.ORDERQTY,B.ORDERUOM
ORDER BY 1,2,7
        `;

        const result = await connection.execute(sql)
        let resp = result.rows?.map(po => ({
            orderNo: po[0],
            orderDate: po[1],
            styleRefNo: po[2],
            orderQty: po[3],
            orderUOM: po[4],

            compName: po[5],
            countryName: po[6],
            value: po[7]
        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}

export async function turnOverMonthWiseBreakUp(req, res) {
    const connection = await getConnection(res)
    try {
        const { finYear, companyName } = req.query;

        let sql = `
SELECT 
    A.ORDERNO,A.ORDDATE,B.STYLEREFNO,B.ORDERQTY,B.ORDERUOM,A.ORDMON,C.COMPNAME,
    SUM(NVL(A.PLANSALESVAL,0)) VALUE,
    MAX(A.ORDDATE) ACTSHIDT
FROM MISORDSALESVAL A
JOIN GTNORDERENTRY B ON A.ORDERNO = B.ORDERNO AND B.ORDERTYPE = 'ORDER'
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = B.COMPCODE
WHERE A.FINYR = '${finYear}' AND C.COMPCODE = '${companyName}'
GROUP BY A.ORDERNO,A.ORDDATE,A.ORDMON,C.COMPNAME,B.STYLEREFNO,B.ORDERQTY,B.ORDERUOM
HAVING SUM(NVL(A.PLANSALESVAL,0)) > 0 
ORDER BY 6,7,8
`;


        const result = await connection.execute(sql)
        let resp = result.rows?.map(po => ({
            orderNo: po[0],
            orderDate: po[1],
            styleRefNo: po[2],
            orderQty: po[3],
            orderUOM: po[4],

            month: po[5],        // ORDMON
            compName: po[6],     // COMPNAME
            value: po[7],        // SUM(VALUE)
            date: po[8]

        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}

export async function turnOverQuarterWiseBreakUp(req, res) {
    const connection = await getConnection(res)
    try {
        const { finYear, companyName } = req.query;

        let sql = `
SELECT A.ORDERNO,A.ORDDATE,B.STYLEREFNO,B.ORDERQTY,B.ORDERUOM,D.QUARTER,C.COMPNAME,SUM(NVL(A.PLANSALESVAL,0)) VALUE ,to_char(PSTARTDATE, 'MONTH') AS STARTMONTH ,to_char(PSTARTDATE, 'MM') AS STARTMONTH FROM MISORDSALESVAL A
JOIN GTNORDERENTRY B ON A.ORDERNO = B.ORDERNO AND B.ORDERTYPE = 'ORDER'
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = B.COMPCODE
JOIN GTFINANCIALYEARDTL D ON A.ORDDATE BETWEEN D.PSTARTDATE AND D.PENDDATE
WHERE A.FINYR = '${finYear}' AND C.COMPCODE = '${companyName}'
GROUP BY A.ORDERNO,A.ORDDATE,D.QUARTER ,to_char(PSTARTDATE, 'MONTH') ,to_char(PSTARTDATE, 'MM'),C.COMPNAME,B.STYLEREFNO,B.ORDERQTY,B.ORDERUOM
HAVING SUM(NVL(A.PLANSALESVAL,0)) > 0 
ORDER BY 6,7
`;


        const result = await connection.execute(sql)
        let resp = result.rows?.map(po => ({
            orderNo: po[0],
            orderDate: po[1],
            styleRefNo: po[2],
            orderQty: po[3],
            orderUOM: po[4],
            quarter: po[5],     // D.QUARTER
            compName: po[6],    // C.COMPNAME
            value: po[7],       // SUM VALUE
            monthName: po[8],
            monthInt: po[9]

        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}

export async function turnOverYearWiseBreakUp(req, res) {
    const connection = await getConnection(res)
    try {
        const { companyName } = req.query;

        let sql = `
SELECT  A.ORDERNO,A.ORDDATE,B.STYLEREFNO,B.ORDERQTY,B.ORDERUOM,A.FINYR,C.COMPNAME,SUM(NVL(A.PLANSALESVAL,0)) VALUE FROM MISORDSALESVAL A
JOIN GTNORDERENTRY B ON A.ORDERNO = B.ORDERNO AND B.ORDERTYPE = 'ORDER'
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = B.COMPCODE
WHERE  C.COMPCODE = '${companyName}' AND A.FINYR IS NOT NULL
GROUP BY A.FINYR,C.COMPNAME, A.ORDERNO,A.ORDDATE,B.STYLEREFNO,B.ORDERQTY,B.ORDERUOM
HAVING SUM(NVL(A.PLANSALESVAL,0)) > 0 
ORDER BY 6,2
`;


        const result = await connection.execute(sql)
        let resp = result.rows?.map(po => ({
            orderNo: po[0],
            orderDate: po[1],
            styleRefNo: po[2],
            orderQty: po[3],
            orderUOM: po[4],
            year: po[5],
            compName: po[6],
            value: po[7],

        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}

export async function turnOverStyleItemWiseBreakUp(req, res) {
    const connection = await getConnection(res)
    try {
        const { finYear, companyName } = req.query; // ✅ only finYear

        let sql = `

SELECT A.ORDERNO,A.ORDDATE,A.STYLEREFNO,A.ORDERQTY,A.ORDERUOM,A.COMPNAME,A.STYLEITEM,A.CATEGORYNAME,SUM(A.VALUE) VALUE 
FROM (SELECT A.ORDERNO,A.ORDDATE,B.STYLEREFNO,B.ORDERQTY,B.ORDERUOM,A.FINYR,C.COMPCODE,C.COMPNAME,A.CUSTOMER,F.STYLEITEM, F.CATEGORYNAME,
ROUND((NVL(A.PLANSALESVAL,0))/FF.ITEMCNT,2) VALUE FROM MISORDSALESVAL A
JOIN GTNORDERENTRY B ON A.ORDERNO = B.ORDERNO AND B.ORDERTYPE = 'ORDER'
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = B.COMPCODE
JOIN (
SELECT DISTINCT A.ORDERNO,C.STYLEITEM, E.CATEGORYNAME
FROM GTNORDERENTRY A
JOIN GTNORDERSTYLEDET B ON A.GTNORDERENTRYID = B.GTNORDERENTRYID
JOIN GTSTYLEITEMMAST C ON C.GTSTYLEITEMMASTID = B.STYLEITEM
JOIN GTSTYLEGROUPMAST D ON C.STYLEGROUP = D.GTSTYLEGROUPMASTID 
JOIN GTSTYLECATMAST E ON D.SUBCATEGORY = E.GTSTYLECATMASTID 
) F ON F.ORDERNO = A.ORDERNO
JOIN (
SELECT A.ORDERNO,COUNT(*) ITEMCNT FROM (
SELECT DISTINCT A.ORDERNO,C.STYLEITEM ITEMCNT FROM GTNORDERENTRY A
JOIN GTNORDERSTYLEDET B ON A.GTNORDERENTRYID = B.GTNORDERENTRYID
JOIN GTSTYLEITEMMAST C ON C.GTSTYLEITEMMASTID = B.STYLEITEM
) A
GROUP BY A.ORDERNO
) FF ON FF.ORDERNO = A.ORDERNO
) A 
WHERE A.FINYR = '${finYear}' AND A.COMPCODE = '${companyName}'
GROUP BY A.ORDERNO,A.ORDDATE,A.STYLEITEM,A.CATEGORYNAME,A.COMPNAME,A.STYLEREFNO,A.ORDERQTY,A.ORDERUOM
HAVING SUM(NVL(A.VALUE,0)) > 0
ORDER BY 2,1,3,6
`

        const result = await connection.execute(sql)
        let resp = result.rows?.map(po => ({
            orderNo: po[0],
            orderDate: po[1],
            styleRefNo: po[2],
            orderQty: po[3],
            orderUOM: po[4],
            compName: po[5],     // ✅ correct
            styleItem: po[6],   // ✅ correct
            category: po[7],    // ✅ correct
            value: po[8]
        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}
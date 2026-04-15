import { Box, Card, CardContent, CardHeader, useTheme } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState, useEffect } from "react";
import { useGetFabricInwardCustQuery, useGetFabricInwardQuarterCompareQuery } from "../../../redux/service/freeLookFabric";
import CustomerTransQuarter from "./CustomerTransQuarter";
import { DropdownNew } from "../../../utils/hleper";

const FabricInwardQuarterCompare = ({
    selectedYear,
    setSelectedYear,
    category,
    finYear,
    setCategory,
    selectmonths,
    setSelectmonths,
}) => {
    const theme = useTheme();

    const [showTable, setShowTable] = useState(false);
    const [custName, setCustName] = useState("");
    const [selectQuarter, setSelectQuarter] = useState("");

    const { data: custNames } = useGetFabricInwardCustQuery({
        params: { category },
    });

    const cusData = custNames?.data.map((c) => ({ custName: c }));
    useEffect(() => {
        setCustName("");
    }, [category]);
    const { data: fabricData } = useGetFabricInwardQuarterCompareQuery(
        { params: { category, customer: custName } },
        { skip: !category }
    );

    const rows = fabricData?.data || [];

    /* ---------------- NORMALIZATION ---------------- */
    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    const customers = [...new Set(rows.map((r) => r.customer).filter((c) => c?.trim()))];
    const years = [...new Set(rows.map((r) => r.finYear))].sort();

    const dataMap = {};
    rows.forEach(({ customer, quarter, finYear, qty }) => {
        if (!dataMap[customer]) dataMap[customer] = {};
        if (!dataMap[customer][quarter]) dataMap[customer][quarter] = {};
        dataMap[customer][quarter][finYear] = Number(qty || 0);
    });

    const QUARTER_COLORS = { Q1: "#E6733C", Q2: "#FF0000", Q3: "#800080", Q4: "#264653" };

    /* ---------------- OLD COLUMN CHART OPTIONS ---------------- */
    const getColumnOptions = () => {
        const isInhouseNoCustomer = category === "INHOUSE" && !custName;

        // Adjust bar width and spacing based on conditions
        const pointPadding = isInhouseNoCustomer ? 0.15 : 0.1; // Increased from 0.1
        const groupPadding = isInhouseNoCustomer ? 0.15 : 0.2; // Reduced from 0.2 for wider bars
        const pointWidth = isInhouseNoCustomer ? null : null; // Let Highcharts calculate based on pointPadding and groupPadding

        const legendSeries = quarters.map((qtr) => ({
            id: qtr,
            name: qtr,
            color: QUARTER_COLORS[qtr],
            showInLegend: true,
            enableMouseTracking: false,
            data: [],
        }));

        const series = [...legendSeries];

        quarters.forEach((qtr) => {
            years.forEach((year) => {
                series.push({
                    name: qtr,
                    linkedTo: qtr,
                    color: QUARTER_COLORS[qtr],
                    showInLegend: false,
                    data: customers.map((cust) => {
                        const value = dataMap[cust]?.[qtr]?.[year] || 0;
                        return {
                            y: value === 0 ? null : value,
                            customer: cust,
                            quarter: qtr,
                            finYear: year,
                        };
                    }),
                });
            });
        });

        return {
            chart: {
                type: "column",
                height: 330,
                backgroundColor: "#FFFFFF",
            },

            title: null,

            xAxis: {
                categories: customers,
                labels: {
                    rotation: 90,
                    style: { fontSize: "10px", color: "#6B7280" },
                    formatter: function () {
                        return typeof this.value === "string"
                            ? this.value.split(" ")[0]
                            : this.value;
                    },
                },
            },

            yAxis: {
                min: 0,
                title: {
                    text: "Qty (kgs)",
                    style: { fontSize: "12px", fontWeight: 600 },
                },
            },

            legend: {
                enabled: true,
                itemStyle: { fontSize: "11px" },
            },

            tooltip: {
                useHTML: true,
                formatter: function () {
                    return `
                    <b>${this.point.customer}</b><br/>
                    Quarter: <b>${this.point.quarter}</b><br/>
                    Year: <b>${this.point.finYear}</b><br/>
                    Qty (kgs): <b>${this.y?.toLocaleString("en-IN", {
                        minimumFractionDigits: 3,
                        maximumFractionDigits: 3,
                    })}</b>
                `;
                },
            },

            plotOptions: {
                column: {
                    grouping: true,
                    borderRadius: 4,
                    minPointLength: 3,

                    // ✅ MODIFIED: Adjust spacing based on conditions
                    pointPadding: pointPadding,
                    groupPadding: groupPadding,
                    pointWidth: pointWidth,

                    // Alternative approach: Directly set width for INHOUSE with no customer
                    ...(isInhouseNoCustomer && {
                        // Increase bar width by reducing group padding further
                        groupPadding: 0.1, // Even less spacing between groups
                        pointPadding: 0.1,  // Moderate spacing within group
                    }),
                },

                series: {
                    cursor: "pointer",
                    // Alternative: Set fixed width for bars when INHOUSE and no customer
                    ...(isInhouseNoCustomer && {
                        pointWidth: 20, // Fixed width in pixels
                    }),

                    dataLabels: [
                        {
                            enabled: category === "INHOUSE" && !custName,
                            inside: false,
                            y: -6,
                            formatter: function () {
                                return this.point.quarter;
                            },
                            style: {
                                fontSize: "9px",
                                fontWeight: "600",
                                color: "#111827",
                                textOutline: "none",
                            },
                        },
                        {
                            enabled: category === "INHOUSE" && !custName,
                            inside: true,
                            rotation: -90,
                            align: "center",
                            verticalAlign: "middle",
                            formatter: function () {
                                if (!this.y) return null;
                                return this.y.toLocaleString("en-IN", {
                                    minimumFractionDigits: 3,
                                    maximumFractionDigits: 3,
                                });
                            },
                            style: {
                                fontSize: "10px",
                                fontWeight: "600",
                                color: "#FFFFFF",
                                textOutline: "1px contrast",
                            },
                        },
                    ],
                    point: {
                        events: {
                            click: function () {
                                setCustName(this.customer);
                                setSelectedYear(this.finYear);
                                setSelectmonths("");
                                setSelectQuarter(this.quarter);
                                setShowTable(true);
                            },
                        },
                    },
                },
            },

            series,
            credits: { enabled: false },
        };
    };


    /* ---------------- LINE CHART OPTIONS FOR SINGLE CUSTOMER ---------------- */
    const getLineOptions = (qtr) => ({
        chart: { type: "line", height: 200, backgroundColor: "#f5f5f5" },
        title: { text: qtr, align: "left", style: { fontSize: "14px", fontWeight: 600 } },
        xAxis: { categories: years, title: { text: "Financial Year" } },
        yAxis: { min: 0, title: { text: "Qty (kgs)" } },
        tooltip: {
            shared: true,
            useHTML: true,
            formatter: function () {
                return `<b>${this.x}</b><br/>Quarter: <b>${qtr}</b><br/>Qty: <b>${this.y?.toLocaleString("en-IN", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</b>`;
            },
        },
        plotOptions: {
            series: {
                marker: { enabled: true, radius: 4 },
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return this.y ? this.y.toLocaleString("en-IN", { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : null;
                    },
                },
                point: {
                    events: {
                        click: function () {
                            setSelectQuarter(qtr);
                            setSelectedYear(this.category);
                            setShowTable(true);
                        },
                    },
                },
            },
        },
        series: [
            {
                name: qtr,
                type: "line",
                color: QUARTER_COLORS[qtr],
                data: years.map((year) => {
                    const val = dataMap[custName]?.[qtr]?.[year] ?? null;
                    return val === 0 ? null : val;
                }),
            },
        ],
        credits: { enabled: false },
        legend: { enabled: false },
    });

    return (
        <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
            <CardHeader
                title={`Quarter Wise Comparison ${custName ? `- ${custName}` : ""}`}
                titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
                action={
                    <Box sx={{ width: 220 }}>
                        <DropdownNew
                            dataList={cusData || []}
                            value={custName}
                            setValue={(value) => setCustName(value)}
                            clear
                            otherField="custName"
                            otherValue="custName"
                            placeholder="Customer"
                            autoFocus
                        />
                    </Box>
                }
                sx={{ p: 0.5, px: 1, borderBottom: `2px solid ${theme.palette.divider}`, "& .MuiCardHeader-action": { alignSelf: "center", margin: 0 } }}
            />

            <CardContent>
                
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {quarters.map((qtr) => (
                            <Box key={qtr} sx={{ flex: "1 1 45%" }}>
                                <HighchartsReact highcharts={Highcharts} options={getLineOptions(qtr)} />
                            </Box>
                        ))}
                    </Box>
               
            </CardContent>

            {showTable && (
                <CustomerTransQuarter
                    closeTable={() => setShowTable(false)}
                    finYear={finYear}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    category={category}
                    setCategory={setCategory}
                    custName={custName}
                    setCustName={setCustName}
                    selectmonths={selectmonths}
                    setSelectmonths={setSelectmonths}
                    selectQuarter={selectQuarter}
                    setSelectQuarter={setSelectQuarter}
                />
            )}
        </Card>
    );
};

export default FabricInwardQuarterCompare;

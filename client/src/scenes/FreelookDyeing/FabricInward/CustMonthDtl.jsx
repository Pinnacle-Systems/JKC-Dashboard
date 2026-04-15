import { Card, CardContent, CardHeader } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useState } from "react";
import { useGetFabricInwardMonthDetailQuery } from "../../../redux/service/freeLookFabric";
import CustomerTrans from "./CustomerTrans";

const CustMonthDtl = ({
    selectedYear,
    setSelectedYear,
    category,
    finYear,
    setCategory,
    selectmonths,
    setSelectmonths,
}) => {
    const [showTable, setShowTable] = useState(false);

    const { data: fabricData } = useGetFabricInwardMonthDetailQuery(
        {
            params: {
                finyear: selectedYear,
                category: category,
            },
        },
        {
            skip: !selectedYear || !category,
        }
    );

    const rows = fabricData?.data || [];

    // ======================
    // RAW DATA (DO NOT TOUCH)
    // ======================
    const Months = rows.map((r) => r.month.trim()); // e.g. "APRIL"
    const QtyData = rows.map((r) => Number(r.qty || 0));

    // ======================
    // HELPERS
    // ======================
    const normalizeMonth = (m) =>
        m.charAt(0).toUpperCase() + m.slice(1).toLowerCase();

    const getFinYearMonth = (monthRaw, finYear) => {
        const monthName = normalizeMonth(monthRaw);

        const [start, end] = finYear.split("-").map(Number);
        const startYear = 2000 + start;
        const endYear = 2000 + end;

        const monthsAfterApril = [
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        const year = monthsAfterApril.includes(monthName)
            ? startYear
            : endYear;

        return `${monthName} ${year}`; // ✅ EXACT FORMAT FinYear expects
    };

    // ======================
    // HIGHCHART OPTIONS
    // ======================
    const options = {
        chart: {
            type: "line",
            height: 290,
            backgroundColor: "#f5f5f5",
            marginBottom: 90,
        },

        title: null,
        legend: { enabled: false },

        xAxis: {
            categories: Months,
            title: {
                text: "Month",
                style: { fontSize: "10px" },
            },
            labels: {
                style: { fontSize: "10px" },
                formatter: function () {
                    return getFinYearMonth(this.value, selectedYear);
                },
            },
        },

        yAxis: {
            min: 0,
            title: {
                text: "Qty (kgs)",
                style: { fontSize: "12px", fontWeight: 600 },
            },
            labels: {
                style: { fontSize: "10px" },
            },
        },

        tooltip: {
            shared: true,
            useHTML: true,
            formatter: function () {
                const point = this.points[0].point;
                return `
          <b>${getFinYearMonth(this.x, selectedYear)}</b>
          <table style="margin-top:4px;">
            <tr>
              <td>Qty (kgs)</td>
              <td style="padding:0 6px;">:</td>
              <td><b>${point.y.toLocaleString("en-IN", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                })}</b></td>
            </tr>
          </table>
        `;
            },
        },

        plotOptions: {
            series: {
                marker: {
                    enabled: true,
                    radius: 4,
                    symbol: "circle",
                },

                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return this.y.toLocaleString("en-IN");
                    },
                    style: {
                        fontSize: "9px",
                        fontWeight: "normal",
                    },
                },

                point: {
                    events: {
                        click: function () {
                            const correctMonth = getFinYearMonth(
                                this.category,
                                selectedYear
                            );
                            setSelectmonths(correctMonth); // ✅ WORKS PERFECTLY
                            // setShowTable(true);
                        },
                    },
                },
            },
        },

        series: [
            {
                name: "Qty",
                data: QtyData,
                color: "#16A34A",
                marker: {
                    fillColor: "#16A34A",
                    lineWidth: 2,
                    lineColor: "#14532D",
                },
            },
        ],

        credits: { enabled: false },
    };

    // ======================
    // RENDER
    // ======================
    return (
        <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
            <CardHeader
                title="Month wise Contribution"
                titleTypographyProps={{
                    sx: { fontSize: "1rem", fontWeight: 600 },
                }}
                sx={{
                    p: 0.5,
                    px: 1,
                    borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                }}
            />

            <CardContent>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </CardContent>

            {showTable && (
                <CustomerTrans
                    closeTable={() => setShowTable(false)}
                    finYear={finYear}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    category={category}
                    setCategory={setCategory}
                    selectmonths={selectmonths}
                    setSelectmonths={setSelectmonths}
                />
            )}
        </Card>
    );
};

export default CustMonthDtl;

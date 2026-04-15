import { Box, Card, CardContent, CardHeader, useTheme } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useEffect, useState } from "react";
import CustomerTrans from "./CustomerTrans";
import {
    useGetFabricInwardCustQuery,
    useGetFabricInwardYearCompareQuery,
} from "../../../redux/service/freeLookFabric";
import { DropdownNew } from "../../../utils/hleper";

const FabricInwardYearCompare = ({
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

    const { data: fabricData } = useGetFabricInwardYearCompareQuery(
        { params: { category, customer: custName } },
        { skip: !category }
    );

    const { data: custNames } = useGetFabricInwardCustQuery({
        params: { category },
    });

    useEffect(() => {
        setCustName("");
    }, [category]);

    const rows = fabricData?.data || [];
    const cusData = custNames?.data.map((c) => ({ custName: c }));

    const customers = [
        ...new Set(
            rows
                .map((r) => r.customer)
                .filter((c) => typeof c === "string" && c.trim() !== "")
        ),
    ];
    const years = [...new Set(rows.map((r) => r.finYear))].sort();

    const dataMap = {};
    rows.forEach(({ customer, finYear, qty }) => {
        if (!dataMap[customer]) dataMap[customer] = {};
        dataMap[customer][finYear] = Number(qty || 0);
    });

    const series = years.map((year, yearIndex) => ({
        name: year,
        data: custName
            ? years.map((y, idx) =>
                idx === yearIndex
                    ? {
                        y: dataMap[custName]?.[year] ?? null,
                        customer: custName,
                        finYear: year,
                    }
                    : null
            )
            : customers.map((cust) => ({
                y: dataMap[cust]?.[year] ?? null,
                customer: cust,
                finYear: year,
            })),
    }));



    const options = {
        chart: {
            type: "column",
            height: 320,
            backgroundColor: "#FFFFFF",
        },

        title: null,

        xAxis: {
            categories: custName ? years : customers,
            labels: {
                rotation: custName ? 0 : 90,
                style: {
                    fontSize: "10px",
                    color: custName ? "#4B5563" : "#6B7280",
                },
                formatter: function () {
                    return String(this.value).split(" ")[0];
                },
            },
        },

        yAxis: {
            min: 0,
            title: {
                text: "Qty (kgs)",
                style: {
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#6B7280",
                },
            },
            labels: {
                style: {
                    color: "#6B7280",
                },
            },
        },


        legend: {
            enabled: true,
            itemStyle: {
                fontSize: "12px",
                color: "#000000",
            },
        },

        tooltip: {
            shared: false,
            useHTML: true,
            formatter: function () {
                return `
        <b>${this.point.customer}</b><br/>
        Qty (kgs): <b>${this.y.toLocaleString("en-IN", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                })}</b><br/>
        Year : ${this.point.finYear}
      `;
            },
        },

        plotOptions: {
            column: {
                grouping: !custName,
                borderRadius: 4,
                minPointLength: 4,
                pointPadding: custName ? 0.01 : 0.05,
                groupPadding: custName ? 0.02 : 0.15,
                maxPointWidth: custName ? 52 : undefined,
            },
            series: {
                cursor: "pointer",

                dataLabels: [
                    {
                        enabled: category === "INHOUSE" && !custName,
                        inside: false,
                        y: -6,
                        formatter: function () {
                            return this.point.finYear;
                        },
                        style: {
                            fontSize: "9px",
                            fontWeight: "600",
                            color: "#111827",
                            textOutline: "none",
                        },
                    },
                    {
                        // new label showing Qty inside the bar vertically
                        enabled: category === "INHOUSE" && !custName,
                        inside: true,
                        rotation: -90, // ✅ vertical
                        verticalAlign: "middle",
                        align: "center",
                        formatter: function () {
                            if (!this.y) return null;
                            return this.y.toLocaleString("en-IN", {
                                minimumFractionDigits: 3,
                                maximumFractionDigits: 3,
                            });
                        },
                        style: {
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "#FFFFFF", // white inside bar
                       
                        },
                    },
                    {
                        enabled: !!custName,
                        inside: custName ? false : true,
                        y: custName ? -8 : undefined,
                        rotation: custName ? 0 : -90,
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
                            fontSize: "11px",
                            fontWeight: "600",
                            color: custName ? "#000000" : "#FFFFFF",
                            textOutline: "none",
                        },
                    },
                ],

                point: {
                    events: {
                        click: function () {
                            setCustName(this.customer);
                            setSelectedYear(this.finYear);
                            setSelectmonths("");
                            setShowTable(true);
                        },
                    },
                },
            },
        },

        series,

        credits: {
            enabled: false,
        },
    };


    return (
        <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
            <CardHeader
                title={`Year Wise Comparison ${custName ? `- ${custName}` : ""}`}
                titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
                sx={{
                    p: 0.5,
                    px: 1,
                    borderBottom: `2px solid ${theme.palette.divider}`,
                    "& .MuiCardHeader-action": {
                        alignSelf: "center",
                        margin: 0,
                    },
                }}
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
                        />
                    </Box>
                }
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
                    custName={custName}
                    setCustName={setCustName}
                    selectmonths={selectmonths}
                    setSelectmonths={setSelectmonths}
                />
            )}
        </Card>
    );
};

export default FabricInwardYearCompare;

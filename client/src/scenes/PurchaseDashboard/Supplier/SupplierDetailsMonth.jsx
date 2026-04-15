import { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useGetSupplierPOSMonthDataQuery } from "../../../redux/service/purchaseOrder";
import SupplierTrans from "./SupplierTrans";


const SupplierDetailsMonth = ({
    selectedYear,
    setSelectedYear,
    finYear,
    selectmonths,
    setSelectmonths,
}) => {
    const [showTable, setShowTable] = useState(false);
    const [supplierName, setSupplierName] = useState("");

    const { data: supplierData } = useGetSupplierPOSMonthDataQuery(
        {
            params: { finyear: selectedYear, month: selectmonths },
        },
        { skip: !selectedYear }
    );

    const rows = supplierData?.data || [];

    const suppliers = rows.map((r) => r.supplier.split(" ")[0]);

    const options = {
        chart: {
            type: "column",
            height: 300,
            backgroundColor: "#ffffff",
            spacingBottom: 0, // reduce bottom spacing
            // spacingTop: 10,
        },

        title: {
            text: null,
        },

        xAxis: {
            categories: suppliers,
            labels: {
                rotation: -45,
                align: "right",
                style: {
                    fontSize: "11px",
                    fontFamily: "Arial, sans-serif",
                },
            },
        },

        yAxis: {
            min: 0,
            title: {
                text: "Amount (₹)",
            },
            gridLineWidth: 1,
        },

        legend: {
            enabled: false,
        },

        tooltip: {
            useHTML: true,
            style: {
                color: "#374151",
                fontSize: "10px",
            },
            headerFormat: "<b>{point.key}</b><br/>",
            pointFormatter: function () {
                return `
      <span style="color:${this.color}">\u25CF</span>
      Amount (₹): <b>${this.y.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}</b><br/>
      <span style="color:${this.color}">\u25CF</span>
      Qty: <b>${this.qty.toLocaleString("en-IN", {
                    minimumFractionDigits: this.unit === "KGS" ? 3 : 0,
                    maximumFractionDigits: this.unit === "KGS" ? 3 : 0,
                })} (${this.unit})</b>
    `;
            },
        },

        plotOptions: {
            column: {
                minPointLength: 80,
                colorByPoint: true,
                colors: [
                    "#00897b", // teal
                    "#00796b",
                    "#009688",
                    "#26a69a",
                    "#4db6ac",
                    "#80cbc4",
                    "#aed581",
                    "#9ccc65",
                    "#8bc34a",
                    "#7cb342"
                ],
                dataLabels: {
                    enabled: true,
                    inside: true,          // 👈 KEY
                    rotation: -90,
                    color: "#ffffff",      // white looks best inside bar
                    align: "center",
                    verticalAlign: "middle",
                    formatter: function () {
                        return "₹ " + this.y.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        });
                    },
                    y: 0,
                    style: {
                        fontSize: "11px",
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                        textOutline: "none",
                    },
                },
            },
            series: {
                cursor: "pointer",
                point: {
                    events: {
                        click: function () {
                            setSupplierName(this.name);
                            setShowTable(true);
                        },
                    },
                },
            },
        },

        series: [
            {
                name: "Qty",
                data: rows.map((r) => ({
                    y: Number(r.amountValue || 0), // ✅ AMOUNT
                    qty: Number(r.qty || 0),       // keep qty for tooltip
                    name: r.supplier,
                    unit: r.unit,
                })),
            },
        ],

        credits: {
            enabled: false,
        },
    };

    return (
        <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
            <CardHeader
                title={`Top 10 Suppliers in ${selectmonths.split(" ")[0]} Month`}
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
                <SupplierTrans
                    closeTable={() => setShowTable(false)}
                    finYear={finYear}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    supplierName={supplierName}
                    setSupplierName={setSupplierName}
                    selectmonths={selectmonths}
                    setSelectmonths={setSelectmonths}
                />
            )}
        </Card>
    );
};

export default SupplierDetailsMonth;

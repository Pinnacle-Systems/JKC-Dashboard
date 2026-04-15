import { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useGetSupplierPOSRejectedQuery } from "../../../redux/service/purchaseOrder";
import SupplierTrans from "../Supplier/SupplierTrans";
import Highcharts3D from "highcharts/highcharts-3d";
import Cylinder from "highcharts/modules/cylinder";
Highcharts3D(Highcharts);
Cylinder(Highcharts);

const RejectedPO = ({
    selectedYear,
    setSelectedYear,
    finYear,
    selectmonths,
    setSelectmonths,
}) => {
    const [showTable, setShowTable] = useState(false);
    const [supplierName, setSupplierName] = useState("");

    const { data: supplierData } = useGetSupplierPOSRejectedQuery(
        {
            params: { finyear: selectedYear },
        },
        { skip: !selectedYear }
    );

    const rows = supplierData?.data || [];

    const suppliers = rows.map((r) => r.supplier.split(" ")[0]);

    const options = {
        chart: {
            type: "cylinder",
            height: 300,
            backgroundColor: "#ffffff",
            spacingBottom: 0,
            marginLeft: 40,     // ✅ remove left margin
            spacingLeft: 0,    // ✅ remove internal padding
            marginRight: 0,
            spacingRight: 0,
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 10,
                depth: 60,
                viewDistance: 25,
            },
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
            min: 1,
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
            series: {
                depth: 60,            // 🔥 cylinder thickness
                colorByPoint: true,   // 🔥 different colors
                dataLabels: {
                    enabled: true,
                    inside: false,
                    formatter: function () {
                        return "₹ " + this.y.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        });
                    },
                    style: {
                        fontSize: "11px",
                        fontWeight: "bold",
                        textOutline: "none",
                    },
                },
                point: {
                    events: {
                        click: function () {
                            setSupplierName(this.name);
                            setSelectmonths("");
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
                title={`PO Pending Approval (${selectedYear}) Year`}
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
                    isRejected={true}
                />
            )}
        </Card>
    );
};

export default RejectedPO;
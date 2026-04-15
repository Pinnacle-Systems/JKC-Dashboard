import { Card, CardContent, CardHeader, Box, Typography, useTheme } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { useState } from 'react'
import { useGetFabricInwardQuarterDetailQuery } from "../../../redux/service/freeLookFabric";
import CustomerTransQuarter from "./CustomerTransQuarter";

const CustQuarterDtl = ({ selectedYear, setSelectedYear, category, finYear, setCategory, selectmonths, setSelectmonths }) => {
    const [showTable, setShowTable] = useState(false);
    const [custName, setCustName] = useState('');
    const [selectQuarter, setSelectQuarter] = useState("")
    const theme = useTheme();
    const { data: fabricData } = useGetFabricInwardQuarterDetailQuery(
        {
            params: {
                finyear: selectedYear,
                category: category
            },
        },
    );

    const rows = fabricData?.data || [];

    const totalQty = rows.reduce((s, r) => s + Number(r.qty), 0);
    const quarterColors = {
        Q1: "#2563EB", // Softer Deep Blue
        Q2: "#15803D", // Softer Dark Green
        Q3: "#B45309", // Softer Dark Orange
        Q4: "#991B1B", // Softer Dark Red
    };
    const quarterMonths = {
        Q1: ["Apr", "May", "Jun"],
        Q2: ["Jul", "Aug", "Sep"],
        Q3: ["Oct", "Nov", "Dec"],
        Q4: ["Jan", "Feb", "Mar"],
    };
    const options = {
        chart: {
            type: "pie",
            height: 260,
            spacing: [0, 0, 0, 0],
            margin: [0, 0, 0, 0],
        },
        title: null,

        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 90,
                center: ["50%", "75%"],
                size: "120%",
                dataLabels: {
                    enabled: true,
                    distance: -40,
                    useHTML: true,   // ⭐ IMPORTANT
                    formatter: function () {
                        const months = quarterMonths[this.point.name] || [];

                        return `
      <div style="text-align:center; line-height:1.2">
        <div style="font-size:11px; font-weight:600;">
          ${this.point.name}
        </div>
        <div style="font-size:11px; font-weight:600;">
          ${months.join(", ")}
        </div>
      </div>
    `;
                    },
                },
                point: {
                    events: {
                        click: function () {
                            setShowTable(true);
                            setSelectQuarter(this.name);
                            setSelectmonths("");
                        },
                    },
                },
            },
        },


        tooltip: {
            useHTML: true,
            formatter: function () {
                return `
      <b>${this.point.name}</b>
      <table style="margin-top:4px;">
        <tr>
          <td>Qty (kgs)</td>
          <td style="padding:0 6px;">:</td>
          <td><b>${this.point.qty.toLocaleString("en-IN", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                })}</b></td>
        </tr>
        
      </table>
    `;
            },
        },

        series: [
            {
                data: rows.map(r => ({
                    name: r.quarter,
                    y: r.qty,
                    qty: r.qty,
                    count: r.count,
                    color: quarterColors[r.quarter],
                })),
            },

        ],

        credits: { enabled: false },
    };

    return (
        <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
            <CardHeader
                title="Quarter wise Contribution"
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
                <Box
                    sx={{
                        p: 1,
                        bgcolor: "background.default",
                        borderRadius: 3,
                        textAlign: "center",
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Over All Inward Quantity : {totalQty.toLocaleString("en-IN", {
                            minimumFractionDigits: 3,
                            maximumFractionDigits: 3,
                        })}
                    </Typography>
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


export default CustQuarterDtl
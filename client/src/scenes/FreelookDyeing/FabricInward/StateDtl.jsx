import { Box, Card, CardContent, CardHeader, Typography, useTheme } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { useState } from 'react'
import { useGetFabricInwardStateDetailQuery } from "../../../redux/service/freeLookFabric";
import CustomerTransState from "./CustomerTransState";

const StateDetails = ({ selectedYear, setSelectedYear, category, finYear, setCategory, selectmonths, setSelectmonths }) => {
    const [showTable, setShowTable] = useState(false);
    const [custName, setCustName] = useState('');
    const [selectState, setSelectState] = useState("")
    const theme = useTheme();
    const { data: fabricData } = useGetFabricInwardStateDetailQuery(
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

    const states = rows.map((r) => r.state);

    const totalQty = rows.reduce((sum, r) => sum + Number(r.qty || 0), 0);

    const options = {
        chart: {
            type: "column",
            height: 260,

            // ONLY left & bottom spacing
            marginLeft: 30,
            marginBottom: 100,
            marginTop: 5,
            marginRight: 0,
            spacingLeft: 10,
            spacingBottom: 10,

            options3d: {
                enabled: true,
                alpha: 7,
                beta: 7,
                depth: 50,
                viewDistance: 25,
            },
            backgroundColor: "#FFFFFF",
            borderRadius: 10,
        },

        title: null,
        legend: { enabled: false },

        xAxis: {
            categories: states,
            labels: {
                style: { fontSize: "10px", color: "#6B7280" },
                rotation: 90,
            },
        },

        yAxis: {
            title: {
                text: "Qty",
                style: { fontSize: "12px", fontWeight: 600 },
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
          <td><b>${this.point.qty.toLocaleString("en-IN")}</b></td>
        </tr>
        
      </table>
    `;
            },
        },

        plotOptions: {
            column: {
                depth: 25,
                colorByPoint: true,
                borderRadius: 5,
                pointWidth: 30,
            },
            series: {
                dataLabels: {
                    enabled: false,
                    formatter: function () {
                        return this.y.toLocaleString("en-IN");
                    },
                    style: {
                        fontSize: "10px",
                        fontWeight: "normal",
                    },
                },
                point: {
                    events: {
                        click: function () {
                            setSelectState(this.name);
                            setSelectmonths("")
                            setShowTable(true);
                        },
                    },
                },
            },
        },

        series: [
            {
                name: "State",
                data: rows.map((item) => ({
                    name: item.state,
                    y: Number(item.qty || 0), // Count
                    qty: Number(item.qty || 0), // Qty for tooltip
                })),
            },
        ],

        credits: { enabled: false },
    };

    return (
        <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
            <CardHeader
                title="State wise Contribution"
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
                        bgcolor: "background.default",
                        borderRadius: 3,
                        textAlign: "center",
                        border: `1px solid ${theme.palette.divider}`,
                        p: 1,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Over All Inward Qty : {totalQty.toLocaleString("en-IN", {
                            minimumFractionDigits: 3,
                            maximumFractionDigits: 3,
                        })}
                    </Typography>
                </Box>
            </CardContent>
            {showTable && (
                <CustomerTransState
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
                    selectState={selectState}
                    setSelectState={setSelectState}
                />
            )}
        </Card>
    );
};


export default StateDetails
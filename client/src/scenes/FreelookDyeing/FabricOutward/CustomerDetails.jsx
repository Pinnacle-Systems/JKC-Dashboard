import { Card, CardContent, CardHeader } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { useState } from 'react'
import CustomerTrans from "./CustomerTrans";
import { useGetFabricOutwardCusDetailQuery } from "../../../redux/service/fabricOutward";

const  CustomerDetails = ({ selectedYear, setSelectedYear, category, finYear, setCategory, selectmonths, setSelectmonths }) => {
    const [showTable, setShowTable] = useState(false);
    const [custName, setCustName] = useState('')
    const { data: fabricData } = useGetFabricOutwardCusDetailQuery(
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

    const customers = rows.map((r) => r.customer.split(" ")[0]);

    const options = {
        chart: {
            type: "column",
            height: 300,

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
            categories: customers,
            labels: {
                style: { fontSize: "10px", color: "#6B7280" },
                rotation: 90,
            },
        },

        yAxis: {
            title: {
                text: "Qty (kgs)",
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
          <td><b>${this.point.qty.toLocaleString("en-IN", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                })}</b></td>
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
                pointWidth: category === "INHOUSE" ? 30 : undefined,
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
                            setCustName(this.name);
                            setSelectmonths("")
                            setShowTable(true);
                        },
                    },
                },
            },
        },

        series: [
            {
                name: "Customer",
                data: rows.map((item) => ({
                    name: item.customer,
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
                title="Company wise Contribution"
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
                    custName={custName}
                    setCustName={setCustName}
                    selectmonths={selectmonths}
                    setSelectmonths={setSelectmonths}
                />
            )}
        </Card>
    );
};


export default CustomerDetails
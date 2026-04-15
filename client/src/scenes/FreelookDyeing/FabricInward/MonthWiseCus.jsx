import { Box, Card, CardContent, CardHeader, Typography, useTheme } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { useState } from 'react'
import CustomerTrans from "./CustomerTrans";
import { useGetFabricInwardCusByMonthDetailQuery } from "../../../redux/service/freeLookFabric";

const MonthWiseCus = ({
    selectedYear,
    setSelectedYear,
    category,
    finYear,
    setCategory,
    selectmonths,
    setSelectmonths,
}) => {
    const [showTable, setShowTable] = useState(false);
    const [custName, setCustName] = useState("");
    const theme = useTheme()
    const { data: fabricData } = useGetFabricInwardCusByMonthDetailQuery(
        {
            params: {
                finyear: selectedYear,
                category: category,
                month: selectmonths
            },
        },
        {
            skip: !selectedYear || !category || !selectmonths,
        }
    );

    const rows = fabricData?.data || [];

    const totalQty = rows.reduce((sum, r) => sum + Number(r.qty || 0), 0);

    const colors = rows.map(
        () => "#" + Math.floor(Math.random() * 16777215).toString(16)
    );

    const formattedData = rows.map((item, i) => ({
        name: item.customer,
        y: Number(item.qty || 0),     // Pie uses qty
        count: item.count,
        qty: item.qty,
        color: colors[i],
    }));

    const options = {
        chart: {
            height: 250,
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            spacing: [0, 0, 0, 0],
        },

        title: {
            text: `Inward Details`,
            align: "center",
            verticalAlign: "middle",
            y: 70,
            style: { fontSize: ".9em" },
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
            <td><b> ${Number(this.point.qty).toLocaleString("en-IN", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                })}</b></td>
          </tr>
        </table>
      `;
            },
        },

        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: "bold",
                        color: "#ffffff",
                        // textOutline: "none",
                        // fontSize: "11px",
                    },
                    formatter: function () {
                        return `
      ${this.point.name.split(" ")[0]} (
      ${this.percentage.toFixed(1)}% )
    `;
                    },
                },
                startAngle: -90,
                endAngle: 90,
                center: ["50%", "90%"],
                size: "180%",
                innerSize: "60%",
                point: {
                    events: {
                        click: function () {
                            setCustName(this.name);
                            setShowTable(true);
                        },
                    },
                },
            },
        },

        series: [
            {
                type: "pie",
                name: "Customer Share",
                data: formattedData,
            },
        ],

        credits: { enabled: false },
    };


    return (
        <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
            <CardHeader
                // title={`${selectmonths} Contribution`}
                title={`Inward Breakup - ${selectmonths.split(" ")[0]}`}
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
                    autoBorder={true}
                />
            )}
        </Card>
    );
};



export default MonthWiseCus
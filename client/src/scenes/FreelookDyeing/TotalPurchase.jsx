import { Box, Card, CardContent, CardHeader, Typography, useTheme } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { useGetLatestPurchaseQuery } from "../../redux/service/purchaseOrder";
import { useDispatch } from "react-redux";
import { push } from "../../redux/features/opentabs";

const TotalPurchase = () => {
    const theme = useTheme();
    const { data: purchaseData } = useGetLatestPurchaseQuery({});
    const dispatch = useDispatch();

    const rows = purchaseData?.data || [];

    const sortedRows = [...rows].sort((a, b) => {
        const startA = parseInt(a.finYear.split("-")[0], 10);
        const startB = parseInt(b.finYear.split("-")[0], 10);
        return startA - startB; // ASC → 23-24, 24-25, 25-26
    });

    const finYear = sortedRows.map((r) => r.finYear);

    const options = {
        chart: {
            type: "column",
            height: 246,
            marginTop: 0,        // ✅ remove top space
            marginBottom: 40,    // ✅ minimal space for x-axis labels
            spacingTop: 0,       // ✅ remove internal spacing
            spacingBottom: 0,
            options3d: {
                enabled: true,
                alpha: 7,
                beta: 7,
                depth: 50,
                viewDistance: 30,
            },
            backgroundColor: "#FFFFFF",
        },

        title: null,
        legend: { enabled: false },

        xAxis: {
            categories: finYear,
            labels: {
                rotation: 0, // ✅ horizontal
                style: {
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#000000",
                },
            },
        },

        yAxis: {
            visible: false, // ✅ no left labels
        },

        tooltip: {
            useHTML: true,
            formatter: function () {
                return `
        <b>${this.point.name}</b><br/>
        Amount : <b>₹ ${this.y.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}</b><br/>
        Qty : <b>${this.point.qty.toLocaleString("en-IN", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                })}</b>
      `;
            },
        },

        plotOptions: {
            column: {
                depth: 25,
                colorByPoint: true,
                borderRadius: 5,

                dataLabels: {
                    enabled: true,
                    inside: true,
                    rotation: -90,
                    color: "#ffffff",
                    align: "center",
                    verticalAlign: "middle",
                    formatter: function () {
                        return "₹ " + this.y.toLocaleString("en-IN");
                    },
                    style: {
                        fontSize: "12px",
                        fontWeight: "bold",
                        textOutline: "none",
                        fontFamily: "Arial, sans-serif",
                    },
                },
                point: {
                    events: {
                        click: function () {

                            dispatch(
                                push({
                                    id: "Purchase Dashboard",
                                    name: "Purchase Dashboard",
                                    component: "PurchaseDashboard",
                                    data: {
                                        year: this.category,
                                    },
                                })
                            );
                        },
                    },
                },
            },
        },

        series: [
            {
                name: "Purchase Amount",
                data: sortedRows.map((item) => ({
                    name: item.finYear,
                    y: Number(item.totalAmount || 0),
                    qty: Number(item.qty || 0),
                })),
            },
        ],

        credits: { enabled: false },
    };


    return (
        <Card sx={{
            borderRadius: 3,
            boxShadow: 4,
            width: "100%",
            ml: 1,
        }}>
            <CardHeader
                title="Purchase Order Details"
                titleTypographyProps={{
                    sx: { fontSize: "1rem", fontWeight: 600 },
                }}
                sx={{
                    borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                    pb: 1,
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
                        Total Purchase Amount : ₹ {rows
                            .reduce((sum, item) => sum + Number(item.totalAmount || 0), 0)
                            .toLocaleString("en-IN")}
                    </Typography>
                </Box>
            </CardContent>

        </Card>
    );
};


export default TotalPurchase
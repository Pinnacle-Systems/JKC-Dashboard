import { useMemo, useState } from 'react'
import { useGetFabricInwardDetailQuery } from '../../../redux/service/freeLookFabric';
import { Box, Card, CardContent, CardHeader, Typography, useTheme } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { useDispatch } from "react-redux";
import { push } from "../../../redux/features/opentabs";
import Highcharts3D from "highcharts/highcharts-3d";
Highcharts3D(Highcharts);
const InwardType = ({ year, finYear }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [fYear, setFYear] = useState(year)
    const { data: fabricData } = useGetFabricInwardDetailQuery({
        params: {
            finyear: fYear
        },
    }, {
        skip: !fYear
    });
    const rows = fabricData?.data || [];

    const options = {
        chart: {
            type: "pie",
            options3d: {
                enabled: true,
                alpha: 40,
            },
            backgroundColor: "#FFFFFF",
            height: 230,
            borderRadius: 10,
            marginTop: 0,
            marginBottom: 10,
            spacingTop: 0,
            spacingBottom: 5,
        },

        title: {
            text: "",
        },

        plotOptions: {
            pie: {
                innerSize: 100,        // ✅ DONUT
                depth: 60,
                center: ["50%", "50%"],
                size: "90%",
                allowPointSelect: true,
                cursor: "pointer",

                dataLabels: {
                    distance: -5,
                    formatter: function () {
                        return `${this.point.name}`;
                    },
                    style: {
                        fontSize: "11px",
                        fontWeight: "500",
                        color: "#000000",
                    },
                },

                point: {
                    events: {
                        click: function () {
                            dispatch(
                                push({
                                    id: "FabricInward",
                                    name: "FabricInward",
                                    component: "FabricInward",
                                    data: {
                                        finYear: finYear,
                                        year: fYear,
                                        selectCategory: this.name,
                                    },
                                })
                            );
                        },
                    },
                },
            },
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
        Qty (kgs): <b>${this.y.toLocaleString("en-IN")}</b><br/>
      `;
            },
        },

        legend: {
            align: "center",
            verticalAlign: "top",
            y: -5,  // Adjust to fine-tune position
            margin: 5,
            itemStyle: {
                fontSize: "10px",
                fontWeight: 500,
            },
            itemMarginTop: 0, // ✅ Remove item spacing
            itemMarginBottom: 0,
        },

        series: [
            {
                name: "Inward",
                data: rows.map((row) => ({
                    name: row.category,
                    y: Number(row.qty || 0),
                    // count: Number(row.count || 0),
                })),
            },
        ],

        credits: {
            enabled: false,
        },
    };

    return (
        <Card
            sx={{
                borderRadius: 3,
                boxShadow: 4,
                width: "100%",
                ml: 1,
            }}
        >
            <CardHeader
                title="Fabric Inward Details"
                titleTypographyProps={{
                    sx: { fontSize: "1rem", fontWeight: 600 },
                }}
                sx={{
                    borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                    pb: 1,
                }}
            />
            <CardContent sx={{ pt: 1, pb: 1 }}>
                <div className="flex justify-end  mr-3">
                    <div className="flex flex-col justify-end w-24">
                        {/* <label className="text-xs font-medium">FinYear</label> */}
                        <select
                            value={fYear}
                            onChange={(e) => setFYear(e.target.value)}
                            className="border rounded-md text-xs p-1"
                        >{finYear?.data?.map((option) => {
                            return <option key={option.finYear} value={option.finYear}>{option.finYear}</option>
                        })
                            }
                        </select>
                    </div>
                </div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
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
                        Over All Inward Quantity : {rows
                            .reduce((sum, item) => sum + Number(item.qty || 0), 0)
                            .toLocaleString("en-IN")}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

export default InwardType
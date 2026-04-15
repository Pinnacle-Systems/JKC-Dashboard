import { useMemo, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    useTheme,
} from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useGetFabricOutwardDetailQuery } from "../../../redux/service/fabricOutward";
import { useDispatch } from "react-redux";
import { push } from "../../../redux/features/opentabs";

const OutwardType = ({ year, finYear }) => {
    const theme = useTheme();
    const [fYear, setFYear] = useState(year);
    const dispatch = useDispatch();

    const { data: fabricData } = useGetFabricOutwardDetailQuery(
        {
            params: {
                finyear: fYear,
            },
        },
        { skip: !fYear }
    );

    const rows = fabricData?.data || [];

    const pieData = useMemo(
        () =>
            rows.map((row) => ({
                name: row.category,
                y: Number(row.qty || 0),
            })),
        [rows]
    );

    const totalQty = useMemo(
        () => rows.reduce((sum, row) => sum + Number(row.qty || 0), 0),
        [rows]
    );

    const options = {
        chart: {
            type: "pie",
            backgroundColor: "#FFFFFF",
            height: 220,
        },
        colors: ["#0D9488", "#475569"],
        title: {
            text: null
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
        Qty (kgs): <b>${this.y.toLocaleString("en-IN", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                })}</b><br/>
      `;
            },
        },

        plotOptions: {
            pie: {
                innerSize: "50%",     // ✅ Donut
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    distance: 10,
                    formatter: function () {
                        return `<b>${this.point.name}</b>`;
                    },
                    style: {
                        fontSize: "11px",
                        fontWeight: "500",
                    },
                },
                point: {
                    events: {
                        click: function () {
                            dispatch(
                                push({
                                    id: "FabricOutward",
                                    name: "FabricOutward",
                                    component: "OutwardOverview",
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

        legend: {
            align: "center",
            verticalAlign: "bottom",
            itemStyle: {
                fontSize: "10px",
                fontWeight: 500,
            },
        },

        series: [
            {
                name: "Outward",
                colorByPoint: true,
                data: pieData,
            },
        ],

        credits: {
            enabled: false,
        },
    };

    return (
        <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
            <CardHeader
                title="Fabric Outward Details"
                titleTypographyProps={{
                    sx: { fontSize: "1rem", fontWeight: 600 },
                }}
                sx={{
                    borderBottom: `2px solid ${theme.palette.divider}`,
                    pb: 1,
                }}
            />

            <CardContent sx={{ pt: 1, pb: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                    <select
                        value={fYear}
                        onChange={(e) => setFYear(e.target.value)}
                        className="border rounded-md text-xs p-1"
                    >
                        {finYear?.data?.map((option) => (
                            <option key={option.finYear} value={option.finYear}>
                                {option.finYear}
                            </option>
                        ))}
                    </select>
                </Box>

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
                        Over All Outward Quantity : {rows
                            .reduce((sum, item) => sum + Number(item.qty || 0), 0)
                            .toLocaleString("en-IN", {
                                minimumFractionDigits: 3,
                                maximumFractionDigits: 3,
                            })}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};


export default OutwardType;

import { Box, Card, CardContent, CardHeader, Typography, useTheme } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { useState, useMemo, useEffect } from 'react'
import { useGetFabOutCustQuery, useGetFabricOutwardProcessQuery } from "../../../redux/service/fabricOutward";
import Highcharts3D from "highcharts/highcharts-3d";
import Cylinder from "highcharts/modules/cylinder";
import { DropdownNew } from "../../../utils/hleper";
import CustomerTransProcess from "./CustomerTransProcess";
Highcharts3D(Highcharts);
Cylinder(Highcharts);
const ProcessDetails = ({
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
    const [processName, setProcessName] = useState("");
    const theme = useTheme();
    const { data: fabricData } = useGetFabricOutwardProcessQuery(
        {
            params: {
                finyear: selectedYear,
                category,
                customer: custName,
            },
        },
        {
            skip: !selectedYear || !category,
        }
    );
    const { data: custNames } = useGetFabOutCustQuery({
        params: { category },
    });
    const rows = fabricData?.data || [];
    const cusData = custNames?.data.map((c) => ({ custName: c }));

    const processes = rows.map((r) => r.process);

    const series = [
        {
            name: "Qty (kgs)",
            data: rows.map((r) => Number(r.qty || 0)),
        },
    ];

    const options = {
        chart: {
            type: "cylinder",
            height: 260,
            marginLeft: 30,
            marginTop: 5,
            marginRight: 0,
            spacingLeft: 0,

            options3d: {
                enabled: true,
                alpha: 10,
                beta: 10,
                depth: 60,
                viewDistance: 25,
            },
        },

        title: null,

        xAxis: {
            categories: processes,
            labels: {
                rotation: 0,
                style: {
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#374151",
                },
            },
        },

        yAxis: {
            min: 0,
            title: {
                text: "Qty (kgs)",
                margin: 30,
                style: { fontWeight: 600 },
            },
        },

        tooltip: {
            useHTML: true,
            formatter() {
                return `
          <b>${this.x}</b><br/>
          Qty : <b>${this.y.toLocaleString("en-IN", {
                    maximumFractionDigits: 3,
                    minimumFractionDigits: 3,
                })}</b> kgs
        `;
            },
        },

        plotOptions: {
            series: {
                depth: 60,   // 🔥 cylinder thickness
                colorByPoint: true,
                dataLabels: {
                    enabled: true,
                    inside: false,
                    formatter() {
                        return this.y.toLocaleString("en-IN", {
                            maximumFractionDigits: 3,
                            minimumFractionDigits: 3,
                        });
                    },
                },
                point: {
                    events: {
                        click: function () {
                            setProcessName(this.category);
                            setSelectmonths("");
                            setShowTable(true);
                        },
                    },
                },
            },
        },

        legend: { enabled: false },

        series,

        credits: { enabled: false },
    };
    const totalQty = rows.reduce((sum, r) => sum + Number(r.qty || 0), 0);
    useEffect(() => {
        setCustName("");   // 🔥 reset customer when category changes
    }, [category]);

    return (
        <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
            <CardHeader
                title={`Process Wise Contribution ${custName ? `- ${custName.split(" ")[0]}` : ""
                    }`}
                titleTypographyProps={{
                    sx: { fontSize: "1rem", fontWeight: 600 },
                }}
                sx={{
                    p: 0.5,
                    px: 1,
                    borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
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
                        Over All Outward Qty : {totalQty.toLocaleString("en-IN", {
                            minimumFractionDigits: 3,
                            maximumFractionDigits: 3,
                        })}
                    </Typography>
                </Box>
            </CardContent>
            {showTable && (
                <CustomerTransProcess
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
                    processName={processName}
                    setProcessName={setProcessName}
                />
            )}
        </Card>
    );
};

export default ProcessDetails;

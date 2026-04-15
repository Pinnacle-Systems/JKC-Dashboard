import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  CardHeader,
  CardContent,
  useTheme,
  Box,
} from "@mui/material";
import { useGetMisDashboardErpSingleMonthWiseQuery } from "../../../redux/service/misDashboardServiceERP";

const COLORS = [
  "#2563eb",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const Form = ({ companyName, finYear, month }) => {
  const theme = useTheme();

  const { data, isLoading } =
    useGetMisDashboardErpSingleMonthWiseQuery({
      params: { companyName, finYear, month },
    });

  const chartData = Array.isArray(data?.data)
    ? data.data.map((item) => ({
      name: item.month,          // or customer / category
      y: item.value || 0,
    }))
    : [];

  const totalValue = chartData.reduce((sum, d) => sum + d.y, 0);

  const options = {
    chart: {
      type: "pie",
      height: 380,
    },

    title: {
      text: `₹ ${(totalValue / 10000000).toFixed(2)} Cr`,
      align: "center",
      verticalAlign: "middle",
      y: 10,
      style: {
        fontSize: "18px",
        fontWeight: 700,
      },
    },

    subtitle: {
      text: `${month} • ${companyName}`,
      align: "center",
      verticalAlign: "middle",
      y: 35,
      style: {
        fontSize: "11px",
        color: "#6b7280",
      },
    },

    tooltip: {
      formatter() {
        return `
          <b>${this.point.name}</b><br/>
          ₹ ${this.y.toLocaleString("en-IN")}<br/>
          <b>${this.percentage.toFixed(1)}%</b>
        `;
      },
    },

    plotOptions: {
      pie: {
        innerSize: "65%",      // ✅ DONUT
        borderRadius: 6,
        dataLabels: {
          enabled: true,
          formatter() {
            return `${this.percentage.toFixed(1)}%`;
          },
          style: {
            fontSize: "11px",
            fontWeight: 600,
          },
        },
      },
    },

    colors: COLORS,

    series: [
      {
        name: "Turnover",
        data: chartData,
      },
    ],

    legend: {
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
      itemStyle: {
        fontSize: "11px",
      },
    },

    credits: { enabled: false },
  };

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={`${month}  Distribution`}
        titleTypographyProps={{
          sx: { fontSize: ".9rem", fontWeight: 600 },
        }}
        sx={{
          p: 1,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
      />

      <CardContent>
        {isLoading ? (
          <Box sx={{ textAlign: "center", py: 5 }}>Loading...</Box>
        ) : (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            immutable
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Form;

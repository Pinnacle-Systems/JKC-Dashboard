import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, useTheme, Box } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { useGetOrderEntryBuyerStatusQuery } from "../../../redux/service/OrderEntry";

const STATUS_COLORS = {
  Running: { top: "#6366f1", bottom: "#a5b4fc" }, // indigo
  Completed: { top: "#10b981", bottom: "#6ee7b7" }, // emerald
  Pending: { top: "#f59e0b", bottom: "#fcd34d" }, // amber
  Cancelled: { top: "#ef4444", bottom: "#fca5a5" }, // red
  OnHold: { top: "#ec4899", bottom: "#f9a8d4" }, // pink
};

const DEFAULT_COLOR = { top: "#64748b", bottom: "#cbd5e1" };

const gradientColor = (top, bottom) => ({
  type: "linear",
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    { offset: 0, color: top },
    { offset: 1, color: bottom },
  ],
});

const OrderBuyerStatus = ({ companyName, finYear }) => {
  const theme = useTheme();

  /* ---------------- FETCH DATA ---------------- */
  const { data: response, isLoading } = useGetOrderEntryBuyerStatusQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );

  /* ---------------- PREPARE DATA ---------------- */
  const { buyers, statuses, seriesList } = useMemo(() => {
    if (!response?.data) return { buyers: [], statuses: [], seriesList: [] };

    // Unique buyers (X-axis) and statuses (one series each)
    const buyers = [...new Set(response.data.map((d) => d.buyerCode))].sort();
    const statuses = [...new Set(response.data.map((d) => d.status))];

    // Build a lookup: { "PEP||Running": 7, ... }
    const lookup = {};
    response.data.forEach((d) => {
      lookup[`${d.buyerCode}||${d.status}`] = d.count;
    });

    const seriesList = statuses.map((status) => {
      const clr = STATUS_COLORS[status] || DEFAULT_COLOR;
      return {
        name: status,
        type: "bar",
        barGap: "8%",
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: gradientColor(clr.top, clr.bottom),
        },
        label: {
          show: true,
          position: "top",
          fontSize: 10,
          fontWeight: 600,
          color: "#374151",
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0,0,0,0.2)",
          },
        },
        data: buyers.map((b) => lookup[`${b}||${status}`] ?? 0),
      };
    });

    return { buyers, statuses, seriesList };
  }, [response]);

  /* ---------------- CLICK ---------------- */
  const handleChartClick = (params) => {
    console.log("Clicked:", params.seriesName, params.name, params.value);
  };

  /* ---------------- OPTIONS ---------------- */
  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "#1e293b",
      borderColor: "#334155",
      textStyle: { color: "#f1f5f9", fontSize: 12 },
      formatter: (params) =>
        `<b style="color:#94a3b8">${params[0].axisValue}</b><br/>` +
        params
          .map(
            (p) =>
              `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color.colorStops?.[0].color ?? p.color};margin-right:6px"></span>` +
              `${p.seriesName}: <b>${p.value}</b>`,
          )
          .join("<br/>"),
    },
    toolbox: {
      right: 10,
      top: -5,
      feature: { saveAsImage: { show: true } },
    },
    legend: {
      bottom: 0,
      itemWidth: 12,
      itemHeight: 12,
      borderRadius: 4,
      textStyle: { fontSize: 11, color: "#374151" },
      data: statuses,
    },
    grid: {
      left: "3%",
      right: "3%",
      bottom: "12%",
      top: "8%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: buyers,
      axisTick: { alignWithLabel: true },
      axisLine: { lineStyle: { color: "#e2e8f0" } },
      axisLabel: {
        fontSize: 11,
        fontWeight: 600,
        color: "#374151",
      },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 10, color: "#94a3b8" },
    },
    series: seriesList,
  };

  /* ---------------- RENDER ---------------- */
  return (
    <Card
      sx={{
        mt: 1,
        ml: 1,
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        borderRadius: 3,
      }}
    >
      <CardHeader
        title="Order Entry — Buyer Status"
        titleTypographyProps={{
          sx: { fontSize: ".9rem", fontWeight: 700, color: "#1e293b" },
        }}
        sx={{
          p: 1,
          height: 40,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
      />

      <CardContent sx={{ pt: 1 }}>
        {isLoading ? (
          <Box sx={{ textAlign: "center", padding: 5, color: "#94a3b8" }}>
            Loading...
          </Box>
        ) : (
          <ReactECharts
            option={options}
            style={{ height: 380 }}
            onEvents={{ click: handleChartClick }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OrderBuyerStatus;

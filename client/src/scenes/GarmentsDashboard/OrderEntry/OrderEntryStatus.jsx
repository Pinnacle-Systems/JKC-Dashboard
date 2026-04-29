import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, useTheme, Box } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { useGetOrderEntryStatusQuery } from "../../../redux/service/OrderEntry";
import OrderEntryStatusTable from "./TableData/OrderEntryStatusTable";

const ORDER = [
  "INTERNAL ORDER",
  "FABRIC PROCESS PLAN",
  "ACCESSORIES PLAN",
  "CMT PLAN",
  "PRE - BUDGET",
];

const COLORS = ["#22c55e", "#ef4444", "#3b82f6"];

const OrderEntryStatus = ({ companyName, finYear, finYr }) => {
  const theme = useTheme();
  const [selectedBuyer, setSelectedBuyer] = useState("ALL");
  const [tableConfig, setTableConfig] = useState(null); // { typeName, finYear, compCode }

  /* ---------------- FETCH DATA ---------------- */
  const { data: response, isLoading } = useGetOrderEntryStatusQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );

  /* ---------------- BUYER CODES ---------------- */
  const buyerCodes = useMemo(() => {
    if (!response?.data) return [];
    const codes = [
      ...new Set(response.data.map((item) => item.buyerCode)),
    ].sort();
    return ["ALL", ...codes];
  }, [response]);

  /* ---------------- PREPARE CHART DATA ---------------- */
  const statusChartData = useMemo(() => {
    if (!response?.data) return [];
    const filtered =
      selectedBuyer === "ALL"
        ? response.data
        : response.data.filter((item) => item.buyerCode === selectedBuyer);

    const map = {};
    filtered.forEach((item) => {
      const type = item.typeName;
      if (!map[type]) map[type] = { type, pending: 0, completed: 0 };
      map[type].pending += Number(item.pending || 0);
      map[type].completed += Number(item.completed || 0);
    });

    return Object.values(map).sort(
      (a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type),
    );
  }, [response, selectedBuyer]);

  const categories = statusChartData.map((x) => x.type);
  const pendingData = statusChartData.map((x) => x.pending);
  const completedData = statusChartData.map((x) => x.completed);
  const completionRate = statusChartData.map((x) => {
    const total = x.pending + x.completed;
    return total > 0 ? Math.round((x.completed / total) * 100) : 0;
  });

  /* ---------------- CLICK EVENT ---------------- */
  const handleChartClick = (params) => {
  // 🚫 Block Pending clicks
  if (params.seriesName === "Pending") return;

  const typeName = params.name;

  setTableConfig({
    typeName,
    finYear,
    compCode: companyName, buyerCode: selectedBuyer, // 
  });
};

  /* ---------------- CHART OPTIONS ---------------- */
  const options = {
    color: COLORS,
    tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
    toolbox: {
      right: 10,
      top: -5,
      feature: { saveAsImage: { show: true } },
    },
    legend: { bottom: 0, data: ["Pending", "Completed", "Completion Rate"] },
    grid: {
      left: "3%",
      right: "6%",
      bottom: "10%",
      top: "5%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: categories,
        axisTick: { alignWithLabel: true },
        axisLabel: { rotate: 30, fontSize: 10 },
      },
    ],
    yAxis: [
      {
        type: "value",
        position: "left",
        alignTicks: true,
        axisLine: { show: true, lineStyle: { color: COLORS[0] } },
        axisLabel: { formatter: "{value}" },
      },
      {
        type: "value",
        position: "right",
        alignTicks: true,
        min: 0,
        max: 100,
        interval: 20,
        axisLine: { show: true, lineStyle: { color: COLORS[2] } },
        axisLabel: { formatter: "{value}%" },
      },
    ],
    series: [
      {
        name: "Pending",
        type: "bar",
        yAxisIndex: 0,
        data: pendingData,
        label: { show: true, position: "top", fontSize: 10 },
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#ef4444" },
              { offset: 1, color: "#fca5a5" },
            ],
          },
        },
        barGap: "10%",
      },
      {
        name: "Completed",
        type: "bar",
        yAxisIndex: 0,
        data: completedData,
        label: { show: true, position: "top", fontSize: 10 },
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#22c55e" },
              { offset: 1, color: "#bbf7d0" },
            ],
          },
        },
      },
      {
        name: "Completion Rate",
        type: "line",
        yAxisIndex: 1,
        data: completionRate,
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        label: { show: true, position: "top", fontSize: 10, formatter: "{c}%" },
        lineStyle: { width: 2, color: "#3b82f6" },
        itemStyle: { color: "#3b82f6" },
      },
    ],
  };

  /* ---------------- RENDER ---------------- */
  return (
    <>
      <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
        <CardHeader
          title="Order Entry Planning Status"
          titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
          action={
            <select
              value={selectedBuyer}
              onChange={(e) => setSelectedBuyer(e.target.value)}
              style={{
                fontSize: "11px",
                padding: "0px 14px",
                borderRadius: "6px",
                border: "2px solid #2563eb",
                marginTop: "2px",
                marginLeft: "-12px",
                minWidth: "120px",
              }}
            >
              {buyerCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          }
          sx={{
            p: 1,
            height: 40,
            borderBottom: `2px solid ${theme.palette.divider}`,
          }}
        />
        <CardContent>
          {isLoading ? (
            <Box sx={{ textAlign: "center", padding: 40 }}>Loading...</Box>
          ) : (
            <ReactECharts
              option={options}
              style={{ height: 440 }}
              onEvents={{ click: handleChartClick }}
            />
          )}
        </CardContent>
      </Card>

      {/* TABLE MODAL */}
      {tableConfig && (
        <OrderEntryStatusTable
          typeName={tableConfig.typeName}
          finYear={tableConfig.finYear}
          compCode={tableConfig.compCode} buyerCode={tableConfig.buyerCode} // ← new 
          closeTable={() => setTableConfig(null)}
          finYr={finYr}  buyerCodes={buyerCodes}  
        />
      )}
    </>
  );
};

export default OrderEntryStatus;

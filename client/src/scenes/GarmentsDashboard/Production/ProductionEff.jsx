import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, useTheme, Box } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { useGetProductionEffQuery } from "../../../redux/service/production";
import ProductionEffTable from "./TableData/ProductionEffTable";

const GRADIENTS = {
  CUTTING: ["#34d399", "#059669"],
  CHECKING: ["#60a5fa", "#2563eb"],
  SINGER: ["#fcd34d", "#d97706"],
  POWERTABLE: ["#f87171", "#dc2626"],
  SEWING: ["#c084fc", "#7c3aed"],
};

const ProductionEff = ({ companyName }) => {
  const theme = useTheme();

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const toPercentage = (value) => {
    const num = Number(value || 0);
    return num < 1 ? num * 100 : num;
  };

  const [date, setDate] = useState(formatDate(new Date()));
  const [selectedProcess, setSelectedProcess] = useState("ALL");
  const [tableParams, setTableParams] = useState(null);

  const processOptions = [
    { value: "ALL", label: "All" },
    { value: "CUTTING", label: "Cutting" },
    { value: "CHECKING", label: "Checking" },
    { value: "SINGER", label: "Singer" },
    { value: "POWER TABLE", label: "Power Table" },
    { value: "SEWING", label: "Sewing" },
  ];

  const { data: response, isLoading } = useGetProductionEffQuery(
    {
      params: { compCode: companyName, date, selectedProcess },
    },
    { skip: !companyName || !date },
  );

  const chartData = useMemo(() => response?.data || [], [response]);
  const categories = chartData.map((item) => item.UNIT);

  const makeGradient = (key) => {
    const [start, end] = GRADIENTS[key] || ["#60a5fa", "#2563eb"];
    return {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: start },
        { offset: 1, color: end },
      ],
    };
  };

  // Label: process name on first line, value on second line
  const makeLabelConfig = (processName) => ({
    show: true,
    position: "top",
    fontSize: 10,
    fontWeight: 700,
    color: "#374151",
    lineHeight: 16,
    formatter: (params) => {
      const value = Number(params.value || 0);
      if (value <= 0) return "";
      return `${processName}\n${value.toFixed(2)}%`;
    },
  });

  const series =
    selectedProcess === "ALL"
      ? [
          {
            name: "CUTTING",
            type: "bar",
            barGap: "10%",
            data: chartData.map((x) => toPercentage(x.CUTTING)),
            itemStyle: {
              color: makeGradient("CUTTING"),
              borderRadius: [8, 8, 0, 0],
            },
            label: makeLabelConfig("Cutting"),
          },
          {
            name: "CHECKING",
            type: "bar",
            data: chartData.map((x) => toPercentage(x.CHECKING)),
            itemStyle: {
              color: makeGradient("CHECKING"),
              borderRadius: [8, 8, 0, 0],
            },
            label: makeLabelConfig("Checking"),
          },
          {
            name: "SINGER",
            type: "bar",
            data: chartData.map((x) => toPercentage(x.SINGER)),
            itemStyle: {
              color: makeGradient("SINGER"),
              borderRadius: [8, 8, 0, 0],
            },
            label: makeLabelConfig("Singer"),
          },
          {
            name: "POWER TABLE",
            type: "bar",
            data: chartData.map((x) => toPercentage(x.POWERTABLE)),
            itemStyle: {
              color: makeGradient("POWERTABLE"),
              borderRadius: [8, 8, 0, 0],
            },
            label: makeLabelConfig("Power Table"),
          },
          {
            name: "SEWING",
            type: "bar",
            data: chartData.map((x) => toPercentage(x.SEWING)),
            itemStyle: {
              color: makeGradient("SEWING"),
              borderRadius: [8, 8, 0, 0],
            },
            label: makeLabelConfig("Sewing"),
          },
        ]
      : [
          {
            name: selectedProcess,
            type: "bar",
            data: chartData.map((x) => {
              switch (selectedProcess) {
                case "CUTTING":
                  return toPercentage(x.CUTTING);
                case "CHECKING":
                  return toPercentage(x.CHECKING);
                case "SINGER":
                  return toPercentage(x.SINGER);
                case "POWER TABLE":
                  return toPercentage(x.POWERTABLE);
                case "SEWING":
                  return toPercentage(x.SEWING);
                default:
                  return 0;
              }
            }),
            itemStyle: {
              color: makeGradient(selectedProcess.replace(" ", "")),
              borderRadius: [8, 8, 0, 0],
            },
            label: makeLabelConfig(
              processOptions.find((p) => p.value === selectedProcess)?.label ||
                selectedProcess,
            ),
          },
        ];

  // Replace onChartEvents
  const onChartEvents = {
    click: (params) => {
      if (params.componentType !== "series") return;
      setTableParams({
        unit: categories[params.dataIndex], // UNIT (store/location)
        processName:
          selectedProcess === "ALL" ? params.seriesName : selectedProcess,
        date,
      });
    },
  };

  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      textStyle: {
        color: "#374151",
        fontSize: 12,
        fontWeight: 600,
      },
      formatter: (params) => {
        let result = `${params[0].axisValue}<br/>`;

        params.forEach((item) => {
          result += `
        ${item.marker}
        ${item.seriesName}: <b>${Number(item.value).toFixed(2)}%</b><br/>
      `;
        });

        return result;
      },
    },
    legend: { show: false },
    toolbox: {
      right: 10,
      feature: { saveAsImage: { show: true } },
    },
    grid: {
      left: "2%",
      right: "3%",
      bottom: "12%",
      top: "12%", // extra top space for 2-line labels
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: categories,
      axisTick: { alignWithLabel: true, lineStyle: { color: "#e5e7eb" } },
      axisLine: { lineStyle: { color: "#e5e7eb" } },
      axisLabel: {
        interval: 0,
        rotate: 20,
        fontSize: 11,
        fontWeight: 600,
        color: "#374151",
      },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { color: "#f3f4f6", type: "dashed" } },
      axisLabel: {
        fontSize: 11,
        fontWeight: 600,
        color: "#9ca3af",
        formatter: "{value}%",
      },
    },
    series,
  };

  return (
    <>
      <Card
        sx={{
          mt: 1,
          ml: 1,
          borderRadius: 3,
          background: "#ffffff",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        }}
      >
        <CardHeader
          title="Production Efficiency"
          titleTypographyProps={{
            sx: { fontSize: ".95rem", fontWeight: 700, color: "#111827" },
          }}
          action={
            <Box sx={{ display: "flex", gap: 1 }}>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600"
              />
              <select
                value={selectedProcess}
                onChange={(e) => setSelectedProcess(e.target.value)}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-40"
              >
                {processOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Box>
          }
          sx={{
            p: 1,
            borderBottom: `2px solid ${theme.palette.divider}`,
          }}
        />

        <CardContent>
          {isLoading ? (
            <Box sx={{ textAlign: "center", py: 10 }}>Loading...</Box>
          ) : (
            <ReactECharts
              key={`${selectedProcess}-${date}`}
              option={options}
              onEvents={onChartEvents}
              style={{ height: 450 }}
            />
          )}
        </CardContent>
      </Card>
      {tableParams && (
        <ProductionEffTable
          companyName={companyName}
          unit={tableParams.unit}
          processName={tableParams.processName}
          date={tableParams.date}
          onClose={() => setTableParams(null)}
          processOptions={processOptions}
        />
      )}
    </>
  );
};

export default ProductionEff;

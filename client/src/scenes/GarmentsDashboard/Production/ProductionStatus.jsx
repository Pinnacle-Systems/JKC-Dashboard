import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, useTheme, Box } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { useGetProductionQuery } from "../../../redux/service/production";
import ProductionDetailTable from "./TableData/ProductionDetailTable";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#14b8a6",
];

const ProductionStatus = ({ companyName }) => {
  const theme = useTheme();

  /* ---------------- DATE FORMAT ---------------- */

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  /* ---------------- DEFAULT DATES ---------------- */

  const today = new Date();
  const previousWeek = new Date();
  previousWeek.setDate(today.getDate() - 6);

  const [fromDate, setFromDate] = useState(formatDate(previousWeek));
  const [toDate, setToDate] = useState(formatDate(today));

  /* ---------------- STORE FILTER ---------------- */

  const [selectedStore, setSelectedStore] = useState("ALL");

  /* ---------------- DETAIL TABLE STATE ---------------- */

  const [tableParams, setTableParams] = useState(null); // null = closed

  /* ---------------- FETCH DATA ---------------- */

  const { data: response, isLoading } = useGetProductionQuery(
    {
      params: {
        compCode: companyName,
        fromDate,
        toDate,
      },
    },
    {
      skip: !companyName || !fromDate || !toDate,
    },
  );

  /* ---------------- DATE HANDLERS ---------------- */

  const handleFromDateChange = (value) => {
    setFromDate(value);
    if (new Date(value) > new Date(toDate)) {
      setToDate(value);
    }
  };

  const handleToDateChange = (value) => {
    if (new Date(value) < new Date(fromDate)) return;
    setToDate(value);
  };

  /* ---------------- STORE OPTIONS ---------------- */

  const storeOptions = useMemo(() => {
    if (!response?.data) return ["ALL"];
    const stores = [
      ...new Set(
        response.data
          .map((item) => item.STOREID)
          .filter((x) => x && x.trim() !== ""),
      ),
    ];
    return ["ALL", ...stores];
  }, [response]);

  /* ---------------- FILTER DATA ---------------- */

  const filteredData = useMemo(() => {
    if (!response?.data) return [];
    if (selectedStore === "ALL") return response.data;
    return response.data.filter((item) => item.STOREID === selectedStore);
  }, [response, selectedStore]);

  /* ---------------- GROUP PROCESS DATA ---------------- */

  const processData = useMemo(() => {
    if (!filteredData?.length) return [];
    const grouped = {};
    filteredData.forEach((item) => {
      const process = item.PROCESSNAME || "OTHERS";
      if (!grouped[process]) grouped[process] = 0;
      grouped[process] += Number(item.QTY || 0);
    });
    return Object.keys(grouped).map((key) => ({
      processName: key,
      qty: grouped[key],
    }));
  }, [filteredData]);

  /* ---------------- CHART DATA ---------------- */

  const categories = processData.map((x) => x.processName);

  const qtyData = processData.map((x, index) => ({
    value: x.qty,
    itemStyle: {
      color: COLORS[index % COLORS.length],
      borderRadius: [8, 8, 0, 0],
    },
  }));

  /* ---------------- BAR CLICK HANDLER ---------------- */

  // Opens the detail table for the clicked process bar
  const onChartEvents = {
    click: (params) => {
      if (params.componentType !== "series") return;

      const clickedProcess = categories[params.dataIndex];

      setTableParams({
        processName: clickedProcess,
        storeId: selectedStore,
        fromDate,
        toDate,
      });
    },
  };

  /* ---------------- CHART OPTIONS ---------------- */

  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },

    toolbox: {
      right: 10,
      top: 0,
      feature: { saveAsImage: { show: true } },
    },

    grid: {
      left: "3%",
      right: "3%",
      bottom: "12%",
      top: "10%",
      containLabel: true,
    },

    xAxis: {
      type: "category",
      data: categories,
      axisTick: { alignWithLabel: true },
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
      axisLabel: { formatter: "{value}" },
    },

    series: [
      {
        name: "Production Qty",
        type: "bar",
        barWidth: "45%",
        data: qtyData,
        cursor: "pointer", // pointer cursor on hover to signal clickability

        label: {
          show: true,
          position: "top",
          fontSize: 11,
          fontWeight: 700,
          color: "#111827",
          formatter: (params) => Number(params.value).toLocaleString("en-IN"),
        },

        emphasis: {
          focus: "series",
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0,0,0,0.25)",
          },
        },
      },
    ],
  };

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <Card
        sx={{
          mt: 1,
          ml: 1,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        }}
      >
        <CardHeader
          title="Production Process Status"
          titleTypographyProps={{
            sx: { fontSize: ".95rem", fontWeight: 700 },
          }}
          action={
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {/* FROM DATE */}
              <input
                type="date"
                value={fromDate}
                max={toDate}
                onChange={(e) => handleFromDateChange(e.target.value)}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600"
              />

              {/* TO DATE */}
              <input
                type="date"
                value={toDate}
                min={fromDate}
                onChange={(e) => handleToDateChange(e.target.value)}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600"
              />

              {/* STORE DROPDOWN */}
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-92"
              >
                {storeOptions.map((store) => (
                  <option key={store} value={store}>
                    {store}
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
              option={options}
              onEvents={onChartEvents}
              style={{ height: 450, cursor: "pointer" }}
            />
          )}
        </CardContent>
      </Card>

      {/* DETAIL TABLE MODAL — rendered when a bar is clicked */}
      {tableParams && (
        <ProductionDetailTable
          companyName={companyName}
          fromDate={tableParams.fromDate}
          toDate={tableParams.toDate}
          processName={tableParams.processName}
          storeId={tableParams.storeId}
          onClose={() => setTableParams(null)}
        />
      )}
    </>
  );
};

export default ProductionStatus;

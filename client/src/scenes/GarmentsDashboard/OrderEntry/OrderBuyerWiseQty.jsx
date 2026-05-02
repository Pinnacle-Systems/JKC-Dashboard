import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, useTheme, Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ReactECharts from "echarts-for-react";
import { useGetOrderEntryBuyerWiseQtyQuery } from "../../../redux/service/OrderEntry";
import OrderEntryBuyerQtyWise from "./TableData/OrderEntryBuyerQtyWise";

const STATUS_COLORS = {
  Running: { top: "#7c3aed", bottom: "#c4b5fd" }, // purple
  Completed: { top: "#06b6d4", bottom: "#67e8f9" }, // cyan
};

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

const OrderBuyerWiseQty = ({ companyName, finYear, finYr }) => {
  const theme = useTheme();
  const [tableConfig, setTableConfig] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 10;

  /* ---------------- FETCH DATA ---------------- */
  const { data: response, isLoading } = useGetOrderEntryBuyerWiseQtyQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );

  const handleChartClick = (params) => {
    setTableConfig({
      finYear,
      compCode: companyName,
      buyerCode: params.name,
    });
  };

  const buyerCodes = useMemo(() => {
    if (!response?.data) return [];
    const codes = [
      ...new Set(response.data.map((item) => item.buyerCode)),
    ].sort();
    return ["ALL", ...codes];
  }, [response]);

  /* ---------------- PREPARE DATA ---------------- */
  const { buyers, seriesList, hasNext, hasPrev } = useMemo(() => {
    if (!response?.data) return { buyers: [], seriesList: [], hasNext: false, hasPrev: false };

    const paginatedData = response.data.slice(startIndex, startIndex + itemsPerPage);

    const buyers = paginatedData.map((d) => d.buyerCode);

    const runningSeries = {
      name: "Running",
      type: "bar",
      barGap: "8%",
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: gradientColor(
          STATUS_COLORS.Running.top,
          STATUS_COLORS.Running.bottom,
        ),
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
      data: paginatedData.map((d) => d.runningQty),
    };

    const completedSeries = {
      name: "Completed",
      type: "bar",
      barGap: "8%",
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: gradientColor(
          STATUS_COLORS.Completed.top,
          STATUS_COLORS.Completed.bottom,
        ),
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
      data: paginatedData.map((d) => d.completedQty),
    };

    return {
      buyers,
      seriesList: [runningSeries, completedSeries],
      hasNext: startIndex + itemsPerPage < response.data.length,
      hasPrev: startIndex > 0,
    };
  }, [response, startIndex]);

  useEffect(() => {
    setStartIndex(0);
  }, [response?.data]);

  const handleNext = () => setStartIndex((prev) => prev + itemsPerPage);
  const handlePrev = () => setStartIndex((prev) => prev - itemsPerPage);

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
      data: ["Running", "Completed"], // ✅ fixed
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
    <>
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
          title="Order Entry — Buyer Wise Quantity"
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
            <Box position="relative">
              {hasPrev && (
                <IconButton
                  onClick={handlePrev}
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    bgcolor: "background.paper",
                    boxShadow: 1,
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                >
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>
              )}
              <ReactECharts
                option={options}
                style={{ height: 380 }}
                onEvents={{ click: handleChartClick }}
              />
              {hasNext && (
                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    bgcolor: "background.paper",
                    boxShadow: 1,
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                >
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {tableConfig && (
        <OrderEntryBuyerQtyWise
          finYear={tableConfig.finYear}
          compCode={tableConfig.compCode}
          buyerCode={tableConfig.buyerCode}
          closeTable={() => setTableConfig(null)}
          finYr={finYr}
          buyerCodes={buyerCodes}
        />
      )}
    </>
  );
};

export default OrderBuyerWiseQty;

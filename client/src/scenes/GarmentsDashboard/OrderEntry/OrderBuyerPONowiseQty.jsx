import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  useTheme,
  Box,
  IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ReactECharts from "echarts-for-react";
import { useGetOrderEntryBuyerWisePoNoQtyQuery } from "../../../redux/service/OrderEntry";
import OrderEntryBuyerPoNoWiseTable from "./TableData/OrderEntryBuyerPoNoWiseTable";

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

const OrderBuyerPONowiseQty = ({ companyName, finYear, finYr }) => {
  const theme = useTheme();
  const [tableConfig, setTableConfig] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedBuyer, setSelectedBuyer] = useState("");
  const [selectedbPoNo, setSelectedbPoNo] = useState("");
  const itemsPerPage = 10;

  /* ---------------- FETCH DATA ---------------- */
  const { data: response, isLoading } = useGetOrderEntryBuyerWisePoNoQtyQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );

  const handleChartClick = (params) => {
    setTableConfig({
      finYear,
      compCode: companyName,
      buyerCode: selectedBuyer,
      bpono: params.name,
    });
  };

  /* ---------------- BUYER DROPDOWN ---------------- */
  const buyerCodes = useMemo(() => {
    if (!response?.data) return [];
    return [...new Set(response.data.map((item) => item.buyerCode))].sort();
  }, [response]);

  useEffect(() => {
    if (buyerCodes.length && !selectedBuyer) {
      setSelectedBuyer(buyerCodes[0]);
    }
  }, [buyerCodes]);

  /* ---------------- PREPARE DATA ---------------- */
  const { poNos, seriesList, hasNext, hasPrev } = useMemo(() => {
    if (!response?.data || !selectedBuyer)
      return { poNos: [], seriesList: [], hasNext: false, hasPrev: false };

    const filtered = response.data.filter((d) => d.buyerCode === selectedBuyer);

    const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

    return {
      poNos: paginatedData.map((d) => d.bpono),
      seriesList: [
        {
          name: "Total Qty",
          type: "bar",
          barWidth: 30,
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: gradientColor("#2563eb", "#93c5fd"),
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
          data: paginatedData.map((d) => d.totalQty),
        },
      ],
      hasNext: startIndex + itemsPerPage < filtered.length,
      hasPrev: startIndex > 0,
    };
  }, [response, selectedBuyer, startIndex]);

  useEffect(() => {
    setStartIndex(0);
  }, [response?.data, selectedBuyer]);

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
      show: false,
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
      data: poNos,
      axisTick: { alignWithLabel: true },
      axisLine: { lineStyle: { color: "#e2e8f0" } },
      axisLabel: {
        fontSize: 10,
        fontWeight: 600,
        color: "#374151",
        rotate: 30,
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
          title="Order Entry — Buyer Po No Wise Quantity"
          titleTypographyProps={{
            sx: { fontSize: ".9rem", fontWeight: 700, color: "#1e293b" },
          }}
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
        <OrderEntryBuyerPoNoWiseTable
          finYear={tableConfig.finYear}
          compCode={tableConfig.compCode}
          buyerCode={tableConfig.buyerCode}
          closeTable={() => setTableConfig(null)}
          finYr={finYr}
          buyerCodes={buyerCodes}
          bpoNo={tableConfig.bpono}
          allPoData={response?.data || []}
        />
      )}
    </>
  );
};

export default OrderBuyerPONowiseQty;

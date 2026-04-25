import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, useTheme } from "@mui/material";
import ReactECharts from "echarts-for-react";
import {
  useGetSupplierEfficiencyQuery,
  useGetSupplierEfficiencyCombinedQuery,
  useGetSupplierEfficiencyPurchaseGeneralQuery,
} from "../../../redux/service/purchaseService";
import { skipToken } from "@reduxjs/toolkit/query";
import SupplierEfficiencyTable from "./TableData/SupplierEfficiencyTable";

const colorArray = [
  "#8A37DE",
  "#005E72",
  "#E5181C",
  "#056028",
  "#1F2937",
  "#F44F5E",
  "#E55A89",
  "#D863B1",
  "#CA6CD8",
  "#B57BED",
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const SupplierEfficiency = ({
  companyName,
  finYear,
  poType,
  companyList,
  finYr,
}) => {
  const theme = useTheme();

  const [chartData, setChartData] = useState([]);
  const [orderChartData, setOrderChartData] = useState([]);

  const [tableParams, setTableParams] = useState(null);
  const [showYearTable, setShowYearTable] = useState(false);

  const [selectedYear, setSelectedYear] = useState(finYear || "");
  const [selectedCompCode, setSelectedCompCode] = useState(companyName || "");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    setSelectedYear(finYear);
  }, [finYear]);
  useEffect(() => {
    setSelectedCompCode(companyName);
  }, [companyName]);

  useEffect(() => {
    if (poType === "Order" && orderChartData.length > 0) {
      setSelectedType(orderChartData[0].type);
    }
  }, [orderChartData, poType]);

  const activeOrderChart = useMemo(() => {
    return orderChartData.find((g) => g.type === selectedType) || null;
  }, [orderChartData, selectedType]);

  // ── Queries ────────────────────────────────────────────────────────────────
  const combinedQuery = useGetSupplierEfficiencyCombinedQuery(
    finYear && companyName ? { params: { finYear, companyName } } : skipToken,
  );
  const orderQuery = useGetSupplierEfficiencyQuery(
    finYear && companyName ? { params: { finYear, companyName } } : skipToken,
  );
  const generalQuery = useGetSupplierEfficiencyPurchaseGeneralQuery(
    finYear && companyName ? { params: { finYear, companyName } } : skipToken,
  );

  const groupTopSuppliers = (data, topN = 9) => {
    if (!data || !data.length) return [];
    const sorted = [...data].sort((a, b) => b.value - a.value);
    const topSuppliers = sorted.slice(0, topN);
    const others = sorted.slice(topN);
    const othersValue = others.reduce((sum, d) => sum + d.value, 0);
    if (othersValue > 0) {
      topSuppliers.push({
        name: "Others",
        value: othersValue,
        itemStyle: { color: "#B0B0B0" },
      });
    }
    return topSuppliers;
  };

  const { data: response, isLoading } =
    poType === "All"
      ? combinedQuery
      : poType === "Order"
        ? orderQuery
        : generalQuery;

  // ── Process All / General response ────────────────────────────────────────
  useEffect(() => {
    if (poType !== "Order" && response?.data) {
      const sorted = [...response.data].sort((a, b) => b.VAL - a.VAL);
      const mappedData = sorted.map((item) => ({
        name: item.SUPPLIER,
        compCode: item.compCode,
        finYear: item.finYear,
        value: Number(item.VAL),
      }));
      console.log(mappedData, "mappedData");
      setChartData(groupTopSuppliers(mappedData, 9));
    }
  }, [response, poType]);

  // ── Process Order response ─────────────────────────────────────────────────
  useEffect(() => {
    if (poType === "Order" && response?.data) {
      const grouped = response.data.map((group) => {
        const mapped = [...group.data].map((item) => ({
          name: item.SUPPLIER,
          compCode: item.COMPCODE,
          finYear: item.FINYEAR,
          value: Number(item.VAL),
        }));
        return { type: group.type, chartData: groupTopSuppliers(mapped, 9) };
      });
      setOrderChartData(grouped);
    }
  }, [response, poType]);

  // ── Chart click handler ────────────────────────────────────────────────────
  const handleChartClick = (params) => {
    if (poType === "All") return;
    const { name, compCode, finYear } = params.data;
    const resolvedSupplier = name === "Others" ? "ALL" : name;
    setTableParams({
      supplier: resolvedSupplier,
      year: finYear,
      company: compCode,
      orderType: poType === "Order" ? selectedType : null,
    });
    setShowYearTable(true);
  };

  const supplierOptions = useMemo(() => {
    if (!chartData.length) return [];
    return [...new Set(chartData.map((i) => i.name))];
  }, [chartData]);

  // ── Spline chart builder (used for All / General and Order) ───────────────
  // Each supplier becomes one data point on the x-axis.
  // The smooth line connects them in descending value order.
  //   const buildSplineOption = (data) => ({
  //     backgroundColor: "#FFFFFF",
  //     tooltip: {
  //       trigger: "axis",
  //       axisPointer: { type: "cross" },
  //       formatter: (params) => {
  //         const p = params[0];
  //         return `${p.name}<br/>Earlier and OnTime Po: <b>${p.value}</b>`;
  //       },
  //     },
  //     grid: {
  //       left: "3%",
  //       right: "5%",
  //       bottom: "22%",
  //       top: "10%",
  //       containLabel: true,
  //     },
  //     xAxis: {
  //       type: "category",
  //       data: data.map((d) => d.name),
  //       axisLabel: {
  //         fontSize: 12,
  //         rotate: 35, // rotate labels so long supplier names don't overlap
  //         interval: 0, // show every label
  //         overflow: "truncate",
  //         width: 80,
  //         formatter: (val) => (val.length > 14 ? val.slice(0, 13) + "…" : val),
  //       },
  //       axisLine: { lineStyle: { color: "#ddd" } },
  //       axisTick: { show: false },
  //     },
  //     yAxis: {
  //       type: "value",
  //       name: "Count",
  //       nameTextStyle: { fontSize: 10, color: "#888" },
  //       axisLabel: { fontSize: 10 },
  //       splitLine: { lineStyle: { type: "dashed", color: "#eee" } },
  //     },
  //     series: [
  //       {
  //         type: "line",
  //         smooth: true, // spline smoothing
  //         symbol: "circle",
  //         symbolSize: 10,
  //         lineStyle: { width: 3 },
  //         // gradient color along the line using visualMap
  //         areaStyle: {
  //           opacity: 0.15,
  //         },
  //         data: data.map((d, idx) => ({
  //           value: d.value,
  //           name: d.name,
  //           // carry original data so click handler can read it
  //           compCode: d.compCode,
  //           finYear: d.finYear,
  //           itemStyle: {
  //             color:
  //               d.name === "Others"
  //                 ? "#B0B0B0"
  //                 : colorArray[idx % colorArray.length],
  //             borderColor: "#fff",
  //             borderWidth: 2,
  //           },
  //         })),
  //         label: {
  //           show: true,
  //           position: "top",
  //           fontSize: 10,
  //           fontWeight: "bold",
  //           formatter: ({ value }) => value,
  //         },
  //       },
  //     ],
  //     // Color the line itself with first color
  //     color: [colorArray[0]],
  //   });
  const buildSplineOption = (data) => ({
    backgroundColor: "#FFFFFF",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params) => {
        const p = params[0];
        return `${p.name}<br/>Earlier and OnTime Po: <b>${p.value}</b>`;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "12%",
      top: "12%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.map((d) => d.name),
      axisLabel: {
        fontSize: 10,
        rotate: 35,
        interval: 0,
        overflow: "truncate",
        width: 80,
        fontWeight: 600,
        formatter: (val) => (val.length > 14 ? val.slice(0, 13) + "…" : val),
      },
      axisLine: { lineStyle: { color: "#ddd" } },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      name: "Count",
      nameTextStyle: { fontSize: 10, color: "#888" },
      axisLabel: { fontSize: 10 },
      splitLine: { lineStyle: { type: "dashed", color: "#eee" } },
    },
    series: [
      {
        type: "bar",
        barMaxWidth: 40,
        itemStyle: {
          // ── rounded top corners ──────────────────────────────
          borderRadius: [8, 8, 0, 0],
          color: (params) => {
            const baseColor =
              params.data.name === "Others"
                ? ["#B0B0B0", "#D0D0D0"]
                : [
                    ["#8A37DE", "#C084FC"],
                    ["#005E72", "#22D3EE"],
                    ["#E5181C", "#FCA5A5"],
                    ["#056028", "#4ADE80"],
                    ["#1F2937", "#6B7280"],
                    ["#F44F5E", "#FDA4AF"],
                    ["#E55A89", "#F9A8D4"],
                    ["#D863B1", "#F0ABFC"],
                    ["#CA6CD8", "#E879F9"],
                    ["#B57BED", "#D8B4FE"],
                  ][params.dataIndex % 10];

            // ── gradient from bottom to top ──────────────────
            return {
              type: "linear",
              x: 0,
              y: 1, // start bottom
              x2: 0,
              y2: 0, // end top
              colorStops: [
                { offset: 0, color: baseColor[0] }, // dark at bottom
                { offset: 1, color: baseColor[1] }, // light at top
              ],
            };
          },
          shadowColor: "rgba(0,0,0,0.15)",
          shadowBlur: 6,
          shadowOffsetY: 3,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 14,
            shadowColor: "rgba(0,0,0,0.3)",
          },
        },
        label: {
          show: true,
          position: "top",
          fontSize: "10px",
          fontWeight: "bold",
          color: "#555",
          formatter: ({ value }) => value,
        },
        data: data.map((d, idx) => ({
          value: d.value,
          name: d.name,
          compCode: d.compCode,
          finYear: d.finYear,
        })),
      },
    ],
  });
  const singleOption = useMemo(() => buildSplineOption(chartData), [chartData]);

  const orderOption = useMemo(() => {
    if (!activeOrderChart) return null;
    return buildSplineOption(activeOrderChart.chartData);
  }, [activeOrderChart]);

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
        <CardHeader
          title="Supplier Efficiency"
          titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
          sx={{
            p: 1,
            height: 40,
            borderBottom: `2px solid ${theme.palette.divider}`,
          }}
          action={
            poType === "Order" && orderChartData.length > 0 ? (
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
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
                {orderChartData.map((g) => (
                  <option key={g.type} value={g.type}>
                    {g.type}
                  </option>
                ))}
              </select>
            ) : null
          }
        />
        <CardContent>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: 40, height: 380 }}>
              Loading...
            </div>
          ) : poType === "Order" ? (
            orderOption ? (
              <ReactECharts
                option={orderOption}
                style={{ height: 380 }}
                onEvents={{ click: handleChartClick }}
              />
            ) : (
              <div style={{ textAlign: "center", padding: 40, height: 380 }}>
                No data
              </div>
            )
          ) : (
            <ReactECharts
              option={singleOption}
              style={{ height: 380 }}
              onEvents={{ click: handleChartClick }}
            />
          )}
        </CardContent>
      </Card>

      {/* ── DETAIL TABLE MODAL ── */}
      {showYearTable && selectedYear && poType !== "All" && (
        <SupplierEfficiencyTable
          year={tableParams.year}
          company={tableParams.company}
          supplier={tableParams.supplier}
          poType={poType}
          companyList={companyList}
          finYr={finYr}
          closeTable={() => {
            setShowYearTable(false);
            setSelectedCompCode(companyName);
            setSelectedYear(finYear);
            setSelectedType(orderChartData[0]?.type);
          }}
          initialOrderType={tableParams.orderType}
          supplierOptions={supplierOptions}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedCompCode={selectedCompCode}
          setSelectedCompCode={setSelectedCompCode}
        />
      )}
    </>
  );
};

export default SupplierEfficiency;

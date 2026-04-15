import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  useTheme,
  Grid,
  Typography,
} from "@mui/material";
import ReactECharts from "echarts-for-react";
import {
  useGetTopTenItemsQuery,
  useGetTopTenItemsPurchaseGeneralQuery,
  useGetTopTenItemsCombinedQuery,
} from "../../../redux/service/purchaseService";
import { skipToken } from "@reduxjs/toolkit/query";
import TopTenItemstable from "./TableData/TopTenItemstable";

const colorArray = [
  "#6366F1", // Indigo
  "#22C55E", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#A855F7", // Purple
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#E11D48", // Rose
  "#0EA5E9", // Sky Blue
];

const formatINR = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Reusable single pie chart
const SupplierPieChart = ({ title, data, onChartClick }) => {
  const theme = useTheme();

  const option = useMemo(
    () => ({
      backgroundColor: "#FFFFFF",
      tooltip: {
        trigger: "item",
        formatter: ({ name, value, percent }) =>
          `${name}<br/>Purchase: <b>${formatINR(value)}</b><br/>(${percent}%)`,
      },
      legend: { show: false },
      series: [
        {
          name: "Purchase",
          type: "pie",
          radius: ["45%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 2 },
          label: {
            show: true,
            position: "outside",
            formatter: ({ name }) => {
              const maxLineLength = 28;
              const words = name.split(" ");
              let lines = [],
                currentLine = "";
              words.forEach((word) => {
                if ((currentLine + " " + word).trim().length <= maxLineLength) {
                  currentLine = (currentLine + " " + word).trim();
                } else {
                  if (currentLine) lines.push(currentLine);
                  currentLine = word;
                }
              });
              if (currentLine) lines.push(currentLine);
              return lines.join("\n");
            },
            fontSize: 11,
            fontWeight: "bold",
          },
          labelLine: { show: true, length: 10, length2: 5 },
          data: data.map((d, idx) => ({
            ...d,
            itemStyle: { color: colorArray[idx % colorArray.length] },
          })),
        },
      ],
    }),
    [data],
  );

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", m: 1 }}>
      <CardHeader
        title={title}
        titleTypographyProps={{ sx: { fontSize: ".85rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent sx={{ p: 1 }}>
        <ReactECharts
          option={option}
          style={{ height: 320 }}
          onEvents={{ click: onChartClick }}
        />
      </CardContent>
    </Card>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const TopTenItemsYear = ({
  companyName,
  finYear,
  poType,
  companyList,
  finYr,
}) => {
  const theme = useTheme();

  const [chartData, setChartData] = useState([]); // for All / General
  const [orderChartData, setOrderChartData] = useState([]); // for Order — array of { type, data[] }

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
      setSelectedType(orderChartData[0].type); // auto-select first type
    }
  }, [orderChartData, poType]);

  const activeOrderChart = useMemo(() => {
    return orderChartData.find((g) => g.type === selectedType) || null;
  }, [orderChartData, selectedType]);

  // ── Queries ────────────────────────────────────────────────────────────────
  const combinedQuery = useGetTopTenItemsCombinedQuery(
    finYear && companyName ? { params: { finYear, companyName } } : skipToken,
  );
  const orderQuery = useGetTopTenItemsQuery(
    finYear && companyName ? { params: { finYear, companyName } } : skipToken,
  );
  const generalQuery = useGetTopTenItemsPurchaseGeneralQuery(
    finYear && companyName ? { params: { finYear, companyName } } : skipToken,
  );

  const { data: response, isLoading } =
    poType === "All"
      ? combinedQuery
      : poType === "Order"
        ? orderQuery
        : generalQuery;

  // ── Process All / General response ────────────────────────────────────────
  useEffect(() => {
    if (poType !== "Order" && response?.data) {
      const sorted = [...response.data].sort(
        (a, b) => (b.TOTAL_VAL ?? b.VAL) - (a.TOTAL_VAL ?? a.VAL), // Combined has TOTAL_VAL, General has VAL
      );
      setChartData(
        sorted.map((item) => ({
          name: item.ITEM,
          compCode: item.compCode,
          finYear: item.finYear,
          value: Number(item.VAL),
        })),
      );
    }
  }, [response, poType]);

  // ── Process Order response (grouped by type) ───────────────────────────────
  useEffect(() => {
    if (poType === "Order" && response?.data) {
      // response.data = [{ type: "GREY YARN", data: [...] }, ...]
      const grouped = response.data.map((group) => ({
        type: group.type,
        chartData: [...group.data]
          .sort((a, b) => b.VAL - a.VAL)
          .map((item) => ({
            name: item.ITEM,
            compCode: item.COMPCODE,
            finYear: item.FINYEAR,
            value: Number(item.VAL),
          })),
      }));
      setOrderChartData(grouped);
    }
  }, [response, poType]);

  // ── Chart click handler ────────────────────────────────────────────────────
  const handleChartClick = (params) => {
    if (poType === "All") return;
    const { name, compCode, finYear } = params.data;
    setTableParams({
      item: name,
      year: finYear,
      company: compCode,
      orderType: poType === "Order" ? selectedType : null,
    });
    setShowYearTable(true);
  };

  // ── supplierOptions for the modal ─────────────────────────────────────────
  const itemOptions = useMemo(() => {
    // ← was supplierOptions
    if (!chartData.length) return [];
    return [...new Set(chartData.map((i) => i.name))];
  }, [chartData]);

  // ── Single pie option (All / General) ────────────────────────────────────
  //   const singleOption = useMemo(
  //     () => ({
  //       backgroundColor: "#FFFFFF",
  //       tooltip: {
  //         trigger: "item",
  //         formatter: ({ name, value, percent }) =>
  //           `${name}<br/>Purchase: <b>${formatINR(value)}</b><br/>(${percent}%)`,
  //       },
  //       legend: { show: false },
  //       series: [
  //         {
  //           name: "Purchase",
  //           type: "pie",
  //           radius: ["45%", "70%"],
  //           avoidLabelOverlap: false,
  //           itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 2 },
  //           label: {
  //             show: true,
  //             position: "outside",
  //             formatter: ({ name }) => {
  //               const maxLineLength = 28;
  //               const words = name.split(" ");
  //               let lines = [],
  //                 currentLine = "";
  //               words.forEach((word) => {
  //                 if ((currentLine + " " + word).trim().length <= maxLineLength) {
  //                   currentLine = (currentLine + " " + word).trim();
  //                 } else {
  //                   if (currentLine) lines.push(currentLine);
  //                   currentLine = word;
  //                 }
  //               });
  //               if (currentLine) lines.push(currentLine);
  //               return lines.join("\n");
  //             },
  //             fontSize: 11,
  //             fontWeight: "bold",
  //           },
  //           labelLine: { show: true, length: 10, length2: 5 },
  //           data: chartData.map((d, idx) => ({
  //             ...d,
  //             itemStyle: { color: colorArray[idx % colorArray.length] },
  //           })),
  //         },
  //       ],
  //     }),
  //     [chartData],
  //   );
  const singleOption = useMemo(
    () => ({
      backgroundColor: "#FFFFFF",
      tooltip: {
        trigger: "item",
        confine: true, // ensures tooltip stays inside chart container
        position: function (point, params, dom, rect, size) {
          const chartWidth = rect.width;
          const chartHeight = rect.height;
          const tooltipWidth = size.contentSize[0];
          const tooltipHeight = size.contentSize[1];

          let x = point[0] + 15; // try right side
          let y = point[1] - tooltipHeight / 2;

          // If tooltip overflows right edge, move to left
          if (x + tooltipWidth > chartWidth) {
            x = point[0] - tooltipWidth - 15;
          }

          // If tooltip overflows left edge, move inside
          if (x < 0) x = 5;

          // Prevent overflow top/bottom
          if (y < 0) y = 5;
          if (y + tooltipHeight > chartHeight)
            y = chartHeight - tooltipHeight - 5;

          return [x, y];
        },
        formatter: ({ name, value, percent }) =>
          `${name}<br/>Purchase: <b>${formatINR(value)}</b><br/>(${percent}%)`,
      },

legend: { show: false },
      series: [
        {
          name: "Purchase",
          type: "pie",
          radius: ["20%", "70%"],
          center: ["50%", "45%"],
          roseType: "radius",
          itemStyle: { borderRadius: 6 },
          label: {
            show: true,
            fontSize: 11,
            fontWeight: "bold",
            formatter: ({ name }) => {
              const maxLineLength = 18; // adjust based on space
              const words = name.split(" ");
              let lines = [];
              let currentLine = "";

              words.forEach((word) => {
                if ((currentLine + " " + word).trim().length <= maxLineLength) {
                  currentLine = (currentLine + " " + word).trim();
                } else {
                  if (currentLine) lines.push(currentLine);
                  currentLine = word;
                }
              });

              if (currentLine) lines.push(currentLine);

              return lines.join("\n"); // line break
            },
          },
          data: chartData
            .sort((a, b) => a.value - b.value)
            .map((d, idx) => ({
              ...d,
              itemStyle: { color: colorArray[idx % colorArray.length] },
            })),
        },
      ],
    }),
    [chartData],
  );
  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
        <CardHeader
          title="Top Ten Items Purchased"
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
                  padding: "0px 14px", // slightly more padding for width
                  borderRadius: "6px",
                  border: "2px solid #2563eb",
                  marginTop: "2px",
                  marginLeft: "-12px", // move slightly more to the left
                  minWidth: "120px", // ensure select is wider
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
            activeOrderChart ? (
              <ReactECharts
                option={{
                  backgroundColor: "#FFFFFF",
                  tooltip: {
                    trigger: "item",
                    formatter: ({ name, value, percent }) =>
                      `${name}<br/>Purchase: <b>${formatINR(value)}</b><br/>(${percent}%)`,
                  },
                 legend: { show: false },
                  series: [
                    {
                      name: "Purchase",
                      type: "pie",
                      radius: ["20%", "70%"],
                      center: ["50%", "45%"],
                      roseType: "radius",
                      itemStyle: { borderRadius: 6 },
                      label: {
                        show: true,
                        fontSize: 11,
                        fontWeight: "bold",
                        formatter: ({ name }) => {
                          const maxLineLength = 18; // adjust based on space
                          const words = name.split(" ");
                          let lines = [];
                          let currentLine = "";

                          words.forEach((word) => {
                            if (
                              (currentLine + " " + word).trim().length <=
                              maxLineLength
                            ) {
                              currentLine = (currentLine + " " + word).trim();
                            } else {
                              if (currentLine) lines.push(currentLine);
                              currentLine = word;
                            }
                          });

                          if (currentLine) lines.push(currentLine);

                          return lines.join("\n"); // line break
                        },
                      },
                      data: activeOrderChart.chartData
                        .sort((a, b) => a.value - b.value)
                        .map((d, idx) => ({
                          ...d,
                          itemStyle: {
                            color: colorArray[idx % colorArray.length],
                          },
                        })),
                    },
                  ],
                }}
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
        <TopTenItemstable
          year={tableParams.year}
          company={tableParams.company}
          item={tableParams.item}
          poType={poType}
          companyList={companyList}
          finYr={finYr}
          closeTable={() => {
            setShowYearTable(false);
            setSelectedCompCode(companyName);
            setSelectedYear(finYear);
            setSelectedType(orderChartData[0].type);
          }}
          initialOrderType={tableParams.orderType}
          itemOptions={itemOptions}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedCompCode={selectedCompCode}
          setSelectedCompCode={setSelectedCompCode}
        />
      )}
    </>
  );
};

export default TopTenItemsYear;



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
  useGetTopTenSupplierQuery,
  useGetTopTenSupplierPurchaseGeneralQuery,
  useGetTopTenSupplierCombinedQuery,
} from "../../../redux/service/purchaseService";
import { skipToken } from "@reduxjs/toolkit/query";
import TopTenSupplierGeneral from "./TableData/TopTenSupplierGeneral";

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

const formatINR = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;



// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const TopTenSupplierYear = ({
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
  const combinedQuery = useGetTopTenSupplierCombinedQuery(
    finYear && companyName ? { params: { finYear, companyName } } : skipToken,
  );
  const orderQuery = useGetTopTenSupplierQuery(
    finYear && companyName ? { params: { finYear, companyName } } : skipToken,
  );
  const generalQuery = useGetTopTenSupplierPurchaseGeneralQuery(
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
        (a, b) => b.TOTAL_VAL - a.TOTAL_VAL,
      );
      setChartData(
        sorted.map((item) => ({
          name: item.supplierName,
          compCode: item.compCode,
          finYear: item.finYear,
          value: Number(item.TOTAL_VAL),
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
            name: item.SUPPLIER,
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
    setTableParams({ supplier: name, year: finYear, company: compCode ,orderType: poType === "Order" ? selectedType : null,});
    setShowYearTable(true);
  };

  // ── supplierOptions for the modal ─────────────────────────────────────────
  const supplierOptions = useMemo(() => {
    if (!chartData.length) return [];
    return [...new Set(chartData.map((i) => i.name))];
  }, [chartData]);

  // ── Single pie option (All / General) ────────────────────────────────────
  const singleOption = useMemo(
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
            fontSize: "10px",
            fontWeight: "bold",
          },
          labelLine: { show: true, length: 10, length2: 5 },
          data: chartData.map((d, idx) => ({
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
          title="Top Ten Supplier"
          titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
          sx={{ p: 1,height:40, borderBottom: `2px solid ${theme.palette.divider}` }}
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
            /* ── ORDER: single chart based on selected type ── */
            activeOrderChart ? (
              <ReactECharts
                option={{
                  ...singleOption,
                  series: [
                    {
                      ...singleOption.series[0],
                      data: activeOrderChart.chartData.map((d, idx) => ({
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
            /* ── ALL / GENERAL: single pie chart ── */
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
        <TopTenSupplierGeneral
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
            setSelectedType(orderChartData[0].type)
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

export default TopTenSupplierYear;

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, useTheme, Box } from "@mui/material";
import ReactECharts from "echarts-for-react";
import {
  useGetTaReportOrderCountByCompanyQuery,
  useGetTaReportQuery,
} from "../../../redux/service/tareport.service";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { addInsightsRowTurnOver } from "../../../utils/hleper";

/* ── Format ISO date to DD/MM/YYYY without timezone shift ── */
const formatDate = (val) => {
  if (!val) return "";
  const datePart = typeof val === "string" ? val.split("T")[0] : null;
  if (!datePart) return "";
  const [y, m, d] = datePart.split("-");
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
};

/* ── Days between two ISO strings (positive = actual late) ── */
const diffDays = (planVal, actualVal) => {
  if (!planVal || !actualVal) return 0;
  const planDate = new Date(planVal.split("T")[0]);
  const actualDate = new Date(actualVal.split("T")[0]);
  return Math.round((actualDate - planDate) / (1000 * 60 * 60 * 24));
};

/* ── Table style helpers ── */
const thStyle = (width, sticky = false) => ({
  border: "1px solid #cbd5e1",
  padding: "5px 8px",
  textAlign: "center",
  fontWeight: 700,
  fontSize: 11,
  whiteSpace: "nowrap",
  minWidth: width,
  background: "#bfdbfe",
  ...(sticky && {
    position: "sticky",
    left: 0,
    zIndex: 2,
    background: "#93c5fd",
  }),
});

const tdStyle = (align, sticky = false) => ({
  border: "1px solid #e2e8f0",
  padding: "5px 8px",
  textAlign: align,
  fontSize: 11,
  whiteSpace: "nowrap",
  ...(sticky && {
    position: "sticky",
    left: 0,
    zIndex: 1,
    background: "#f1f5f9",
    fontWeight: 600,
  }),
});

const TAReportStatus = ({ companyName, finYear }) => {
  const theme = useTheme();
  const [selectedOrderNO, setSelectedOrderNo] = useState("");

  /* ── Fetch ── */
  const { data: orderDropdown } = useGetTaReportOrderCountByCompanyQuery(
    { params: { companyName } },
    { skip: !companyName },
  );

  const { data: response, isLoading } = useGetTaReportQuery(
    { params: { orderNo: selectedOrderNO } },
    { skip: !selectedOrderNO },
  );

  /* ── Derive dynamic activity columns (everything except ORDERNO, TYPE) ── */
  const activityKeys = useMemo(() => {
    const rows = response?.data ?? [];
    if (!rows.length) return [];
    const excluded = new Set(["ORDERNO", "TYPE"]);
    const allKeys = new Set();
    rows.forEach((r) => Object.keys(r).forEach((k) => allKeys.add(k)));
    return [...allKeys].filter((k) => !excluded.has(k)).map((k) => k.trim());
  }, [response]);

  /* ── Find PLAN and ACTUAL rows ── */
  const planRow = useMemo(
    () => response?.data?.find((r) => r.TYPE === "PLAN") ?? {},
    [response],
  );
  const actualRow = useMemo(
    () => response?.data?.find((r) => r.TYPE === "ACTUAL") ?? {},
    [response],
  );

  /* ── Helper: get value from row by trimmed key ── */
  const getVal = (row, key) => {
    const match = Object.keys(row).find((k) => k.trim() === key);
    return match ? row[match] : null;
  };

  /* ── Chart: delay days per activity ── */
  const chartData = useMemo(() => {
    return activityKeys.map((key) => {
      const plan = getVal(planRow, key);
      const actual = getVal(actualRow, key);
      const delay = diffDays(plan, actual);
      return { key, delay };
    });
  }, [activityKeys, planRow, actualRow]);

  const chartOptions = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params) => {
        const p = params[0];
        return `${p.name}<br/>Delay: <b>${p.value} days</b>`;
      },
    },
    grid: {
      left: "2%",
      right: "2%",
      bottom: "22%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: chartData.map((x) => x.key),
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 10,
        fontWeight: 600,
        color: "#374151",
      },
    },
    yAxis: {
      type: "value",
      name: "Delay (Days)",
      nameTextStyle: { fontSize: 11, color: "#6b7280" },
      axisLabel: { formatter: "{value}" },
      splitLine: { lineStyle: { color: "#f1f5f9" } },
    },
    series: [
      {
        name: "Delay Days",
        type: "bar",
        barWidth: "55%",
        data: chartData.map((x) => ({
          value: x.delay,
          itemStyle: {
            color:
              x.delay > 0 ? "#ef4444" : x.delay < 0 ? "#22c55e" : "#94a3b8",
            borderRadius: [4, 4, 0, 0],
          },
        })),
        label: {
          show: true,
          position: "top",
          fontSize: 10,
          fontWeight: 700,
          color: "#111827",
          formatter: (p) => p.value,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0,0,0,0.25)",
          },
        },
      },
    ],
  };
  const handleExport = async () => {
    if (!activityKeys.length) {
      alert("No data to export");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("TA Report");

    const columns = [
      { header: "Activity", key: "ACTIVITY", width: 20 },
      ...activityKeys.map((key) => ({ header: key, key, width: 18 })),
    ];

    ws.columns = columns;
    const mergeEnd = String.fromCharCode(64 + columns.length);

    /* Row 1 — Title */
    ws.insertRow(1, ["T&A Delay Report"]);
    ws.mergeCells(`A1:${mergeEnd}1`);
    const tc = ws.getCell("A1");
    tc.font = { bold: true, size: 13 };
    tc.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 28;

    /* Row 2 — Insights */
    addInsightsRowTurnOver({
      worksheet: ws,
      startRow: 2,
      totalColumns: 4,
      selectedYear: finYear,
      localCompany: companyName,
      dynamicField: "Order No",
      dynamicValue: selectedOrderNO,
    });

    /* Row 3 — Header */
    const hr = ws.getRow(3);
    hr.height = 24;
    hr.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    /* Plan row */
    const planExcelRow = ws.addRow({
      ACTIVITY: "Plan",
      ...Object.fromEntries(
        activityKeys.map((key) => [key, formatDate(getVal(planRow, key))]),
      ),
    });
    planExcelRow.height = 20;
    planExcelRow.eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF0FDF4" },
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    /* Actual row */
    const actualExcelRow = ws.addRow({
      ACTIVITY: "Actual",
      ...Object.fromEntries(
        activityKeys.map((key) => {
          const plan = getVal(planRow, key);
          const actual = getVal(actualRow, key);
          const delay = actual ? diffDays(plan, actual) : null;
          const dateStr = formatDate(actual);
          return [
            key,
            delay !== null && delay !== 0
              ? `${dateStr} (${delay > 0 ? "+" : ""}${delay}d)`
              : dateStr,
          ];
        }),
      ),
    });
    actualExcelRow.height = 20;
    actualExcelRow.eachCell((cell, cn) => {
      const key = columns[cn - 1]?.key;
      const isDelayed =
        typeof cell.value === "string" && cell.value.includes("+");
      const isEarly =
        typeof cell.value === "string" && cell.value.includes("(-");
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFF7ED" },
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
      if (key !== "ACTIVITY") {
        cell.font = {
          color: {
            argb: isDelayed ? "FFDC2626" : isEarly ? "FF16A34A" : "FF000000",
          },
        };
      }
    });

    /* Remarks row */
    const remarksRow = ws.addRow({
      ACTIVITY: "Remarks",
      ...Object.fromEntries(activityKeys.map((key) => [key, ""])),
    });
    remarksRow.height = 20;
    remarksRow.eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFAFAFA" },
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    ws.views = [{ state: "frozen", ySplit: 3 }];
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `TAReport_${companyName}_${selectedOrderNO}.xlsx`,
    );
  };
  /* ── Render ── */
  return (
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
        title="T&A Delay Report"
        titleTypographyProps={{ sx: { fontSize: ".95rem", fontWeight: 700 } }}
        action={
          <div className="flex items-center gap-2">
            <select
              value={selectedOrderNO}
              onChange={(e) => setSelectedOrderNo(e.target.value)}
              className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-52"
            >
              <option value="">Select Order</option>
              {orderDropdown?.data?.map((item) => (
                <option key={item.orderNo} value={item.orderNo}>
                  {item.orderNo}
                </option>
              ))}
            </select>

            {selectedOrderNO && !isLoading && activityKeys.length > 0 && (
              <button
                onClick={handleExport}
                className="p-0 rounded-full shadow-md hover:brightness-110 transition-all duration-300"
                title="Download Excel"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
                  alt="Excel"
                  className="w-7 h-7 rounded-lg"
                />
              </button>
            )}
          </div>
        }
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />

      <CardContent sx={{ p: 1 }}>
        {!selectedOrderNO ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: "text.secondary",
              fontSize: 13,
            }}
          >
            Select an order to view the T&A delay report
          </Box>
        ) : isLoading ? (
          <Box sx={{ textAlign: "center", py: 8 }}>Loading...</Box>
        ) : (
          <>
            {/* ── Plan / Actual / Remarks table ── */}
            <Box
              sx={{
                overflowX: "auto",
                overflowY: "hidden",
                mb: 2,
                border: "1px solid #e2e8f0",
                borderRadius: 2,
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                  fontSize: 11,
                  width: "max-content",
                  minWidth: "100%",
                }}
              >
                <thead>
                  <tr>
                    <th style={thStyle("130px", true)}>Activity</th>
                    {activityKeys.map((key) => (
                      <th key={key} style={thStyle("130px")}>
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Plan row */}
                  <tr style={{ background: "#f0fdf4" }}>
                    <td style={tdStyle("left", true)}>Plan</td>
                    {activityKeys.map((key) => (
                      <td key={key} style={tdStyle("center")}>
                        {formatDate(getVal(planRow, key))}
                      </td>
                    ))}
                  </tr>

                  {/* Actual row */}
                  <tr style={{ background: "#fff7ed" }}>
                    <td style={tdStyle("left", true)}>Actual</td>
                    {activityKeys.map((key) => {
                      const plan = getVal(planRow, key);
                      const actual = getVal(actualRow, key);
                      const delay = actual ? diffDays(plan, actual) : null;
                      return (
                        <td key={key} style={tdStyle("center")}>
                          <span>{formatDate(actual)}</span>
                          {delay !== null && delay !== 0 && (
                            <span
                              style={{
                                marginLeft: 4,
                                fontSize: 9,
                                fontWeight: 700,
                                color: delay > 0 ? "#dc2626" : "#16a34a",
                              }}
                            >
                              ({delay > 0 ? "+" : ""}
                              {delay}d)
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Remarks row */}
                  {/* <tr style={{ background: "#fafafa" }}>
                    <td style={tdStyle("left", true)}>Remarks</td>
                    {activityKeys.map((key) => (
                      <td key={key} style={tdStyle("center")} />
                    ))}
                  </tr> */}
                </tbody>
              </table>
            </Box>

            {/* ── Delay bar chart ── */}
            <Box
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                p: 1,
                background: "#fff",
              }}
            >
              <ReactECharts
                option={chartOptions}
                style={{ height: 320, cursor: "default" }}
              />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TAReportStatus;

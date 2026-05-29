import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, useTheme, Box } from "@mui/material";
import ReactECharts from "echarts-for-react";
import {
  useGetTaReportOrderCountByCompanyQuery,
  useGetTaReportQuery,
} from "../../../redux/service/tareport.service";

const COLORS = ["#ef4444", "#f59e0b", "#8b5cf6", "#22c55e", "#3b82f6"];

/* ── Format ISO date to DD-MMM-YY without timezone shift ── */
const formatDate = (val) => {
  if (!val) return "";
  // take only the date part before 'T' to avoid timezone shift
  const datePart = typeof val === "string" ? val.split("T")[0] : null;
  if (!datePart) return "";
  const [y, m, d] = datePart.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${parseInt(d)}-${months[parseInt(m) - 1]}-${String(y).slice(2)}`;
};

/* ── Days between two ISO strings (positive = actual late) ── */
const diffDays = (planVal, actualVal) => {
  if (!planVal || !actualVal) return 0;
  const planDate = new Date(planVal.split("T")[0]);
  const actualDate = new Date(actualVal.split("T")[0]);
  return Math.round((actualDate - planDate) / (1000 * 60 * 60 * 24));
};

const TAReportStatus = ({ companyName }) => {
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
    // use all keys from both rows merged
    const allKeys = new Set();
    rows.forEach((r) => Object.keys(r).forEach((k) => allKeys.add(k)));
    return [...allKeys].filter((k) => !excluded.has(k)).map((k) => k.trim()); // trim keys since API has "cutting " with trailing space
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
    // API keys may have trailing spaces e.g. "cutting "
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
      bottom: "18%",
      top: "8%",
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
      axisLabel: { formatter: "{value}" },
    },
    series: [
      {
        name: "Delay Days",
        type: "bar",
        barWidth: "55%",
        data: chartData.map((x, i) => ({
          value: x.delay,
          itemStyle: {
            color: x.delay > 0 ? "#ef4444" : "#22c55e",
            borderRadius: [4, 4, 0, 0],
          },
        })),
        label: {
          show: true,
          position: "top",
          fontSize: 10,
          fontWeight: 700,
          color: "#111827",
          formatter: (p) => (p.value !== 0 ? p.value : "0"),
        },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: "rgba(0,0,0,0.25)" },
        },
      },
    ],
    credits: { enabled: false },
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
        }
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />

      <CardContent sx={{ p: 1 }}>
        {!selectedOrderNO ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              color: "text.secondary",
              fontSize: 13,
            }}
          >
            Select an order to view the T&A delay report
          </Box>
        ) : isLoading ? (
          <Box sx={{ textAlign: "center", py: 6 }}>Loading...</Box>
        ) : (
          <>
            {/* ── Plan / Actual / Remarks table ── */}
            <Box sx={{ overflowX: "auto", mb: 1 }}>
              <table
                style={{
                  borderCollapse: "collapse",
                  fontSize: 11,
                  width: "100%",
                  minWidth: `${(activityKeys.length + 2) * 110}px`,
                }}
              >
                <thead>
                  <tr style={{ background: "#dbeafe" }}>
                    <th style={thStyle("120px")}>Activity</th>
                    {activityKeys.map((key) => (
                      <th key={key} style={thStyle("110px")}>
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Plan row */}
                  <tr style={{ background: "#f0fdf4" }}>
                    <td style={tdStyle("left")}>Plan</td>
                    {activityKeys.map((key) => (
                      <td key={key} style={tdStyle("center")}>
                        {formatDate(getVal(planRow, key))}
                      </td>
                    ))}
                  </tr>
                  {/* Actual row */}
                  <tr style={{ background: "#fff7ed" }}>
                    <td style={tdStyle("left")}>Actual</td>
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
                  <tr style={{ background: "#fafafa" }}>
                    <td style={tdStyle("left")}>Remarks</td>
                    {activityKeys.map((key) => (
                      <td key={key} style={tdStyle("center")} />
                    ))}
                  </tr>
                </tbody>
              </table>
            </Box>

            {/* ── Delay bar chart ── */}
            <ReactECharts
              option={chartOptions}
              style={{ height: 320, cursor: "pointer" }}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

/* ── Table style helpers ── */
const thStyle = (width) => ({
  border: "1px solid #cbd5e1",
  padding: "5px 6px",
  textAlign: "center",
  fontWeight: 700,
  fontSize: 11,
  whiteSpace: "nowrap",
  minWidth: width,
  background: "#bfdbfe",
});

const tdStyle = (align) => ({
  border: "1px solid #e2e8f0",
  padding: "4px 6px",
  textAlign: align,
  fontSize: 11,
  whiteSpace: "nowrap",
});

export default TAReportStatus;

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, useTheme, Box } from "@mui/material";
import ReactECharts from "echarts-for-react";
import {
  useGetOrderEntryProfitLossOrderNoQuery,
  useGetOrderEntryProfitLossReportQuery,
} from "../../../redux/service/OrderEntry";

const ProfitLossReport = ({ companyName, finYear }) => {
  const theme = useTheme();
  const [selectedOrderNO, setSelectedOrderNo] = useState("");

  /* ── Fetch ── */
  const { data: orderDropdown } = useGetOrderEntryProfitLossOrderNoQuery(
    { params: { companyName } },
    { skip: !companyName },
  );

  const { data: response, isLoading } = useGetOrderEntryProfitLossReportQuery(
    { params: { orderNo: selectedOrderNO } },
    { skip: !selectedOrderNO },
  );

  /* ── Chart: delay days per activity ── */
  const chartData = response?.data ?? [];
  
  const isLoss = chartData.some((item) => item.PROCESSNAME === "LOSS %" || (item.PROCESSNAME === "PROFIT" && item.ACTUALQTY < 0));
  const actualLegendColor = isLoss ? "#ef4444" : "#22c55e";

  const chartOptions = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params) => {
        let res = params[0].name + '<br/>';
        const isLast = params[0].dataIndex === chartData.length - 1;
        params.forEach(item => {
          let valStr = isLast ? `${item.value.toLocaleString()}%` : item.value.toLocaleString("en-IN", { style: "currency", currency: "INR" });
          res += item.marker + " " + item.seriesName + ": " + valStr + '<br/>';
        });
        return res;
      },
    },

    legend: {
      top: 0,
      data: ["Planned", "Actual"],
    },

    grid: {
      left: "5%",
      right: "5%",
      bottom: "15%",
      top: "15%",
      containLabel: true,
    },

    xAxis: {
      type: "category",
      data: chartData.map((item) => item.PROCESSNAME),
      axisLabel: {
        interval: 0,
        rotate: 0,
        fontSize: 11,
        fontWeight: 600,
      },
    },

    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value) => value.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
        fontSize: 10,
        color: "#94a3b8",
      },
    },

    series: [
      {
        name: "Planned",
        type: "bar",
        barGap: "0%",
        barWidth: 35,
        data: chartData.map((item) => item.PLANNEDQTY),
        label: {
          show: true,
          position: "top",
          fontWeight: 600,
          formatter: (p) => {
            const isLast = p.dataIndex === chartData.length - 1;
            return isLast ? `${p.value.toLocaleString()}%` : p.value.toLocaleString("en-IN", { style: "currency", currency: "INR" });
          },
        },
        itemStyle: {
          color: "#3b82f6",
          borderRadius: [4, 4, 0, 0],
        },
      },
      {
        name: "Actual",
        type: "bar",
        barWidth: 35,
        itemStyle: {
          color: actualLegendColor,
        },
        data: chartData.map((item) => ({
          value: item.ACTUALQTY,
          itemStyle: {
            color: item.ACTUALQTY >= 0 ? "#22c55e" : "#ef4444",
          },
        })),
        label: {
          show: true,
          position: (params) => (params.value >= 0 ? "top" : "bottom"),
          fontWeight: 600,
          formatter: (p) => {
            const isLast = p.dataIndex === chartData.length - 1;
            return isLast ? `${p.value.toLocaleString()}%` : p.value.toLocaleString("en-IN", { style: "currency", currency: "INR" });
          },
        },
      },
    ],
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
        title="Profit and Loss Report"
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
              height: "460px",
            }}
          >
            Select an order to view the Profit and Loss report
          </Box>
        ) : isLoading ? (
          <Box sx={{ textAlign: "center", py: 8, height: "460px" }}>
            Loading...
          </Box>
        ) : (
          <>
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
                style={{ height: "440px", cursor: "default" }}
              />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfitLossReport;

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, useTheme, Box } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { useGetProductionQuery } from "../../../redux/service/production";

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
    if (new Date(value) < new Date(fromDate)) {
      return;
    }

    setToDate(value);
  };

  /* ---------------- GROUP PROCESS DATA ---------------- */

  const processData = useMemo(() => {
    if (!response?.data) return [];

    const grouped = {};

    response.data.forEach((item) => {
      const process = item.PROCESSNAME || "OTHERS";

      if (!grouped[process]) {
        grouped[process] = 0;
      }

      grouped[process] += Number(item.QTY || 0);
    });

    return Object.keys(grouped).map((key) => ({
      processName: key,
      qty: grouped[key],
    }));
  }, [response]);

  /* ---------------- CHART DATA ---------------- */

  const categories = processData.map((x) => x.processName);

  const qtyData = processData.map((x) => ({
    value: x.qty,
    itemStyle: {
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      borderRadius: [8, 8, 0, 0],
    },
  }));

  /* ---------------- CHART OPTIONS ---------------- */

  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },

    toolbox: {
      right: 10,
      top: 0,
      feature: {
        saveAsImage: {
          show: true,
        },
      },
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

      axisTick: {
        alignWithLabel: true,
      },

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

      axisLabel: {
        formatter: "{value}",
      },
    },

    series: [
      {
        name: "Production Qty",
        type: "bar",

        barWidth: "45%",

        data: qtyData,

        label: {
          show: true,
          position: "top",
          fontSize: 11,
          fontWeight: 700,
          color: "#111827",

          formatter: (params) => {
            return Number(params.value).toLocaleString("en-IN");
          },
        },

        emphasis: {
          focus: "series",
        },
      },
    ],
  };

  /* ---------------- RENDER ---------------- */

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
        title="Production Process Status"
        titleTypographyProps={{
          sx: {
            fontSize: ".95rem",
            fontWeight: 700,
          },
        }}
        action={
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <input
              type="date"
              value={fromDate}
              max={toDate}
              onChange={(e) => handleFromDateChange(e.target.value)}
              style={{
                fontSize: "11px",
                padding: "3px 8px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
              }}
            />

            <input
              type="date"
              value={toDate}
              min={fromDate}
              onChange={(e) => handleToDateChange(e.target.value)}
              style={{
                fontSize: "11px",
                padding: "3px 8px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
              }}
            />
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
            style={{
              height: 450,
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProductionStatus;

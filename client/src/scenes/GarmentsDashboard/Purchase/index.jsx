import React, { useMemo, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { push } from "../../../redux/features/opentabs";
import { useGetsallastmonthQuery } from "../../../redux/service/misDashboardService";
import { useGetCombinedPurchaseOrderQuery } from "../../../redux/service/purchaseService";
import { setFilterBuyer } from "../../../redux/features/dashboardFiltersSlice";

const PurchaseIndex = ({
  filterBuyer,
  selectedYear,
  selectMonths,
  finYr,
  user,
  filterBuyerList,
  onMonthChange,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const poType = useSelector((state) => state.dashboardFilters.poType);

  /* ---------------- YEAR HANDLING ---------------- */
  const filterYear = useMemo(() => {
    if (!selectedYear) return "";
    return typeof selectedYear === "object"
      ? selectedYear.finYr || selectedYear.name
      : selectedYear;
  }, [selectedYear]);

  const previousYear = useMemo(() => {
    if (!filterYear) return "";
    const [start, end] = filterYear.split("-").map(Number);
    return `${String(start - 1).padStart(2, "0")}-${String(end - 1).padStart(2, "0")}`;
  }, [filterYear]);

  /* ---------------- FETCH DATA ---------------- */
  const {
    data: response,
    isLoading,
    isError,
  } = useGetCombinedPurchaseOrderQuery(
    { params: { filterYear } },
    { skip: !filterYear },
  );

  const responseData = response?.data ?? [];

  /* ---------------- LAST MONTH AUTO SET ---------------- */
  // const { data: lastmonth } = useGetsallastmonthQuery();
  let lastmonth;
  const Year = lastmonth?.data?.find((x) => x.Year);

  useEffect(() => {
    if (Year?.month && !selectMonths) {
      onMonthChange(Year.month);
    }
  }, [Year, selectMonths, onMonthChange]);

  /* ---------------- HELPER FUNCTIONS ---------------- */
  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatShortINR = (value) => {
    const num = Number(value);
    if (num >= 1e7) return `₹ ${(num / 1e7).toFixed(1)} Cr`;
    if (num >= 1e5) return `₹ ${(num / 1e5).toFixed(1)} L`;
    if (num >= 1e3) return `₹ ${(num / 1e3).toFixed(1)} K`;
    return formatINR(num);
  };

  /* ---------------- PREPARE CHART DATA ---------------- */
const chartData = useMemo(() => {
  return responseData
    ?.filter((item) => item.COMPCODE !== "PSS") // ❌ remove PSS
    .sort((a, b) => a.COMPCODE.localeCompare(b.COMPCODE));
}, [responseData]);

  const companies = chartData.map((x) => x.COMPCODE);
  const companypurchaseValue = chartData.map((x) => x.VAL);
  const overallTurnover = companypurchaseValue.reduce(
    (sum, val) => sum + val,
    0,
  );

  /* ---------------- HIGHCHARTS OPTIONS ---------------- */
  const options = {
    chart: { type: "column", height: 233 },
    title: { text: null },
    xAxis: {
      categories: companies,
      crosshair: true,
      labels: { style: { fontSize: "13px" } },
    },
    yAxis: { min: 0, title: { text: "Purchase Value" } },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter() {
        const val = Number(this.y);
        let formatted;
        if (val >= 1e7) formatted = `₹ ${(val / 1e7).toFixed(1)} Cr`;
        else if (val >= 1e5) formatted = `₹ ${(val / 1e5).toFixed(1)} L`;
        else if (val >= 1e3) formatted = `₹ ${(val / 1e3).toFixed(1)} K`;
        else
          formatted = `₹ ${val.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
        return `<b>${this.x}</b><br/>Purchase: ${formatted}`;
      },
    },
    plotOptions: {
      column: {
        borderRadius: 5,
        pointPadding: 0.2,
        groupPadding: 0.1,
        minPointLength: 20,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          formatter() {
            return formatShortINR(this.y);
          },
          style: { fontSize: "9px" },
        },
        point: {
          events: {
            click() {
              const companyName = chartData[this.index]?.COMPCODE;
              dispatch(setFilterBuyer(companyName));
              dispatch(
                push({
                  id: `Purchase`,
                  name: "Purchase",
                  component: "PurchaseHome",
                  data: {
                    companyName,
                    selectedYear,
                    filterBuyer,
                    user,
                    selectMonths,
                    filterBuyerList,
                    finYr,
                    poType,
                  },
                }),
              );
            },
          },
        },
      },
    },
    series: [
      { name: "Purchase", data: companypurchaseValue, colorByPoint: true },
    ],
    legend: { enabled: false },
    credits: { enabled: false },
  };

  /* ---------------- RENDER ---------------- */
  if (isLoading) {
    return (
      <Card sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Card>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        Error: Failed to load data
      </Typography>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
      <CardHeader
        title="Purchase"
        titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
        sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
        <Box
          sx={{
            bgcolor: "background.default",
            borderRadius: 3,
            textAlign: "center",
            border: `1px solid ${theme.palette.divider}`,
            p: 1,
            mt: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Overall Purchase: {formatINR(overallTurnover)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PurchaseIndex;

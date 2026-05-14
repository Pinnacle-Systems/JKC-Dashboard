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
import { useGetOrderEntryCountQuery } from "../../../redux/service/OrderEntry";
import { setFilterBuyer } from "../../../redux/features/dashboardFiltersSlice";

const OrderEntryIndex = ({
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

  /* ---------------- FETCH DATA ---------------- */
  const {
    data: response,
    isLoading,
    isError,
  } = useGetOrderEntryCountQuery(
    { params: { selectedYear: filterYear } },
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
    return responseData?.filter((item) => item.compCode !== "PSS");
    // return responseData;
    // ?.sort((a, b) => a?.compCode?.localeCompare(b.compCode));
  }, [responseData]);

  const companies = chartData.map((x) => x.compCode); // ✅ updated
  const companypurchaseValue = chartData.map((x) => x.completed); // ✅ updated
  const overallTurnover = companypurchaseValue.reduce(
    (sum, val) => sum + val,
    0,
  );

  /* ---------------- HIGHCHARTS OPTIONS ---------------- */
  // const options = {
  //   chart: { type: "column", height: 288 },
  //   title: { text: null },
  //   xAxis: {
  //     categories: companies,
  //     crosshair: true,
  //     labels: { style: { fontSize: "13px" } },
  //   },
  //   yAxis: { min: 0, title: { text: "Internal Order Entry" } },
  //   tooltip: {
  //     shared: true,
  //     useHTML: true,
  //     formatter() {
  //       const val = Number(this.y);

  //       return `<b>${this.x}</b><br/>Internal Order Entry: ${val}`;
  //     },
  //   },
  //   plotOptions: {
  //     column: {
  //       borderRadius: 5,
  //       pointPadding: 0.2,
  //       groupPadding: 0.1,
  //       minPointLength: 20,
  //       cursor: "pointer",
  //       dataLabels: {
  //         enabled: true,
  //         formatter() {
  //           return this.y;
  //         },
  //         style: { fontSize: "9px" },
  //       },
  //       point: {
  //         events: {
  //           click() {
  //             const companyName = chartData[this.index]?.compCode;
  //             dispatch(setFilterBuyer(companyName));
  //             dispatch(
  //               push({
  //                 id: `OrderEntry`,
  //                 name: "OrderEntry",
  //                 component: "OrderEntryHome",
  //                 data: {
  //                   companyName,
  //                   selectedYear,
  //                   filterBuyer,
  //                   user,
  //                   selectMonths,
  //                   filterBuyerList,
  //                   finYr,
  //                   poType,
  //                 },
  //               }),
  //             );
  //           },
  //         },
  //       },
  //     },
  //   },
  //   series: [
  //     { name: "Order Entry", data: companypurchaseValue, colorByPoint: true },
  //   ],
  //   legend: { enabled: false },
  //   credits: { enabled: false },
  // };
  const options = {
    chart: {
      type: "pie",
      height: 288,
    },
    colors: ["#22c55e", "#ef4444", "#f59e0b", "#8b5cf6"],
    title: {
      text: null,
    },

    tooltip: {
      pointFormatter() {
        return `<br/>Orders:  ${this.y.toLocaleString("en-IN")}`;
      },
    },

    plotOptions: {
      pie: {
        innerSize: "60%", // 🔥 makes it donut
        borderRadius: 6,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          formatter() {
            return `${this.point.name}: ${this.y}`;
          },
          style: { fontSize: "10px" },
        },
        point: {
          events: {
            click() {
              const companyName = this.name;

              dispatch(setFilterBuyer(companyName));
              dispatch(
                push({
                  id: `OrderEntry`,
                  name: "OrderEntry",
                  component: "OrderEntryHome",
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
      {
        name: "Order Entry",
        data: chartData.map((x) => ({
          name: x.compCode,
          y: Number(x.completed || 0),
        })),
      },
    ],

    legend: {
      enabled: true,
      align: "center",
      verticalAlign: "bottom",
    },

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

  // if (isError) {
  //   return (
  //     <Typography color="error" sx={{ p: 2 }}>
  //       Error: Failed to load data
  //     </Typography>
  //   );
  // }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
      <CardHeader
        title="Order Entry"
        titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
        sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
};

export default OrderEntryIndex;

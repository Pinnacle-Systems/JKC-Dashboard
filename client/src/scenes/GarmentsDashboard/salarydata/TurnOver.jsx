import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  Typography,
  useTheme,
  CircularProgress,
  CardContent,
  CardHeader,
  Box,
} from "@mui/material";
import { useGetMisDashboardQuery } from "../../../redux/service/misDashboardServiceERP";
import { useGetsallastmonthQuery } from "../../../redux/service/misDashboardService";
import { useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { push } from "../../../redux/features/opentabs";

import { setFilterBuyer } from "../../../redux/features/dashboardFiltersSlice";

const TurnOver = ({
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
  const formatINR = (value) => `₹ ${Number(value).toLocaleString("en-IN")}`;

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
    return `${String(start - 1).padStart(2, "0")}-${String(end - 1).padStart(
      2,
      "0",
    )}`;
  }, [filterYear]);

  /* ---------------- API ---------------- */
  const {
    data: turnOverData,
    isLoading,
    isError,
    error,
  } = useGetMisDashboardQuery(
    { params: { filterYear, previousYear } },
    { skip: !filterYear },
  );

  // const { data: lastmonth } = useGetsallastmonthQuery();
let lastmonth;

  const Year = lastmonth?.data?.find((x) => x.Year);

  /* ---------------- MONTH AUTO SET ---------------- */
  useEffect(() => {
    if (Year?.month && !selectMonths) {
      onMonthChange(Year.month);
    }
  }, [Year, selectMonths, onMonthChange]);

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
        Error: {error?.message || "Failed to load data"}
      </Typography>
    );
  }

  const companies =
    turnOverData?.data?.totalTurnOver?.map((x) => x.company) ?? [];
  const companyTurnover =
    turnOverData?.data?.totalTurnOver?.map((x) => x.currentValue) ?? [];

  const overallTurnover = companyTurnover.reduce((sum, val) => sum + val, 0);

  /* ---------------- CHART ---------------- */
  const options = {
    chart: { type: "area", height: 250 },
    title: { text: null },
    xAxis: { categories: companies },
    yAxis: {
      title: { text: "Turnover Value" },
      labels: {
        formatter() {
          return formatINR(this.value);
        },
      },
    },
    tooltip: {
      formatter() {
        return `<b>${this.x}</b><br/>${formatINR(this.y)}`;
      },
    },

    plotOptions: {
      series: {
        cursor: "pointer",
        point: {
          events: {
            click: function () {
              const companyName = companies[this.index];
              dispatch(setFilterBuyer(companyName)); // update dropdown in TurnOverIndex

              dispatch(
                push({
                  // id: `TurnOver-${companyName}`,
                  id: `TurnOver`,
                  name: "TurnOver",
                  component: "TurnOverIndex",
                  data: {
                    companyName,
                    selectedYear,
                    filterBuyer,
                    user,
                    selectMonths,
                    filterBuyerList,
                    finYr,
                  },
                }),
              );
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter() {
            return formatINR(this.y);
          },
        },
      },
    },
    series: [
      {
        name: "Company Turnover",
        data: companyTurnover,
        color: "#1976d2",
      },
    ],
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
      <CardHeader
        title="Turn Over"
        titleTypographyProps={{
          sx: { fontSize: "1rem", fontWeight: 600 },
        }}
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
            // mt: 2,
            p: 1,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Overall Turnover: {formatINR(overallTurnover)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TurnOver;

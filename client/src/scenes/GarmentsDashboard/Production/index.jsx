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

const ProductionIndex = ({
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
  const { data: response, isLoading } = useGetOrderEntryCountQuery(
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

  /* ---------------- PREPARE CHART DATA ---------------- */
  const chartData = useMemo(() => {
    return responseData?.filter((item) => item.compCode !== "PSS");
    // return responseData;
    // return responseData;
    // ?.sort((a, b) => a?.compCode?.localeCompare(b.compCode));
  }, [responseData]);

  const companies = chartData.map((x) => x.compCode); // ✅ updated
  const companypurchaseValue = chartData.map((x) => x.completed); // ✅ updated
  const overallTurnover = companypurchaseValue.reduce(
    (sum, val) => sum + val,
    0,
  );

  const options = {
    chart: {
      type: "bar",
      height: 288,
    },
    colors: ["#ef4444", "#f59e0b", "#8b5cf6", "#22c55e"],
    title: {
      text: null,
    },
    xAxis: {
      categories: companies,
      title: {
        text: "Company",
      },
    },

    yAxis: {
      title: {
        text: "Production",
      },
    },

    tooltip: {
      pointFormatter() {
        return `Production: ${this.y.toLocaleString("en-IN")}`;
      },
    },

    plotOptions: {
      bar: {
        borderRadius: 5,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
        },
        point: {
          events: {
            click() {
              const companyName = this.category;

              dispatch(setFilterBuyer(companyName));

              dispatch(
                push({
                  id: `Production`,
                  name: "Production",
                  component: "Production",
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
        name: "Production",
        // data: chartData.map((x) => ({
        //   name: x.compCode,
        //   y: Number(x.completed || 0),
        // })),
        data: companypurchaseValue,
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

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
      <CardHeader
        title="Production"
        titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
        sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
};

export default ProductionIndex;

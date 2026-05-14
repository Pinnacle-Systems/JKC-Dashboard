import React, { useMemo, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { push } from "../../../redux/features/opentabs";
import { setFilterBuyer } from "../../../redux/features/dashboardFiltersSlice";
import { useGetOrderEntryCountQuery } from "../../../redux/service/OrderEntry";

const FabricIndex = ({
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
    {
      params: {
        selectedYear: filterYear,
      },
    },
    {
      skip: !filterYear,
    },
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

  /* ---------------- PREPARE CHART DATA ---------------- */

  const chartData = useMemo(() => {
    return responseData?.filter((item) => item.compCode !== "PSS");
  }, [responseData]);

  const overallTurnover = chartData.reduce(
    (sum, item) => sum + Number(item.completed || 0),
    0,
  );

  /* ---------------- CHART OPTIONS ---------------- */

  const options = {
    chart: {
      type: "pie",
      height: 288,
      backgroundColor: "transparent",
    },

    title: {
      text: null,
    },

    colors: [
      "#f59e0b",
      "#8b5cf6",
      "#22c55e",
      "#3b82f6",
      "#ec4899",
      "#14b8a6",
      "#f97316",
    ],

    tooltip: {
      pointFormat:
        "<b>{point.y}</b> Orders <br/> Total: <b>{point.percentage:.1f}%</b>",
    },

    plotOptions: {
      pie: {
        innerSize: "72%", // makes it donut
        borderWidth: 0,
        cursor: "pointer",

        slicedOffset: 8,

        dataLabels: {
          enabled: true,
          distance: 10,
          format: "{point.name}<br/><b>{point.y}</b>",
          style: {
            fontSize: "10px",
            fontWeight: "500",
            textOutline: "none",
          },
        },

        showInLegend: true,

        point: {
          events: {
            click() {
              const companyName = this.name;

              dispatch(setFilterBuyer(companyName));

              dispatch(
                push({
                  id: "FabricStatus",
                  name: "FabricStatus",
                  component: "FabricStatus",
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
        name: "Fabric Status",
        size: "100%",
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
      itemStyle: {
        fontSize: "11px",
      },
    },

    credits: {
      enabled: false,
    },
  };

  /* ---------------- LOADING ---------------- */

  if (isLoading) {
    return (
      <Card sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Card>
    );
  }

  /* ---------------- RENDER ---------------- */

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 4,
        width: "100%",
        ml: 1,
      }}
    >
      <CardHeader
        title={`Fabric Status `}
        titleTypographyProps={{
          sx: {
            fontSize: "1rem",
            fontWeight: 600,
          },
        }}
        sx={{
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
      />

      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
};

export default FabricIndex;

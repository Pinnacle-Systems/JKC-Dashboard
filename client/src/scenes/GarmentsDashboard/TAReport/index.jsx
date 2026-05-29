import React, { useMemo, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highcharts3D from "highcharts/highcharts-3d"; // ← add this
import {
  Card,
  CardHeader,
  CardContent,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { push } from "../../../redux/features/opentabs";
import { useGetTaReportOrderCountQuery } from "../../../redux/service/tareport.service";
import { setFilterBuyer } from "../../../redux/features/dashboardFiltersSlice";

Highcharts3D(Highcharts); // ← initialize 3D module

const TAReportIndex = ({
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
  const { data: response, isLoading } = useGetTaReportOrderCountQuery(
    { params: { selectedYear: filterYear } },
    { skip: !filterYear },
  );

  const responseData = response?.data ?? [];

  /* ---------------- LAST MONTH AUTO SET ---------------- */
  let lastmonth;
  const Year = lastmonth?.data?.find((x) => x.Year);
  useEffect(() => {
    if (Year?.month && !selectMonths) {
      onMonthChange(Year.month);
    }
  }, [Year, selectMonths, onMonthChange]);

  /* ---------------- AGGREGATE: count orderNos per compcode ---------------- */
  const pieData = useMemo(() => {
    const countMap = {};
    responseData.forEach((item) => {
      const code = item.compcode || "UNKNOWN";
      countMap[code] = (countMap[code] || 0) + 1;
    });

    const colors = ["#ec4899"];
    return Object.entries(countMap).map(([compcode, count], i) => ({
      name: compcode,
      y: count,
      color: colors[i % colors.length],
    }));
  }, [responseData]);

  /* ---------------- CHART OPTIONS ---------------- */
  const options = {
    chart: {
      type: "pie",
      height: 288,
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
    },
    title: { text: null },
    tooltip: {
      pointFormatter() {
        return `<b>${this.name}</b><br/>Orders: <b>${this.y}</b> (${this.percentage.toFixed(1)}%)`;
      },
    },
    plotOptions: {
      pie: {
        depth: 35,
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          formatter() {
            return `<b>${this.point.name}</b><br/>${this.y} Orders`;
          },
          style: { fontSize: "11px" },
        },
        point: {
          events: {
            click() {
              const companyName = this.name; // compcode e.g. "JKC"
              dispatch(setFilterBuyer(companyName));
              dispatch(
                push({
                  id: `T&A Delay Report`,
                  name: "T&A Delay Report",
                  component: "T&A Delay Report",
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
        name: "Orders",
        data: pieData,
      },
    ],
    legend: { enabled: true, align: "center", verticalAlign: "bottom" },
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
        title="T&A  Delay Report"
        titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
        sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
};

export default TAReportIndex;

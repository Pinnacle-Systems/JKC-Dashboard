import React, { useMemo, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highcharts3D from "highcharts/highcharts-3d";
import {
  Card,
  CardHeader,
  CardContent,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { push } from "../../../redux/features/opentabs";
import {
  useGetTaReportOrderCountQuery,
  useGetTaReportOrderMdCountQuery,
} from "../../../redux/service/tareport.service";
import { setFilterBuyer } from "../../../redux/features/dashboardFiltersSlice";

Highcharts3D(Highcharts);

const REPORT_TYPES = {
  TA_REPORT: "ta_report",
  TA_MD_REPORT: "ta_md_report",
};

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

  /* ---------------- REPORT TYPE STATE ---------------- */
  const [reportType, setReportType] = useState(REPORT_TYPES.TA_REPORT);

  /* ---------------- YEAR HANDLING ---------------- */
  const filterYear = useMemo(() => {
    if (!selectedYear) return "";
    return typeof selectedYear === "object"
      ? selectedYear.finYr || selectedYear.name
      : selectedYear;
  }, [selectedYear]);

  /* ---------------- FETCH DATA (both queries always called to satisfy hooks rules) ---------------- */
  const { data: response, isLoading: isLoadingTaReport } =
    useGetTaReportOrderCountQuery(
      { params: { selectedYear: filterYear } },
      { skip: !filterYear || reportType !== REPORT_TYPES.TA_REPORT },
    );

  const { data: responses, isLoading: isLoadingMdReport } =
    useGetTaReportOrderMdCountQuery(
      { params: { filterBuyer } },
      { skip: reportType !== REPORT_TYPES.TA_MD_REPORT },
    );

  const isLoading =
    reportType === REPORT_TYPES.TA_REPORT
      ? isLoadingTaReport
      : isLoadingMdReport;

  /* ---------------- ACTIVE DATA based on selected report type ---------------- */
  const activeData = useMemo(() => {
    if (reportType === REPORT_TYPES.TA_REPORT) {
      return response?.data ?? [];
    }
    // TA MD Report: data has { compcode, count } shape
    return responses?.data ?? [];
  }, [reportType, response, responses]);

  /* ---------------- LAST MONTH AUTO SET ---------------- */
  let lastmonth;
  const Year = lastmonth?.data?.find((x) => x.Year);
  useEffect(() => {
    if (Year?.month && !selectMonths) {
      onMonthChange(Year.month);
    }
  }, [Year, selectMonths, onMonthChange]);

  /* ---------------- AGGREGATE pie data ---------------- */
  const pieData = useMemo(() => {
    if (reportType === REPORT_TYPES.TA_REPORT) {
      // Original logic: count orderNos per compcode from raw rows
      const countMap = {};
      activeData.forEach((item) => {
        const code = item.compcode || "UNKNOWN";
        countMap[code] = (countMap[code] || 0) + 1;
      });
      const colors = ["#ec4899", "#6366f1", "#f59e0b", "#10b981", "#3b82f6"];
      return Object.entries(countMap).map(([compcode, count], i) => ({
        name: compcode,
        y: count,
        color: colors[i % colors.length],
      }));
    } else {
      // TA MD Report: API already returns { compcode, count }
      const colors = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];
      return activeData.map((item, i) => ({
        name: item.compcode || "UNKNOWN",
        y: item.count || 0,
        color: colors[i % colors.length],
      }));
    }
  }, [activeData, reportType]);

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
              const companyName = this.name;
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
                    reportType,
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
        title="T&A Report"
        titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
        action={
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-52"
          >
            <option value={REPORT_TYPES.TA_REPORT}>T&A Report</option>
            <option value={REPORT_TYPES.TA_MD_REPORT}>T&A MD Report</option>
          </select>
        }
        sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
};

export default TAReportIndex;

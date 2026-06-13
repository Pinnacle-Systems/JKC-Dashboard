import React, { useState, useEffect } from "react";
import { useGetAttendenceDistributionCountQuery } from "../../../redux/service/attendenceReport";
import ReactApexcharts from "react-apexcharts";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import AttendenceDistributionTable from "./TableData/AttendenceDistributionTable";

/* ── Map x-axis category label → backend statusFilter value ── */
const CATEGORY_TO_STATUS = {
  Present: "PRESENT",
  "On Duty": "ONDUTY",
  Absent: "ABSENT",
  "Week Off": "WEEKOFF",
};

/* ── Map series index → backend gender value ── */
const SERIES_TO_PAYTYPE = {
  0: "ALL",
  1: "STAFF",
  2: "LABOUR",
};

const AttendenceReport = ({ companyName, date }) => {
  const theme = useTheme();
  const [filterCategory, setFilterCategory] = useState("All");
  const [company, setCompany] = useState(companyName);
  const [selectedDate, setSelectedDate] = useState(date);

  useEffect(() => {
    setCompany(companyName);
  }, [companyName]);
  useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  /* tableConfig = null | { statusFilter, gender } */
  const [tableConfig, setTableConfig] = useState(null);

  const {
    data: attendenceData,
    isLoading,
    error,
  } = useGetAttendenceDistributionCountQuery(
    { params: { company: companyName, date } },
    { skip: !companyName || !date },
  );

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 5 }}>
        <Typography color="error">Failed to load attendance data.</Typography>
      </Box>
    );
  }

  const attendance = attendenceData?.data || {};

  const allCategories = ["Present", "On Duty", "Absent", "Week Off"];
  const totalData = [
    attendance.PRESENT_COUNT || 0,
    attendance.ONDUTY_COUNT || 0,
    attendance.ABSENT_COUNT || 0,
    attendance.WEEKOFF_COUNT || 0,
  ];
  const staffData = [
    attendance.PRESENT_STAFF || 0,
    attendance.ONDUTY_STAFF || 0,
    attendance.ABSENT_STAFF || 0,
    attendance.WEEKOFF_STAFF || 0,
  ];

  const labourData = [
    attendance.PRESENT_LABOUR || 0,
    attendance.ONDUTY_LABOUR || 0,
    attendance.ABSENT_LABOUR || 0,
    attendance.WEEKOFF_LABOUR || 0,
  ];

  let filteredCategories = allCategories;
  let filteredTotalData = totalData;
  let filteredStaffData = staffData;
  let filteredLabourData = labourData;

  if (filterCategory !== "All") {
    const idx = allCategories.indexOf(filterCategory);
    if (idx !== -1) {
      filteredCategories = [allCategories[idx]];
      filteredTotalData = [totalData[idx]];
      filteredStaffData = [staffData[idx]];
      filteredLabourData = [labourData[idx]];
    }
  }

  /* ── Bar click handler ── */
  const handleBarClick = (_event, _chartContext, config) => {
    const catLabel = filteredCategories[config.dataPointIndex];
    if (!catLabel) return;

    const statusFilter = CATEGORY_TO_STATUS[catLabel] || "ALL";
    const payType = SERIES_TO_PAYTYPE[config.seriesIndex] ?? "ALL";

    setTableConfig({ statusFilter, payType });
  };

  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: true },
      events: { dataPointSelection: handleBarClick },
    },
    plotOptions: {
      bar: { borderRadius: 4, columnWidth: "55%", cursor: "pointer" },
    },
    colors: [theme.palette.success.main, "#1976d2", "#e91e63"],
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        if (val === 0) return "";
        return opts.w.globals.seriesNames[opts.seriesIndex] + ": " + val;
      },
      style: { fontSize: "10px", colors: ["#fff"] },
    },
    legend: { show: false },
    xaxis: {
      categories: filteredCategories,
      labels: { style: { fontSize: "13px", fontWeight: 600 } },
    },
    yaxis: { title: { text: "Number of Employees" } },
    fill: { opacity: 1 },
    tooltip: { y: { formatter: (val) => `${val} employees` } },
    states: {
      hover: { filter: { type: "lighten", value: 0.15 } },
      active: { filter: { type: "darken", value: 0.2 } },
    },
  };

  const chartSeries = [
    { name: "All", data: filteredTotalData },
    { name: "Staff", data: filteredStaffData },
    { name: "Labour", data: filteredLabourData },
  ];

  return (
    <>
      <Card
        sx={{
          mt: 1,
          ml: 1,
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          borderRadius: 3,
        }}
      >
        <CardHeader
          title="Attendance Distribution"
          titleTypographyProps={{
            sx: { fontSize: ".9rem", fontWeight: 700, color: "#1e293b" },
          }}
          action={
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Present">Present</option>
              <option value="On Duty">On Duty</option>
              <option value="Absent">Absent</option>
              <option value="Week Off">Week Off</option>
            </select>
          }
          sx={{
            p: 1,
            height: 40,
            borderBottom: `2px solid ${theme.palette.divider}`,
          }}
        />
        <CardContent>
          {/* <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            Click any bar to view employee details
          </Typography> */}
          <Box sx={{ height: 350, mt: 1 }}>
            <ReactApexcharts
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height="100%"
            />
          </Box>
        </CardContent>
      </Card>

      {/* ── Detail Table (opens on bar click) ── */}
      {tableConfig && (
        <AttendenceDistributionTable
          compCode={company}
          date={selectedDate}
          statusFilter={tableConfig.statusFilter}
          payType={tableConfig.payType}
          closeTable={() => setTableConfig(null)}
        />
      )}
    </>
  );
};

export default AttendenceReport;

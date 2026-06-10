import React, { useState, useEffect } from "react";
import { useGetAttendenceDesignationCountQuery } from "../../../redux/service/attendenceReport";
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
import AttendenceDesignationTable from "./TableData/AttendenceDesignationTable";
import { Pagination } from "@mui/material";
/* ── Map x-axis category label → backend statusFilter value ── */
const CATEGORY_TO_STATUS = {
  Present: "PRESENT",
  "On Duty": "ONDUTY",
  Absent: "ABSENT",
  "Week Off": "WEEKOFF",
};

const AttendenceDesignationWise = ({ companyName, date }) => {
  const theme = useTheme();
  const [filterCategory, setFilterCategory] = useState("All");
  const [company, setCompany] = useState(companyName);
  const [selectedDate, setSelectedDate] = useState(date);

  const ITEMS_PER_PAGE = 10;

  const [page, setPage] = useState(1);

  useEffect(() => {
    setCompany(companyName);
  }, [companyName]);
  useEffect(() => {
    setSelectedDate(date);
  }, [date]);
  useEffect(() => {
    setPage(1);
  }, [filterCategory]);
  /* tableConfig = null | { statusFilter, gender } */
  const [tableConfig, setTableConfig] = useState(null);

  const {
    data: attendenceData,
    isLoading,
    error,
  } = useGetAttendenceDesignationCountQuery(
    { params: { company: companyName, date } },
    { skip: !companyName || !date },
  );
  console.log(attendenceData, "DesigData");

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

  const attendance = attendenceData?.data || [];

  const filteredData =
    filterCategory === "All"
      ? attendance
      : attendance.filter((row) => {
          switch (filterCategory) {
            case "Present":
              return row.PRESENT_COUNT > 0;
            case "Absent":
              return row.ABSENT_COUNT > 0;
            case "On Duty":
              return row.ONDUTY_COUNT > 0;
            case "Week Off":
              return row.WEEKOFF_COUNT > 0;
            default:
              return true;
          }
        });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const categories = paginatedData.map((item) => item.DESIGNATION);

  /* ── Bar click handler ── */
  const handleBarClick = (_event, _chartContext, config) => {
    const designation = paginatedData?.[config.dataPointIndex]?.DESIGNATION;

    const statusName = chartSeries?.[config.seriesIndex]?.name;

    if (!designation || !statusName) return;

    setTableConfig({
      designation,
      statusFilter: CATEGORY_TO_STATUS[statusName] || "ALL",
      gender: "ALL",
    });
  };

  const chartOptions = {
    chart: {
      type: "bar",
      // height: 380,
      zoom: { enabled: false },
      toolbar: { show: false },
      events: { dataPointSelection: handleBarClick },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%",
        borderRadius: 4,
      },
    },

    colors: ["#22c55e", "#dc2626", "#3b82f6", "#f59e0b"],

    dataLabels: {
      enabled: true,
      style: {
        fontSize: "10px",
        fontWeight: 600,
      },
    },

    // ✅ REMOVED legend
    legend: {
      show: false,
    },

    xaxis: {
      categories,
      position: "bottom", // ✅ back to bottom so labels sit under bars
      labels: {
        rotate: -10,
        rotateAlways: true,
        trim: false,
        hideOverlappingLabels: false,
        style: {
          fontSize: "10px",
          fontWeight: 700,
        },
      },
    },

    yaxis: {
      title: { text: "Employees" },
    },

    tooltip: {
      shared: true,
      intersect: false,
    },

    grid: {
      borderColor: theme.palette.divider,
    },
  };
  const chartSeries = [
    {
      name: "Present",
      data: paginatedData.map((item) => item.PRESENT_COUNT || 0),
    },
    {
      name: "Absent",
      data: paginatedData.map((item) => item.ABSENT_COUNT || 0),
    },
    {
      name: "On Duty",
      data: paginatedData.map((item) => item.ONDUTY_COUNT || 0),
    },
    {
      name: "Week Off",
      data: paginatedData.map((item) => item.WEEKOFF_COUNT || 0),
    },
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
          title="Attendance Designation Wise"
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
          <Box
            sx={{
              overflow: "hidden",
              mt: 1,
            }}
          >
            <Box
              sx={{
                // minWidth: `${Math.max(categories.length * 140, 1200)}px`,
                height: 420,
              }}
            >
              <ReactApexcharts
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height="100%"
              />
            </Box>
          </Box>

          <Box
            sx={{
              mt: 2,
              height: 50, // fixed reserved space
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {totalPages > 1 && (
              <Pagination
                page={page}
                count={totalPages}
                color="primary"
                onChange={(_, value) => setPage(value)}
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* ── Detail Table (opens on bar click) ── */}
      {tableConfig && (
        <AttendenceDesignationTable
          compCode={company}
          date={selectedDate}
          designation={tableConfig.designation}
          statusFilter={tableConfig.statusFilter}
          gender={tableConfig.gender}
          closeTable={() => setTableConfig(null)}
        />
      )}
    </>
  );
};

export default AttendenceDesignationWise;

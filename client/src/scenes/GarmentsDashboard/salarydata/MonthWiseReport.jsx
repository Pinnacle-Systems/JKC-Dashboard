import React, { useState, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  IconButton,
  useTheme,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useGetMisDashboardErpMonthWiseQuery } from "../../../redux/service/misDashboardServiceERP";
import MonthWiseTable from "../salarydata/TableData/MonthWiseTable";

const Form = ({ companyName, finYear, finYr, filterBuyerList }) => {
  const theme = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const { data: response, isLoading } =
    useGetMisDashboardErpMonthWiseQuery({
      params: { finYear, companyName },
    });

  const chartData = useMemo(() => {
    return Array.isArray(response?.data) ? response.data : [];
  }, [response?.data]);

  /* ---------------- Parent ---------------- */
  const categories = useMemo(
    () => chartData.map((i) => i.month),
    [chartData]
  );

  const seriesData = useMemo(
    () => chartData.map((i) => i.value),
    [chartData]
  );

  /* ---------------- Selected Month ---------------- */
  const selectedMonthData = useMemo(() => {
    return chartData.find((i) => i.month === selectedMonth);
  }, [selectedMonth, chartData]);

  /* ---------------- Parent Chart ---------------- */
  const parentOptions = useMemo(
    () => ({
      chart: { type: "spline", height: 430 },
      title: { text: "" },

      xAxis: { categories },
      yAxis: {
        title: { text: "Turnover" },
        labels: {
          formatter() {
            return formatINR(this.value);
          },
        },
      },


      plotOptions: {
        spline: {
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            formatter() {
              return formatINR(this.y);
            },
            style: {
              fontSize: "11px",
              fontWeight: "400",
              color: "#000",
            },
          },
          point: {
            events: {
              click() {
                setSelectedMonth(this.category);
              },
            },
          },
        },
      },

      tooltip: {
        formatter() {
          return `
                <b>${this.x}</b><br/>

          <b>${formatINR(this.y)}</b>`;
        },
      },


      series: [
        {
          name: "Turnover",
          data: seriesData,
          color: "#0088FE",
        },
      ],

      legend: { enabled: false },
      credits: { enabled: false },
    }),
    [categories, seriesData]
  );

  /* ---------------- Child Chart ---------------- */
  const childOptions = selectedMonthData && {
    chart: {
      type: "column", height: 320, spacingTop: 5,
      spacingBottom: 10,
      spacingLeft: 10,
      spacingRight: 10,
    },
    title: { text: "" },

    xAxis: {
      categories: [selectedMonth], offset: 0,
      lineWidth: 1,
    },
    yAxis: {
      title: { text: "Turnover" },
      labels: {
        formatter() {
          return formatINR(this.value);
        },
      },
    },
    tooltip: {
      formatter() {
        return `
      <b>${this.x}</b><br/>
      Turnover: <b>${formatINR(this.y)}</b>
    `;
      },
    },

    plotOptions: {
      column: {
        pointWidth: 40,        // 👈 MAIN control (reduce this)
        pointPadding: 0.2,
        groupPadding: 0.4,
        dataLabels: {
          enabled: true,
          formatter() {
            return formatINR(this.y);
          },
          style: {
            fontSize: "11px",
            fontWeight: "400",
            color: "#000",
          },
        },
        point: {
          events: {
            click() {
              setShowTable(true);   // 👈 OPEN TABLE HERE
            },
          },
        },
      },
    },



    series: [
      {
        name: "Turnover",
        data: [Number(selectedMonthData.value)],
        color: "#00C49F",
      },
    ],

    legend: { enabled: false },
    credits: { enabled: false },
  };

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Month Wise Turnover"
        titleTypographyProps={{
          sx: { fontSize: ".9rem", fontWeight: 600 },
        }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      // action={
      //   <Button
      //     variant="contained"
      //     size="small"
      //     color="primary"
      //     sx={{ mr: 2 }}
      //     onClick={() => {
      //       setShowTable(true);
      //     }}
      //   >
      //     View  Details
      //   </Button>
      // }
      />

      <CardContent>
        {isLoading ? (
          <Box sx={{ textAlign: "center", py: 5 }}>Loading...</Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              width: "100%",

              overflow: "hidden",
            }}
          >
            {/* Parent Chart */}
            <Box
              sx={{
                width: "70%",
                transition: "width 0.35s ease",
              }}
            >
              <HighchartsReact
                highcharts={Highcharts}
                options={parentOptions}
                immutable
              />
            </Box>

            {/* Child Chart (Always Mounted) */}
            <Box
              sx={{
                width: "30%",
                transition: "width 0.35s ease",
              }}
            >

              <Card sx={{ height: "100%", ml: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 1,
                    py: 0.5,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ fontWeight: 600 }}>
                    {selectedMonth || ""} Turnover Details
                  </Box>

                </Box>
                <CardContent>
                  {selectedMonth ? (
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={childOptions}
                      immutable
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 260,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "text.secondary",
                        fontSize: "0.85rem",
                      }}
                    >
                      Click a month to view details
                    </Box>
                  )}
                </CardContent>

              </Card>
            </Box>
          </Box>
        )}
      </CardContent>
      {showTable && (
        <MonthWiseTable
          companyName={companyName}
          filterBuyerList={filterBuyerList}
          finYr={finYr}
        month={selectedMonth}
          closeTable={() => setShowTable(false)}
        />
      )}
    </Card>
  );
};

export default Form;

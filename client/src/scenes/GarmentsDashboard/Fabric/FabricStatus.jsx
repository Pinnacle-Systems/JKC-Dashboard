import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  useTheme,
  Box,
  IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ReactECharts from "echarts-for-react";
import { useGetFabricStatusQuery } from "../../../redux/service/fabric";
import FabricStatusTable from "./TableData/FabricStatusTable";

const FabricStatus = ({ companyName, finYear, finYr }) => {
  const theme = useTheme();

  /* ---------------- DATE FORMAT ---------------- */

  const formatDate = (date) => {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${year}-${month}-${day}`;
  };

  /* ---------------- DEFAULT DATES ---------------- */

  const today = new Date();
  const previousWeek = new Date();

  previousWeek.setDate(today.getDate() - 6);

  const [fromDate, setFromDate] = useState(formatDate(previousWeek));
  const [toDate, setToDate] = useState(formatDate(today));

  /* ---------------- PAGINATION ---------------- */

  const [startIndex, setStartIndex] = useState(0);

  const itemsPerPage = 10;

  /* ---------------- DETAIL TABLE STATE ---------------- */

  const [tableParams, setTableParams] = useState(null);

  /* ---------------- FETCH DATA ---------------- */

  const { data: response, isLoading } = useGetFabricStatusQuery({
    params: {
      finyear: finYear,
    },
  });
  /* ---------------- DUMMY DATA FOR PAGINATION TEST ---------------- */

  console.log(response, "response");

  /* ---------------- BUYER CHART DATA ---------------- */

  const buyerData = useMemo(() => {
    if (!response?.data) return [];

    return response.data.map((item) => ({
      buyerName: item.BUYERNAME,
      buyerCode: item.BUYERCODE,
      inProgress: Number(item.INPROGRESS || 0),
      inHouse: Number(item.INHOUSE || 0),
    }));
  }, [response]);

  /* ---------------- PAGINATED DATA ---------------- */

  const paginatedData = useMemo(() => {
    return buyerData.slice(startIndex, startIndex + itemsPerPage);
  }, [buyerData, startIndex]);

  const hasNext = startIndex + itemsPerPage < buyerData.length;

  const hasPrev = startIndex > 0;

  const handleNext = () => {
    setStartIndex((prev) => prev + itemsPerPage);
  };

  const handlePrev = () => {
    setStartIndex((prev) => prev - itemsPerPage);
  };

  /* ---------------- CHART DATA ---------------- */

  const categories = paginatedData.map((x) => x.buyerName);

  const inProgressData = paginatedData.map((x) => ({
    value: x.inProgress,

    itemStyle: {
      color: "#ef4444", // RED
      borderRadius: [8, 8, 0, 0],
    },
  }));

  const inHouseData = paginatedData.map((x) => ({
    value: x.inHouse,

    itemStyle: {
      color: "#000000", // BLACK
      borderRadius: [8, 8, 0, 0],
    },
  }));

  /* ---------------- BAR CLICK HANDLER ---------------- */

  const onChartEvents = {
    click: (params) => {
      if (params.componentType !== "series") return;
      const clickedBuyer = paginatedData[params.dataIndex];

      // Map series name → status param
      const statusMap = {
        "In Progress": "INPROGRESS",
        "In House": "INHOUSE",
      };

      setTableParams({
        buyer: clickedBuyer.buyerName,
        buyerName: clickedBuyer.buyerName,
        initialStatus: statusMap[params.seriesName] || "ALL", // ← NEW
      });
    },
  };
  /* ---------------- CHART OPTIONS ---------------- */

  const options = {
    tooltip: {
      trigger: "axis",

      axisPointer: {
        type: "shadow",
      },
    },

    legend: {
      bottom: 0,
      left: "center",

      textStyle: {
        fontSize: 12,
        fontWeight: 600,
        color: "#374151",
      },

      data: [
        {
          name: "In Progress",
          icon: "roundRect",
        },
        {
          name: "In House",
          icon: "roundRect",
        },
      ],
    },

    toolbox: {
      right: 10,
      top: 0,

      feature: {
        saveAsImage: {
          show: true,
        },
      },
    },

    grid: {
      left: "3%",
      right: "3%",
      bottom: "22%",
      top: "15%",
      containLabel: true,
    },

    xAxis: {
      type: "category",
      data: categories,

      axisTick: {
        alignWithLabel: true,
      },

      axisLabel: {
        interval: 0,
        rotate: 20,
        fontSize: 11,
        fontWeight: 600,
        color: "#374151",
      },
    },

    yAxis: {
      type: "value",

      axisLabel: {
        formatter: "{value}",
      },
    },

    series: [
      {
        name: "In Progress",
        type: "bar",
        barWidth: "28%",
        data: inProgressData,
        cursor: "pointer",

        itemStyle: {
          color: "#ef4444", // RED
          borderRadius: [8, 8, 0, 0],
        },

        label: {
          show: true,
          position: "top",
          fontSize: 11,
          fontWeight: 700,
          color: "#111827",

          formatter: (params) => Number(params.value).toLocaleString("en-IN"),
        },

        emphasis: {
          focus: "series",

          itemStyle: {
            color: "#ef4444",
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0,0,0,0.25)",
          },
        },
      },

      {
        name: "In House",
        type: "bar",
        barWidth: "28%",
        data: inHouseData,
        cursor: "pointer",

        itemStyle: {
          color: "#000000", // BLACK
          borderRadius: [8, 8, 0, 0],
        },

        label: {
          show: true,
          position: "top",
          fontSize: 11,
          fontWeight: 700,
          color: "#111827",

          formatter: (params) => Number(params.value).toLocaleString("en-IN"),
        },

        emphasis: {
          focus: "series",

          itemStyle: {
            color: "#000000",
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0,0,0,0.25)",
          },
        },
      },
    ],
  };

  /* ---------------- RENDER ---------------- */
  return (
    <>
      <Card
        sx={{
          mt: 1,
          ml: 1,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        }}
      >
        <CardHeader
          title="Fabric Status Buyer Wise"
          titleTypographyProps={{
            sx: {
              fontSize: ".95rem",
              fontWeight: 700,
            },
          }}
          sx={{
            p: 1,
            borderBottom: `2px solid ${theme.palette.divider}`,
          }}
        />

        <CardContent>
          {isLoading ? (
            <Box sx={{ textAlign: "center", py: 10 }}>Loading...</Box>
          ) : (
            <Box position="relative">
              {/* PREVIOUS BUTTON */}

              {hasPrev && (
                <IconButton
                  onClick={handlePrev}
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    bgcolor: "background.paper",
                    boxShadow: 1,
                  }}
                >
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>
              )}

              <ReactECharts
                option={options}
                onEvents={onChartEvents}
                style={{
                  height: 450,
                  cursor: "pointer",
                }}
              />

              {/* NEXT BUTTON */}

              {hasNext && (
                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    bgcolor: "background.paper",
                    boxShadow: 1,
                  }}
                >
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* DETAIL TABLE MODAL */}

      {tableParams && (
        <FabricStatusTable
          companyName={companyName}
          finYear={finYear}
          finYr={finYr}
          buyer={tableParams.buyer}
          buyerName={tableParams.buyerName}
          buyerNames={buyerData.map((b) => b.buyerName)}
          initialStatus={tableParams.initialStatus} // ← NEW
          onClose={() => setTableParams(null)}
        />
      )}
    </>
  );
};

export default FabricStatus;

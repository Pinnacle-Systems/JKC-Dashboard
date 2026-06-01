import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, useTheme, Box } from "@mui/material";

import ReactECharts from "echarts-for-react";
import { useGetFabricPendingQuery } from "../../../redux/service/fabric";
import FabricPendingTable from "./TableData/FabricPendingTable";
import { useEffect } from "react";

const FabricPending = ({ companyName, finYear, finYr }) => {
  const theme = useTheme();

  /* ---------------- DATE FORMAT ---------------- */

  /* ---------------- PAGINATION ---------------- */

  const [selectedBuyer, setSelectedBuyer] = useState("");

  /* ---------------- DETAIL TABLE STATE ---------------- */
  const [tableParams, setTableParams] = useState(null);

  /* ---------------- FETCH DATA ---------------- */

  const { data: response, isLoading } = useGetFabricPendingQuery({
    params: {
      finyear: finYear,
    },
  });
  /* ---------------- DUMMY DATA FOR PAGINATION TEST ---------------- */
  const buyerOptions = useMemo(() => {
    if (!response?.data) return [];

    return [...new Set(response.data.map((item) => item.BUYERCODE))];
  }, [response]);
  useEffect(() => {
    if (buyerOptions.length && !selectedBuyer) {
      setSelectedBuyer(buyerOptions[0]);
    }
  }, [buyerOptions]);
  console.log(selectedBuyer, buyerOptions, "selectedBuyer");

  const buyerData = useMemo(() => {
    if (!response?.data || !selectedBuyer) return [];

    return response.data
      .filter((item) => item.BUYERCODE === selectedBuyer)
      .sort((a, b) => a.ORD - b.ORD)
      .map((item) => ({
        typeName: item.TYPENAME,
        buyerName: item.BUYERNAME,
        buyerCode: item.BUYERCODE,
        inProgress: Number(item.INPROGRESS || 0),
        inHouse: Number(item.INHOUSE || 0),
      }));
  }, [response, selectedBuyer]);

  /* ---------------- BAR CLICK HANDLER ---------------- */

  // FabricPending.jsx

  const onChartEvents = useMemo(
    () => ({
      // ← useMemo so it re-creates when deps change
      click: (params) => {
        if (params.componentType !== "series") return;

        const clickedItem = buyerData.find(
          (item) => item.typeName === params.name,
        );

        console.log("click fired", params.name, selectedBuyer, clickedItem); // debug

        setTableParams({
          typeName: params.name,
          buyerName: clickedItem?.buyerName ?? "",
          buyerCode: selectedBuyer, // ← now correctly captured
        });
      },
    }),
    [buyerData, selectedBuyer],
  );

  /* ---------------- CHART OPTIONS ---------------- */

  const pieData = buyerData.map((item, index) => ({
    name: item.typeName,
    value: item.inProgress,
    itemStyle: {
      color: [
        "rgb(239,68,68)", // red
        "rgb(34,197,94)", // green
        "rgb(59,130,246)", // blue
        "rgb(249,115,22)", // orange
        "rgb(234,179,8)", // yellow
      ][index % 5],
    },
  }));

  const options = {
    tooltip: {
      trigger: "item",
      formatter: "{b} <br/>In Progress : {c} ({d}%)",
    },

    legend: {
      show: false,
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

    series: [
      {
        name: "Fabric Pending",
        type: "pie",

        radius: ["35%", "70%"],

        center: ["50%", "50%"],

        data: pieData,

        roseType: "radius",

        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,

          shadowBlur: 20,
          shadowColor: "rgba(0,0,0,0.25)",
        },

        label: {
          show: true,
          formatter: "{b}\n{c}",
          fontSize: 11,
          fontWeight: 700,
          color: "#111827",
        },

        labelLine: {
          length: 15,
          length2: 10,
        },

        emphasis: {
          scale: true,
          scaleSize: 12,

          itemStyle: {
            shadowBlur: 30,
            shadowOffsetX: 0,
            shadowColor: "rgba(0,0,0,0.4)",
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
          title="Fabric Pending Status"
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
          action={
            <select
              value={selectedBuyer}
              onChange={(e) => setSelectedBuyer(e.target.value)}
              className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-24"
            >
              {buyerOptions.map((buyer) => (
                <option key={buyer} value={buyer}>
                  {buyer}
                </option>
              ))}
            </select>
          }
        />

        <CardContent>
          {isLoading ? (
            <Box sx={{ textAlign: "center", py: 10 }}>Loading...</Box>
          ) : (
            <Box position="relative">
              <ReactECharts
                key={selectedBuyer}
                option={options}
                onEvents={onChartEvents}
                style={{
                  height: 500,
                  cursor: "pointer",
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* DETAIL TABLE MODAL */}

      {tableParams && (
        <FabricPendingTable
          companyName={companyName}
          finYear={finYear}
          finYr={finYr} // pass finYr list from parent
          typeName={tableParams.typeName} // initial typeName from click
          buyerName={tableParams.buyerName}
          buyerCode={tableParams.buyerCode}
          buyerCodes={buyerOptions.map((buyer) => buyer)}
          onClose={() => setTableParams(null)}
        />
      )}
    </>
  );
};

export default FabricPending;

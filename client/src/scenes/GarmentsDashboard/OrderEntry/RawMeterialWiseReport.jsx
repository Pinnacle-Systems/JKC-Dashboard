// import { useEffect, useState } from "react";
// import { Box, Card, CardContent, CardHeader, useTheme } from "@mui/material";
// import HighchartsReact from "highcharts-react-official";
// import Highcharts from "highcharts";
// import { useGetRawMaterialWiseQuery } from "../../../redux/service/purchaseService";

// const RawMeterialWiseReport = ({
//   companyName,
//   finYear,
//   finYr,
//   filterBuyerList,
//   poType,
// }) => {
//   const [xdata, setXdata] = useState([]);
//   const [ydata, setYdata] = useState([]);
//   const theme = useTheme();
//   const [showTable, setShowTable] = useState(false);
//   const [selectedYear, setSelectedYear] = useState(null);

//   const { data: response, isLoading } = useGetRawMaterialWiseQuery({
//     params: { finYear, companyName },
//   });

// const formatINR = (value) =>
//   `₹ ${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

//   useEffect(() => {
//     if (response?.data) {
//       // Map TYPENAME to x-axis and VAL to y-axis
//       setXdata(response.data.map((item) => item.TYPENAME));
//       setYdata(response.data.map((item) => Number(item.VAL)));
//     }
//   }, [response]);

//   const colorArray = [
//     "#8A37DE",
//     "#005E72",
//     "#E5181C",
//     "#056028",
//     "#1F2937",
//     "#F44F5E",
//     "#E55A89",
//     "#D863B1",
//     "#CA6CD8",
//     "#B57BED",
//     "#8D95EB",
//     "#62ACEA",
//     "#4BC3E6",
//   ];

//   const options = {
//     chart: {
//       type: "column",
//       height: 380,
//       options3d: {
//         enabled: true,
//         alpha: 7,
//         beta: 7,
//         depth: 50,
//         viewDistance: 25,
//       },
//       backgroundColor: "#FFFFFF",
//       borderRadius: 10,
//     },
//     title: null,
//     legend: { enabled: false },
//     tooltip: {
//       headerFormat: "<b>{point.key}</b><br/>",
//       pointFormatter() {
//         return `Purchase: <b>${formatINR(this.y)}</b>`;
//       },
//       style: { fontSize: "12px", color: "black" },
//     },
//     xAxis: {
//       categories: xdata,
//       labels: { style: { fontSize: "11px", color: "#6B7280" } },
//       title: {
//         text: "Raw Material Type",
//         style: { fontSize: "12px", fontWeight: "bold", color: "#374151" },
//         margin: 30,
//       },
//     },
//     yAxis: {
//       title: {
//         text: "Purchase",
//         style: { fontSize: "12px", fontWeight: "bold", color: "#374151" },
//         margin: 25,
//       },
//       labels:{ enabled: false },
//     },
//     plotOptions: {
//       column: {
//         depth: 25,
//         colorByPoint: true,
//         borderRadius: 5,
//         dataLabels: {
//           enabled: true,
//           formatter() {
//             return formatINR(this.y);
//           },
//           style: { fontSize: "11px", color: "#333" },
//         },
//       },
//       series: {
//         point: {
//           events: {
//             click: function () {
//               setSelectedYear({
//                 year: this.category,
//               });
//               setShowTable(true);
//             },
//           },
//         },
//       },
//     },
//     colors: colorArray,
//     series: [
//       {
//         name: "Turnover",
//         data: ydata,
//       },
//     ],
//   };

//   return (
//     <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
//       <CardHeader
//         title="Raw Material Wise Purchase"
//         titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
//         sx={{
//           p: 1,
//           borderBottom: `2px solid ${theme.palette.divider}`,
//         }}
//       />
//       <CardContent>
//         {isLoading ? (
//           <div style={{ textAlign: "center", padding: "40px",height: 380 }}>Loading...</div>
//         ) : (
//           <HighchartsReact
//             highcharts={Highcharts}
//             options={options}
//             immutable
//           />
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default RawMeterialWiseReport;

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Box, Card, CardContent, CardHeader, useTheme } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { useGetRawMaterialWiseQuery } from "../../../redux/service/purchaseService";

const RawMeterialWiseReport = ({ companyName, finYear }) => {
  const theme = useTheme();
  const [showTable, setShowTable] = useState(false);
  const [tableParams, setTableParams] = useState(null);

  const { data: response, isLoading } = useGetRawMaterialWiseQuery({
    params: { finYear, companyName },
  });

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!Array.isArray(response?.data)) return [];
    return response.data.map((item) => ({
      name: item.TYPENAME,
      value: Number(item.VAL),
      rawData: item,
    }));
  }, [response]);

  // Handle slice click to open table
  const handleOpenTable = useCallback((point) => {
    setTableParams(point.rawData);
    setShowTable(true);
  }, []);

  const options = useMemo(
    () => ({
      tooltip: {
        trigger: "item",
        formatter: (params) => `
          <div>
            <b>${params.name}</b><br/>
            <span style="color:#1976d2;font-weight:600;">
              ${formatINR(params.value)}
            </span>
          </div>
        `,
      },
      backgroundColor:"white",
      legend: {
        bottom: 0,
        textStyle: { fontSize: 11 },
      },
      series: [
        {
          name: "Raw Material Purchase",
          type: "pie",
          radius: ["20%", "70%"],
          center: ["50%", "45%"],
          roseType: "radius", // 🌹 rose chart
          itemStyle: { borderRadius: 6 },
          label: {
            show: true,
            fontSize: 11,
            fontWeight:"bold",
            formatter: (params) =>
              `${params.name}\n${formatINR(params.value)}`,
          },
          data: chartData.sort((a, b) => a.value - b.value),
        },
      ],
    }),
    [chartData]
  );

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Raw Material Wise Purchase"
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent sx={{ position: "relative", height: 420 }}>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>
        ) : (
          <ReactECharts
            option={options}
            style={{ height: 380 }}
            onEvents={{
              click: (params) => handleOpenTable(params.data),
            }}
          />
        )}

     
      </CardContent>
    </Card>
  );
};

export default RawMeterialWiseReport;
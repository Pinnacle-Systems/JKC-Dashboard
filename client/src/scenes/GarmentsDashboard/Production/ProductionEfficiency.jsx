// import React, { useMemo, useState } from "react";
// import { Card, CardContent, CardHeader, useTheme, Box } from "@mui/material";
// import ReactECharts from "echarts-for-react";
// import { useGetProductionEfficiencyQuery } from "../../../redux/service/production";
// import ProductionDetailTable from "./TableData/ProductionDetailTable";

// const COLORS = {
//   CUTTING: "#22c55e",
//   CHECKING: "#3b82f6",
//   SINGER: "#f59e0b",
//   POWERTABLE: "#ef4444",
//   SEWING: "#8b5cf6",
// };

// const ProductionEfficiency = ({ companyName }) => {
//   const theme = useTheme();

//   const formatDate = (date) => {
//     const d = new Date(date);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${year}-${month}-${day}`;
//   };

//   const [date, setDate] = useState(formatDate(new Date()));
//   const [selectedProcess, setSelectedProcess] = useState("ALL");
//   const [tableParams, setTableParams] = useState(null);

//   const processOptions = [
//     { value: "ALL", label: "All" },
//     { value: "CUTTING", label: "Cutting" },
//     { value: "CHECKING", label: "Checking" },
//     { value: "SINGER", label: "Singer" },
//     { value: "POWER TABLE", label: "Power Table" },
//     { value: "SEWING", label: "Sewing" },
//   ];

//   const { data: response, isLoading } = useGetProductionEfficiencyQuery(
//     {
//       params: {
//         compCode: companyName,
//         date,
//         selectedProcess,
//       },
//     },
//     {
//       skip: !companyName || !date,
//     },
//   );

//   const chartData = useMemo(() => {
//     return response?.data || [];
//   }, [response]);

//   const categories = chartData.map((item) => item.UNIT);

//   const series =
//     selectedProcess === "ALL"
//       ? [
//           {
//             name: "CUTTING",
//             type: "bar",
//             barGap: 0,
//             data: chartData.map((x) => Number(x.CUTTING || 0)),
//             itemStyle: {
//               color: COLORS.CUTTING, // respective color
//               borderRadius: [8, 8, 0, 0],
//             },
//             label: {
//               show: true,
//               position: "top",
//               fontSize: 11,
//               fontWeight: 700,
//               color: "#111827",
//               formatter: (params) => {
//                 const value = Number(params.value || 0);
//                 return value > 0 ? value.toLocaleString("en-IN") : "";
//               },
//             },
//           },
//           {
//             name: "CHECKING",
//             type: "bar",
//             data: chartData.map((x) => Number(x.CHECKING || 0)),
//             itemStyle: { color: COLORS.CHECKING },
//             label: {
//               show: true,
//               position: "top",
//               fontSize: 11,
//               fontWeight: 700,
//               color: "#111827",
//               formatter: (params) => {
//                 const value = Number(params.value || 0);
//                 return value > 0 ? value.toLocaleString("en-IN") : "";
//               },
//             },
//           },
//           {
//             name: "SINGER",
//             type: "bar",
//             data: chartData.map((x) => Number(x.SINGER || 0)),
//             itemStyle: { color: COLORS.SINGER, borderRadius: [8, 8, 0, 0] },
//             label: {
//               show: true,
//               position: "top",
//               fontSize: 11,
//               fontWeight: 700,
//               color: "#111827",
//               formatter: (params) => {
//                 const value = Number(params.value || 0);
//                 return value > 0 ? value.toLocaleString("en-IN") : "";
//               },
//             },
//           },
//           {
//             name: "POWER TABLE",
//             type: "bar",
//             data: chartData.map((x) => Number(x.POWERTABLE || 0)),
//             itemStyle: { color: COLORS.POWERTABLE, borderRadius: [8, 8, 0, 0] },
//             label: {
//               show: true,
//               position: "top",
//               fontSize: 11,
//               fontWeight: 700,
//               color: "#111827",
//               formatter: (params) => {
//                 const value = Number(params.value || 0);
//                 return value > 0 ? value.toLocaleString("en-IN") : "";
//               },
//             },
//           },
//           {
//             name: "SEWING",
//             type: "bar",
//             data: chartData.map((x) => Number(x.SEWING || 0)),
//             itemStyle: { color: COLORS.SEWING, borderRadius: [8, 8, 0, 0] },
//             label: {
//               show: true,
//               position: "top",
//               fontSize: 11,
//               fontWeight: 700,
//               color: "#111827",
//               formatter: (params) => {
//                 const value = Number(params.value || 0);
//                 return value > 0 ? value.toLocaleString("en-IN") : "";
//               },
//             },
//           },
//         ]
//       : [
//           {
//             name: selectedProcess,
//             type: "bar",
//             data: chartData.map((x) => {
//               switch (selectedProcess) {
//                 case "CUTTING":
//                   return Number(x.CUTTING || 0);
//                 case "CHECKING":
//                   return Number(x.CHECKING || 0);
//                 case "SINGER":
//                   return Number(x.SINGER || 0);
//                 case "POWER TABLE":
//                   return Number(x.POWERTABLE || 0);
//                 case "SEWING":
//                   return Number(x.SEWING || 0);
//                 default:
//                   return 0;
//               }
//             }),
//             itemStyle: {
//               color: COLORS[selectedProcess.replace(" ", "")] || "#22c55e",
//             },
//             label: {
//               show: true,
//               position: "top",
//               formatter: "{c}",
//             },
//           },
//         ];

//   const onChartEvents = {
//     click: (params) => {
//       if (params.componentType !== "series") return;

//       setTableParams({
//         unit: categories[params.dataIndex],
//         processName:
//           selectedProcess === "ALL" ? params.seriesName : selectedProcess,
//         date,
//       });
//     },
//   };

//   const options = {
//     tooltip: {
//       trigger: "axis",
//       axisPointer: {
//         type: "shadow",
//       },
//       valueFormatter: (value) => Number(value).toLocaleString("en-IN"),
//     },

//     legend: {
//       show: selectedProcess === "ALL",
//       top: 5,
//       textStyle: {
//         fontSize: 11,
//         fontWeight: 600,
//         color: "#374151",
//       },
//     },

//     toolbox: {
//       right: 10,
//       feature: {
//         saveAsImage: {
//           show: true,
//         },
//       },
//     },

//     grid: {
//       left: "3%",
//       right: "3%",
//       bottom: "12%",
//       top: selectedProcess === "ALL" ? "15%" : "10%",
//       containLabel: true,
//     },

//     xAxis: {
//       type: "category",
//       data: categories,
//       axisTick: {
//         alignWithLabel: true,
//       },
//       axisLabel: {
//         interval: 0,
//         rotate: 20,
//         fontSize: 11,
//         fontWeight: 600,
//         color: "#374151",
//       },
//     },

//     yAxis: {
//       type: "value",
//       axisLabel: {
//         fontSize: 11,
//         fontWeight: 600,
//         color: "#374151",
//         formatter: (value) => value.toLocaleString("en-IN"),
//       },
//     },

//     series,
//   };

//   return (
//     <>
//       <Card
//         sx={{
//           mt: 1,
//           ml: 1,
//           borderRadius: 3,
//           background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
//           boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
//         }}
//       >
//         <CardHeader
//           title="Production Efficiency"
//           titleTypographyProps={{
//             sx: {
//               fontSize: ".95rem",
//               fontWeight: 700,
//             },
//           }}
//           action={
//             <Box sx={{ display: "flex", gap: 1 }}>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="px-2 py-1 text-xs border-2 rounded-md border-blue-600"
//               />

//               <select
//                 value={selectedProcess}
//                 onChange={(e) => setSelectedProcess(e.target.value)}
//                 className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-40"
//               >
//                 {processOptions.map((item) => (
//                   <option key={item.value} value={item.value}>
//                     {item.label}
//                   </option>
//                 ))}
//               </select>
//             </Box>
//           }
//           sx={{
//             p: 1,
//             borderBottom: `2px solid ${theme.palette.divider}`,
//           }}
//         />

//         <CardContent>
//           {isLoading ? (
//             <Box sx={{ textAlign: "center", py: 10 }}>Loading...</Box>
//           ) : (
//             <ReactECharts
//               key={`${selectedProcess}-${date}`}
//               option={options}
//               onEvents={onChartEvents}
//               style={{ height: 450 }}
//             />
//           )}
//         </CardContent>
//       </Card>

//       {tableParams && (
//         <ProductionDetailTable
//           companyName={companyName}
//           unit={tableParams.unit}
//           processName={tableParams.processName}
//           date={tableParams.date}
//           onClose={() => setTableParams(null)}
//         />
//       )}
//     </>
//   );
// };

// // export default ProductionEfficiency;
// import React, { useMemo, useState } from "react";
// import { Card, CardContent, CardHeader, useTheme, Box } from "@mui/material";
// import ReactECharts from "echarts-for-react";
// import { useGetProductionEfficiencyQuery } from "../../../redux/service/production";
// import ProductionDetailTable from "./TableData/ProductionDetailTable";

// // Gradient pairs: [startColor, endColor] for each process
// const GRADIENTS = {
//   CUTTING: ["#34d399", "#059669"],
//   CHECKING: ["#60a5fa", "#2563eb"],
//   SINGER: ["#fcd34d", "#d97706"],
//   POWERTABLE: ["#f87171", "#dc2626"],
//   SEWING: ["#c084fc", "#7c3aed"],
// };

// const ProductionEfficiency = ({ companyName }) => {
//   const theme = useTheme();

//   const formatDate = (date) => {
//     const d = new Date(date);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${year}-${month}-${day}`;
//   };

//   const [date, setDate] = useState(formatDate(new Date()));
//   const [selectedProcess, setSelectedProcess] = useState("ALL");
//   const [tableParams, setTableParams] = useState(null);

//   const processOptions = [
//     { value: "ALL", label: "All" },
//     { value: "CUTTING", label: "Cutting" },
//     { value: "CHECKING", label: "Checking" },
//     { value: "SINGER", label: "Singer" },
//     { value: "POWER TABLE", label: "Power Table" },
//     { value: "SEWING", label: "Sewing" },
//   ];

//   const { data: response, isLoading } = useGetProductionEfficiencyQuery(
//     {
//       params: {
//         compCode: companyName,
//         date,
//         selectedProcess,
//       },
//     },
//     {
//       skip: !companyName || !date,
//     },
//   );

//   const chartData = useMemo(() => {
//     return response?.data || [];
//   }, [response]);

//   const categories = chartData.map((item) => item.UNIT);

//   // Build a linear gradient color object for ECharts
//   const makeGradient = (key) => {
//     const [start, end] = GRADIENTS[key] || ["#60a5fa", "#2563eb"];
//     return {
//       type: "linear",
//       x: 0,
//       y: 0,
//       x2: 0,
//       y2: 1,
//       colorStops: [
//         { offset: 0, color: start },
//         { offset: 1, color: end },
//       ],
//     };
//   };

//   const labelConfig = {
//     show: true,
//     position: "top",
//     fontSize: 10,
//     fontWeight: 700,
//     color: "#374151",
//     formatter: (params) => {
//       const value = Number(params.value || 0);
//       return value > 0 ? value.toLocaleString("en-IN") : "";
//     },
//   };

//   const series =
//     selectedProcess === "ALL"
//       ? [
//           {
//             name: "CUTTING",
//             type: "bar",
//             barGap: "10%",
//             data: chartData.map((x) => Number(x.CUTTING || 0)),
//             itemStyle: {
//               color: makeGradient("CUTTING"),
//               borderRadius: [8, 8, 0, 0],
//             },
//             label: labelConfig,
//           },
//           {
//             name: "CHECKING",
//             type: "bar",
//             data: chartData.map((x) => Number(x.CHECKING || 0)),
//             itemStyle: {
//               color: makeGradient("CHECKING"),
//               borderRadius: [8, 8, 0, 0],
//             },
//             label: labelConfig,
//           },
//           {
//             name: "SINGER",
//             type: "bar",
//             data: chartData.map((x) => Number(x.SINGER || 0)),
//             itemStyle: {
//               color: makeGradient("SINGER"),
//               borderRadius: [8, 8, 0, 0],
//             },
//             label: labelConfig,
//           },
//           {
//             name: "POWER TABLE",
//             type: "bar",
//             data: chartData.map((x) => Number(x.POWERTABLE || 0)),
//             itemStyle: {
//               color: makeGradient("POWERTABLE"),
//               borderRadius: [8, 8, 0, 0],
//             },
//             label: labelConfig,
//           },
//           {
//             name: "SEWING",
//             type: "bar",
//             data: chartData.map((x) => Number(x.SEWING || 0)),
//             itemStyle: {
//               color: makeGradient("SEWING"),
//               borderRadius: [8, 8, 0, 0],
//             },
//             label: labelConfig,
//           },
//         ]
//       : [
//           {
//             name: selectedProcess,
//             type: "bar",
//             data: chartData.map((x) => {
//               switch (selectedProcess) {
//                 case "CUTTING":
//                   return Number(x.CUTTING || 0);
//                 case "CHECKING":
//                   return Number(x.CHECKING || 0);
//                 case "SINGER":
//                   return Number(x.SINGER || 0);
//                 case "POWER TABLE":
//                   return Number(x.POWERTABLE || 0);
//                 case "SEWING":
//                   return Number(x.SEWING || 0);
//                 default:
//                   return 0;
//               }
//             }),
//             itemStyle: {
//               color: makeGradient(selectedProcess.replace(" ", "")),
//               borderRadius: [8, 8, 0, 0],
//             },
//             label: labelConfig,
//           },
//         ];

//   const onChartEvents = {
//     click: (params) => {
//       if (params.componentType !== "series") return;
//       setTableParams({
//         unit: categories[params.dataIndex],
//         processName:
//           selectedProcess === "ALL" ? params.seriesName : selectedProcess,
//         date,
//       });
//     },
//   };

//   const options = {
//     tooltip: {
//       trigger: "axis",
//       axisPointer: { type: "shadow" },
//       backgroundColor: "#ffffff",
//       borderColor: "#e5e7eb",
//       borderWidth: 1,
//       textStyle: { color: "#374151", fontSize: 12, fontWeight: 600 },
//       valueFormatter: (value) => Number(value).toLocaleString("en-IN"),
//     },
//     legend: { show: false },
//     toolbox: {
//       right: 10,
//       feature: { saveAsImage: { show: true } },
//     },
//     grid: {
//       left: "2%",
//       right: "3%",
//       bottom: "12%",
//       top: "8%",
//       containLabel: true,
//     },
//     xAxis: {
//       type: "category",
//       data: categories,
//       axisTick: { alignWithLabel: true, lineStyle: { color: "#e5e7eb" } },
//       axisLine: { lineStyle: { color: "#e5e7eb" } },
//       axisLabel: {
//         interval: 0,
//         rotate: 20,
//         fontSize: 11,
//         fontWeight: 600,
//         color: "#374151",
//       },
//     },
//     yAxis: {
//       type: "value",
//       splitLine: { lineStyle: { color: "#f3f4f6", type: "dashed" } },
//       axisLabel: {
//         fontSize: 11,
//         fontWeight: 600,
//         color: "#9ca3af",
//         formatter: (value) => value.toLocaleString("en-IN"),
//       },
//     },
//     series,
//   };

//   return (
//     <>
//       <Card
//         sx={{
//           mt: 1,
//           ml: 1,
//           borderRadius: 3,
//           background: "#ffffff",
//           boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
//         }}
//       >
//         <CardHeader
//           title="Production Efficiency"
//           titleTypographyProps={{
//             sx: { fontSize: ".95rem", fontWeight: 700, color: "#111827" },
//           }}
//           action={
//             <Box sx={{ display: "flex", gap: 1 }}>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="px-2 py-1 text-xs border-2 rounded-md border-blue-600"
//               />
//               <select
//                 value={selectedProcess}
//                 onChange={(e) => setSelectedProcess(e.target.value)}
//                 className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-40"
//               >
//                 {processOptions.map((item) => (
//                   <option key={item.value} value={item.value}>
//                     {item.label}
//                   </option>
//                 ))}
//               </select>
//             </Box>
//           }
//           sx={{
//             p: 1,
//             borderBottom: `2px solid ${theme.palette.divider}`,
//           }}
//         />

//         <CardContent>
//           {isLoading ? (
//             <Box sx={{ textAlign: "center", py: 10 }}>Loading...</Box>
//           ) : (
//             <ReactECharts
//               key={`${selectedProcess}-${date}`}
//               option={options}
//               onEvents={onChartEvents}
//               style={{ height: 450 }}
//             />
//           )}
//         </CardContent>
//       </Card>

//       {tableParams && (
//         <ProductionDetailTable
//           companyName={companyName}
//           unit={tableParams.unit}
//           processName={tableParams.processName}
//           date={tableParams.date}
//           onClose={() => setTableParams(null)}
//         />
//       )}
//     </>
//   );
// };

// export default ProductionEfficiency;

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, useTheme, Box } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { useGetProductionEfficiencyQuery } from "../../../redux/service/production";
import ProductionEfficiencytable from "./TableData/ProductionEfficiencytable";

const GRADIENTS = {
  CUTTING: ["#34d399", "#059669"],
  CHECKING: ["#60a5fa", "#2563eb"],
  SINGER: ["#fcd34d", "#d97706"],
  POWERTABLE: ["#f87171", "#dc2626"],
  SEWING: ["#c084fc", "#7c3aed"],
};

const ProductionEfficiency = ({ companyName }) => {
  const theme = useTheme();

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(formatDate(new Date()));
  const [selectedProcess, setSelectedProcess] = useState("CUTTING");
  const [tableParams, setTableParams] = useState(null);

  const processOptions = [
    { value: "ALL", label: "All" },
    { value: "CUTTING", label: "Cutting" },
    { value: "CHECKING", label: "Checking" },
    { value: "SINGER", label: "Singer" },
    { value: "POWER TABLE", label: "Power Table" },
    { value: "SEWING", label: "Sewing" },
  ];

  const { data: response, isLoading } = useGetProductionEfficiencyQuery(
    {
      params: { compCode: companyName, date, selectedProcess },
    },
    { skip: !companyName || !date },
  );

  const chartData = useMemo(() => response?.data || [], [response]);
  const categories = chartData.map((item) => item.UNIT);

  const makeGradient = (key) => {
    const [start, end] = GRADIENTS[key] || ["#60a5fa", "#2563eb"];
    return {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: start },
        { offset: 1, color: end },
      ],
    };
  };

  // Label: process name on first line, value on second line
  const makeLabelConfig = (processName) => ({
    show: true,
    position: "top",
    fontSize: 10,
    fontWeight: 700,
    color: "#374151",
    lineHeight: 16,
    formatter: (params) => {
      const value = Number(params.value || 0);
      if (value <= 0) return "";
      return `${processName}\n${value.toLocaleString("en-IN")}`;
    },
  });

  const series =
    selectedProcess === "ALL"
      ? [
          {
            name: "CUTTING",
            type: "bar",
            barGap: "10%",
            data: chartData.map((x) => Number(x.CUTTING || 0)),
            itemStyle: {
              color: makeGradient("CUTTING"),
              borderRadius: [8, 8, 0, 0],
            },
            label: makeLabelConfig("Cutting"),
          },
          {
            name: "CHECKING",
            type: "bar",
            data: chartData.map((x) => Number(x.CHECKING || 0)),
            itemStyle: {
              color: makeGradient("CHECKING"),
              borderRadius: [8, 8, 0, 0],
            },
            label: makeLabelConfig("Checking"),
          },
          {
            name: "SINGER",
            type: "bar",
            data: chartData.map((x) => Number(x.SINGER || 0)),
            itemStyle: {
              color: makeGradient("SINGER"),
              borderRadius: [8, 8, 0, 0],
            },
            label: makeLabelConfig("Singer"),
          },
          {
            name: "POWER TABLE",
            type: "bar",
            data: chartData.map((x) => Number(x.POWERTABLE || 0)),
            itemStyle: {
              color: makeGradient("POWERTABLE"),
              borderRadius: [8, 8, 0, 0],
            },
            label: makeLabelConfig("Power Table"),
          },
          {
            name: "SEWING",
            type: "bar",
            data: chartData.map((x) => Number(x.SEWING || 0)),
            itemStyle: {
              color: makeGradient("SEWING"),
              borderRadius: [8, 8, 0, 0],
            },
            label: makeLabelConfig("Sewing"),
          },
        ]
      : [
          {
            name: selectedProcess,
            type: "bar",
            data: chartData.map((x) => {
              switch (selectedProcess) {
                case "CUTTING":
                  return Number(x.CUTTING || 0);
                case "CHECKING":
                  return Number(x.CHECKING || 0);
                case "SINGER":
                  return Number(x.SINGER || 0);
                case "POWER TABLE":
                  return Number(x.POWERTABLE || 0);
                case "SEWING":
                  return Number(x.SEWING || 0);
                default:
                  return 0;
              }
            }),
            itemStyle: {
              color: makeGradient(selectedProcess.replace(" ", "")),
              borderRadius: [8, 8, 0, 0],
            },
            label: makeLabelConfig(
              processOptions.find((p) => p.value === selectedProcess)?.label ||
                selectedProcess,
            ),
          },
        ];

  // Replace onChartEvents
  const onChartEvents = {
    click: (params) => {
      if (params.componentType !== "series") return;
      setTableParams({
        unit: categories[params.dataIndex], // UNIT (store/location)
        processName:
          selectedProcess === "ALL" ? params.seriesName : selectedProcess,
        date,
      });
    },
  };

  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      textStyle: { color: "#374151", fontSize: 12, fontWeight: 600 },
      valueFormatter: (value) => Number(value).toLocaleString("en-IN"),
    },
    legend: { show: false },
    toolbox: {
      right: 10,
      feature: { saveAsImage: { show: true } },
    },
    grid: {
      left: "2%",
      right: "3%",
      bottom: "12%",
      top: "12%", // extra top space for 2-line labels
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: categories,
      axisTick: { alignWithLabel: true, lineStyle: { color: "#e5e7eb" } },
      axisLine: { lineStyle: { color: "#e5e7eb" } },
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
      splitLine: { lineStyle: { color: "#f3f4f6", type: "dashed" } },
      axisLabel: {
        fontSize: 11,
        fontWeight: 600,
        color: "#9ca3af",
        formatter: (value) => value.toLocaleString("en-IN"),
      },
    },
    series,
  };

  return (
    <>
      <Card
        sx={{
          mt: 1,
          ml: 1,
          borderRadius: 3,
          background: "#ffffff",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        }}
      >
        <CardHeader
          title="Production Quantity"
          titleTypographyProps={{
            sx: { fontSize: ".95rem", fontWeight: 700, color: "#111827" },
          }}
          action={
            <Box sx={{ display: "flex", gap: 1 }}>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600"
              />
              <select
                value={selectedProcess}
                onChange={(e) => setSelectedProcess(e.target.value)}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-40"
              >
                {processOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Box>
          }
          sx={{
            p: 1,
            borderBottom: `2px solid ${theme.palette.divider}`,
          }}
        />

        <CardContent>
          {isLoading ? (
            <Box sx={{ textAlign: "center", py: 10 }}>Loading...</Box>
          ) : (
            <ReactECharts
              key={`${selectedProcess}-${date}`}
              option={options}
              onEvents={onChartEvents}
              style={{ height: 450 }}
            />
          )}
        </CardContent>
      </Card>
      {tableParams && (
        <ProductionEfficiencytable
          companyName={companyName}
          unit={tableParams.unit}
          processName={tableParams.processName}
          date={tableParams.date}
          onClose={() => setTableParams(null)}
          processOptions={processOptions}
        />
      )}
    </>
  );
};

export default ProductionEfficiency;

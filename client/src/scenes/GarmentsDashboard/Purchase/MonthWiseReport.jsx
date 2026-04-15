

import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";
import Highcharts3D from "highcharts/highcharts-3d"; // ← required for 3D

import {
  Card,
  CardHeader,
  CardContent,
  useTheme,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
} from "@mui/material";
import {
  useGetYearPurchaseOrderQuery,
  useGetYearPurchaseGeneralQuery,
  useGetYearPurchaseCombinedCOMPQuery,
} from "../../../redux/service/purchaseService";
import YearWiseTable from "./TableData/YearTable";
import { useEffect } from "react";
import SpinLoader from "../../../utils/spinLoader";

const YEAR_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28DFF",
  "#FF6699",
  "#33CC99",
  "#66B2FF",
];

// Initialize Highcharts modules
highchartsMore(Highcharts);
Highcharts3D(Highcharts); // ← initialize 3D module
const applyGlow = (chart, filterId, stdDeviation = 4) => {
  if (!chart[`_glow_${filterId}`]) {
    chart.renderer.defs.element.insertAdjacentHTML(
      "beforeend",
      `<filter id="${filterId}" x="-40%" y="-40%" width="180%" height="180%">
         <feGaussianBlur in="SourceGraphic" stdDeviation="${stdDeviation}" result="blur"/>
         <feMerge>
           <feMergeNode in="blur"/>
           <feMergeNode in="SourceGraphic"/>
         </feMerge>
       </filter>`
    );
    chart[`_glow_${filterId}`] = true;
  }
  chart.series.forEach((s) => {
    s.points.forEach((point) => {
      if (point.graphic?.element)
        point.graphic.element.setAttribute("filter", `url(#${filterId})`);
    });
  });
};
const Form = ({
  companyName,
  finYear,
  finYr,
  poType,
  companyList,
  setChartToShow,
  chartToshow,
  purchaseTypeOptions,
}) => {
  const theme = useTheme();
  const [showYearTable, setShowYearTable] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCompCode, setSelectedCompCode] = useState("");
  const [selectedOrderType, setSelectedOrderType] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [orderChartData, setOrderChartData] = useState([]);

  console.log(poType, "poType");

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatINRShort = (value) => {
    const num = Number(value);
    if (num >= 1e7) return `₹ ${(num / 1e7).toFixed(2)} Cr`;
    if (num >= 1e5) return `₹ ${(num / 1e5).toFixed(2)} L`;
    return `₹ ${num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // API calls
  const {
    data: yearOrderResponse,
    isLoading: yearOrderResponseLoading,
    isFetching: yearOrderResponseFetching,
  } = useGetYearPurchaseOrderQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );
  const {
    data: yearGeneralResponse,
    isLoading: yearGeneralResponseLoading,
    isFetching: yearGeneralResponseFetching,
  } = useGetYearPurchaseGeneralQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );
  const {
    data: yearAllResponse,
    isLoading: yearAllResponseLoading,
    isFetching: yearAllResponseFetching,
  } = useGetYearPurchaseCombinedCOMPQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );

  const isChartLoading =
    yearOrderResponseLoading ||
    yearGeneralResponseLoading ||
    yearAllResponseLoading;
  const isChartFetching =
    yearOrderResponseFetching ||
    yearGeneralResponseFetching ||
    yearAllResponseFetching;

  useEffect(() => {
    setShowYearTable(false);
    setSelectedYear(null);
    setSelectedCompCode("");
  }, [poType]);
const sortFinYears = (years) =>
  [...years].sort((a, b) => {
    const toNum = (fy) => Number(String(fy).split("-")[0]);
    return toNum(a) - toNum(b);
  });
  // --- Chart 1: Purchase Order ---
  useEffect(() => {
    if (poType === "Order" && yearOrderResponse?.data?.length > 0) {
      const grouped = yearOrderResponse.data.map((group) => ({
        type: group.type,
        chartData: [...group.data].map((item) => ({
          month: item.month || item.label,
          value: Number(item.VAL ?? item.value ?? 0),
          year: item.yearNo,
          finYear: item.finyear,
          company: item.company,
        })),
      }));
      setOrderChartData(grouped);
      if (!selectedType) setSelectedType(grouped[0]?.type ?? null);
    }
  }, [yearOrderResponse, poType]);

  // --- Chart 1: Order → 3D Column ---
  const chartOrderOptions = useMemo(() => {
     if (!yearOrderResponse?.data) return {};
 
       const years = sortFinYears([
      ...new Set(
        yearOrderResponse.data.flatMap((item) =>
          item.data.map((d) => d.FINYEAR)
        )
      ),
    ]);
 
     const filteredData = selectedType
       ? yearOrderResponse.data.filter((item) => item.type === selectedType)
       : yearOrderResponse.data;
 
     const series = filteredData.map((item) => ({
       name: item.type,
       type: "column",
       colorByPoint: true, // each bar gets its own color from colors[]
       data: years.map((year) => {
         const found = item.data.find((d) => d.FINYEAR === year);
         const val = Number(found?.VAL ?? 0);
         return val > 0 ? val : null; // null → bar not rendered at all
       }),
       showInLegend: true,
       dataLabels: {
         enabled: true,
         formatter: function () {
           if (!this.y || this.y === 0) return null;
           return formatINRShort(this.y);
         },
         style: {
           fontSize: "11px",
           fontWeight: "600",
           color: "#333",
           textOutline: "none",
         },
       },
       cursor: "pointer",
       point: {
         events: {
           click: function () {
             if (!this.y || this.y === 0) return;
             setSelectedYear(this.category);
             setSelectedOrderType(item.type);
             setSelectedCompCode("");
             setShowYearTable(true);
           },
         },
       },
     }));
 
     return {
       chart: {
         type: "column",
         height: 400,
         backgroundColor: "transparent",
         events: {
           render: function () {
             applyGlow(this, "glow-order", 5);
           },
         },
       },
       title: { text: "" },
       xAxis: {
         categories: years,
         title: { text: "Financial Year" },
         labels: {
           style: { fontSize: "12px", fontWeight: "600", color: "#333" },
         },
       },
       yAxis: {
         title: { text: "" },
         gridLineDashStyle: "Dash",
         labels: {
           formatter: function () {
             return formatINRShort(this.value);
           },
           style: { fontSize: "11px" },
         },
       },
       plotOptions: {
         column: {
           minPointLength: 0,
           borderRadius: 4,
           groupPadding: 0.15,
           pointPadding: 0.05,
         },
       },
       colors: YEAR_COLORS, // colorByPoint cycles through this
       series,
       tooltip: {
         pointFormatter: function () {
           if (!this.y || this.y === 0) return "";
           return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formatINRShort(this.y)}</b><br/>`;
         },
       },
       legend: { symbolHeight: 12, symbolWidth: 12, symbolRadius: 2 },
       credits: { enabled: false },
     };
   }, [yearOrderResponse, selectedType]);

  
  const chartGeneralOptions = useMemo(() => {
    const rawData = (yearGeneralResponse?.data ?? [])
      .filter((d) => Number(d.VAL ?? 0) > 0) // ← hard filter, zeros never enter pie
      .map((d, i) => ({
        name: String(d.FINYEAR),
        y: Number(d.VAL), // always positive, never null/0
        FINYEAR: d.FINYEAR,
        COMPCODE: d.COMPCODE,
        color: YEAR_COLORS[i % YEAR_COLORS.length],
        cursor: "pointer",
      }));

    return {
      chart: {
        type: "pie",
        height: 400,
        backgroundColor: "transparent",
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0,
        },
      },
      title: { text: "" },
      tooltip: {
        backgroundColor: "#000",
        style: { color: "#fff" },
        borderRadius: 8,
        pointFormatter: function () {
          return `${formatINRShort(this.y)}<br/>`;
        },
      },
      plotOptions: {
        pie: {
          depth: 35,
          innerSize: "0%",
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            formatter: function () {
              if (!this.y || this.y === 0) return null;
              return `<b>${this.point.name}</b><br/>${formatINRShort(this.y)}`;
            },
            style: {
              fontSize: "12px",
              fontWeight: "600",
              textOutline: "none",
            },
          },
          point: {
            events: {
              click: function () {
                if (!this.y || this.y === 0) return;
                setSelectedYear(this.FINYEAR);
                setSelectedCompCode(this.COMPCODE);
                setShowYearTable(true);
              },
            },
          },
        },
      },
      series: [{ name: "Purchase", data: rawData }],
      legend: { enabled: false },
      credits: { enabled: false },
    };
  }, [yearGeneralResponse]);

  // --- Chart 3: Combined (All) → Area Spline, NO click logic ---
  const chartCombinedOptions = useMemo(() => {
    const rawData = (yearAllResponse?.data ?? []).map((d) => {
      const val = Number(d.VAL ?? 0);
      return {
        y: val > 0 ? val : null, // null hides the point entirely
        FINYEAR: d.FINYEAR,
        COMPCODE: d.COMPCODE,
      };
    });

    return {
      chart: {
        type: "areaspline",
        height: 400,
        backgroundColor: "transparent",
      },
      title: { text: "" },
      xAxis: {
        categories: rawData.map((d) => d.FINYEAR),
        lineColor: "#ddd",
        tickColor: "#ddd",
        labels: {
          style: { fontSize: "13px", fontWeight: "600", color: "#333" },
        },
      },
      yAxis: {
        title: { text: "" },
        gridLineDashStyle: "Dash",
        labels: {
          formatter() {
            return formatINRShort(this.value);
          },
          style: { fontSize: "11px" },
        },
      },
      tooltip: {
        backgroundColor: "#000",
        style: { color: "#fff" },
        borderRadius: 8,
        formatter() {
          if (!this.y || this.y === 0) return false;
          return `<b>FY ${this.x}</b><br/>${formatINRShort(this.y)}`;
        },
      },
      plotOptions: {
        areaspline: {
          lineWidth: 3,
          fillOpacity: 0.18,
          connectNulls: false, // gap at null points, no bridge
          marker: {
            enabled: true,
            radius: 6,
            symbol: "circle",
            lineWidth: 2,
            lineColor: "#fff",
          },
          // No cursor, no click events — intentionally omitted for "All"
          dataLabels: {
            enabled: true,
            formatter() {
              if (!this.y || this.y === 0) return null;
              return formatINRShort(this.y);
            },
            style: {
              fontSize: "11px",
              fontWeight: "bold",
              color: "#333",
              textOutline: "none",
            },
          },
        },
      },
      colors: YEAR_COLORS,
      series: [{ name: "Purchase", data: rawData, color: YEAR_COLORS[1] }],
      legend: { enabled: false },
      credits: { enabled: false },
    };
  }, [yearAllResponse]);

  const chartToRender = useMemo(() => {
    if (!poType) return null;
    const type = poType.trim().toLowerCase();
    switch (type) {
      case "order":
        return chartOrderOptions;
      case "general":
        return chartGeneralOptions;
      case "all":
        return chartCombinedOptions;
      default:
        return null;
    }
  }, [poType, chartOrderOptions, chartGeneralOptions, chartCombinedOptions]);

  const valOptions = useMemo(() => {
    if (!yearOrderResponse?.data) return [];
    return yearOrderResponse.data.map((item) => item.type);
  }, [yearOrderResponse]);

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={"Year Wise Purchase"}
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RadioGroup
              row
              value={chartToshow}
              onChange={(e) => setChartToShow(e.target.value)}
              sx={{ gap: 1 }}
            >
              {purchaseTypeOptions.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  value={opt.value}
                  control={<Radio size="small" />}
                  label={opt.label}
                  sx={{ fontSize: "11px" }}
                />
              ))}
            </RadioGroup>

            {poType === "Order" && orderChartData.length > 0 && (
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{
                  fontSize: "11px",
                  padding: "0px 14px",
                  borderRadius: "6px",
                  border: "2px solid #2563eb",
                  marginTop: "2px",
                  marginLeft: "-12px",
                  minWidth: "120px",
                }}
              >
                {orderChartData.map((g) => (
                  <option key={g.type} value={g.type}>
                    {g.type}
                  </option>
                ))}
              </select>
            )}
          </Box>
        }
      />
      <CardContent
        sx={{
          position: "relative",
          backgroundColor: "#fff",
          mt: 1,
          ml: 1,
          minHeight: 460,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {(isChartLoading || isChartFetching) && <SpinLoader />}
        {!showYearTable && chartToRender && (
          <HighchartsReact
            highcharts={Highcharts}
            options={chartToRender}
            key={poType}
          />
        )}

        {showYearTable && selectedYear && (
          <YearWiseTable
            year={selectedYear}
            poType={poType}
            type={selectedOrderType}
            companyList={companyList}
            selectedCompCode={selectedCompCode}
            finYr={finYr}
            valOptions={valOptions}
            closeTable={() => {
              setShowYearTable(false);
              setSelectedCompCode(companyName);
              setSelectedYear(finYear);
              if (orderChartData.length > 0)
                setSelectedType(orderChartData[0].type);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Form;

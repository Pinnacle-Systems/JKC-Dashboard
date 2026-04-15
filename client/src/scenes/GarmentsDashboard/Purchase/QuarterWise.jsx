import React, { useMemo, useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";
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
  useGetQuarterPurchaseOrderQuery,
  useGetQuarterPurchaseGeneralQuery,
  useGetQuarterPurchaseCombinedCOMPQuery,
} from "../../../redux/service/purchaseService";
import QuarterTable from "./TableData/QuarterTable";
import SpinLoader from "../../../utils/spinLoader";

highchartsMore(Highcharts);

const QuarterWise = ({
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
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  // ── NEW: mirrors TopTenSupplierYear's orderChartData + selectedType ──
  const [orderChartData, setOrderChartData] = useState([]); // [{ type, chartData[] }]
  const [selectedType, setSelectedType] = useState("");
  const QUARTER_ORDER = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 };
  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  console.log(selectedMonth, selectedQuarter, "checking");

  const formatINRShort = (value) => {
    const num = Number(value);
    if (num >= 1e7) return `₹ ${(num / 1e7).toFixed(2)} Cr`;
    if (num >= 1e5) return `₹ ${(num / 1e5).toFixed(2)} L`;
    return `₹ ${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // ── Queries (same as before) ─────────────────────────────────────────────
  const {
    data: quarterResponse,
    isLoading,
    isFetching,
  } = useGetQuarterPurchaseCombinedCOMPQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );

  const { data: quarterOrderResponse } = useGetQuarterPurchaseOrderQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );

  const { data: quarterGeneralResponse } = useGetQuarterPurchaseGeneralQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );
  console.log(quarterGeneralResponse, "quarterGeneralResponse");

  // ── Reset on poType change ───────────────────────────────────────────────
  // useEffect(() => {
  //   setShowYearTable(false);
  //   setSelectedYear(null);
  //   setSelectedCompCode("");
  //   setOrderChartData([]);
  //   setSelectedType("");
  // }, [poType]);

  // ── Process Order response → grouped by type (mirrors TopTenSupplierYear) ─
  useEffect(() => {
    if (poType === "Order" && quarterOrderResponse?.data) {
      // quarterOrderResponse.data = [{ type: "GREY YARN", data: [...] }, ...]
      const grouped = quarterOrderResponse.data.map((group) => ({
        type: group.type,
        chartData: [...group.data]
          // .sort((a, b) => (b.VAL ?? b.value ?? 0) - (a.VAL ?? a.value ?? 0))
          .map((item) => ({
            quarter: item.quarter || item.label,
            value: Number(item.VAL ?? item.value ?? 0),
            month: item.month,
            year: item.yearNo,
            finYear: item.finyear,
            company: item.company,
          })),
      }));
      setOrderChartData(grouped);
    }
  }, [quarterOrderResponse, poType]);

  // ── Auto-select first type when orderChartData loads ────────────────────
  useEffect(() => {
    if (poType === "Order" && orderChartData.length > 0) {
      setSelectedType(orderChartData[0].type);
    }
  }, [orderChartData, poType]);

  // ── Active chart data: Order uses selectedType, All/General uses response ─
  const activeChartData = useMemo(() => {
    let dataToUse = [];

    if (poType === "Order") {
      const found = orderChartData.find((g) => g.type === selectedType);
      dataToUse = found?.chartData ?? [];
    } else {
      const responseToShow =
        poType === "All" ? quarterResponse?.data : quarterGeneralResponse?.data;
      console.log(responseToShow, "responseToShow");

      dataToUse = (Array.isArray(responseToShow) ? responseToShow : []).map(
        (i) => ({
          quarter: i.quarter || i.label,
          value: Number(i.VAL ?? i.value ?? 0),
          month: i.month,
          year: i.yearNo,
          finYear: i.finyear,
          company: i.company,
          monthNumber: i.monthNumber,
        }),
      );
    }
    console.log(dataToUse, "dataToUse");

    // ── Sort by Q1→Q4, then by year/month if needed
    return dataToUse.sort((a, b) => {
      const qA = QUARTER_ORDER[a.quarter] ?? 99;
      const qB = QUARTER_ORDER[b.quarter] ?? 99;
      if (qA !== qB) return qA - qB; // sort by quarter
      if (a.year !== b.year) return a.year - b.year; // then by year
      return (a.monthNumber ?? 0) - (b.monthNumber ?? 0); // then by month
    });
  }, [
    poType,
    orderChartData,
    selectedType,
    quarterResponse,
    quarterGeneralResponse,
  ]);

  // ── Chart config ─────────────────────────────────────────────────────────
  const QUARTER_COLORS = {
    Q1: "#0088FE",
    Q2: "#00C49F",
    Q3: "#FFBB28",
    Q4: "#FF8042",
  };
  const quarterEndIndices = (() => {
    const indices = [];
    let lastQuarter = "";
    activeChartData.forEach((item, idx) => {
      if (item.quarter !== lastQuarter) {
        lastQuarter = item.quarter;
      }
      // check if next item is a new quarter or last item
      if (
        idx === activeChartData.length - 1 || // last item
        activeChartData[idx + 1].quarter !== item.quarter
      ) {
        indices.push(idx + 0.5); // place line after this column
      }
    });
    return indices;
  })();
  const quarterChartOptions = useMemo(
    () => ({
      chart: { type: "column", height: 430, backgroundColor: "transparent" },
      title: { text: "" },
      xAxis: {
        categories: activeChartData.map((i) => i.quarter),
        lineColor: "#ddd",
        tickColor: "#ddd",

        labels: { style: { fontSize: "12px" } },
        plotLines: quarterEndIndices.map((idx) => ({
          color: "#ccc",
          width: 2,
          value: idx,
          zIndex: 5,
        })),
      },
      yAxis: {
        title: { text: "" },
        gridLineDashStyle: "Dash",
        labels: {
          formatter() {
            return formatINRShort(this.value);
          },
          style: { fontSize: "12px" },
        },
      },
      tooltip: {
        backgroundColor: "#000",
        style: { color: "#fff" },
        borderRadius: 8,
        formatter() {
          return `<b>${this.x}</b><br/>${this.point.month}<br/>${formatINR(this.y)}`;
        },
      },
      plotOptions: {
        column: {
          borderRadius: 8,
          minPointLength: 40,
          dataLabels: {
            enabled: true,
            inside: false,
            rotation: 0,
            align: "center",
            y: -8,
            verticalAlign: "middle",
            style: { fontSize: "13px", fontWeight: "600", color: "black" },
            formatter() {
              return formatINRShort(this.y);
            },
          },
          // ── Chart click → open table (only for non-All) ──
          point: {
            events: {
              click(e) {
                console.log(e.point, "modal");

                if (poType === "All") return;
                setSelectedYear(this.finYear);
                setSelectedCompCode(this.company ?? companyName);
                setSelectedOrderType(poType === "Order" ? selectedType : "");
                setSelectedQuarter(this.category); // ← this.category = "Q4"
                setSelectedMonth(this.month); // ← this.month = "January 2026"
                setShowYearTable(true);
              },
            },
          },
        },
      },
      series: [
        {
          name: "Purchase",
          data: activeChartData.map((i) => ({
            y: i.value,
            month: i.month,
            year: i.year,
            finYear: i.finYear,
            company: i.company,
            color: QUARTER_COLORS[i.quarter],
          })),
        },
      ],
      legend: { enabled: false },
      credits: { enabled: false },
    }),
    [activeChartData, poType, selectedType, companyName],
  );

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Quarter Wise Purchase"
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

            {/* ── Same select pattern as TopTenSupplierYear ── */}
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
          height: 460,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {(isLoading || isFetching) && <SpinLoader />}

        {activeChartData.length === 0 && !isLoading ? (
          <div style={{ textAlign: "center", padding: 40, height: 430 }}>
            No data
          </div>
        ) : (
          <Box>
            <HighchartsReact
              key={`quarter-chart-${selectedType}`} // re-mount on type change
              highcharts={Highcharts}
              options={quarterChartOptions}
            />
          </Box>
        )}

        {showYearTable && selectedYear && poType !== "All" && (
          <QuarterTable
            year={selectedYear}
            poType={poType}
            type={selectedOrderType}
            initialOrderType={selectedType}
            companyList={companyList}
            selectedCompCode={selectedCompCode}
            setSelectedCompCode={setSelectedCompCode}
            finYr={finYr}
            initialQuarter={selectedQuarter} // ← ADD
            initialMonth={selectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            closeTable={() => {
              setShowYearTable(false);
              setSelectedCompCode(companyName);
              setSelectedYear(finYear);
              setSelectedType(orderChartData[0].type);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default QuarterWise;

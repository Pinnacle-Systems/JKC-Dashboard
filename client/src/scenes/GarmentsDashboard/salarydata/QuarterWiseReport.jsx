import React, { useState, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  CardHeader,
  CardContent,
  useTheme,
} from "@mui/material";
import { useGetMisDashboardErpQuarterWiseQuery } from "../../../redux/service/misDashboardServiceERP";
import QuarterWiseTable from "./TableData/QuarterWiseTable";

const MONTH_ORDER = {
  Jan: 1, Feb: 2, Mar: 3,
  Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9,
  Oct: 10, Nov: 11, Dec: 12,
};

const Form = ({ companyName, finYear, finYr, filterBuyerList }) => {

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const theme = useTheme();
  const [showTable, setShowTable] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState(null);

  const { data: response, isLoading } =
    useGetMisDashboardErpQuarterWiseQuery({
      params: { finYear, companyName },
    });

  const QUARTER_COLORS = {
    Q1: "#DC143C", // green
    Q2: "#FF8042", // blue
    Q3: "#00C49F", // orange
    Q4: "#0088FE", // purple
  };
  /* ---------- PROCESS DATA ---------- */
  const chartData = useMemo(() => {
    const rawData = Array.isArray(response?.data) ? response.data : [];

    const sorted = [...rawData].sort(
      (a, b) =>
        MONTH_ORDER[a.monthName.trim()] -
        MONTH_ORDER[b.monthName.trim()]
    );

    const categories = sorted.map(d => d.monthName);
    const quarterAxis = sorted.map(d => d.quarter);

    return {
      categories,
      quarterAxis,
      data: sorted.map(d => ({
        y: Number(d.value) || 0,
        quarter: d.quarter,
        monthName: d.monthName,   // ✅ ADD THIS

        color: QUARTER_COLORS[d.quarter], // 👈 COLOR BY QUARTER

      })),
    };
  }, [response?.data]);

  /* ---------- CHART OPTIONS ---------- */
  const options = {
    chart: {
      type: "column",
      height: 380,
    },

    title: { text: "" },

    // xAxis: [
    //   {
    //     categories: chartData.categories,
    //     labels: {
    //       style: {
    //         fontSize: "11px",
    //         fontWeight: "600",
    //       },
    //     },
    //   },
    //   {
    //     linkedTo: 0,
    //     categories: chartData.quarterAxis,
    //     opposite: false,
    //     labels: {
    //       groupedOptions: [
    //         { rotation: 0 }
    //       ],
    //       style: {
    //         fontSize: "13px",
    //         fontWeight: "700",
    //       },
    //     },
    //     tickPositions: [1, 4, 7, 10], // 👈 center of each quarter
    //     tickLength: 0,
    //     lineWidth: 0,
    //   },
    // ],
    xAxis: [
      {
        categories: chartData.categories,
        labels: {
          style: {
            fontSize: "11px",
            fontWeight: "600",
          },
        },

        plotLines: [
          {
            value: 2.5, // after Mar
            color: "#999",
            width: 1,
            zIndex: 5,
          },
          {
            value: 5.5, // after Jun
            color: "#999",
            width: 1,
            zIndex: 5,
          },
          {
            value: 8.5, // after Sep
            color: "#999",
            width: 1,
            zIndex: 5,
          },
        ],
      },
      {
        linkedTo: 0,
        categories: chartData.quarterAxis,
        opposite: false,
        tickPositions: [1, 4, 7, 10],
        tickLength: 0,
        lineWidth: 0,

        labels: {
          useHTML: true,
          formatter() {
            const q = this.value;
            const color = QUARTER_COLORS[q] || "#ccc";

            return `
        <span
          style="
            background:${color};
            color:#fff;
            padding:4px 10px;
            border-radius:12px;
            font-size:12px;
            font-weight:700;
            display:inline-block;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);

          "
        >
          ${q}
        </span>
      `;
          },
        },
      }

    ],

    yAxis: {
      visible: false,
    },

    legend: { enabled: false },

    tooltip: {
      useHTML: true,
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderRadius: 6,
      shadow: true,

      formatter() {
        return `
      <div style="padding:6px 8px">
        <div><b>Quarter :</b> ${this.point.quarter}</div>
        <div><b>Month :</b> ${this.point.monthName}</div>
        <div><b>Value :</b> ${formatINR(this.y)}</div>
      </div>
    `;
      },
    },

    plotOptions: {
      column: {
        pointPadding: 0,
        groupPadding: 0.15,
        borderWidth: 0,
        minPointLength: 100,

      },

      series: {
        cursor: "pointer",
        point: {
          events: {
            click() {
              setSelectedQuarter({ quarter: this.quarter });
              setShowTable(true);
            },
          },
        },
        dataLabels: [
          {
            enabled: true,
            inside: true,
            rotation: -90, // 👈 VALUE ROTATED
            overflow: 'allow',  // 👈 force showing even if small
            crop: false,
            formatter() {
              return formatINR(this.y); // 👈 use formatINR here
            },

            style: {
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: "600",
              textOutline: "1px contrast",
            },
          },

        ],
      },
    },


    credits: { enabled: false },

    series: [
      {
        data: chartData.data,
      },
    ],
  };

  /* ---------- RENDER ---------- */
  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Quarter Wise TurnOver"
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />

      <CardContent>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Loading...
          </div>
        ) : (
          <HighchartsReact highcharts={Highcharts} options={options} />
        )}
      </CardContent>

      {showTable && selectedQuarter && (
        <QuarterWiseTable
          quarter={selectedQuarter.quarter}
          filterBuyerList={filterBuyerList}
          finYr={finYr}
          closeTable={() => setShowTable(false)}
        />
      )}
    </Card>
  );
};

export default Form;

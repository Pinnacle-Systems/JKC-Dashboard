import { Box, Card, CardContent, CardHeader, Typography, useTheme } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { useState } from 'react'
import { useGetFabricOutwardMonthDateQuery } from "../../../redux/service/fabricOutward";
import CustomerTransDate from "./CustomerTransDate";

const FabricMonthDate = ({
  selectedYear,
  setSelectedYear,
  category,
  finYear,
  setCategory,
  selectmonths,
  setSelectmonths,
}) => {
  const theme = useTheme();

  const [showTable, setShowTable] = useState(false);
  const [custName, setCustName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const { data: fabricData } = useGetFabricOutwardMonthDateQuery(
    {
      params: {
        finyear: selectedYear,
        category: category,
        month: selectmonths,
      },
    },
    {
      skip: !selectedYear || !category || !selectmonths,
    }
  );

  const rows = fabricData?.data || [];

  const buildDates = (day, monthName, finYear) => {
    const monthMap = {
      JANUARY: "01",
      FEBRUARY: "02",
      MARCH: "03",
      APRIL: "04",
      MAY: "05",
      JUNE: "06",
      JULY: "07",
      AUGUST: "08",
      SEPTEMBER: "09",
      OCTOBER: "10",
      NOVEMBER: "11",
      DECEMBER: "12",
    };

    const month = monthMap[monthName.toUpperCase()];
    const [fyStart, fyEnd] = finYear.split("-");
    const year = Number(month) >= 4 ? `20${fyStart}` : `20${fyEnd}`;

    return `${year}-${month}-${day.padStart(2, "0")}`;
  };

  const dataMap = {};
  rows.forEach(({ delDate, customer, qty }) => {
    if (!dataMap[delDate]) dataMap[delDate] = {};
    dataMap[delDate][customer] =
      (dataMap[delDate][customer] || 0) + Number(qty);
  });

  const dates = Object.keys(dataMap).sort(
    (a, b) => Number(a) - Number(b)
  );

  const customers = [...new Set(rows.map((r) => r.customer))];

  const seriesData = customers.map((cust) => ({
    name: cust,
    data: dates.map((date) => dataMap[date][cust] || 0),
  }));

  const totalQty = rows.reduce(
    (sum, r) => sum + Number(r.qty || 0),
    0
  );


  const options = {
    chart: {
      type: "column",
      height: 320,
      backgroundColor: "#f5f5f5",
    },

    title: null,

    xAxis: {
      categories: dates,
      title: { text: "Date" },
      labels: { style: { fontSize: "10px" } },
    },

    yAxis: {
      min: 0,
      title: {
        text: "Qty (kgs)",
        style: { fontSize: "12px", fontWeight: 600 },
      },
      stackLabels: {
        enabled: true,
        formatter() {
          return this.total.toLocaleString("en-IN");
        },
        style: {
          fontSize: "9px",
          fontWeight: "bold",
          color: theme.palette.text.primary,
        },
      },
    },

    legend: {
      enabled: true,
      itemStyle: { fontSize: "10px" },
    },

    tooltip: {
      shared: false,
      useHTML: true,
      formatter: function () {
        return `
      <b>Date : ${this.x}</b>
      <table style="margin-top:4px;">
        <tr>
          <td colspan="2">
            ${this.series.name}
          </td>
        </tr>
        <tr>
          <td style="color:${this.color}; font-size:14px;">●</td>
          <td>
            Qty (kgs) :
            <b>${this.y.toLocaleString("en-IN", {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })}</b>
          </td>
        </tr>
      </table>
    `;
      },
    },

    plotOptions: {
      column: {
        stacking: "normal",
        groupPadding: 0.1,
        pointPadding: 0,
        borderWidth: 0,
      },
      series: {
        cursor: "pointer",
        point: {
          events: {
            click: function () {
              const isoDate = buildDates(
                this.category,
                selectmonths.split(" ")[0],
                selectedYear
              );
              setSelectedDate(isoDate);
              setCustName(this.series.name);
              setShowTable(true);
            },
          },
        },
      },
    },

    series: seriesData,

    credits: { enabled: false },
  };


  return (
    <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
      <CardHeader
        title="Date wise Contribution"
        titleTypographyProps={{
          sx: { fontSize: "1rem", fontWeight: 600 },
        }}
        sx={{
          p: 0.5,
          px: 1,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
      />

      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />

        <Box
          sx={{
            bgcolor: "background.default",
            borderRadius: 3,
            textAlign: "center",
            border: `1px solid ${theme.palette.divider}`,
            p: 1,
            mt: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {selectmonths.split(" ")[0]} Month Outward Qty :{" "}
            {totalQty.toLocaleString("en-IN", {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            })}
          </Typography>
        </Box>
      </CardContent>

      {showTable && (
        <CustomerTransDate
          closeTable={() => setShowTable(false)}
          finYear={finYear}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          category={category}
          setCategory={setCategory}
          custName={custName}
          setCustName={setCustName}
          selectmonths={selectmonths}
          setSelectmonths={setSelectmonths}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      )}
    </Card>
  );
};

export default FabricMonthDate;

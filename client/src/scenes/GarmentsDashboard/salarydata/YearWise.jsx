import { useEffect, useState } from "react";
import { Box, Card, CardContent, CardHeader, useTheme } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useGetMisDashboardErpYearWiseQuery } from "../../../redux/service/misDashboardServiceERP";
import YearWiseTable from "./TableData/YearWiseTable";

const YearWiseTurnover = ({ companyName, finYear, finYr, filterBuyerList }) => {
  const [xdata, setXdata] = useState([]);
  const [ydata, setYdata] = useState([]);
  const theme = useTheme();
  const [showTable, setShowTable] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const { data: response, isLoading } = useGetMisDashboardErpYearWiseQuery({
    params: { finYear, companyName },
  });
  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  useEffect(() => {
    if (response?.data) {
      setXdata(response.data.map((item) => item.year));
      setYdata(response.data.map((item) => item.value));
    }
  }, [response]);

  const colorArray = [
    "#8A37DE", "#005E72", "#E5181C", "#056028", "#1F2937",
    "#F44F5E", "#E55A89", "#D863B1", "#CA6CD8", "#B57BED",
    "#8D95EB", "#62ACEA", "#4BC3E6",
  ];

  const options = {
    chart: {
      type: "column",
      height: 380,
      options3d: {
        enabled: true,
        alpha: 7,
        beta: 7,
        depth: 50,
        viewDistance: 25,
      },
      // marginBottom: 50,
      backgroundColor: "#FFFFFF",
      borderRadius: "10px",
    },
    title: null,
    legend: { enabled: false },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormatter() {
        return `Turnover: <b>${formatINR(this.y)}</b>`;
      },
      style: { fontSize: "12px", color: "black" },
    },

    xAxis: {
      categories: xdata,
      labels: { style: { fontSize: "11px", color: "#6B7280" } },
      title: {
        text: "Year",
        style: { fontSize: "12px", fontWeight: "bold", color: "#374151" },
        margin: 30,
      },
    },
    yAxis: {
      title: {
        text: "Turnover",
        style: { fontSize: "12px", fontWeight: "bold", color: "#374151" },
        margin: 25,
      },
      labels: {
        formatter() {
          return formatINR(this.value);
        },
        style: { fontSize: "11px", color: "#6B7280" },
      },
    },
    plotOptions: {
      column: { depth: 25, colorByPoint: true, borderRadius: 5 },
      series: {
        point: {
          events: {
            click: function () {
              setSelectedYear({
                year: this.category
              });
              setShowTable(true);
            },
          },
        },
      },
    },
    colors: colorArray,
    series: [
      {
        name: "Turnover",
        data: ydata,
        dataLabels: {
          enabled: true,
          formatter() {
            return formatINR(this.y);
          },
          style: { fontSize: "11px", color: "#333" },
        },

      },
    ],
  };

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1, }}>
      <CardHeader
        title="Year Wise Turnover"
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{
          p: 1,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
      />
      <CardContent>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Loading...
          </div>
        ) : (
          <HighchartsReact highcharts={Highcharts} options={options} immutable />
        )}
      </CardContent>
      {showTable && selectedYear && (
        <YearWiseTable
          year={selectedYear.year} filterBuyerList={filterBuyerList}
          finYr={finYr}

          closeTable={() => setShowTable(false)}
        />
      )}
    </Card>
  );
};

export default YearWiseTurnover;

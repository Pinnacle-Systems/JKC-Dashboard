// import React, { useState } from "react";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import Drilldown from "highcharts/modules/drilldown";
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   useTheme
// } from "@mui/material";
// import { useGetMisDashboardErpStyleItemWiseQuery } from "../../../redux/service/misDashboardServiceERP";
// import ItemWiseTable from "../salarydata/TableData/ItemWiseTable";

// Drilldown(Highcharts);

// const COLORS = [
//   "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
//   "#B435E3", "#E35B5B", "#FFA500", "#800080",
//   "#00CED1", "#DC143C",
// ];

// const Form = ({ finYear, companyName, finYr, filterBuyerList }) => {
//   const theme = useTheme();
//   const [showTable, setShowTable] = useState(false);
//   const [selectedItem, setSelectedItem] = useState('')
//   const formatINR = (value) =>
//     `₹ ${Number(value).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })}`;

//   const { data: response } =
//     useGetMisDashboardErpStyleItemWiseQuery({
//       params: { finYear, companyName },
//     });

//   const filteredData = Array.isArray(response?.data)
//     ? response.data.filter(i => Number(i.value) > 0)
//     : [];

//   // ------------------ AGGREGATION ------------------
//   const categoryTotal = {};
//   const drilldownTemp = {}; // category -> styleItem -> value

//   filteredData.forEach(item => {
//     const category = item.category;
//     let style = item.styleItem;
//     if (style.startsWith(category + "/")) {
//       style = style.substring(category.length + 1); // remove "CATEGORY/"
//     }
//     const value = Number(item.value);

//     // 1️⃣ Category total
//     categoryTotal[category] = (categoryTotal[category] || 0) + value;

//     // 2️⃣ Style item total inside category
//     if (!drilldownTemp[category]) {
//       drilldownTemp[category] = {};
//     }

//     drilldownTemp[category][style] =
//       (drilldownTemp[category][style] || 0) + value;
//   });

//   // ------------------ MAIN SERIES ------------------
//   const mainSeries = Object.keys(categoryTotal).map((cat, i) => ({
//     name: cat,
//     y: categoryTotal[cat],
//     drilldown: cat,
//     color: COLORS[i % COLORS.length],
//   }));

//   // ------------------ DRILLDOWN SERIES ------------------
//   const drilldownSeries = Object.keys(drilldownTemp).map(cat => ({
//     id: cat,
//     name: `${cat} Style Items`,
//     data: Object.entries(drilldownTemp[cat]).map(
//       ([style, value]) => [style, value]
//     ),

//   }));


//   const options = {
//     chart: {
//       type: "column",
//       height: 420,
//     },

//     title: { text: "" },

//     xAxis: {
//       type: "category",
//       labels: {
//         useHTML: true,
//         rotation: -45, // rotate labels -45 degrees
//         align: 'right', // optional, for better alignment
//         fontWeight: "400",   // ✅ force normal

//         style: {
//           color: "black",
//           fontSize: "11px",
//           textDecoration: "none",
//           cursor: "pointer",
//           fontWeight: "400", // ✅ works now

//         },
//       },
//     },


//     yAxis: {
//       title: { text: "Turnover" },
//       labels: {
//         formatter() {
//           return formatINR(this.value);
//         },
//       },
//     },

//     tooltip: {
//       pointFormatter() {
//         return `<b>${formatINR(this.y)}</b>`;
//       },
//     },

//     plotOptions: {
//       series: {
//         dataLabels: {
//           enabled: true,
//           formatter() {
//             return formatINR(this.y);
//           },
//           style: {
//             color: "#000",
//             fontWeight: "400",   // ✅ force normal
//             fontSize: "11px",
//           },
//         },
//       },




//       column: {
//         borderRadius: 3,
//         pointWidth: 30,
//       },
//     },

//     series: [
//       {
//         name: "Category",
//         colorByPoint: true,
//         data: mainSeries,
//       },
//     ],

//     drilldown: {
//       series: drilldownSeries.map((s) => ({
//         ...s,
//         data: s.data.map(([name, value]) => [name, value]),
//         // format dataLabels for drilldown
//         dataLabels: {
//           enabled: true,
//           formatter() {
//             return formatINR(this.y);
//           },
//           style: { color: "#000", fontWeight: "400", fontSize: "11px" },
//         },
//         point: {
//           events: {
//             click: function () {
//               // Drilldown bar clicked
//               setSelectedItem({
//                 category: s.id,     // category name
//                 styleItem: this.category, // drilldown bar name
//                 value: this.y,
//               });
//               setShowTable(true); // open table
//             },
//           },
//         },
//       })),
//       activeDataLabelStyle: { color: "#000", fontWeight: "400", textDecoration: "none" },
//       drillUpButton: {
//         position: { align: "right", verticalAlign: "top", x: -10, y: 10 },
//         theme: {
//           fill: "#fff",
//           stroke: "#ccc",
//           "stroke-width": 1,
//           r: 3,
//           style: { color: "#000", fontWeight: "400" },
//         },
//       },
//       // format tooltip for drilldown
//       tooltip: {
//         pointFormatter() {
//           return `<b>${formatINR(this.y)}</b>`;
//         },
//       },
//     },


//     legend: { enabled: false },
//   };

//   return (
//     <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
//       <CardHeader
//         title="Style Group Wise Turnover"
//         titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
//         sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}

//       />
//       <CardContent>
//         <HighchartsReact highcharts={Highcharts} options={options} />

//         {showTable && selectedItem && (
//           <ItemWiseTable
//             companyName={companyName}
//             filterBuyerList={filterBuyerList}
//             finYr={finYr}

//             closeTable={() => setShowTable(false)}
//           />
//         )}
//       </CardContent>

//     </Card>
//   );
// };

// export default Form;


// import React, { useState } from "react";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   Button,
//   useTheme,
// } from "@mui/material";
// import { useGetMisDashboardErpStyleItemWiseQuery } from "../../../redux/service/misDashboardServiceERP";
// import ItemWiseTable from "../salarydata/TableData/ItemWiseTable";

// const COLORS = [
//   "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
//   "#B435E3", "#E35B5B", "#FFA500", "#800080",
//   "#00CED1", "#DC143C",
// ];

// const Form = ({ finYear, companyName, finYr, filterBuyerList }) => {
//   const theme = useTheme();

//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedStyleName, setSelectedStyleName] = useState(null);
//   const [selectedStyleFull, setSelectedStyleFull] = useState(null);
//   const [selectedValue, setSelectedValue] = useState(null);
//   const [showTable, setShowTable] = useState(false);



//   const formatINR = (value) =>
//     `₹ ${Number(value).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })}`;

//   const { data: response } =
//     useGetMisDashboardErpStyleItemWiseQuery({
//       params: { finYear, companyName },
//     });

//   const rawData = Array.isArray(response?.data) ? response.data : [];

//   /* ---------------- AGGREGATION ---------------- */

//   const categoryTotal = {};
//   const styleItemMap = {}; // category -> style -> value

//   rawData.forEach((item) => {
//     if (Number(item.value) <= 0) return;

//     const category = item.category;
//     let style = item.styleItem;

//     if (style.startsWith(category + "/")) {
//       style = style.replace(category + "/", "");
//     }

//     const value = Number(item.value);

//     categoryTotal[category] = (categoryTotal[category] || 0) + value;

//     if (!styleItemMap[category]) styleItemMap[category] = {};
//     styleItemMap[category][style] =
//       (styleItemMap[category][style] || 0) + value;
//   });

//   /* ---------------- CATEGORY CHART ---------------- */

//   const categoryOptions = {
//     chart: { type: "column", height: 420 },
//     title: { text: "" },

//     xAxis: {
//       type: "category",
//       labels: {
//         rotation: -45,
//         style: { fontSize: "11px", fontWeight: "400" },
//       },
//     },

//     yAxis: {
//       title: { text: "Turnover" },
//       labels: {
//         formatter() {
//           return formatINR(this.value);
//         },
//       },
//     },

//     tooltip: {
//       pointFormatter() {
//         return `<b>${formatINR(this.y)}</b>`;
//       },
//     },

//     plotOptions: {
//       series: {
//         cursor: "pointer",
//         dataLabels: {
//           enabled: true,
//           formatter() {
//             return formatINR(this.y);
//           },
//           style: { fontSize: "11px", fontWeight: "400" },
//         },
//         point: {
//           events: {
//             click() {
//               setSelectedCategory(this.name);   // ✅ CATEGORY NAME
//               setShowTable(false);              // reset table
//             },
//           },
//         },

//       },
//       column: {
//         borderRadius: 3,
//         pointWidth: 30,
//       },
//     },

//     legend: { enabled: false },

//     series: [
//       {
//         name: "Category",
//         colorByPoint: true,
//         data: Object.keys(categoryTotal).map((cat, i) => ({
//           name: cat,
//           y: categoryTotal[cat],
//           color: COLORS[i % COLORS.length],
//         })),
//       },
//     ],
//   };

//   /* ---------------- STYLE ITEM CHART ---------------- */

//   const styleItemOptions = {
//     chart: { type: "column", height: 420 },
//     title: { text: `${selectedCategory} – Style Item Wise Turnover` },

//     xAxis: {
//       type: "category",
//       labels: {
//         rotation: -45,
//         style: { fontSize: "11px", fontWeight: "400" },
//       },
//     },

//     yAxis: {
//       title: { text: "Turnover" },
//       labels: {
//         formatter() {
//           return formatINR(this.value);
//         },
//       },
//     },

//     tooltip: {
//       pointFormatter() {
//         return `<b>${formatINR(this.y)}</b>`;
//       },
//     },

//     plotOptions: {
//       series: {
//         cursor: "pointer",
//         dataLabels: {
//           enabled: true,
//           formatter() {
//             return formatINR(this.y);
//           },
//           style: { fontSize: "11px", fontWeight: "400" },
//         },
//         point: {
//           events: {
//             click() {
//               setSelectedStyleName(this.name);                // ✅ STYLE NAME
//               setSelectedStyleFull(`${selectedCategory}/${this.name}`); // ✅ FULL PATH
//               setSelectedValue(this.y);
//               setShowTable(true);
//             },
//           },
//         },


//       },
//       column: {
//         borderRadius: 3,
//         pointWidth: 30,
//       },
//     },

//     legend: { enabled: false },

//     series: [
//       {
//         name: "Style Item",
//         colorByPoint: true,
//         data: Object.entries(styleItemMap[selectedCategory] || {}).map(
//           ([style, value], i) => ({
//             name: style,
//             y: value,
//             color: COLORS[i % COLORS.length],
//           })
//         ),
//       },
//     ],
//   };

//   /* ---------------- RENDER ---------------- */

//   return (
//     <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
//       <CardHeader
//         title="Style Group Wise Turnover"
//         titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
//         sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
//       />

//       <CardContent>
//         {selectedCategory && (
//           <Button
//             size="small"
//             onClick={() => {
//               setSelectedCategory(null);
//               setShowTable(false);
//             }}
//             sx={{ mb: 1 }}
//           >
//             ⬅ Back to Category
//           </Button>
//         )}

//         <HighchartsReact
//           highcharts={Highcharts}
//           options={selectedCategory ? styleItemOptions : categoryOptions}
//         />

//         {showTable && selectedStyleName && (
//           <ItemWiseTable
//             companyName={companyName}
//             finYr={finYr}
//             filterBuyerList={filterBuyerList}
//             category={selectedCategory}          // FIRST chart selection
//             styleName={selectedStyleName}        // SECOND chart selection
//             styleItem={selectedStyleFull}        // OPTIONAL (full path)
//             value={selectedValue}
//             closeTable={() => setShowTable(false)}
//           />
//         )}

//       </CardContent>
//     </Card>
//   );
// };

// export default Form;
import React, { useState, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardContent, CardHeader, useTheme } from "@mui/material";
import { useGetMisDashboardErpStyleItemWiseQuery } from "../../../redux/service/misDashboardServiceERP";
import ItemWiseTable from "../salarydata/TableData/ItemWiseTable";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#B435E3", "#E35B5B", "#FFA500", "#800080",
  "#00CED1", "#DC143C",
];

const Form = ({ finYear, companyName, finYr, filterBuyerList }) => {
  const theme = useTheme();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStyleName, setSelectedStyleName] = useState(null);
  const [selectedStyleFull, setSelectedStyleFull] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const { data: response } =
    useGetMisDashboardErpStyleItemWiseQuery({
      params: { finYear, companyName },
    });

  const rawData = useMemo(
    () => (Array.isArray(response?.data) ? response.data : []),
    [response?.data]
  );

  /* ---------------- AGGREGATION ---------------- */

  const categoryTotal = {};
  const styleItemMap = {};

  rawData.forEach((item) => {
    if (Number(item.value) <= 0) return;

    const category = item.category;
    let style = item.styleItem;

    if (style?.startsWith(category + "/")) {
      style = style.replace(category + "/", "");
    }

    const value = Number(item.value);

    categoryTotal[category] = (categoryTotal[category] || 0) + value;

    if (!styleItemMap[category]) styleItemMap[category] = {};
    styleItemMap[category][style] =
      (styleItemMap[category][style] || 0) + value;
  });

  /* ---------------- BACK BUTTON INSIDE CHART ---------------- */

  const withBackButton = (options) => ({
    ...options,
    chart: {
      ...options.chart,
      events: {
        render() {
          const chart = this;

          if (chart.customBackBtn) {
            chart.customBackBtn.destroy();
            chart.customBackBtn = null;
          }

          if (!selectedCategory) return;

          chart.customBackBtn = chart.renderer
            .button(
              `⬅ ${selectedCategory}`,
              10,
              10,
              () => {
                setSelectedCategory(null);
                setSelectedStyleName(null);
                setSelectedStyleFull(null);
                setSelectedValue(null);
                setShowTable(false);
              },
              {
                fill: "#e3f2fd",
                stroke: "#1976d2",
                r: 4,
              }
            )
            .css({
              color: "#0d47a1",
              fontSize: "11px",
              fontWeight: "600",
            })
            .add();
        },
      },
    },
  });

  /* ---------------- CATEGORY CHART ---------------- */

  const categoryOptions = withBackButton({
    chart: { type: "column", height: 420  ,  spacingTop: 40,   // 👈 ADD THIS
 },
    title: { text: null },

    xAxis: {
      type: "category",
      labels: { rotation: -45, style: { fontSize: "11px" } },
    },

    yAxis: {
      title: { text: "Turnover" },
      labels: { formatter() { return formatINR(this.value); } },
    },

    tooltip: {
      pointFormatter() {
        return `<b>${formatINR(this.y)}</b>`;
      },
    },

    plotOptions: {
      series: {
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          formatter() { return formatINR(this.y); },
          style: { fontSize: "11px" },
        },
        point: {
          events: {
            click() {
              setSelectedCategory(this.name);
              setShowTable(false);
            },
          },
        },
      },
      column: { borderRadius: 3, pointWidth: 30 },
    },

    legend: { enabled: false },

    series: [
      {
        name: "Category",
        colorByPoint: true,
        data: Object.keys(categoryTotal).map((cat, i) => ({
          name: cat,
          y: categoryTotal[cat],
          color: COLORS[i % COLORS.length],
        })),
      },
    ],
  });

  /* ---------------- STYLE ITEM CHART ---------------- */

  const styleItemOptions = withBackButton({
    chart: { type: "column", height: 420 ,    spacingTop: 50,   // 👈 ADD THIS
},
    title: { text: null },

    xAxis: {
      type: "category",
      labels: { rotation: -45, style: { fontSize: "11px" } },
    },

    yAxis: {
      title: { text: "Turnover" },
      labels: { formatter() { return formatINR(this.value); } },
    },

    tooltip: {
      pointFormatter() {
        return `<b>${formatINR(this.y)}</b>`;
      },
    },

    plotOptions: {
      series: {
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          formatter() { return formatINR(this.y); },
          style: { fontSize: "11px" },
        },
        point: {
          events: {
            click() {
              setSelectedStyleName(this.name);
              setSelectedStyleFull(`${selectedCategory}/${this.name}`);
              setSelectedValue(this.y);
              setShowTable(true);
            },
          },
        },
      },
      column: { borderRadius: 3, pointWidth: 30 },
    },

    legend: { enabled: false },

    series: [
      {
        name: "Style Item",
        colorByPoint: true,
        data: Object.entries(styleItemMap[selectedCategory] || {}).map(
          ([style, value], i) => ({
            name: style,
            y: value,
            color: COLORS[i % COLORS.length],
          })
        ),
      },
    ],
  });

  /* ---------------- RENDER ---------------- */

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Style Group Wise Turnover"
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent sx={{ pt: 1 }}>
        <HighchartsReact
          highcharts={Highcharts}
          options={selectedCategory ? styleItemOptions : categoryOptions}
        />

        {showTable && selectedStyleName && (
          <ItemWiseTable
            companyName={companyName}
            finYr={finYr}
            filterBuyerList={filterBuyerList}
            category={selectedCategory}
            styleName={selectedStyleName}
            styleItem={selectedStyleFull}
            value={selectedValue}
            closeTable={() => setShowTable(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Form;

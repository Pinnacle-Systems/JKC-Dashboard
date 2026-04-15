import { useState, useEffect } from 'react';
import { Root, XYChart, CategoryAxis, ValueAxis, ColumnSeries, XYCursor, Tooltip, percent } from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const AmChartsXYChart = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // Set themes
        Root.use(am5themes_Animated);

        // Create chart
        const chart = XYChart.new(document.getElementById("chartdiv"), {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            paddingLeft: 5,
            paddingRight: 5
        });

        // Add cursor
        const cursor = chart.set("cursor", XYCursor.new({}));
        cursor.lineY.set("visible", false);

        // Create axes
        const xAxis = chart.xAxes.push(CategoryAxis.new({ categoryField: "country" }));
        xAxis.renderer.grid.template.setAll({ location: 1 });

        const yAxis = chart.yAxes.push(ValueAxis.new());

        // Create series
        const series = chart.series.push(ColumnSeries.new({
            name: "Series 1",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            sequencedInterpolation: true,
            categoryXField: "country"
        }));

        series.columns.template.setAll({
            width: percent(120),
            fillOpacity: 0.9,
            strokeOpacity: 0
        });

        series.columns.template.adapters.add("fill", (fill, target) => {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

        series.columns.template.adapters.add("stroke", (stroke, target) => {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

        series.columns.template.set("draw", function (display, target) {
            var w = target.getPrivate("width", 0);
            var h = target.getPrivate("height", 0);
            display.moveTo(0, h);
            display.bezierCurveTo(w / 4, h, w / 4, 0, w / 2, 0);
            display.bezierCurveTo(w - w / 4, 0, w - w / 4, h, w, h);
        });

        // Set data
        const data = [{
            country: "USA",
            value: 2025
        }, {
            country: "China",
            value: 1882
        }, {
            country: "Japan",
            value: 1809
        }, {
            country: "Germany",
            value: 1322
        }, {
            country: "UK",
            value: 1122
        }, {
            country: "France",
            value: 1114
        }, {
            country: "India",
            value: 984
        }, {
            country: "Spain",
            value: 711
        }, {
            country: "Netherlands",
            value: 665
        }, {
            country: "South Korea",
            value: 443
        }, {
            country: "Canada",
            value: 441
        }];

        xAxis.data.setAll(data);
        series.data.setAll(data);

        // Make stuff animate on load
        series.appear(1000);
        chart.appear(1000, 100);

        // Cleanup function
        return () => {
            chart.dispose();
        };
    }, []);

    return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
};

export default AmChartsXYChart;

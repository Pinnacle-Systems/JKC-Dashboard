import React, { useEffect } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const LineChartAmp = ({ id, valueXField, valueYFieldS1, valueYFieldS2, data = [] }) => {
    console.log(data, 'data')
    useEffect(() => {
        // Create root element
        const root = am5.Root.new(id);

        // Set themes
        root.setThemes([am5themes_Animated.new(root)]);

        // Create chart
        const chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            pinchZoomX: true
        }));

        chart.get("colors").set("step", 3);

        // Add cursor
        const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);

        // Create axes
        const xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
            maxDeviation: 0.3,
            baseInterval: {
                timeUnit: "day",
                count: 1
            },
            renderer: am5xy.AxisRendererX.new(root, { minorGridEnabled: true }),
            tooltip: am5.Tooltip.new(root, {})
        }));

        const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0.3,
            renderer: am5xy.AxisRendererY.new(root, {})
        }));

        // Add series
        const series = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Series 1",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: valueYFieldS1,
            valueXField,
            tooltip: am5.Tooltip.new(root, {
                labelText: "{date}"
            })
        }));

        series.strokes.template.setAll({
            strokeWidth: 2
        });

        series.get("tooltip").get("background").set("fillOpacity", 0.5);

        const series2 = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Series 2",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: valueYFieldS2,
            valueXField
        }));
        series2.strokes.template.setAll({
            strokeDasharray: [2, 2],
            strokeWidth: 2
        });

        // Set date fields
        // root.dateFormatter.setAll({
        //     dateFormat: "yyyy-MM-dd",
        //     dateFields: ["year"]
        // });

        series.data.setAll(data);
        series2.data.setAll(data);

        // Make stuff animate on load
        series.appear(1000);
        series2.appear(1000);
        chart.appear(1000, 100);

        // Clean up function
        return () => {
            root.dispose();
        };
    }, [id, valueXField, valueYFieldS1, valueYFieldS2, data]); // empty dependency array for componentDidMount effect

    return <div id={id} style={{ width: '100%', height: '100%' }} />;
};

export default LineChartAmp;
import React, { useEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const ArcPieChart = ({ suppEfficiency }) => {
    useEffect(() => {
        am4core.useTheme(am4themes_animated);

        let chart = am4core.create('piechartdiv', am4charts.PieChart3D);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

        chart.data = suppEfficiency.map(item => ({
            country: item.supplier,
            litres: item.poQty,
        }));

        let series = chart.series.push(new am4charts.PieSeries3D());
        series.dataFields.value = 'litres';
        series.dataFields.category = 'country';

        series.colors.list = [
            am4core.color('#FF5733'), // Red
            am4core.color('#FFC300'), // Yellow
            am4core.color('#36A2EB'), // Blue
            am4core.color('#4CAF50'), // Green
            am4core.color('#9B59B6'), // Purple
            am4core.color('#E74C3C'), // Dark Red
        ];
        series.labels.template.wrap = true;
        series.labels.template.maxWidth = 100; // Adjust as needed
        series.labels.template.truncate = true;

        series.labels.template.fontSize = 11;
        series.ticks.template.fontSize = 10;


        chart.logo.disabled = true;

        return () => {
            chart.dispose();
        };
    }, [suppEfficiency]);

    return <div id="piechartdiv" style={{ width: '100%', height: '300px' }}></div>;
};

export default ArcPieChart;

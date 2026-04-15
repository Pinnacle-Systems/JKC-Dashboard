import React, { useEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const PieChartTemplate = ({ data = [], valueField = '', categoryField = '', colorList = [], className = '' }) => {
    useEffect(() => {
        am4core.useTheme(am4themes_animated);

        let chart = am4core.create('chartdiv', am4charts.PieChart3D);
        chart.hiddenState.properties.opacity = 0;



        chart.data = data;

        let series = chart.series.push(new am4charts.PieSeries3D());
        series.dataFields.value = valueField;
        series.dataFields.category = categoryField;
        series.labels.template.wrap = true;
        series.labels.template.maxWidth = 60;
        series.labels.template.truncate = true;

        series.labels.template.fontSize = 11;
        series.ticks.template.fontSize = 10;
        series.colors.list = colorList.map(i => am4core.color(i.color));
        chart.logo.disabled = true;
        return () => {
            chart.dispose();
        };
    }, [data, valueField, categoryField, colorList]);

    return <div id="chartdiv" style={{ width: '100%', height: 230 }} className={className}></div>;
};

export default PieChartTemplate;

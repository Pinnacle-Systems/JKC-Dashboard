import React, { useEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const ChartComponent = ({ topItems }) => {
  useEffect(() => {
    am4core.ready(function () {
      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end

      let chart = am4core.create("sidechartdiv", am4charts.XYChart);
      chart.padding(40, 40, 40, 40);

      // Create category axis
      let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = "poQty"; // Change to your data field
      categoryAxis.renderer.minGridDistance = 1;
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.disabled = true;

      // Reduce font size of category axis labels
      categoryAxis.renderer.labels.template.fontSize = 12; // Adjust font size as needed

      // Modify category axis labels to include extra information
      categoryAxis.renderer.labels.template.adapter.add("text", function (text, target) {
        // Assuming 'topItems' is an array of objects with 'poQty' and 'additionalInfo' properties
        let item = topItems.find(item => item.poQty === text);
        if (item) {
          // Customize the label text as needed:
          return `${item.additionalInfo} - ${text}`;
        }
        return text;
      });

      // Create value axis
      let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;

      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryY = "poQty"; // Change to your data field
      series.dataFields.valueX = "poQty"; // Change to your data field
      series.tooltipText = "{categoryY}: {valueX.value}"; // Show article ID on hover
      series.columns.template.strokeOpacity = 0;
      series.columns.template.column.cornerRadiusBottomRight = 5;
      series.columns.template.column.cornerRadiusTopRight = 5;

      // Customize series colors
      series.columns.template.fill = am4core.color("#7B1FA2"); // Change to your desired color
      series.columns.template.stroke = am4core.color("#512DA8"); // Change to your desired color

      // Create label bullet
      let labelBullet = series.bullets.push(new am4charts.LabelBullet())
      labelBullet.label.horizontalCenter = "left";
      labelBullet.label.dx = 10;
      labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
      labelBullet.locationX = 1;

      // Reduce font size of label bullets
      labelBullet.label.fontSize = 12; // Adjust font size as needed

      // Color adapter
      series.columns.template.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
      });

      categoryAxis.sortBySeries = series;

      // Set data
      chart.data = topItems;
    });
  }, [topItems]); // Include topItems in the dependency array

  return <div id="sidechartdiv" style={{ width: '100%', height: '300px' }}></div>;
};

export default ChartComponent;

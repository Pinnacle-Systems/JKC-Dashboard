import React, { memo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const StyleGroupChart = memo(({ options }) => {
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
});

export default StyleGroupChart;

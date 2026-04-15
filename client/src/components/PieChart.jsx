import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import * as React from 'react';

export default function PieCharts() {
  const data = [
    { value: 5, label: 'Q1', color: '#adb612' },
    { value: 5, label: 'Q1', color: '#adb612' },
    { value: 10, label: 'Q2', color: '#7f7f7f' },
    { value: 25, label: 'Q3', color: '#303030' },

  ];

  const size = {
    width: 400,
    height: 220,
  };
  return (
    <div> <h1 className='text-center font-semibold text-lg'>Supplier Efficiency</h1>   <PieChart
      series={[
        {
          arcLabel: (item) => `${item.label} (${item.value})`,

          innerRadius: 30,
          outerRadius: 100,
          paddingAngle: 5,
          cornerRadius: 5,
          startAngle: -90,
          endAngle: 180,
          cx: 100,
          cy: 95,
          data,
        }
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'white',
          fontWeight: 'medium',
        },
      }}
      {...size}
    /></div>
  );
}



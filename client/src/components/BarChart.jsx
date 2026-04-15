import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BarCharts({ topItems }) {
  // Map the data to match the format expected by the BarChart component
  const seriesData = topItems.map((item) => ({
    data: [item.poQty.toFixed(2)], // Truncate to 2 decimal places
    color: '#adb612', // Customize the color if needed
  }));

  // Function to truncate article IDs
  const truncateArticleId = (articleId, maxLength) => {
    return articleId.length > maxLength ? articleId.substring(0, maxLength) + '...' : articleId;
  };

  return (
    <div className='w-full'>
      <h1 className='text-center text-lg font-semibold'>Quarterly Status</h1>
      <BarChart
        series={seriesData}
        height={250}
        width={450}
        xAxis={[{ data: topItems.map((item) => truncateArticleId(item.articleId, 10)), scaleType: 'band' }]}
        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
        barWidth={30} // Adjust the width of the bars as needed
        valueInsideBar={{ enabled: true }} // Show the value (article ID) inside the bars
      />
    </div>
  );
}

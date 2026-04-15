import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function ChartsOverviewDemo({ taxValue }) {
    console.log(taxValue, 'taxValue');

    // Group taxValue by month
    const groupedByMonth = {};
    taxValue.forEach(item => {
        if (!groupedByMonth[item.month]) {
            groupedByMonth[item.month] = [item.taxVal];
        } else {
            groupedByMonth[item.month].push(item.taxVal);
        }
    });
    const csgstArr = [];
    const igstArr = [];
    for (const key in groupedByMonth) {
        csgstArr.push(groupedByMonth[key][0])
        igstArr.push(groupedByMonth[key][1])
    }

    return (
        <BarChart
            series={[
                { data: csgstArr, label: "CSGST" },
                { data: igstArr, label: "IGST" },
            ]}
            colors={['#303030', '#adb612']}
            height={290}
            xAxis={[{ data: Object.keys(groupedByMonth), scaleType: 'band' }]}
            margin={{ left: 80 }}
        />
    );
}

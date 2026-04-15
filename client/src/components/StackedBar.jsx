import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

const StackedBarChart = ({ monthlyReceivables, id, fabStatus }) => {
    console.log(monthlyReceivables, 'month');
    const categories = monthlyReceivables?.monthData || fabStatus || [];


    const seriesData = (monthlyReceivables?.supplierData || fabStatus || []).map(item => ({
        name: item.supplier,
        data: item.monthWisePoReceivable
    }));


    const options = {
        series: seriesData,
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            stackType: '100%',
            toolbar: {
                show: true,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,

                dataLabels: {
                    total: {
                        enabled: false,
                    },
                },
            },
        },
        xaxis: {
            type: 'category',
            categories: categories,
        },
        legend: {
            show: false,
        },
        fill: {
            opacity: 1,
        },
    };

    useEffect(() => {
        const chart = new ApexCharts(document.querySelector(`#${id}`), options);
        chart.render();

        return () => {
            chart.destroy();
        };
    }, [options, monthlyReceivables, id]);

    return <div id={id} />;
};

export default StackedBarChart;

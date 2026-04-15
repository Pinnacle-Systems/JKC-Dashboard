import React, { useState, useRef, useContext } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import html2canvas from 'html2canvas';
import { IoMdDownload } from "react-icons/io"; import { useGetYearlyCompQuery } from '../../../redux/service/misDashboardService';
import { ColorContext } from '../../global/context/ColorContext';
import CardWrapper from '../../../components/CardWrapper';
import { CiMenuKebab } from "react-icons/ci";
import DataDetailTable from '../../../components/DataDetailTable1';

Highcharts3D(Highcharts);

const YearlyComChart = () => {
    const { data: comparisionData } = useGetYearlyCompQuery({ params: {} });
    const { color } = useContext(ColorContext);
    const [openpopup, setOpenpopup] = useState(false)
    const yearlyComparision = comparisionData?.data || [];
    const chartRef = useRef(null);
    console.log(openpopup, "openpopup")
    const groupedData = yearlyComparision.reduce((acc, curr) => {
        if (!acc[curr.year]) {
            acc[curr.year] = [];
        }
        acc[curr.year].push(curr);
        return acc;
    }, {});

    const years = Object.keys(groupedData);
    const categories = [...new Set(yearlyComparision.map(order => order.customer))];

    const series = years.flatMap(year => [
        {
            name: 'Male',
            data: categories.map(customer => {
                const order = groupedData[year]?.find(o => o.customer === customer);
                return order ? order.male : 0;
            }),
            color: color || '#DE9A07',
        },
        {
            name: 'Female',
            data: categories.map(customer => {
                const order = groupedData[year]?.find(o => o.customer === customer);
                return order ? order.female : 0;
            }),
            color: '#1F2937',
        },
    ]);

    const options = {
        chart: {
            type: 'column',
            height: 360,
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 10,
                depth: 40,
                viewDistance: 30,
            },
            backgroundColor: '#FFFFFF',
            marginBottom: 100,
        },
        title: null,
        xAxis: {
            categories,
            title: {
                text: 'Divisions',
                style: {
                    color: '#374151',
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
            },
            labels: {
                style: { color: '#6B7280', fontSize: '10px' },
                rotation: -45,
                align: 'right',
                overflow: 'justify',
                step: 1,
                padding: 10,
            },
            tickInterval: 1,
        },
        yAxis: {
            title: {
                text: 'Number of Employees',
                style: {
                    fontSize: '12px',
                    color: '#374151',
                    fontWeight: 'bold',
                },
            },
            labels: {
                style: { fontSize: '10px', color: '#9CA3AF' },
            },
        },
        tooltip: {
            shared: true,
            useHTML: true,
            backgroundColor: '#FFFFFF',
            borderColor: '#D1D5DB',
            shadow: true,
            style: { color: '#374151', fontSize: '10px' },
            formatter: function () {
                return `<b>${this.x}</b><br/>
                    ${this.points
                        .map(
                            point =>
                                `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${point.y}</b><br/>`
                        )
                        .join('')}`;
            },
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                depth: 40,
                pointWidth: 15,
                borderRadius: 5,
            },
        },
        legend: {
            align: 'center',
            verticalAlign: 'top',
            layout: 'horizontal',
            itemStyle: { color: '#374151', fontSize: '10px', fontWeight: '500' },
        },
        series,
    };

    return (
        <CardWrapper heading="Employee Strength As On Date" chartRef={chartRef} showFilter={false} Doption={true}>
            {openpopup && <DataDetailTable graph={true} setOpenpopup={setOpenpopup} />}

            <div id="chart" className="relative pt-2 rounded" onClick={() => setOpenpopup(true)}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    ref={(chartComponent) => {
                        if (chartComponent) {
                            chartRef.current = chartComponent.container.current;
                        }
                    }}
                    containerProps={{
                        style: {
                            minWidth: '100%',
                            height: '100%',
                            borderRadius: "10px",
                        }
                    }}
                />

            </div>
        </CardWrapper>

    );
};

export default YearlyComChart;

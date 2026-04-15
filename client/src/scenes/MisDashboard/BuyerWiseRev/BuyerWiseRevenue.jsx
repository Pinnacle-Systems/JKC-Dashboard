import React, { useContext, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import { ColorContext } from '../../global/context/ColorContext';
import html2canvas from 'html2canvas';
import { IoMdDownload } from "react-icons/io";

Highcharts3D(Highcharts);

const BuyerWiseRevenueGen = ({ buyerRev }) => {
    const { color } = useContext(ColorContext);
    const chartRef = useRef(null);
    const buyerWiseRev = buyerRev || [];
    const options = {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 40
            },
            backgroundColor: '#FFFFFF',
            width: 330,
            height: 350,
            borderRadius: 10
        },
        title: {
            text: '',
            align: 'left',
            style: {
                color: '#000000',
                fontWeight: 'normal'
            }
        },
        subtitle: {
            text: '',
            align: 'left',
            style: {
                color: '#000000',
                fontWeight: 'normal'
            }
        },
        plotOptions: {
            pie: {
                innerSize: 100,
                depth: 45,
                dataLabels: {
                    formatter: function () {
                        return `${this.point.name}`;
                    },
                    style: {
                        color: '#000000',
                        fontWeight: 'normal'
                    }
                }
            }
        },
        tooltip: {
            style: {
                color: '#374151',
                fontSize: '10px'
            },
            headerFormat: '<b>Age: {point.key}</b><br/>',
            pointFormatter: function () {
                return `
                    <span style="color:${this.color}">\u25CF</span>
                    <span style="color: #2d2d2d;"> Employees: <b>${this.y.toLocaleString()}</b></span><br/>
                `;
            }
        },
        series: [
            {
                name: 'Employees',
                data: buyerWiseRev.map((item, index) => ({
                    name: item.buyer,
                    y: item.value,
                    color: index === 0 && color ? color : undefined
                }))
            }
        ],
        credits: {
            enabled: false
        }
    };

    return (
        <div className="relative">
            {/* Chart */}
            <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />

            {/* Options Button */}
       
        </div>
    );
};

export default BuyerWiseRevenueGen;

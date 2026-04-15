import React, { useRef, useEffect } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const { CanvasJSChart } = CanvasJSReact;

const StackedBarChart = ({ monthlyReceivables }) => {
    const chartRef = useRef(null);


    const options = {
        animationEnabled: true,
        exportEnabled: true,
        title: {

        },
        toolTip: {
            shared: true,
            reversed: true,
        },
        data: monthlyReceivables.reduce((acc, { month, po, supplier }) => {
            const existingSeriesIndex = acc.findIndex((series) => series.name === supplier);
            if (existingSeriesIndex !== -1) {
                acc[existingSeriesIndex].dataPoints.push({ label: month, y: po });
            } else {
                acc.push({
                    type: 'stackedColumn',
                    name: supplier,
                    showInLegend: false,
                    yValueFormatString: '#,###',
                    dataPoints: [{ label: month, y: po }],
                });
            }
            return acc;
        }, []),
        toolTipContent: `<strong>{name}</strong>`,
    };

    useEffect(() => {
        chartRef.current.render();
    }, []);

    return (
        <div>
            <CanvasJSChart options={options} onRef={(ref) => (chartRef.current = ref)} />
        </div>
    );
};

export default StackedBarChart;

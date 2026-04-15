import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';


const App = ({ shipped, canceled, inHand, shipDone, plTaken, plNotTaken }) => {
    const CanvasJS = CanvasJSReact.CanvasJS;
    const CanvasJSChart = CanvasJSReact.CanvasJSChart;

    const options = {
        height: 60,
        axisX: {
            lineThickness: 0,
            tickLength: 0,
            labelFormatter: function () {
                return ""; // Hide x-axis labels
            },
            gridThickness: 0 // Hide the x-axis grid lines
        },
        axisY: {
            lineThickness: 0, // Hide the y-axis line
            tickLength: 0, // Hide the y-axis ticks
            labelFormatter: function () {
                return ""; // Hide y-axis labels
            },
            gridThickness: 0 // Hide the y-axis grid lines
        },
        toolTip: {
            enabled: true // Disable tooltip
        },
        legend: {
            enabled: false // Disable legend
        },
        backgroundColor: "transparent", // Set background color to transparent
        data: [{
            type: "stackedBar100",
            color: "#adb612",
            dataPoints: [
                { label: "Shipped", y: shipped[0] },
            ]
        }, {
            type: "stackedBar100",
            color: "#7f7f7f",
            dataPoints: [
                { label: "WIP", y: inHand[0] },
            ]
        },
        {
            type: "stackedBar100",
            color: "#7f7fer",
            dataPoints: [
                { label: "Canceled", y: canceled[0] },
            ]
        }]
    };

    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    );
};

export default App;

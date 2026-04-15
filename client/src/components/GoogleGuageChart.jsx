import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

function getRandomNumber() {
    return Math.random() * 100;
}

export function getData() {
    return [
        ["Label", "Value"],
        ["Target", getRandomNumber()],
    ];
}

export const options = {
    width: 400,
    height: 520,
    redFrom: 90,
    redTo: 100,
    yellowFrom: 75,
    yellowTo: 90,
    minorTicks: 5,
    animation: {
        duration: 1000
    }
};

export function GoogleGaugeChart() {
    const [data, setData] = useState(getData);

    useEffect(() => {
        const id = setInterval(() => {
            setData(getData());
        }, 8000);

        return () => {
            clearInterval(id);
        };
    }, []);

    return (
        <Chart
            chartType="Gauge"
            width="100%"
            height="100%"
            data={data}
            options={options}
        />
    );
}

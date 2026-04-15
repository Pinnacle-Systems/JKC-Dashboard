

import React from "react";
import { Chart } from "react-google-charts";

export const options = {
    allowHtml: true,
    showRowNumber: true,
    cssClassNames: {
        tableCell: 'custom-table-cell',
        headerRow: 'custom-header-row'
    },
};

// Function to get color based on percentage
const getColor = (percentage) => {
    if (percentage >= 50) return "green";
    if (percentage >= 10) return "lightgreen";
    if (percentage >= 1) return "orange";
    return "red";
};
export const formatters = [
    {
        type: "ArrowFormat",
        column: 1,
        options: {
            width: 300,
        },
    },
];
export function App({ plData }) {
    const totalProfit = plData.reduce((total, item) => total + item.profit, 0);

    const data = [
        ["Customer", "Profit/Loss", "Percentage"], // Headers
        ...plData.map(item => {
            const percentage = parseFloat((item.profit / totalProfit * 100).toFixed(2));
            const color = getColor(percentage);
            return [
                item.customer,
                item.profit,
                {
                    v: percentage,
                    f: `
                        <div style="
                            width: 100%; 
                            background: linear-gradient(to right, ${color} ${percentage}%, transparent ${percentage}%);
                           
                        ">
                            ${percentage}%
                        </div>`
                }
            ];
        })
    ];

    return (
        <div className="overflow-y-scroll ">
            <Chart
                chartType="Table"
                width="100%"
                height="110%"
                data={data}
                options={options}
                formatters={formatters}
            />
        </div>
    );
}

export default App;
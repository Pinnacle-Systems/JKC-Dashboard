import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useGetYFActVsPlnQuery } from '../../redux/service/orderManagement';
import { useGetBuyerNameQuery, useGetFinYearQuery, useGetMonthQuery } from '../../redux/service/commonMasters';
import { ColorContext } from '../global/context/ColorContext';
import { useContext } from "react";
import CardWrapper from '../../components/CardWrapper';
import ModelMultiSelectChart3 from '../../components/ModelMultiSelectChart3';
import AttritionDetTable from '../../components/AttDetTable';

const ChartTable = () => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedBuyer, setSelectedBuyer] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [buyerNm, setBuyerNm] = useState([]);
    const [monthData, setMonthData] = useState([]);
     const chartRef = useRef()
    const [yearData, setYearData] = useState([]);
    const [openpopup,setOpenpopup] = useState(false)
    const { color } = useContext(ColorContext);
    const { data: buyer, isLoading: isbuyerLoad } = useGetBuyerNameQuery({ params: {} });
    const { data: month } = useGetMonthQuery({ params: { filterYear: selectedYear || '', filterBuyer: selectedBuyer || '' } });
    const { data: year } = useGetFinYearQuery({});
    useEffect(() => {
        if (buyer?.data || month?.data || year?.data) {
            const buyerName = (buyer?.data ? buyer?.data : []).map((item) => item.buyerName);
            const monData = (month?.data ? month?.data : []).map((mon) => mon.month);
            const finYearData = (year?.data ? year?.data : []).map((year) => year.finYear);
            setBuyerNm(buyerName);
            setMonthData(monData);
            setYearData(finYearData);
        }
    }, [buyer, month, year]);
    const { data: fabPlVsActFull, } = useGetYFActVsPlnQuery({ params: { filterMonth: selectedMonth || '', filterSupplier: selectedBuyer || '', filterYear: selectedYear || '' } });
    // const { data: fabPlVsActFull, } = useGetYFActVsPlnQuery({ params: {filterYear: selectedYear || '' } });
    const fabPlVsActFullDt = fabPlVsActFull?.data ? fabPlVsActFull?.data : [];


    console.log(fabPlVsActFull,"fabPlVsActFull data");
    
    const orderCount = fabPlVsActFullDt.length;
    const options = {
        chart: {
            type: 'column',
            height: 370,
            borderRadius: "10px",
            options3d: {
                enabled: true,
                alpha: 7,
                beta: 7,
                depth: 40,
                viewDistance: 25,
            },
            scrollablePlotArea: {
                minWidth: orderCount < 10 ? 300 : orderCount < 20 ? 500 : orderCount <= 40 ? 1500 : orderCount <= 65 ? 2000 : orderCount < 85 ? 2500 : orderCount < 120 ? 3000 : orderCount < 150 ? 3500 : 300,
                scrollPositionX: 0,
            },
        },
        title: null,  // Removed the chart title
        tooltip: {
            backgroundColor: 'white', // Dark background color
            borderRadius: 10, // Rounded corners
            style: {
                fontSize: '10px', // Font size of the tooltip text
                fontFamily: 'Arial, sans-serif', // Font family for the tooltip text
                padding: '10px', // Padding inside the tooltip
            },
            borderColor: '#888', // Border color of the tooltip
            borderWidth: 1, // Border width
            headerFormat: '<b>Age: {point.key}</b><br/>',
        },
        xAxis: {
            title: {
                text: 'Month',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#374151',
                },
                margin: 25, // Increased margin for more gap
            },
            categories: fabPlVsActFullDt.map((order) =>  {
                const month = new Date(order.payPeriod);
                const monthAbbr = month.toLocaleString('default', { month: 'short' }); // 3-letter month abbreviation
                const year = month.getFullYear().toString().slice(-2); // Last 2 digits of the year
                return `${monthAbbr} ${year}`;
         } ),
            labels: {
                rotation: -90,
                step: 1,
                style: {
                    fontSize: '10px',
                },
            },
            scrollbar: {
                enabled: true,
            },
        },
        yAxis: {
            title: {
                text: 'Number of Employees',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#374151',
                },
                margin: 25, // Increased margin for more gap
            },
            labels: {
                style: {
                    fontSize: '10px',
                },
                formatter: function () {
                    return this.value.toLocaleString();
                },
            },
        },
        plotOptions: {
            column: {
                depth: 25,
                pointWidth: 20,
                stacking: 'normal',
                states: {
                    hover: {
                        pointWidth: 20,
                    },
                },
            },
        },
        legend: {
            itemStyle: {
                fontWeight: 'bold',
            },
            symbolHeight: 12,
            symbolWidth: 12,
            symbolRadius: 1,
        },
        series: [
            {
                name: 'Attrition',
                data: fabPlVsActFullDt.map((order, index) => ({
                    y: order.attrition,
                    color: Highcharts.getOptions().colors[index % Highcharts.getOptions().colors.length],
                })),
                colorByPoint: true,
            },
        ],
    };
    
    const [showModel, setShowModel] = useState(false);

    return (
        <CardWrapper heading={"Attrition  Breakup"} onFilterClick={() => { setShowModel(true) }}  chartRef={chartRef}  >
            <div style={{ display: 'flex', flexDirection: 'column',  }}>
            
                {orderCount > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'row',  }}>
                        <div style={{ flex: '66%', minWidth: '100%' }} onClick={()=>setOpenpopup(true)} className='flex flex-col pt-2 rounded'
                        ref = {chartRef}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={options}
                                containerProps={{ style: { minWidth: '70%', height: '360px',borderRadius: "10px", 
                                } }}
                            />
                        </div>

                    </div>
                ) : (
                    <div>No Data Available</div>
                )}
                {openpopup && <AttritionDetTable selectedBuyer={selectedBuyer} selectedYear={selectedYear} setOpenpopup = {setOpenpopup}  />}
                    {showModel &&
                    <ModelMultiSelectChart3 color={color}
                        showModel={showModel} setShowModel={setShowModel} selectedYear={selectedYear} setSelectedYear={setSelectedYear}
                        selectedBuyer={selectedBuyer} setSelectedBuyer={setSelectedBuyer} />
                }
            </div>
        </CardWrapper >
    );
};

export default ChartTable;

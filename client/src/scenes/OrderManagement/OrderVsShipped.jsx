import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useGetPlanedVsActualSalesQuery } from '../../redux/service/orderManagement';
import { useGetBuyerNameQuery, useGetFinYearQuery, useGetMonthQuery } from '../../redux/service/commonMasters';
import SelectBuyer from '../../Ui Component/modelParam';

const OrderVsShipped = () => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedBuyer, setSelectedBuyer] = useState('');
    const [selectedYear, setSelectedYear] = useState('')
    const [buyerNm, setBuyerNm] = useState([]);
    const [monthData, setMonthData] = useState([])
    const [yearData, setYearData] = useState([])
    const { data: plannedVsActualSales } = useGetPlanedVsActualSalesQuery({ params: { filterMonth: selectedMonth || '', filterSupplier: selectedBuyer || '', filterYear: selectedYear || '' } });
    const { data: buyer, isLoading: isbuyerLoad } = useGetBuyerNameQuery({ params: {} });
    const { data: month } = useGetMonthQuery({ params: { filterYear: selectedYear || '', filterBuyer: selectedBuyer || '' } })
    const { data: year } = useGetFinYearQuery({})
    console.log(year, 'finyr');
    useEffect(() => {
        if (buyer?.data || month?.data) {
            const buyerName = (buyer?.data ? buyer?.data : []).map((item) => item.buyerName);
            const monData = (month?.data ? month?.data : []).map((mon) => mon.month);
            const finYearData = (year?.data ? year?.data : []).map((year) => year.finYear)
            setBuyerNm(buyerName);
            setMonthData(monData);
            setYearData(finYearData)
        }
    }, [buyer, month, year]);
    console.log(plannedVsActualSales, 'sales');
    const planVsActSales = plannedVsActualSales?.data ? plannedVsActualSales?.data : [];
    const orderCount = planVsActSales.length;

    const options = {
        chart: {
            type: 'column',
            backgroundColor: '#ffffff',
            scrollablePlotArea: {
                minWidth: orderCount < 10 ? 300 : orderCount < 20 ? 500 : orderCount <= 40 ? 1500 : orderCount <= 65 ? 2000 : orderCount < 85 ? 3500 : orderCount < 120 ? 4000 : orderCount < 150 ? 3500 : 4000,
                scrollPositionX: 0
            },
            height: 450
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: planVsActSales.map((item) => item.orderNo),
            title: {
                text: 'Order No'
            },
            labels: {
                rotation: -90,
                step: 1,
                style: {
                    fontSize: '12px'
                }
            },
            scrollbar: {
                enabled: true
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Value'
            },
            labels: {
                format: '{value}%',
                style: {
                    fontSize: '10px'
                }
            },
            verticalAlign: 'top',
            layout: 'horizontal',
            paddingLeft: ''
        },
        legend: {
            align: 'center',
            verticalAlign: 'top',
            layout: 'horizontal'
        },
        plotOptions: {
            column: {
                pointWidth: 30,
                stacking: 'percent',
                states: {
                    hover: {
                        pointWidth: 20
                    }
                },
                marker: {
                    enabled: false
                },
            }
        },

        tooltip: {
            shared: true,
            split: true,
            stickOnContact: true,
            style: {
                fontSize: '12px',
            },
            formatter: function () {
                const points = this.points.map(point => {
                    return { year: point.series.name, value: point.y };
                });

                const year1 = points.find(p => p.year === 'Order Val');
                const year2 = points.find(p => p.year === 'Shipped Val');
                const diff = year1 && year2 ? (year2.value - year1.value) : null;

                return `
                    <div style="">
                        <b>OrderNo: ${this.x}</b><br/>
                        ${points.map(point => `
                            ${point.year}: <span style="width: auto; margin-left: 20px; color: ${point.year ? 'blue' : 'blue'}">${point.value.toLocaleString()}</span>`).join('<br>')}<br/>
                      
                    </div>
                `;
            }
        }



        ,
        series: [
            {
                name: 'Shipped Val',
                data: planVsActSales.map((item) => item.actSalesVal)
            },
            {
                name: 'Order Val',
                data: planVsActSales.map((item) => item.planSalesVal)
            },
        ]
    }


    return (
        <div className='bg-white' style={{ minWidth: '100%', }}>
            <div className="flex justify-end w-[60%] h-[1.75rem] z-[40%] ">
                <div className='flex items-center'>
                    <label className='text-sm text-center '>Select :</label>
                </div>
                <SelectBuyer
                    selectedBuyer={selectedBuyer}
                    setSelectedBuyer={setSelectedBuyer}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    options={buyerNm}
                    monthOptions={monthData}
                    yearOptions={yearData}
                    columnHeaderHeight={"30"}
                />
                {console.log(yearData, 'yearData')}
            </div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                containerProps={{ style: { minHeight: '100%' } }}
            />
        </div>
    );
};

export default OrderVsShipped;

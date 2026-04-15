import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useGetBuyerWiseRevenueQuery } from '../../../redux/service/misDashboardService';
import { useGetBuyerNameQuery, useGetFinYearQuery, useGetMonthQuery } from '../../../redux/service/commonMasters';
import CardWrapper from '../../../components/CardWrapper';
import ModelMultiSelectChart3 from '../../../components/ModelMultiSelectChart3 copy';
import { ColorContext } from '../../global/context/ColorContext';
import { useContext } from 'react';
import RetritionDetTable from '../../../components/RetDetTable';
const Retention = () => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedBuyer, setSelectedBuyer] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [openpopup, setOpenpopup] = useState(false)
    const [buyerNm, setBuyerNm] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [yearData, setYearData] = useState([]);
    const {color} = useContext(ColorContext)
        const [showModel, setShowModel] = useState(false);
    const { data: fabPlVsActFull, isLoading: isyfActVsPlLoadingFull, refetch } = useGetBuyerWiseRevenueQuery({ params: { filterMonth: selectedMonth || '', filterSupplier: selectedBuyer || '', filterYear: selectedYear || '' } });
    const { data: buyer, isLoading: isbuyerLoad } = useGetBuyerNameQuery({ params: {} });
    const { data: month } = useGetMonthQuery({ params: { filterYear: selectedYear || '', filterBuyer: selectedBuyer || '' } });
    const { data: year } = useGetFinYearQuery({});
    const chartRef = useRef(null)

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

    const fabPlVsActFullDt = fabPlVsActFull?.data ? fabPlVsActFull?.data : [];
    console.log(fabPlVsActFullDt, 'fabPlVsActFullDt');

    const orderCount = fabPlVsActFullDt.length;
    const totalPlanned = fabPlVsActFullDt.reduce((total, order) => total + (order.retention || 0), 0);

    const options = {
        chart: {
            type: 'column',
            height: 350,
            scrollablePlotArea: {
                minWidth: orderCount < 10 ? 300 : orderCount < 20 ? 500 : orderCount <= 40 ? 1500 : orderCount <= 65 ? 2000 : orderCount < 85 ? 2500 : orderCount < 120 ? 3000 : orderCount < 150 ? 3500 : 300,
                scrollPositionX: 0
            }
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: fabPlVsActFullDt.map((order) => order.payPeriod),
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
            title: {
                text: 'Retention',
                style: {
                    fontSize: '10px',
                    paddingLeft: '20px'
                },
            },
            labels: {
                style: {
                    fontSize: '10px'
                },
                formatter: function () {
                    return this.value.toFixed(2).toLocaleString();
                }
            },
        },
        tooltip: {
            formatter: function () {
                return `<b>${this.x}</b><br/>Retention: <b>${this.y.toFixed(2)}</b>`;
            }
        },
        plotOptions: {
            column: {
                pointWidth: 20,
                stacking: 'normal',
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
        legend: {
            itemStyle: {
                fontWeight: 'bold'
            },
            symbolHeight: 12,
            symbolWidth: 12,
            symbolRadius: 1,
        },
        series: [
            {
                name: 'Retention',
                data: fabPlVsActFullDt.map((order) => ({
                    y: parseFloat(order.retention.toFixed(2)), // Ensuring two decimal places
                    color: '#2bc97a'
                })),
                color: '#2bc97a',
            },
        ],
    };
    
    const orderDataGridRows = [
        ...fabPlVsActFullDt.map((order, index) => ({
            id: index,
            serial: index + 1,
            payPeriod: order.payPeriod,
            customer: order.customer,
            retention: order.retention,
        })),
        { id: 'total', serial: '', payPeriod: 'Total', customer: '', retention: totalPlanned.toLocaleString(), },
    ];

    const valueFormatter = ({ value }) => {
        const formattedValue = parseFloat(value ? value : 0).toLocaleString();
        return isNaN(formattedValue) ? '' : formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const orderDataGridColumns = [
        { field: 'serial', headerName: 'S/No', maxWidth: 40 },

        { field: 'customer', headerName: 'Customer', maxWidth: 90 },
        { field: 'retention', headerName: 'Retention', valueFormatter, flex: 1, align: 'right', headerAlign: 'right', minWidth: 110 },
    ];

    const theme = createTheme({
        components: {
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        fontSize: '10px',
                    },
                    columnHeader: {
                        fontSize: '10px',
                        height: '36px',
                    },
                    cell: {
                        fontSize: '10px',
                        height: '2px',
                        textAlign: 'right',
                    },
                },
            },
        },
    });

    const getRowClassName = (params) => {
        const rowClass = params.indexRelativeToCurrentPage % 2 === 0 ? 'bg-gray-100' : 'bg-white';
        return params.id === 'total' ? 'fontWeightBold' : rowClass;
    };

    return (
        <div ref={chartRef}>
                <CardWrapper heading={"Retention Breakup"} onFilterClick={() => { setShowModel(true) }} chartRef={chartRef} >
                {showModel &&
                                <ModelMultiSelectChart3 color={color}
                                    showModel={showModel} setShowModel={setShowModel} selectedYear={selectedYear} setSelectedYear={setSelectedYear}
                                    selectedBuyer={selectedBuyer} setSelectedBuyer={setSelectedBuyer} />
                            }
                            {openpopup && <RetritionDetTable selectedBuyer={selectedBuyer} selectedYear={selectedYear} setOpenpopup={setOpenpopup} />}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="flex justify-end">

                    <div className='flex group relative'>

                        <span className='group-hover:opacity-100 transition-opacity bg-gray-800 px-1 bottom-5 text-sm text-gray-100 rounded-md -translate-x-1/2 absolute opacity-0 z-40'>
                            Refresh
                        </span>
                    </div>
                </div>
                {orderCount > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                        <div style={{ flex: '66%', minWidth: '66%' }} className='flex flex-col' onClick={()=>setOpenpopup(true)} >
                            <HighchartsReact
                                highcharts={Highcharts} 
                                options={options}
                                containerProps={{ style: { minWidth: '70%', height: '350px' } }}
                            />

                        </div>

                    </div>
                ) : (
                    <div>No Data Available</div>
                )}
            </div>
        </CardWrapper>
        </div>
    
    );
};

export default Retention;

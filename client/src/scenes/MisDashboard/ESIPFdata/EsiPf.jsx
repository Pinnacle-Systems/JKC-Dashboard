import React, { useEffect, useState, useContext, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import CardWrapper from '../../../components/CardWrapper';
import { useGetBuyerNameQuery, useGetFinYearQuery, useGetMonthQuery } from '../../../redux/service/commonMasters';
import { useGetYFActVsPlnQuery } from '../../../redux/service/orderManagement';
import { ColorContext } from '../../global/context/ColorContext';
import ModelMultiSelectChart4 from '../../../components/ModelMultiSelectChart4';
import { useGetEsiPf1Query } from '../../../redux/service/misDashboardService';
import EsiDetail from '../../../components/EsiDetailTable';

const Pf = () => {
     const chartRef = useRef(null)

    Highcharts.addEvent(Highcharts.Point, 'click', function () {
        if (this.series.options.className?.includes('popup-on-click')) {
            const chart = this.series.chart;
            const date = chart.time.dateFormat('%A, %b %e, %Y', this.x);
            const text = `<b>${date}</b><br/>${this.y} ${this.series.name}`;

            const anchorX = this.plotX + this.series.xAxis.pos;
            const anchorY = this.plotY + this.series.yAxis.pos;
            const align = anchorX < chart.chartWidth - 200 ? 'left' : 'right';
            const x = align === 'left' ? anchorX + 10 : anchorX - 10;
            const y = anchorY - 30;

            if (!chart.sticky) {
                chart.sticky = chart.renderer
                    .label(text, x, y, 'callout', anchorX, anchorY)
                    .attr({
                        align,
                        fill: 'rgba(0, 0, 0, 0.75)',
                        padding: 10,
                        zIndex: 7, // Above series, below tooltip
                    })
                    .css({ color: 'white' })
                    .on('click', function () {
                        chart.sticky = chart.sticky.destroy();
                    })
                    .add();
            } else {
                chart.sticky
                    .attr({ align, text })
                    .animate({ anchorX, anchorY, x, y }, { duration: 250 });
            }
        }
    });

    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedBuyer, setSelectedBuyer] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [buyerNm, setBuyerNm] = useState([]);
    const [openPopup, setOpenPopup] = useState(false)
    const [monthData, setMonthData] = useState([]);
    const [yearData, setYearData] = useState([]);
    const { color } = useContext(ColorContext);
    const { data: buyer } = useGetBuyerNameQuery({});
    const { data: month } = useGetMonthQuery({ params: { filterYear: selectedYear, filterBuyer: selectedBuyer } });
    const { data: year } = useGetFinYearQuery({});
    const { data: fabPlVsActFull } = useGetEsiPf1Query({
        params: { filterMonth: selectedMonth, filterSupplier: selectedBuyer, filterYear: selectedYear },
    });

    useEffect(() => {
        if (buyer?.data || month?.data || year?.data) {
            setBuyerNm(buyer?.data.map((item) => item.buyerName) || []);
            setMonthData(month?.data.map((mon) => mon.month) || []);
            setYearData(year?.data.map((year) => year.finYear) || []);
        }
    }, [buyer, month, year]);

    const fabPlVsActFullDt = fabPlVsActFull?.data || [];
    const orderCount = fabPlVsActFullDt.length;


    const esiData = fabPlVsActFullDt.map((item) => item.esi);

    const headCount = fabPlVsActFullDt.map((item) => item.headCount); 

    const options = {
        chart: {
            scrollablePlotArea: {
                minWidth: 700,
            },
            marginTop: 10,
            type: 'line',
            height: 360, 
            borderRadius: 10, 
        },
        xAxis: {
            categories: fabPlVsActFullDt.map((order) => {
                const month = new Date(order.month);
                const monthAbbr = month.toLocaleString('default', { month: 'short' }); 
                const year = month.getFullYear().toString().slice(-2); 
                return `${monthAbbr} ${year}`;
            }),
            title: {
                text: 'Month',
                style: { fontSize: '12px' }
            },
            labels: {
                style: { fontSize: '10px' }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'ESI Amount',
                style: { fontSize: '12px' }
            },
            labels: {
                style: { fontSize: '10px' }
            }
        },
        tooltip: {
            shared: true,
            style: { fontSize: '10px' },
            formatter: function () {
                let tooltip = `<b>${this.x}</b><br/>`;
                this.points.forEach(point => {
                    if (point.series.name === 'ESI') {
                        tooltip += `<b>${point.series.name}</b>: ${point.y}<br/>`;
                    }
                });
                const index = this.points[0].point.index;
                tooltip += `<b>Headcount</b>: ${headCount[index]}`;
                return tooltip;
            }
        },
        legend: {
            itemStyle: {
                fontSize: '10px'
            }
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: true,
                    radius: 4,
                    symbol: 'circle',
                }
            }
        },
        title: null,
        series: [
            {
                name: 'ESI',
                data: esiData,
                color: '#FF0000', 
                marker: {
                    fillColor: '#FF0000',
                    lineWidth: 2,
                    lineColor: '#000000',
                }
            }
        ]
    };
    
    
    console.log(headCount,"headCount")
 
    console.log(selectedYear,"selectYearfor")

    const [showModel, setShowModel] = useState(false);
    return (
        <CardWrapper heading="ESI Breakup" onFilterClick={() => { setShowModel(true) }} chartRef = { chartRef} >
              {showModel &&
                <ModelMultiSelectChart4 color={color}
                    showModel={showModel} setShowModel={setShowModel} selectedYear={selectedYear} setSelectedYear={setSelectedYear}
                    selectedBuyer={selectedBuyer} setSelectedBuyer={setSelectedBuyer} />
            }
                  {openPopup && <EsiDetail selectedBuyer = {selectedBuyer} selectedYear= {selectedYear} setOpenpopup={setOpenPopup} />}
            
            <div className='mt-2' onClick={()=>setOpenPopup(true)}
            ref = {chartRef} >
            {orderCount > 0 ? (
                <HighchartsReact highcharts={Highcharts} options={options} />
            ) : (
                <div>No Data Available</div>
            )}
          
            </div>
         
        </CardWrapper>
    );
};

export default Pf;

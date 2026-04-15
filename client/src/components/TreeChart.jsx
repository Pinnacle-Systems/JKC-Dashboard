import React, { useEffect, useState, useContext, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import html2canvas from 'html2canvas';
import { IoMdDownload } from "react-icons/io";import { CiMenuKebab } from 'react-icons/ci';
import { ColorContext } from '../scenes/global/context/ColorContext';
import CardWrapper from './CardWrapper';
import BuyerMultiSelect from './ModelMultiSelect1';
import ExpDetail from './ExpDet';

Highcharts3D(Highcharts);

const Bar3DChart = ({ overAllSuppCon, selected, setSelected, option }) => {
    const [showModel, setShowModel] = useState(false);
  const [openpopup,setOpenpopup] = useState(false)
    const { color } = useContext(ColorContext);
        const chartRef = useRef(null); // Step 1: Create chartRef
    

    const colorArray = ['#8A37DE', '#005E72', '#E5181C', '#056028', '#1F2937'];

    const truncateText = (text, maxLength) => (text.length > maxLength ? text.substring(0, maxLength) + '...' : text);

  
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'column',
            height: 350,
            options3d: {
                enabled: true,
                alpha: 7,
                beta: 7,
                depth: 50,
                viewDistance: 25,
            },
            backgroundColor: '#FFFFFF',
            borderRadius: "10px"
        },
        title: null,
        legend: { enabled: false },
        tooltip: {
            headerFormat: '<b><span style="color: #2d2d2d;">Experience: {point.key}</span></b><br/>',
            pointFormat: `
                <span style="color: {point.color}; font-size: 12px;">\u25CF</span> 
                Employees: <span style="color: #2d2d2d;"><b>{point.y}</b></span>`,
            style: { fontSize: '10px', color: 'black' },
        },
        xAxis: {
            categories: [],
            labels: { style: { fontSize: '10px', color: '#6B7280' } },
            title: { text: 'Experience', style: { fontSize: '12px', fontWeight: 'bold', color: '#374151' }, margin: 30 },
        },
        yAxis: {
            title: { text: 'No of Employees', style: { fontSize: '12px', fontWeight: 'bold', color: '#374151' }, margin: 25 },
            labels: { style: { fontSize: '10px', color: '#6B7280' } },
        },
        plotOptions: {
            column: { depth: 25, colorByPoint: true, borderRadius: 5 },
        },
        colors: colorArray,
        series: [{ name: '', data: [], dataLabels: { enabled: true, style: { fontSize: '10px', color: '#333' } } }],
    });

    useEffect(() => {
        if (overAllSuppCon && overAllSuppCon.length > 0) {
            const categories = overAllSuppCon.map(item => truncateText(item.supplier, 10));
            const data = overAllSuppCon.map(item => item.poQty);

            setChartOptions(prevOptions => ({
                ...prevOptions,
                xAxis: { ...prevOptions.xAxis, categories },
                series: [{ ...prevOptions.series[0], data }],
            }));
        }
    }, [overAllSuppCon]);

    return (
        <CardWrapper heading="Experience Distribution" onFilterClick={() => setShowModel(true)}  chartRef={chartRef} >
            <div
                id="chart"
                className="relative mt-2 mb-2 rounded-lg"
                ref={chartRef} 
                style={{
                    width: '100%',
                    height: '360px',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: "10px",
                    position: 'relative',
                }}
            >
                 {openpopup && (<ExpDetail selectedBuyer={selected} setOpenpopup ={setOpenpopup} openpopup={openpopup}  />)}
                {showModel && (
                    <BuyerMultiSelect
                        selected={selected}
                        setSelected={setSelected}
                        color={color}
                        showModel={showModel}
                        setShowModel={setShowModel}
                    />
                )}

                {selected && (
                    <div onClick={()=>setOpenpopup(true)}>
                    <HighchartsReact  highcharts={Highcharts} options={chartOptions}  />

                    </div>
                )}

                {/* Toggle Button & Screenshot Capture */}
                
            </div>
        </CardWrapper>
    );
};

export default Bar3DChart;

import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import { useGetFabStsDataQuery } from '../redux/service/orderManagement';
import Modal from '../Ui Component/popUpModel';
import { HiOutlineRefresh } from 'react-icons/hi';

const FabStsChart = ({ fabStatus }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [month, setMonth] = useState(null);
    const [barVal, setBarVal] = useState(null);
    const { data: fabSts, isLoading: isFabStsLoading, refetch } = useGetFabStsDataQuery({ params: { itemWise: true, modalContent, month } });

    const closeModal = () => {
        setShowModal(false);
        setModalContent(null);
    };

    const fabricSts = fabSts?.data ? fabSts?.data : [];
    console.log(fabricSts, 'fab');

    const seriesData = [
        {
            name: 'Received Orders',
            data: fabStatus.map(item => item.rec || 0)
        },
        {
            name: 'Pending Orders',
            data: fabStatus.map(item => item.pend || 0)
        }
    ];

    const categories = fabStatus.map(item => item.month);

    const [chartData, setChartData] = useState({
        series: seriesData,
        options: {
            chart: {
                type: 'bar',
                height: 450,
                stacked: true,
                stackType: '100%',
                events: {
                    dataPointSelection: (event, chartContext, config) => {
                        const seriesIndex = config.seriesIndex;
                        const dataPointIndex = config.dataPointIndex;
                        const value = seriesIndex === 0 ? 'Completed' : 'WIP';
                        const monthData = categories[dataPointIndex];
                        const barValue = chartData.series[seriesIndex].data[dataPointIndex];
                        setModalContent(value);
                        setShowModal(true);
                        setMonth(monthData);
                        setBarVal(barValue);
                    }
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }],
            colors: ['#16a34a', '#dc2626'],
            xaxis: {
                categories: categories,
            },
            fill: {
                opacity: 1
            },
            legend: {
                position: 'top',
                offsetX: 0,
                offsetY: 0
            },
        }
    });

    useEffect(() => {
        setChartData(prevData => ({
            ...prevData,
            series: seriesData,
            options: {
                ...prevData.options,
                xaxis: {
                    categories: categories,
                }
            }
        }));
    }, [fabStatus]);

    const columns = [
        { field: 'id', headerName: 'S/N', width: 20 },
        { field: 'ordNo', headerName: 'Order No', width: 90 },
        { field: 'fabric', headerName: 'Fabric', width: 480 },
        { field: 'pDesign', headerName: 'Design', width: 80 },
        { field: 'pDia', headerName: 'Dia', width: 80, align: 'right' },
        { field: 'pkDia', headerName: 'KDia', width: 15, align: 'right' },
        { field: 'reqQty', headerName: 'Req Qty', width: 80, align: 'right' },
    ];

    const rows = fabricSts.map((item, index) => ({
        id: index + 1,
        ordNo: item.ordNo,
        fabric: item.fabric,
        pDesign: item.pDesign,
        pDia: item.pDia,
        pkDia: item.pkDia,
        reqQty: Number(item.reqQty.toFixed(2)).toLocaleString(),  // Format reqQty with comma separation and fixed 9 decimal places
    }));

    console.log(barVal, 'll');

    const columnGroupingModel = [
        {
            groupId: `Fabric status for the month of ${month}`,
            children: [
                { field: 'id' },
                { field: 'ordNo' },
                { field: 'fabric' },
                { field: 'pDesign' },
                { field: 'pDia' },
                { field: 'pkDia' },
                { field: 'reqQty' },
            ],
            headerAlign: 'center',
            headerClass: modalContent === 'WIP' ? 'red-header' : 'green-header',
            renderHeaderGroup: (params) => (
                <GridToolbarContainer >
                    <div className=' w-full gap-44 flex justify-between'>
                        <div>
                            {params.groupId}
                        </div>
                        <div className='flex-end'>
                            Status: {modalContent === 'WIP' ? 'Pending' : 'Received'} ({barVal})
                        </div>
                    </div>
                </GridToolbarContainer>
            )
        },
    ];

    const onModalClose = () => setShowModal(false);

    const getRowClassName = (params) => {
        return params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd';
    };

    return (
        <div >
            <div id="html-dist">

                <div className='flex  group relative justify-end'>
                    <button
                        className=' bg-sky-500 rounded-sm p-1 flex items-center justify-center h-[30px] text-center font-normal text-[16px] border-2 border-[#E0E0E0]'
                        onClick={() => refetch()}>
                        <HiOutlineRefresh />
                    </button>
                    <span className='group-hover:opacity-100 transition-opacity bg-gray-800 px-1 bottom-6 text-sm text-gray-100 rounded-md -translate-x-1/2 absolute opacity-0 z-40'>
                        Refresh
                    </span>
                </div>
                <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={450} />
            </div>
            <div className=''>
                <Modal onClose={onModalClose} isOpen={showModal} >
                    <div className=" flex h-[100%]">
                        <div>
                            <Box sx={{ width: '100%', height: '100%' }}>
                                <div style={{ height: '100%', overflowY: 'auto' }}>
                                    <DataGrid
                                        rows={rows}
                                        experimentalFeatures={{ columnGrouping: true }}
                                        columns={columns}
                                        pageSize={5}
                                        paginationMode="server"
                                        disableSelectionOnClick
                                        editMode="row"
                                        rowHeight={24}
                                        hideFooterSelectedRowCount
                                        columnHeaderHeight={30}
                                        autoHeight
                                        columnGroupingModel={columnGroupingModel}
                                        getRowClassName={getRowClassName}
                                        sx={{
                                            '& .MuiDataGrid-columnHeader': {
                                                background: 'linear-gradient(180deg, #afafae, #ffffff)',
                                                textAlign: 'center',
                                                fontSize: '14px',
                                                fontWeight: '400',
                                                borderColor: '#E5E7EB',
                                                borderWidth: 1,
                                                borderStyle: 'solid',
                                            },
                                            '& .MuiDataGrid-footerContainer': {
                                                display: 'none'
                                            },
                                            '& .MuiDataGrid-cell': {
                                                fontSize: '11px',
                                                padding: '1px',
                                                borderWidth: 1
                                            },
                                            '& .MuiDataGrid-columnHeaderTitleContainer.MuiDataGrid-withBorderColor': {
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                            },
                                            '& .odd': {
                                                backgroundColor: '#ebe9e9',

                                            },
                                            '& .even': {
                                                backgroundColor: 'white',

                                            },
                                        }}
                                        hideFooterPagination
                                        disableColumnSelector
                                        disableDensitySelector
                                        disableRowSelectionOnClick
                                    />
                                </div>
                            </Box>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default FabStsChart;

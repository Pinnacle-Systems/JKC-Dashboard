import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import Modal from '../Ui Component/popUpModel';
import { useGetCapPlanDataQuery } from '../redux/service/orderManagement';

import Box from '@mui/material/Box';
// import { DataGridPro } from '@mui/x-data-grid-pro';
// import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid, GridToolbarContainer, gridClasses } from '@mui/x-data-grid';
import { useGetCompCodeDataQuery } from '../redux/service/commonMasters';
import DropdownDt from '../Ui Component/dropDownParam';
import { HiOutlineRefresh } from 'react-icons/hi';
const ApexChart = ({ capPlanData, selected, setSelected }) => {

    const [showModal, setShowModal] = useState(false);
    const [clickedMonth, setClickedMonth] = useState(null);

    const { data: capPlaData, isLoading: isCapPlanLoading, refetch } = useGetCapPlanDataQuery({ params: { getByMonth: true, clickedMonth } })
    const { data: compCode } = useGetCompCodeDataQuery({ params: {} })

    const seriesData = capPlanData.map(item => ({
        x: item.month,
        y: item.booked,
        strokeColor: "#775DD0",
        series: [
            {
                name: 'Filled',
                value: item.capacity.toLocaleString(),
                strokeWidth: 1,
                strokeDashArray: 2,
            },
        ],
        goals: [
            {
                name: 'Capacity',
                value: item.capacity,
                strokeWidth: 1,
                strokeDashArray: 2,
                strokeColor: '#775DD0'
            }
        ],
    }));

    const options = {
        series: [
            {
                name: 'Filled',
                data: seriesData,
            },
        ],
        chart: {
            height: 450,
            type: 'bar',
            events: {
                click: (event, chartContext, config) => {
                    const dataPointIndex = config.dataPointIndex;
                    if (dataPointIndex >= 0) {
                        const month = capPlanData[dataPointIndex].month;
                        setClickedMonth(month);
                        setShowModal(true);
                    }
                },
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                distributed: true,
            },
        },
        colors: capPlanData.map(item => {
            const percentCapacity = (item.booked / item.capacity) * 100;
            if (percentCapacity > 110) return '#FF5733';
            if (percentCapacity < 100) return '#FFC107';
            if (percentCapacity > 100) return '#32CD32';
            return '#32CD32';
        }),
        dataLabels: {
            enabled: true,
            formatter: (val, opt) => {
                const goals = opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex].goals;
                if (goals && goals.length) {
                    return `${val.toLocaleString()} / ${goals[0].value.toLocaleString()}`;
                }
                return val.toLocaleString();
            },
            style: {
                colors: ['#ffffff'],
            },
            background: {
                enabled: true,
                foreColor: 'grey',
                borderRadius: 2,
                dropShadow: {
                    enabled: true,
                },
            },
        },
        legend: {
            show: true,
            showForSingleSeries: true,
            customLegendItems: ['Capacity', 'Booked', 'Going To Fill', 'Over Flow'],
            markers: {
                fillColors: ['#775DD0', '#32CD32', '#FFC107', '#FF5733'],
            },
        },
    };

    const onModalClose = () => setShowModal(false);
    const cappldt = capPlaData?.data ? capPlaData?.data : [];
    const comCode = compCode?.data ? compCode?.data : [];



    const columns = [
        { field: 'id', headerName: 'S/N', width: 20 },
        { field: 'ordNo', headerName: 'Order No', width: 90 },
        { field: 'customer', headerName: 'Customer', width: 100 },
        { field: 'buyerPo', headerName: 'BuyerPo', width: 180 },
        { field: 'oQty', headerName: 'Order Qty', width: 100, align: 'right' },
        { field: 'Oval', headerName: 'Ord val', width: 100, align: 'right' },

    ];
    const rows = cappldt.map((item, index) => ({
        id: index + 1,
        ordNo: item.ordNo,
        customer: item.customer,
        buyerPo: item.buyerPo,
        oQty: item.oQty,
        Oval: Number(item.Oval.toFixed(2)).toLocaleString(),
    }));
    const columnGroupingModel = [
        {
            groupId: `Production capacity for the month of ${clickedMonth}`,
            children: [
                { field: 'id' },
                { field: 'ordNo' },
                { field: 'customer' },
                { field: 'buyerPo' },
                { field: 'oQty' },
                { field: 'Oval' },

            ],
            headerAlign: 'center',

            renderHeaderGroup: (params) => (
                <GridToolbarContainer >
                    <div className=' w-full  flex justify-between'>
                        <div>
                            {params.groupId}
                        </div>
                        <div className='flex-end'>
                            {/* Status: {modalContent === 'WIP' ? 'Pending' : 'Received'} ({barVal}) */}
                        </div>
                    </div>
                </GridToolbarContainer>
            )
        },
    ];
    const getRowClassName = (params) =>
        `${params.row.id % 2 === 0 ? 'even' : 'odd'} ${gridClasses.row}`;
    return (
        <div id="chart">
            {showModal && (
                <Modal onClose={onModalClose} isOpen={showModal}>
                    <h1>{clickedMonth}</h1>
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
                                                getRowClassName={getRowClassName}
                                                columnGroupingModel={columnGroupingModel}
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
                        </Modal></div >


                </Modal>
            )}
            <div className='flex w-full justify-end'> <label htmlFor=""></label> <DropdownDt option={comCode} selected={selected} setSelected={setSelected} />
                <div className='flex  group relative'>
                    <button
                        className=' bg-sky-500 rounded-sm p-1 flex items-center justify-center h-[30px] text-center font-normal text-[16px] border-2 border-[#E0E0E0]'
                        onClick={() => refetch()}>
                        <HiOutlineRefresh />
                    </button>
                    <span className='group-hover:opacity-100 transition-opacity bg-gray-800 px-1 bottom-6 text-sm text-gray-100 rounded-md -translate-x-1/2 absolute opacity-0 z-40'>
                        Refresh
                    </span>
                </div></div>
            <Chart options={options} series={options.series} type="bar" height={450} />
        </div>
    );
};

export default ApexChart;

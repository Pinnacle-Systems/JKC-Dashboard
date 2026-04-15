import React from 'react'
import { useGetMisDashboardOrdersInHandMonthWiseQuery } from '../../../redux/service/misDashboardService'
import Lchart from '../../../components/LineChart';
import { HiOutlineRefresh } from 'react-icons/hi';

const LineChart = () => {
    const { data, refetch } = useGetMisDashboardOrdersInHandMonthWiseQuery({})
    const ordersInHandMonthWise = data?.data || [];
    console.log(data, 'data');
    return (
        <div className='w-full  h-full'>
            <div className='flex w-full justify-end'>
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
            <Lchart xAxisData={ordersInHandMonthWise.map(i => `${i.date}`)} series1Data={ordersInHandMonthWise.map(i => parseInt(i.planned))} series2Data={ordersInHandMonthWise.map(i => parseInt(i.actual))} />
        </div>
    )
}

export default LineChart
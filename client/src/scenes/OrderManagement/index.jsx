import React, { useEffect, useMemo, useState } from 'react'
import Header from './Header'
import ApexChart from '../../components/negativeValChart'
import CardWrapper from '../../components/CardWrapper'
import GeographyChart from '../../components/GeographyChart'

import { GoogleGaugeChart, GoogleGuageChart } from '../../components/GoogleGuageChart'
import NegativeChart from '../../components/negativeValChart'
import { useGetCapPlanDataQuery, useGetFabStsDataQuery, useGetProfitLossDataQuery, useGetYFActVsPlnQuery } from '../../redux/service/orderManagement'
import Scene from '../../components/loader/Loader'

import CapacityPlanner from '../../components/CapacityPlanChart'

import FabStsChart from '../../components/FabStatusChart'

import DropdownData from '../../Ui Component/modelUi'
import DropdownDt from '../../Ui Component/dropDownParam'
import DataTable from './ManagementTable'
import OrderVsShipped from './OrderVsShipped'
import { HiOutlineRefresh } from 'react-icons/hi'
import ChartTable from '../MisDashboard/ChartTableCombo'

const OrderManagement = () => {
    const [selectedYear, setSelectedYear] = useState('');
    const [plData, setPlData] = useState(null)
    const [capPlanData, setCapPlanData] = useState(null)
    const [fabStatus, setFabStatus] = useState(null)
    const [selected, setSelected] = useState(null)
    const { data: proLsData, isLoading: isPlLoading, refetch: profitRefetch } = useGetProfitLossDataQuery({ params: { filterYear: (selectedYear?.name ? selectedYear.name : '' || selectedYear) } })
    const { data: capPlaData, isLoading: isCapPlanLoading } = useGetCapPlanDataQuery({ params: { filterCom: (selected?.name ? selected.name : '' || selected) } })
    const { data: fabSts, isLoading: isFabStsLoading } = useGetFabStsDataQuery({ params: {} })
    const profitLossData = useMemo(() => proLsData?.data ? proLsData?.data : [], [proLsData])
    const capcityPlaData = useMemo(() => capPlaData?.data ? capPlaData?.data : [], [capPlaData])

    const fabricSts = useMemo(() => fabSts?.data ? fabSts?.data : [], [fabSts])


    useEffect(() => {
        if (!isPlLoading) {
            setPlData(profitLossData)
        }
        if (!isCapPlanLoading) {
            setCapPlanData(capcityPlaData)
        }
        if (!isFabStsLoading) {
            setFabStatus(fabricSts)
        }
    }, [isPlLoading, profitLossData, isCapPlanLoading, capcityPlaData, isFabStsLoading, fabricSts])

    if (!plData || isPlLoading || !capPlanData || isCapPlanLoading || !fabStatus || isFabStsLoading) {
        return <Scene />
    }

    console.log(capPlanData, 'capPlanData');
    return (
        <div className='h-full w-full overflow-auto'>
            <div className=''> <Header /></div>
            <div className='grid grid-cols-2 '>
                <div className='w-full h-[100%]'>
                    <DataTable /> </div>
                <div className=''> <CardWrapper name={'Order Value Vs Shipped Value'}>
                    <OrderVsShipped />
                </CardWrapper></div>
            </div >
            <div className='grid grid-cols-1'>
                <CardWrapper name={'Fabric Cost-Plan vs Actual'}><ChartTable /></CardWrapper>
            </div>
            <div className='grid grid-cols-3 '>
                <div><CardWrapper name={'Profit & Loss Buyer Wise'}>
                    <div className='flex items-center justify-end w-full text-center'> <DropdownData selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
                        <div className='flex  group relative'>
                            <button
                                className=' bg-sky-500 rounded-sm p-1 flex items-center justify-center h-[30px] text-center font-normal text-[16px] border-2 border-[#E0E0E0]'
                                onClick={() => profitRefetch()}>
                                <HiOutlineRefresh />
                            </button>
                            <span className='group-hover:opacity-100 transition-opacity bg-gray-800 px-1 bottom-6 text-sm text-gray-100 rounded-md -translate-x-1/2 absolute opacity-0 z-40'>
                                Refresh
                            </span>
                        </div>
                    </div>
                    <NegativeChart plData={plData} />
                </CardWrapper></div>
                <div className='h-full'><CardWrapper name={'Next 6 Month Production Capacity '}><CapacityPlanner capPlanData={capPlanData} selected={selected} setSelected={setSelected} /></CardWrapper></div>
                <div><CardWrapper name={'Upcoming 3 Months Fabric Status'}><FabStsChart fabStatus={fabStatus} id={'upCommingFabSts'} /></CardWrapper></div>
            </div>

        </div >
    )
}

export default OrderManagement

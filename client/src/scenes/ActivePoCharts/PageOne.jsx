import React, { use, useEffect, useState } from 'react'



import PieActiveArc from '../../components/ArcPieChart'
import { useGetTopFiveSuppTurnOvrQuery, useGetMonthlyReceivablesQuery, useGetSuppEfficencyQuery, useGetOverAllSupplierContributionQuery, } from '../../redux/service/poData'
import { useGetTopItemsQuery } from '../../redux/service/poData'

import StackedBarChart from '../../components/StackedBar'
import StockTreemapChart from '../../components/TreeChart'
import TreeMapChart from '../../components/TreeChart'
import FunnelChart from '../../components/DonutChartMui'
import BloodGrp from '../MisDashboard/BloodGroupDistribution'

const PageOne = ({ selectedYear }) => {
    const { data: monthlyreceivable } = useGetMonthlyReceivablesQuery()
    const { data: threeMntTrurOver } = useGetTopFiveSuppTurnOvrQuery()
    const monthlyReceivables = monthlyreceivable?.data || [];
    const topSupplierLastTrurnOver = threeMntTrurOver?.data || []
    const { data: topItem } = useGetTopItemsQuery({ finYearData: JSON.stringify(selectedYear?.name ? selectedYear.name : '' || selectedYear) })
    const { data } = useGetSuppEfficencyQuery({ suppEffFin: JSON.stringify(selectedYear?.name ? selectedYear.name : '' || selectedYear) })
    const { data: overAllSupData } = useGetOverAllSupplierContributionQuery({ suppContribution: JSON.stringify(selectedYear?.name ? selectedYear.name : '' || selectedYear) })
    const overAllSuppCon = overAllSupData?.data || []

    const suppEfficiency = data?.data || [];
    console.log(selectedYear, 'yra');
    const topItems = topItem?.data || [];


    return (
        <div className=''>
            <div className='grid grid-cols-3 w-full '>
                <div className='w-[98%] m-3 bg-white rounded'>

                    <h1 className='text-center font-semibold text-lg   rounded-xs flex items-center justify-center h-[30px] border-2] text-gray-800'>Top Items</h1>


                    <div className=''><BloodGrp topItems={topItems} /></div>
                </div>
                <div className='w-[98%] m-3 bg-white rounded'>

                    <h1 className=' font-semibold text-lg bg-gradient-to-b from-[#afafae] text-center rounded-xs flex items-center justify-center h-[30px] border-2 border-[#E0E0E0] text-gray-800'>Supplier Efficiency</h1>

                    <div className=''>< PieActiveArc suppEfficiency={suppEfficiency} /></div>

                </div>
                <div className='w-[98%] m-3  bg-white rounded'>
                    <h1 className=' font-semibold text-lg bg-gradient-to-b from-[#afafae] text-center rounded-xs flex items-center justify-center h-[30px] border-2 border-[#E0E0E0] text-gray-800'>Top Turnovers of Last three Month</h1>
                    <div className=''><FunnelChart topSupplierLastTrurnOver={topSupplierLastTrurnOver} /></div>
                </div>

            </div>
            <div className='w-full flex'>

                <div className='w-[44%] m-3  bg-white rounded '>
                    <h1 className=' font-semibold text-lg bg-gradient-to-b from-[#afafae] text-center rounded-xs flex items-center justify-center h-[30px] border-2 border-[#E0E0E0] text-gray-800'>PO Receivable Qty's For Next 3 Month's Based On Supplier </h1><StackedBarChart monthlyReceivables={monthlyReceivables} id={`poReaceivables`} /></div>
                <div className='w-[66%]  m-3  bg-white rounded'>
                    <h1 className='text-center font-semibold text-lg bg-gradient-to-b from-[#afafae]  rounded-xs flex items-center justify-center h-[30px] border-2 border-[#E0E0E0] text-gray-800'>Supplier Contribution Based On Turn Over</h1>
                    <div className=''>< TreeMapChart overAllSuppCon={overAllSuppCon} /></div>
                </div></div>
        </div>
    )
}

export default PageOne
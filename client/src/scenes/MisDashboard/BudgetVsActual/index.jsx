import React from 'react'
import CardWrapper from '../../../components/CardWrapper'

import BudgetVsActualDetReport from './BudgetVsActualReport'
import ChartTable from '../ChartTableCombo'


const BudgetVsActualReport = () => {
    return (
        <CardWrapper name={"Bttrition"}>
            <ChartTable />
        </CardWrapper>
    )
}

export default BudgetVsActualReport 
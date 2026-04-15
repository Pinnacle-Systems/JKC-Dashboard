import React from 'react'
import CardWrapper from '../../../components/CardWrapper'
import LineChart from './LineChart'

const ActualVsBudgetValueMonthWise = () => {
    return (
        <CardWrapper heading={"Retention Month Wise"}>
            <LineChart />
        </CardWrapper>
    )
}

export default ActualVsBudgetValueMonthWise
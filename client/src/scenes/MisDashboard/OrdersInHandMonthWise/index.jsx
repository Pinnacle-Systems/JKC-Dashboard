import React from 'react'
import CardWrapper from '../../../components/CardWrapper'
import LineChart from './LineChart'

const OrdersInHandMonthWise = () => {
    return (
        <div className=' '> <CardWrapper heading={"Attrition Breakup"}>
            <LineChart />
        </CardWrapper></div>
    )
}

export default OrdersInHandMonthWise
import React, { useEffect, useState } from 'react';
import Dropdown from '../../components/Dropdown';
import OrderMgmtNumCard from '../../components/OrderMgmtCard';
import { useGetOcrPendingQuery, useGetOrdManagementDataQuery, useGetPreBudgetQuery, useGetShippedDataQuery, useGetWIPDataQuery } from '../../redux/service/orderManagement';
import Scene from '../../components/loader/Loader';
import { useGetFinYearQuery } from '../../redux/service/commonMasters';
import SelectBuyer from '../../Ui Component/modelParam';
import DropdownData from '../../Ui Component/modelUi';

const Header = () => {
    const [selectedYear, setSelectedYear] = useState('');
    const { data: ordMgData, isLoading: isOrderDataLoading } = useGetOrdManagementDataQuery({ params: { filterYear: (selectedYear?.name ? selectedYear.name : '' || selectedYear) } });
    const { data: shipData, isLoading: isShippedDataLoading } = useGetShippedDataQuery({ params: { filterYear: (selectedYear?.name ? selectedYear.name : '' || selectedYear) } })
    const { data: ocrPend, isLoading: isOcrPendDataLoading } = useGetOcrPendingQuery({ params: { filterYear: (selectedYear?.name ? selectedYear.name : '' || selectedYear) } })
    const { data: WIPData, isLoading: isWIPDataLoading } = useGetWIPDataQuery({ params: { filterYear: (selectedYear?.name ? selectedYear.name : '' || selectedYear) } })
    const { data: preBudgetData, isLoading: isPreBuLoading } = useGetPreBudgetQuery({ params: { filterYear: (selectedYear?.name ? selectedYear.name : '' || selectedYear) } })
    const { data: yearData } = useGetFinYearQuery()
    const [misData, setMisData] = useState(null);
    const [shippedData, setShippedData] = useState(null);
    const [ocrPendData, setOcrPendData] = useState(null)
    const [wipData, setWipData] = useState(null)
    const [preBudget, setPreBudget] = useState(null)

    useEffect(() => {
        if (!isOrderDataLoading && !isShippedDataLoading && !isOcrPendDataLoading && !isWIPDataLoading) {
            setMisData(ordMgData);
            setShippedData(shipData);
            setOcrPendData(ocrPend);
            setWipData(WIPData);
            setPreBudget(preBudgetData)
        }
    }, [isOrderDataLoading, isShippedDataLoading, isOcrPendDataLoading, isWIPDataLoading, ordMgData, shipData, ocrPend, WIPData, preBudgetData]);

    if (isOrderDataLoading || isShippedDataLoading || isOcrPendDataLoading || isWIPDataLoading || !misData || !shippedData || !ocrPendData || !wipData || !preBudget) {
        return <Scene />;
    }

    return (
        <>
            <div className='bg-[#ADB612] h-[30px] flex justify-end items-center'>
                <div className=" "><DropdownData selectedYear={selectedYear} setSelectedYear={setSelectedYear} /></div>

            </div>
            <div className=''>
                <OrderMgmtNumCard misData={misData} shippedData={shippedData} ocrPendData={ocrPendData} wipData={wipData} preBudget={preBudget} />
            </div>
        </>
    );
}

export default Header;

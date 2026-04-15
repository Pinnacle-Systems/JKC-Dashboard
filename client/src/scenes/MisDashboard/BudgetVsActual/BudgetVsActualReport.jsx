import React, { useEffect, useState } from 'react';
import { useGetBudgetVsActualQuery } from '../../../redux/service/misDashboardService';
import DropdownCom from '../../../Ui Component/modelParam';
import { useGetBuyerNameQuery, useGetFinYearQuery, useGetMonthQuery } from '../../../redux/service/commonMasters';
import { HiOutlineRefresh } from 'react-icons/hi';

const ComparisonTableWithProgressBar = () => {
    const [selectedOption, setSelectedOption] = useState('Detailed');
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const [selectedBuyer, setSelectedBuyer] = useState('');
    const [selectedYear, setSelectedYear] = useState('2022');
    const [selectedMonth, setSelectedMonth] = useState('January');
    const [buyerNm, setBuyerNm] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [yearData, setYearData] = useState([]);
    const { data: buyer } = useGetBuyerNameQuery({ params: {} });
    const { data: month } = useGetMonthQuery({ params: { filterYear: selectedYear || '', filterBuyer: selectedBuyer || '' } });
    const { data: year } = useGetFinYearQuery({});
    const { data: actualVsBuget, refetch } = useGetBudgetVsActualQuery({ params: { filterMonth: selectedMonth || '', filterSupplier: selectedBuyer || '', filterYear: selectedYear || '', filterAll: selectedOption } });
    const budgetVsActualData = actualVsBuget?.data || [];

    useEffect(() => {
        if (buyer?.data || month?.data) {
            const buyerName = (buyer?.data ? buyer?.data : []).map((item) => item.buyerName);
            const monData = (month?.data ? month?.data : []).map((mon) => mon.month);
            const finYearData = (year?.data ? year?.data : []).map((year) => year.finYear);
            setBuyerNm(buyerName);
            setMonthData(monData);
            setYearData(finYearData);
        }
    }, [buyer, month, year]);

    const valueFormatter = (value) => {
        const formattedValue = parseFloat(value ? value : 0).toFixed(2);
        return isNaN(formattedValue) ? '' : formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const groupedOrders = budgetVsActualData.reduce((acc, order) => {
        const key = `${order.orderNo}-${order.buyerCode}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(order);
        return acc;
    }, {});

    const findActualProfit = (group, orderNo, buyerCode) => {
        const actualOrder = group.find(order => order.orderNo === orderNo && order.buyerCode === buyerCode && order.typeName === 'ACTUAL');
        return actualOrder ? actualOrder.actProfit : null;
    };

    return (
        <div className="flex flex-col w-full h-[64vh] pb-4">
            <div className="w-full overflow-scroll">
                <div className='flex gap-5 justify-end'>
                    <div className="flex justify-end p-1 w-[100%]">
                        <h2></h2>
                        <div className="flex px-2">
                            <div className="flex items-center px-2">
                                <input
                                    type="radio"
                                    id="Detailed1"
                                    name="view"
                                    value="Detailed1"
                                    checked={selectedOption === 'Detailed1'}
                                    onChange={handleOptionChange}
                                    className="mr-2"
                                />
                                <label htmlFor="all" className="text-gray-700">All</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="Detailed"
                                    name="view"
                                    value="Detailed"
                                    checked={selectedOption === 'Detailed'}
                                    onChange={handleOptionChange}
                                    className="mr-2"
                                />
                                <label htmlFor="detailed" className="text-gray-700">Detailed</label>
                            </div>
                        </div>

                        <DropdownCom
                            selectedBuyer={selectedBuyer}
                            setSelectedBuyer={setSelectedBuyer}
                            selectedMonth={selectedMonth}
                            setSelectedMonth={setSelectedMonth}
                            selectedYear={selectedYear}
                            setSelectedYear={setSelectedYear}
                            options={buyerNm}
                            monthOptions={monthData}
                            yearOptions={yearData}
                            columnHeaderHeight={"30"}
                        />

                        <div className='flex  group relative'>
                            <button
                                className=' bg-sky-500 rounded-sm p-1 flex items-center justify-center h-[30px] text-center font-normal text-[16px] border-2 border-[#E0E0E0]'
                                onClick={() => refetch()}>
                                <HiOutlineRefresh />
                            </button>
                            <span className='group-hover:opacity-100 transition-opacity bg-gray-800 px-1 bottom-6 text-sm text-gray-100 rounded-md -translate-x-1/2 absolute opacity-0 z-40'>
                                Refresh
                            </span>
                        </div>
                    </div>
                </div>
                <table className="table w-[100%]">
                    <thead className="bg-[#ADB612] w-[100%]">
                        <tr className='w-full'>
                            <th className='text-[14px] font-semibold py-2 border border-gray-300'>S/No</th>
                            <th className='text-[14px] font-semibold border border-gray-300'>Order No</th>
                            <th className='text-[14px] font-semibold border border-gray-300'>Customer</th>
                            <th className='text-[14px] font-semibold border border-gray-300'>Type</th>
                            <th className='text-[14px] font-semibold border border-gray-300'>Yarn</th>
                            <th className='text-[14px] font-semibold border border-gray-300'>Fabric</th>
                            <th className='text-[14px] font-semibold border border-gray-300'>Acc</th>
                            <th className='text-[14px] font-semibold border border-gray-300'>CMT</th>
                            <th className='text-[14px] font-semibold border border-gray-300'>Com Exp</th>
                            <th className='text-[14px] font-semibold border border-gray-300'>Sales</th>
                            <th className='text-[14px] font-semibold border border-gray-300'>Profit/Loss</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(groupedOrders).map((key, index) => (
                            <React.Fragment key={key}>
                                {groupedOrders[key].map((order, subIndex) => {
                                    const actualProfit = findActualProfit(groupedOrders[key], order.orderNo, order.buyerCode, order.typeName === 'ACTUAL');
                                    { console.log(actualProfit, 'actualProfit') }
                                    return (
                                        <tr
                                            key={`${index}-${subIndex}`}
                                            className={order.typeName === 'BUDGET' ? 'bg-gray-100' : 'bg-white'}
                                        >
                                            {subIndex === 0 && (
                                                <>
                                                    <td
                                                        className={`text-[13px] text-black border border-gray-300 py-1 ${order.typeName === 'BUDGET' ? 'bg-white' : ''}`}
                                                        rowSpan={groupedOrders[key].length}
                                                    >
                                                        {index + 1}
                                                    </td>
                                                    <td
                                                        className={`text-[13px] text-black border border-gray-300 py-1 ${order.typeName === 'BUDGET' ? 'bg-white' : ''}`}
                                                        rowSpan={groupedOrders[key].length}
                                                    >
                                                        {order.orderNo}
                                                    </td>
                                                    <td
                                                        className={`text-[13px] text-black border border-gray-300 py-1 ${order.typeName === 'BUDGET' ? 'bg-white' : ''}`}
                                                        rowSpan={groupedOrders[key].length}
                                                    >
                                                        {order.buyerCode}
                                                    </td>
                                                </>
                                            )}
                                            <td className="text-[13px] text-black border border-gray-300 py-1">{order.typeName}</td>
                                            <td className="text-[13px] text-black border border-gray-300 py-1 text-right">{valueFormatter(order.yarnCost)}</td>
                                            <td className="text-[13px] text-black border border-gray-300 py-1 text-right">{valueFormatter(order.fabricCost)}</td>
                                            <td className="text-[13px] text-black border border-gray-300 py-1 text-right">{valueFormatter(order.accCost)}</td>
                                            <td className="text-[13px] text-black border border-gray-300 py-1 text-right">{valueFormatter(order.cmtCost)}</td>
                                            <td className="text-[13px] text-black border border-gray-300 py-1 text-right">{valueFormatter(order.otherCost)}</td>
                                            <td className="text-[13px] text-black border border-gray-300 py-1 text-right">{valueFormatter(order.saleCost)}</td>
                                            <td className={`text-[13px] text-black border border-gray-300 py-1 text-right ${order.typeName === 'BUDGET' && actualProfit !== null && order.actProfit < actualProfit ? 'text-black' : 'text-green-500'}`}>
                                                {valueFormatter(order.actProfit)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComparisonTableWithProgressBar;

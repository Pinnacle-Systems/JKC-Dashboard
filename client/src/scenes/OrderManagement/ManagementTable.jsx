import React from 'react';
import { useGetOrderStsBuyerWiseQuery } from '../../redux/service/orderManagement';
import { HiOutlineRefresh } from 'react-icons/hi';

const DataTable = () => {
    const { data: orderSts, refetch } = useGetOrderStsBuyerWiseQuery({ params: {} });
    console.log(orderSts, 'sts');
    const buyerWiseOrdSts = orderSts?.data ? orderSts?.data : [];
    console.log(buyerWiseOrdSts, 'comData');

    // Preprocess data to group by customer
    const groupedData = buyerWiseOrdSts.reduce((acc, row) => {
        const customer = row.customer;
        if (!acc[customer]) {
            acc[customer] = [];
        }
        acc[customer].push(row);
        return acc;
    }, {});

    const grandTotals = {
        orderQty: 0,
        plTaken: 0,
        cancelOrder: 0,
        ocrCom: 0,
        ocrFor: 0,
    };

    const renderGroupedData = () => {
        return Object.keys(groupedData).map((customer, index) => {
            const rows = groupedData[customer];

            rows.forEach(row => {
                grandTotals.orderQty += row.orderQty;
                grandTotals.plTaken += row.plTaken;
                grandTotals.cancelOrder += row.cancelOrder;
                grandTotals.ocrCom += row.ocrCom;
                grandTotals.ocrFor += row.ocrFor;
            });

            return (
                <React.Fragment key={index}>
                    <tr className=''>
                        <td rowSpan={rows.length} className="text-center align-middle border border-gray-300 text-xs font-medium">{customer}</td>
                        <td className="border border-gray-300 text-right text-xs font-medium p-1">{rows[0].year}</td>
                        <td className="border border-gray-300 text-right text-xs font-medium p-1">{rows[0].orderQty}</td>
                        <td className="border border-gray-300 text-right text-xs font-medium p-1">{rows[0].plTaken}</td>
                        <td className="border border-gray-300 text-right text-xs font-medium p-1">{rows[0].cancelOrder}</td>
                        <td className="border border-gray-300 text-right text-xs font-medium p-1">{rows[0].ocrCom}</td>
                        <td className="border border-gray-300 text-right text-xs font-medium p-1">{rows[0].ocrFor}</td>
                        <td className="border border-gray-300 text-right text-xs font-medium p-1">{rows[0].orderQty + rows[0].plTaken + rows[0].cancelOrder + rows[0].ocrCom + rows[0].ocrFor}</td>
                    </tr>
                    {rows.slice(1).map((row, subIndex) => (
                        <tr key={`${index}-${subIndex}`} className=''>
                            <td className="border border-gray-300 text-right text-xs font-medium p-1">{row.year}</td>
                            <td className="border border-gray-300 text-right text-xs font-medium p-1">{row.orderQty}</td>
                            <td className="border border-gray-300 text-right text-xs font-medium p-1">{row.plTaken}</td>
                            <td className="border border-gray-300 text-right text-xs font-medium p-1">{row.cancelOrder}</td>
                            <td className="border border-gray-300 text-right text-xs font-medium p-1">{row.ocrCom}</td>
                            <td className="border border-gray-300 text-right text-xs font-medium p-1">{row.ocrFor}</td>
                            <td className="border border-gray-300 text-right text-xs font-medium p-1">{row.orderQty + row.plTaken + row.cancelOrder + row.ocrCom + row.ocrFor}</td>
                        </tr>
                    ))}
                </React.Fragment>
            );
        });
    };
    const grandTotal = grandTotals.orderQty + grandTotals.plTaken + grandTotals.cancelOrder + grandTotals.ocrCom + grandTotals.ocrFor;
    return (
        <div className='h-[70vh] overflow-scroll '>
            <div className=' flex items-center'>
                <h1 className='w-full text-center font-normal text-[16px] bg-gradient-to-b from-[#afafae] text-center rounded-xs flex items-center justify-center h-[30px] border-2 border-[#E0E0E0] text-black'>
                    Order Status Buyer Wise
                </h1>
                <div className='  flex items-center justify-end'>
                    <div className='flex  group relative'>
                        <button
                            className=' bg-sky-500 rounded-sm p-1 flex items-center justify-center h-[30px] text-center font-normal text-[16px] border-2 border-[#E0E0E0]'
                            onClick={() => refetch()}>
                            <HiOutlineRefresh />
                        </button>
                        <span className='group-hover:opacity-100 transition-opacity bg-gray-800 px-1 right-1 text-sm text-gray-100 rounded-md -translate-x-1/2 absolute opacity-0 z-40'>
                            Refresh
                        </span>
                    </div>
                </div>
            </div>





            <table className="w-[100%] h-[50vh] border-collapse">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2 text-sm font-medium">Customer</th>
                        <th className="border border-gray-300 p-2 text-sm font-medium">Year</th>
                        <th className="border border-gray-300 p-2 text-sm font-medium">Order Qty</th>
                        <th className="border border-gray-300 p-2 text-sm font-medium">PL Taken</th>
                        <th className="border border-gray-300 p-2 text-sm font-medium">Cancel Order</th>
                        <th className="border border-gray-300 p-2 text-sm font-medium">OCR Completed</th>
                        <th className="border border-gray-300 p-2 text-sm font-medium">OCR Forwarded</th>
                        <th className="border border-gray-300 p-2 text-sm font-medium">Total</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {renderGroupedData()}
                    <tr className="bg-green-300 font-semibold ">
                        <td colSpan={2} className="border border-gray-300 text-right text-xs font-medium p-1">Grand Total</td>
                        <td className="border border-gray-300 text-right text-xs font-medium p-1">{grandTotals.orderQty}</td>
                        <td className="border border-gray-300 text-right text-xs font-medium p-1">{grandTotals.plTaken}</td>
                        <td className="border border-gray-300 text-right text-xs font-medium p-1">{grandTotals.cancelOrder}</td>
                        <td className="border border-gray-300 text-right text-xs font-medium p-1">{grandTotals.ocrCom}</td>
                        <td className="border border-gray-300 text-right text-xs font-medium p-1">{grandTotals.ocrFor}</td>
                        <td className="border border-gray-300 text-right text-xs font-medium p-1">{grandTotal}</td>
                    </tr>
                </tbody>
            </table>
        </div >
    );
};

export default DataTable;

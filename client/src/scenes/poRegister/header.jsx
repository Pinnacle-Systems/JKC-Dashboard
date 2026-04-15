import { useEffect, useState } from 'react';
import { useGetFinYrQuery } from '../../redux/service/poData';

const Header = ({ setYear, year, setMonth, month, setDate, date, setSelectedArticleId, setSelectedSupplier }) => {
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    console.log(date, 'date');

    const quartelyData = [
        {
            q: 'Q1',
            month: [
                { id: 4, month: 'APR' }, { id: 5, month: 'MAY' }, { id: 6, month: 'JUN' }
            ]
        },
        {
            q: "Q2",
            month: [
                { id: 7, month: 'JUL' }, { id: 8, month: 'AUG' }, { id: 9, month: 'SEP' }
            ]
        },
        {
            q: "Q3",
            month: [
                { id: 10, month: 'OCT' }, { id: 11, month: 'NOV' }, { id: 12, month: 'DEC' }
            ]
        },
        {
            q: "Q4",
            month: [
                { id: 1, month: 'JAN' }, { id: 2, month: 'FEB' }, { id: 3, month: 'MAR' }
            ]
        },
    ]
    const { data: finYear } = useGetFinYrQuery();
    const handleSelectYear = (item) => {
        setYear(prevState => {
            const yearIndex = prevState.indexOf(item.finYr);
            if (yearIndex === -1) {
                return [...prevState, item.finYr];
            } else {
                return prevState.filter(selectedYear => selectedYear !== item.finYr);
            }
        });
    };
    const handleSelectMonth = (item) => {
        setMonth(prev => {
            const monthIndex = prev.indexOf(item)
            if (monthIndex === -1) {
                return [...prev, item]
            } else {
                return prev.filter(selectedMnt => selectedMnt !== item)
            }
        })
    }
    const handleSelectQuarter = (q) => {
        const qMonths = q.month.map(i => i.id);
        setMonth(prev => {
            if (q.month.every(i => prev.includes(i.id))) {
                return prev.filter(selectedMnt => !qMonths.includes(selectedMnt))
            } else {
                return [...new Set([...prev, ...qMonths])]
            }
        })
    }
    useEffect(() => {
        if (fromDate && toDate && fromDate !== toDate) {
            setDate([fromDate, toDate]);
        }
    }, [fromDate, toDate, setDate]);

    const onHandleClick = () => {
        setYear([]);
        setMonth([]);
        setFromDate('');
        setToDate('');
        setSelectedSupplier([]);
        setSelectedArticleId([]);
    };

    return (
        <div className=' flex text-center align-center top-Bar w-full'>
            <div className='w-full flex justify-evenly '>
                <div className='flex items-center  gap-5'>
                    <div className='  h-8  cursor-pointer flex items-center  '>
                        <p className=' text-white subheading-font font-semibold mr-2'> Year : </p>
                        {(finYear?.data ? finYear.data : []).map((item, index) => (
                            <button
                                className={`flex  rounded-[5px] px-[2px] h-5 hover:bg-green-200 mr-2 text-sm ${year.includes(item.finYr) ? 'select-clr' : 'bg-white'}`}

                                onClick={() => handleSelectYear(item)}
                                key={index}
                            >
                                {item.finYr}
                            </button>
                        ))}
                    </div>

                </div>
                <div className='flex mt-1 cursor-pointer gap-1'>
                    <p className='subheading-font font-semibold text-white subheading-font flex items-center'> Month :</p>
                    <div className='flex items-center'>
                        {quartelyData.map((q, id) => (
                            <div
                                className={`grid text-xs bg-white  `}
                                key={id}
                            >
                                <div
                                    onClick={() => {
                                        handleSelectQuarter(q)
                                    }}
                                    className={`border ${(q.month.every(i => month.includes(i.id))) ? 'select-clr text-white' : 'bg-white'}`}>
                                    {q.q}
                                </div>
                                <div className='grid grid-cols-3 border border-gray-300 gap-1'>
                                    {q.month.map(m =>
                                        <div key={m.id} onClick={() => {
                                            handleSelectMonth(m.id)
                                        }} className={`border p-1 ${month.includes(m.id) ? 'select-clr text-white' : 'bg-white'}`}>{m.month}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex items-center flex gap-5'> <div class="m-2">
                    <label className='subheading-font font-semibold text-white mr-2' for="firstName">
                        From :
                    </label>
                    <input
                        class=" h-6  w-[8rem]  text-xs leading-tight text-gray-700 border rounded shadow  focus:outline-none focus:shadow-outline"
                        id="firstName"
                        type="date"
                        placeholder="search"
                        value={fromDate}
                        onChange={(e) => { setFromDate(e.target.value) }}
                    />
                </div> <div className='flex items-center'> <label className='subheading-font font-semibold text-white subheading-font font-semibold mr-1'>To :</label >  <input
                    class=" h-6  w-[8rem]  text-xs leading-tight text-gray-700 border rounded shadow  focus:outline-none focus:shadow-outline"
                    id="firstName"
                    type="date"
                    placeholder="search"
                    value={toDate}
                    onChange={(e) => { setToDate(e.target.value) }}
                /></div>

                </div>
                <div className='rounded  flex items-center'>
                    <button className='rounded bg-white text-sm px-1 hover:bg-red-400' onClick={onHandleClick}>Clear All</button>
                </div>

            </div>
        </div>
    )
}

export default Header
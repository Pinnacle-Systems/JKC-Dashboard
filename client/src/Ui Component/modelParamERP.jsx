import React from "react";
import './dropdown.css';

const DropdownCom = ({ selectedBuyer, setSelectedBuyer, options = [], monthOptions = [], selectedMonth, setSelectedMonth, setSelectedYear, seletedYear, yearOptions = [] }) => {
    const handleBuyerChange = (event) => {
        setSelectedBuyer(event.target.value);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };
    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    return (
        <div className="card flex justify-content-center w-[30%] ">
            <div className="h-[0.1rem] flex gap-2 rounded-xs">
                <div>
                    <select className="w-[8.5rem] h-[1.5rem] p-1 text-xs" id="dropdown1" value={selectedBuyer} onChange={handleBuyerChange}>
                        <option className="text-xs" value="">Buyer</option>
                        {options.map((option, index) => (
                            <option className="text-xs w-[10rem]" key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <select className="w-[5rem] h-[1.5rem] p-1 text-xs" id="dropdow3" value={seletedYear} onChange={handleYearChange}>
                        <option className="text-xs" value="">Year</option>
                        {yearOptions.map((yrOption, index) => (
                            <option className="text-xs w-[10rem]" key={index} value={yrOption}>{yrOption}</option>
                        ))}
                        {console.log(yearOptions, 'year')}
                    </select>
                </div>
                <div>
                    <select className="month w-[8.5rem] h-[1.5rem] p-1 text-xs" id="dropdown2" value={selectedMonth} onChange={handleMonthChange}>
                        <option className="text-xs" value="">Month</option>
                        {monthOptions.map((monthOption, index) => (
                            <option className="text-xs w-[10rem]" key={index} value={monthOption}>{monthOption}</option>
                        ))}

                    </select>
                </div>


            </div>
        </div>
    );
};

export default DropdownCom;

import React, { useState } from "react";

import PageOne from "./PageOne";
import PageTwo from "./PageTwo";
import BasicDemo from "../../Ui Component/modelUi";
import DropdownData from "../../Ui Component/modelUi";

const ActivePoCharts = () => {
    const [selectedYear, setSelectedYear] = useState('');
    const [currentActiveTab, setCurrentActiveTab] = useState("Po Reports");
    const tabs = [
        {
            'name': "Po Reports",
            component: <PageOne selectedYear={selectedYear} />,
        },
        {
            'name': "Top purchase",
            component: <PageTwo />,
        },
    ]
    return (
        <div className="relative w-full h-full overflow-hidden ">
            <div className="">
                <div className="flex gap-5 select-clr  justify-between items-center">
                    <div className="flex ">
                        {tabs.map(tab =>
                            <div key={tab.name} className={`${(tab.name === currentActiveTab) ? "bg-white text-black" : ""} m-2 rounded px-1 cursor-pointer`} onClick={() => { setCurrentActiveTab(tab.name) }}>
                                {tab.name}

                            </div>

                        )}  </div>
                    <div className=" "><DropdownData selectedYear={selectedYear} setSelectedYear={setSelectedYear} /></div>

                </div>

                <div className="w-full">
                    {tabs.find(i => i.name === currentActiveTab)?.component}
                </div></div>

        </div>
    );
};

export default ActivePoCharts;

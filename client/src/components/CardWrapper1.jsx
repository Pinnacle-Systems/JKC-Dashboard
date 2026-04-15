import React, { useContext } from 'react';
import { ColorContext } from '../scenes/global/context/ColorContext';
import FilterOptions from './FilterOptionsN';

const CardWrapperN = ({
    heading,
    children,
    onFilterClick,
    onInfoShowText,
    showFilter = true,
}) => {
    const { color } = useContext(ColorContext);

    return (
        <div
            className="group text-center rounded-lg shadow-lg bg-white h-[90px] w-full mb-8 
            transition-transform transform hover:scale-105 hover:shadow-xl"
        >
            {/* Header Section */}
            <div
                className="text-center rounded-t-lg flex items-center justify-between h-[30px] 
                shadow-md px-4 bg-[#FBFCFC] pt-2"
            >
                {/* Left Corner */}
                <h4 className="text-[16px] font-semibold text-gray-800 truncate mt-1">
                    {heading}
                </h4>

                {/* Right Corner (Filter Options) */}
                {showFilter && (
                    <FilterOptions onFilterClick={onFilterClick} onInfoShowText={onInfoShowText} />
                )}
            </div>

            {/* Content Section */}
            <div className="rounded-b-lg w-full flex justify-center bg-[#FBFCFC] items-center h-full">
                <div className="w-full h-full">{children}</div>
            </div>
        </div>
    );
};

export default CardWrapperN;

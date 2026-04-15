import React, { useContext } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Tooltip } from '@mui/material';

const FilterOptions = ({ onFilterClick}) => {
    return (
        <div
            className="flex items-center space-x-4 p-1 rounded-lg transition-all duration-300 
                opacity-0 group-hover:opacity-100 hover:cursor-pointer"
        >
            {/* Filter Button */}
            <div
                onClick={onFilterClick}
                className="flex items-center justify-center w-6 h-6 bg-gray-300 rounded-full shadow-md 
                    hover:bg-gray-100 hover:shadow-lg transition-all duration-300 text-sm cursor-pointer"
            >
                <Tooltip title="Filter" placement="left">
                    <FilterAltIcon
                        className="text-gray-700"
                        style={{ fontSize: '20px' }}
                        alt="Filter"
                    />
                </Tooltip>
            </div>
        </div>
    );
};

export default FilterOptions;

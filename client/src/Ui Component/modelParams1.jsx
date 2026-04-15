import React, { useEffect, useState, useRef } from "react";
import { useGetBuyerNameQuery } from "../redux/service/commonMasters";

const SelectBuyer1 = ({ selectedBuyer, setSelectedBuyer }) => {
    const [buyerOptions, setBuyerOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { data: buyer } = useGetBuyerNameQuery({ params: {} });
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (buyer?.data) {
            const buyerNameOptions = buyer.data.map((item) => ({
                label: item.buyerName,
                value: item.buyerName,
            }));
            setBuyerOptions(buyerNameOptions);
        }
    }, [buyer]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleOptionChange = (value) => {
        setSelectedBuyer(value);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div ref={dropdownRef} className="relative w-64">
            <button
                onClick={toggleDropdown}
                className="w-full bg-white border border-2 border-gray-800 rounded-md shadow-sm 
                           text-left flex items-center justify-between px-4 py-1 text-xs text-gray-700
                           hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                type="button"
            >
                <span>{selectedBuyer ? selectedBuyer : "Select Company"}</span>
                <svg
                    className="w-3 h-3 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50">
                    <div className="max-h-80 overflow-y-auto py-2">
                        {buyerOptions.map((option) => (
                            <div
                                key={option.value}
                                className="flex items-center hover:bg-gray-100 cursor-pointer px-4 py-2"
                                onClick={() => handleOptionChange(option.value)}
                            >
                                <input
                                    type="checkbox"
                                    value={option.value}
                                    checked={selectedBuyer === option.value}
                                    onChange={() => handleOptionChange(option.value)}
                                    className="form-checkbox h-3 w-3 text-blue-600 border-gray-300 rounded mr-2"
                                />
                                <span className="text-xs text-gray-700">{option.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectBuyer1;

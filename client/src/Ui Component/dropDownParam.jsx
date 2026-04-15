import React, { useState, useEffect } from "react";

export default function DropdownDt({ selected, setSelected, option }) {
  const [isOpen, setIsOpen] = useState(false);
  const [buyerOptions, setBuyerOptions] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(selected);

  useEffect(() => { 
    if (option) {
      const mappedOptions = option.map((item) => ({
        label: item.buyerName,
        value: item.buyerName,
      }));
      setBuyerOptions(mappedOptions);
    }
  }, [option]);

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen((prevState) => !prevState);

  // Handle option selection
  const handleOptionChange = (value) => {
    setSelectedBuyer(value); // Update the selected buyer
    setSelected(value); // Update parent component's state if needed
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="relative w-full">
        <button
          onClick={toggleDropdown}
          className="w-full bg-white border border-2 border-gray-800 rounded-md shadow-sm text-left flex items-center justify-between px-4 py-1 text-xs text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          type="button"
        >
          <span>{selectedBuyer || 'Select Company'}</span>
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

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
            <div className="py-2">
              {buyerOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center hover:bg-gray-100 cursor-pointer px-4 py-1"
                  onClick={() => handleOptionChange(option.value)} // Set selectedBuyer on click
                >
                  <input
                    type="checkbox"
                    checked={selectedBuyer === option.value} // Check if this option is selected
                    onChange={() => handleOptionChange(option.value)} // Update selectedBuyer when clicked
                    className="mr-2 border border-gray-300 rounded w-3 h-3"
                  />
                  <span className="text-xs text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

const SalaryFilter = ({ minSalary, maxSalary, onFilterChange }) => {
  const [salaryRange, setSalaryRange] = useState({
    min: minSalary,
    max: maxSalary,
  });

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    const newValue = Number(value);

    if (name === "min") {
      setSalaryRange((prev) => ({
        ...prev,
        min: Math.min(newValue, prev.max - 1),
      }));
      onFilterChange(newValue, salaryRange.max);
    } else if (name === "max") {
      setSalaryRange((prev) => ({
        ...prev,
        max: Math.max(newValue, prev.min + 1),
      }));
      onFilterChange(salaryRange.min, newValue);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-300 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-700">Salary Filter</h2>
        <FaFilter className="text-blue-500 text-xl" />
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-500 mb-1">Min Salary</label>
          <input
            type="number"
            name="min"
            value={salaryRange.min}
            onChange={handleSliderChange}
            className="w-full p-2 border border-blue-400 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="₹ Min"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm text-gray-500 mb-1">Max Salary</label>
          <input
            type="number"
            name="max"
            value={salaryRange.max}
            onChange={handleSliderChange}
            className="w-full p-2 border border-blue-400 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="₹ Max"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setSalaryRange({ min: minSalary, max: maxSalary })}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
        >
          <FaTimes className="inline-block mr-2" /> Reset
        </button>

        <button
          onClick={() => onFilterChange(salaryRange.min, salaryRange.max)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default SalaryFilter;

import { useState, useEffect, useRef } from "react";
const FinYearQuarter = ({
  selectedYear,
  selectmonths,
  setSelectmonths,
  selectQuarter = null, // ✅ OPTIONAL
  autoFocusBuyer,
  autoSelect = false,
}) => {
  const [months, setMonths] = useState([]);
  const buyerRef = useRef(null);

  useEffect(() => {
    if (autoFocusBuyer && buyerRef.current) {
      buyerRef.current.focus();
    }
  }, [autoFocusBuyer]);

  useEffect(() => {
    if (!selectedYear || typeof selectedYear !== "string") return;

    const [startStr, endStr] = selectedYear.split("-").map(Number);
    const startYear = 2000 + startStr;
    const endYear = 2000 + endStr;

    // 🔹 Full FY months
    const allMonths = [
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
      "January",
      "February",
      "March",
    ];

    // 🔹 Quarter mapping
    const quarterMonthMap = {
      Q1: ["April", "May", "June"],
      Q2: ["July", "August", "September"],
      Q3: ["October", "November", "December"],
      Q4: ["January", "February", "March"],
    };

    // 🔹 Decide which months to use
    const monthNames =
      !selectQuarter || selectQuarter === "ALL"
        ? allMonths
        : quarterMonthMap[selectQuarter] || [];

    const monthList = monthNames.map((month) => {
      const year = ["January", "February", "March"].includes(month)
        ? endYear
        : startYear;

      return `${month} ${year}`;
    });

    setMonths(monthList);

    // 🔹 Auto select first month
    if (!selectmonths && autoSelect && monthList.length > 0) {
      setSelectmonths(monthList[0]);
    }
  }, [selectedYear, selectQuarter]);

  return (
    <div className="max-w-md mx-auto">
      <select
        ref={buyerRef}
        className="border-gray-300 p-1 w-32 h-6.5 text-gray-900 text-xs rounded-md
                   focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        value={selectmonths}
        onChange={(e) => setSelectmonths(e.target.value)}
      >
        <option value="">Select Month</option>
        {months.map((month, index) => (
          <option key={index} value={month}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};
export default FinYearQuarter;

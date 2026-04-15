import React, { useState, useContext } from "react";
import CardWrapperN from "./CardWrapper1";
import ModelMultiSelectERP from "./ModelMultiSelectERP";
import Movable from "./Movable";
import { ColorContext } from "../scenes/global/context/ColorContext";
import { FaSyncAlt } from "react-icons/fa";
import { useExecuteProcedureMutation } from "../redux/service/misDashboardServiceERP";

const NumericCardERP = ({ misData, selectedYear, setSelectedYear }) => {
  const { color } = useContext(ColorContext);
  const [selectedBuyer, setSelectedBuyer] = useState();
  const [showModel, setShowModel] = useState(false);
  const [executeProcedure] = useExecuteProcedureMutation();
  // Previous Month

  // MIS Data
  const totalTurnOver = misData?.data?.totalTurnOver || {};
  const profit = misData?.data?.profit || {};
  const newCustomers = misData?.data?.newCustomers || {};
  const topCustomers = misData?.data?.topCustomers || {};
  const loss = misData?.data?.loss || {};

  const handleClick = async () => {
    try {
      const response = await executeProcedure().unwrap();
      alert(response.message);
    } catch (error) {
      alert("Error: " + error.data?.error || "Failed to execute procedure");
    }
  };
  const data = [
    {
      name: `Turn Over  ${selectedYear}`,
      borderColor: "#1F588B",
      value: `₹ ${(totalTurnOver.currentValue || 0).toLocaleString('en-IN')}`,
      qty: `${(totalTurnOver.currentQty || 0).toLocaleString('en-IN')}`,
      previousValue: `₹ ${(totalTurnOver.prevValue || 0).toLocaleString('en-IN')}`,
      previousQty: `${(totalTurnOver.prevQty || 0).toLocaleString('en-IN')}`,
    },
    {
      name: `Profit  ${selectedYear}`,
      borderColor: "#62AAA3",
      value: `₹ ${(profit.currentValue || 0).toLocaleString('en-IN')}`,
      qty: `${(profit.currentQty || 0).toLocaleString('en-IN')}`,
      previousValue: `₹ ${(profit.prevValue || 0).toLocaleString('en-IN')}`,
      previousQty: `${(profit.prevQty || 0).toLocaleString('en-IN')}`,
    },
    {
      name: `New Customers  ${selectedYear}`,
      borderColor: "#96A669",
      value: `₹ ${(newCustomers.currentValue || 0).toLocaleString('en-IN')}`,
      qty: `${(newCustomers.currentQty || 0).toLocaleString('en-IN')}`,
      previousValue: `${(newCustomers.prevValue || 0).toLocaleString('en-IN')}`,
      previousQty: `${(newCustomers.prevQty || 0).toLocaleString('en-IN')}`,
    },
    {
      name: `Top 5 Customers  ${selectedYear}`,
      borderColor: "#D49B37",
      value: `₹ ${(topCustomers.currentValue || 0).toLocaleString('en-IN')}`,
      qty: `${(topCustomers.currentQty || 0).toLocaleString('en-IN')}`,
      previousValue: `${(topCustomers.prevValue || 0).toLocaleString('en-IN')}`,
      previousQty: `${(topCustomers.prevQty || 0).toLocaleString('en-IN')}`,
    },
    {
      name: `Loss  ${selectedYear}`,
      borderColor: "#D44A37",
      value: `₹ ${(loss.currentValue || 0).toLocaleString('en-IN')}`,
      qty: `${(loss.currentQty || 0).toLocaleString('en-IN')}`,
      previousValue: `${(loss.prevValue || 0).toLocaleString('en-IN')}`,
      previousQty: `${(loss.prevQty || 0).toLocaleString('en-IN')}`,
    },
  ];

  const [activeTabs, setActiveTabs] = useState(data.map(() => "total"));

  const toggleTab = (index, tab) => {
    setActiveTabs((prev) => ({
      ...prev,
      [index]: tab,
    }));
  };

  const onFilterClick = () => {
    setShowModel(!showModel);
  };

  return (
    <div className="flex justify-around w-full h-full gap-1">
      {showModel && (
        <Movable divId="cardMovable">
          <ModelMultiSelectERP
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            showModel={showModel}
            setShowModel={setShowModel}
            color={color}
            selectedBuyer={selectedBuyer}
            setSelectedBuyer={setSelectedBuyer}
          />
        </Movable>
      )}
      <button
        className="absolute right-0 top-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-b
       from-gray-300 to-gray-400 text-gray-800 shadow-[3px_3px_0px_#888] hover:brightness-105
        active:shadow-none active:translate-y-1 active:scale-95 transition-all duration-200 group"
        onClick={handleClick}

      >
        <FaSyncAlt className="text-base drop-shadow-sm" />
        <span className="text-xs font-semibold hidden group-hover:inline-block">
          Refresh
        </span>
      </button>
      {data.map((val, i) => (
        <div key={i} className="w-[24.5%] px-1 text-center">
          <CardWrapperN
            heading={val.name}
            showModel={showModel}
            setShowModel={setShowModel}
            onFilterClick={onFilterClick}
          >
          <div className="h-full w-full bg-white rounded-xl shadow-lg pt-2 px-4">
  {/* Header Section */}
  <div className="flex justify-between items-center mb-4 mt-1 gap-4">
    <div>
      <h1 className="text-sm font-medium text-gray-500">Qty  (pcs)</h1>
      <span className="text-lg font-bold text-gray-800 block mt-2"> 
        {val.qty}
      </span>
    </div>
    <div className="text-right">
      <h1 className="text-sm font-medium text-gray-500">Value</h1>
      <span className="text-lg font-bold text-gray-800 block mt-2"> 
        {val.value}
      </span>
    </div>
  </div>
</div>
          </CardWrapperN>
        </div>
      ))}
    </div>
  );
};

export default NumericCardERP;

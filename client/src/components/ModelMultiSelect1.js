import React, { useContext, useState, useEffect } from "react";
import DropdownDt from "../Ui Component/dropDownParam";
import { useGetBuyerNameQuery } from "../redux/service/commonMasters";
import { ColorContext } from "../scenes/global/context/ColorContext";

const BuyerMultiSelect = ({ selected, setSelected, showModel, setShowModel }) => {
  const { color } = useContext(ColorContext);
  const [selectedOption,setSelectedOption ] = useState(selected)
  const { data: buyer } = useGetBuyerNameQuery({ params: {} });
  const option = buyer?.data ? buyer?.data : [];
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
   // Center modal when it opens
  useEffect(() => {
    if (showModel) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setPosition({ x: centerX, y: centerY });
    }
  }, [showModel]);

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleOkClick = () => {
    if (selectedOption) {
      console.log("Selected Buyer:", selectedOption);
      setSelected(selectedOption)
    
    }

    setShowModel(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative"
    >
      <div
        className={`model-box ${showModel ? "open" : "closed"}`}
        style={{
          position: "fixed",
          top: `${position.y}px`,
          left: `${position.x}px`,
          transform: "translate(-50%, -50%)",
          zIndex: "800",
          borderRadius: "8px",
          borderTop: `8px solid ${color || "#3B82F6"}`,
          width: "300px",
          height: "500px",
          backgroundColor: "#F1F3F6",
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          className="model-content"
          style={{
            padding: "20px",
            overflowY: "auto",
            height: "100%",
          }}
        >
          <label
            htmlFor="employeeType"
            className="block text-sm font-semibold text-gray-700 mb-3"
          >
            Select Company
          </label>

          {/* Dropdown Component */}
          <div className="mb-4">
            <DropdownDt selected={selectedOption} setSelected={setSelectedOption} option={option} />
          </div>

          <button
            className="absolute right-3 bottom-5 px-5 py-2 text-sm font-semibold text-white rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
            style={{
              backgroundColor: color || "#1D4ED8",
            }}
            onClick={handleOkClick} // Handle Ok click
          >
            Ok
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {showModel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          style={{
            zIndex: "700",
          }}
          onClick={() => setShowModel(false)}
        ></div>
      )}
    </div>
  );
};

export default BuyerMultiSelect;

import React, { useState } from "react";
import DropdownDt from "../Ui Component/dropDownParam";
import { useGetBuyerNameQuery } from "../redux/service/commonMasters";
import DropdownData from "../Ui Component/modelUi";
import SelectBuyer from "../Ui Component/modelParam";

const ModelMultiSelectChart2 = ({
  color,
  showModel,
  setShowModel,
  selectedYear,
  setSelectedYear,
  selectedBuyer,
  setSelectedBuyer,
}) => {
  const { data: buyer, isLoading: isbuyerLoad } = useGetBuyerNameQuery({ params: {} });
  const option = buyer?.data ? buyer?.data : [];

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Mouse Down Handler: When mouse button is pressed
  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    e.preventDefault(); // Prevent default action to avoid unwanted behavior during drag
  };

  // Mouse Move Handler: When mouse moves with the button pressed
  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  // Mouse Up Handler: When mouse button is released
  const handleMouseUp = () => {
    setDragging(false);
  };

  // Prevent the mouse move handler from triggering when not dragging
  const handleMouseLeave = () => {
    if (dragging) {
      setDragging(false); // Stop dragging if the mouse leaves the model area
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      {/* Slide-Up Model */}
      <div
        className={`model-box ${showModel ? "open" : "closed"}`}
        style={{
          position: "fixed",
          top: `${position.y}px`, // Use top for floating behavior
          left: `${position.x}px`,
          width: "290px",
          height: "500px", // Height of the sliding model
          backgroundColor: "#F1F3F6",
          boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.3)", // Deeper shadow for 3D effect
          transition: dragging ? "none" : "top 0.3s ease-in-out", // Smooth transition for slide-up
          borderRadius: "8px 8px 0 0",
          borderTop: `8px solid ${color || "#3B82F6"}`,
          zIndex: "20",
          cursor: dragging ? "grabbing" : "grab", // Change cursor on dragging
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
          <div className="p-5 overflow-y-auto h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Company</h2>

            {/* Dropdowns */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-600">Year:</label>
                <DropdownData selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
              </div>

              <div className="flex items-center space-x-3">
                <SelectBuyer
                  style={{ width: "200px" }}
                  selectedBuyer={selectedBuyer}
                  setSelectedBuyer={setSelectedBuyer}
                  columnHeaderHeight={"30"}
                />
              </div>
            </div>
          </div>

          {/* Ok Button */}
          {/* <button
            className={`absolute right-0 bottom-5 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:outline-none`}
            style={{
              backgroundColor: color ? color : "blue",
            }}
            onClick={() => setShowModel(false)}
          >
            Ok
          </button> */}
        </div>
      </div>

      {/* Backdrop */}
      {showModel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          style={{
            zIndex: "10", // Ensures backdrop appears below the model
          }}
          onClick={() => setShowModel(false)}
        ></div>
      )}
    </div>
  );
};

export default ModelMultiSelectChart2;

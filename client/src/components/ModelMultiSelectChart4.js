import React, { useState, useRef, useEffect } from "react";
import { useGetBuyerNameQuery } from "../redux/service/commonMasters";
import DropdownData from "../Ui Component/modelUi";
import SelectBuyer1 from "../Ui Component/modelParams1";

const ModelMultiSelectChart4 = ({
  color,
  showModel,
  setShowModel,
  selectedYear,
  setSelectedYear,
  selectedBuyer,
  setSelectedBuyer
}) => {
  const { data: buyer, isLoading: isbuyerLoad } = useGetBuyerNameQuery({ params: {} });
  const option = buyer?.data ? buyer?.data : [];
  const [select, setSelect] = useState(selectedBuyer)
  const [sety, setSety] = useState(selectedYear)
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [dragging, setDragging] = useState(false);
  const startPosition = useRef(null);

  // Handle mouse down event
  const handleMouseDown = (e) => {
    setDragging(true);
    startPosition.current = { x: e.clientX, y: e.clientY };
  };

  // Handle mouse move event
  const handleMouseMove = (e) => {
    if (dragging) {
      const dx = e.clientX - startPosition.current.x;
      const dy = e.clientY - startPosition.current.y;

      setPosition((prevPosition) => ({
        x: prevPosition.x + dx,
        y: prevPosition.y + dy
      }));

      startPosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    setDragging(false);
  };
  const handleOkClick = () => {
    if (select || sety) {
      console.log("Selected Buyer:", select);
      setSelectedBuyer(select)
      setSelectedYear(sety)
    }

    setShowModel(false);
  };
  console.log(sety, "sety")

  useEffect(() => {
    // Reset position to center when model is shown
    if (showModel) {
      setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
  }, [showModel]);

  // Toggle the modal's visibility
  const handleArrowClick = () => {
    setShowModel((prevState) => !prevState);
  };

  return (
    <div>
      {/* Slide-Up Model */}
      <div
        className={`model-box ${showModel ? "open" : "closed"}`}
        style={{
          position: "fixed",
          bottom: showModel ? "0" : "-500px",
          left: "0",
          width: "290px",
          height: "550px",
          backgroundColor: "#F1F3F6",
          boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.3)",
          transition: "bottom 0.3s ease-in-out",
          borderRadius: "8px 8px 0 0",
          borderTop: `8px solid ${color || "#7E3AF2"}`,
          zIndex: "20",
          top: position.y,
          left: position.x,
          transform: "translate(-50%, -50%)",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
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
                <DropdownData selectedYear={sety} setSelectedYear={setSety} />
              </div>

              <div className="flex items-center space-x-3">
                <SelectBuyer1
                  style={{ width: "200px" }}
                  selectedBuyer={select}
                  setSelectedBuyer={setSelect}
                  columnHeaderHeight={"30"}
                />
              </div>
            </div>
          </div>

          {/* Ok Button */}
          <button
            className={`absolute right-5 bottom-5 hover:bg-blue-600 text-white py-1 px-4 rounded-lg shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:outline-none`}
            style={{
              backgroundColor: color ? color : "blue", fontSize: '14px',
            }}
            onClick={handleOkClick}
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
            zIndex: "10",
          }}
          onClick={() => setShowModel(false)}
        ></div>
      )}
    </div>
  );
};

export default ModelMultiSelectChart4;

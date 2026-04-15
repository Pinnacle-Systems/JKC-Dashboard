import React, { useContext, useState, useEffect } from "react";
import DropdownDt from "../Ui Component/dropDownParam";
import { useGetBuyerNameQuery } from "../redux/service/commonMasters";
import { ColorContext } from "../scenes/global/context/ColorContext";
import { HiOutlineRefresh } from "react-icons/hi";

const BuyerMultiSelect4 = ({
  category,
  setCategory,
  showModel,
  setShowModel,
  selected,
  setSelected,
  refetch,
}) => {
  const { color } = useContext(ColorContext);
  const [selectedOption, setSelectedOption] = useState(selected);
  const { data: buyer } = useGetBuyerNameQuery({ params: {} });
  const options = buyer?.data || [];
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

  // Handle modal drag
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

  // Handle category change
  const handleOptionChange = (e) => {
    setCategory(e.target.value);
  };

  // Handle Ok button click
  const handleOkClick = () => {
    if (selectedOption) {
      console.log("Selected Buyer:", selectedOption);
      setSelected(selectedOption);
    }
    setShowModel(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative"
    >
      {/* Modal */}
      {showModel && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-700"
            onClick={() => setShowModel(false)}
          ></div>

          {/* Modal Content */}
          <div
            className="fixed bg-white shadow-lg rounded-lg p-5 z-800"
            style={{
              top: `${position.y}px`,
              left: `${position.x}px`,
              transform: "translate(-50%, -50%)",
              width: "300px",
              height: "540px",
              borderTop: `8px solid ${color || "#3B82F6"}`,
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="flex justify-between items-center mb-4">
              {/* <div className="flex items-center gap-2">
                <label htmlFor="birthday">Birthday:</label>
                <input
                  type="radio"
                  id="birthday"
                  name="view"
                  value="Birthday"
                  checked={category === "Birthday"}
                  onChange={handleOptionChange}
                />
                <label htmlFor="anniversary">Anniversary:</label>
                <input
                  type="radio"
                  id="anniversary"
                  name="view"
                  value="Anniversary"
                  checked={category === "Anniversary"}
                  onChange={handleOptionChange}
                />
              </div>

              <button
                className="flex items-center justify-center h-8 w-8 bg-sky-500 text-white rounded-sm border border-gray-300 hover:shadow-lg"
                onClick={refetch}
              >
                <HiOutlineRefresh />
              </button> */}
            </div>

            {/* Dropdown */}
            <label className="block text-sm font-semibold ">
              Select Company
            </label>
            <DropdownDt
              selected={selectedOption}
              setSelected={setSelectedOption}
              option={options}
            />

            {/* Ok Button */}
            <button
              className="absolute right-3 bottom-5 px-5 py-2 text-sm font-semibold text-white rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 focus:ring-2 focus:ring-blue-300"
              style={{
                backgroundColor: color || "#1D4ED8",
              }}
              onClick={handleOkClick}
            >
              Ok
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BuyerMultiSelect4;

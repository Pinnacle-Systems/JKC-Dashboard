import SelectBuyer from "../Ui Component/modelParam";
import { FaUserPlus, FaBriefcase, FaUsers } from "react-icons/fa";
import * as React from "react";
import { useState, useRef, useEffect } from "react";

const ModelMultiSelect = ({
  selectedBuyer,
  setSelectedBuyer,
  tempSelectedBuyer,setTempSelectedBuyer,
  color,
  selectedState,
  setSelectedState,
  showModel,payCat,setPayCat,
  setShowModel,
}) => {
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [dragging, setDragging] = useState(false);
   const startPosition = useRef(null);
  
console.log(payCat,selectedState,"payCat")
  // When the modal is shown, position it at the center
  useEffect(() => {
    if (showModel) {
      setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
  }, [showModel]);

  const handleMouseDown = (e) => {
    setDragging(true);
    startPosition.current = { x: e.clientX, y: e.clientY }; // Store the initial mouse position when drag starts
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const dx = e.clientX - startPosition.current.x; // Calculate the movement in x direction
      const dy = e.clientY - startPosition.current.y; // Calculate the movement in y direction

      // Update position only when dragging
      setPosition((prevPosition) => ({
        x: prevPosition.x + dx,
        y: prevPosition.y + dy,
      }));

      // Update start position for the next move
      startPosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };
  const handleOkClick = () => {
    setSelectedBuyer([...tempSelectedBuyer]);
    setIsOpen(false);
    setShowModel(false);
};

    const [isOpen, setIsOpen] = useState(false);


  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative"
    >
      {showModel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => setShowModel(false)}
        ></div>
      )}

      {showModel && (
        <div
          className={`model-box fixed bg-gray-100 shadow-xl transition-transform duration-500`}
          style={{
            top: position.y || "50%",
            left: position.x || "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 50,
            borderRadius: "8px",
            borderTop: `8px solid ${color || "#3B82F6"}`,
            width: "300px",
            height: "550px",
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="model-content p-5 h-full overflow-y-auto">
            <div className="mb-2">
              <label
                htmlFor="employeeType"
                className="text-sm font-semibold text-gray-700 mb-2 transition-colors duration-300 hover:text-gray-800"
              >
                Select Employee Type
              </label>
            </div>
            <div className="flex flex-col items-center gap-4 mb-1">
  {/* Button Group */}
  <div className="flex items-center gap-4">
    {[
      { type: "All", icon: <FaUsers />, color: "blue" },
      { type: "Labour", icon: <FaBriefcase />, color: "green" },
      { type: "Staff", icon: <FaUserPlus />, color: "purple" },
    ].map(({ type, icon, color }) => {
      const isActive = selectedState === type;
      const bgClass = isActive
        ? color === "blue"
          ? "bg-blue-600"
          : color === "green"
          ? "bg-green-600"
          : "bg-purple-600"
        : "bg-white";

      const textClass = isActive
        ? "text-white"
        : color === "blue"
        ? "text-blue-500"
        : color === "green"
        ? "text-green-500"
        : "text-purple-500";

      const borderClass = isActive
        ? ""
        : color === "blue"
        ? "border-blue-500"
        : color === "green"
        ? "border-green-500"
        : "border-purple-500";

      return (
        <button
          key={type}
          onClick={() => {
            setSelectedState(type);
            setPayCat(type);
          }}
                    className={`group relative flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full ${bgClass} ${textClass} ${borderClass} ${
            !isActive
              ? "border-2 hover:shadow-lg hover:scale-110"
              : "shadow-lg scale-105"
          }`}
        >
          {React.cloneElement(icon, {
            className: `text-xl ${textClass}`,
          })}
        </button>
      );
    })}
  </div>

  {/* Selected State Label */}
  <span
    className={`text-sm font-semibold ${
      selectedState === "All"
        ? "text-blue-500"
        : selectedState === "Labour"
        ? "text-green-500"
        : "text-purple-500"
    }`}
  >
    Selected: {selectedState || "All"}
  </span>
</div>

            <label
              htmlFor="companySelect"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Select Company123
            </label>

            <SelectBuyer
              selectedBuyer={selectedBuyer}
              tempSelectedBuyer = {tempSelectedBuyer}
              setTempSelectedBuyer = {setTempSelectedBuyer}
              setSelectedBuyer={setSelectedBuyer}
              setShowModel = {setShowModel}
   isOpen={isOpen} setIsOpen = {setIsOpen}

              columnHeaderHeight="20"
            />
         
          </div>
          <button
              className="absolute right-3 bottom-5 px-5 py-2 text-sm font-semibold text-white rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                backgroundColor: color || "#1D4ED8",
              }}
              onClick={handleOkClick}
            >
              Ok
            </button>
        </div>
      )}
    </div>
  );
};

export default ModelMultiSelect;

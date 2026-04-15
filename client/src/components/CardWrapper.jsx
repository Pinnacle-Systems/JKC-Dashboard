import React, { useContext, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { ColorContext } from "../scenes/global/context/ColorContext";
import FilterOptions from "./FilterOptions";

import { IoMdDownload } from "react-icons/io";
import { CiMenuKebab } from "react-icons/ci";
import { IoClose } from "react-icons/io5"; 

const DropdownOptions = ({ onDownload }) => (
  <div className="absolute right-0 mt-2 w-12 bg-white border border-gray-300 rounded-md shadow-md p-1 z-10 animate-scale-in origin-top-right">
    <button 
      onClick={onDownload} 
      className="flex items-center justify-center text-xs text-gray-700 hover:text-white bg-gray-100 hover:bg-green-600 w-full px-2 py-1 rounded-md transition"
    >
      <IoMdDownload className="text-base" />
    </button>
  </div>
);
const CardWrapper1 = ({ heading, children,onFilterClick, showFilter = true, Doption = true }) => {
  const { color } = useContext(ColorContext);
  const [showOptions, setShowOptions] = useState(false);
  const cardRef = useRef(null); 

  const captureScreenshot = async () => {
    if (!cardRef.current) return;
     setShowOptions(false)
    try {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 2,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;

      const formattedHeading = heading.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
      link.download = `${formattedHeading || "chart_screenshot"}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Screenshot capture failed:", error);
    }
  };

  return (
    <div ref={cardRef} className="text-center border z-999 border-gray-300 rounded-lg shadow-lg bg-gray-200 h-[420px] w-full relative">
      {/* Header Section */}
      <div className="flex items-center justify-between h-[40px] px-4 rounded-t-lg shadow-md" style={{ background: color || "#E5E7EB" }}>
        <div className="text-[15px] text-white font-medium tracking-wider">{heading}</div>

        <div className="flex items-center space-x-2 relative">
        <div className="absolute top-0 right-2">
          {showFilter && <FilterOptions onFilterClick={onFilterClick} />}
          </div>
                    {Doption && (
            <div className="relative">
              <button onClick={() => setShowOptions(!showOptions)} className="text-white p-2 rounded-lg transition">
                <CiMenuKebab className="text-xl" />
              </button>
              {showOptions && <DropdownOptions onDownload={captureScreenshot} onClose={() => setShowOptions(false)} />}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-2 rounded-b-lg w-full flex justify-center items-center h-full">
        <div className="w-full h-full">{children}</div>
      </div>
    </div>
  );
};

export default CardWrapper1;

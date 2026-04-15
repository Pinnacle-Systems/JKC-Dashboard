import { useEffect, useState } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaStepBackward,
  FaStepForward,
  FaSearch,
  FaUserTie,
  FaUsers,
  FaMars,
  FaVenus,
} from "react-icons/fa";
import { IoMaleFemale } from "react-icons/io5";
import * as XLSX from "xlsx";
import { useGetMisDashboardEmployeeDetailQuery } from "../redux/service/misDashboardService";
import { useGetBuyerNameQuery } from "../redux/service/commonMasters";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { addInsightsRow } from "../utils/hleper";

const DataDetailTable = ({
  closeTable,
  setOpenpopup,
  color,
  payCat,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const [selectedState, setSelectedState] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState("");
  
  const [search, setSearch] = useState({
    FNAME: "",
    GENDER: "",
    MIDCARD: "",
    DEPARTMENT: "",
    COMPCODE: "",
  });
  const { data: employeeDet, refetch } = useGetMisDashboardEmployeeDetailQuery({
    params: {
      search,
      payCat,
    },
  });
  const { data: buyerList } = useGetBuyerNameQuery({ params: {} });
  useEffect(() => {
    setCurrentPage(1);
  }, [employeeDet]);

  const handleFilterClick = (type) => {
    setSelectedState(type);
  };
  console.log(selectedState, "selectedState");
  const handleGenderFilter = (gender) => {
    setSelectedGender(gender);
  };
  const downloadExcel = async () => {
    if (filteredData.length === 0) {
      alert("No data to export!");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees Data");

    // 1️⃣ Define columns
    worksheet.columns = [
      { header: "ID Card", key: "MIDCARD", width: 15 },
      { header: "Name", key: "FNAME", width: 35 },
      { header: "Gender", key: "GENDER", width: 14 },
      { header: "Department", key: "DEPARTMENT", width: 35 },
      { header: "Company", key: "COMPCODE", width: 20 },
    ];

    // 2️⃣ Title row
    worksheet.insertRow(1, ["Employee Strength As On Date"]);
    worksheet.mergeCells("A1:E1");

    const titleCell = worksheet.getCell("A1");
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(1).height = 30;
    addInsightsRow({
      worksheet,
      startRow: 2,
      totalColumns: 6,

      dynamicField: "On Roll",
      selectedBuyer,
      selectedGender,
      selectedState,
      
      
    });

    // 3️⃣ Header row (row 2)
    const headerRow = worksheet.getRow(3);
    headerRow.height = 26;

    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" }, // gray background
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // 4️⃣ Add data rows (start from row 3)
    filteredData.forEach((row) => {
      worksheet.addRow({
        MIDCARD: row.MIDCARD,
        FNAME: row.FNAME,
        GENDER: row.GENDER,
        DEPARTMENT: row.DEPARTMENT,
        COMPCODE: row.COMPCODE,
      });
    });

    // 5️⃣ Align ONLY data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 3) return; // skip title & header

      row.height = 22;

      row.getCell("MIDCARD").alignment = { horizontal: "right", vertical: "middle", indent: 1 };
      row.getCell("FNAME").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      row.getCell("GENDER").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      row.getCell("DEPARTMENT").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      row.getCell("COMPCODE").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
    });

    // 6️⃣ Freeze header
    worksheet.views = [{ state: "frozen", ySplit: 2 }];

    // 7️⃣ Export
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      "Employee Strength As On Date.xlsx"
    );
  };

  const filteredData = Array.isArray(employeeDet?.data)
    ? employeeDet.data
      .filter((row) =>
        Object.keys(search || {}).every((key) => {
          const rowValue = row?.[key]?.toString().toLowerCase() || "";
          const searchValue = search?.[key]?.toString().toLowerCase() || "";
          return rowValue.includes(searchValue);
        })
      )
      .filter((row) => {
        if (selectedState === "Labour") return row?.PAYCAT !== "STAFF";
        if (selectedState === "Staff") return row?.PAYCAT === "STAFF";
        return true;
      })
      .filter((row) => {
        if (selectedGender === "Male") return row?.GENDER !== "FEMALE";
        if (selectedGender === "Female") return row?.GENDER === "FEMALE";
        return true;
      })
      .filter((row) => {
        if (selectedBuyer) {
          return (
            row?.COMPCODE?.toLowerCase() === selectedBuyer?.toLowerCase()
          );
        }
        return true;
      })
    : [];
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const totalRecords = filteredData.length;

  const currentRecords = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-[1280px] max-w-[1280px]  relative">
        <button
          onClick={() => setOpenpopup(false)}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2 rounded-full transition-all"
        >
          <FaTimes size={20} />
        </button>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 uppercase">
            On Roll Insights{" "}
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Total Records: {totalRecords}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => handleFilterClick("Labour")}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full shadow-md transition-all 
      ${selectedState === "Labour"
                ? "bg-blue-600 text-white scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
      focus:outline-none focus:ring-2 focus:ring-blue-400`}
          >
            <FaUserTie size={16} /> Employees
          </button>

          <button
            onClick={() => handleFilterClick("Staff")}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full shadow-md transition-all 
      ${selectedState === "Staff"
                ? "bg-blue-600 text-white scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
      focus:outline-none focus:ring-2 focus:ring-blue-400`}
          >
            <FaUsers size={16} /> Staff
          </button>

          <button
            onClick={() => handleFilterClick("All")}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full shadow-md transition-all 
      ${selectedState === "All"
                ? "bg-blue-600 text-white scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
      focus:outline-none focus:ring-2 focus:ring-blue-400`}
          >
            All
          </button>
          <button
            onClick={() => handleGenderFilter("Male")}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full shadow-md transition-all 
              ${selectedGender === "Male"
                ? "bg-blue-600 text-white scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            <FaMars size={16} className="text-blue-500" /> Male
          </button>

          <button
            onClick={() => handleGenderFilter("Female")}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full shadow-md transition-all 
              ${selectedGender === "Female"
                ? "bg-blue-600 text-white scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            <FaVenus size={16} className="text-pink-500" /> Female
          </button>
          <button
            onClick={() => handleGenderFilter("Both")}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full shadow-md transition-all 
              ${selectedGender === "Both"
                ? "bg-blue-600 text-white scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            <IoMaleFemale size={16} className="text-green-500" /> Both
          </button>
          <select
            className="border rounded p-2 text-xs text-gray-700"
            value={selectedBuyer}
            onChange={(e) => setSelectedBuyer(e.target.value)}
          >
            <option value="" disabled>
              Selected Divisions
            </option>
            {buyerList?.data?.map((item, index) => (
              <option key={index} value={item.buyerName} className="text-xs">
                {item.buyerName}
              </option>
            ))}
          </select>

          <button
            onClick={downloadExcel}
            className="absolute top-22 right-10 p-0 rounded-full shadow-md hover:brightness-110 transition-all duration-300"
            title="Download Excel"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
              alt="Download Excel"
              className="w-8 h-8 rounded-lg"
            />
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2 mb-3">
          {["EMPID", "FNAME", "DEPARTMENT", "COMPCODE"].map((key) => (
            <div key={key} className="relative">
              <input
                type="text"
                placeholder={`Search ${key}...`}
                value={search[key] || ""}
                onChange={(e) =>
                  setSearch({ ...search, [key]: e.target.value })
                }
                className="w-full p-2 pl-8 text-gray-900 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              />
              <FaSearch className="absolute left-2 top-3 text-gray-500 text-sm" />
            </div>
          ))}

        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="overflow-x-auto max-h-[450px]">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                <tr>
                  <th className="border p-2 text-left">ID Card</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Gender</th>
                  <th className="border p-2 text-left">Department</th>
                  <th className="border p-2 text-left">Company</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {currentRecords.slice(0, 10).map((row, index) => (
                  <tr
                    key={index}
                    className="text-gray-700 bg-white even:bg-gray-100 "
                  >
                    <td className="border p-2">{row.MIDCARD}</td>
                    <td className="border p-2">{row.FNAME}</td>
                    <td className="border p-2">{row.GENDER}</td>
                    <td className="border p-2">{row.DEPARTMENT}</td>
                    <td className="border p-2">{row.COMPCODE}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto max-h-[450px]">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                <tr>
                  <th className="border p-2 text-left">ID Card</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Gender</th>
                  <th className="border p-2 text-left">Department</th>
                  <th className="border p-2 text-left">Company</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {currentRecords.slice(10, 20).map((row, index) => (
                  <tr
                    key={index}
                    className="text-gray-700 bg-white even:bg-gray-100"
                  >
                    <td className="border p-2">{row.MIDCARD}</td>
                    <td className="border p-2">{row.FNAME}</td>
                    <td className="border p-2">{row.GENDER}</td>
                    <td className="border p-2">{row.DEPARTMENT}</td>
                    <td className="border p-2">{row.COMPCODE}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-2 text-sm">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:bg-gray-200"
                }`}
            >
              <FaStepBackward size={16} />
            </button>

            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:bg-gray-200"
                }`}
            >
              <FaChevronLeft size={16} />
            </button>

            <span className="text-sm font-semibold px-3">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:bg-gray-200"
                }`}
            >
              <FaChevronRight size={16} />
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:bg-gray-200"
                }`}
            >
              <FaStepForward size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataDetailTable;

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
import { useGetEsiPf1Query, useGetEsiPfQuery } from "../../redux/service/misDashboardService";
import FinYear from "../FinYear";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { addInsightsRow } from "../../utils/hleper";

const HeadDetailedCom = ({
  closeTable,
  search,
  setSearch,
  selectGender1,
  selectedBuyer,
  selectedYear,
  color,
  HeadData, excelTitle,
  selectedGender, setSelectedGender

}) => {


  const [currentPage, setCurrentPage] = useState(1);
  const [selectedState, setSelectedState] = useState("");
  const [selectmonths, setSelectmonths] = useState("");
  const [netpayRange, setNetpayRange] = useState({
    min: 0,
    max: Infinity,
  });
  const recordsPerPage = 34;
  console.log(selectedBuyer, "selectedBuyer for salary");

  // const { data: salaryDetData } = useGetMisDashboardSalaryDetQuery({
  //   params: {
  //     filterBuyer: selectedBuyer || [],
  //     search: search || {},
  //   },
  // });

  //   const { data: ESIyeardata } = useGetEsiPfQuery({
  //     params: {
  //       filterSupplier: selectedBuyer,
  //       filterYear: selectedYear,
  //       search: search || {},
  //     },
  //   });

  //   const salaryDet = ESIyeardata?.data || [];

  console.log(HeadData, "salaryDet inside");
  useEffect(() => {
    setCurrentPage(1);
  }, [HeadData]);

  const handleFilterClick = (type) => {
    setSelectedState(type);
  };

  const handleGenderFilter = (gender) => {
    setSelectedGender(gender);
  };



  const filteredData = Array.isArray(HeadData)
    ? HeadData
      .filter((row) =>
        Object.keys(search || {}).every((key) => {
          const searchValue = (search[key] || "").toString().trim();
          if (!searchValue) return true;

          const rowValue = row[key];

          if (key === "AGE") {
            const age = rowValue;

            // Case 1: Age range "20-30"
            if (searchValue.includes("-")) {
              const [minAge, maxAge] = searchValue.split("-").map(Number);
              return age >= minAge && age <= maxAge;
            }

            // Case 2: "50+"
            if (searchValue.endsWith("+")) {
              const minAge = Number(searchValue.replace("+", ""));
              return age >= minAge;
            }

            // Case 3: exact number
            return age === Number(searchValue);
          }

          // Default string filter
          return rowValue
            ?.toString()
            .toLowerCase()
            .includes(searchValue.toLowerCase());
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


    : [];

  console.log(filteredData, "filteredData1");

  const totalNetPay = filteredData.reduce(
    (sum, row) => sum + (Number(row.AGE) || 0),
    0
  );
  console.log(totalNetPay, "Total Net Pay");

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const totalRecords = filteredData.length;

  const currentRecords = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const { minNetPay, maxNetPay } = currentRecords.reduce(
    (acc, item) => ({
      minNetPay: Math.min(acc.minNetPay, item.AGE),
      maxNetPay: Math.max(acc.maxNetPay, item.AGE),
    }),
    { minNetPay: Infinity, maxNetPay: -Infinity }
  );
  console.log("Selected Month:", selectmonths);
  console.log("ESI Data count:", HeadData.length);
  console.log("Filtered count:", filteredData.length);
  const downloadExcel = async () => {
    if (filteredData?.length === 0) {
      alert("No data to export!");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees Data");

    /* =======================
       1️⃣ TITLE ROW
    ======================= */
    worksheet.addRow([excelTitle || "HeadCount Report"]);
    worksheet.mergeCells(1, 1, 1, 6);

    const titleCell = worksheet.getCell("A1");
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(1).height = 30;
    addInsightsRow({
      worksheet,
      startRow: 2,
      totalColumns: 6,

      dynamicField: "HeadCount",
      selectedBuyer,
      selectedGender,
      selectedState,
      selectedYear,
      selectedMonth: selectmonths,
    });

    /* =======================
       2️⃣ HEADER ROW
    ======================= */
    worksheet.addRow([
      "ID Card",
      "Name",
      "Gender",
      "Department",
      "Designation",
      "Age",
    ]);

    const headerRow = worksheet.getRow(3);
    headerRow.height = 24;

    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };

      // Gray background
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      };
    });

    /* =======================
       3️⃣ COLUMN WIDTHS
    ======================= */
    worksheet.columns = [
      { width: 15 },
      { width: 35 },
      { width: 14 },
      { width: 30 },
      { width: 35 },
      { width: 10 },
    ];

    /* =======================
       4️⃣ DATA ROWS
    ======================= */
    filteredData?.forEach((row) => {
      worksheet.addRow([
        row.IDCARD,
        row.FNAME,
        row.GENDER,
        row.DEPARTMENT,
        row.DESIGNATION,
        row.AGE !== null && row.AGE !== undefined
          ? Math.trunc(Number(row.AGE)) // trim decimals
          : "",
      ]);
    });

    /* =======================
       5️⃣ DATA ALIGNMENT
    ======================= */
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 3) return; // skip title + header

      row.height = 22;

      row.getCell(1).alignment = { horizontal: "right", vertical: "middle", indent: 1 };
      row.getCell(2).alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      row.getCell(3).alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      row.getCell(4).alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      row.getCell(5).alignment = { horizontal: "left", vertical: "middle", indent: 1 };
      row.getCell(6).alignment = { horizontal: "right", vertical: "middle", indent: 1 };
    });

    /* =======================
       6️⃣ FREEZE HEADER
    ======================= */
    worksheet.views = [{ state: "frozen", ySplit: 3 }];

    /* =======================
       7️⃣ EXPORT
    ======================= */
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${excelTitle}.xlsx` || "HeadCount Report.xlsx");
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="bg-white p-4 rounded-lg shadow-2xl w-[1500px] max-w-[1500px]  h-[590px] max-h-[590px] relative">
        <button
          onClick={closeTable}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2 rounded-full transition-all"
        >
          <FaTimes size={20} />
        </button>

        <div className="grid grid-cols-2">
          <div className="text-start">
            <h2 className="text-m font-bold text-gray-800 uppercase ">
              HeadCount Insights -{" "}
              <span className="text-blue-600">{selectedBuyer.join(", ")}</span>
            </h2>
            <div className="flex items-start justify-start mb-1">
              {/* Left: Total Records */}
              <p className="text-[12px] text-gray-500 font-medium">
                Total HeadCount: {totalRecords}
              </p>

              {/* Right: Total Netpay */}
              {/* <div className="text-right ml-5 text-[12px]">
                <p className=" text-gray-500 font-medium">
                  Total Netpay:{" "}
                  <span className="text-sky-700 pl-2">
                    {" "}
                    ₹{totalNetPay.toLocaleString("en-IN")}
                  </span>
                </p>
              </div> */}
            </div>
          </div>
          <div className="flex justify-center gap-3 mb-4">
            <div className="bg-gray-300  rounded-lg shadow-2xl grid grid-cols-3 gap-1 p-2">
              <button
                onClick={() => handleFilterClick("Labour")}
                className={`flex items-center gap-2 px-1.5 py-0.5 text-[11px] font-semibold rounded-full shadow-md transition-all 
        ${selectedState === "Labour"
                    ? "bg-blue-600 text-white scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
        focus:outline-none focus:ring-2 focus:ring-blue-400`}
              >
                <FaUserTie size={14} /> Employees
              </button>

              <button
                onClick={() => handleFilterClick("Staff")}
                className={`flex items-center gap-2 px-1.5 py-0.5 text-xs font-semibold rounded-full shadow-md transition-all 
        ${selectedState === "Staff"
                    ? "bg-blue-600 text-white scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
        focus:outline-none focus:ring-2 focus:ring-blue-400`}
              >
                <FaUsers size={14} /> Staff
              </button>

              <button
                onClick={() => handleFilterClick("All")}
                className={`flex items-center gap-2 px-1.5 py-0.5 text-[11px] font-semibold rounded-full shadow-md transition-all 
        ${selectedState === "All"
                    ? "bg-blue-600 text-white scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
        focus:outline-none focus:ring-2 focus:ring-blue-400`}
              >
                All
              </button>
            </div>

            <div className="bg-gray-300  rounded-lg shadow-2xl grid grid-cols-3 gap-1 p-2">
              <button
                onClick={() => handleGenderFilter("Male")}
                className={`flex items-center gap-2 px-1.5 py-0.5 text-[11px] font-semibold rounded-full shadow-md transition-all 
                ${selectedGender === "Male"
                    ? "bg-blue-600 text-white scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                <FaMars size={14} className="text-blue-500" /> Male
              </button>

              <button
                onClick={() => handleGenderFilter("Female")}
                className={`flex items-center gap-2 px-1.5 py-0.5 text-[11px] font-semibold rounded-full shadow-md transition-all 
                ${selectedGender === "Female"
                    ? "bg-blue-600 text-white scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                <FaVenus size={14} className="text-pink-500" /> Female
              </button>
              <button
                onClick={() => handleGenderFilter("Both")}
                className={`flex items-center gap-2 px-2 py-0.5 text-[11px] font-semibold rounded-full shadow-md transition-all 
                ${selectedGender === "Both"
                    ? "bg-blue-600 text-white scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                <IoMaleFemale size={14} className="text-green-500" /> Both
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-start">
          <div className="grid grid-cols-7 gap-2 mb-3">
            {["IDCARD", "FNAME", "DEPARTMENT", "DESIGNATION", "AGE"].map((key) => (
              <div key={key} className="relative">
                <input
                  type="text"
                  placeholder={`Search ${key}...`}
                  value={search[key] || ""}
                  onChange={(e) =>
                    setSearch({ ...search, [key]: e.target.value })
                  }
                  className="w-full h-6 p-1 pl-8 text-gray-900 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                />
                <FaSearch className="absolute left-2 top-1.5 text-gray-500 text-sm" />
              </div>
            ))}

          </div>
          <div className="right-0">
            <button
              onClick={downloadExcel}
              className="p-0 rounded-full shadow-md hover:brightness-110 transition-all duration-300"
              title="Download Excel"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
                alt="Download Excel"
                className="w-7 h-7 rounded-lg"
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div
            className="overflow-x-auto max-h-[450px] "
            style={{ border: "1px solid gray", borderRadius: "16px" }}
          >
            {/* <table className="w-full border-collapse border border-gray-300 text-[11px]">
                <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                  <tr>
                    <th className="border p-1 text-left ">S.No</th>
                    <th className="border p-1 text-left ">ID Card</th>
                    <th className="border p-1 text-left ">Name</th>
                    <th className="border p-1 text-left ">Gender</th>
                    <th className="border p-1 text-left ">Department</th>
                    <th className="border p-1 text-left ">Designation</th>
                    <th className="border p-1 text-left ">Age</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.slice(0, 17).map((row, index) => {
                    const globalIndex = index; // 0–16
                    const serialNo =
                      (currentPage - 1) * recordsPerPage + globalIndex + 1;
                    return (
                      <tr
                        key={index}
                        className="text-gray-800 bg-white even:bg-gray-100 "
                      >
                        <td className="border p-1 text-[10px] w-[2px]">{serialNo}</td>
                        <td className="border p-1 text-[10px] w-[15px]">{row.IDCARD}</td>
                        <td className="border p-1 text-[10px] w-[45px]"
                          style={{ maxWidth: "100px" }}

                        >{row.FNAME}</td>
                        <td className="border p-1 text-[10px] w-[20px]">{row.GENDER}</td>
                        <td className="border p-1 text-[10px] w-[40px]">
                          {row.DEPARTMENT}
                        </td>
                        <td className="border p-1 text-[10px]  w-[40px]">
                          {row.DESIGNATION}
                        </td>
                        <td className="border p-1 text-[10px]  w-[5px]">
                          {row.AGE}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table> */}
            <div className=" table-fixed  max-h-[450px] overflow-y-auto overflow-x-hidden w-full">
              <table className="min-w-full border-collapse border border-gray-300 text-[11px]">
                <thead className="bg-gray-100 text-gray-800 sticky top-0 z-10 tracking-wider">
                  <tr>
                    <th className="border p-1 text-left w-[40px]">S.No</th>
                    <th className="border p-1 text-left w-[60px]">ID Card</th>
                    <th className="border p-1 text-left w-[200px]">Name</th>
                    <th className="border p-1 text-left w-[40px]">Gender</th>
                    <th className="border p-1 text-left w-[150px]">Department</th>
                    <th className="border p-1 text-left  w-[150px] ">Designation</th>
                    <th className="border p-1 text-left w-[40px]">Age</th>
                  </tr>
                </thead>

                <tbody>
                  {currentRecords.slice(0, 17).map((row, index) => {
                    const serialNo =
                      (currentPage - 1) * recordsPerPage + index + 1;

                    return (
                      <tr key={index} className="text-gray-800 bg-white even:bg-gray-100">
                        <td className="border p-1 text-[10px] w-[40px] text-center">
                          {serialNo}
                        </td>

                        <td className="border p-1 text-[10px] w-[60px]">
                          {row.IDCARD}
                        </td>

                        <td className="border p-1 text-[10px] w-[200px] truncate">
                          {row.FNAME}
                        </td>

                        <td className="border p-1 text-[10px] w-[40px] text-center">
                          {row.GENDER}
                        </td>

                        <td className="border p-1 text-[10px] w-[150px] truncate">
                          {row.DEPARTMENT}
                        </td>

                        <td className="border p-1 text-[10px] w-[150px] truncate">
                          {row.DESIGNATION}
                        </td>

                        <td className="border p-1 text-[10px] w-[40px] text-center">
                          {row.AGE}
                        </td>
                      </tr>

                    );
                  })}
                </tbody>
              </table>
            </div>


          </div>

          <div
            className="overflow-x-auto max-h-[450px]"
            style={{ border: "1px solid gray", borderRadius: "16px" }}
          >
            <table className="w-full border-collapse border border-gray-300 text-[11px]">
              <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                <tr>
                  <th className="border p-1 text-left w-[40px]">S.No</th>
                  <th className="border p-1 text-left w-[60px]">ID Card</th>
                  <th className="border p-1 text-left w-[200px]">Name</th>
                  <th className="border p-1 text-left w-[40px]">Gender</th>
                  <th className="border p-1 text-left w-[150px]">Department</th>
                  <th className="border p-1 text-left  w-[150px] ">Designation</th>
                  <th className="border p-1 text-left w-[40px]">Age</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.slice(17, 34).map((row, index) => {
                  const globalIndex = 17 + index; // 17–33
                  const serialNo =
                    (currentPage - 1) * recordsPerPage + globalIndex + 1;
                  return (
                    <tr key={index} className="text-gray-800 bg-white even:bg-gray-100">
                      <td className="border p-1 text-[10px] w-[40px] text-center">
                        {serialNo}
                      </td>

                      <td className="border p-1 text-[10px] w-[60px]">
                        {row.IDCARD}
                      </td>

                      <td className="border p-1 text-[10px] w-[200px] truncate">
                        {row.FNAME}
                      </td>

                      <td className="border p-1 text-[10px] w-[40px] text-center">
                        {row.GENDER}
                      </td>

                      <td className="border p-1 text-[10px] w-[150px] truncate">
                        {row.DEPARTMENT}
                      </td>

                      <td className="border p-1 text-[10px] w-[150px] truncate">
                        {row.DESIGNATION}
                      </td>

                      <td className="border p-1 text-[10px] w-[40px] text-center">
                        {row.AGE}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}

        <div>
          {totalPages > 1 && (
            <div
              className="flex justify-end items-center mt-4 space-x-2 text-[11px] "
              style={{ position: "absolute", bottom: "5px", right: "0px" }}
            >
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

              <span className="text-xs font-semibold px-3">
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
    </div>
  );
};

export default HeadDetailedCom;

// export default ESIDetailed;

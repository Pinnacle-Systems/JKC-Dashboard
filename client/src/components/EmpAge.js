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
import { useGetMisDashboardAgeDetQuery } from "../redux/service/misDashboardService";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { addInsightsRowDashboard } from "../utils/hleper";
const AgeDetail = ({
  search,
  setSearch,
  setOpenpopup, openpopup,
  selectedBuyer,

  color,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedState, setSelectedState] = useState('')
  const [ageRange, setAgeRange] = useState({ min: 0, max: Infinity });
  const [selectedGender, setSelectedGender] = useState('')

  const recordsPerPage = 20;
  console.log(openpopup, "openpopup")


  const { data: salaryDetData } = useGetMisDashboardAgeDetQuery({
    params: {
      filterBuyer: selectedBuyer || [],
      search: search || {},
    }
  });

  const salaryDet = salaryDetData?.data || []
  console.log(salaryDet, "salaryDet inside")
  useEffect(() => {
    setCurrentPage(1);
  }, [salaryDet]);

  const handleAgeChange = (e) => {
    const { name, value } = e.target;
    setAgeRange((prev) => ({
      ...prev,
      [name]: value === '' ? '' : parseInt(value),
    }));
  };

  const handleFilterClick = (type) => {
    setSelectedState(type);
  };
  console.log(selectedState, "selectedState");
  const handleGenderFilter = (gender) => {
    setSelectedGender(gender);
  };
  // const downloadExcel = () => {
  //   if (filteredData.length === 0) {
  //     alert("No data to export!");
  //     return;
  //   }

  //   const headers = [["ID Card", "Name", "Gender", "Department", "Company", "Date of Left", "Reason"]];

  //   const data = filteredData.map((row) => [
  //     row.EMPID,
  //     row.FNAME,
  //     row.GENDER,
  //     row.DEPARTMENT,
  //     row.COMPCODE,
  //     row.DOL ? new Date(row.DOL).toLocaleDateString('en-IN') : '-',
  //     row.REASON
  //   ]);

  //   const ws = XLSX.utils.aoa_to_sheet([...headers, ...data]);

  //   // Apply style to header row
  //   // Apply style to header row
  //   const headerRange = XLSX.utils.decode_range(ws["!ref"]);

  //   for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
  //     const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
  //     if (!ws[cellAddress]) continue;

  //     ws[cellAddress].s = {
  //       fill: {
  //         fgColor: { rgb: "D9D9D9" } // Gray background
  //       },
  //       font: {
  //         bold: true,
  //         color: { rgb: "000000" }
  //       },
  //       alignment: {
  //         horizontal: "center",
  //         vertical: "center"
  //       },
  //       border: {
  //         top: { style: "thin" },
  //         bottom: { style: "thin" },
  //         left: { style: "thin" },
  //         right: { style: "thin" }
  //       }
  //     };
  //   }


  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Employees Data");

  //   XLSX.writeFile(wb, "Employee_Details.xlsx");
  // };

   const downloadExcel = async () => {
      if (filteredData?.length === 0) {
        alert("No data to export!");
        return;
      }
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Employees Data");
  
         worksheet.columns = [
        { header: "ID Card", key: "EMPID", width: 15 },
        { header: "Name", key: "FNAME", width: 35 },
        { header: "Gender", key: "GENDER", width: 15 },
        { header: "Department", key: "DEPARTMENT", width: 35 },
        { header: "Company", key: "COMPCODE", width: 22 },
        { header: "Age", key: "AGE", width: 18 },
        
      ];
  
      /* =======================
         1️⃣ Title Row
      ======================= */
      worksheet.insertRow(1, ["Age  Distribution Report"]);
      worksheet.mergeCells("A1:F1");
  
      const titleCell = worksheet.getCell("A1");
      titleCell.font = { bold: true, size: 14 };
      titleCell.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.getRow(1).height = 30;
      addInsightsRowDashboard({
        worksheet,
        startRow: 2,
        totalColumns: 6,
  
        dynamicField: "Age",
        selectedBuyer,
        selectedGender,
        selectedState,
  
  
      });
  
        const headerRow = worksheet.getRow(3);
      headerRow.height = 26;
  
      headerRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD9D9D9" }, // gray
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
  
      /* =======================
         3️⃣ Data Rows
      ======================= */
      filteredData.forEach((row) => {
        worksheet.addRow({
          EMPID: row.EMPID,
          FNAME: row.FNAME,
          GENDER: row.GENDER,
          DEPARTMENT: row.DEPARTMENT,
          COMPCODE: row.COMPCODE,
          AGE:row.AGEMON.toFixed(1)
          
        });
      });
  
      /* =======================
         4️⃣ Data Alignment
      ======================= */
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber <= 3) return;
  
        row.height = 22;
  
        row.getCell("EMPID").alignment = { horizontal: "right", vertical: "middle",indent:1 };
        row.getCell("FNAME").alignment = { horizontal: "left", vertical: "middle",indent:1 };
        row.getCell("GENDER").alignment = { horizontal: "left", vertical: "middle",indent:1 };
        row.getCell("DEPARTMENT").alignment = { horizontal: "left", vertical: "middle",indent:1 };
        row.getCell("COMPCODE").alignment = { horizontal: "left", vertical: "middle" ,indent:1};
        row.getCell("AGE").alignment = { horizontal: "right", vertical: "middle" ,indent:1};
       
      });
  
      /* =======================
         5️⃣ Freeze Header
      ======================= */
      worksheet.views = [{ state: "frozen", ySplit: 2 }];
  
      /* =======================
         6️⃣ Export
      ======================= */
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer]),
        "Age  Distribution Report.xlsx"
      );
    };

  const filteredData = Array.isArray(salaryDet)
    ? salaryDet
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
        const age = parseFloat(row?.AGEMON || 0);
        return age >= (ageRange.min || 19) && age <= (ageRange.max || 100);
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
      <div className="bg-white p-6 rounded-lg shadow-2xl w-[1280px] max-w-[1280px] relative">
        <button
          onClick={() => setOpenpopup(false)}



          className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2 rounded-full transition-all"
        >
          <FaTimes size={20} />
        </button>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 uppercase">
            Age Distribution-  <span className="text-blue-600">{selectedBuyer}</span>
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

          <div>

          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Min Age:</label>
            <input
              type="number"
              name="min"
              value={ageRange.min}
              onChange={handleAgeChange}
              className="border rounded px-2 py-1 w-16 text-sm"
              placeholder="Min"
            />
            <label className="text-sm font-medium text-gray-700">Max Age:</label>
            <input
              type="number"
              name="max"
              value={ageRange.max}
              onChange={handleAgeChange}
              className="border rounded px-2 py-1 w-16 text-sm"
              placeholder="Max"
            />
          </div>

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
                  <th className="border p-2 text-left">Age</th>

                </tr>
              </thead>
              <tbody className="text-xs">
                {currentRecords.slice(0, 10).map((row, index) => (
                  <tr
                    key={index}
                    className="text-gray-700 bg-white even:bg-gray-100 "
                  >
                    <td className="border p-2">{row.EMPID}</td>
                    <td className="border p-2">{row.FNAME}</td>
                    <td className="border p-2">{row.GENDER}</td>
                    <td className="border p-2">{row.DEPARTMENT}</td>
                    <td className="border p-2">{row.COMPCODE}</td>
                    <td className="border p-2">
                      {row.AGEMON.toFixed(1)}
                    </td>

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
                  <th className="border p-2 text-left">Age</th>

                </tr>
              </thead>
              <tbody className="text-xs">
                {currentRecords.slice(10, 20).map((row, index) => (
                  <tr
                    key={index}
                    className="text-gray-700 bg-white even:bg-gray-100"
                  >
                    <td className="border p-2">{row.EMPID}</td>
                    <td className="border p-2">{row.FNAME}</td>
                    <td className="border p-2">{row.GENDER}</td>
                    <td className="border p-2">{row.DEPARTMENT}</td>
                    <td className="border p-2">{row.COMPCODE}</td>
                    <td className="border p-2">
                      {row.AGEMON.toFixed(1)}
                    </td>

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

export default AgeDetail;

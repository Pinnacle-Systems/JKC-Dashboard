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
import { useGetMisDashboardAttDetQuery } from "../redux/service/misDashboardService";

const AttritionDet = ({
  closeTable,
  search,
  setSearch,
  
  selectedBuyer,

  color,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
     const [selectedState,setSelectedState] = useState('')
     const [selectedGender,setSelectedGender] = useState('')
    const [netpayRange,setNetpayRange] = useState({
    min:0,
    max:Infinity
   })
  const recordsPerPage = 20;
  console.log(selectedBuyer,"selectedBuyer for salary")
 

  const { data: salaryDetData  } = useGetMisDashboardAttDetQuery({
    params: {
        filterBuyer: selectedBuyer ||[] ,  
        search: search || {}               
    }
});

const salaryDet = salaryDetData?.data || []
  console.log(salaryDet,"salaryDet inside")
  useEffect(() => {
    setCurrentPage(1);
  }, [salaryDet]);

  

  const handleFilterClick = (type) => {
    setSelectedState(type);
  };
  console.log(selectedState, "selectedState");
  const handleGenderFilter = (gender) => {
    setSelectedGender(gender);
  };
  const downloadExcel = () => {
    if (filteredData.length === 0) {
      alert("No data to export!");
      return;
    }

    const headers = [["ID Card", "Name", "Gender", "Department", "Company","Date of Left","Reason"]];

    const data = filteredData.map((row) => [
      row.EMPID,
      row.FNAME,
      row.GENDER,
      row.DEPARTMENT,
      row.COMPCODE,
      row.DOL ? new Date(row.DOL).toLocaleDateString('en-IN') : '-',
      row.REASON
    ]);

    const ws = XLSX.utils.aoa_to_sheet([...headers, ...data]);

    // Apply style to header row
    const headerRange = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
      const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cell_address]) continue;

      ws[cell_address].s = {
        fill: { fgColor: { rgb: "FFFF00" } },
        font: { bold: true, color: { rgb: "000000" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees Data");

    XLSX.writeFile(wb, "Employee_Details.xlsx");
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
          onClick={closeTable}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2 rounded-full transition-all"
        >
          <FaTimes size={20} />
        </button>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 uppercase">
          Attrition Insights -  <span className="text-blue-600">{selectedBuyer.join(", ")}</span>
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Total Records: {totalRecords}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => handleFilterClick("Labour")}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full shadow-md transition-all 
      ${
        selectedState === "Labour"
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
      ${
        selectedState === "Staff"
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
      ${
        selectedState === "All"
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
              ${
                selectedGender === "Male"
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            <FaMars size={16} className="text-blue-500" /> Male
          </button>

          <button
            onClick={() => handleGenderFilter("Female")}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full shadow-md transition-all 
              ${
                selectedGender === "Female"
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            <FaVenus size={16} className="text-pink-500" /> Female
          </button>
          <button
            onClick={() => handleGenderFilter("All")}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full shadow-md transition-all 
              ${
                selectedGender === "Both"
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            <IoMaleFemale size={16} className="text-green-500" /> Both
          </button>
      
          <div>
  
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
                  <th className="border p-2 text-left">Date of Left</th>
                  <th className="border p-2 text-left">Reason</th>

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
  {row.DOL ? new Date(row.DOL).toLocaleDateString('en-IN') : '-'}
</td>
                    <td className="border p-2 text-red-500 font-semibold">
                    {row.REASON || "N/A"} 
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
                  <th className="border p-2 text-left">Date of Left</th>
                  <th className="border p-2 text-left">Reason</th>

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
  {row.DOL ? new Date(row.DOL).toLocaleDateString('en-IN') : '-'}
</td>
                    <td className="border p-2 text-red-500 font-semibold">
                    {row.REASON || "N/A"} 
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
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-gray-200"
              }`}
            >
              <FaStepBackward size={16} />
            </button>

            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
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
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-gray-200"
              }`}
            >
              <FaChevronRight size={16} />
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
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

export default AttritionDet;

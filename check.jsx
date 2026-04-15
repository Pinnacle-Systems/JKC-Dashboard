import { useState, useMemo, useEffect } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaStepBackward,
  FaStepForward,
  FaSearch,
} from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";
import { useGetTopTenSupplierGeneralTableQuery,  useGetTopTenSupplierGreyYarnTableQuery,
  useGetTopTenSupplierDyedYarnTableQuery,
  useGetTopTenSupplierGreyFabricTableQuery,
  useGetTopTenSupplierDyedFabricTableQuery,
  useGetTopTenSupplierAccessoryTableQuery } from "../../../../redux/service/purchaseServiceTable";
import {
  useGetTopTenSupplierCombinedQuery,
  useGetTopTenSupplierPurchaseGeneralQuery,
} from "../../../../redux/service/purchaseService";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  addInsightsRowTurnOver,
  formatQtyByUOM,
  getExcelQtyFormatByUOM,
} from "../../../../utils/hleper";
import SpinLoader from "../../../../utils/spinLoader";
import moment from "moment";
const TopTenSupplierGeneral = ({
  year,
  company,
  poType,
  selectedCompCode,
  setSelectedCompCode,
  companyList,

  supplier,
  finYr,
  closeTable,
  setSelectedYear,
  selectedYear,
  supplierOptions,
}) => {
  const [localPoType, setLocalPoType] = useState(poType || "General");
  const [selectedSupplier, setSelectedSupplier] = useState(supplier || "");
  console.log(
    selectedYear,
    selectedCompCode,
    selectedSupplier,
    supplier,
    "year",
  );
  // Add this inside the component, below your existing state
  const combinedQuery = useGetTopTenSupplierCombinedQuery(
    selectedYear && selectedCompCode
      ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
      : skipToken,
  );
  const generalQuery = useGetTopTenSupplierPurchaseGeneralQuery(
    selectedYear && selectedCompCode
      ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
      : skipToken,
  );

  const { data: supplierResponse } =
    poType === "All" ? combinedQuery : generalQuery;

  // Derive supplierOptions locally — replaces the prop
  const localSupplierOptions = useMemo(() => {
    if (!supplierResponse?.data) return [];
    const sorted = [...supplierResponse.data].sort(
      (a, b) => b.TOTAL_VAL - a.TOTAL_VAL,
    );
    return [...new Set(sorted.map((i) => i.supplierName))];
  }, [supplierResponse]);

  const [netpayRange, setNetpayRange] = useState({
    min: 0,
    max: Infinity,
  });

  const [search, setSearch] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 34;

  // ✅ API CALL INSIDE TABLE
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetTopTenSupplierGeneralTableQuery(
    {
      params: {
        selectedYear,
        companyName: selectedCompCode,
        supplier: selectedSupplier,
      },
    },
    { skip: !selectedYear || !selectedCompCode || !selectedSupplier },
  );

  const rawData = useMemo(() => {
    if (!selectedSupplier) return [];
    return Array.isArray(response?.data) ? response.data : [];
  }, [response?.data, selectedSupplier]);

  console.log(rawData, "rawData");

  // ✅ FILTERING
  const filteredData = useMemo(() => {
    if (!selectedSupplier) return [];
    return rawData.filter((row) => {
      // 🔹 Customer dropdown filter

      // 🔹 Search filter (month search)
      if (search.docId) {
        const rowdocId = row.docId?.toLowerCase() || "";
        if (!rowdocId.includes(search.docId.toLowerCase())) {
          return false;
        }
      }

      if (search.itemGroup) {
        const rowItemGroup = row.itemGroup?.toLowerCase() || "";
        if (!rowItemGroup.includes(search.itemGroup.toLowerCase())) {
          return false;
        }
      }

      if (search.itemName) {
        const rowitemName = row.item?.toLowerCase() || "";
        if (!rowitemName.includes(search.itemName.toLowerCase())) {
          return false;
        }
      }
      if (search.supplier) {
        const rowsupplier = row.supplier?.toLowerCase() || "";
        if (!rowsupplier.includes(search.supplier.toLowerCase())) {
          return false;
        }
      }

      // 🔹 Min / Max Turnover filter
      const value = Number(row.amount || 0);

      if (value < netpayRange.min) return false;
      if (netpayRange.max !== Infinity && value > netpayRange.max) return false;

      return true;
    });
  }, [rawData, search, netpayRange, selectedSupplier]);

  // ✅ TOTAL
  const totalTurnOver = useMemo(
    () => filteredData.reduce((sum, r) => sum + Number(r.amount || 0), 0),
    [filteredData],
  );

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const currentRecords = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  );
  const formateDate = (date) => {
    if (!date) return;

    return moment(date).format("DD-MM-YYYY");
  };
  // ✅ EXCEL EXPORT
  const downloadExcel = async () => {
    if (!filteredData.length) {
      alert("No data");
      return;
    }

    const totalRate = filteredData.reduce(
      (sum, r) => sum + Number(r.rate || 0),
      0,
    );
    const totalAmount = filteredData.reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0,
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Top Ten Supplier Report");

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 8 },
        { header: "Supplier", key: "supplier", width: 60 },
      { header: "Doc No", key: "docNo", width: 24 },
      { header: "Doc Date", key: "docDate", width: 16 },
      { header: "Item Group", key: "itemGroup", width: 20 },
      { header: "Item Name", key: "item", width: 80 },

      { header: "Qty", key: "qty", width: 14 },
      { header: "UOM", key: "uom", width: 14 },
      { header: "Rate", key: "rate", width: 18 },
      { header: "Amount", key: "amount", width: 20 },
    ];

    // Title
    worksheet.insertRow(1, ["Top Ten Supplier Report"]);
    worksheet.mergeCells("A1:J1");
    const titleCell = worksheet.getCell("A1");
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(1).height = 30;

    // Insights row
    addInsightsRowTurnOver({
      worksheet,
      startRow: 2,
      totalColumns: 3,
      selectedYear,

      localCompany:selectedCompCode,
      dynamicField: "Supplier",
      dynamicValue: selectedSupplier,
      secondDynamicField:"Po Type",
      seconddynamicValue:poType
    });

    // Header formatting
    const headerRow = worksheet.getRow(3);
    headerRow.height = 26;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Add data rows
    filteredData.forEach((r, index) => {
      const row = worksheet.addRow({
        sno: index + 1,
        supplier: r.supplier,
        docNo: r.docId,
        docDate: formateDate(r.docDate),
        itemGroup: r.itemGroup,
        item: r.item,

        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.rate || 0),
        amount: Number(r.amount || 0),
      });
      row.getCell("qty").numFmt = getExcelQtyFormatByUOM(r.uom);
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 3) return;
      row.height = 22;
      [
        "sno",
        "supplier",
        "docNo",
        "docDate",
        "itemGroup",
        "item",

        "qty",
        "uom",
        "rate",
        "amount",
      ].forEach((key, i) => {
        const cell = row.getCell(i + 1);
        if (["qty", "rate", "amount"].includes(key)) {
          cell.alignment = {
            horizontal: "right",
            vertical: "middle",
            indent: 1,
          };
        } else {
          cell.alignment = {
            horizontal: "left",
            vertical: "middle",
            indent: 1,
          };
        }
      });
    });

    // Total row
    const totalRow = worksheet.addRow({
      sno: "",
      docNo: "",
      docDate: "",
      itemGroup: "",
      item: "",
      supplier: "",
      qty: "",
      uom: "Total",
      rate: totalRate,
      amount: totalAmount,
    });

    totalRow.height = 24;
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 9 || colNumber === 10 ? "right" : "center",
      };
    });

    worksheet.getColumn("docDate").numFmt = "dd-mm-yyyy";
    worksheet.getColumn("rate").numFmt = "₹ #,##,##0.00";
    worksheet.getColumn("amount").numFmt = "₹ #,##,##0.00";

    // Freeze headers
    worksheet.views = [{ state: "frozen", ySplit: 3 }];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Top Ten Supplier Report.xlsx",
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1470px] h-[630px] p-4 rounded-xl relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase">
            Top Ten Supplier -{" "}
            <span className="text-blue-600 ">{selectedCompCode || ""}</span>
          </h2>

          <div className="flex gap-2 items-center">
            <div className="bg-gray-300  rounded-lg shadow-2xl flex gap-x-4 gap-1 p-2">
              <button
                onClick={() => setLocalPoType("General")}
                className={`w-20 text-center flex items-center justify-center gap-2 px-3 py-0.5 text-[11px] font-semibold rounded-full shadow-md transition-all
                  ${
                    localPoType === "General"
                      ? "bg-blue-600 text-white scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-400`}
              >
                General
              </button>

              <button
                onClick={() => setLocalPoType("Order")}
                className={`w-16 text-center flex items-center justify-center gap-2 px-3 py-0.5 text-[11px] font-semibold rounded-full shadow-md transition-all
                  ${
                    localPoType === "Order"
                      ? "bg-blue-600 text-white scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-400`}
              >
                Order
              </button>
              <div className="w-24">
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    if (selectedSupplier) {
                      setSelectedSupplier("");
                    }
                    setCurrentPage(1);
                  }}
                  className="w-full px-2 py-1 text-xs border-2   rounded-md
      border-blue-600 transition-all duration-200"
                >
                  <option value="" disabled>
                    Select Year
                  </option>

                  {(finYr?.data || []).map((item) => (
                    <option key={item.finYear} value={item.finYear}>
                      {item.finYear}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-24">
                <select
                  value={selectedCompCode || "ALL"}
                  onChange={(e) => {
                    setSelectedCompCode(e.target.value);
                    if (selectedSupplier) {
                      setSelectedSupplier("");
                    }
                    setCurrentPage(1);
                  }}
                  className="w-full px-2 py-1 text-xs border-2   rounded-md
      border-blue-600 transition-all duration-200"
                >
                  <option value="">Select Company</option>
                  {companyList?.data?.map((item) => (
                    <option key={item.COMPCODE} value={item.COMPCODE}>
                      {item.COMPCODE}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-96">
                <select
                  value={selectedSupplier}
                  onChange={(e) => {
                    setSelectedSupplier(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2 py-1 text-xs border-2   rounded-md
      border-blue-600 transition-all duration-200"
                >
                  <option>Select Supplier</option>
                  {localSupplierOptions?.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button className="text-red-600" onClick={closeTable}>
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* TOTAL */}
        <p className="text-xs font-semibold  text-gray-600">
          Total Amount :{" "}
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(totalTurnOver)}
        </p>

        {/* SEARCH */}

        <div className="flex justify-between items-start mt-2">
          <div className="flex gap-x-4 mb-3">
            {["docId", "itemGroup", "itemName", "supplier"].map((key) => (
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
          <div className=" flex gap-x-2">
            <div className="flex items-center text-[12px]">
              <span className="text-gray-500">Min Amount : </span>
              <input
                type="text"
                value={netpayRange.min}
                onChange={(e) =>
                  setNetpayRange({
                    ...netpayRange,
                    min: Number(e.target.value),
                  })
                }
                className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center  text-[12px]">
              <span className="text-gray-500">Max Amount : </span>
              <input
                type="text"
                value={netpayRange.max === Infinity ? "" : netpayRange.max}
                onChange={(e) => {
                  const val = e.target.value;

                  setNetpayRange({
                    ...netpayRange,
                    max: val === "" ? Infinity : Number(val),
                  });
                }}
                className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
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
        {/* TABLE */}
        <div className="grid  gap-4">
          <div
            className="overflow-x-auto h-[470px] "
            style={{ border: "1px solid gray", borderRadius: "16px" }}
          >
            <table className="w-full border-collapse text-[11px] table-fixed">
              <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                <tr>
                  <th className="border p-1 text-center w-4">S.No</th>
                  {/* <th className="border p-1 text-center w-8">Year</th> */}
                  <th className="border p-1 text-center w-36">Supplier</th>
                  <th className="border p-1 text-center w-16">Doc No</th>
                  <th className="border p-1 text-center w-[38px]">Doc Date</th>
                  <th className="border p-1 text-center w-12">Item Group</th>
                  <th className="border p-1 text-center w-52">Item Name</th>

                  <th className="border p-1 text-center w-8">Qty</th>
                  <th className="border p-1 text-center w-8">UOM</th>
                  <th className="border p-1 text-center w-8">Rate</th>
                  <th className="border p-1 text-center w-12">Amount</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={10} className=" text-center">
                      <div className="flex justify-center items-center pointer-events-none">
                        <SpinLoader />
                      </div>
                    </td>
                  </tr>
                ) : currentRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center py-6 text-gray-500 border-b-0"
                    >
                      No data found
                    </td>
                  </tr>
                ) : (
                  currentRecords?.map((row, index) => {
                    const globalIndex = index; // 0–16
                    const serialNo =
                      (currentPage - 1) * recordsPerPage + globalIndex + 1;

                    return (
                      <tr
                        key={index}
                        className="text-gray-800 bg-white even:bg-gray-100"
                      >
                        <td className="border p-1 text-center">{serialNo}</td>
                        {/* <td className="border p-1 pl-2 text-left">
                          {row.finYear}
                        </td> */}
                        <td className="border p-1 pr-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>

                        <td className="border p-1 pl-2 text-left ">
                          {formateDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left ">
                          {row.itemGroup}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.item}
                        </td>

                        <td className="border p-1 pr-2 text-right">
                          {" "}
                          {formatQtyByUOM(row.qty, row.uom)}
                        </td>
                        <td className="border p-1 pl-2 text-left">{row.uom}</td>

                        {/* <td className="border p-1 pr-2 text-right">{row.rate}</td> */}

                        <td className="border p-1 pr-2 text-right  ">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(row.rate)}
                        </td>
                        <td className="border p-1 pr-2 text-right text-sky-700 ">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(row.amount)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div>
          <div
            className="flex justify-end items-center mt-4 space-x-2 text-[11px] "
            style={{ position: "absolute", bottom: "5px", right: "0px" }}
          >
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

            <span className="text-xs font-semibold px-3">
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
        </div>
      </div>
    </div>
  );
};

export default TopTenSupplierGeneral;
import { useState, useMemo, useEffect } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaStepBackward,
  FaStepForward,
  FaSearch,
} from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  useGetTopTenSupplierGeneralTableQuery,
  useGetTopTenSupplierGreyYarnTableQuery,
  useGetTopTenSupplierDyedYarnTableQuery,
  useGetTopTenSupplierGreyFabricTableQuery,
  useGetTopTenSupplierDyedFabricTableQuery,
  useGetTopTenSupplierAccessoryTableQuery,
} from "../../../../redux/service/purchaseServiceTable";
import {
  useGetTopTenSupplierCombinedQuery,
  useGetTopTenSupplierPurchaseGeneralQuery,
  useGetTopTenSupplierQuery,
} from "../../../../redux/service/purchaseService";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  addInsightsRowTurnOver,
  formatQtyByUOM,
  getExcelQtyFormatByUOM,
} from "../../../../utils/hleper";
import SpinLoader from "../../../../utils/spinLoader";
import moment from "moment";

const ORDER_TYPES = [
  { label: "GREY YARN", value: "GREY YARN" },
  { label: "DYED YARN", value: "DYED YARN" },
  { label: "GREY FABRIC", value: "GREY FABRIC" },
  { label: "DYED FABRIC", value: "DYED FABRIC" },
  { label: "ACCESSORY", value: "ACCESSORY" },
];

const INR = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    v,
  );
const fmtDate = (d) => (d ? moment(d).format("DD-MM-YYYY") : "");
const RECORDS = 34;

// ── reusable pagination bar ──────────────────────────────────────────────────
const Pagination = ({ page, total, setPage }) => (
  <div
    className="flex justify-end items-center mt-4 space-x-2 text-[11px]"
    style={{ position: "absolute", bottom: "5px", right: "0px" }}
  >
    <button
      onClick={() => setPage(1)}
      disabled={page === 1}
      className={`p-2 rounded-md ${page === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}
    >
      <FaStepBackward size={16} />
    </button>
    <button
      onClick={() => setPage((p) => Math.max(p - 1, 1))}
      disabled={page === 1}
      className={`p-2 rounded-md ${page === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}
    >
      <FaChevronLeft size={16} />
    </button>
    <span className="text-xs font-semibold px-3">
      Page {page} of {total || 1}
    </span>
    <button
      onClick={() => setPage((p) => Math.min(p + 1, total))}
      disabled={page === total || !total}
      className={`p-2 rounded-md ${page === total || !total ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}
    >
      <FaChevronRight size={16} />
    </button>
    <button
      onClick={() => setPage(total)}
      disabled={page === total || !total}
      className={`p-2 rounded-md ${page === total || !total ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}
    >
      <FaStepForward size={16} />
    </button>
  </div>
);

const TopTenSupplierGeneral = ({
  poType,
  selectedCompCode,
  setSelectedCompCode,
  companyList,
  supplier,
  finYr,
  closeTable,
  setSelectedYear,
  selectedYear,
}) => {
  // ── local state ─────────────────────────────────────────────────────────────
  const [localPoType, setLocalPoType] = useState(poType || "General");
  const [selectedSupplier, setSelectedSupplier] = useState(supplier || "");
  const [selectedOrderType, setSelectedOrderType] = useState("GREY YARN");

  // per-table search
  const [search, setSearch] = useState({});
  const [greyYarnSearch, setGreyYarnSearch] = useState({});
  const [dyedYarnSearch, setDyedYarnSearch] = useState({});
  const [greyFabricSearch, setGreyFabricSearch] = useState({});
  const [dyedFabricSearch, setDyedFabricSearch] = useState({});
  const [accessorySearch, setAccessorySearch] = useState({});

  // per-table amount range
  const defaultRange = { min: 0, max: Infinity };
  const [range0, setRange0] = useState(defaultRange);
  const [range1, setRange1] = useState(defaultRange);
  const [range2, setRange2] = useState(defaultRange);
  const [range3, setRange3] = useState(defaultRange);
  const [range4, setRange4] = useState(defaultRange);
  const [range5, setRange5] = useState(defaultRange);

  // per-table pagination
  const [page0, setPage0] = useState(1);
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [page3, setPage3] = useState(1);
  const [page4, setPage4] = useState(1);
  const [page5, setPage5] = useState(1);

  // ── supplier options query ───────────────────────────────────────────────────
  const combinedQ = useGetTopTenSupplierCombinedQuery(
    selectedYear && selectedCompCode
      ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
      : skipToken,
  );
  const generalQ = useGetTopTenSupplierPurchaseGeneralQuery(
    selectedYear && selectedCompCode
      ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
      : skipToken,
  );
  const orderQ = useGetTopTenSupplierQuery(
    // ← the Order query
    selectedYear && selectedCompCode
      ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
      : skipToken,
  );
  const { data: supplierResponse } =
    poType === "All"
      ? combinedQ
      : poType === "Order"
        ? orderQ // ← was missing
        : generalQ;

  const localSupplierOptions = useMemo(() => {
    if (!supplierResponse?.data) return [];

    if (poType === "Order") {
      // Order API returns: [{ type: "GREY YARN", data: [{SUPPLIER, VAL, ...}] }, ...]
      // Flatten all types, deduplicate suppliers
      const all = supplierResponse.data.flatMap((group) => group.data || []);
      return [...new Map(all.map((r) => [r.SUPPLIER, r])).values()]
        .sort((a, b) => b.VAL - a.VAL)
        .map((r) => r.SUPPLIER);
    }

    // General / All API returns flat array with supplierName field
    return [...supplierResponse.data]
      .sort((a, b) => b.TOTAL_VAL - a.TOTAL_VAL)
      .map((i) => i.supplierName)
      .filter((v, i, a) => a.indexOf(v) === i);
  }, [supplierResponse, poType]);

  // Auto-select first supplier when options load
  useEffect(() => {
    if (localSupplierOptions.length > 0) {
      setSelectedSupplier(localSupplierOptions[0]);
      resetAllPages();
    }
  }, [localSupplierOptions]);

  // Reset supplier when year/company changes
  useEffect(() => {
    setSelectedSupplier("");
    resetAllPages();
  }, [selectedYear, selectedCompCode]);

  const resetAllPages = () => {
    setPage0(1);
    setPage1(1);
    setPage2(1);
    setPage3(1);
    setPage4(1);
    setPage5(1);
  };

  const skip = !selectedYear || !selectedCompCode || !selectedSupplier;
  const qParams = {
    params: {
      selectedYear,
      companyName: selectedCompCode,
      supplier: selectedSupplier,
    },
  };

  // ── data queries ─────────────────────────────────────────────────────────────
  const {
    data: generalRes,
    isLoading: l0,
    isFetching: f0,
  } = useGetTopTenSupplierGeneralTableQuery(qParams, { skip });
  const {
    data: greyYarnRes,
    isLoading: l1,
    isFetching: f1,
  } = useGetTopTenSupplierGreyYarnTableQuery(qParams, { skip });
  const {
    data: dyedYarnRes,
    isLoading: l2,
    isFetching: f2,
  } = useGetTopTenSupplierDyedYarnTableQuery(qParams, { skip });
  const {
    data: greyFabricRes,
    isLoading: l3,
    isFetching: f3,
  } = useGetTopTenSupplierGreyFabricTableQuery(qParams, { skip });
  const {
    data: dyedFabricRes,
    isLoading: l4,
    isFetching: f4,
  } = useGetTopTenSupplierDyedFabricTableQuery(qParams, { skip });
  const {
    data: accessoryRes,
    isLoading: l5,
    isFetching: f5,
  } = useGetTopTenSupplierAccessoryTableQuery(qParams, { skip });

  // ── raw data ─────────────────────────────────────────────────────────────────
  const raw0 = useMemo(
    () => (Array.isArray(generalRes?.data) ? generalRes.data : []),
    [generalRes],
  );
  const raw1 = useMemo(
    () => (Array.isArray(greyYarnRes?.data) ? greyYarnRes.data : []),
    [greyYarnRes],
  );
  const raw2 = useMemo(
    () => (Array.isArray(dyedYarnRes?.data) ? dyedYarnRes.data : []),
    [dyedYarnRes],
  );
  const raw3 = useMemo(
    () => (Array.isArray(greyFabricRes?.data) ? greyFabricRes.data : []),
    [greyFabricRes],
  );
  const raw4 = useMemo(
    () => (Array.isArray(dyedFabricRes?.data) ? dyedFabricRes.data : []),
    [dyedFabricRes],
  );
  const raw5 = useMemo(
    () => (Array.isArray(accessoryRes?.data) ? accessoryRes.data : []),
    [accessoryRes],
  );

  // ── generic text filter helper ───────────────────────────────────────────────
  const textMatch = (row, key, val) =>
    !val || (row[key]?.toLowerCase() || "").includes(val.toLowerCase());

  const amtFilter = (row, range) => {
    const v = Number(row.amount || 0);
    return v >= range.min && (range.max === Infinity || v <= range.max);
  };

  // ── filtered data ─────────────────────────────────────────────────────────────
  const fd0 = useMemo(
    () =>
      raw0.filter(
        (r) =>
          textMatch(r, "docId", search.docId) &&
          textMatch(r, "itemGroup", search.itemGroup) &&
          textMatch(r, "item", search.itemName) &&
          textMatch(r, "supplier", search.supplier) &&
          amtFilter(r, range0),
      ),
    [raw0, search, range0],
  );

  const fd1 = useMemo(
    () =>
      raw1.filter(
        (r) =>
          textMatch(r, "docId", greyYarnSearch.docId) &&
          textMatch(r, "yarnName", greyYarnSearch.yarnName) &&
          textMatch(r, "orderNo", greyYarnSearch.orderNo) &&
          textMatch(r, "supplier", greyYarnSearch.supplier) &&
          textMatch(r, "color", greyYarnSearch.color) &&
          amtFilter(r, range1),
      ),
    [raw1, greyYarnSearch, range1],
  );

  const fd2 = useMemo(
    () =>
      raw2.filter(
        (r) =>
          textMatch(r, "docId", dyedYarnSearch.docId) &&
          textMatch(r, "yarnName", dyedYarnSearch.yarnName) &&
          textMatch(r, "orderNo", dyedYarnSearch.orderNo) &&
          textMatch(r, "supplier", dyedYarnSearch.supplier) &&
          textMatch(r, "color", dyedYarnSearch.color) &&
          amtFilter(r, range2),
      ),
    [raw2, dyedYarnSearch, range2],
  );

  const fd3 = useMemo(
    () =>
      raw3.filter(
        (r) =>
          textMatch(r, "docId", greyFabricSearch.docId) &&
          textMatch(r, "fabricName", greyFabricSearch.fabricName) &&
          textMatch(r, "orderNo", greyFabricSearch.orderNo) &&
          textMatch(r, "supplier", greyFabricSearch.supplier) &&
          textMatch(r, "color", greyFabricSearch.color) &&
          amtFilter(r, range3),
      ),
    [raw3, greyFabricSearch, range3],
  );

  const fd4 = useMemo(
    () =>
      raw4.filter(
        (r) =>
          textMatch(r, "docId", dyedFabricSearch.docId) &&
          textMatch(r, "fabricName", dyedFabricSearch.fabricName) &&
          textMatch(r, "orderNo", dyedFabricSearch.orderNo) &&
          textMatch(r, "supplier", dyedFabricSearch.supplier) &&
          textMatch(r, "color", dyedFabricSearch.color) &&
          amtFilter(r, range4),
      ),
    [raw4, dyedFabricSearch, range4],
  );

  const fd5 = useMemo(
    () =>
      raw5.filter(
        (r) =>
          textMatch(r, "docId", accessorySearch.docId) &&
          textMatch(r, "orderNo", accessorySearch.orderNo) &&
          textMatch(r, "supplier", accessorySearch.supplier) &&
          textMatch(r, "accessItemName", accessorySearch.accessItemName) &&
          textMatch(r, "accessSize", accessorySearch.accessSize) &&
          amtFilter(r, range5),
      ),
    [raw5, accessorySearch, range5],
  );

  // ── totals ───────────────────────────────────────────────────────────────────
  const tot0 = useMemo(
    () => fd0.reduce((s, r) => s + Number(r.amount || 0), 0),
    [fd0],
  );
  const tot1 = useMemo(
    () => fd1.reduce((s, r) => s + Number(r.amount || 0), 0),
    [fd1],
  );
  const tot2 = useMemo(
    () => fd2.reduce((s, r) => s + Number(r.amount || 0), 0),
    [fd2],
  );
  const tot3 = useMemo(
    () => fd3.reduce((s, r) => s + Number(r.amount || 0), 0),
    [fd3],
  );
  const tot4 = useMemo(
    () => fd4.reduce((s, r) => s + Number(r.amount || 0), 0),
    [fd4],
  );
  const tot5 = useMemo(
    () => fd5.reduce((s, r) => s + Number(r.amount || 0), 0),
    [fd5],
  );

  const displayTotal =
    localPoType === "General"
      ? tot0
      : selectedOrderType === "GREY YARN"
        ? tot1
        : selectedOrderType === "DYED YARN"
          ? tot2
          : selectedOrderType === "GREY FABRIC"
            ? tot3
            : selectedOrderType === "DYED FABRIC"
              ? tot4
              : selectedOrderType === "ACCESSORY"
                ? tot5
                : 0;

  // ── paginated records ─────────────────────────────────────────────────────────
  const paginate = (data, page) =>
    data.slice((page - 1) * RECORDS, page * RECORDS);
  const totalPg = (data) => Math.ceil(data.length / RECORDS) || 1;

  const cr0 = paginate(fd0, page0);
  const tp0 = totalPg(fd0);
  const cr1 = paginate(fd1, page1);
  const tp1 = totalPg(fd1);
  const cr2 = paginate(fd2, page2);
  const tp2 = totalPg(fd2);
  const cr3 = paginate(fd3, page3);
  const tp3 = totalPg(fd3);
  const cr4 = paginate(fd4, page4);
  const tp4 = totalPg(fd4);
  const cr5 = paginate(fd5, page5);
  const tp5 = totalPg(fd5);

  // ── search bar helper ─────────────────────────────────────────────────────────
  const SearchBar = ({ keys, state, setState }) => (
    <div className="flex gap-x-4 mb-3">
      {keys.map((key) => (
        <div key={key} className="relative">
          <input
            type="text"
            placeholder={`Search ${key}...`}
            value={state[key] || ""}
            onChange={(e) => setState({ ...state, [key]: e.target.value })}
            className="w-full h-6 p-1 pl-8 text-gray-900 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          />
          <FaSearch className="absolute left-2 top-1.5 text-gray-500 text-sm" />
        </div>
      ))}
    </div>
  );

  // ── amount range helper ───────────────────────────────────────────────────────
  const RangeFilter = ({ range, setRange }) => (
    <div className="flex gap-x-2">
      <div className="flex items-center text-[12px]">
        <span className="text-gray-500">Min Amount:</span>
        <input
          type="text"
          value={range.min}
          onChange={(e) => setRange({ ...range, min: Number(e.target.value) })}
          className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <div className="flex items-center text-[12px]">
        <span className="text-gray-500">Max Amount:</span>
        <input
          type="text"
          value={range.max === Infinity ? "" : range.max}
          onChange={(e) =>
            setRange({
              ...range,
              max: e.target.value === "" ? Infinity : Number(e.target.value),
            })
          }
          className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );

  // ── loading row ───────────────────────────────────────────────────────────────
  const LoadingRow = ({ cols }) => (
    <tr>
      <td colSpan={cols} className="text-center">
        <div className="flex justify-center items-center pointer-events-none">
          <SpinLoader />
        </div>
      </td>
    </tr>
  );
  const EmptyRow = ({ cols }) => (
    <tr>
      <td colSpan={cols} className="text-center py-6 text-gray-500">
        No data found
      </td>
    </tr>
  );

  // ── excel export ──────────────────────────────────────────────────────────────
  const buildExcel = async (data, columns, sheetMapper, fileName) => {
    if (!data.length) {
      alert("No data");
      return;
    }
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Top Ten Supplier Report");
    ws.columns = columns;
    ws.insertRow(1, ["Top Ten Supplier Report"]);
    ws.mergeCells(`A1:${String.fromCharCode(64 + columns.length)}1`);
    const tc = ws.getCell("A1");
    tc.font = { bold: true, size: 14 };
    tc.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 30;
    addInsightsRowTurnOver({
      worksheet: ws,
      startRow: 2,
      totalColumns: 3,
      selectedYear,
      localCompany: selectedCompCode,
      dynamicField: "Supplier",
      dynamicValue: selectedSupplier,
    });
    const hr = ws.getRow(3);
    hr.height = 26;
    hr.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
    data.forEach((r, i) => {
      const row = ws.addRow(sheetMapper(r, i));
      if (r.uom) row.getCell("qty").numFmt = getExcelQtyFormatByUOM(r.uom);
    });
    ws.eachRow((row, rn) => {
      if (rn <= 3) return;
      row.height = 22;
      row.eachCell((cell, cn) => {
        const key = columns[cn - 1]?.key;
        cell.alignment = {
          horizontal: ["qty", "rate", "amount", "price"].includes(key)
            ? "right"
            : "left",
          vertical: "middle",
          indent: 1,
        };
      });
    });
    ws.getColumn("docDate").numFmt = "dd-mm-yyyy";
    ws.getColumn("rate")?.numFmt &&
      (ws.getColumn("rate").numFmt = "₹ #,##,##0.00");
    ws.getColumn("amount").numFmt = "₹ #,##,##0.00";
    ws.views = [{ state: "frozen", ySplit: 3 }];
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      fileName,
    );
  };

  const dlGeneral = () =>
    buildExcel(
      fd0,
      [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Supplier", key: "supplier", width: 60 },
        { header: "Doc No", key: "docNo", width: 24 },
        { header: "Doc Date", key: "docDate", width: 16 },
        { header: "Item Group", key: "itemGroup", width: 20 },
        { header: "Item Name", key: "item", width: 80 },
        { header: "Qty", key: "qty", width: 14 },
        { header: "UOM", key: "uom", width: 14 },
        { header: "Rate", key: "rate", width: 18 },
        { header: "Amount", key: "amount", width: 20 },
      ],
      (r, i) => ({
        sno: i + 1,
        supplier: r.supplier,
        docNo: r.docId,
        docDate: fmtDate(r.docDate),
        itemGroup: r.itemGroup,
        item: r.item,
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.rate || 0),
        amount: Number(r.amount || 0),
      }),
      "Top_Ten_Supplier_General.xlsx",
    );

  const dlGreyYarn = () =>
    buildExcel(
      fd1,
      [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Supplier", key: "supplier", width: 60 },
        { header: "Doc No", key: "docNo", width: 24 },
        { header: "Doc Date", key: "docDate", width: 16 },
        { header: "Yarn", key: "yarn", width: 50 },
        { header: "Order No", key: "orderNo", width: 25 },
        { header: "Color", key: "color", width: 25 },
        { header: "Qty", key: "qty", width: 14 },
        { header: "UOM", key: "uom", width: 14 },
        { header: "Rate", key: "rate", width: 18 },
        { header: "Amount", key: "amount", width: 20 },
      ],
      (r, i) => ({
        sno: i + 1,
        supplier: r.supplier,
        docNo: r.docId,
        docDate: fmtDate(r.docDate),
        yarn: r.yarnName,
        orderNo: r.orderNo,
        color: r.color,
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.price || 0),
        amount: Number(r.amount || 0),
      }),
      "Top_Ten_Supplier_GreyYarn.xlsx",
    );

  const dlDyedYarn = () =>
    buildExcel(
      fd2,
      [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Supplier", key: "supplier", width: 60 },
        { header: "Doc No", key: "docNo", width: 24 },
        { header: "Doc Date", key: "docDate", width: 16 },
        { header: "Yarn", key: "yarn", width: 50 },
        { header: "Order No", key: "orderNo", width: 25 },
        { header: "Color", key: "color", width: 25 },
        { header: "Qty", key: "qty", width: 14 },
        { header: "UOM", key: "uom", width: 14 },
        { header: "Rate", key: "rate", width: 18 },
        { header: "Amount", key: "amount", width: 20 },
      ],
      (r, i) => ({
        sno: i + 1,
        supplier: r.supplier,
        docNo: r.docId,
        docDate: fmtDate(r.docDate),
        yarn: r.yarnName,
        orderNo: r.orderNo,
        color: r.color,
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.price || 0),
        amount: Number(r.amount || 0),
      }),
      "Top_Ten_Supplier_DyedYarn.xlsx",
    );

  const dlGreyFabric = () =>
    buildExcel(
      fd3,
      [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Supplier", key: "supplier", width: 60 },
        { header: "Doc No", key: "docNo", width: 24 },
        { header: "Doc Date", key: "docDate", width: 16 },
        { header: "Fabric Name", key: "fabric", width: 90 },
        { header: "Order No", key: "orderNo", width: 25 },
        { header: "Color", key: "color", width: 25 },
        { header: "Design", key: "design", width: 25 },
        { header: "GSM", key: "gsm", width: 15 },
        { header: "Qty", key: "qty", width: 14 },
        { header: "UOM", key: "uom", width: 14 },
        { header: "Rate", key: "rate", width: 18 },
        { header: "Amount", key: "amount", width: 20 },
      ],
      (r, i) => ({
        sno: i + 1,
        supplier: r.supplier,
        docNo: r.docId,
        docDate: fmtDate(r.docDate),
        fabric: r.fabricName,
        orderNo: r.orderNo,
        color: r.color,
        design: r.design,
        gsm: !isNaN(Number(r.gsm)) ? Number(r.gsm) : "N/A",
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.price || 0),
        amount: Number(r.amount || 0),
      }),
      "Top_Ten_Supplier_GreyFabric.xlsx",
    );

  const dlDyedFabric = () =>
    buildExcel(
      fd4,
      [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Supplier", key: "supplier", width: 60 },
        { header: "Doc No", key: "docNo", width: 24 },
        { header: "Doc Date", key: "docDate", width: 16 },
        { header: "Fabric Name", key: "fabric", width: 90 },
        { header: "Order No", key: "orderNo", width: 25 },
        { header: "Color", key: "color", width: 25 },
        { header: "Design", key: "design", width: 25 },
        { header: "GSM", key: "gsm", width: 15 },
        { header: "Qty", key: "qty", width: 14 },
        { header: "UOM", key: "uom", width: 14 },
        { header: "Rate", key: "rate", width: 18 },
        { header: "Amount", key: "amount", width: 20 },
      ],
      (r, i) => ({
        sno: i + 1,
        supplier: r.supplier,
        docNo: r.docId,
        docDate: fmtDate(r.docDate),
        fabric: r.fabricName,
        orderNo: r.orderNo,
        color: r.color,
        design: r.design,
        gsm: !isNaN(Number(r.gsm)) ? Number(r.gsm) : "N/A",
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.price || 0),
        amount: Number(r.amount || 0),
      }),
      "Top_Ten_Supplier_DyedFabric.xlsx",
    );

  const dlAccessory = () =>
    buildExcel(
      fd5,
      [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Supplier", key: "supplier", width: 60 },
        { header: "Doc No", key: "docNo", width: 24 },
        { header: "Doc Date", key: "docDate", width: 16 },
        { header: "Order No", key: "orderNo", width: 28 },
        { header: "Accessory Group", key: "accessGroupName", width: 32 },
        { header: "Accessory Item Group", key: "accessItemName", width: 40 },
        { header: "Accessory Item Name", key: "accessItemDesc", width: 72 },
        { header: "Size", key: "accessSize", width: 20 },
        { header: "Qty", key: "qty", width: 14 },
        { header: "UOM", key: "uom", width: 14 },
        { header: "Rate", key: "rate", width: 18 },
        { header: "Amount", key: "amount", width: 20 },
      ],
      (r, i) => ({
        sno: i + 1,
        supplier: r.supplier,
        docNo: r.docId,
        docDate: fmtDate(r.docDate),
        orderNo: r.orderNo,
        accessGroupName: r.accessGroupName,
        accessItemName: r.accessItemName,
        accessItemDesc: r.accessItemDesc,
        accessSize: r.accessSize,
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.price || 0),
        amount: Number(r.amount || 0),
      }),
      "Top_Ten_Supplier_Accessory.xlsx",
    );

  const downloadSelected =
    localPoType === "General"
      ? dlGeneral
      : selectedOrderType === "GREY YARN"
        ? dlGreyYarn
        : selectedOrderType === "DYED YARN"
          ? dlDyedYarn
          : selectedOrderType === "GREY FABRIC"
            ? dlGreyFabric
            : selectedOrderType === "DYED FABRIC"
              ? dlDyedFabric
              : selectedOrderType === "ACCESSORY"
                ? dlAccessory
                : null;

  // ── shared th style ───────────────────────────────────────────────────────────
  const TH = ({ children, cls = "" }) => (
    <th className={`border p-1 text-center ${cls}`}>{children}</th>
  );

  // ── render ────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1470px] h-[630px] p-4 rounded-xl relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase">
            Top Ten Supplier –{" "}
            <span className="text-blue-600">{selectedCompCode || ""}</span>
          </h2>

          <div className="flex gap-2 items-center">
            <div className="bg-gray-300 rounded-lg shadow-2xl flex gap-x-2 gap-1 p-2 flex-wrap">
              {/* PO Type buttons */}
              {["General", "Order"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setLocalPoType(t);
                    resetAllPages();
                  }}
                  className={`px-3 py-0.5 text-[11px] font-semibold rounded-full shadow-md transition-all
                    ${localPoType === t ? "bg-blue-600 text-white scale-105" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
                    focus:outline-none focus:ring-2 focus:ring-blue-400`}
                >
                  {t}
                </button>
              ))}

              {/* Year */}
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setSelectedSupplier("");
                  resetAllPages();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-24"
              >
                <option value="" disabled>
                  Select Year
                </option>
                {(finYr?.data || []).map((item) => (
                  <option key={item.finYear} value={item.finYear}>
                    {item.finYear}
                  </option>
                ))}
              </select>

              {/* Company */}
              <select
                value={selectedCompCode || ""}
                onChange={(e) => {
                  setSelectedCompCode(e.target.value);
                  setSelectedSupplier("");
                  resetAllPages();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-24"
              >
                <option value="">Select Company</option>
                {companyList?.data?.map((item) => (
                  <option key={item.COMPCODE} value={item.COMPCODE}>
                    {item.COMPCODE}
                  </option>
                ))}
              </select>

              {/* Supplier */}
              <select
                value={selectedSupplier}
                onChange={(e) => {
                  setSelectedSupplier(e.target.value);
                  resetAllPages();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-72"
              >
                <option value="">Select Supplier</option>
                {localSupplierOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              {/* Order Type dropdown — only when Order */}
              {localPoType === "Order" && (
                <select
                  value={selectedOrderType}
                  onChange={(e) => {
                    setSelectedOrderType(e.target.value);
                    resetAllPages();
                  }}
                  className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-32"
                >
                  {ORDER_TYPES.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button className="text-red-600" onClick={closeTable}>
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* TOTAL */}
        <p className="text-xs font-semibold text-gray-600">
          Total Amount: {INR(displayTotal)}
        </p>

        {/* SEARCH + RANGE + EXCEL */}
        <div className="flex justify-between items-start mt-2">
          {localPoType === "General" ? (
            <SearchBar
              keys={["docId", "itemGroup", "itemName", "supplier"]}
              state={search}
              setState={setSearch}
            />
          ) : selectedOrderType === "GREY YARN" ? (
            <SearchBar
              keys={["docId", "yarnName", "orderNo", "supplier", "color"]}
              state={greyYarnSearch}
              setState={setGreyYarnSearch}
            />
          ) : selectedOrderType === "DYED YARN" ? (
            <SearchBar
              keys={["docId", "yarnName", "orderNo", "supplier", "color"]}
              state={dyedYarnSearch}
              setState={setDyedYarnSearch}
            />
          ) : selectedOrderType === "GREY FABRIC" ? (
            <SearchBar
              keys={["docId", "fabricName", "orderNo", "supplier", "color"]}
              state={greyFabricSearch}
              setState={setGreyFabricSearch}
            />
          ) : selectedOrderType === "DYED FABRIC" ? (
            <SearchBar
              keys={["docId", "fabricName", "orderNo", "supplier", "color"]}
              state={dyedFabricSearch}
              setState={setDyedFabricSearch}
            />
          ) : selectedOrderType === "ACCESSORY" ? (
            <SearchBar
              keys={[
                "docId",
                "orderNo",
                "supplier",
                "accessItemName",
                "accessSize",
              ]}
              state={accessorySearch}
              setState={setAccessorySearch}
            />
          ) : null}

          <div className="flex gap-x-2 items-center">
            {localPoType === "General" && (
              <RangeFilter range={range0} setRange={setRange0} />
            )}
            {localPoType === "Order" && selectedOrderType === "GREY YARN" && (
              <RangeFilter range={range1} setRange={setRange1} />
            )}
            {localPoType === "Order" && selectedOrderType === "DYED YARN" && (
              <RangeFilter range={range2} setRange={setRange2} />
            )}
            {localPoType === "Order" && selectedOrderType === "GREY FABRIC" && (
              <RangeFilter range={range3} setRange={setRange3} />
            )}
            {localPoType === "Order" && selectedOrderType === "DYED FABRIC" && (
              <RangeFilter range={range4} setRange={setRange4} />
            )}
            {localPoType === "Order" && selectedOrderType === "ACCESSORY" && (
              <RangeFilter range={range5} setRange={setRange5} />
            )}

            <button
              onClick={downloadSelected}
              disabled={!downloadSelected}
              className="p-0 rounded-full shadow-md hover:brightness-110 transition-all duration-300"
              title="Download Excel"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
                alt="Excel"
                className="w-7 h-7 rounded-lg"
              />
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="grid gap-4">
          <div
            className="overflow-x-auto h-[430px]"
            style={{ border: "1px solid gray", borderRadius: "16px" }}
          >
            {/* ── GENERAL ── */}
            {localPoType === "General" && (
              <table className="w-full border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0">
                  <tr>
                    <TH cls="w-4">S.No</TH>
                    <TH cls="w-36">Supplier</TH>
                    <TH cls="w-16">Doc No</TH>
                    <TH cls="w-[38px]">Doc Date</TH>
                    <TH cls="w-12">Item Group</TH>
                    <TH cls="w-52">Item Name</TH>
                    <TH cls="w-8">Qty</TH>
                    <TH cls="w-8">UOM</TH>
                    <TH cls="w-12">Rate</TH>
                    <TH cls="w-12">Amount</TH>
                  </tr>
                </thead>
                <tbody>
                  {l0 || f0 ? (
                    <LoadingRow cols={10} />
                  ) : cr0.length === 0 ? (
                    <EmptyRow cols={10} />
                  ) : (
                    cr0.map((row, i) => (
                      <tr
                        key={i}
                        className="text-gray-800 bg-white even:bg-gray-100"
                      >
                        <td className="border p-1 text-center">
                          {(page0 - 1) * RECORDS + i + 1}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.itemGroup}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.item}
                        </td>
                        <td className="border p-1 pr-2 text-right">
                          {formatQtyByUOM(row.qty, row.uom)}
                        </td>
                        <td className="border p-1 pl-2 text-left">{row.uom}</td>
                        <td className="border p-1 pr-2 text-right">
                          {INR(row.rate)}
                        </td>
                        <td className="border p-1 pr-2 text-right text-sky-700">
                          {INR(row.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* ── GREY YARN ── */}
            {localPoType === "Order" && selectedOrderType === "GREY YARN" && (
              <table className="w-[1620px] border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0">
                  <tr>
                    <TH cls="w-4">S.No</TH>
                    <TH cls="w-36">Supplier</TH>
                    <TH cls="w-20">Doc No</TH>
                    <TH cls="w-[48px]">Doc Date</TH>
                    <TH cls="w-72">Yarn</TH>
                    <TH cls="w-20">Order No</TH>
                    <TH cls="w-20">Color</TH>
                    <TH cls="w-8">Qty</TH>
                    <TH cls="w-8">UOM</TH>
                    <TH cls="w-12">Rate</TH>
                    <TH cls="w-12">Amount</TH>
                  </tr>
                </thead>
                <tbody>
                  {l1 || f1 ? (
                    <LoadingRow cols={11} />
                  ) : cr1.length === 0 ? (
                    <EmptyRow cols={11} />
                  ) : (
                    cr1.map((row, i) => (
                      <tr
                        key={i}
                        className="text-gray-800 bg-white even:bg-gray-100"
                      >
                        <td className="border p-1 text-center">
                          {(page1 - 1) * RECORDS + i + 1}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.yarnName}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.orderNo}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.color}
                        </td>
                        <td className="border p-1 pr-2 text-right">
                          {formatQtyByUOM(row.qty, row.uom)}
                        </td>
                        <td className="border p-1 pl-2 text-left">{row.uom}</td>
                        <td className="border p-1 pr-2 text-right">
                          {INR(row.price)}
                        </td>
                        <td className="border p-1 pr-2 text-right text-sky-700">
                          {INR(row.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* ── DYED YARN ── */}
            {localPoType === "Order" && selectedOrderType === "DYED YARN" && (
              <table className="w-[1620px] border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0">
                  <tr>
                    <TH cls="w-4">S.No</TH>
                    <TH cls="w-36">Supplier</TH>
                    <TH cls="w-20">Doc No</TH>
                    <TH cls="w-[48px]">Doc Date</TH>
                    <TH cls="w-72">Yarn</TH>
                    <TH cls="w-20">Order No</TH>
                    <TH cls="w-20">Color</TH>
                    <TH cls="w-8">Qty</TH>
                    <TH cls="w-8">UOM</TH>
                    <TH cls="w-12">Rate</TH>
                    <TH cls="w-12">Amount</TH>
                  </tr>
                </thead>
                <tbody>
                  {l2 || f2 ? (
                    <LoadingRow cols={11} />
                  ) : cr2.length === 0 ? (
                    <EmptyRow cols={11} />
                  ) : (
                    cr2.map((row, i) => (
                      <tr
                        key={i}
                        className="text-gray-800 bg-white even:bg-gray-100"
                      >
                        <td className="border p-1 text-center">
                          {(page2 - 1) * RECORDS + i + 1}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.yarnName}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.orderNo}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.color}
                        </td>
                        <td className="border p-1 pr-2 text-right">
                          {formatQtyByUOM(row.qty, row.uom)}
                        </td>
                        <td className="border p-1 pl-2 text-left">{row.uom}</td>
                        <td className="border p-1 pr-2 text-right">
                          {INR(row.price)}
                        </td>
                        <td className="border p-1 pr-2 text-right text-sky-700">
                          {INR(row.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* ── GREY FABRIC ── */}
            {localPoType === "Order" && selectedOrderType === "GREY FABRIC" && (
              <table className="w-[1700px] border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0">
                  <tr>
                    <TH cls="w-4">S.No</TH>
                    <TH cls="w-36">Supplier</TH>
                    <TH cls="w-24">Doc No</TH>
                    <TH cls="w-16">Doc Date</TH>
                    <TH cls="w-80">Fabric Name</TH>
                    <TH cls="w-24">Order No</TH>
                    <TH cls="w-20">Color</TH>
                    <TH cls="w-20">Design</TH>
                    <TH cls="w-12">GSM</TH>
                    <TH cls="w-12">Qty</TH>
                    <TH cls="w-8">UOM</TH>
                    <TH cls="w-12">Rate</TH>
                    <TH cls="w-16">Amount</TH>
                  </tr>
                </thead>
                <tbody>
                  {l3 || f3 ? (
                    <LoadingRow cols={13} />
                  ) : cr3.length === 0 ? (
                    <EmptyRow cols={13} />
                  ) : (
                    cr3.map((row, i) => (
                      <tr
                        key={i}
                        className="text-gray-800 bg-white even:bg-gray-100"
                      >
                        <td className="border p-1 text-center">
                          {(page3 - 1) * RECORDS + i + 1}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.fabricName}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.orderNo}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.color}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.design}
                        </td>
                        <td className="border p-1 pr-2 text-right">
                          {!isNaN(Number(row.gsm))
                            ? Number(row.gsm).toFixed(3)
                            : "N/A"}
                        </td>
                        <td className="border p-1 pr-2 text-right">
                          {formatQtyByUOM(row.qty, row.uom)}
                        </td>
                        <td className="border p-1 pl-2 text-left">{row.uom}</td>
                        <td className="border p-1 pr-2 text-right">
                          {INR(row.price)}
                        </td>
                        <td className="border p-1 pr-2 text-right text-sky-700">
                          {INR(row.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* ── DYED FABRIC ── */}
            {localPoType === "Order" && selectedOrderType === "DYED FABRIC" && (
              <table className="w-[1700px] border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0">
                  <tr>
                    <TH cls="w-4">S.No</TH>
                    <TH cls="w-36">Supplier</TH>
                    <TH cls="w-24">Doc No</TH>
                    <TH cls="w-16">Doc Date</TH>
                    <TH cls="w-80">Fabric Name</TH>
                    <TH cls="w-24">Order No</TH>
                    <TH cls="w-20">Color</TH>
                    <TH cls="w-20">Design</TH>
                    <TH cls="w-12">GSM</TH>
                    <TH cls="w-12">Qty</TH>
                    <TH cls="w-8">UOM</TH>
                    <TH cls="w-12">Rate</TH>
                    <TH cls="w-16">Amount</TH>
                  </tr>
                </thead>
                <tbody>
                  {l4 || f4 ? (
                    <LoadingRow cols={13} />
                  ) : cr4.length === 0 ? (
                    <EmptyRow cols={13} />
                  ) : (
                    cr4.map((row, i) => (
                      <tr
                        key={i}
                        className="text-gray-800 bg-white even:bg-gray-100"
                      >
                        <td className="border p-1 text-center">
                          {(page4 - 1) * RECORDS + i + 1}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.fabricName}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.orderNo}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.color}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.design}
                        </td>
                        <td className="border p-1 pr-2 text-right">
                          {!isNaN(Number(row.gsm))
                            ? Number(row.gsm).toFixed(3)
                            : "N/A"}
                        </td>
                        <td className="border p-1 pr-2 text-right">
                          {formatQtyByUOM(row.qty, row.uom)}
                        </td>
                        <td className="border p-1 pl-2 text-left">{row.uom}</td>
                        <td className="border p-1 pr-2 text-right">
                          {INR(row.price)}
                        </td>
                        <td className="border p-1 pr-2 text-right text-sky-700">
                          {INR(row.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* ── ACCESSORY ── */}
            {localPoType === "Order" && selectedOrderType === "ACCESSORY" && (
              <table className="w-[1970px] border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0">
                  <tr>
                    <TH cls="w-8">S.No</TH>
                    <TH cls="w-64">Supplier</TH>
                    <TH cls="w-[110px]">Doc No</TH>
                    <TH cls="w-16">Doc Date</TH>
                    <TH cls="w-28">Order No</TH>
                    <TH cls="w-32">Acc. Group</TH>
                    <TH cls="w-40">Acc. Item Group</TH>
                    <TH cls="w-72">Acc. Item Name</TH>
                    <TH cls="w-20">Size</TH>
                    <TH cls="w-12">Qty</TH>
                    <TH cls="w-12">UOM</TH>
                    <TH cls="w-12">Rate</TH>
                    <TH cls="w-16">Amount</TH>
                  </tr>
                </thead>
                <tbody>
                  {l5 || f5 ? (
                    <LoadingRow cols={13} />
                  ) : cr5.length === 0 ? (
                    <EmptyRow cols={13} />
                  ) : (
                    cr5.map((row, i) => (
                      <tr
                        key={i}
                        className="text-gray-800 bg-white even:bg-gray-100"
                      >
                        <td className="border p-1 text-center">
                          {(page5 - 1) * RECORDS + i + 1}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.orderNo}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.accessGroupName}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.accessItemName}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.accessItemDesc}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.accessSize}
                        </td>
                        <td className="border p-1 pr-2 text-right">
                          {formatQtyByUOM(row.qty, row.uom)}
                        </td>
                        <td className="border p-1 pl-2 text-left">{row.uom}</td>
                        <td className="border p-1 pr-2 text-right">
                          {INR(row.price)}
                        </td>
                        <td className="border p-1 pr-2 text-right text-sky-700">
                          {INR(row.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* PAGINATION */}
        {localPoType === "General" && (
          <Pagination page={page0} total={tp0} setPage={setPage0} />
        )}
        {localPoType === "Order" && selectedOrderType === "GREY YARN" && (
          <Pagination page={page1} total={tp1} setPage={setPage1} />
        )}
        {localPoType === "Order" && selectedOrderType === "DYED YARN" && (
          <Pagination page={page2} total={tp2} setPage={setPage2} />
        )}
        {localPoType === "Order" && selectedOrderType === "GREY FABRIC" && (
          <Pagination page={page3} total={tp3} setPage={setPage3} />
        )}
        {localPoType === "Order" && selectedOrderType === "DYED FABRIC" && (
          <Pagination page={page4} total={tp4} setPage={setPage4} />
        )}
        {localPoType === "Order" && selectedOrderType === "ACCESSORY" && (
          <Pagination page={page5} total={tp5} setPage={setPage5} />
        )}
      </div>
    </div>
  );
};

export default TopTenSupplierGeneral;





//  top ten supplier general table 


import { useState, useMemo, useEffect } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaStepBackward,
  FaStepForward,
  FaSearch,
} from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";
import { useGetTopTenSupplierGeneralTableQuery,  useGetTopTenSupplierGreyYarnTableQuery,
  useGetTopTenSupplierDyedYarnTableQuery,
  useGetTopTenSupplierGreyFabricTableQuery,
  useGetTopTenSupplierDyedFabricTableQuery,
  useGetTopTenSupplierAccessoryTableQuery } from "../../../../redux/service/purchaseServiceTable";
import {
  useGetTopTenSupplierCombinedQuery,
  useGetTopTenSupplierPurchaseGeneralQuery,
} from "../../../../redux/service/purchaseService";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  addInsightsRowTurnOver,
  formatQtyByUOM,
  getExcelQtyFormatByUOM,
} from "../../../../utils/hleper";
import SpinLoader from "../../../../utils/spinLoader";
import moment from "moment";
const TopTenSupplierGeneral = ({
  year,
  company,
  poType,
  selectedCompCode,
  setSelectedCompCode,
  companyList,

  supplier,
  finYr,
  closeTable,
  setSelectedYear,
  selectedYear,
  supplierOptions,
}) => {
  const [localPoType, setLocalPoType] = useState(poType || "General");
  const [selectedSupplier, setSelectedSupplier] = useState(supplier || "");
  console.log(
    selectedYear,
    selectedCompCode,
    selectedSupplier,
    supplier,
    "year",
  );
  // Add this inside the component, below your existing state
  const combinedQuery = useGetTopTenSupplierCombinedQuery(
    selectedYear && selectedCompCode
      ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
      : skipToken,
  );
  const generalQuery = useGetTopTenSupplierPurchaseGeneralQuery(
    selectedYear && selectedCompCode
      ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
      : skipToken,
  );

  const { data: supplierResponse } =
    poType === "All" ? combinedQuery : generalQuery;

  // Derive supplierOptions locally — replaces the prop
  const localSupplierOptions = useMemo(() => {
    if (!supplierResponse?.data) return [];
    const sorted = [...supplierResponse.data].sort(
      (a, b) => b.TOTAL_VAL - a.TOTAL_VAL,
    );
    return [...new Set(sorted.map((i) => i.supplierName))];
  }, [supplierResponse]);

  const [netpayRange, setNetpayRange] = useState({
    min: 0,
    max: Infinity,
  });

  const [search, setSearch] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 34;

  // ✅ API CALL INSIDE TABLE
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetTopTenSupplierGeneralTableQuery(
    {
      params: {
        selectedYear,
        companyName: selectedCompCode,
        supplier: selectedSupplier,
      },
    },
    { skip: !selectedYear || !selectedCompCode || !selectedSupplier },
  );

  const rawData = useMemo(() => {
    if (!selectedSupplier) return [];
    return Array.isArray(response?.data) ? response.data : [];
  }, [response?.data, selectedSupplier]);

  console.log(rawData, "rawData");

  // ✅ FILTERING
  const filteredData = useMemo(() => {
    if (!selectedSupplier) return [];
    return rawData.filter((row) => {
      // 🔹 Customer dropdown filter

      // 🔹 Search filter (month search)
      if (search.docId) {
        const rowdocId = row.docId?.toLowerCase() || "";
        if (!rowdocId.includes(search.docId.toLowerCase())) {
          return false;
        }
      }

      if (search.itemGroup) {
        const rowItemGroup = row.itemGroup?.toLowerCase() || "";
        if (!rowItemGroup.includes(search.itemGroup.toLowerCase())) {
          return false;
        }
      }

      if (search.itemName) {
        const rowitemName = row.item?.toLowerCase() || "";
        if (!rowitemName.includes(search.itemName.toLowerCase())) {
          return false;
        }
      }
      if (search.supplier) {
        const rowsupplier = row.supplier?.toLowerCase() || "";
        if (!rowsupplier.includes(search.supplier.toLowerCase())) {
          return false;
        }
      }

      // 🔹 Min / Max Turnover filter
      const value = Number(row.amount || 0);

      if (value < netpayRange.min) return false;
      if (netpayRange.max !== Infinity && value > netpayRange.max) return false;

      return true;
    });
  }, [rawData, search, netpayRange, selectedSupplier]);

  // ✅ TOTAL
  const totalTurnOver = useMemo(
    () => filteredData.reduce((sum, r) => sum + Number(r.amount || 0), 0),
    [filteredData],
  );

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const currentRecords = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  );
  const formateDate = (date) => {
    if (!date) return;

    return moment(date).format("DD-MM-YYYY");
  };
  // ✅ EXCEL EXPORT
  const downloadExcel = async () => {
    if (!filteredData.length) {
      alert("No data");
      return;
    }

    const totalRate = filteredData.reduce(
      (sum, r) => sum + Number(r.rate || 0),
      0,
    );
    const totalAmount = filteredData.reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0,
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Top Ten Supplier Report");

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 8 },
        { header: "Supplier", key: "supplier", width: 60 },
      { header: "Doc No", key: "docNo", width: 24 },
      { header: "Doc Date", key: "docDate", width: 16 },
      { header: "Item Group", key: "itemGroup", width: 20 },
      { header: "Item Name", key: "item", width: 80 },

      { header: "Qty", key: "qty", width: 14 },
      { header: "UOM", key: "uom", width: 14 },
      { header: "Rate", key: "rate", width: 18 },
      { header: "Amount", key: "amount", width: 20 },
    ];

    // Title
    worksheet.insertRow(1, ["Top Ten Supplier Report"]);
    worksheet.mergeCells("A1:J1");
    const titleCell = worksheet.getCell("A1");
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(1).height = 30;

    // Insights row
    addInsightsRowTurnOver({
      worksheet,
      startRow: 2,
      totalColumns: 3,
      selectedYear,

      localCompany:selectedCompCode,
      dynamicField: "Supplier",
      dynamicValue: selectedSupplier,
      secondDynamicField:"Po Type",
      seconddynamicValue:poType
    });

    // Header formatting
    const headerRow = worksheet.getRow(3);
    headerRow.height = 26;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Add data rows
    filteredData.forEach((r, index) => {
      const row = worksheet.addRow({
        sno: index + 1,
        supplier: r.supplier,
        docNo: r.docId,
        docDate: formateDate(r.docDate),
        itemGroup: r.itemGroup,
        item: r.item,

        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.rate || 0),
        amount: Number(r.amount || 0),
      });
      row.getCell("qty").numFmt = getExcelQtyFormatByUOM(r.uom);
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 3) return;
      row.height = 22;
      [
        "sno",
        "supplier",
        "docNo",
        "docDate",
        "itemGroup",
        "item",

        "qty",
        "uom",
        "rate",
        "amount",
      ].forEach((key, i) => {
        const cell = row.getCell(i + 1);
        if (["qty", "rate", "amount"].includes(key)) {
          cell.alignment = {
            horizontal: "right",
            vertical: "middle",
            indent: 1,
          };
        } else {
          cell.alignment = {
            horizontal: "left",
            vertical: "middle",
            indent: 1,
          };
        }
      });
    });

    // Total row
    const totalRow = worksheet.addRow({
      sno: "",
      docNo: "",
      docDate: "",
      itemGroup: "",
      item: "",
      supplier: "",
      qty: "",
      uom: "Total",
      rate: totalRate,
      amount: totalAmount,
    });

    totalRow.height = 24;
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 9 || colNumber === 10 ? "right" : "center",
      };
    });

    worksheet.getColumn("docDate").numFmt = "dd-mm-yyyy";
    worksheet.getColumn("rate").numFmt = "₹ #,##,##0.00";
    worksheet.getColumn("amount").numFmt = "₹ #,##,##0.00";

    // Freeze headers
    worksheet.views = [{ state: "frozen", ySplit: 3 }];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Top Ten Supplier Report.xlsx",
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1470px] h-[630px] p-4 rounded-xl relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase">
            Top Ten Supplier -{" "}
            <span className="text-blue-600 ">{selectedCompCode || ""}</span>
          </h2>

          <div className="flex gap-2 items-center">
            <div className="bg-gray-300  rounded-lg shadow-2xl flex gap-x-4 gap-1 p-2">
              <button
                onClick={() => setLocalPoType("General")}
                className={`w-20 text-center flex items-center justify-center gap-2 px-3 py-0.5 text-[11px] font-semibold rounded-full shadow-md transition-all
                  ${
                    localPoType === "General"
                      ? "bg-blue-600 text-white scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-400`}
              >
                General
              </button>

              <button
                onClick={() => setLocalPoType("Order")}
                className={`w-16 text-center flex items-center justify-center gap-2 px-3 py-0.5 text-[11px] font-semibold rounded-full shadow-md transition-all
                  ${
                    localPoType === "Order"
                      ? "bg-blue-600 text-white scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-400`}
              >
                Order
              </button>
              <div className="w-24">
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    if (selectedSupplier) {
                      setSelectedSupplier("");
                    }
                    setCurrentPage(1);
                  }}
                  className="w-full px-2 py-1 text-xs border-2   rounded-md
      border-blue-600 transition-all duration-200"
                >
                  <option value="" disabled>
                    Select Year
                  </option>

                  {(finYr?.data || []).map((item) => (
                    <option key={item.finYear} value={item.finYear}>
                      {item.finYear}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-24">
                <select
                  value={selectedCompCode || "ALL"}
                  onChange={(e) => {
                    setSelectedCompCode(e.target.value);
                    if (selectedSupplier) {
                      setSelectedSupplier("");
                    }
                    setCurrentPage(1);
                  }}
                  className="w-full px-2 py-1 text-xs border-2   rounded-md
      border-blue-600 transition-all duration-200"
                >
                  <option value="">Select Company</option>
                  {companyList?.data?.map((item) => (
                    <option key={item.COMPCODE} value={item.COMPCODE}>
                      {item.COMPCODE}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-96">
                <select
                  value={selectedSupplier}
                  onChange={(e) => {
                    setSelectedSupplier(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2 py-1 text-xs border-2   rounded-md
      border-blue-600 transition-all duration-200"
                >
                  <option>Select Supplier</option>
                  {localSupplierOptions?.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button className="text-red-600" onClick={closeTable}>
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* TOTAL */}
        <p className="text-xs font-semibold  text-gray-600">
          Total Amount :{" "}
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(totalTurnOver)}
        </p>

        {/* SEARCH */}

        <div className="flex justify-between items-start mt-2">
          <div className="flex gap-x-4 mb-3">
            {["docId", "itemGroup", "itemName", "supplier"].map((key) => (
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
          <div className=" flex gap-x-2">
            <div className="flex items-center text-[12px]">
              <span className="text-gray-500">Min Amount : </span>
              <input
                type="text"
                value={netpayRange.min}
                onChange={(e) =>
                  setNetpayRange({
                    ...netpayRange,
                    min: Number(e.target.value),
                  })
                }
                className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center  text-[12px]">
              <span className="text-gray-500">Max Amount : </span>
              <input
                type="text"
                value={netpayRange.max === Infinity ? "" : netpayRange.max}
                onChange={(e) => {
                  const val = e.target.value;

                  setNetpayRange({
                    ...netpayRange,
                    max: val === "" ? Infinity : Number(val),
                  });
                }}
                className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
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
        {/* TABLE */}
        <div className="grid  gap-4">
          <div
            className="overflow-x-auto h-[470px] "
            style={{ border: "1px solid gray", borderRadius: "16px" }}
          >
            <table className="w-full border-collapse text-[11px] table-fixed">
              <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                <tr>
                  <th className="border p-1 text-center w-4">S.No</th>
                  {/* <th className="border p-1 text-center w-8">Year</th> */}
                  <th className="border p-1 text-center w-36">Supplier</th>
                  <th className="border p-1 text-center w-16">Doc No</th>
                  <th className="border p-1 text-center w-[38px]">Doc Date</th>
                  <th className="border p-1 text-center w-12">Item Group</th>
                  <th className="border p-1 text-center w-52">Item Name</th>

                  <th className="border p-1 text-center w-8">Qty</th>
                  <th className="border p-1 text-center w-8">UOM</th>
                  <th className="border p-1 text-center w-8">Rate</th>
                  <th className="border p-1 text-center w-12">Amount</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={10} className=" text-center">
                      <div className="flex justify-center items-center pointer-events-none">
                        <SpinLoader />
                      </div>
                    </td>
                  </tr>
                ) : currentRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center py-6 text-gray-500 border-b-0"
                    >
                      No data found
                    </td>
                  </tr>
                ) : (
                  currentRecords?.map((row, index) => {
                    const globalIndex = index; // 0–16
                    const serialNo =
                      (currentPage - 1) * recordsPerPage + globalIndex + 1;

                    return (
                      <tr
                        key={index}
                        className="text-gray-800 bg-white even:bg-gray-100"
                      >
                        <td className="border p-1 text-center">{serialNo}</td>
                        {/* <td className="border p-1 pl-2 text-left">
                          {row.finYear}
                        </td> */}
                        <td className="border p-1 pr-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>

                        <td className="border p-1 pl-2 text-left ">
                          {formateDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left ">
                          {row.itemGroup}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.item}
                        </td>

                        <td className="border p-1 pr-2 text-right">
                          {" "}
                          {formatQtyByUOM(row.qty, row.uom)}
                        </td>
                        <td className="border p-1 pl-2 text-left">{row.uom}</td>

                        {/* <td className="border p-1 pr-2 text-right">{row.rate}</td> */}

                        <td className="border p-1 pr-2 text-right  ">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(row.rate)}
                        </td>
                        <td className="border p-1 pr-2 text-right text-sky-700 ">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(row.amount)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div>
          <div
            className="flex justify-end items-center mt-4 space-x-2 text-[11px] "
            style={{ position: "absolute", bottom: "5px", right: "0px" }}
          >
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

            <span className="text-xs font-semibold px-3">
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
        </div>
      </div>
    </div>
  );
};

export default TopTenSupplierGeneral;


// top ten supplier chart

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, useTheme } from "@mui/material";
import ReactECharts from "echarts-for-react";
import {
  useGetTopTenSupplierQuery,
  useGetTopTenSupplierPurchaseGeneralQuery,
  useGetTopTenSupplierCombinedQuery,
} from "../../../redux/service/purchaseService";
import { skipToken } from "@reduxjs/toolkit/query";
import TopTenSupplierGeneral from "./TableData/TopTenSupplierGeneral";

const TopTenSupplierYear = ({
  companyName,
  finYear,
  poType,
  companyList,
  finYr,
}) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
    const [tableParams, setTableParams] = useState(null);

  const [showYearTable, setShowYearTable] = useState(false);
  const [selectedYear, setSelectedYear] = useState(finYear || "");
  const [selectedCompCode, setSelectedCompCode] = useState(companyName || "");

  useEffect(() => {
    setSelectedYear(finYear)
  }, [finYear])
  useEffect(() => {
    setSelectedCompCode(companyName)
  }, [companyName])

  // Select the correct query based on poType
  const combinedQuery = useGetTopTenSupplierCombinedQuery(
    finYear && companyName ? { params: { finYear, companyName } } : skipToken,
  );
  const orderQuery = useGetTopTenSupplierQuery(
    finYear && companyName ? { params: { finYear, companyName } } : skipToken,
  );
  const generalQuery = useGetTopTenSupplierPurchaseGeneralQuery(
    finYear && companyName ? { params: { finYear, companyName } } : skipToken,
  );

  // pick the active response based on poType
  const { data: response, isLoading } =
    poType === "All" ? combinedQuery : generalQuery;

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
const handleChartClick = (params) => {
   if (poType === "All") return
  const { name, compCode, finYear } = params.data;
  setTableParams({
    supplier:name,
    year:finYear,
    company:compCode
  })

  setShowYearTable(true);
};

console.log(tableParams,"tableparams");

  // Process response data
  useEffect(() => {
    if (response?.data) {
      const sorted = [...response.data].sort(
        (a, b) => b.TOTAL_VAL - a.TOTAL_VAL,
      );
      setChartData(
        sorted.map((item) => ({
          name: item.supplierName,
          compCode: item.compCode,
          finYear: item.finYear,
          value: Number(item.TOTAL_VAL),
        })),
      );
    }
  }, [response]);
 const supplierOptions = useMemo(() => {
  if (!chartData.length) return [];
  return [...new Set(chartData.map((i) => i.name))];
}, [chartData, selectedYear, selectedCompCode, poType]);
  const colorArray = useMemo(
    () => [
      "#8A37DE",
      "#005E72",
      "#E5181C",
      "#056028",
      "#1F2937",
      "#F44F5E",
      "#E55A89",
      "#D863B1",
      "#CA6CD8",
      "#B57BED",
    ],
    [],
  );
console.log(supplierOptions,"supplierOptions");

  const option = useMemo(
    () => ({
      backgroundColor: "#FFFFFF",
      tooltip: {
        trigger: "item",
        formatter: ({ name, value, percent }) =>
          `${name}<br/>Purchase: <b>${formatINR(value)}</b><br/>(${percent}%)`,
      },
      legend: { show: false },
      series: [
        {
          name: "Purchase",
          type: "pie",
          radius: ["45%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 2 },
          label: {
            show: true,
            position: "outside",
            formatter: ({ name }) => {
              const maxLineLength = 28;
              const words = name.split(" ");
              let lines = [];
              let currentLine = "";
              words.forEach((word) => {
                if ((currentLine + " " + word).trim().length <= maxLineLength) {
                  currentLine = (currentLine + " " + word).trim();
                } else {
                  if (currentLine) lines.push(currentLine);
                  currentLine = word;
                }
              });
              if (currentLine) lines.push(currentLine);
              return lines.join("\n");
            },
            fontSize: 11,
            fontWeight: "bold",
          },
          labelLine: { show: true, length: 10, length2: 5 },
          data: chartData.map((d, idx) => ({
            ...d,
            itemStyle: { color: colorArray[idx % colorArray.length] },
          })),
        },
      ],
    }),
    [chartData, colorArray],
  );

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={`Top Ten Supplier`}
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: 40, height: 380 }}>
            Loading...
          </div>
        ) : (
          <ReactECharts option={option} style={{ height: 380 }}   onEvents={{ click: handleChartClick }}/>
        )}
        {showYearTable && selectedYear && poType !== "All" && (
          <TopTenSupplierGeneral
            year={tableParams.year}
            company={tableParams.company}
            supplier={tableParams.supplier}
            poType={poType}
            companyList={companyList}

            finYr={finYr}

            closeTable={() => {
              setShowYearTable(false)
              setSelectedCompCode(companyName)
              setSelectedYear(finYear)
              }}

            supplierOptions={supplierOptions}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedCompCode={selectedCompCode}
            setSelectedCompCode={setSelectedCompCode}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TopTenSupplierYear;





///// moth wise 
// import React, { useMemo, useState } from "react";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import highchartsMore from "highcharts/highcharts-more";

// import {
//   Card,
//   CardHeader,
//   CardContent,
//   useTheme,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   Box,
// } from "@mui/material";
// import {
//   useGetMonthPurchaseOrderQuery,
//   useGetMonthGeneralPurchaseQuery,
//   useGetMonthCombinedPurchaseQuery,
// } from "../../../redux/service/purchaseService";
// import YearWiseTable from "./TableData/YearTable";
// import { useEffect } from "react";
// import SpinLoader from "../../../utils/spinLoader";

// const YEAR_COLORS = [
//   "#0088FE",
//   "#00C49F",
//   "#FFBB28",
//   "#FF8042",
//   "#A28DFF",
//   "#FF6699",
//   "#33CC99",
//   "#66B2FF",
// ];
// highchartsMore(Highcharts);

// const MonthChart = ({
//   companyName,
//   finYear,
//   finYr,
//   poType,
//   companyList,
//   setChartToShow,
//   chartToshow,
//   purchaseTypeOptions,
// }) => {
//   const theme = useTheme();
//   const [showYearTable, setShowYearTable] = useState(false);
//   const [selectedYear, setSelectedYear] = useState(null);
//   const [selectedCompCode, setSelectedCompCode] = useState("");
//   const [selectedOrderType, setSelectedOrderType] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState(null);
//   const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);
//   const [selectedMonthColor, setSelectedMonthColor] = useState("#00C49F");
//   console.log(poType, "poType");
//   const formatINR = (value) =>
//     `₹ ${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

//   const formatINRShort = (value) => {
//     const num = Number(value);
//     if (num >= 1e7) return `₹ ${(num / 1e7).toFixed(2)} Cr`;
//     if (num >= 1e5) return `₹ ${(num / 1e5).toFixed(2)} L`;
//     return `₹ ${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   };

//   // API calls
// //   const {
// //     data: monthResponse,
// //     isLoading,
// //     isFetching,
// //   } = useGetMonthPurchaseOrderQuery(
// //     { params: { finYear, companyName } },
// //     { skip: !finYear || !companyName },
// //   );
//   const {
//     data: monthGeneralResponse,
//     isLoading : monthGeneralResponseLoading,
//     isFetching : monthGeneralResponseFetching,
//   } = useGetMonthGeneralPurchaseQuery(
//     { params: { finYear, companyName } },
//     { skip: !finYear || !companyName },
//   );
//   const {
//     data: monthResponse,
//     isLoading,
//     isFetching,
//   } = useGetMonthCombinedPurchaseQuery(
//     { params: { finYear, companyName } },
//     { skip: !finYear || !companyName },
//   );
 
// const {
//   data : useGetMonthPurchaseOrderQuery
// } = useGetMonthPurchaseOrderQuery(
//    { params: { finYear, companyName } },
//     { skip: !finYear || !companyName },
// )

//   console.log(monthResponse, "monthResponse");
  
//   useEffect(() => {
//     setShowYearTable(false);
//     setSelectedYear(null);
//     setSelectedCompCode("");
//   }, [poType]);

// let responseToshow = poType === "All" ? monthResponse?.data : monthGeneralResponse?.data

//   const monthChartData = useMemo(
//     () =>
//       (Array.isArray(responseToshow) ? responseToshow : []).map(
//         (i) => ({
//           month: i.month || i.label,
//           value: Number(i.VAL || i.value),
//           year: i.yearNo,
//         }),
//       ),
//     [responseToshow],
//   );
//   console.log(monthChartData, "monthChartData");

//   const monthCategories = useMemo(
//     () => monthChartData.map((i) => i.month ?? i.label),
//     [monthChartData],
//   );
//   const monthSeriesData = useMemo(
//     () => monthChartData.map((i) => Number(i.value)),
//     [monthChartData],
//   );

//   const selectedMonthData = useMemo(
//     () =>
//       selectedMonthIndex !== null ? monthChartData[selectedMonthIndex] : null,
//     [selectedMonthIndex, monthChartData],
//   );
//   const monthChartOptions = useMemo(
//     () => ({
//       chart: { type: "spline", height: 430, backgroundColor: "transparent" },
//       title: { text: "" },
//       xAxis: {
//         categories: monthCategories,
//         lineColor: "#ddd",
//         tickColor: "#ddd",
//         labels: { style: { fontSize: "12px" } },
//       },
//       yAxis: {
//         title: { text: "" },
//         gridLineDashStyle: "Dash",
//         labels: {
//           formatter() {
//             return formatINR(this.value);
//           },
//           style: { fontSize: "12px" },
//         },
//       },
//       tooltip: {
//         backgroundColor: "#000",
//         style: { color: "#fff" },
//         borderRadius: 8,
//         formatter() {
//           // Use the month and year from the data
//           const data = monthChartData[this.point.index]; // get the raw data
//           return `<b>${data.month}</b><br/>${formatINR(this.y)}`;
//         },
//       },
//       plotOptions: {
//         spline: {
//           lineWidth: 3,
//           marker: { enabled: true, radius: 4 },
//           states: { hover: { lineWidth: 4 } },
//           dataLabels: {
//             enabled: true,
//             formatter() {
//               return formatINR(this.y);
//             },
//             style: { fontSize: "12px", fontWeight: "400", color: "#000" },
//           },
//           point: {
//             events: {
//               click() {
//                 setSelectedMonth(this.category);
//                 setSelectedMonthIndex(this.index);
//                 setSelectedMonthColor(this.color);
//               },
//             },
//           },
//         },
//       },
//       series: [
//         {
//           name: "Purchase",
//           data: monthSeriesData,
//           zoneAxis: "x",
//           zones: [
//             { value: 1, color: "#0088FE" },
//             { value: 2, color: "#00C6FF" },
//             { value: 3, color: "#00C49F" },
//             { value: 4, color: "#FFBB28" },
//             { value: 5, color: "#FF8042" },
//             { value: 6, color: "#A28DFF" },
//             { value: 7, color: "#FF6699" },
//             { value: 8, color: "#33CC99" },
//             { value: 9, color: "#FF6666" },
//             { value: 10, color: "#66B2FF" },
//             { value: 11, color: "#99FF66" },
//             { color: "#FF9933" },
//           ],
//           marker: { enabled: true, radius: 4 },
//         },
//       ],
//       legend: { enabled: false },
//       credits: { enabled: false },
//     }),
//     [monthCategories, monthSeriesData,monthChartData],
//   );

//   const childOptions = selectedMonthData
//     ? {
//         chart: { type: "column", height: 383, backgroundColor: "transparent" },
//         title: { text: "" },
//         xAxis: {
//           categories: [selectedMonth],
//           lineColor: "#ddd",
//           labels: { style: { fontSize: "12px" } },
//         },
//         yAxis: {
//           title: { text: "" },
//           gridLineDashStyle: "Dash",
//           labels: { enabled: false },
//         },
//         tooltip: {
//           backgroundColor: "#000",
//           style: { color: "#fff" },
//           borderRadius: 8,
//           formatter() {
//             return `<b>${this.x}</b><br/>${formatINRShort(this.y)}`;
//           },
//         },
//         plotOptions: {
//           column: {
//             borderRadius: 8,
//             pointWidth: 50,
//             dataLabels: {
//               enabled: true,
//               inside: false,
//               verticalAlign: "bottom",
//               y: -10,
//               style: { color: "#000", fontSize: "12px", fontWeight: "600" },
//               formatter() {
//                 return formatINR(this.y);
//               },
//             },
//           },
//         },
//         series: [
//           {
//             name: "Purchase",
//             data: [Number(selectedMonthData.value)],
//             color: {
//               linearGradient: [0, 0, 0, 300],
//               stops: [
//                 [0, selectedMonthColor],
//                 [1, Highcharts.color(selectedMonthColor).brighten(0.2).get()], // slightly lighter at bottom
//               ],
//             },
//           },
//         ],
//         legend: { enabled: false },
//         credits: { enabled: false },
//       }
//     : null;

//   return (
//     <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
//       <CardHeader
//         title={"Month Wise Purchase"}
//         titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
//         sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
//         action={
//           <RadioGroup
//             row
//             value={chartToshow}
//             onChange={(e) => setChartToShow(e.target.value)}
//             sx={{ gap: 1 }}
//           >
//             {purchaseTypeOptions.map((opt) => (
//               <FormControlLabel
//                 key={opt.value}
//                 value={opt.value}
//                 control={<Radio size="small" />}
//                 label={opt.label}
//                 sx={{ fontSize: "11px" }}
//               />
//             ))}
//           </RadioGroup>
//         }
//       />
//       <CardContent
//         sx={{
//           position: "relative",
//           backgroundColor: "#fff",
//           mt: 1,
//           ml: 1,
//           height: 460,
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {(isLoading || isFetching) && <SpinLoader />}
//         <Box sx={{ display: "flex", width: "100%", overflow: "hidden" }}>
//           <Box sx={{ width: "80%", transition: "width 0.35s ease" }}>
//             <HighchartsReact
//               key="month-chart"
//               highcharts={Highcharts}
//               options={monthChartOptions}
//               immutable
//             />
//           </Box>
//           <Box sx={{ width: "20%", transition: "width 0.35s ease" }}>
//             <Card sx={{ height: "100%", ml: 1 }}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   px: 1,
//                   py: 0.5,
//                   borderBottom: `1px solid ${theme.palette.divider}`,
//                 }}
//               >
//                 <Box sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
//                   {selectedMonth || ""} Purchase Details
//                 </Box>
//               </Box>
//               <CardContent>
//                 {selectedMonth && childOptions ? (
//                   <HighchartsReact
//                     highcharts={Highcharts}
//                     options={childOptions}
//                     immutable
//                   />
//                 ) : (
//                   <Box
//                     sx={{
//                       height: 260,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       color: "text.secondary",
//                       fontSize: "0.85rem",
//                     }}
//                   >
//                     Click a month to view details
//                   </Box>
//                 )}
//               </CardContent>
//             </Card>
//           </Box>
//         </Box>
//         {showYearTable && selectedYear && (
//           <YearWiseTable
//             year={selectedYear}
//             poType={poType}
//             type={selectedOrderType}
//             companyList={companyList}
//             selectedCompCode={selectedCompCode}
//             finYr={finYr}
//             closeTable={() => setShowYearTable(false)}
//           />
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default MonthChart;

// itemname 


// import React, { useMemo, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   CardHeader,
//   Button,
//   useTheme,
// } from "@mui/material";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import { useGetItemGroupWiseQuery } from "../../../redux/service/purchaseService";

// const ItemGroupWiseReport = ({ companyName, finYear }) => {
//   const theme = useTheme();
//   const { data: response, isLoading } = useGetItemGroupWiseQuery({
//     params: { finYear, companyName },
//   });

//   const [selectedGroup, setSelectedGroup] = useState(null); // null = show parent

//   const formatINR = (value) =>
//     `₹ ${Number(value).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })}`;

//   // Aggregate data by ItemGroup
//   const groupMap = useMemo(() => {
//     if (!Array.isArray(response?.data)) return {};
//     const map = {};
//     response.data.forEach((item) => {
//       if (!map[item.ItemGroup]) map[item.ItemGroup] = [];
//       map[item.ItemGroup].push(item);
//     });
//     return map;
//   }, [response]);

//   // Parent chart options
//   const parentOptions = useMemo(() => {
//     const seriesData = Object.entries(groupMap).map(([groupName, items]) => ({
//       name: groupName,
//       y: items.reduce((acc, i) => acc + i.value, 0),
//     }));

//     return {
//       chart: { type: "column", backgroundColor: "transparent", height: 450 },
//       title: { text: "" },
//       xAxis: { type: "category", labels: { style: { fontSize: "12px" } } },
//       yAxis: { title: { text: "Total Value" } },
//       tooltip: {
//         formatter() {
//           return `<b>${this.key}</b><br/>${formatINR(this.y)}`;
//         },
//       },
//       plotOptions: {
//         column: {
//           borderRadius: 6,
//           minPointLength: 40,
//           cursor: "pointer",
//           point: {
//             events: {
//               click() {
//                 setSelectedGroup(this.name); // show child chart
//               },
//             },
//           },
//         },
//       },
//       series: [{ name: "Item Groups", colorByPoint: true, data: seriesData }],
//       credits: { enabled: false },
//       legend: { enabled: false },
//     };
//   }, [groupMap]);

//   // Child chart options
//   const childOptions = useMemo(() => {
//     if (!selectedGroup) return {};
//     const items = groupMap[selectedGroup] || [];
//     return {
//       chart: { type: "column", backgroundColor: "transparent", height: 400 },
//       title: { text: `` },
//       xAxis: { type: "category", labels: { style: { fontSize: "12px" } } },
//       yAxis: { title: { text: "Value" } },
//       tooltip: {
//         formatter() {
//           return `<b>${this.key}</b><br/>${formatINR(this.y)}`;
//         },
//       },
//       plotOptions: { column: { borderRadius: 6, minPointLength: 40 } },
//       series: [
//         {
//           name: selectedGroup,
//           colorByPoint: true,
//           data: items.map((i) => ({ name: i.ItemName, y: i.value })),
//         },
//       ],
//       credits: { enabled: false },
//       legend: { enabled: false },
//     };
//   }, [groupMap, selectedGroup]);

//   return (
//     <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
//       <CardHeader
//         title="Item Group Wise Purchase"
//         titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
//         sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
//       />
//       <CardContent sx={{ height: 500 }}>
//         {isLoading ? (
//           <Box sx={{ textAlign: "center", padding: 4 }}>Loading...</Box>
//         ) : (
//           <>
//             {/* Parent chart shown only if no group selected */}
//             {!selectedGroup && (
//               <HighchartsReact
//                 highcharts={Highcharts}
//                 options={parentOptions}
//               />
//             )}

//             {/* Child chart shown only if group selected */}
//             {selectedGroup && (
//               <Box
//                 sx={{
//                   mb: 2,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   gap: 2,
//                 }}
//               >
//                 {/* Selected group name */}
//                 <Box sx={{ fontWeight: 600, fontSize: "1rem" }}>
//                   {selectedGroup}
//                 </Box>

//                 {/* Back button */}
//                 <Button
//                   variant="contained"
//                   size="small"
//                   onClick={() => setSelectedGroup(null)}
//                 >
//                   Back
//                 </Button>
//               </Box>
//             )}
//             {selectedGroup && (
//               <HighchartsReact highcharts={Highcharts} options={childOptions} />
//             )}
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default ItemGroupWiseReport;

//quarter wise 

// import React, { useMemo, useState } from "react";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import highchartsMore from "highcharts/highcharts-more";

// import {
//   Card,
//   CardHeader,
//   CardContent,
//   useTheme,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   Box,
// } from "@mui/material";
// import {
//   useGetQuarterPurchaseOrderQuery,
//   useGetQuarterPurchaseGeneralQuery,
//   useGetQuarterPurchaseCombinedCOMPQuery,
// } from "../../../redux/service/purchaseService";
// import YearWiseTable from "./TableData/YearTable";
// import { useEffect } from "react";
// import SpinLoader from "../../../utils/spinLoader";

// highchartsMore(Highcharts);

// const QuarterWise = ({
//   companyName,
//   finYear,
//   finYr,
//   poType,
//   companyList,
//   setChartToShow,
//   chartToshow,
//   purchaseTypeOptions,
// }) => {
//   const theme = useTheme();
//   const [showYearTable, setShowYearTable] = useState(false);
//   const [selectedYear, setSelectedYear] = useState(null);
//   const [selectedCompCode, setSelectedCompCode] = useState("");
//   const [selectedOrderType, setSelectedOrderType] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState(null);
//   const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);
//   const [selectedMonthColor, setSelectedMonthColor] = useState("#00C49F");
//   const [selectedType, setSelectedType] = useState("");

//   console.log(poType, "poType");
//   const formatINR = (value) =>
//     `₹ ${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

//   const formatINRShort = (value) => {
//     const num = Number(value);
//     if (num >= 1e7) return `₹ ${(num / 1e7).toFixed(2)} Cr`;
//     if (num >= 1e5) return `₹ ${(num / 1e5).toFixed(2)} L`;
//     return `₹ ${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   };

//   const {
//     data: quarterResponse,
//     isLoading,
//     isFetching,
//   } = useGetQuarterPurchaseCombinedCOMPQuery(
//     { params: { finYear, companyName } },
//     { skip: !finYear || !companyName },
//   );

//   const { data: quarterOrderRespone } = useGetQuarterPurchaseOrderQuery(
//     { params: { finYear, companyName } },
//     { skip: !finYear || !companyName },
//   );
// const {
//     data: quarterGeneralResponse,

//   } = useGetQuarterPurchaseGeneralQuery(
//     { params: { finYear, companyName } },
//     { skip: !finYear || !companyName },
//   );
//   console.log(quarterResponse, "quarterResponse");

//   useEffect(() => {
//     setShowYearTable(false);
//     setSelectedYear(null);
//     setSelectedCompCode("");
//   }, [poType]);

//   let responseToshow =
//     poType === "All" ? quarterResponse?.data : quarterGeneralResponse?.data;

//   const quarterChartData = useMemo(
//     () =>
//       (Array.isArray(responseToshow) ? responseToshow : []).map((i) => ({
//         quarter: i.quarter || i.label,
//         value: Number(i.VAL || i.value),
//         month: i.month,
//         year: i.yearNo,
//         finYear: i.finyear,
//         company: i.company,
//       })),
//     [responseToshow],
//   );

//   const quarterCategories = useMemo(
//     () => quarterChartData.map((i) => i.quarter ?? i.label),
//     [quarterChartData],
//   );
//   const quarterSeriesData = useMemo(
//     () => quarterChartData.map((i) => Number(i.value)),
//     [quarterChartData],
//   );
//   const QUARTER_COLORS = {
//     Q1: "#0088FE", // Apr-Jun
//     Q2: "#00C49F", // Jul-Sep
//     Q3: "#FFBB28", // Oct-Dec
//     Q4: "#FF8042", // Jan-Mar
//   };

//   const quarterChartOptions = useMemo(
//     () => ({
//       chart: { type: "column", height: 430, backgroundColor: "transparent" },
//       title: { text: "" },
//       xAxis: {
//         categories: quarterCategories,
//         lineColor: "#ddd",
//         tickColor: "#ddd",
//         labels: { style: { fontSize: "12px" } },
//       },
//       yAxis: {
//         title: { text: "" },
//         gridLineDashStyle: "Dash",
//         labels: {
//           formatter() {
//             return formatINRShort(this.value);
//           },
//           style: { fontSize: "12px" },
//         },
//       },
//       tooltip: {
//         backgroundColor: "#000",
//         style: { color: "#fff" },
//         borderRadius: 8,
//         formatter() {
//           return `<b>${this.x}</b><br/>${this.point.month}<br/>${formatINR(this.y)}`;
//         },
//       },
//       plotOptions: {
//         column: {
//           borderRadius: 8,
//           minPointLength: 40,
//           dataLabels: {
//             enabled: true,
//             inside: false, // put label inside the bar
//             rotation: 0, // rotate label -90 degrees
//             align: "center", // horizontal alignment
//             y: -8,
//             verticalAlign: "middle", // vertical alignment
//             style: {
//               fontSize: "13px",
//               fontWeight: "600",
//               color: "black", // white text for inside bars
//             },
//             formatter() {
//               return formatINRShort(this.y);
//             },
//           },
//         },
//       },
//       colors: QUARTER_COLORS,
//       series: [
//         {
//           name: "Purchase",
//           data: quarterChartData.map((i) => ({
//             y: i.value,
//             month: i.month, // 👈 pass month here
//             year: i.year,
//             color: QUARTER_COLORS[i.quarter],
//           })),
//         },
//       ],
//       legend: { enabled: false },
//       credits: { enabled: false },
//     }),
//     [quarterCategories, quarterSeriesData, QUARTER_COLORS],
//   );

//   return (
//     <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
//       <CardHeader
//         title={"Quarter Wise Purchase"}
//         titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
//         sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
//         action={
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             {/* Radio buttons */}
//             <RadioGroup
//               row
//               value={chartToshow}
//               onChange={(e) => setChartToShow(e.target.value)}
//               sx={{ gap: 1 }}
//             >
//               {purchaseTypeOptions.map((opt) => (
//                 <FormControlLabel
//                   key={opt.value}
//                   value={opt.value}
//                   control={<Radio size="small" />}
//                   label={opt.label}
//                   sx={{ fontSize: "11px" }}
//                 />
//               ))}
//             </RadioGroup>

//             {/* Conditional select for PO Type */}
//             {poType === "Order" && (
//               <select
//                 value={selectedType}
//                 onChange={(e) => setSelectedType(e.target.value)}
//                 style={{
//                   fontSize: "11px",
//                   padding: "0px 14px",
//                   borderRadius: "6px",
//                   border: "2px solid #2563eb",
//                   marginTop: "2px",
//                   marginLeft: "-12px",
//                   minWidth: "120px",
//                 }}
//               >
//                 {[
//                   { label: "GREY YARN", value: "GREY YARN" },
//                   { label: "DYED YARN", value: "DYED YARN" },
//                   { label: "GREY FABRIC", value: "GREY FABRIC" },
//                   { label: "DYED FABRIC", value: "DYED FABRIC" },
//                   { label: "ACCESSORY", value: "ACCESSORY" },
//                 ].map((opt) => (
//                   <option key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </Box>
//         }
//       />
//       <CardContent
//         sx={{
//           position: "relative",
//           backgroundColor: "#fff",
//           mt: 1,
//           ml: 1,
//           height: 460,
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {(isLoading || isFetching) && <SpinLoader />}

//         <Box>
//           <HighchartsReact
//             key="quarter-chart"
//             highcharts={Highcharts}
//             options={quarterChartOptions}
//           />
//         </Box>

//         {showYearTable && selectedYear && (
//           <YearWiseTable
//             year={selectedYear}
//             poType={poType}
//             type={selectedOrderType}
//             companyList={companyList}
//             selectedCompCode={selectedCompCode}
//             finYr={finYr}
//             closeTable={() => setShowYearTable(false)}
//           />
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default QuarterWise;
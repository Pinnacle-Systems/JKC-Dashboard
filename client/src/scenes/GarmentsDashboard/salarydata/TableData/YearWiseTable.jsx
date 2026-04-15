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

import { useGetMisDashboardErpYearWiseBreakUpQuery } from
    "../../../../redux/service/misDashboardServiceERP";

import { addInsightsRowTurnOver } from "../../../../utils/hleper";
import SpinLoader from '../../../../utils/spinLoader'
const YearWiseTable = ({
    year,
    finYr,
    closeTable, filterBuyerList
}) => {
    const [selectedYear, setSelectedYear] = useState(year || "ALL");
    const [netpayRange, setNetpayRange] = useState({
        min: 0,
        max: Infinity,
    });
    const { filterBuyer: companyName } =
        useSelector((state) => state.dashboardFilters);
    const [localCompany, setLocalCompany] = useState(companyName || "ALL");

    const [search, setSearch] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 34;

    // ✅ API CALL INSIDE TABLE
    const { data: response, isLoading } =
        useGetMisDashboardErpYearWiseBreakUpQuery(
            {
                params: {
                    companyName: localCompany === "ALL" ? undefined : localCompany,

                },
            },
            { skip: !companyName }
        );

    const rawData = useMemo(() => {
        return Array.isArray(response?.data) ? response.data : [];
    }, [response?.data]);

    console.log(rawData, "rawData");
    const customerOptions = useMemo(() => {
        const unique = [...new Set(rawData.map(r => r.year))];

        return [
            { label: "ALL", value: "ALL" },
            ...unique.map(c => ({ label: c, value: c })),
        ];
    }, [rawData]);


    // ✅ FILTERING
    const filteredData = useMemo(() => {
        return rawData.filter((row) => {
            // 🔹 Customer dropdown filter
            if (selectedYear !== "ALL" && row.year !== selectedYear) {
                return false;
            }

            // 🔹 Search filter (year search)
            if (search.year) {
                const rowCustomer = row.year?.toLowerCase() || "";
                if (!rowCustomer.includes(search.year.toLowerCase())) {
                    return false;
                }
            }
            if (search.orderNo) {
                const rowOrderNo = row.orderNo?.toString().toLowerCase() || "";
                if (!rowOrderNo.includes(search.orderNo.toLowerCase())) {
                    return false;
                }
            }
            // 🔹 Style Ref No search
            if (search.styleRefNo) {
                const rowStyle = row.styleRefNo?.toLowerCase() || "";
                if (!rowStyle.includes(search.styleRefNo.toLowerCase())) {
                    return false;
                }
            }

            // 🔹 Min / Max Turnover filter
            const value = Number(row.value || 0);

            if (value < netpayRange.min) return false;
            if (netpayRange.max !== Infinity && value > netpayRange.max) return false;

            return true;
        });
    }, [rawData, selectedYear, search, netpayRange]);


    useEffect(() => {
        setSelectedYear(year || "ALL");
        setCurrentPage(1);
    }, [year]);
    useEffect(() => {
        setLocalCompany(companyName || "ALL");
    }, [companyName]);


    // ✅ TOTAL
    const totalTurnOver = useMemo(
        () =>
            filteredData.reduce(
                (sum, r) => sum + Number(r.value || 0),
                0
            ),
        [filteredData]
    );

    const totalPages = Math.ceil(filteredData.length / recordsPerPage);
    const currentRecords = filteredData.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    // ✅ EXCEL EXPORT
    const downloadExcel = async () => {
        if (!filteredData.length) {
            alert("No data");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Year Wise Turnover Report");
        worksheet.columns = [
            { header: "Year", key: "year", width: 20 },
            { header: "Order No", key: "orderNo", width: 35 },
            { header: "Order Date", key: "orderDate", width: 25 },
            { header: "style Ref No", key: "styleRefNo", width: 60 },
            { header: "Order Qty", key: "orderQty", width: 20 },
            { header: "UOM", key: "orderUOM", width: 15 },
            { header: "Turnover", key: "value", width: 30 },
        ];

        /* ================= TITLE ================= */
        worksheet.insertRow(1, ["Year Wise Turnover Report"]);
        worksheet.mergeCells("A1:G1");

        const titleCell = worksheet.getCell("A1");
        titleCell.font = { bold: true, size: 14 };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getRow(1).height = 30;

        /* ================= INSIGHTS ================= */
        addInsightsRowTurnOver({
            worksheet,
            startRow: 2,
            totalColumns: 3,
            localCompany,
            dynamicField: "Year",
            dynamicValue: selectedYear,
            disableFinYear: true

        });

        /* ================= COLUMNS ================= */


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

        /* ================= DATA ================= */
        filteredData.forEach((r) => {
            worksheet.addRow({
                year: r.year,
                orderNo: r.orderNo,
                orderDate: r.orderDate?.split("T")[0]?.split("-")?.reverse()?.join("-") || '',
                styleRefNo: r.styleRefNo,
                orderQty: r.orderQty,
                orderUOM: r.orderUOM,
                value: Number(r.value || 0),
            });
        });

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber <= 3) return;

            row.height = 22;
            row.getCell("year").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
            row.getCell("orderNo").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
            row.getCell("orderDate").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
            row.getCell("styleRefNo").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
            row.getCell("orderQty").alignment = { horizontal: "right", vertical: "middle", indent: 1 };
            row.getCell("orderUOM").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
            row.getCell("value").alignment = { horizontal: "right", vertical: "middle", indent: 1 };
        });

        // ================= TOTAL ROW =================
        const totalRow = worksheet.addRow({
            year: "",
            orderNo: "",
            orderDate: "",
            styleRefNo: "",
            orderQty: "",
            orderUOM: "TOTAL",
            value: totalTurnOver,
        });

        totalRow.height = 24;

        // Style TOTAL row
        totalRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true };
            cell.border = {
                top: { style: "thin" },

            };
            cell.alignment = {
                vertical: "middle",
                horizontal: colNumber === 7 ? "right" : "center",
                indent: 1
            };
        });
        worksheet.getColumn("orderDate").numFmt = "dd-mm-yyyy";

        worksheet.getColumn("value").numFmt = '₹ #,##,##0.00';

        /* ================= FREEZE ================= */
        worksheet.views = [{ state: "frozen", ySplit: 3 }];

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(
            new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "Year Wise Turnover Report.xlsx"
        );
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
            <div className="bg-white w-[1300px] h-[630px] p-4 rounded-xl relative">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <h2 className="font-bold uppercase">
                        Year Wise Turnover - <span className="text-blue-600 ">{localCompany || ""}</span>
                    </h2>

                    <div className="flex gap-2 items-center">
                        <div className="bg-gray-300  rounded-lg shadow-2xl flex gap-x-4 gap-1 p-2">

                            <div className="w-24">
                                <select
                                    value={localCompany || "ALL"}
                                    onChange={(e) => {
                                        setLocalCompany(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full px-2 py-1 text-xs border-2   rounded-md 
      border-blue-600 transition-all duration-200"    >

                                    {filterBuyerList?.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.compname}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-24">
                                <select
                                    value={selectedYear}
                                    onChange={(e) => {
                                        setSelectedYear(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full px-2 py-1 text-xs border-2   rounded-md 
      border-blue-600 transition-all duration-200"     >

                                    {customerOptions?.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
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
                    Total Turnover :{" "}
                    {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                    }).format(totalTurnOver)}
                </p>

                {/* SEARCH */}

                <div className="flex justify-between items-start mt-2">
                    <div className="flex gap-x-4 mb-3">
                        {["year", "orderNo", "styleRefNo"].map((key) => (
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
                            <span className="text-gray-500">Min Turnover : </span>
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
                            <span className="text-gray-500">Max Turnover : </span>
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
                    <div className="overflow-x-auto h-[470px] " style={{ border: "1px solid gray", borderRadius: "16px" }}>
                        <table className="w-full border-collapse border border-gray-300 text-[11px] table-fixed">
                            <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                                <tr>
                                    <th className="border p-1 text-center w-6">S.No</th>
                                    <th className="border p-1 text-center w-8">Year</th>
                                    <th className="border p-1 text-center w-24">Order No</th>
                                    <th className="border p-1 text-center w-12">Order Date</th>
                                    <th className="border p-1 text-center w-32">Style Ref No</th>
                                    <th className="border p-1 text-center w-16">Order Qty</th>
                                    <th className="border p-1 text-center w-8">UOM</th>

                                    <th className="border p-1 text-center w-12">Turnover</th>

                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={8} className="h-[300px] text-center">
                                            <div className="flex justify-center items-center">
                                                <SpinLoader />
                                            </div>
                                        </td>
                                    </tr>
                                ) : currentRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-6 text-gray-500">
                                            No data found
                                        </td>
                                    </tr>
                                ) : (
                                    currentRecords?.map((row, index) => {
                                        const globalIndex = index;  // 0–16
                                        const serialNo = (currentPage - 1) * recordsPerPage + globalIndex + 1;
                                        const uomType = row?.orderUOM
                                        let orderQtyValue;
                                        if (uomType == "KGS") {
                                            orderQtyValue = row?.orderQty.tofixed(3)
                                        }
                                        else {
                                            orderQtyValue = row?.orderQty

                                        }




                                        return (
                                            <tr
                                                key={index}
                                                className="text-gray-800 bg-white even:bg-gray-100 "
                                            >
                                                <td className="border p-1 pl-2 text-center">{serialNo}</td>

                                                <td className="border p-1 pl-2 text-left ">{row.year}</td>
                                                <td className="border p-1 pl-2 text-left ">{row.orderNo}</td>
                                                <td className="border p-1 pl-2 text-left ">{row.orderDate?.split("T")[0]?.split("-")?.reverse()?.join("-")}</td>
                                                <td className="border p-1 pl-2 text-left">{row.styleRefNo}</td>
                                                <td className="border p-1 pr-2 text-right">{orderQtyValue}</td>
                                                <td className="border p-1 pl-2 text-leftt">{row.orderUOM}</td>

                                                <td className="border p-1 pr-2 text-right text-sky-700 ">
                                                    {new Intl.NumberFormat("en-IN", {
                                                        style: "currency",
                                                        currency: "INR",
                                                    }).format(row.value)}
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

                </div>
            </div>
        </div>
    );
};

export default YearWiseTable;

import { useEffect, useState } from "react";
import {
    FaTimes,
    FaChevronLeft,
    FaChevronRight,
    FaStepBackward,
    FaStepForward,
    FaSearch,
    FaUsers,
    FaMars,
    FaVenus,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { useGetFabricInwardByCusNameQuery, useGetFabricInwardCustQuery, useGetFabricInwardStateDetailTransQuery, useGetFabricInwardStateDropdownQuery } from "../../../redux/service/freeLookFabric";
import HouseIcon from '@mui/icons-material/House';
import FactoryIcon from '@mui/icons-material/Factory';
import FinYear from "../../../components/FinYear";
import { DropdownNew } from "../../../utils/hleper";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { addInsightsfreelookRow } from "../../../utils/hleper";
import DomainIcon from '@mui/icons-material/Domain';
import Loader from "../../../utils/loader";

const CustomerTransState = ({
    closeTable,
    finYear,
    selectedYear,
    setSelectedYear,
    category,
    setCategory,
    custName,
    setCustName,
    setFYear,
    selectmonths,
    setSelectmonths,
    selectState,
    setSelectState
}) => {
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 40;

    const { data: cusTransData, isFetching: isSingleFetching,
        isLoading: isSingleLoading, } = useGetFabricInwardStateDetailTransQuery({
            params: {
                finyear: selectedYear,
                category: category,
                customer: custName,
                state: selectState
            },
        }, {
            skip: !selectedYear || !category
        });

    const isLoadingIndicator = isSingleFetching || isSingleLoading;

    const { data: custNames } = useGetFabricInwardCustQuery({
        params: {
            category: category
        },
    });

    const cusData = custNames?.data.map((custName) => ({
        custName,
    }));

    const { data: stateNames } = useGetFabricInwardStateDropdownQuery({
        params: {
            category: category
        },
    });

    const stateData = stateNames?.data.map((stateName) => ({
        stateName,
    }));


    useEffect(() => {
        setCurrentPage(1);
    }, [cusTransData, search, selectmonths]);



    const filteredData = Array.isArray(cusTransData?.data)
        ? cusTransData.data.filter((row) => {

            // 🔹 Search filter
            const searchMatch = Object.entries(search).every(([key, value]) => {
                if (!value) return true;
                return row[key]?.toString().toLowerCase().includes(value.toLowerCase());
            });
            if (!searchMatch) return false;

            // 🔹 Month filter
            if (!selectmonths) return true;

            // ✅ Parse DD/MM/YYYY safely
            const [day, month, year] = row.inwDate.split("/").map(Number);
            const invDate = new Date(year, month - 1, day);

            if (isNaN(invDate.getTime())) return false;

            // Selected month/year
            const [monthName, yearStr] = selectmonths.split(" ");
            const selectedYear = parseInt(yearStr);

            const monthMap = {
                January: 0, February: 1, March: 2, April: 3,
                May: 4, June: 5, July: 6, August: 7,
                September: 8, October: 9, November: 10, December: 11
            };

            return (
                invDate.getMonth() === monthMap[monthName] &&
                invDate.getFullYear() === selectedYear
            );
        })
        : [];


    const totalNetPay = filteredData.reduce(
        (sum, row) => sum + (Number(row.PF) || 0),
        0
    );
    const totalQty = filteredData.reduce(
        (sum, row) => sum + (Number(row.qty) || 0),
        0
    );

    const totalPages = Math.ceil(filteredData.length / recordsPerPage);
    const totalRecords = filteredData.length;

    const currentRecords = filteredData.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    const handleFilterClick = (type) => {
        setCategory(type);
        setCustName("")
    };

    const totalInwardCount = new Set(
        filteredData.map(row => row.inwNo)
    ).size;
    const downloadExcel = async () => {
        if (filteredData.length === 0) {
            alert("No data to export!");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Fabric Inward Details");

        // 1️⃣ Define columns
        worksheet.columns = [
            { header: "Inward No", key: "inwNo", width: 25 },
            { header: "Inward Date", key: "inwDate", width: 16 },
            { header: "Order No", key: "orderNo", width: 32 },
            { header: "Customer Name", key: "customerName", width: 48 },
            { header: "Fabric Name", key: "fabName", width: 48 },
            { header: "Dia", key: "dia", width: 12 },
            { header: "Uom", key: "uom", width: 12 },
            { header: "Qty", key: "qty", width: 17 },
        ];

        // 2️⃣ Title Row
        worksheet.insertRow(1, ["Fabric Inward Details Report"]);
        worksheet.mergeCells("A1:H1");

        const titleCell = worksheet.getCell("A1");
        titleCell.font = { bold: true, size: 14 };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getRow(1).height = 30;
        addInsightsfreelookRow({
            worksheet,
            startRow: 2,
            totalColumns: 8,
            category,
            custName,
            selectedYear,
            selectedMonth: selectmonths,
            selectState
        });

        // 3️⃣ Header Styling (Row 2)
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

        // 4️⃣ Data Rows
        filteredData.forEach((row) => {
            worksheet.addRow({
                inwNo: row.inwNo,
                inwDate: row.inwDate,
                orderNo: row.orderNo,
                customerName: row.custName,
                fabName: row.fabName,
                dia: row.dia,
                uom: row.uom,
                qty: row.qty,
            });
        });

        // 5️⃣ Data Alignment
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber <= 3) return;

            row.height = 22;

            row.getCell("inwNo").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
            row.getCell("inwDate").alignment = { horizontal: "center", vertical: "middle" };
            row.getCell("orderNo").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
            row.getCell("fabName").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
            row.getCell("customerName").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
            row.getCell("dia").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
            row.getCell("uom").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
            row.getCell("qty").alignment = { horizontal: "right", vertical: "middle", indent: 1 };
        });
        const totalRow = worksheet.addRow({
            inwNo: "",
            inwDate: "",
            orderNo: "",
            fabName: "",
            customerName: "",
            dia: "",
            uom: "TOTAL",
            qty: totalQty.toLocaleString("en-IN", {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
            }),
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
                horizontal: colNumber === 8 ? "right" : "center",
                indent: 1
            };
        });
        // 6️⃣ Quantity format
        worksheet.getColumn("inwDate").numFmt = "dd-mm-yyyy";

        worksheet.getColumn("qty").numFmt = "#,##0.000";

        // 7️⃣ Freeze Header
        worksheet.views = [{ state: "frozen", ySplit: 3 }];

        // 8️⃣ Export
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "Fabric Inward State Wise Details.xlsx");
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
            <div className="bg-white p-4 rounded-lg shadow-2xl w-[1250px] max-w-[1250px]  h-[590px] max-h-[590px] relative">
                <button
                    onClick={closeTable}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2 rounded-full transition-all"
                >
                    <FaTimes size={20} />
                </button>

                <div className="grid grid-cols-2">
                    <div className="text-start">
                        <h2 className="text-m font-bold text-gray-800 uppercase ">
                            Customer Insights -{" "}
                            <span className="text-blue-600">{custName}</span>
                        </h2>
                        <div className="flex items-start justify-start">
                            {/* Left: Total Records */}
                            {/* <p className="text-[12px] text-gray-500 font-medium">
                                Total Records: {totalRecords}
                            </p> */}
                            <div className="text-right text-[12px]">
                                <p className=" text-gray-500 font-medium">
                                    Total Inward:{" "}
                                    <span className="text-sky-700 pl-1">
                                        {totalInwardCount}
                                    </span>
                                </p>
                            </div>
                            <div className="text-right ml-5 text-[12px]">
                                <p className=" text-gray-500 font-medium">
                                    Total Qty:{" "}
                                    <span className="text-sky-700 pl-1">
                                        {totalQty.toLocaleString("en-IN", {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 items-center mb-2  mr-5">
                        <div className=" grid grid-cols-3 gap-2 p-2">
                            <button
                                onClick={() => handleFilterClick("INHOUSE")}
                                className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full shadow-md transition-all 
        ${category === "INHOUSE"
                                        ? "bg-blue-600 text-white scale-105"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }
        focus:outline-none focus:ring-2 focus:ring-blue-400`}
                            >
                                <HouseIcon fontSize="small" /> INHOUSE
                            </button>
                            <button
                                onClick={() => handleFilterClick("OUTSIDE")}
                                className={`flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full shadow-md transition-all 
        ${category === "OUTSIDE"
                                        ? "bg-blue-600 text-white scale-105"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }
        focus:outline-none focus:ring-2 focus:ring-blue-400`}
                            >
                                <FactoryIcon fontSize="small" /> OUTSIDE
                            </button>
                            <button
                                onClick={() => handleFilterClick("ALL")}
                                className={`flex items-center justify-center gap-2 px-1.5 py-1 text-xs font-semibold rounded-full shadow-md transition-all 
        ${category === "ALL"
                                        ? "bg-blue-600 text-white scale-105"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }
        focus:outline-none focus:ring-2 focus:ring-blue-400`}
                            >
                                <DomainIcon fontSize="small" /> ALL
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="grid grid-cols-5 gap-2">
                        {[
                            { label: "INWARD NO", key: "inwNo" },
                            { label: "ORDER NO", key: "orderNo" },
                            { label: "FABRIC..", key: "fabName" },
                            { label: "DIA", key: "dia" },
                        ].map(({ label, key }) => (
                            <div key={key} className="relative">
                                <input
                                    type="text"
                                    placeholder={`Search ${label}...`}
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
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center flex-1"> {/* Add flex-1 */}
                            <div className="w-40 mr-2">
                                <DropdownNew
                                    dataList={cusData || []}
                                    value={custName}
                                    setValue={(value) => {
                                        setCustName(value);
                                    }}
                                    clear={true}
                                    otherField="custName"
                                    otherValue="custName"
                                    placeholder={"Customer"}
                                />
                            </div>
                            <div className="flex items-center w-24 mr-2">
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className={`w-full px-2 py-1 text-xs border border-slate-300 rounded-md 
          focus:border-indigo-300 focus:outline-none transition-all duration-200
          hover:border-slate-400`}
                                >
                                    {finYear?.data?.map((option) => (
                                        <option key={option.finYear} value={option.finYear}>
                                            {option.finYear}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mr-2">
                                <FinYear
                                    selectedYear={selectedYear}
                                    selectmonths={selectmonths}
                                    setSelectmonths={setSelectmonths}
                                />
                            </div>
                            <div className="w-40 mr-2">
                                <DropdownNew
                                    dataList={stateData || []}
                                    value={selectState}
                                    setValue={(value) => {
                                        setSelectState(value);
                                    }}
                                    clear={true}
                                    otherField="stateName"
                                    otherValue="stateName"
                                    autoFocus={true}
                                    placeholder={"State"}
                                />
                            </div>
                            <button
                                onClick={downloadExcel}
                                className="p-0 rounded-full flex justify-center shadow-md hover:brightness-110 transition-all duration-300"
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
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div
                        className="overflow-x-auto max-h-[450px] "
                        style={{ border: "1px solid gray", borderRadius: "16px" }}
                    >
                        {isLoadingIndicator ? <Loader /> : (
                            <table className="w-full border-collapse border border-gray-300 text-[11px] table-fixed">
                                <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                                    <tr>
                                        <th className="border p-1 text-center w-6">S.No</th>
                                        <th className="border p-1 text-center w-24">Inward No</th>
                                        <th className="border p-1 text-center w-14">Inward Date</th>
                                        <th className="border p-1 text-center w-24">Order No</th>
                                        <th className="border p-1 text-center w-40">Customer name</th>
                                        <th className="border p-1 text-center w-36">Fabric name</th>
                                        <th className="border p-1 text-center w-12">Dia</th>
                                        <th className="border p-1 text-center w-12">Uom</th>
                                        <th className="border p-1 text-center w-12">Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRecords.map((row, index) => {
                                        const globalIndex = index; // 0–16
                                        const serialNo =
                                            (currentPage - 1) * recordsPerPage + globalIndex + 1;
                                        return (
                                            <tr
                                                key={index}
                                                className="text-gray-800 bg-white even:bg-gray-100 "
                                            >

                                                <td className="border p-1 text-[10px] text-center">
                                                    {serialNo}
                                                </td>
                                                <td className="border p-1 text-[10px] ">
                                                    {row.inwNo}
                                                </td>
                                                <td className="border p-1 text-[10px]  text-center">
                                                    {row.inwDate}
                                                </td>
                                                <td
                                                    className="border p-1 text-[10px] "
                                                >
                                                    {row.orderNo}
                                                </td>
                                                <td
                                                    className="border p-1 text-[10px]  overflow-hidden text-ellipsis "
                                                    style={{ maxWidth: "100px" }}
                                                >
                                                    {row.custName}
                                                </td>
                                                <td
                                                    className="border p-1 text-[10px]  overflow-hidden text-ellipsis "
                                                    style={{ maxWidth: "100px" }}
                                                >
                                                    {row.fabName}
                                                </td>
                                                <td className="border p-1 text-[10px]  ">
                                                    {row.dia}
                                                </td>
                                                <td className="border p-1 text-[10px] ">
                                                    {row.uom}
                                                </td>
                                                <td className="border p-1 text-sky-700 text-[10px] text-right ">
                                                    {Number(row.qty).toFixed(3)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>)}
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

export default CustomerTransState;

// export default ESIDetailed;

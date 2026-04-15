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
import HouseIcon from '@mui/icons-material/House';
import FactoryIcon from '@mui/icons-material/Factory';
import FinYear from "../../../components/FinYear";
import { addInsightsPurchaseOrderRow, DropdownNew } from "../../../utils/hleper";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { addInsightsfreelookRow } from "../../../utils/hleper";
import DomainIcon from '@mui/icons-material/Domain';
import Loader from "../../../utils/loader";
import { useGetSupplierListQuery, useGetSupplierPODetailsQuery, useGetSupplierPOSRejectedBySupplierQuery } from "../../../redux/service/purchaseOrder";

const SupplierTrans = ({
    closeTable,
    finYear,
    selectedYear,
    setSelectedYear,
    supplierName,
    setSupplierName,
    selectmonths,
    setSelectmonths,
    autoBorder = false,
    isRejected = false,
}) => {
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1);

    const recordsPerPage = 40;

    const { data: supplierTransData, isFetching: isSingleFetching,
        isLoading: isSingleLoading, } = useGetSupplierPODetailsQuery({
            params: {
                finyear: selectedYear,
                supplier: supplierName
            },
        }, {
            skip: !selectedYear || isRejected,
        });

    const { data: supplierTransDataRejected, isFetching: isSingleFetchingRejected,
        isLoading: isSingleLoadingRejected, } = useGetSupplierPOSRejectedBySupplierQuery({
            params: {
                finyear: selectedYear,
                supplier: supplierName
            },
        }, {
            skip: !selectedYear || !isRejected
        });

    const isLoadingIndicator = isSingleFetching || isSingleLoading;
    const isLoadingIndicatorRejected = isSingleFetchingRejected || isSingleLoadingRejected;



    const { data: supplierNames } = useGetSupplierListQuery({
    });

    const supplierData = supplierNames?.data.map((supplierName) => ({
        supplierName,
    }));

    useEffect(() => {
        setCurrentPage(1);
    }, [supplierTransData, search, selectmonths, selectedYear, supplierName]);



    const filteredData = Array.isArray(isRejected ? supplierTransDataRejected?.data : supplierTransData?.data)
        ? (isRejected ? supplierTransDataRejected.data : supplierTransData.data).filter((row) => {

            // 🔹 Search filter
            const searchMatch = Object.entries(search).every(([key, value]) => {
                if (!value) return true;
                return row[key]?.toString().toLowerCase().includes(value.toLowerCase());
            });
            if (!searchMatch) return false;

            // 🔹 Month filter
            if (!selectmonths) return true;

            // ✅ Parse DD/MM/YYYY safely
            const [day, month, year] = row.poDate.split("/").map(Number);
            const poDate = new Date(year, month - 1, day);

            if (isNaN(poDate.getTime())) return false;

            // Selected month/year
            const [monthName, yearStr] = selectmonths.split(" ");
            const selectedYear = parseInt(yearStr);

            const monthMap = {
                January: 0, February: 1, March: 2, April: 3,
                May: 4, June: 5, July: 6, August: 7,
                September: 8, October: 9, November: 10, December: 11
            };

            return (
                poDate.getMonth() === monthMap[monthName] &&
                poDate.getFullYear() === selectedYear
            );
        })
        : [];


    const totalAmount = filteredData.reduce(
        (sum, row) => sum + (Number(row.amount) || 0),
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

    const totalPoCount = new Set(
        filteredData.map(row => row.poNo)
    ).size;
    const downloadExcel = async () => {
        if (filteredData.length === 0) {
            alert("No data to export!");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Purchase Order Details");

        // 1️⃣ Define columns
        worksheet.columns = [
            { header: "PO No", key: "poNo", width: 25 },
            { header: "PO Date", key: "poDate", width: 16 },
            { header: "Supplier Name", key: "supplier", width: 48 },
            { header: "Item Name", key: "itemName", width: 48 },
            { header: "Uom", key: "uom", width: 12 },
            { header: "Qty", key: "qty", width: 17 },
            { header: "Rate", key: "rate", width: 17 },
            { header: "Amount", key: "amount", width: 17 },
            { header: "Status", key: "approvalStatus", width: 32 },
        ];

        // 2️⃣ Title Row
        worksheet.insertRow(1, [
            isRejected
                ? "PO Pending Approval Report"
                : "Purchase Order Details Report"
        ]);
        worksheet.mergeCells("A1:I1");

        const titleCell = worksheet.getCell("A1");
        titleCell.font = { bold: true, size: 14 };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getRow(1).height = 30;
        addInsightsPurchaseOrderRow({
            worksheet,
            startRow: 2,
            totalColumns: 8,
            supplierName,
            selectedYear,
            selectedMonth: selectmonths,
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
                poNo: row.poNo,
                poDate: row.poDate,
                supplier: row.supplier,
                itemName: row.itemName,
                uom: row.uom,
                qty: row.qty,
                rate: row.rate,
                amount: row.amount,
                approvalStatus: row.approvalStatus,
            });
        });

        // 5️⃣ Data Alignment
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber <= 3) return;

            row.height = 22;

            row.getCell("poNo").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
            row.getCell("poDate").alignment = { horizontal: "center", vertical: "middle" };
            row.getCell("supplier").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
            row.getCell("itemName").alignment = { horizontal: "left", vertical: "middle", indent: 1 };
            row.getCell("uom").alignment = { horizontal: "left", vertical: "middle", indent: 1 };

            const uomValue = row.getCell("uom").value;
            const qtyCell = row.getCell("qty");

            qtyCell.alignment = { horizontal: "right", vertical: "middle", indent: 1 };
            qtyCell.numFmt = uomValue === "KGS" ? "#,##0.000" : "#,##0";

            row.getCell("qty").alignment = { horizontal: "right", vertical: "middle", indent: 1 };
            row.getCell("rate").alignment = { horizontal: "right", vertical: "middle", indent: 1 };
            row.getCell("amount").alignment = { horizontal: "right", vertical: "middle", indent: 1 };
            row.getCell("approvalStatus").alignment = { horizontal: "center", vertical: "middle", indent: 1 };
        });
        // ================= TOTAL ROW =================
        const totalRow = worksheet.addRow({
            poNo: "",
            poDate: "",
            supplier: "",
            itemName: "",
            uom: "TOTAL",
            qty: totalQty.toLocaleString("en-IN", {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
            }),
            rate: "",
            amount: totalAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
            approvalStatus: "",
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
                horizontal: colNumber === 5 ? "center" : "right",
                indent: 1
            };
        });

        // 6️⃣ Quantity format
        worksheet.getColumn("poDate").numFmt = "dd-mm-yyyy";

        // 7️⃣ Freeze Header
        worksheet.views = [{ state: "frozen", ySplit: 3 }];

        // 8️⃣ Export
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), isRejected
            ? "PO Pending Approval Details.xlsx"
            : "Purchase Order Supplier Wise Details.xlsx");
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
            <div className="bg-white p-4 rounded-lg shadow-2xl w-[1150px] max-w-[1150px]  h-[590px] max-h-[590px] relative">
                <button
                    onClick={closeTable}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2 rounded-full transition-all"
                >
                    <FaTimes size={20} />
                </button>

                <div className="grid grid-cols-2">
                    <div className="text-start">
                        <h2 className="text-m font-bold text-gray-800 uppercase ">
                            Supplier Insights -{" "}
                            <span className="text-blue-600">{supplierName}</span>
                        </h2>

                    </div>
                    <div className="flex justify-end gap-1 items-center mb-2  mr-8">
                        <div className="flex items-start justify-start">
                            {/* Left: Total Records */}
                            {/* <p className="text-[12px] text-gray-500 font-medium">
                                Total Records: {totalRecords}
                            </p> */}
                            <div className="text-right text-[12px]">
                                <p className=" text-gray-500 font-medium">
                                    Total Orders:{" "}
                                    <span className="text-sky-700 pl-1">
                                        {totalPoCount}
                                    </span>
                                </p>
                            </div>
                            <div className="text-right ml-3 text-[12px]">
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
                            <div className="text-right ml-3 text-[12px]">
                                <p className=" text-gray-500 font-medium">
                                    Total Amount:{" "}
                                    <span className="text-sky-700 pl-1">
                                        {totalAmount.toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { label: "PO NO", key: "poNo" },
                            { label: "SUPPLIER", key: "supplier" },
                            { label: "ITEM..", key: "itemName" },
                            { label: "STATUS", key: "approvalStatus" },
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
                        <div className="w-48 mr-2">
                            <DropdownNew
                                dataList={supplierData || []}
                                value={supplierName}
                                setValue={(value) => {
                                    setSupplierName(value);
                                }}
                                clear={true}
                                otherField="supplierName"
                                otherValue="supplierName"
                                placeholder={"Supplier"}
                                autoFocus={true}
                            />
                        </div>
                        <div className="flex items-center w-28 mr-2">
                            <select
                                value={selectedYear}
                                // autoFocus={true}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className={`w-full px-2 py-1 text-xs border border-blue-800 rounded-md 
      transition-all duration-200 ring-1`}                            >
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
                                autoBorder={autoBorder}
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

                <div className="grid grid-cols-1 gap-6">
                    <div
                        className="overflow-x-auto max-h-[450px] min-h-[450px]"
                        style={{ border: "1px solid gray", borderRadius: "16px" }}
                    >
                        {isLoadingIndicator || isLoadingIndicatorRejected ? <Loader /> : (
                            <table className="w-full border-collapse border border-gray-300 text-[11px] table-fixed">
                                <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                                    <tr>
                                        <th className="border p-1 text-center w-6">S.No</th>
                                        <th className="border p-1 text-center w-24">PO No</th>
                                        <th className="border p-1 text-center w-14">PO Date</th>
                                        <th className="border p-1 text-center w-40">Supplier Name</th>
                                        <th className="border p-1 text-center w-40">Item Name</th>
                                        <th className="border p-1 text-center w-12">UOM</th>
                                        <th className="border p-1 text-center w-12">Qty</th>
                                        <th className="border p-1 text-center w-12">Rate</th>
                                        <th className="border p-1 text-center w-16">Amount</th>
                                        <th className="border p-1 text-center w-14">STATUS</th>
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
                                                    {row.poNo}
                                                </td>
                                                <td className="border p-1 text-[10px]  text-center">
                                                    {row.poDate}
                                                </td>
                                                <td
                                                    className="border p-1 text-[10px] "
                                                >
                                                    {row.supplier}
                                                </td>
                                                <td
                                                    className="border p-1 text-[10px]  overflow-hidden text-ellipsis "
                                                    style={{ maxWidth: "100px" }}
                                                >
                                                    {row.itemName}
                                                </td>
                                                <td
                                                    className="border p-1 text-[10px]"
                                                >
                                                    {row.uom}
                                                </td>
                                                <td
                                                    className="border p-1 text-[10px] text-right text-sky-700"
                                                >
                                                    {row.uom === "NOS" ? row.qty.toLocaleString("en-IN", {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 0,
                                                    }) : row.qty.toLocaleString("en-IN", {
                                                        minimumFractionDigits: 3,
                                                        maximumFractionDigits: 3,
                                                    })}
                                                </td>

                                                <td className="border p-1 text-[10px]  text-right">
                                                    {Number(row.rate).toFixed(2)}
                                                </td>
                                                <td className="border p-1 text-[10px] text-right text-sky-700">
                                                    {Number(row.amount).toFixed(2)}
                                                </td>
                                                <td className={`border p-1  text-[10px] text-center ${row.approvalStatus === "APPROVED" ? "text-green-600" : "text-red-600"}` }>
                                                    {row.approvalStatus}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
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

export default SupplierTrans;
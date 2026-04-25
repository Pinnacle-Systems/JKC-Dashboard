import { useState, useMemo } from "react";
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
import { useGetItemNameTableQuery } from "../../../../redux/service/purchaseServiceTable";
import { useGetItemGroupWiseQuery } from "../../../../redux/service/purchaseService";

import {
  addInsightsRowTurnOver,
  formatQtyByUOM,
  getExcelQtyFormatByUOM,
} from "../../../../utils/hleper";
import SpinLoader from "../../../../utils/spinLoader";
import moment from "moment";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect } from "react";

const INR = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    v,
  );
const fmtDate = (d) => (d ? moment(d).format("DD-MM-YYYY") : "");
const RECORDS = 34;

// ── Pagination ────────────────────────────────────────────────────────────────
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

// ── SearchBar ─────────────────────────────────────────────────────────────────
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

// ── RangeFilter ───────────────────────────────────────────────────────────────
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

// ── No Selection guard ────────────────────────────────────────────────────────
const NoSelectionRow = ({ cols, message }) => (
  <tr>
    <td colSpan={cols} className="text-center py-10 text-gray-400">
      <div className="flex flex-col items-center gap-2">
        <svg
          width="32"
          height="32"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="text-gray-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-[12px] font-medium">{message}</span>
      </div>
    </td>
  </tr>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const ItemNameTable = ({
  selectedYear,
  setSelectedYear,
  selectedCompCode,
  setSelectedCompCode,
  initialItemGroup,
  initialItemName,
  companyList,
  finYr,

  closeTable,
}) => {
  console.log(initialItemGroup, initialItemName, "checking");

  const [selectedItemGroup, setSelectedItemGroup] = useState(
    initialItemGroup || "",
  );
  const [selectedItemName, setSelectedItemName] = useState(
    initialItemName || "",
  );
  const [search, setSearch] = useState({});
  const [range, setRange] = useState({ min: 0, max: Infinity });
  const [page, setPage] = useState(1);

  // ── Fetch item group/name options based on current year+company ───────────
  const { data: itemGroupWiseRes } = useGetItemGroupWiseQuery(
    selectedYear && selectedCompCode
      ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
      : skipToken,
  );

  // ── Build groupMap from API response ──────────────────────────────────────
  const groupMap = useMemo(() => {
    if (!Array.isArray(itemGroupWiseRes?.data)) return {};
    const map = {};
    itemGroupWiseRes.data.forEach((item) => {
      if (!map[item.ItemGroup]) map[item.ItemGroup] = [];
      map[item.ItemGroup].push(item);
    });
    return map;
  }, [itemGroupWiseRes]);
  // ── ItemGroup options — from groupMap keys ────────────────────────────────
  const itemGroupOptions = useMemo(
    () => Object.keys(groupMap).sort(),
    [groupMap],
  );

  // ── ItemName options — from groupMap[selectedItemGroup] ───────────────────
  const itemNameOptions = useMemo(() => {
    if (!selectedItemGroup) return [];
    return (groupMap[selectedItemGroup] || [])
      .map((i) => i.ItemName)
      .filter(Boolean)
      .sort();
  }, [groupMap, selectedItemGroup]);

  // ── API call ──────────────────────────────────────────────────────────────
  const skip = !selectedYear || !selectedCompCode || !selectedItemGroup;
  const {
    data: tableRes,
    isLoading,
    isFetching,
  } = useGetItemNameTableQuery(
    {
      params: {
        selectedYear,
        companyName: selectedCompCode,

        itemName: selectedItemName || undefined, // optional — backend filters if provided
      },
    },
    { skip },
  );

  const raw = useMemo(
    () => (Array.isArray(tableRes?.data) ? tableRes.data : []),
    [tableRes],
  );

  // ── Helpers ───────────────────────────────────────────────────────────────
  const textMatch = (row, key, val) =>
    !val || (row[key]?.toLowerCase() || "").includes(val.toLowerCase());
  const amtFilter = (row) => {
    const v = Number(row.amount || 0);
    return v >= range.min && (range.max === Infinity || v <= range.max);
  };

  // ── Frontend filter by itemName if backend doesn't filter ─────────────────
  const filtered = useMemo(
    () =>
      raw.filter(
        (r) =>
          (!selectedItemName ||
            (r.item || r.itemName || r.ItemName || "")
              .toLowerCase()
              .includes(selectedItemName.toLowerCase())) &&
          textMatch(r, "docId", search.docId) &&
          textMatch(r, "supplier", search.supplier) &&
          // ── search "itemName" key maps to r.item from backend ──
          (!search.itemName ||
            (r.item || "")
              .toLowerCase()
              .includes(search.itemName.toLowerCase())) &&
          amtFilter(r),
      ),
    [raw, search, range, selectedItemName],
  );

  const total = useMemo(
    () => filtered.reduce((s, r) => s + Number(r.amount || 0), 0),
    [filtered],
  );
  // ── Reset itemGroup + itemName when year changes ──────────────────────────

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / RECORDS) || 1;
  const current = filtered.slice((page - 1) * RECORDS, page * RECORDS);

  // ── Excel ─────────────────────────────────────────────────────────────────
  const downloadExcel = async () => {
    if (!filtered.length) {
      alert("No data");
      return;
    }
    const columns = [
      { header: "S.No", key: "sno", width: 8 },
      { header: "Doc No", key: "docNo", width: 24 },
      { header: "Doc Date", key: "docDate", width: 16 },
      { header: "Supplier", key: "supplier", width: 60 },
      { header: "Item Group", key: "itemGroup", width: 30 },
      { header: "Item Name", key: "itemName", width: 90 },
      { header: "Qty", key: "qty", width: 14 },
      { header: "UOM", key: "uom", width: 14 },
      { header: "Rate", key: "rate", width: 18 },
      { header: "Amount", key: "amount", width: 20 },
    ];
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Item Group Wise");
    ws.columns = columns;

    ws.insertRow(1, ["Item Group Wise Purchase Report"]);
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
      dynamicField: "Item Group",
      dynamicValue: selectedItemGroup,
      ...(selectedItemName && {
        secondDynamicField: "Item Name",
        seconddynamicValue: selectedItemName,
      }),
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

    filtered.forEach((r, i) => {
      const row = ws.addRow({
        sno: i + 1,
        docNo: r.docId,
        docDate: fmtDate(r.docDate),
        supplier: r.supplier,
        itemGroup: r.itemGroup || r.ItemGroup,
        itemName: r.item || r.itemName || r.ItemName,
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.rate || 0),
        amount: Number(r.amount || 0),
      });
      if (r.uom) row.getCell("qty").numFmt = getExcelQtyFormatByUOM(r.uom);
    });

    const rateColIdx = columns.findIndex((c) => c.key === "rate") + 1;
    const amountColIdx = columns.findIndex((c) => c.key === "amount") + 1;

    ws.eachRow((row, rn) => {
      if (rn <= 3) return;
      row.height = 22;
      row.eachCell((cell, cn) => {
        const key = columns[cn - 1]?.key;
        cell.alignment = {
          horizontal: ["qty", "rate", "amount"].includes(key)
            ? "right"
            : "left",
          vertical: "middle",
          indent: 1,
        };
      });
    });

    const totalRate = filtered.reduce((s, r) => s + Number(r.rate || 0), 0);
    const totalAmount = filtered.reduce((s, r) => s + Number(r.amount || 0), 0);
    const totalRowObj = {};
    columns.forEach((c) => {
      totalRowObj[c.key] = "";
    });
    totalRowObj[columns[0].key] = "TOTAL";
    if (rateColIdx > 0) totalRowObj[columns[rateColIdx - 1].key] = totalRate;
    if (amountColIdx > 0)
      totalRowObj[columns[amountColIdx - 1].key] = totalAmount;

    const totalRow = ws.addRow(totalRowObj);
    totalRow.height = 24;
    totalRow.eachCell((cell, cn) => {
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        vertical: "middle",
        horizontal: cn === rateColIdx || cn === amountColIdx ? "right" : "left",
        indent: 1,
      };
    });

    if (rateColIdx > 0) ws.getColumn("rate").numFmt = "₹ #,##,##0.00";
    if (amountColIdx > 0) ws.getColumn("amount").numFmt = "₹ #,##,##0.00";

    ws.views = [{ state: "frozen", ySplit: 3 }];
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "ItemGroupWise.xlsx",
    );
  };

  const TH = ({ children, cls = "" }) => (
    <th className={`border p-1 text-center ${cls}`}>{children}</th>
  );
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

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1470px] h-[630px] p-4 rounded-xl relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase">
            Item Group Wise Purchase –{" "}
            <span className="text-blue-600">{selectedCompCode || ""}</span>
          </h2>

          <div className="flex gap-2 items-center">
            <div className="bg-gray-300 rounded-lg shadow-2xl flex gap-x-2 gap-1 p-2 flex-wrap">
              {/* Year */}
              <select
                value={selectedYear || ""}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setPage(1);
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-24"
              >
                <option value="">Select Year</option>
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
                  setPage(1);
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-24"
              >
                <option value="">Select Company</option>
                <option value="JKC">JKC</option>

                {/* {companyList?.data?.map((item) => (
                  <option key={item.COMPCODE} value={item.COMPCODE}>{item.COMPCODE}</option>
                ))} */}
              </select>

              {/* Item Group — from groupMap keys */}
              <select
                value={selectedItemGroup}
                onChange={(e) => {
                  setSelectedItemGroup(e.target.value);
                  setSelectedItemName(""); // reset item name on group change
                  setPage(1);
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-40"
              >
                <option value="">Select Item Group</option>
                {itemGroupOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>

              {/* Item Name — from groupMap[selectedItemGroup] */}
              <select
                value={selectedItemName}
                onChange={(e) => {
                  setSelectedItemName(e.target.value);
                  setPage(1);
                }}
                disabled={!selectedItemGroup}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-64 disabled:opacity-50"
              >
                <option value="">All Items</option>
                {itemNameOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <button className="text-red-600" onClick={closeTable}>
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* TOTAL */}
        <p className="text-xs font-semibold text-gray-600 mt-1">
          Total Amount: {INR(total)}
        </p>

        {/* SEARCH + RANGE + EXCEL */}
        <div className="flex justify-between items-start mt-2">
          <SearchBar
            keys={["docId", "supplier", "itemName"]}
            state={search}
            setState={setSearch}
          />
          <div className="flex gap-x-2 items-center">
            <RangeFilter range={range} setRange={setRange} />
            <button
              onClick={downloadExcel}
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
            className="overflow-x-auto h-[460px] border border-gray-300"
            style={{ border: "1px solid gray", borderRadius: "16px" }}
          >
            <table className="w-[1900px] border-collapse text-[11px] table-fixed">
              <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                <tr>
                  <TH cls="w-4">S.No</TH>
                  <TH cls="w-24">Doc No</TH>
                  <TH cls="w-[52px]">Doc Date</TH>
                  <TH cls="w-80">Supplier</TH>
                  <TH cls="w-24">Item Group</TH>
                  <TH cls="w-80">Item Name</TH>
                  <TH cls="w-12">Qty</TH>
                  <TH cls="w-8">UOM</TH>
                  <TH cls="w-12">Rate</TH>
                  <TH cls="w-16">Amount</TH>
                </tr>
              </thead>
              <tbody>
                {!selectedItemGroup ? (
                  <NoSelectionRow
                    cols={10}
                    message="Please select an Item Group to view data"
                  />
                ) : isLoading || isFetching ? (
                  <LoadingRow cols={10} />
                ) : current.length === 0 ? (
                  <EmptyRow cols={10} />
                ) : (
                  current.map((row, i) => (
                    <tr
                      key={i}
                      className="text-gray-800 bg-white even:bg-gray-100"
                    >
                      <td className="border p-1 text-center">
                        {(page - 1) * RECORDS + i + 1}
                      </td>
                      <td className="border p-1 pl-2 text-left">{row.docId}</td>
                      <td className="border p-1 pl-2 text-left">
                        {fmtDate(row.docDate)}
                      </td>
                      <td className="border p-1 pl-2 text-left">
                        {row.supplier}
                      </td>
                      <td className="border p-1 pl-2 text-left">
                        {row.itemGroup || row.ItemGroup}
                      </td>
                      <td className="border p-1 pl-2 text-left">
                        {row.item || row.itemName || row.ItemName}
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
          </div>
        </div>

        <Pagination page={page} total={totalPages} setPage={setPage} />
      </div>
    </div>
  );
};

export default ItemNameTable;

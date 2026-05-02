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
import { useGetOrderEntryBuyerPoNoWiseStatusTableQuery } from "../../../../redux/service/OrderEntry";
import moment from "moment";
import {
  addInsightsRowTurnOver,
  formatQtyByUOM,
  getExcelQtyFormatByUOM,
} from "../../../../utils/hleper";

const RECORDS = 34;
const fmtDate = (d) => (d ? moment(d).format("DD-MM-YYYY") : "");
const INR = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    v || 0,
  );

/* ── Pagination ── */
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

/* ── SearchBar ── */
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

/* ── TH ── */
const TH = ({ children, cls = "" }) => (
  <th className={`border p-1 text-center ${cls}`}>{children}</th>
);

/* ── Main ── */
const OrderEntryBuyerPoNoWiseTable = ({
  finYear,
  compCode,
  finYr,
  closeTable,
  buyerCode,
  buyerCodes: buyerCodesProp,
  bpoNo,
  allPoData,
}) => {
  console.log("bpo", bpoNo);

  const [selectedYear, setSelectedYear] = useState(finYear);
  const [selectedComp, setSelectedComp] = useState(compCode);
  const [selectedBuyer, setSelectedBuyer] = useState(buyerCode || "ALL");
  const [selectedBpoNo, setSelectedBpoNo] = useState(bpoNo || "ALL");
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState({
    orderNo: "",
    buyerName: "",
    bpoNo: "",
    styleRefNo: "",
  });

  const resetPage = () => setPage(1);
  const resetSearch = () =>
    setSearch({ orderNo: "", buyerName: "", bpoNo: "", styleRefNo: "" });

  const buyerCodes = buyerCodesProp?.length ? buyerCodesProp : ["ALL"];

  const bpoNosList = useMemo(() => {
    if (!allPoData) return ["ALL"];
    const list = allPoData
      .filter((d) => selectedBuyer === "ALL" || d.buyerCode === selectedBuyer)
      .map((d) => d.bpono);
    return ["ALL", ...new Set(list)];
  }, [allPoData, selectedBuyer]);

  const skip = !selectedYear || !selectedComp;

  /* ── Fetch — INTERNAL ORDER only ── */
  const {
    data: ioRes,
    isLoading,
    isFetching,
  } = useGetOrderEntryBuyerPoNoWiseStatusTableQuery(
    {
      params: {
        finYear: selectedYear,
        companyName: selectedComp,
        buyerCode: selectedBuyer,
        bpoNo: selectedBpoNo,
      },
    },
    { skip },
  );

  const rawData = useMemo(
    () => (Array.isArray(ioRes?.data) ? ioRes.data : []),
    [ioRes],
  );

  /* ── Filter ── */
  const textMatch = (row, field, val) =>
    !val ||
    String(row[field] ?? "")
      .toLowerCase()
      .includes(val.toLowerCase());

  const filtered = useMemo(
    () =>
      rawData.filter(
        (r) =>
          textMatch(r, "orderNo", search.orderNo) &&
          textMatch(r, "buyerName", search.buyerName) &&
          textMatch(r, "bpoNo", search.bpoNo) &&
          textMatch(r, "styleRefNo", search.styleRefNo),
      ),
    [rawData, search],
  );

  const totals = useMemo(() => {
    return {
      orderQty: filtered.reduce((sum, r) => sum + Number(r.orderQty || 0), 0),
      excessQty: filtered.reduce((sum, r) => sum + Number(r.excessQty || 0), 0),
      amount: filtered.reduce((sum, r) => sum + Number(r.amount || 0), 0),
    };
  }, [filtered]);

  /* ── Pagination ── */
  const totalPages = Math.ceil(filtered.length / RECORDS) || 1;
  const currentRows = filtered.slice((page - 1) * RECORDS, page * RECORDS);

  const LoadingRow = ({ cols }) => (
    <tr>
      <td colSpan={cols} className="text-center py-10 text-gray-400 text-xs">
        Loading...
      </td>
    </tr>
  );
  const EmptyRow = ({ cols }) => (
    <tr>
      <td colSpan={cols} className="text-center py-10 text-gray-500 text-xs">
        No data found
      </td>
    </tr>
  );

  /* ── Excel ── */
  const handleExport = async () => {
    if (!filtered.length) {
      alert("No data");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Order Entry Status");

    const columns = [
      { header: "S.No", key: "sno", width: 6 },
      { header: "Order No", key: "orderNo", width: 28 },
      { header: "Order Date", key: "orderDate", width: 14 },
      { header: "Buyer Name", key: "buyerName", width: 32 },
      { header: "BPO No", key: "bpoNo", width: 36 },
      { header: "Style Ref No", key: "styleRefNo", width: 18 },
      { header: "Pack Type", key: "orderPackType", width: 18 },
      { header: "Order Qty", key: "orderQty", width: 18 },
      { header: "Excess Qty", key: "excessQty", width: 18 },
      { header: "Amount", key: "amount", width: 18 },
    ];

    ws.columns = columns;
    const mergeEnd = String.fromCharCode(64 + columns.length);

    // Row 1: Title
    ws.insertRow(1, [`Order Entry Buyer PO No Wise Quantity`]);
    ws.mergeCells(`A1:${mergeEnd}1`);
    const tc = ws.getCell("A1");
    tc.font = { bold: true, size: 14, color: { argb: "FF000000" } };
    tc.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 30;

    // Row 2: Insights
    addInsightsRowTurnOver({
      worksheet: ws,
      startRow: 2,
      totalColumns: 4,
      selectedYear,
      localCompany: selectedComp,
      dynamicField: "Buyer Code",
      dynamicValue: selectedBuyer,
      secondDynamicField: "BPO No",
      seconddynamicValue: selectedBpoNo,
    });

    // Row 3: Headers
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

    // Data rows
    filtered.forEach((r, i) => {
      ws.addRow({
        sno: i + 1,
        orderNo: r.orderNo,
        orderDate: fmtDate(r.orderDate),
        buyerName: r.buyerName,
        bpoNo: r.bpoNo,
        styleRefNo: r.styleRefNo,
        orderPackType: r.orderPackType,
        orderQty: Number(r.orderQty || 0),
        excessQty: Number(r.excessQty || 0),
        amount: Number(r.amount || 0),
      });
    });

    // Style data rows
    ws.eachRow((row, rn) => {
      if (rn <= 3) return;
      const rowData = filtered[rn - 4];
      row.height = 22;
      row.eachCell((cell, cn) => {
        const key = columns[cn - 1]?.key;
        cell.alignment = {
          horizontal:
            key === "sno"
              ? "center"
              : ["orderQty", "excessQty", "amount"].includes(key)
                ? "right"
                : "left",
          vertical: "middle",
          indent: 1,
        };
        if (["orderQty", "excessQty"].includes(key))
          cell.numFmt = getExcelQtyFormatByUOM(rowData?.orderPackType || "");
        if (key === "amount") cell.numFmt = "#,##0.00";
      });
    });

    // Totals row
    const tr = ws.addRow({
      sno: "",
      orderNo: "",
      orderDate: "",
      buyerName: "",
      bpoNo: "TOTAL",
      styleRefNo: "",
      orderPackType: "",
      orderQty: totals.orderQty,
      excessQty: totals.excessQty,
      amount: totals.amount,
    });
    tr.height = 24;
    tr.eachCell((cell, cn) => {
      const key = columns[cn - 1]?.key;
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        horizontal: ["orderQty", "excessQty", "amount"].includes(key)
          ? "right"
          : "center",
        vertical: "middle",
        indent: 1,
      };
      if (["orderQty", "excessQty"].includes(key))
        cell.numFmt = getExcelQtyFormatByUOM("");
      if (key === "amount") cell.numFmt = "#,##0.00";
    });

    ws.views = [{ state: "frozen", ySplit: 3 }];
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `OrderEntry_BuyerWise_${selectedBuyer}_${selectedYear}.xlsx`,
    );
  };

  /* ── Render ── */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1360px] h-[630px] p-4 rounded-xl relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase">
            Order Entry Buyer PO No Wise Quantity –{" "}
            <span className="text-blue-600">{selectedComp}</span>
          </h2>
          <div className="flex gap-2 items-center">
            <div className="bg-gray-300 rounded-lg shadow-2xl flex gap-x-2 gap-1 p-2 flex-wrap items-center">
              {/* Year */}
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  resetPage();
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
                value={selectedComp}
                onChange={(e) => {
                  setSelectedComp(e.target.value);
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-24"
              >
                <option value="JKC">JKC</option>
              </select>

              {/* Buyer */}
              <select
                value={selectedBuyer}
                onChange={(e) => {
                  setSelectedBuyer(e.target.value);
                  setSelectedBpoNo("ALL");
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-28"
              >
                {buyerCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>

              {/* BPO No */}
              <select
                value={selectedBpoNo}
                onChange={(e) => {
                  setSelectedBpoNo(e.target.value);
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-28"
              >
                {bpoNosList.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>

              {/* Excel */}
              <button
                onClick={handleExport}
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
            <button className="text-red-600" onClick={closeTable}>
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* RECORD COUNT & TOTALS */}
        <div className="flex gap-6 mt-0.5">
          <p className="text-xs font-semibold text-gray-600">
            Total Records:{" "}
            <span className="text-blue-600">{filtered?.length}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Total Order Qty:{" "}
            <span className="text-green-600">
              {Number(totals.orderQty).toLocaleString("en-IN")}
            </span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Total Excess Qty:{" "}
            <span className="text-red-600">
              {Number(totals.excessQty).toLocaleString("en-IN")}
            </span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Total Amount:{" "}
            <span className="text-purple-600">{INR(totals.amount)}</span>
          </p>
        </div>

        {/* SEARCH */}
        <div className="flex justify-between items-start mt-2">
          <SearchBar
            keys={["orderNo", "buyerName", "bpoNo", "styleRefNo"]}
            state={search}
            setState={(val) => {
              setSearch(val);
              resetPage();
            }}
          />
        </div>

        {/* TABLE — INTERNAL ORDER only */}
        <div
          className="overflow-x-auto border border-gray-300"
          style={{
            height: "470px",
            border: "1px solid gray",
            borderRadius: "16px",
          }}
        >
          <table className="w-[1520px] border-collapse text-[11px] table-fixed">
            <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
              <tr>
                <TH cls="w-8">S.No</TH>
                <TH cls="w-32">Order No</TH>
                <TH cls="w-20">Order Date</TH>
                <TH cls="w-44">Buyer Name</TH>
                <TH cls="w-44">BPO No</TH>
                <TH cls="w-28">Style Ref No</TH>
                <TH cls="w-20">Pack Type</TH>
                <TH cls="w-20">Order Qty</TH>
                <TH cls="w-20">Excess Qty</TH>
                <TH cls="w-24">Amount</TH>
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <LoadingRow cols={10} />
              ) : currentRows.length === 0 ? (
                <EmptyRow cols={10} />
              ) : (
                currentRows.map((row, i) => (
                  <tr
                    key={i}
                    className="text-gray-800 bg-white even:bg-gray-100 hover:bg-blue-50 transition-colors"
                  >
                    <td className="border p-1 text-center text-gray-500">
                      {(page - 1) * RECORDS + i + 1}
                    </td>
                    <td className="border p-1 pl-2">{row.orderNo}</td>
                    <td className="border p-1 pl-1">
                      {fmtDate(row.orderDate)}
                    </td>
                    <td className="border p-1 pl-2">{row.buyerName}</td>
                    <td className="border p-1 pl-2">{row.bpoNo}</td>
                    <td className="border p-1 pl-2">{row.styleRefNo}</td>
                    <td className="border p-1 text-left pl-2">
                      {row.orderPackType}
                    </td>
                    <td className="border p-1 pr-2 text-right">
                      {formatQtyByUOM(row.orderQty, row.orderPackType)}
                    </td>
                    <td className="border p-1 pr-2 text-right">
                      {formatQtyByUOM(row.excessQty, row.orderPackType)}
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

        {/* PAGINATION */}
        <Pagination page={page} total={totalPages} setPage={setPage} />
      </div>
    </div>
  );
};

export default OrderEntryBuyerPoNoWiseTable;

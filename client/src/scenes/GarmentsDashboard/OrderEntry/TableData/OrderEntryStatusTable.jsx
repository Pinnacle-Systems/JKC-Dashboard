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
import { useGetOrderEntryStatusTableWithStatusQuery } from "../../../../redux/service/OrderEntry";
import moment from "moment";
import {
  addInsightsRowTurnOver,
  formatQtyByUOM,
  getExcelQtyFormatByUOM,
} from "../../../../utils/hleper";

const ORDER_TYPES = [
  { label: "INTERNAL ORDER", value: "INTERNAL ORDER" },
  { label: "FABRIC PROCESS PLAN", value: "FABRIC PROCESS PLAN" },
  { label: "ACCESSORIES PLAN", value: "ACCESSORIES PLAN" },
  { label: "CMT PLAN", value: "CMT PLAN" },
  { label: "PRE - BUDGET", value: "PRE - BUDGET" },
];

const PENDING_LABEL = {
  "FABRIC PROCESS PLAN": "Internal Orders not in Fabric Process Plan",
  "ACCESSORIES PLAN": "Internal Orders not in Accessories Plan",
  "CMT PLAN": "Internal Orders not in CMT Plan",
  "PRE - BUDGET": "Internal Orders not in Pre-Budget",
};

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

const TH = ({ children, cls = "" }) => (
  <th className={`border p-1 text-center ${cls}`}>{children}</th>
);

const AgeBadge = ({ age }) => {
  const n = Number(age || 0);
  const color =
    n <= 7 ? "text-green-600" : n <= 15 ? "text-amber-500" : "text-red-600";
  return <span className={`font-semibold ${color}`}>{n}</span>;
};

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
const OrderEntryStatusTable = ({
  typeName,
  finYear,
  compCode,
  finYr,
  closeTable,
  buyerCode,
  buyerCodes: buyerCodesProp,
  status: initialStatus,
}) => {
  const [selectedType, setSelectedType] = useState(
    typeName || "INTERNAL ORDER",
  );
  const [selectedYear, setSelectedYear] = useState(finYear);
  const [selectedComp, setSelectedComp] = useState(compCode);
  const [selectedBuyer, setSelectedBuyer] = useState(buyerCode || "ALL");
  const [selectedStatus, setSelectedStatus] = useState(
    initialStatus || "completed",
  );
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState({
    orderNo: "",
    buyerName: "",
    bpoNo: "",
    styleRefNo: "",
    transType: "",
  });

  const resetPage = () => setPage(1);
  const resetSearch = () =>
    setSearch({
      orderNo: "",
      buyerName: "",
      bpoNo: "",
      styleRefNo: "",
      transType: "",
    });

  const buyerCodes = buyerCodesProp?.length ? buyerCodesProp : ["ALL"];
  const skip = !selectedYear || !selectedComp;
  const qBase = {
    finYear: selectedYear,
    companyName: selectedComp,
    buyerCode: selectedBuyer,
  };

  /* ── Fetch CURRENT step completed data ── */
  const {
    data: currRes,
    isLoading: currL,
    isFetching: currF,
  } = useGetOrderEntryStatusTableWithStatusQuery(
    { params: { ...qBase, typeName: selectedType } },
    { skip },
  );

  /* ── Fetch INTERNAL ORDER data — used as pending source for all plans ── */
  const {
    data: ioRes,
    isLoading: ioL,
    isFetching: ioF,
  } = useGetOrderEntryStatusTableWithStatusQuery(
    { params: { ...qBase, typeName: "INTERNAL ORDER" } },
    // Only fetch when viewing pending of a non-IO type
    {
      skip:
        skip ||
        selectedType === "INTERNAL ORDER" ||
        selectedStatus !== "pending",
    },
  );

  const isLoading = currL || ioL;
  const isFetching = currF || ioF;

  const currData = useMemo(
    () => (Array.isArray(currRes?.data) ? currRes.data : []),
    [currRes],
  );
  const ioData = useMemo(
    () => (Array.isArray(ioRes?.data) ? ioRes.data : []),
    [ioRes],
  );

  /* ── Build displayed rows ──
     completed → currData (plan rows)
     pending   → IO rows whose orderNo NOT in currData (plan's orderNo list)
  ── */
  const rawData = useMemo(() => {
    if (selectedStatus === "completed" || selectedType === "INTERNAL ORDER") {
      return currData;
    }
    // Set of orderNos that exist in the current plan
    const planOrderNos = new Set(currData.map((r) => r.orderNo));
    // IO rows missing from the plan
    return ioData.filter((r) => !planOrderNos.has(r.orderNo));
  }, [selectedStatus, selectedType, currData, ioData]);

  /* ── Table shape:
     pending → always IO shape (showing internal order details)
     completed → selected plan's shape
  ── */
  const effectiveType = useMemo(() => {
    if (selectedStatus === "pending" && selectedType !== "INTERNAL ORDER")
      return "INTERNAL ORDER";
    return selectedType;
  }, [selectedType, selectedStatus]);

  /* ── Text filter ── */
  const textMatch = (row, field, val) =>
    !val ||
    String(row[field] ?? "")
      .toLowerCase()
      .includes(val.toLowerCase());

  const filtered = useMemo(() => {
    if (effectiveType === "INTERNAL ORDER") {
      return rawData.filter(
        (r) =>
          textMatch(r, "orderNo", search.orderNo) &&
          textMatch(r, "buyerName", search.buyerName) &&
          textMatch(r, "bpoNo", search.bpoNo) &&
          textMatch(r, "styleRefNo", search.styleRefNo),
      );
    }
    return rawData.filter(
      (r) =>
        textMatch(r, "orderNo", search.orderNo) &&
        textMatch(r, "buyerName", search.buyerName) &&
        textMatch(r, "transType", search.transType),
    );
  }, [rawData, search, effectiveType]);

  const totals = useMemo(
    () => ({
      orderQty: filtered.reduce((s, r) => s + Number(r.orderQty || 0), 0),
      excessQty: filtered.reduce((s, r) => s + Number(r.excessQty || 0), 0),
      amount: filtered.reduce((s, r) => s + Number(r.amount || 0), 0),
    }),
    [filtered],
  );

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

    const isIO = effectiveType === "INTERNAL ORDER";
    const isFP = effectiveType === "FABRIC PROCESS PLAN";
    const isACC = effectiveType === "ACCESSORIES PLAN";
    const isCMT = effectiveType === "CMT PLAN";
    const isPB = effectiveType === "PRE - BUDGET";

    const buildPlanCols = (docLabel, dateLabel, includeTransType = true) => [
      { header: "S.No", key: "sno", width: 6 },
      { header: docLabel, key: "docId", width: 24 },
      { header: dateLabel, key: "docDate", width: 14 },
      ...(includeTransType
        ? [{ header: "Trans Type", key: "transType", width: 14 }]
        : []),
      { header: "Order No", key: "orderNo", width: 24 },
      { header: "Order Date", key: "orderDate", width: 14 },
      { header: "Buyer Name", key: "buyerName", width: 32 },
      { header: "Age (Days)", key: "age", width: 12 },
    ];

    const columns = isIO
      ? [
          { header: "S.No", key: "sno", width: 6 },
          { header: "Order No", key: "orderNo", width: 32 },
          { header: "Order Date", key: "orderDate", width: 14 },
          { header: "Buyer Name", key: "buyerName", width: 32 },
          { header: "BPO No", key: "bpoNo", width: 36 },
          { header: "Style Ref No", key: "styleRefNo", width: 18 },
          { header: "Pack Type", key: "orderPackType", width: 18 },
          { header: "Order Qty", key: "orderQty", width: 18 },
          { header: "Excess Qty", key: "excessQty", width: 18 },
          { header: "Amount", key: "amount", width: 18 },
        ]
      : buildPlanCols(
          isFP
            ? "Plan No"
            : isACC
              ? "Acc Plan No"
              : isPB
                ? "Budget No"
                : "Doc No",
          isFP
            ? "Plan Date"
            : isACC
              ? "Acc Plan Date"
              : isPB
                ? "Budget Date"
                : "Doc Date",
          !(isPB || isCMT),
        );

    ws.columns = columns;
    const mergeEnd = String.fromCharCode(64 + columns.length);

    ws.insertRow(1, [`Order Entry Status `]);
    ws.mergeCells(`A1:${mergeEnd}1`);
    const tc = ws.getCell("A1");
    tc.font = { bold: true, size: 14, color: { argb: "FF000000" } };
    tc.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 30;

    addInsightsRowTurnOver({
      worksheet: ws,
      startRow: 2,
      totalColumns: 4,
      selectedYear,
      localCompany: selectedComp,
      dynamicField: "Buyer Code",
      dynamicValue: selectedBuyer,
      secondDynamicField: "Planning Status",
      seconddynamicValue: selectedType,
      ...(selectedType !== "INTERNAL ORDER" && {
        thirdDynamicField: "Status",
        thirdDynamicValue:
          selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1),
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
      if (isIO) {
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
      } else {
        ws.addRow({
          sno: i + 1,
          docId: isFP ? r.planNo : isACC ? r.accplanNo : r.docId,
          docDate: fmtDate(
            isFP ? r.planDate : isACC ? r.accplanDate : r.docDate,
          ),
          ...(isPB || isCMT ? {} : { transType: r.transType || "" }),
          orderNo: r.orderNo,
          orderDate: fmtDate(r.orderDate),
          buyerName: r.buyerName,
          age: Number(r.age || 0),
        });
      }
    });

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
              : ["orderQty", "excessQty", "amount", "age"].includes(key)
                ? "right"
                : "left",
          vertical: "middle",
          indent: 1,
        };
        if (["orderQty", "excessQty"].includes(key))
          cell.numFmt = getExcelQtyFormatByUOM(rowData?.orderPackType || "");
        if (key === "amount") cell.numFmt = "#,##0.00";
        if (key === "age") {
          const v = Number(cell.value || 0);
          cell.font = {
            bold: true,
            color: {
              argb: v <= 7 ? "FF16A34A" : v <= 15 ? "FFF59E0B" : "FFEF4444",
            },
          };
        }
      });
    });

    if (isIO) {
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
    }

    ws.views = [{ state: "frozen", ySplit: 3 }];
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `OrderEntry_${selectedType.replace(/ /g, "_")}_${selectedStatus}_${selectedBuyer}_${selectedYear}.xlsx`,
    );
  };

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1370px] h-[630px] p-4 rounded-xl relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase">
            Order Entry Status –{" "}
            <span className="text-blue-600">{selectedComp}</span>
          </h2>
          <div className="flex gap-2 items-center">
            <div className="bg-gray-300 rounded-lg shadow-2xl flex gap-x-2 gap-1 p-2 flex-wrap items-center">
              {/* Pending / Completed toggle — hidden for INTERNAL ORDER */}
              {selectedType !== "INTERNAL ORDER" && (
                <div className="flex gap-2">
                  {["pending", "completed"].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedStatus(s);
                        resetPage();
                      }}
                      className={`px-3 py-1 text-[11px] font-semibold rounded-full shadow-md transition-all capitalize
                        ${
                          selectedStatus === s
                            ? s === "pending"
                              ? "bg-blue-500 text-white scale-105"
                              : "bg-blue-500 text-white scale-105"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

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

              <select
                value={selectedBuyer}
                onChange={(e) => {
                  setSelectedBuyer(e.target.value);
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

              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setSelectedStatus("completed");
                  resetSearch();
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-48"
              >
                {ORDER_TYPES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

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
        <div className="flex gap-6 mt-0.5 flex-wrap items-center">
          <p className="text-xs font-semibold text-gray-600">
            Total Records:{" "}
            <span className="text-blue-600">{filtered.length}</span>
          </p>
          {/* IO totals — shown for IO view AND pending view (which shows IO shape) */}
          {effectiveType === "INTERNAL ORDER" && (
            <>
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
            </>
          )}

          {/* Pending context banner */}
          {/* {selectedStatus === "pending" &&
            selectedType !== "INTERNAL ORDER" && (
              <div className="flex items-center gap-2 ml-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-300">
                  ⚠ Pending
                </span>
                <span className="text-[11px] text-gray-500">
                  {PENDING_LABEL[selectedType]}
                </span>
              </div>
            )} */}
        </div>

        {/* SEARCH — always IO keys when pending, plan keys when completed */}
        <div className="flex justify-between items-start mt-2">
          {effectiveType === "INTERNAL ORDER" ? (
            <SearchBar
              keys={["orderNo", "buyerName", "bpoNo", "styleRefNo"]}
              state={search}
              setState={(val) => {
                setSearch(val);
                resetPage();
              }}
            />
          ) : (
            <SearchBar
              keys={["transType", "orderNo", "buyerName"]}
              state={search}
              setState={(val) => {
                setSearch(val);
                resetPage();
              }}
            />
          )}
        </div>

        {/* TABLE */}
        <div
          className="overflow-x-auto border border-gray-300"
          style={{
            height: "460px",
            border: "1px solid gray",
            borderRadius: "16px",
          }}
        >
          {/* ── INTERNAL ORDER shape (also used for all pending views) ── */}
          {effectiveType === "INTERNAL ORDER" && (
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
          )}

          {/* ── FABRIC PROCESS PLAN ── */}
          {effectiveType === "FABRIC PROCESS PLAN" && (
            <table className="w-[1320px] border-collapse text-[11px] table-fixed">
              <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                <tr>
                  <TH cls="w-8">S.No</TH>
                  <TH cls="w-28">Plan No</TH>
                  <TH cls="w-20">Plan Date</TH>
                  <TH cls="w-24">Trans Type</TH>
                  <TH cls="w-28">Order No</TH>
                  <TH cls="w-20">Order Date</TH>
                  <TH cls="w-44">Buyer Name</TH>
                  <TH cls="w-20">Age (Days)</TH>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <LoadingRow cols={8} />
                ) : currentRows.length === 0 ? (
                  <EmptyRow cols={8} />
                ) : (
                  currentRows.map((row, i) => (
                    <tr
                      key={i}
                      className="text-gray-800 bg-white even:bg-gray-100 hover:bg-blue-50 transition-colors"
                    >
                      <td className="border p-1 text-center text-gray-500">
                        {(page - 1) * RECORDS + i + 1}
                      </td>
                      <td className="border p-1 pl-2">{row.planNo}</td>
                      <td className="border p-1 pl-2">
                        {fmtDate(row.planDate)}
                      </td>
                      <td className="border p-1 text-left pl-2">
                        {row.transType}
                      </td>
                      <td className="border p-1 pl-2">{row.orderNo}</td>
                      <td className="border p-1 pl-2">
                        {fmtDate(row.orderDate)}
                      </td>
                      <td className="border p-1 pl-2">{row.buyerName}</td>
                      <td className="border p-1 pr-2 text-right">
                        <AgeBadge age={row.age} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* ── ACCESSORIES PLAN ── */}
          {effectiveType === "ACCESSORIES PLAN" && (
            <table className="w-[1320px] border-collapse text-[11px] table-fixed">
              <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                <tr>
                  <TH cls="w-8">S.No</TH>
                  <TH cls="w-28">Acc Plan No</TH>
                  <TH cls="w-20">Acc Plan Date</TH>
                  <TH cls="w-24">Trans Type</TH>
                  <TH cls="w-28">Order No</TH>
                  <TH cls="w-20">Order Date</TH>
                  <TH cls="w-44">Buyer Name</TH>
                  <TH cls="w-20">Age (Days)</TH>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <LoadingRow cols={8} />
                ) : currentRows.length === 0 ? (
                  <EmptyRow cols={8} />
                ) : (
                  currentRows.map((row, i) => (
                    <tr
                      key={i}
                      className="text-gray-800 bg-white even:bg-gray-100 hover:bg-blue-50 transition-colors"
                    >
                      <td className="border p-1 text-center text-gray-500">
                        {(page - 1) * RECORDS + i + 1}
                      </td>
                      <td className="border p-1 pl-2">{row.accplanNo}</td>
                      <td className="border p-1 pl-2">
                        {fmtDate(row.accplanDate)}
                      </td>
                      <td className="border p-1 text-left pl-2">
                        {row.transType}
                      </td>
                      <td className="border p-1 pl-2">{row.orderNo}</td>
                      <td className="border p-1 pl-2">
                        {fmtDate(row.orderDate)}
                      </td>
                      <td className="border p-1 pl-2">{row.buyerName}</td>
                      <td className="border p-1 pr-2 text-right">
                        <AgeBadge age={row.age} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* ── CMT PLAN ── */}
          {effectiveType === "CMT PLAN" && (
            <table className="w-[1320px] border-collapse text-[11px] table-fixed">
              <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                <tr>
                  <TH cls="w-8">S.No</TH>
                  <TH cls="w-36">Doc No</TH>
                  <TH cls="w-24">Doc Date</TH>
                  <TH cls="w-36">Order No</TH>
                  <TH cls="w-24">Order Date</TH>
                  <TH cls="w-44">Buyer Name</TH>
                  <TH cls="w-20">Age (Days)</TH>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <LoadingRow cols={7} />
                ) : currentRows.length === 0 ? (
                  <EmptyRow cols={7} />
                ) : (
                  currentRows.map((row, i) => (
                    <tr
                      key={i}
                      className="text-gray-800 bg-white even:bg-gray-100 hover:bg-blue-50 transition-colors"
                    >
                      <td className="border p-1 text-center text-gray-500">
                        {(page - 1) * RECORDS + i + 1}
                      </td>
                      <td className="border p-1 pl-2">{row.docId}</td>
                      <td className="border p-1 pl-2">
                        {fmtDate(row.docDate)}
                      </td>
                      <td className="border p-1 pl-2">{row.orderNo}</td>
                      <td className="border p-1 pl-2">
                        {fmtDate(row.orderDate)}
                      </td>
                      <td className="border p-1 pl-2">{row.buyerName}</td>
                      <td className="border p-1 pr-2 text-right">
                        <AgeBadge age={row.age} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* ── PRE - BUDGET ── */}
          {effectiveType === "PRE - BUDGET" && (
            <table className="w-[1320px] border-collapse text-[11px] table-fixed">
              <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                <tr>
                  <TH cls="w-8">S.No</TH>
                  <TH cls="w-36">Budget No</TH>
                  <TH cls="w-24">Budget Date</TH>
                  <TH cls="w-36">Order No</TH>
                  <TH cls="w-24">Order Date</TH>
                  <TH cls="w-44">Buyer Name</TH>
                  <TH cls="w-20">Age (Days)</TH>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <LoadingRow cols={7} />
                ) : currentRows.length === 0 ? (
                  <EmptyRow cols={7} />
                ) : (
                  currentRows.map((row, i) => (
                    <tr
                      key={i}
                      className="text-gray-800 bg-white even:bg-gray-100 hover:bg-blue-50 transition-colors"
                    >
                      <td className="border p-1 text-center text-gray-500">
                        {(page - 1) * RECORDS + i + 1}
                      </td>
                      <td className="border p-1 pl-2">{row.docId}</td>
                      <td className="border p-1 pl-2">
                        {fmtDate(row.docDate)}
                      </td>
                      <td className="border p-1 pl-2">{row.orderNo}</td>
                      <td className="border p-1 pl-2">
                        {fmtDate(row.orderDate)}
                      </td>
                      <td className="border p-1 pl-2">{row.buyerName}</td>
                      <td className="border p-1 pr-2 text-right">
                        <AgeBadge age={row.age} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <Pagination page={page} total={totalPages} setPage={setPage} />
      </div>
    </div>
  );
};

export default OrderEntryStatusTable;

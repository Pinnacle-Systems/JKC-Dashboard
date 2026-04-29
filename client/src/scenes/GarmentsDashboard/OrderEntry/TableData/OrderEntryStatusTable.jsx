import { useState, useMemo } from "react";
import {
  FaTimes, FaChevronLeft, FaChevronRight,
  FaStepBackward, FaStepForward, FaSearch,
} from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  useGetOrderEntryStatusTableQuery,
  useGetfabricProcessPlanTableQuery,
  useGetAccessoriesPlanTableQuery,
  useGetCMTPlanTableQuery,
  useGetPreBudjetTableQuery,
} from "../../../../redux/service/OrderEntry";
import moment from "moment";
import {
  addInsightsRowTurnOver,
  formatQtyByUOM,
  getExcelQtyFormatByUOM,
} from "../../../../utils/hleper";

const ORDER_TYPES = [
  { label: "INTERNAL ORDER",      value: "INTERNAL ORDER" },
  { label: "FABRIC PROCESS PLAN", value: "FABRIC PROCESS PLAN" },
  { label: "ACCESSORIES PLAN",    value: "ACCESSORIES PLAN" },
  { label: "CMT PLAN",            value: "CMT PLAN" },
  { label: "PRE - BUDGET",        value: "PRE - BUDGET" },
];

const RECORDS = 34;
const fmtDate = (d) => (d ? moment(d).format("DD-MM-YYYY") : "");
const INR = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v || 0);

/* ── Pagination ─────────────────────────────────────────────────────────── */
const Pagination = ({ page, total, setPage }) => (
  <div className="flex justify-end items-center mt-4 space-x-2 text-[11px]"
    style={{ position: "absolute", bottom: "5px", right: "0px" }}>
    <button onClick={() => setPage(1)} disabled={page === 1}
      className={`p-2 rounded-md ${page === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}>
      <FaStepBackward size={16} />
    </button>
    <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
      className={`p-2 rounded-md ${page === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}>
      <FaChevronLeft size={16} />
    </button>
    <span className="text-xs font-semibold px-3">Page {page} of {total || 1}</span>
    <button onClick={() => setPage((p) => Math.min(p + 1, total))} disabled={page === total || !total}
      className={`p-2 rounded-md ${page === total || !total ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}>
      <FaChevronRight size={16} />
    </button>
    <button onClick={() => setPage(total)} disabled={page === total || !total}
      className={`p-2 rounded-md ${page === total || !total ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}>
      <FaStepForward size={16} />
    </button>
  </div>
);

/* ── SearchBar ───────────────────────────────────────────────────────────── */
const SearchBar = ({ keys, state, setState }) => (
  <div className="flex gap-x-4 mb-3">
    {keys.map((key) => (
      <div key={key} className="relative">
        <input type="text" placeholder={`Search ${key}...`}
          value={state[key] || ""}
          onChange={(e) => setState({ ...state, [key]: e.target.value })}
          className="w-full h-6 p-1 pl-8 text-gray-900 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
        />
        <FaSearch className="absolute left-2 top-1.5 text-gray-500 text-sm" />
      </div>
    ))}
  </div>
);

/* ── TH ─────────────────────────────────────────────────────────────────── */
const TH = ({ children, cls = "" }) => (
  <th className={`border p-1 text-center ${cls}`}>{children}</th>
);

/* ── Age badge ───────────────────────────────────────────────────────────── */
const AgeBadge = ({ age }) => {
  const n = Number(age || 0);
  const color = n <= 7 ? "text-green-600" : n <= 15 ? "text-amber-500" : "text-red-600";
  return <span className={`font-semibold ${color}`}>{n}</span>;
};

/* ── Main ───────────────────────────────────────────────────────────────── */
const OrderEntryStatusTable = ({ typeName, finYear, compCode, finYr, closeTable, buyerCode, buyerCodes: buyerCodesProp }) => {
  const [selectedType, setSelectedType] = useState(typeName || "INTERNAL ORDER");
  const [selectedYear, setSelectedYear] = useState(finYear);
  const [selectedComp, setSelectedComp] = useState(compCode);
  const [selectedBuyer, setSelectedBuyer] = useState(buyerCode || "ALL");
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState({
    orderNo: "", buyerName: "", bpoNo: "", styleRefNo: "", color: "",
    docId: "", transType: "",
  });

  const resetPage   = () => setPage(1);
  const resetSearch = () => setSearch({
    orderNo: "", buyerName: "", bpoNo: "", styleRefNo: "", color: "",
    docId: "", transType: "",
  });

  // ── buyer dropdown list: use prop from chart (already complete), fallback to ["ALL"] ──
  const buyerCodes = buyerCodesProp?.length ? buyerCodesProp : ["ALL"];

  const qParams = { params: { finYear: selectedYear, companyName: selectedComp, buyerCode: selectedBuyer } };
  const skip    = !selectedYear || !selectedComp;

  /* ── Fetch all ── */
  const { data: ioRes,  isLoading: ioL,  isFetching: ioF  } = useGetOrderEntryStatusTableQuery(
    { params: { finYear: selectedYear, companyName: selectedComp, buyerCode: selectedBuyer, typeName: selectedType } },
    { skip: skip || selectedType !== "INTERNAL ORDER" },
  );
  const { data: fpRes,  isLoading: fpL,  isFetching: fpF  } = useGetfabricProcessPlanTableQuery(
    qParams, { skip: skip || selectedType !== "FABRIC PROCESS PLAN" });
  const { data: accRes, isLoading: accL, isFetching: accF } = useGetAccessoriesPlanTableQuery(
    qParams, { skip: skip || selectedType !== "ACCESSORIES PLAN" });
  const { data: cmtRes, isLoading: cmtL, isFetching: cmtF } = useGetCMTPlanTableQuery(
    qParams, { skip: skip || selectedType !== "CMT PLAN" });
  const { data: pbRes,  isLoading: pbL,  isFetching: pbF  } = useGetPreBudjetTableQuery(
    qParams, { skip: skip || selectedType !== "PRE - BUDGET" });

  /* ── Raw data by type ── */
  const rawData = useMemo(() => {
    const pick = (res) => Array.isArray(res?.data) ? res.data : [];
    switch (selectedType) {
      case "INTERNAL ORDER":      return pick(ioRes);
      case "FABRIC PROCESS PLAN": return pick(fpRes);
      case "ACCESSORIES PLAN":    return pick(accRes);
      case "CMT PLAN":            return pick(cmtRes);
      case "PRE - BUDGET":        return pick(pbRes);
      default: return [];
    }
  }, [selectedType, ioRes, fpRes, accRes, cmtRes, pbRes]);

  const isLoading  = ioL  || fpL  || accL  || cmtL  || pbL;
  const isFetching = ioF  || fpF  || accF  || cmtF  || pbF;

  /* ── Filter ── */
  const textMatch = (row, field, val) =>
    !val || String(row[field] ?? "").toLowerCase().includes(val.toLowerCase());

  const filtered = useMemo(() => {
    if (selectedType === "INTERNAL ORDER") {
      return rawData.filter((r) =>
        textMatch(r, "orderNo",    search.orderNo)   &&
        textMatch(r, "buyerName",  search.buyerName)  &&
        textMatch(r, "bpoNo",      search.bpoNo)      &&
        textMatch(r, "styleRefNo", search.styleRefNo) &&
        textMatch(r, "color",      search.color)
      );
    }
    return rawData.filter((r) =>
      textMatch(r, "orderNo",   search.orderNo)   &&
      textMatch(r, "buyerName", search.buyerName)  &&
      textMatch(r, "transType", search.transType)
    );
  }, [rawData, search, selectedType]);

  /* ── Pagination ── */
  const totalPages  = Math.ceil(filtered.length / RECORDS) || 1;
  const currentRows = filtered.slice((page - 1) * RECORDS, page * RECORDS);

  /* ── Helpers ── */
  const LoadingRow = ({ cols }) => (
    <tr><td colSpan={cols} className="text-center py-10 text-gray-400 text-xs">Loading...</td></tr>
  );
  const EmptyRow = ({ cols }) => (
    <tr><td colSpan={cols} className="text-center py-10 text-gray-500 text-xs">No data found</td></tr>
  );

  /* ── Excel ── */
  const handleExport = async () => {
    if (!filtered.length) { alert("No data"); return; }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Order Entry Status");

    const isIO  = selectedType === "INTERNAL ORDER";
    const isFP  = selectedType === "FABRIC PROCESS PLAN";
    const isACC = selectedType === "ACCESSORIES PLAN";
    const isCMT = selectedType === "CMT PLAN";
    const isPB  = selectedType === "PRE - BUDGET";

    const buildPlanCols = (docLabel, dateLabel, includeTransType = true) => [
      { header: "S.No",       key: "sno",       width: 6  },
      { header: docLabel,     key: "docId",     width: 24 },
      { header: dateLabel,    key: "docDate",   width: 14 },
      ...(includeTransType ? [{ header: "Trans Type", key: "transType", width: 14 }] : []),
      { header: "Order No",   key: "orderNo",   width: 24 },
      { header: "Order Date", key: "orderDate", width: 14 },
      { header: "Buyer Name", key: "buyerName", width: 32 },
      { header: "Age (Days)", key: "age",       width: 12 },
    ];

    const columns = isIO ? [
      { header: "S.No",         key: "sno",           width: 6  },
      { header: "Order No",     key: "orderNo",       width: 28 },
      { header: "Order Date",   key: "orderDate",     width: 14 },
      { header: "Buyer Name",   key: "buyerName",     width: 32 },
      { header: "BPO No",       key: "bpoNo",         width: 28 },
      { header: "BPO Date",     key: "bpoDate",       width: 18 },
      { header: "Style Ref No", key: "styleRefNo",    width: 18 },
      { header: "Color",        key: "color",         width: 28 },
      { header: "Pack Type",    key: "orderPackType", width: 18 },
      { header: "Order Qty",    key: "orderQty",      width: 18 },
      { header: "Excess Qty",   key: "excessQty",     width: 18 },
      { header: "Amount",       key: "amount",        width: 18 },
    ] : buildPlanCols(
      isFP  ? "Plan No"       : isACC ? "Acc Plan No"   : isPB ? "Budget No"   : "Doc No",
      isFP  ? "Plan Date"     : isACC ? "Acc Plan Date" : isPB ? "Budget Date" : "Doc Date",
      !(isPB || isCMT),
    );

    ws.columns = columns;
    const colCount = columns.length;
    const mergeEnd = String.fromCharCode(64 + colCount);

    // ── Row 1: Title ──
    ws.insertRow(1, [`Order Entry Status — ${selectedType}`]);
    ws.mergeCells(`A1:${mergeEnd}1`);
    const tc = ws.getCell("A1");
    tc.font      = { bold: true, size: 14, color: { argb: "FF000000" } };
    tc.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 30;

    // ── Row 2: Insights ──
    addInsightsRowTurnOver({
      worksheet: ws, startRow: 2, totalColumns: 4,
      selectedYear, localCompany: selectedComp,
      dynamicField:"Buyer Code", dynamicValue:selectedBuyer ,
      secondDynamicField:  "Order Type", seconddynamicValue:  selectedType,
    });

    // ── Row 3: Headers ──
    const hr = ws.getRow(3);
    hr.height = 26;
    hr.eachCell((cell) => {
      cell.font      = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9D9D9" } };
      cell.border    = { top:{style:"thin"}, bottom:{style:"thin"}, left:{style:"thin"}, right:{style:"thin"} };
    });

    // ── Data rows ──
    filtered.forEach((r, i) => {
      if (isIO) {
        ws.addRow({
          sno: i+1, orderNo: r.orderNo, orderDate: fmtDate(r.orderDate),
          buyerName: r.buyerName, bpoNo: r.bpoNo, bpoDate: fmtDate(r.bpoDate),
          styleRefNo: r.styleRefNo, color: r.color, orderPackType: r.orderPackType,
          orderQty: Number(r.orderQty||0), excessQty: Number(r.excessQty||0), amount: Number(r.amount||0),
        });
      } else {
        ws.addRow({
          sno:      i + 1,
          docId:    isFP ? r.planNo : isACC ? r.accplanNo : r.docId,
          docDate:  fmtDate(isFP ? r.planDate : isACC ? r.accplanDate : r.docDate),
          ...((isPB || isCMT) ? {} : { transType: r.transType || "" }),
          orderNo:   r.orderNo,
          orderDate: fmtDate(r.orderDate),
          buyerName: r.buyerName,
          age:       Number(r.age || 0),
        });
      }
    });

    // ── Style data rows ──
    ws.eachRow((row, rn) => {
      if (rn <= 3) return;
      row.height = 22;
      row.eachCell((cell, cn) => {
        const key = columns[cn - 1]?.key;
        cell.alignment = {
          horizontal:
            key === "sno"                                          ? "center" :
            ["orderQty","excessQty","amount","age"].includes(key) ? "right"  : "left",
          vertical: "middle", indent: 1,
        };
        if (["orderQty","excessQty"].includes(key)) cell.numFmt = getExcelQtyFormatByUOM("");
        if (key === "amount") { cell.font = { color: { argb: "FF16A34A" } }; cell.numFmt = "#,##0.00"; }
        if (key === "age") {
          const v = Number(cell.value || 0);
          cell.font = { bold: true, color: { argb: v <= 7 ? "FF16A34A" : v <= 15 ? "FFF59E0B" : "FFEF4444" } };
        }
      });
    });

    // ── Totals row (IO only) ──
    if (isIO) {
      const totQty = filtered.reduce((s, r) => s + Number(r.orderQty  || 0), 0);
      const totExc = filtered.reduce((s, r) => s + Number(r.excessQty || 0), 0);
      const totAmt = filtered.reduce((s, r) => s + Number(r.amount    || 0), 0);
      const tr = ws.addRow({
        sno:"", orderNo:"", orderDate:"", buyerName:"", bpoNo:"", bpoDate:"",
        styleRefNo:"", color:"TOTAL", orderPackType:"",
        orderQty: totQty, excessQty: totExc, amount: totAmt,
      });
      tr.height = 24;
      tr.eachCell((cell, cn) => {
        const key = columns[cn-1]?.key;
        cell.font      = { bold: true };
        cell.border    = { top: { style: "thin" } };
        cell.alignment = {
          horizontal: ["orderQty","excessQty","amount"].includes(key) ? "right" : "center",
          vertical: "middle", indent: 1,
        };
        if (["orderQty","excessQty"].includes(key)) {
          cell.numFmt = getExcelQtyFormatByUOM("");
          cell.font   = { bold: true, color: { argb: "FF1D4ED8" } };
        }
        if (key === "amount") {
          cell.font   = { bold: true, color: { argb: "FF16A34A" } };
          cell.numFmt = "#,##0.00";
        }
      });
    }

    ws.views = [{ state: "frozen", ySplit: 3 }];
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      `OrderEntry_${selectedType.replace(/ /g, "_")}_${selectedBuyer}_${selectedYear}.xlsx`,
    );
  };

  /* ── Render ── */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1470px] h-[630px] p-4 rounded-xl relative">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase">
            Order Entry Status – <span className="text-blue-600">{selectedComp}</span>
          </h2>
          <div className="flex gap-2 items-center">
            <div className="bg-gray-300 rounded-lg shadow-2xl flex gap-x-2 gap-1 p-2 flex-wrap items-center">

              {/* Year */}
              <select value={selectedYear}
                onChange={(e) => { setSelectedYear(e.target.value); resetPage(); }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-24">
                <option value="" disabled>Select Year</option>
                {(finYr?.data || []).map((item) => (
                  <option key={item.finYear} value={item.finYear}>{item.finYear}</option>
                ))}
              </select>

              {/* Company */}
              <select value={selectedComp}
                onChange={(e) => { setSelectedComp(e.target.value); resetPage(); }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-24">
                <option value="JKC">JKC</option>
              </select>

              {/* ── Buyer ── */}
              <select value={selectedBuyer}
                onChange={(e) => { setSelectedBuyer(e.target.value); resetPage(); }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-28">
                {buyerCodes.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>

              {/* Type */}
              <select value={selectedType}
                onChange={(e) => { setSelectedType(e.target.value); resetSearch(); resetPage(); }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-48">
                {ORDER_TYPES.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* Excel */}
              <button onClick={handleExport}
                className="p-0 rounded-full shadow-md hover:brightness-110 transition-all duration-300"
                title="Download Excel">
                <img src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
                  alt="Excel" className="w-7 h-7 rounded-lg" />
              </button>
            </div>
            <button className="text-red-600" onClick={closeTable}>
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* RECORD COUNT */}
        <p className="text-xs font-semibold text-gray-600 mt-0.5">
          Total Records: <span className="text-blue-600">{filtered.length}</span>
        </p>

        {/* SEARCH */}
        <div className="flex justify-between items-start mt-2">
          {selectedType === "INTERNAL ORDER" && (
            <SearchBar
              keys={["orderNo", "buyerName", "bpoNo", "styleRefNo", "color"]}
              state={search}
              setState={(val) => { setSearch(val); resetPage(); }}
            />
          )}
          {["FABRIC PROCESS PLAN","ACCESSORIES PLAN","CMT PLAN","PRE - BUDGET"].includes(selectedType) && (
            <SearchBar
              keys={["orderNo", "buyerName", "transType"]}
              state={search}
              setState={(val) => { setSearch(val); resetPage(); }}
            />
          )}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto border border-gray-300"
          style={{ height: "470px", border: "1px solid gray", borderRadius: "16px" }}>

          {/* ── INTERNAL ORDER ── */}
          {selectedType === "INTERNAL ORDER" && (
            <table className="w-[1600px] border-collapse text-[11px] table-fixed">
              <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                <tr>
                  <TH cls="w-8">S.No</TH>
                  <TH cls="w-36">Order No</TH>
                  <TH cls="w-24">Order Date</TH>
                  <TH cls="w-44">Buyer Name</TH>
                  <TH cls="w-40">BPO No</TH>
                  <TH cls="w-24">BPO Date</TH>
                  <TH cls="w-28">Style Ref No</TH>
                  <TH cls="w-44">Color</TH>
                  <TH cls="w-20">Pack Type</TH>
                  <TH cls="w-20">Order Qty</TH>
                  <TH cls="w-20">Excess Qty</TH>
                  <TH cls="w-24">Amount</TH>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? <LoadingRow cols={12} /> :
                 currentRows.length === 0 ? <EmptyRow cols={12} /> :
                 currentRows.map((row, i) => (
                  <tr key={i} className="text-gray-800 bg-white even:bg-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="border p-1 text-center text-gray-500">{(page-1)*RECORDS+i+1}</td>
                    <td className="border p-1 pl-2">{row.orderNo}</td>
                    <td className="border p-1 pl-1">{fmtDate(row.orderDate)}</td>
                    <td className="border p-1 pl-2">{row.buyerName}</td>
                    <td className="border p-1 pl-2">{row.bpoNo}</td>
                    <td className="border p-1 pl-1">{fmtDate(row.bpoDate)}</td>
                    <td className="border p-1 pl-2">{row.styleRefNo}</td>
                    <td className="border p-1 pl-2">{row.color}</td>
                    <td className="border p-1 text-left pl-2">{row.orderPackType}</td>
                    <td className="border p-1 pr-2 text-right">{formatQtyByUOM(row.orderQty, row.orderPackType)}</td>
                    <td className="border p-1 pr-2 text-right">{formatQtyByUOM(row.excessQty, row.orderPackType)}</td>
                    <td className="border p-1 pr-2 text-right text-sky-700">{INR(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ── FABRIC PROCESS PLAN ── */}
          {selectedType === "FABRIC PROCESS PLAN" && (
            <table className="w-[1420px] border-collapse text-[11px] table-fixed">
              <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                <tr>
                  <TH cls="w-8">S.No</TH>
                  <TH cls="w-36">Plan No</TH>
                  <TH cls="w-24">Plan Date</TH>
                  <TH cls="w-24">Trans Type</TH>
                  <TH cls="w-36">Order No</TH>
                  <TH cls="w-24">Order Date</TH>
                  <TH cls="w-44">Buyer Name</TH>
                  <TH cls="w-20">Age (Days)</TH>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? <LoadingRow cols={8} /> :
                 currentRows.length === 0 ? <EmptyRow cols={8} /> :
                 currentRows.map((row, i) => (
                  <tr key={i} className="text-gray-800 bg-white even:bg-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="border p-1 text-center text-gray-500">{(page-1)*RECORDS+i+1}</td>
                    <td className="border p-1 pl-2">{row.planNo}</td>
                    <td className="border p-1 pl-2">{fmtDate(row.planDate)}</td>
                    <td className="border p-1 text-left pl-2">{row.transType}</td>
                    <td className="border p-1 pl-2">{row.orderNo}</td>
                    <td className="border p-1 pl-2">{fmtDate(row.orderDate)}</td>
                    <td className="border p-1 pl-2">{row.buyerName}</td>
                    <td className="border p-1 pr-2 text-right"><AgeBadge age={row.age} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ── ACCESSORIES PLAN ── */}
          {selectedType === "ACCESSORIES PLAN" && (
            <table className="w-[1420px] border-collapse text-[11px] table-fixed">
              <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                <tr>
                  <TH cls="w-8">S.No</TH>
                  <TH cls="w-36">Acc Plan No</TH>
                  <TH cls="w-24">Acc Plan Date</TH>
                  <TH cls="w-24">Trans Type</TH>
                  <TH cls="w-36">Order No</TH>
                  <TH cls="w-24">Order Date</TH>
                  <TH cls="w-44">Buyer Name</TH>
                  <TH cls="w-20">Age (Days)</TH>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? <LoadingRow cols={8} /> :
                 currentRows.length === 0 ? <EmptyRow cols={8} /> :
                 currentRows.map((row, i) => (
                  <tr key={i} className="text-gray-800 bg-white even:bg-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="border p-1 text-center text-gray-500">{(page-1)*RECORDS+i+1}</td>
                    <td className="border p-1 pl-2">{row.accplanNo}</td>
                    <td className="border p-1 pl-2">{fmtDate(row.accplanDate)}</td>
                    <td className="border p-1 text-left pl-2">{row.transType}</td>
                    <td className="border p-1 pl-2">{row.orderNo}</td>
                    <td className="border p-1 pl-2">{fmtDate(row.orderDate)}</td>
                    <td className="border p-1 pl-2">{row.buyerName}</td>
                    <td className="border p-1 pr-2 text-right"><AgeBadge age={row.age} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ── CMT PLAN ── */}
          {selectedType === "CMT PLAN" && (
            <table className="w-[1420px] border-collapse text-[11px] table-fixed">
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
                {isLoading || isFetching ? <LoadingRow cols={7} /> :
                 currentRows.length === 0 ? <EmptyRow cols={7} /> :
                 currentRows.map((row, i) => (
                  <tr key={i} className="text-gray-800 bg-white even:bg-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="border p-1 text-center text-gray-500">{(page-1)*RECORDS+i+1}</td>
                    <td className="border p-1 pl-2">{row.docId}</td>
                    <td className="border p-1 pl-2">{fmtDate(row.docDate)}</td>
                    <td className="border p-1 pl-2">{row.orderNo}</td>
                    <td className="border p-1 pl-2">{fmtDate(row.orderDate)}</td>
                    <td className="border p-1 pl-2">{row.buyerName}</td>
                    <td className="border p-1 pr-2 text-right"><AgeBadge age={row.age} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ── PRE - BUDGET ── */}
          {selectedType === "PRE - BUDGET" && (
            <table className="w-[1420px] border-collapse text-[11px] table-fixed">
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
                {isLoading || isFetching ? <LoadingRow cols={7} /> :
                 currentRows.length === 0 ? <EmptyRow cols={7} /> :
                 currentRows.map((row, i) => (
                  <tr key={i} className="text-gray-800 bg-white even:bg-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="border p-1 text-center text-gray-500">{(page-1)*RECORDS+i+1}</td>
                    <td className="border p-1 pl-2">{row.docId}</td>
                    <td className="border p-1 pl-2">{fmtDate(row.docDate)}</td>
                    <td className="border p-1 pl-2">{row.orderNo}</td>
                    <td className="border p-1 pl-2">{fmtDate(row.orderDate)}</td>
                    <td className="border p-1 pl-2">{row.buyerName}</td>
                    <td className="border p-1 pr-2 text-right"><AgeBadge age={row.age} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
        <Pagination page={page} total={totalPages} setPage={setPage} />
      </div>
    </div>
  );
};

export default OrderEntryStatusTable;
import { useState, useMemo } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaStepBackward,
  FaStepForward,
  FaSearch,
  FaTable,
  FaList,
} from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  useGetProductionTableQuery,
  useGetProductionSummaryTableQuery,
} from "../../../../redux/service/production";
import moment from "moment";
import {
  addInsightsRowTurnOver,
  formatQtyByUOM,
  getExcelQtyFormatByUOM,
} from "../../../../utils/hleper";

const RECORDS = 34;
const fmtDate = (d) => (d ? moment(d).format("DD-MM-YYYY") : "");

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
const SearchBar = ({ keys, labels, state, setState }) => (
  <div className="flex gap-x-3 mb-2 flex-wrap">
    {keys.map((key) => (
      <div key={key} className="relative">
        <input
          type="text"
          placeholder={`Search ${labels[key] || key}...`}
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

/* ── Summary Table ── */
const SummaryTable = ({
  data,
  isLoading,
  isFetching,
  page,
  setPage,
  search,
  setSearch,
}) => {
  const SUMMARY_RECORDS = 30;

  const textMatch = (row, field, val) =>
    !val ||
    String(row[field] ?? "")
      .toLowerCase()
      .includes(val.toLowerCase());

  const filteredData = useMemo(
    () =>
      data.filter(
        (r) =>
          textMatch(r, "ORDERNO", search.ORDERNO) &&
          textMatch(r, "BUYERNAME", search.BUYERNAME) &&
          textMatch(r, "STYLEREFNO", search.STYLEREFNO) &&
          textMatch(r, "COLORNAME", search.COLORNAME),
      ),
    [data, search],
  );

  const totalPages = Math.ceil(filteredData.length / SUMMARY_RECORDS) || 1;
  const currentRows = filteredData.slice(
    (page - 1) * SUMMARY_RECORDS,
    page * SUMMARY_RECORDS,
  );

  const fmt = (n) => Number(n || 0).toLocaleString("en-IN");

  const qtyCell = (val) => (
    <td className="border p-1 pr-2 text-right">{fmt(val)}</td>
  );

  return (
    <div>
      {/* Summary Search Bar */}
      <SearchBar
        keys={["ORDERNO", "BUYERNAME", "STYLEREFNO", "COLORNAME"]}
        labels={{
          ORDERNO: "Order No",
          BUYERNAME: "Buyer Name",
          STYLEREFNO: "Style Ref",
          COLORNAME: "Color",
        }}
        state={search}
        setState={(val) => {
          setSearch(val);
          setPage(1);
        }}
      />
      <div
        className="overflow-x-auto border border-gray-300"
        style={{ height: "455px", borderRadius: "12px" }}
      >
        <table className="w-[2000px] overflow-auto border-collapse text-[11px] table-fixed">
          <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
            <tr>
              <TH cls="w-6">S.No</TH>
              <TH cls="w-32">Order No</TH>
              <TH cls="w-24">Style Ref</TH>
              <TH cls="w-36">Buyer Name</TH>
              <TH cls="w-40">Color</TH>
              <TH cls="w-40">Style Group</TH>
              <TH cls="w-48">Style Item</TH>
              <TH cls="w-24">Uom</TH>
              <TH cls="w-20">Order Qty</TH>
              <TH cls="w-24">Production Qty</TH>
              <TH cls="w-20">Cutting</TH>
              <TH cls="w-20">Power Table</TH>
              <TH cls="w-20">Singer</TH>
              <TH cls="w-20">Sewing</TH>
              <TH cls="w-16">Checking</TH>
              <TH cls="w-16">Ironing</TH>
              <TH cls="w-16">Packing</TH>
              {/* <TH cls="w-16">Total</TH> */}
            </tr>
          </thead>
          <tbody>
            {isLoading || isFetching ? (
              <tr>
                <td
                  colSpan={14}
                  className="text-center py-10 text-gray-400 text-xs"
                >
                  Loading...
                </td>
              </tr>
            ) : currentRows.length === 0 ? (
              <tr>
                <td
                  colSpan={15}
                  className="text-center py-10 text-gray-500 text-xs"
                >
                  No data found
                </td>
              </tr>
            ) : (
              <>
                {currentRows.map((row, i) => (
                  <tr
                    key={i}
                    className="text-gray-800 bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors"
                  >
                    <td className="border p-1 text-center text-gray-500">
                      {(page - 1) * SUMMARY_RECORDS + i + 1}
                    </td>
                    <td className="border p-1 pl-2 ">{row.ORDERNO}</td>
                    <td className="border p-1 pl-2">{row.STYLEREFNO}</td>
                    <td className="border p-1 pl-2">{row.BUYERNAME}</td>
                    <td className="border p-1 pl-2">{row.COLORNAME}</td>
                    <td className="border p-1 pl-2">{row.STYLEGROUP}</td>
                    <td className="border p-1 pl-2">{row.STYLEITEM}</td>
                    <td className="border p-1 pl-2">{row.ORDERUOM}</td>
                    {qtyCell(row.ORDERQTY)}
                    {qtyCell(row.TOTPRODQTY)}
                    {qtyCell(row.CUTTING_QTY)}
                    {qtyCell(row.POWERTABLE_QTY)}
                    {qtyCell(row.SINGER_QTY)}
                    {qtyCell(row.SEWING_QTY)}
                    {qtyCell(row.CHECKING_QTY)}
                    {qtyCell(row.IRONING_QTY)}
                    {qtyCell(row.PACKING_QTY)}
                    {/* <td className="border p-1 pr-2 text-right font-bold text-blue-700">
                      {fmt(row.TOTAL_QTY)}
                    </td> */}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={totalPages} setPage={setPage} />
    </div>
  );
};

/* ── Main ── */
const ProductionDetailTable = ({
  companyName,
  fromDate: initFromDate,
  toDate: initToDate,
  processName: initProcessName,
  storeId: initStoreId,
  onClose,
}) => {
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const [selectedProcess, setSelectedProcess] = useState(
    initProcessName || "ALL",
  );
  const [selectedStore, setSelectedStore] = useState(initStoreId || "ALL");
  const [page, setPage] = useState(1);
  const [selectedComp, setSelectedComp] = useState(companyName);
  const [isSummaryMode, setIsSummaryMode] = useState(false); // ← toggle state

  const [search, setSearch] = useState({
    ORDERNO: "",
    BUYERNAME: "",
    STYLEREFNO: "",
    COLORNAME: "",
  });

  const [summarySearch, setSummarySearch] = useState({
    ORDERNO: "",
    BUYERNAME: "",
    STYLEREFNO: "",
    COLORNAME: "",
  });

  const resetPage = () => setPage(1);

  /* ── Fetch Detail ── */
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetProductionTableQuery(
    {
      params: {
        compCode: selectedComp,
        fromDate,
        toDate,
        processName: "ALL", // ← always fetch ALL
        storeId: "ALL", // ← always fetch ALL
      },
    },
    { skip: !selectedComp || !fromDate || !toDate || isSummaryMode },
  );

  /* ── Fetch Summary ── */
  const {
    data: summaryResponse,
    isLoading: summaryLoading,
    isFetching: summaryFetching,
  } = useGetProductionSummaryTableQuery(
    {
      params: {
        compCode: selectedComp,
        fromDate,
        toDate,
        storeId: selectedStore,
      },
    },
    { skip: !selectedComp || !fromDate || !toDate || !isSummaryMode },
  );

  const rawData = useMemo(
    () => (Array.isArray(response?.data) ? response.data : []),
    [response],
  );

  const summaryData = useMemo(
    () => (Array.isArray(summaryResponse?.data) ? summaryResponse.data : []),
    [summaryResponse],
  );

  // Derive options from the FULL unfiltered rawData
  const processOptions = useMemo(() => {
    const names = [
      ...new Set(rawData.map((r) => r.PROCESSNAME).filter(Boolean)),
    ];
    return ["ALL", ...names];
  }, [rawData]);

  const storeOptions = useMemo(() => {
    const stores = [
      ...new Set(rawData.map((r) => r.STOREID).filter((x) => x?.trim())),
    ];
    return ["ALL", ...stores];
  }, [rawData]);

  // Apply process + store filter client-side
  const clientFiltered = useMemo(() => {
    return rawData.filter((r) => {
      const matchProcess =
        selectedProcess === "ALL" || r.PROCESSNAME === selectedProcess;
      const matchStore = selectedStore === "ALL" || r.STOREID === selectedStore;
      return matchProcess && matchStore;
    });
  }, [rawData, selectedProcess, selectedStore]);

  /* ── Text filter ── */
  const textMatch = (row, field, val) =>
    !val ||
    String(row[field] ?? "")
      .toLowerCase()
      .includes(val.toLowerCase());

  const filtered = useMemo(
    () =>
      clientFiltered.filter(
        // ← was rawData
        (r) =>
          textMatch(r, "ORDERNO", search.ORDERNO) &&
          textMatch(r, "BUYERNAME", search.BUYERNAME) &&
          textMatch(r, "STYLEREFNO", search.STYLEREFNO) &&
          textMatch(r, "COLORNAME", search.COLORNAME),
      ),
    [clientFiltered, search],
  );

  /* ── Totals ── */
  const totalQty = useMemo(
    () => filtered.reduce((sum, r) => sum + Number(r.QTY || 0), 0),
    [filtered],
  );

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

  /* ── Excel Export ── */
  const handleExport = async () => {
    if (!filtered.length) {
      alert("No data to export");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Production Detail");

    const columns = [
      { header: "S.No", key: "sno", width: 6 },
      { header: "Process", key: "PROCESSNAME", width: 25 },
      { header: "Store ID", key: "STOREID", width: 45 },
      { header: "Doc Date", key: "DOCDATE", width: 16 },
      { header: "Order No", key: "ORDERNO", width: 32 },
      { header: "Style Ref No", key: "STYLEREFNO", width: 22 },
      { header: "Buyer Name", key: "BUYERNAME", width: 40 },
      { header: "Color", key: "COLORNAME", width: 40 },
      { header: "Qty", key: "QTY", width: 16 },
    ];

    ws.columns = columns;
    const mergeEnd = String.fromCharCode(64 + columns.length);

    ws.insertRow(1, ["Production Detail"]);
    ws.mergeCells(`A1:${mergeEnd}1`);
    const tc = ws.getCell("A1");
    tc.font = { bold: true, size: 13, color: { argb: "FF000000" } };
    tc.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 28;

    addInsightsRowTurnOver({
      worksheet: ws,
      startRow: 2,
      totalColumns: columns.length,
      localCompany: selectedComp,
      disableFinYear: true,
      dynamicField: "From Date",
      dynamicValue: fmtDate(fromDate),
      secondDynamicField: "To Date",
      seconddynamicValue: fmtDate(toDate),
      thirdDynamicField: "Process",
      thirdDynamicValue: selectedProcess,
      fourthDynamicField: "Unit",
      fourthDynamicValue: selectedStore,
    });

    const hr = ws.getRow(3);
    hr.height = 24;
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
      ws.addRow({
        sno: i + 1,
        PROCESSNAME: r.PROCESSNAME,
        STOREID: r.STOREID,
        DOCDATE: fmtDate(r.DOCDATE),
        ORDERNO: r.ORDERNO,
        STYLEREFNO: r.STYLEREFNO,
        BUYERNAME: r.BUYERNAME,
        COLORNAME: r.COLORNAME,
        QTY: Number(r.QTY || 0),
      });
    });

    ws.eachRow((row, rn) => {
      if (rn <= 3) return;
      row.height = 20;
      row.eachCell((cell, cn) => {
        const key = columns[cn - 1]?.key;
        cell.alignment = {
          horizontal:
            key === "sno" ? "center" : key === "QTY" ? "right" : "left",
          vertical: "middle",
          indent: 1,
        };
        if (key === "QTY") cell.numFmt = "#,##0";
      });
    });

    const tr = ws.addRow({
      sno: "",
      PROCESSNAME: "",
      STOREID: "",
      DOCDATE: "",
      ORDERNO: "",
      STYLEREFNO: "",
      BUYERNAME: "TOTAL",
      COLORNAME: "",
      QTY: totalQty,
    });
    tr.height = 22;
    tr.eachCell((cell, cn) => {
      const key = columns[cn - 1]?.key;
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        horizontal: key === "QTY" ? "right" : "left",
        vertical: "middle",
        indent: 1,
      };
      if (key === "QTY") cell.numFmt = "#,##0";
    });

    ws.views = [{ state: "frozen", ySplit: 3 }];

    const buf = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `Production_${selectedProcess}_${selectedComp}_${fromDate}_${toDate}.xlsx`,
    );
  };
  const handleSummaryExport = async () => {
    const summaryFiltered = summaryData.filter(
      (r) =>
        (!summarySearch.ORDERNO ||
          String(r.ORDERNO ?? "")
            .toLowerCase()
            .includes(summarySearch.ORDERNO.toLowerCase())) &&
        (!summarySearch.BUYERNAME ||
          String(r.BUYERNAME ?? "")
            .toLowerCase()
            .includes(summarySearch.BUYERNAME.toLowerCase())) &&
        (!summarySearch.STYLEREFNO ||
          String(r.STYLEREFNO ?? "")
            .toLowerCase()
            .includes(summarySearch.STYLEREFNO.toLowerCase())) &&
        (!summarySearch.COLORNAME ||
          String(r.COLORNAME ?? "")
            .toLowerCase()
            .includes(summarySearch.COLORNAME.toLowerCase())),
    );

    if (!summaryFiltered.length) {
      alert("No data to export");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Production Summary");

    const columns = [
      { header: "S.No", key: "sno", width: 6 },
      { header: "Order No", key: "ORDERNO", width: 32 },
      { header: "Style Ref", key: "STYLEREFNO", width: 22 },
      { header: "Buyer Name", key: "BUYERNAME", width: 44 },
      { header: "Color", key: "COLORNAME", width: 30 },
      { header: "Style Group", key: "STYLEGROUP", width: 30 },
      { header: "Style Item", key: "STYLEITEM", width: 44 },
      { header: "UOM", key: "ORDERUOM", width: 16 },
      { header: "Order Qty", key: "ORDERQTY", width: 16 },
      { header: "Production Qty", key: "TOTPRODQTY", width: 18 },
      { header: "Cutting", key: "CUTTING_QTY", width: 16 },
      { header: "Power Table", key: "POWERTABLE_QTY", width: 16 },
      { header: "Singer", key: "SINGER_QTY", width: 16 },
      { header: "Sewing", key: "SEWING_QTY", width: 16 },
      { header: "Checking", key: "CHECKING_QTY", width: 16 },
      { header: "Ironing", key: "IRONING_QTY", width: 16 },
      { header: "Packing", key: "PACKING_QTY", width: 16 },
    ];

    ws.columns = columns;
    const mergeEnd = String.fromCharCode(64 + columns.length);

    // Title row
    ws.insertRow(1, ["Production Summary"]);
    ws.mergeCells(`A1:${mergeEnd}1`);
    const tc = ws.getCell("A1");
    tc.font = { bold: true, size: 13, color: { argb: "FF000000" } };
    tc.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 28;

    // Insights row (from/to date, unit)
    addInsightsRowTurnOver({
      worksheet: ws,
      startRow: 2,
      totalColumns: columns.length,
      localCompany: selectedComp,
      disableFinYear: true,
      dynamicField: "From Date",
      dynamicValue: fmtDate(fromDate),
      secondDynamicField: "To Date",
      seconddynamicValue: fmtDate(toDate),
      thirdDynamicField: "Unit",
      thirdDynamicValue: selectedStore,
    });

    // Header row styling
    const hr = ws.getRow(3);
    hr.height = 24;
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

    const qtyKeys = [
      "ORDERQTY",
      "TOTPRODQTY",
      "CUTTING_QTY",
      "POWERTABLE_QTY",
      "SINGER_QTY",
      "SEWING_QTY",
      "CHECKING_QTY",
      "IRONING_QTY",
      "PACKING_QTY",
    ];

    // Data rows
    summaryFiltered.forEach((r, i) => {
      ws.addRow({
        sno: i + 1,
        ORDERNO: r.ORDERNO,
        STYLEREFNO: r.STYLEREFNO,
        BUYERNAME: r.BUYERNAME,
        COLORNAME: r.COLORNAME,
        STYLEGROUP: r.STYLEGROUP,
        STYLEITEM: r.STYLEITEM,
        ORDERUOM: r.ORDERUOM,
        ORDERQTY: Number(r.ORDERQTY || 0),
        TOTPRODQTY: Number(r.TOTPRODQTY || 0),
        CUTTING_QTY: Number(r.CUTTING_QTY || 0),
        POWERTABLE_QTY: Number(r.POWERTABLE_QTY || 0),
        SINGER_QTY: Number(r.SINGER_QTY || 0),
        SEWING_QTY: Number(r.SEWING_QTY || 0),
        CHECKING_QTY: Number(r.CHECKING_QTY || 0),
        IRONING_QTY: Number(r.IRONING_QTY || 0),
        PACKING_QTY: Number(r.PACKING_QTY || 0),
      });
    });

    // Cell alignment + number format
    ws.eachRow((row, rn) => {
      if (rn <= 3) return;
      row.height = 20;
      row.eachCell((cell, cn) => {
        const key = columns[cn - 1]?.key;
        const isQty = qtyKeys.includes(key);
        cell.alignment = {
          horizontal: key === "sno" ? "center" : isQty ? "right" : "left",
          vertical: "middle",
          indent: 1,
        };
        if (isQty) cell.numFmt = "#,##0";
      });
    });

    // Totals row
    const totals = qtyKeys.reduce((acc, k) => {
      acc[k] = summaryFiltered.reduce((s, r) => s + Number(r[k] || 0), 0);
      return acc;
    }, {});

    const tr = ws.addRow({
      sno: "",
      ORDERNO: "",
      STYLEREFNO: "",
      BUYERNAME: "",
      COLORNAME: "",
      STYLEGROUP: "",
      STYLEITEM: "",
      ORDERUOM: "TOTAL",
      ...totals,
    });
    tr.height = 22;
    tr.eachCell((cell, cn) => {
      const key = columns[cn - 1]?.key;
      const isQty = qtyKeys.includes(key);
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        horizontal: isQty ? "right" : "left",
        vertical: "middle",
        indent: 1,
      };
      if (isQty) cell.numFmt = "#,##0";
    });

    ws.views = [{ state: "frozen", ySplit: 3 }];

    const buf = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `ProductionSummary_${selectedComp}_${fromDate}_${toDate}.xlsx`,
    );
  };
  /* ── Render ── */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1360px] h-[630px] p-4 rounded-xl relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase text-sm">
            Production {isSummaryMode ? "Summary" : "Detail"} —{" "}
            <span className="text-green-700">{companyName}</span>
          </h2>

          <div className="flex gap-2 items-center">
            <div className="bg-gray-300 rounded-lg shadow flex gap-x-2 p-2 flex-wrap items-center">
              {/* ── Summary Toggle Button ── */}
              <div className="flex gap-2">
                {[
                  {
                    label: "Summary",
                    value: true,
                  },
                  { label: "Detail", value: false },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setIsSummaryMode(item.value);
                      resetPage();
                      setSummarySearch({
                        ORDERNO: "",
                        BUYERNAME: "",
                        STYLEREFNO: "",
                        COLORNAME: "",
                      });
                    }}
                    title={`Switch to ${item.label} View`}
                    className={`flex items-center gap-1 px-3 py-1 text-[11px] font-semibold rounded-full shadow-md transition-all
        ${
          isSummaryMode === item.value
            ? "bg-blue-600 text-white scale-105"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }
        focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
              <select
                value={selectedComp}
                onChange={(e) => {
                  setSelectedComp(e.target.value);
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-24"
              >
                <option value="JKC">JKC</option>
                <option value="PSS">PSS</option>
              </select>
              {/* FROM DATE */}
              <input
                type="date"
                value={fromDate}
                max={toDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  resetPage();
                }}
                style={{
                  fontSize: "11px",
                  padding: "0px 6px",
                  borderRadius: "6px",
                  border: "2px solid #2563eb",
                }}
              />
              {/* TO DATE */}
              <input
                type="date"
                value={toDate}
                min={fromDate}
                onChange={(e) => {
                  if (new Date(e.target.value) >= new Date(fromDate)) {
                    setToDate(e.target.value);
                    resetPage();
                  }
                }}
                style={{
                  fontSize: "11px",
                  padding: "0px 6px",
                  borderRadius: "6px",
                  border: "2px solid #2563eb",
                }}
              />
              {/* PROCESS — hidden in summary mode */}
              {!isSummaryMode && (
                <select
                  value={selectedProcess}
                  onChange={(e) => {
                    setSelectedProcess(e.target.value);
                    resetPage();
                  }}
                  className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-36"
                >
                  {processOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              )}
              {/* STORE */}
              <select
                value={selectedStore}
                onChange={(e) => {
                  setSelectedStore(e.target.value);
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-92"
              >
                {storeOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {/* Excel — only in detail mode */}
              {!isSummaryMode && (
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
              )}
              {/* Excel — summary mode */} {/* ← ADD THIS */}
              {isSummaryMode && (
                <button
                  onClick={handleSummaryExport}
                  className="p-0 rounded-full shadow-md hover:brightness-110 transition-all duration-300"
                  title="Download Excel"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
                    alt="Excel"
                    className="w-7 h-7 rounded-lg"
                  />
                </button>
              )}
            </div>

            <button className="text-red-600" onClick={onClose}>
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* RECORD COUNT & TOTALS */}
        <div className="flex gap-6 mt-1">
          <p className="text-xs font-semibold text-gray-600">
            Total Records:{" "}
            <span className="text-blue-600">
              {isSummaryMode
                ? summaryData.filter(
                    (r) =>
                      (!summarySearch.ORDERNO ||
                        String(r.ORDERNO ?? "")
                          .toLowerCase()
                          .includes(summarySearch.ORDERNO.toLowerCase())) &&
                      (!summarySearch.BUYERNAME ||
                        String(r.BUYERNAME ?? "")
                          .toLowerCase()
                          .includes(summarySearch.BUYERNAME.toLowerCase())) &&
                      (!summarySearch.STYLEREFNO ||
                        String(r.STYLEREFNO ?? "")
                          .toLowerCase()
                          .includes(summarySearch.STYLEREFNO.toLowerCase())) &&
                      (!summarySearch.COLORNAME ||
                        String(r.COLORNAME ?? "")
                          .toLowerCase()
                          .includes(summarySearch.COLORNAME.toLowerCase())),
                  ).length
                : filtered.length}
            </span>
          </p>
          {!isSummaryMode && (
            <p className="text-xs font-semibold text-gray-600">
              Total Qty:{" "}
              <span className="text-green-600">
                {Number(totalQty).toLocaleString("en-IN")}
              </span>
            </p>
          )}
        </div>

        {/* SEARCH — only in detail mode */}
        {!isSummaryMode && (
          <div className="mt-2">
            <SearchBar
              keys={["ORDERNO", "BUYERNAME", "STYLEREFNO", "COLORNAME"]}
              labels={{
                ORDERNO: "Order No",
                BUYERNAME: "Buyer Name",
                STYLEREFNO: "Style Ref",
                COLORNAME: "Color",
              }}
              state={search}
              setState={(val) => {
                setSearch(val);
                resetPage();
              }}
            />
          </div>
        )}

        {/* ── DETAIL TABLE (unchanged) ── */}
        {!isSummaryMode && (
          <>
            <div
              className="overflow-x-auto border border-gray-300"
              style={{ height: "470px", borderRadius: "12px" }}
            >
              <table className="w-[1500px] overflow-y-auto border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                  <tr>
                    <TH cls="w-6">S.No</TH>
                    <TH cls="w-24">Process</TH>
                    <TH cls="w-60">Store ID</TH>
                    <TH cls="w-20">Doc Date</TH>
                    <TH cls="w-32">Order No</TH>
                    <TH cls="w-44">Buyer Name</TH>
                    <TH cls="w-28">Style Ref No</TH>
                    <TH cls="w-44">Color</TH>
                    <TH cls="w-16">Qty</TH>
                  </tr>
                </thead>
                <tbody>
                  {isLoading || isFetching ? (
                    <LoadingRow cols={9} />
                  ) : currentRows.length === 0 ? (
                    <EmptyRow cols={9} />
                  ) : (
                    currentRows.map((row, i) => (
                      <tr
                        key={i}
                        className="text-gray-800 bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors"
                      >
                        <td className="border p-1 text-center text-gray-500">
                          {(page - 1) * RECORDS + i + 1}
                        </td>
                        <td className="border p-1 pl-2 ">{row.PROCESSNAME}</td>
                        <td className="border p-1 pl-2">{row.STOREID}</td>
                        <td className="border p-1 pl-1">
                          {fmtDate(row.DOCDATE)}
                        </td>
                        <td className="border p-1 pl-2">{row.ORDERNO}</td>
                        <td className="border p-1 pl-2">{row.BUYERNAME}</td>
                        <td className="border p-1 pl-2">{row.STYLEREFNO}</td>
                        <td className="border p-1 pl-2">{row.COLORNAME}</td>
                        <td className="border p-1 pr-2 text-right ">
                          {Number(row.QTY || 0).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={page} total={totalPages} setPage={setPage} />
          </>
        )}

        {/* ── SUMMARY TABLE ── */}
        {isSummaryMode && (
          <div className="mt-2">
            <SummaryTable
              data={summaryData}
              isLoading={summaryLoading}
              isFetching={summaryFetching}
              page={page}
              setPage={setPage}
              search={summarySearch}
              setSearch={setSummarySearch}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionDetailTable;

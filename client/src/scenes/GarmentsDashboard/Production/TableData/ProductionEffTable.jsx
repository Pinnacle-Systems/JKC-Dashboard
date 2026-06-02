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
import { useGetProductionEfftableQuery } from "../../../../redux/service/production";
import moment from "moment";
import { addInsightsRowTurnOver } from "../../../../utils/hleper";

const RECORDS = 34;
const fmtDate = (d) => (d ? moment(d).format("DD-MM-YYYY") : "");
const fmtQty = (n) => Number(n || 0).toLocaleString("en-IN");

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

/* ── Main ── */
const ProductionEffTable = ({
  companyName,
  unit, // ← UNIT (location/store) from chart click
  processName, // ← process from chart click
  date, // ← date from chart click
  onClose,
  processOptions,
}) => {
  const [selectedProcess, setSelectedProcess] = useState(processName || "ALL");
  const [selectedUnit, setSelectedUnit] = useState(unit || "ALL");
  const [selectedDate, setSelectedDate] = useState(date || "");
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState({
    ORDERNO: "",
    COLORNAME: "",
    STYLEITEM: "",
  });

  const resetPage = () => setPage(1);

  /* ── Fetch ── */
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetProductionEfftableQuery(
    {
      params: {
        compCode: companyName,
        date: selectedDate,
        processName: selectedProcess,
        storeId: selectedUnit,
      },
    },
    { skip: !companyName || !selectedDate },
  );

  const rawData = useMemo(
    () => (Array.isArray(response?.data) ? response.data : []),
    [response],
  );

  const unitOptions = useMemo(() => {
    const units = [...new Set(rawData.map((r) => r.UNIT).filter(Boolean))];
    return ["ALL", ...units];
  }, [rawData]);

  /* ── Client-side filter (process + unit + text search) ── */
  const textMatch = (row, field, val) =>
    !val ||
    String(row[field] ?? "")
      .toLowerCase()
      .includes(val.toLowerCase());

  const filtered = useMemo(
    () =>
      rawData.filter(
        (r) =>
          (selectedProcess === "ALL" || r.PROCESSNAME === selectedProcess) &&
          (selectedUnit === "ALL" || r.UNIT === selectedUnit) &&
          textMatch(r, "ORDERNO", search.ORDERNO) &&
          textMatch(r, "COLORNAME", search.COLORNAME) &&
          textMatch(r, "STYLEITEM", search.STYLEITEM),
      ),
    [rawData, selectedProcess, selectedUnit, search],
  );

  /* ── Totals ── */
  const totals = useMemo(
    () =>
      filtered.reduce(
        (acc, r) => ({
          CUTTING: acc.CUTTING + Number(r.CUTTING || 0),
          CHECKING: acc.CHECKING + Number(r.CHECKING || 0),
          SINGER: acc.SINGER + Number(r.SINGER || 0),
          POWERTABLE: acc.POWERTABLE + Number(r.POWERTABLE || 0),
          SEWING: acc.SEWING + Number(r.SEWING || 0),
        }),
        { CUTTING: 0, CHECKING: 0, SINGER: 0, POWERTABLE: 0, SEWING: 0 },
      ),
    [filtered],
  );

  /* ── Pagination ── */
  const totalPages = Math.ceil(filtered.length / RECORDS) || 1;
  const currentRows = filtered.slice((page - 1) * RECORDS, page * RECORDS);

  /* ── Excel Export ── */
  const handleExport = async () => {
    if (!filtered.length) {
      alert("No data to export");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Production Efficiency");

    const columns = [
      { header: "S.No", key: "sno", width: 6 },
      { header: "Process", key: "PROCESSNAME", width: 20 },
      { header: "Unit", key: "UNIT", width: 30 },
      { header: "Doc Date", key: "PRODDATE", width: 16 },
      { header: "Order No", key: "ORDERNO", width: 32 },
      { header: "Style Item", key: "STYLEITEM", width: 36 },
      { header: "Color", key: "COLORNAME", width: 30 },
      { header: "Cutting", key: "CUTTING", width: 14 },
      { header: "Checking", key: "CHECKING", width: 14 },
      { header: "Singer", key: "SINGER", width: 14 },
      { header: "Power Table", key: "POWERTABLE", width: 14 },
      { header: "Sewing", key: "SEWING", width: 14 },
    ];

    ws.columns = columns;
    const mergeEnd = String.fromCharCode(64 + columns.length);

    ws.insertRow(1, ["Production Efficiency"]);
    ws.mergeCells(`A1:${mergeEnd}1`);
    const tc = ws.getCell("A1");
    tc.font = { bold: true, size: 13 };
    tc.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 28;

    addInsightsRowTurnOver({
      worksheet: ws,
      startRow: 2,
      totalColumns: columns.length,
      localCompany: companyName,
      disableFinYear: true,
      dynamicField: "Date",
      dynamicValue: fmtDate(selectedDate),
      secondDynamicField: "Process",
      seconddynamicValue: selectedProcess,
      thirdDynamicField: "Unit",
      thirdDynamicValue: selectedUnit,
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

    const qtyKeys = ["CUTTING", "CHECKING", "SINGER", "POWERTABLE", "SEWING"];

    filtered.forEach((r, i) => {
      ws.addRow({
        sno: i + 1,
        PROCESSNAME: r.PROCESSNAME,
        UNIT: r.UNIT,
        PRODDATE: fmtDate(r.PRODDATE),
        ORDERNO: r.ORDERNO,
        STYLEITEM: r.STYLEITEM,
        COLORNAME: r.COLORNAME,
        CUTTING: String(r.CUTTING),
        CHECKING: String(r.CHECKING),
        SINGER: String(r.SINGER),
        POWERTABLE: String(r.POWERTABLE),
        SEWING: String(r.SEWING),
      });
    });

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
      });
    });

    // Totals row
    const tr = ws.addRow({
      sno: "",
      PROCESSNAME: "",
      UNIT: "",
      PRODDATE: "",
      ORDERNO: "",
      STYLEITEM: "TOTAL",
      COLORNAME: "",
      // ← Also strings for totals
      CUTTING: String(totals.CUTTING),
      CHECKING: String(totals.CHECKING),
      SINGER: String(totals.SINGER),
      POWERTABLE: String(totals.POWERTABLE),
      SEWING: String(totals.SEWING),
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
    });

    ws.views = [{ state: "frozen", ySplit: 3 }];
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `ProductionEfficiency_${companyName}_${selectedProcess}_${selectedDate}.xlsx`,
    );
  };

  /* ── Render ── */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1360px] h-[630px] p-4 rounded-xl relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase text-sm">
            Production Efficiency —{" "}
            <span className="text-green-700">{companyName}</span>
          </h2>

          <div className="flex gap-2 items-center">
            <div className="bg-gray-300 rounded-lg shadow-2xl flex gap-x-2 p-2 flex-wrap items-center">
              {/* Date */}
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  resetPage();
                }}
                style={{
                  fontSize: "11px",
                  padding: "0px 6px",
                  borderRadius: "6px",
                  border: "2px solid #2563eb",
                }}
              />

              {/* Process */}
              <select
                value={selectedProcess}
                onChange={(e) => {
                  setSelectedProcess(e.target.value);
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-36"
              >
                {processOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              {/* Unit */}
              <select
                value={selectedUnit}
                onChange={(e) => {
                  setSelectedUnit(e.target.value);
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-60"
              >
                {unitOptions.map((u) => (
                  <option key={u} value={u}>
                    {u}
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

            <button className="text-red-600" onClick={onClose}>
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* TOTALS */}
        <div className="flex gap-6 mt-1 flex-wrap">
          <p className="text-xs font-semibold text-gray-600">
            Total Records:{" "}
            <span className="text-blue-600">{filtered.length}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Cutting:{" "}
            <span className="text-green-600">{fmtQty(totals.CUTTING)}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Checking:{" "}
            <span className="text-green-600">{fmtQty(totals.CHECKING)}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Singer:{" "}
            <span className="text-green-600">{fmtQty(totals.SINGER)}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Power Table:{" "}
            <span className="text-green-600">{fmtQty(totals.POWERTABLE)}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Sewing:{" "}
            <span className="text-green-600">{fmtQty(totals.SEWING)}</span>
          </p>
        </div>

        {/* SEARCH */}
        <div className="mt-2">
          <SearchBar
            keys={["ORDERNO", "COLORNAME", "STYLEITEM"]}
            labels={{
              ORDERNO: "Order No",
              COLORNAME: "Color",
              STYLEITEM: "Style Item",
            }}
            state={search}
            setState={(val) => {
              setSearch(val);
              resetPage();
            }}
          />
        </div>

        {/* TABLE */}
        <div
          className="overflow-x-auto border border-gray-300"
          style={{ height: "455px", borderRadius: "12px" }}
        >
          <table className="w-[1700px] border-collapse text-[11px] table-fixed">
            <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
              <tr>
                <TH cls="w-6">S.No</TH>
                <TH cls="w-28">Process</TH>
                <TH cls="w-60">Unit</TH>
                <TH cls="w-24">Doc Date</TH>
                <TH cls="w-36">Order No</TH>
                <TH cls="w-60">Style Item</TH>
                <TH cls="w-40">Color</TH>
                <TH cls="w-20">Cutting</TH>
                <TH cls="w-20">Checking</TH>
                <TH cls="w-20">Singer</TH>
                <TH cls="w-24">Power Table</TH>
                <TH cls="w-20">Sewing</TH>
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <tr>
                  <td
                    colSpan={12}
                    className="text-center py-10 text-gray-400 text-xs"
                  >
                    Loading...
                  </td>
                </tr>
              ) : currentRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="text-center py-10 text-gray-500 text-xs"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                currentRows.map((row, i) => (
                  <tr
                    key={i}
                    className="text-gray-800 bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors"
                  >
                    <td className="border p-1 text-center text-gray-500">
                      {(page - 1) * RECORDS + i + 1}
                    </td>
                    <td className="border p-1 pl-2">{row.PROCESSNAME}</td>
                    <td className="border p-1 pl-2">{row.UNIT}</td>
                    <td className="border p-1 pl-2">{fmtDate(row.PRODDATE)}</td>
                    <td className="border p-1 pl-2">{row.ORDERNO}</td>
                    <td className="border p-1 pl-2">{row.STYLEITEM}</td>
                    <td className="border p-1 pl-2">{row.COLORNAME}</td>
                    <td className="border p-1 pr-2 text-right">
                      {fmtQty(row.CUTTING)}
                    </td>
                    <td className="border p-1 pr-2 text-right">
                      {fmtQty(row.CHECKING)}
                    </td>
                    <td className="border p-1 pr-2 text-right">
                      {fmtQty(row.SINGER)}
                    </td>
                    <td className="border p-1 pr-2 text-right">
                      {fmtQty(row.POWERTABLE)}
                    </td>
                    <td className="border p-1 pr-2 text-right">
                      {fmtQty(row.SEWING)}
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

export default ProductionEffTable;

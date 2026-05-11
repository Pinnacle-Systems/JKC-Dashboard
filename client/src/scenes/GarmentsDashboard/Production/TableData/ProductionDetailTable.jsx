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
import { useGetProductionTableQuery } from "../../../../redux/service/production";
import moment from "moment";

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

  const [search, setSearch] = useState({
    ORDERNO: "",
    BUYERNAME: "",
    STYLEREFNO: "",
    COLORNAME: "",
  });

  const resetPage = () => setPage(1);

  /* ── Fetch ── */
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetProductionTableQuery(
    {
      params: {
        compCode: companyName,
        fromDate,
        toDate,
        processName: selectedProcess,
        storeId: selectedStore,
      },
    },
    { skip: !companyName || !fromDate || !toDate },
  );

  const rawData = useMemo(
    () => (Array.isArray(response?.data) ? response.data : []),
    [response],
  );

  /* ── Derived filter options ── */
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

  /* ── Text filter ── */
  const textMatch = (row, field, val) =>
    !val ||
    String(row[field] ?? "")
      .toLowerCase()
      .includes(val.toLowerCase());

  const filtered = useMemo(
    () =>
      rawData.filter(
        (r) =>
          textMatch(r, "ORDERNO", search.ORDERNO) &&
          textMatch(r, "BUYERNAME", search.BUYERNAME) &&
          textMatch(r, "STYLEREFNO", search.STYLEREFNO) &&
          textMatch(r, "COLORNAME", search.COLORNAME),
      ),
    [rawData, search],
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
      { header: "Process", key: "PROCESSNAME", width: 20 },
      { header: "Store ID", key: "STOREID", width: 14 },
      { header: "Doc Date", key: "DOCDATE", width: 14 },
      { header: "Order No", key: "ORDERNO", width: 28 },
      { header: "Style Ref No", key: "STYLEREFNO", width: 20 },
      { header: "Buyer Code", key: "BUYERCODE", width: 16 },
      { header: "Buyer Name", key: "BUYERNAME", width: 32 },
      { header: "Color", key: "COLORNAME", width: 20 },
      { header: "Qty", key: "QTY", width: 14 },
    ];

    ws.columns = columns;
    const mergeEnd = String.fromCharCode(64 + columns.length);

    // Title row
    ws.insertRow(1, [
      `Production Detail — ${selectedProcess} | ${companyName}`,
    ]);
    ws.mergeCells(`A1:${mergeEnd}1`);
    const tc = ws.getCell("A1");
    tc.font = { bold: true, size: 13, color: { argb: "FF000000" } };
    tc.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 28;

    // Insights row
    ws.insertRow(2, [
      `Company: ${companyName}   Process: ${selectedProcess}   Store: ${selectedStore}   From: ${fmtDate(fromDate)}   To: ${fmtDate(toDate)}`,
    ]);
    ws.mergeCells(`A2:${mergeEnd}2`);
    const ic = ws.getCell("A2");
    ic.font = { size: 10, italic: true };
    ic.alignment = { horizontal: "left", vertical: "middle" };
    ws.getRow(2).height = 20;

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

    // Data rows
    filtered.forEach((r, i) => {
      ws.addRow({
        sno: i + 1,
        PROCESSNAME: r.PROCESSNAME,
        STOREID: r.STOREID,
        DOCDATE: fmtDate(r.DOCDATE),
        ORDERNO: r.ORDERNO,
        STYLEREFNO: r.STYLEREFNO,
        BUYERCODE: r.BUYERCODE,
        BUYERNAME: r.BUYERNAME,
        COLORNAME: r.COLORNAME,
        QTY: Number(r.QTY || 0),
      });
    });

    // Style data rows
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

    // Totals row
    const tr = ws.addRow({
      sno: "",
      PROCESSNAME: "",
      STOREID: "",
      DOCDATE: "",
      ORDERNO: "",
      STYLEREFNO: "",
      BUYERCODE: "",
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
        horizontal:
          key === "QTY" ? "right" : key === "BUYERNAME" ? "right" : "left",
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
      `Production_${selectedProcess}_${companyName}_${fromDate}_${toDate}.xlsx`,
    );
  };

  /* ── Render ── */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1360px] h-[630px] p-4 rounded-xl relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase text-sm">
            Production Detail —{" "}
            <span className="text-blue-600">{selectedProcess}</span>{" "}
            <span className="text-gray-400 font-normal">|</span>{" "}
            <span className="text-green-700">{companyName}</span>
          </h2>

          <div className="flex gap-2 items-center">
            <div className="bg-gray-100 rounded-lg shadow flex gap-x-2 p-2 flex-wrap items-center">
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
                  padding: "3px 8px",
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
                  padding: "3px 8px",
                  borderRadius: "6px",
                  border: "2px solid #2563eb",
                }}
              />

              {/* PROCESS */}
              <select
                value={selectedProcess}
                onChange={(e) => {
                  setSelectedProcess(e.target.value);
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-32"
              >
                {processOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {/* STORE */}
              <select
                value={selectedStore}
                onChange={(e) => {
                  setSelectedStore(e.target.value);
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-32"
              >
                {storeOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
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

        {/* RECORD COUNT & TOTALS */}
        <div className="flex gap-6 mt-1">
          <p className="text-xs font-semibold text-gray-600">
            Total Records:{" "}
            <span className="text-blue-600">{filtered.length}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Total Qty:{" "}
            <span className="text-green-600">
              {Number(totalQty).toLocaleString("en-IN")}
            </span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Period:{" "}
            <span className="text-purple-600">
              {fmtDate(fromDate)} → {fmtDate(toDate)}
            </span>
          </p>
        </div>

        {/* SEARCH */}
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

        {/* TABLE */}
        <div
          className="overflow-x-auto border border-gray-300"
          style={{ height: "455px", borderRadius: "12px" }}
        >
          <table className="w-full border-collapse text-[11px] table-fixed">
            <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
              <tr>
                <TH cls="w-6">S.No</TH>
                <TH cls="w-24">Process</TH>
                <TH cls="w-40">Store ID</TH>
                <TH cls="w-20">Doc Date</TH>
                <TH cls="w-36">Order No</TH>
                <TH cls="w-28">Style Ref No</TH>

                <TH cls="w-44">Buyer Name</TH>
                <TH cls="w-24">Color</TH>
                <TH cls="w-16">Qty</TH>
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
                    className="text-gray-800 bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors"
                  >
                    <td className="border p-1 text-center text-gray-500">
                      {(page - 1) * RECORDS + i + 1}
                    </td>
                    <td className="border p-1 pl-2 font-medium text-indigo-700">
                      {row.PROCESSNAME}
                    </td>
                    <td className="border p-1 pl-2">{row.STOREID}</td>
                    <td className="border p-1 pl-1">{fmtDate(row.DOCDATE)}</td>
                    <td className="border p-1 pl-2">{row.ORDERNO}</td>
                    <td className="border p-1 pl-2">{row.STYLEREFNO}</td>

                    <td className="border p-1 pl-2">{row.BUYERNAME}</td>
                    <td className="border p-1 pl-2">{row.COLORNAME}</td>
                    <td className="border p-1 pr-2 text-right font-semibold text-green-700">
                      {Number(row.QTY || 0).toLocaleString("en-IN")}
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

export default ProductionDetailTable;

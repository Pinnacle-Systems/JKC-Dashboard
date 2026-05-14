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
import { useGetFabricPendingTableQuery } from "../../../../redux/service/fabric";
import { addInsightsRowTurnOver } from "../../../../utils/hleper";

const RECORDS = 34;
const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
// All TYPENAME values from backend UNION query
const TYPENAME_OPTIONS = [
  "ALL",
  "YARN",
  "KNITTING INHOUSE",
  "FABRIC INHOUSE PENDING",
];

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

/* ── TypeName badge ── */
const TypeBadge = ({ typeName }) => {
  const colorMap = {
    YARN: "bg-blue-100 text-blue-700",
    "KNITTING INHOUSE": "bg-orange-100 text-orange-700",
    "FABRIC INHOUSE PENDING": "bg-red-100 text-red-600",
  };
  return (
    <span
      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${colorMap[typeName] || "bg-gray-100 text-gray-600"}`}
    >
      {typeName}
    </span>
  );
};

/* ── Main ── */
const FabricPendingTable = ({
  companyName,
  finYear,
  finYr, // full year list { data: [{finYear}] }
  typeName, // initial typeName from chart click
  buyerName, // display only in header
  onClose,
  buyerCode,
  buyerCodes,
}) => {
  const [selectedYear, setSelectedYear] = useState(finYear);
  const [selectedBuyer, setSelectedBuyer] = useState(buyerCode || "ALL");
  const [selectedTypeName, setSelectedTypeName] = useState(typeName || "ALL");
  const [page, setPage] = useState(1);

  const resetPage = () => setPage(1);

  const [search, setSearch] = useState({
    ORDERNO: "",
    BUYERNAME: "",
    STYLE: "",
    BUYERPONO: "",
  });
  const buyerList = useMemo(() => {
    const names = buyerCodes?.length ? buyerCodes : [];
    return ["ALL", ...new Set(names)];
  }, [buyerCodes]);
  /* ── Fetch — finyear + typeName only ── */
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetFabricPendingTableQuery(
    {
      params: {
        finyear: selectedYear,
        buyer: selectedBuyer,

        typeName: selectedTypeName,
      },
    },
    { skip: !selectedYear },
  );

  const rawData = useMemo(
    () => (Array.isArray(response?.data) ? response.data : []),
    [response],
  );

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
          textMatch(r, "STYLE", search.STYLE) &&
          textMatch(r, "BUYERPONO", search.BUYERPONO),
      ),
    [rawData, search],
  );

  /* ── Totals ── */
  const totals = useMemo(
    () =>
      filtered.reduce(
        (acc, r) => ({
          ORDERQTY: acc.ORDERQTY + Number(r.ORDERQTY || 0),
          YPOQTY: acc.YPOQTY + Number(r.YPOQTY || 0),
          YARNQTY: acc.YARNQTY + Number(r.YARNQTY || 0),
          KNITRECQTY: acc.KNITRECQTY + Number(r.KNITRECQTY || 0),
          KNITBAL: acc.KNITBAL + Number(r.KNITBAL || 0),
          DYERECQTY: acc.DYERECQTY + Number(r.DYERECQTY || 0),
          INBAL: acc.INBAL + Number(r.INBAL || 0),
        }),
        {
          ORDERQTY: 0,
          YPOQTY: 0,
          YARNQTY: 0,
          KNITRECQTY: 0,
          KNITBAL: 0,
          DYERECQTY: 0,
          INBAL: 0,
        },
      ),
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
    const ws = wb.addWorksheet("Fabric Pending");

    const columns = [
      { header: "S.No", key: "sno", width: 6 },
      { header: "Buyer Name", key: "BUYERNAME", width: 36 },
      { header: "Order No", key: "ORDERNO", width: 30 },
      { header: "Buyer PO No", key: "BUYERPONO", width: 44 },
      { header: "Style", key: "STYLE", width: 32 },
      { header: "Order Qty", key: "ORDERQTY", width: 18 },
      { header: "Yarn PO Qty", key: "YPOQTY", width: 14 },
      { header: "Yarn Inhouse Qty", key: "YARNQTY", width: 20 },
      { header: "Knitting Inhouse Qty", key: "KNITRECQTY", width: 28 },
      { header: "Knitting Bal Qty", key: "KNITBAL", width: 28 },
      { header: "Fabric Inhouse Qty", key: "DYERECQTY", width: 28 },
      { header: "Fabric Inhouse Bal Qty", key: "INBAL", width: 28 },
      { header: "Type", key: "TYPENAME", width: 32 },
    ];

    ws.columns = columns;
    const mergeEnd = String.fromCharCode(64 + columns.length);

    /* Row 1 — Title */
    ws.insertRow(1, ["Fabric Pending Status"]);
    ws.mergeCells(`A1:${mergeEnd}1`);
    const tc = ws.getCell("A1");
    tc.font = { bold: true, size: 13, color: { argb: "FF000000" } };
    tc.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 28;

    /* Row 2 — Insights */
    addInsightsRowTurnOver({
      worksheet: ws,
      startRow: 2,
      totalColumns: 4,
      selectedYear,
      localCompany: companyName,
      dynamicField: "Buyer",
      dynamicValue: selectedBuyer,

      secondDynamicField: "Type",
      seconddynamicValue:
        selectedTypeName === "ALL" ? "All Types" : selectedTypeName,
    });

    /* Row 3 — Header */
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
      "YPOQTY",
      "YARNQTY",
      "KNITRECQTY",
      "KNITBAL",
      "DYERECQTY",
      "INBAL",
    ];

    /* Data rows */
    filtered.forEach((r, i) => {
      ws.addRow({
        sno: i + 1,
        BUYERNAME: r.BUYERNAME,
        ORDERNO: r.ORDERNO,
        BUYERPONO: r.BUYERPONO,
        STYLE: r.STYLE,
        ORDERQTY: Number(r.ORDERQTY || 0),
        YPOQTY: Number(r.YPOQTY || 0),
        YARNQTY: Number(r.YARNQTY || 0),
        KNITRECQTY: Number(r.KNITRECQTY || 0),
        KNITBAL: Number(r.KNITBAL || 0),
        DYERECQTY: Number(r.DYERECQTY || 0),
        INBAL: Number(r.INBAL || 0),
        TYPENAME: r.TYPENAME,
      });
    });

    /* Style data rows */
    const typeColorMap = {
      YARN: { fg: "FFDBEAFE", font: "FF1D4ED8" }, // blue
      "KNITTING INHOUSE": { fg: "FFFFEDD5", font: "FFC2410C" }, // orange
      "FABRIC INHOUSE PENDING": { fg: "FFFEE2E2", font: "FFDC2626" }, // red
    };

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
        if (isQty) cell.numFmt = "#,##0.000";
        if (key === "INBAL") {
          cell.font = { color: { argb: "FFDC2626" } };
        }
        if (key === "KNITBAL") {
          cell.font = { color: { argb: "FFDC2626" } };
        }

        /* TYPENAME cell — colored badge per type */
        if (key === "TYPENAME") {
          const colors = typeColorMap[cell.value] || {
            fg: "FFF3F4F6",
            font: "FF374151",
          };
          cell.font = { bold: true, color: { argb: colors.font } };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: colors.fg },
          };
          cell.alignment = { horizontal: "center", vertical: "middle" };
        }
      });
    });

    /* Totals row */
    const tr = ws.addRow({
      sno: "",
      BUYERNAME: "",
      ORDERNO: "",
      BUYERPONO: "",
      STYLE: "TOTAL",
      ORDERQTY: totals.ORDERQTY,
      YPOQTY: totals.YPOQTY,
      YARNQTY: totals.YARNQTY,
      KNITRECQTY: totals.KNITRECQTY,
      KNITBAL: totals.KNITBAL,
      DYERECQTY: totals.DYERECQTY,
      INBAL: totals.INBAL,
      TYPENAME: "",
    });
    tr.height = 22;
    tr.eachCell((cell, cn) => {
      const key = columns[cn - 1]?.key;
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        horizontal: qtyKeys.includes(key) ? "right" : "left",
        vertical: "middle",
        indent: 1,
      };
      if (qtyKeys.includes(key)) cell.numFmt = "#,##0.000";
    });

    ws.views = [{ state: "frozen", ySplit: 3 }];
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `FabricPending_${selectedTypeName}_${selectedYear}.xlsx`,
    );
  };

  /* ── Render ── */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1360px] h-[630px] p-4 rounded-xl relative">
        {/* ── HEADER ── */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase text-sm">
            Fabric Pending —{" "}
            <span className="text-green-700">{companyName}</span>
          </h2>

          <div className="flex gap-2 items-center">
            <div className="bg-gray-300 rounded-lg shadow-2xl flex gap-x-2 p-2 flex-wrap items-center">
              {/* Fin Year */}
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
              {/* Buyer Name */}
              <select
                value={selectedBuyer}
                onChange={(e) => {
                  setSelectedBuyer(e.target.value);
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-32"
              >
                {buyerList.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              {/* Type Name */}
              <select
                value={selectedTypeName}
                onChange={(e) => {
                  setSelectedTypeName(e.target.value);
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-60"
              >
                {TYPENAME_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t === "ALL" ? "All Types" : t}
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

        {/* ── RECORD COUNT & TOTALS ── */}
        <div className="flex gap-6 mt-1 flex-wrap">
          <p className="text-xs font-semibold text-gray-600">
            Total Records:{" "}
            <span className="text-blue-600">{filtered.length}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Order Qty:{" "}
            <span className="text-green-600">{fmt(totals.ORDERQTY)}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Knit Bal:{" "}
            <span className="text-red-500">{fmt(totals.KNITBAL)}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Fabric In Bal:{" "}
            <span className="text-red-500">{fmt(totals.INBAL)}</span>
          </p>
        </div>

        {/* ── SEARCH ── */}
        <div className="mt-2">
          <SearchBar
            keys={["ORDERNO", "BUYERNAME", "STYLE", "BUYERPONO"]}
            labels={{
              BUYERNAME: "Buyer Name",
              ORDERNO: "Order No",
              BUYERPONO: "Buyer PO No",
              STYLE: "Style",
            }}
            state={search}
            setState={(val) => {
              setSearch(val);
              resetPage();
            }}
          />
        </div>

        {/* ── TABLE ── */}
        <div
          className="overflow-x-auto border border-gray-300"
          style={{ height: "455px", borderRadius: "12px" }}
        >
          <table className="w-[1850px] border-collapse text-[11px] table-fixed">
            <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
              <tr>
                <TH cls="w-6">S.No</TH>
                <TH cls="w-44">Buyer Name</TH>
                <TH cls="w-36">Order No</TH>
                <TH cls="w-44">Buyer PO No</TH>
                <TH cls="w-36">Style</TH>
                <TH cls="w-20">Order Qty</TH>
                <TH cls="w-20">Yarn PO Qty</TH>
                <TH cls="w-28">Yarn Inhouse Qty</TH>
                <TH cls="w-32">Knitting Inhouse Qty</TH>
                <TH cls="w-24">Knitting Bal Qty</TH>
                <TH cls="w-28">Fabric Inhouse Qty</TH>
                <TH cls="w-32">Fabric Inhouse Bal Qty</TH>
                <TH cls="w-36">Type</TH>
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <LoadingRow cols={13} />
              ) : currentRows.length === 0 ? (
                <EmptyRow cols={13} />
              ) : (
                currentRows.map((row, i) => (
                  <tr
                    key={i}
                    className="text-gray-800 bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors"
                  >
                    <td className="border p-1 text-center text-gray-500">
                      {(page - 1) * RECORDS + i + 1}
                    </td>
                    <td className="border p-1 pl-2">{row.BUYERNAME}</td>
                    <td className="border text-left p-1 pl-2">{row.ORDERNO}</td>
                    <td className="border p-1 pl-2">{row.BUYERPONO}</td>
                    <td className="border text-left p-1 pl-2">{row.STYLE}</td>
                    <td className="border text-right p-1 pr-2">
                      {fmt(row.ORDERQTY)}
                    </td>
                    <td className="border text-right p-1 pr-2">
                      {fmt(row.YPOQTY)}
                    </td>
                    <td className="border p-1 pr-2 text-right">
                      {fmt(row.YARNQTY)}
                    </td>
                    <td className="border p-1 pr-2 text-right">
                      {fmt(row.KNITRECQTY)}
                    </td>
                    <td className="border p-1 pr-2 text-right text-red-600">
                      {fmt(row.KNITBAL)}
                    </td>
                    <td className="border p-1 pr-2 text-right">
                      {fmt(row.DYERECQTY)}
                    </td>
                    <td className="border p-1 pr-2 text-right text-red-600">
                      {fmt(row.INBAL)}
                    </td>
                    <td className="border p-1 text-left pl-1">
                      <TypeBadge typeName={row.TYPENAME} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION ── */}
        <Pagination page={page} total={totalPages} setPage={setPage} />
      </div>
    </div>
  );
};

export default FabricPendingTable;

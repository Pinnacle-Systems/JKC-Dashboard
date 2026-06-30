import { useMemo, useState, useEffect } from "react";
import { FaTimes, FaSearch } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useGetOrderEntryProfitLossTableQuery } from "../../../../redux/service/OrderEntry";
import moment from "moment";
import {
  addInsightsRowTurnOver,
  formatQtyByUOM,
  getExcelQtyFormatByUOM,
} from "../../../../utils/hleper";

const RECORDS = 10; // rows visible per section before "show more" (kept small since many sections render together)
const fmtDate = (d) => (d ? moment(d).format("DD-MM-YYYY") : "");
const INR = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    v || 0,
  );
const dash = (v) => (v === null || v === undefined || v === "" ? "—" : v);

/* ── Report registry ── */
const REPORT_TABS = [
  { key: "YARN_PURCHASE", label: "Yarn Purchase", hasOrderNo: true },
  {
    key: "YARN_PURCHASE_TRANSFER",
    label: "Yarn Purchase Transfer",
    hasOrderNo: true,
  },
  { key: "YARN_PROCESS", label: "Yarn Process", hasOrderNo: true },
  {
    key: "YARN_PROCESS_TRANSFER",
    label: "Yarn Process Transfer",
    hasOrderNo: true,
  },
  {
    key: "GREY_FABRIC_PURCHASE_PROCESS",
    label: "Grey Fabric Purchase/Process",
    hasOrderNo: true,
  },
  {
    key: "GREY_FABRIC_TRANSFER",
    label: "Grey Fabric Transfer",
    hasOrderNo: true,
  },
  {
    key: "DYED_FABRIC_PURCHASE_PROCESS",
    label: "Dyed Fabric Purchase/Process",
    hasOrderNo: true,
  },
  {
    key: "DYED_FABRIC_TRANSFER",
    label: "Dyed Fabric Transfer",
    hasOrderNo: true,
  },
  { key: "ACCESSORY_PURCHASE", label: "Accessory Purchase", hasOrderNo: true },
  {
    key: "ACCESSORY_PURCHASE_TRANSFER",
    label: "Accessory Purchase Transfer",
    hasOrderNo: true,
  },
  { key: "ACCESSORY_PROCESS", label: "Accessory Process", hasOrderNo: false },
  {
    key: "ACCESSORY_PROCESS_TRANSFER",
    label: "Accessory Process Transfer",
    hasOrderNo: true,
  },
  {
    key: "CUTTING_MAKING_TRIMMING",
    label: "Cutting / Making / Trimming",
    hasOrderNo: true,
  },
];

const BASE_COLUMNS = [
  { key: "processName", header: "Process", width: "w-32", align: "left" },
  { key: "description", header: "Description", width: "w-56", align: "left" },
  { key: "uom", header: "UOM", width: "w-14", align: "left" },
  {
    key: "pQty",
    header: "Planned Qty",
    width: "w-20",
    align: "right",
    type: "qty",
  },
  {
    key: "pRate",
    header: "Planned Rate",
    width: "w-24",
    align: "right",
    type: "amount",
  },
  {
    key: "pAmount",
    header: "Planned Amt",
    width: "w-24",
    align: "right",
    type: "amount",
  },
  {
    key: "aQty",
    header: "Actual Qty",
    width: "w-20",
    align: "right",
    type: "qty",
  },
  {
    key: "aRate",
    header: "Actual Rate",
    width: "w-20",
    align: "right",
    type: "amount",
  },
  {
    key: "aAmount",
    header: "Actual Amt",
    width: "w-20",
    align: "right",
    type: "amount",
  },
];

const getColumns = (tab) =>
  tab.hasOrderNo
    ? [
        { key: "orderNo", header: "Order No", width: "w-32", align: "left" },
        ...BASE_COLUMNS,
      ]
    : BASE_COLUMNS;

const TH = ({ children, cls = "" }) => (
  <th className={`border p-1 text-center ${cls}`}>{children}</th>
);

const LoadingRow = ({ cols }) => (
  <tr>
    <td colSpan={cols} className="text-center py-6 text-gray-400 text-xs">
      Loading...
    </td>
  </tr>
);
const EmptyRow = ({ cols, label = "No data found" }) => (
  <tr>
    <td colSpan={cols} className="text-center py-6 text-gray-500 text-xs">
      {label}
    </td>
  </tr>
);

/* ── Builds a worksheet for one report section inside a shared workbook ── */
const buildSheet = ({
  wb,
  tab,
  columns,
  filtered,
  totals,
  selectedOrderNo,
}) => {
  const safeName = tab.label.replace(/[*?:\/\[\]]/g, "-").slice(0, 31);
  const ws = wb.addWorksheet(safeName);

  const exportColumns = [
    { header: "S.No", key: "sno", width: 6 },
    ...columns.map((c) => ({
      header: c.header,
      key: c.key,
      width: c.key === "description" ? 44 : c.key === "orderNo" ? 28 : 18,
    })),
  ];
  ws.columns = exportColumns;
  const mergeEnd = String.fromCharCode(64 + exportColumns.length);

  ws.insertRow(1, [tab.label]);
  ws.mergeCells(`A1:${mergeEnd}1`);
  const tc = ws.getCell("A1");
  tc.font = { bold: true, size: 14, color: { argb: "FF000000" } };
  tc.alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(1).height = 30;

  addInsightsRowTurnOver({
    worksheet: ws,
    startRow: 2,
    totalColumns: 4,
    disableFinYear: true,
    dynamicField: "Order No",
    dynamicValue: selectedOrderNo,
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
    const row = { sno: i + 1 };
    columns.forEach((c) => {
      row[c.key] =
        c.type === "qty" || c.type === "amount"
          ? Number(r[c.key] || 0)
          : (r[c.key] ?? "");
    });
    ws.addRow(row);
  });

  ws.eachRow((row, rn) => {
    if (rn <= 3) return;
    row.height = 22;
    row.eachCell((cell, cn) => {
      const key = exportColumns[cn - 1]?.key;
      const colDef = columns.find((c) => c.key === key);
      cell.alignment = {
        horizontal:
          key === "sno"
            ? "center"
            : colDef?.align === "right"
              ? "right"
              : "left",
        vertical: "middle",
        indent: 1,
      };
      if (colDef?.type === "qty") cell.numFmt = getExcelQtyFormatByUOM("");
      if (colDef?.type === "amount") cell.numFmt = "#,##0.00";
    });
  });

  const totalsRow = { sno: "" };
  columns.forEach((c) => {
    if (c.key === "processName") totalsRow[c.key] = "TOTAL";
    else if (["pQty", "pAmount", "aQty", "aAmount"].includes(c.key))
      totalsRow[c.key] = totals[c.key];
    else totalsRow[c.key] = "";
  });
  const tr = ws.addRow(totalsRow);
  tr.height = 24;
  tr.eachCell((cell, cn) => {
    const key = exportColumns[cn - 1]?.key;
    const colDef = columns.find((c) => c.key === key);
    cell.font = { bold: true };
    cell.border = { top: { style: "thin" } };
    cell.alignment = {
      horizontal: colDef?.align === "right" ? "right" : "center",
      vertical: "middle",
      indent: 1,
    };
    if (colDef?.type === "qty") cell.numFmt = getExcelQtyFormatByUOM("");
    if (colDef?.type === "amount") cell.numFmt = "#,##0.00";
  });

  ws.views = [{ state: "frozen", ySplit: 3 }];
};

/* ── One self-contained section: fetches + renders its own report ──
   Each section owns its query, search box, and (optional) "show all" toggle.
   Reports the live row/total data up to the parent via onData so the
   parent's "Export All" button can build a multi-sheet workbook. */
const ReportSection = ({ tab, selectedOrderNo, onData }) => {
  const [search, setSearch] = useState({ processName: "", description: "" });
  const [showAll, setShowAll] = useState(false);
  const columns = useMemo(() => getColumns(tab), [tab]);

  const {
    data: reportRes,
    isLoading,
    isFetching,
    isError,
  } = useGetOrderEntryProfitLossTableQuery(
    { params: { orderNo: selectedOrderNo, reportType: tab.key } },
    { skip: !selectedOrderNo },
  );

  const rawData = useMemo(
    () => (Array.isArray(reportRes?.data) ? reportRes.data : []),
    [reportRes],
  );

  const textMatch = (row, field, val) =>
    !val ||
    String(row[field] ?? "")
      .toLowerCase()
      .includes(val.toLowerCase());

  const filtered = useMemo(
    () =>
      rawData.filter(
        (r) =>
          textMatch(r, "processName", search.processName) &&
          textMatch(r, "description", search.description),
      ),
    [rawData, search],
  );

  const totals = useMemo(
    () => ({
      pQty: filtered.reduce((s, r) => s + Number(r.pQty || 0), 0),
      pAmount: filtered.reduce((s, r) => s + Number(r.pAmount || 0), 0),
      aQty: filtered.reduce((s, r) => s + Number(r.aQty || 0), 0),
      aAmount: filtered.reduce((s, r) => s + Number(r.aAmount || 0), 0),
    }),
    [filtered],
  );

  // Push current data up for "Export All"
  useEffect(() => {
    onData?.(tab.key, { tab, columns, filtered, totals });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab.key, filtered, totals]);

  const visibleRows = showAll ? filtered : filtered.slice(0, RECORDS);
  const isEmpty = !isLoading && !isFetching && !isError && rawData.length === 0;

  if (isEmpty) return null;

  return (
    <div className="border border-gray-300 rounded-xl mb-4 overflow-hidden">
      {/* Section header: process/report name */}
      <div className="bg-gray-100 px-3 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-gray-300">
        <h3 className="font-bold text-xs uppercase text-gray-800">
          {tab.label}
        </h3>
        <div className="flex gap-4 text-[11px] font-semibold text-gray-600 flex-wrap">
          <span>
            Records: <span className="text-blue-600">{filtered.length}</span>
          </span>
          <span>
            Planned Qty:{" "}
            <span className="text-green-600">
              {Number(totals.pQty).toLocaleString("en-IN")}
            </span>
          </span>
          <span>
            Planned Amt:{" "}
            <span className="text-purple-600">{INR(totals.pAmount)}</span>
          </span>
          <span>
            Actual Qty:{" "}
            <span className="text-green-600">
              {Number(totals.aQty).toLocaleString("en-IN")}
            </span>
          </span>
          <span>
            Actual Amt:{" "}
            <span className="text-purple-600">{INR(totals.aAmount)}</span>
          </span>
          {isEmpty && <span className="text-amber-600">No records</span>}
          {isError && <span className="text-red-600">Failed to load</span>}
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-x-3 px-3 pt-2">
        {["processName", "description"].map((key) => (
          <div key={key} className="relative">
            <input
              type="text"
              placeholder={`Search ${key}...`}
              value={search[key] || ""}
              onChange={(e) => setSearch({ ...search, [key]: e.target.value })}
              className="h-6 p-1 pl-7 text-gray-900 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
            <FaSearch className="absolute left-2 top-1.5 text-gray-400 text-[10px]" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-3 py-2">
        <table className="w-full border-collapse text-[11px] table-fixed">
          <thead className="bg-gray-50 text-gray-800 tracking-wider">
            <tr>
              <TH cls="w-8">S.No</TH>
              {columns.map((c) => (
                <TH key={c.key} cls={c.width}>
                  {c.header}
                </TH>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading || isFetching ? (
              <LoadingRow cols={columns.length + 1} />
            ) : isError ? (
              <EmptyRow
                cols={columns.length + 1}
                label="Failed to load this report"
              />
            ) : visibleRows.length === 0 ? (
              <EmptyRow cols={columns.length + 1} />
            ) : (
              visibleRows.map((row, i) => (
                <tr
                  key={i}
                  className="text-gray-800 bg-white even:bg-gray-100 hover:bg-blue-50 transition-colors"
                >
                  <td className="border p-1 text-center text-gray-500">
                    {i + 1}
                  </td>
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={`border p-1 ${
                        c.align === "right"
                          ? "pr-2 text-right"
                          : c.align === "center"
                            ? "text-center"
                            : "pl-2 text-left break-words"
                      } ${c.key === "pAmount" || c.key === "aAmount" ? "text-sky-700" : ""}`}
                    >
                      {c.type === "qty"
                        ? formatQtyByUOM(row[c.key], row.uom)
                        : c.type === "amount"
                          ? INR(row[c.key])
                          : dash(row[c.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {filtered.length > RECORDS && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="mt-1 text-[11px] font-semibold text-blue-600 hover:underline"
          >
            {showAll ? "Show less" : `Show all ${filtered.length} rows`}
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Main ── */
const ProfitLossTable = ({ closeTable, orderNo, orderDropdown }) => {
  const [selectedOrderNo, setSelectedOrderNo] = useState(orderNo || "");
  const [sectionData, setSectionData] = useState({});
  const [selectedProcesses, setSelectedProcesses] = useState(
    REPORT_TABS.map((t) => t.key),
  );
  const [isProcessDropdownOpen, setIsProcessDropdownOpen] = useState(false);

  const toggleProcess = (key) => {
    setSelectedProcesses((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key],
    );
  };

  const handleSectionData = (key, payload) => {
    setSectionData((prev) => ({ ...prev, [key]: payload }));
  };

  const handleExportAll = async () => {
    const wb = new ExcelJS.Workbook();
    let any = false;
    REPORT_TABS.filter((tab) => selectedProcesses.includes(tab.key)).forEach(
      (tab) => {
        const d = sectionData[tab.key];
        if (d && d.filtered.length) {
          any = true;
          buildSheet({
            wb,
            tab: d.tab,
            columns: d.columns,
            filtered: d.filtered,
            totals: d.totals,
            selectedOrderNo,
          });
        }
      },
    );
    if (!any) {
      alert("No data");
      return;
    }
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `OrderProfitLoss_${selectedOrderNo}.xlsx`,
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1360px] h-[720px] p-4 rounded-xl relative flex flex-col">
        {/* ── HEADER ── */}
        <div className="flex justify-between items-center mb-2 flex-shrink-0">
          <h2 className="font-bold uppercase text-sm">
            Profit &amp; Loss Report
          </h2>

          <div className="flex gap-2 items-center">
            <div className="bg-gray-300 rounded-lg shadow-2xl flex gap-x-2 gap-1 p-2 flex-wrap items-center">
              <select
                value={selectedOrderNo}
                onChange={(e) => setSelectedOrderNo(e.target.value)}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-52"
              >
                <option value="">Select Order</option>
                {orderDropdown?.data?.map((item) => (
                  <option key={item.orderNo} value={item.orderNo}>
                    {item.orderNo}
                  </option>
                ))}
              </select>

              {/* Process Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProcessDropdownOpen(!isProcessDropdownOpen)
                  }
                  className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 bg-white w-44 text-left flex justify-between items-center"
                >
                  <span className="truncate">
                    Processes ({selectedProcesses.length})
                  </span>
                  <span className="ml-2 text-[8px]">▼</span>
                </button>

                {isProcessDropdownOpen && (
                  <div className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 w-64 max-h-60 overflow-y-auto">
                    <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 flex justify-between items-center sticky top-0 z-10">
                      <span className="text-xs font-semibold">
                        Select Processes
                      </span>
                      <button
                        onClick={() =>
                          setSelectedProcesses(
                            selectedProcesses.length === REPORT_TABS.length
                              ? []
                              : REPORT_TABS.map((t) => t.key),
                          )
                        }
                        className="text-[10px] text-blue-600 hover:underline"
                      >
                        {selectedProcesses.length === REPORT_TABS.length
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    </div>
                    {REPORT_TABS.map((tab) => (
                      <label
                        key={tab.key}
                        className="flex items-center px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={selectedProcesses.includes(tab.key)}
                          onChange={() => toggleProcess(tab.key)}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        {tab.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleExportAll}
                className="p-0 rounded-full shadow-md hover:brightness-110 transition-all duration-300"
                title="Download Excel (all reports)"
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

        {/* ── BODY: all report sections stacked ── */}
        {!selectedOrderNo ? (
          <div className="flex items-center justify-center flex-1 text-sm text-gray-400">
            Select an order to view its purchase / process reports
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-1">
            {REPORT_TABS.filter((tab) =>
              selectedProcesses.includes(tab.key),
            ).map((tab) => (
              <ReportSection
                key={tab.key}
                tab={tab}
                selectedOrderNo={selectedOrderNo}
                onData={handleSectionData}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfitLossTable;

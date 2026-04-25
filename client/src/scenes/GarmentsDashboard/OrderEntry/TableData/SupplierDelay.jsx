import { useState, useMemo, useEffect } from "react";
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
import {
  useGetSupplierDelayedgeneralTableQuery,
  useGetSupplierDelayedGreyYarnTableQuery,
  useGetSupplierDelayedDyedYarnTableQuery,
  useGetSupplierDelayedGreyFabricTableQuery,
  useGetSupplierDelayedDyedFabricTableQuery,
  useGetSupplierDelayedAccessoryTableQuery,
  useGetSupplierDelayedGreyYarnListTableQuery,
  useGetSupplierDelayedGreyFabricListTableQuery,
  useGetSupplierDelayedDyedYarnListTableQuery,
  useGetSupplierDelayedDyedFabricListTableQuery,
  useGetSupplierDelayedAccessoryListTableQuery,
} from "../../../../redux/service/purchaseServiceTable";
import { skipToken } from "@reduxjs/toolkit/query";
import { addInsightsRowTurnOver } from "../../../../utils/hleper";
import SpinLoader from "../../../../utils/spinLoader";
import moment from "moment";

const ORDER_TYPES = [
  { label: "GREY YARN", value: "GREY YARN" },
  { label: "DYED YARN", value: "DYED YARN" },
  { label: "GREY FABRIC", value: "GREY FABRIC" },
  { label: "DYED FABRIC", value: "DYED FABRIC" },
  { label: "ACCESSORY", value: "ACCESSORY" },
];

const fmtDate = (d) => (d ? moment(d).format("DD-MM-YYYY") : "");
const RECORDS = 34;

// ── reusable pagination bar ──────────────────────────────────────────────────
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

// ── search bar helper ─────────────────────────────────────────────────────────
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

const SupplierDelayTable = ({
  poType,
  selectedCompCode,
  setSelectedCompCode,
  companyList,
  supplier,
  finYr,
  closeTable,
  setSelectedYear,
  selectedYear,
  initialOrderType,
}) => {
  // ── local state ──────────────────────────────────────────────────────────────
  const [localPoType, setLocalPoType] = useState(
    poType === "Order" ? "Order" : "General",
  );
  const [selectedSupplier, setSelectedSupplier] = useState(supplier || "");
  const [selectedOrderType, setSelectedOrderType] = useState(
    initialOrderType || "GREY YARN",
  );

  useEffect(() => {
    setSelectedSupplier(supplier);
  }, [supplier]);

  // per-table search
  const [search, setSearch] = useState({});
  const [greyYarnSearch, setGreyYarnSearch] = useState({});
  const [dyedYarnSearch, setDyedYarnSearch] = useState({});
  const [greyFabricSearch, setGreyFabricSearch] = useState({});
  const [dyedFabricSearch, setDyedFabricSearch] = useState({});
  const [accessorySearch, setAccessorySearch] = useState({});

  // per-table pagination
  const [page0, setPage0] = useState(1);
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [page3, setPage3] = useState(1);
  const [page4, setPage4] = useState(1);
  const [page5, setPage5] = useState(1);

  const resetAllPages = () => {
    setPage0(1);
    setPage1(1);
    setPage2(1);
    setPage3(1);
    setPage4(1);
    setPage5(1);
  };

  // ── supplier list queries ─────────────────────────────────────────────────
  const { data: greyYarnSuppliers } =
    useGetSupplierDelayedGreyYarnListTableQuery(
      localPoType === "Order" &&
        selectedOrderType === "GREY YARN" &&
        selectedYear &&
        selectedCompCode
        ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
        : skipToken,
    );
  const { data: dyedYarnSuppliers } =
    useGetSupplierDelayedDyedYarnListTableQuery(
      localPoType === "Order" &&
        selectedOrderType === "DYED YARN" &&
        selectedYear &&
        selectedCompCode
        ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
        : skipToken,
    );
  const { data: greyFabricSuppliers } =
    useGetSupplierDelayedGreyFabricListTableQuery(
      localPoType === "Order" &&
        selectedOrderType === "GREY FABRIC" &&
        selectedYear &&
        selectedCompCode
        ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
        : skipToken,
    );
  const { data: dyedFabricSuppliers } =
    useGetSupplierDelayedDyedFabricListTableQuery(
      localPoType === "Order" &&
        selectedOrderType === "DYED FABRIC" &&
        selectedYear &&
        selectedCompCode
        ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
        : skipToken,
    );
  const { data: accessorySuppliers } =
    useGetSupplierDelayedAccessoryListTableQuery(
      localPoType === "Order" &&
        selectedOrderType === "ACCESSORY" &&
        selectedYear &&
        selectedCompCode
        ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
        : skipToken,
    );

  // General supplier list
  const { data: generalSupplierListRes } =
    useGetSupplierDelayedgeneralTableQuery(
      localPoType === "General" && selectedYear && selectedCompCode
        ? {
            params: {
              selectedYear,
              companyName: selectedCompCode,
              supplier: "ALL",
            },
          }
        : skipToken,
    );

  // ── supplier dropdown options — always prepend ALL ────────────────────────
  const localSupplierOptions = useMemo(() => {
    let suppliers = [];

    if (localPoType === "General") {
      if (generalSupplierListRes?.data) {
        suppliers = [
          ...new Set(
            generalSupplierListRes.data.map((r) => r.supplier).filter(Boolean),
          ),
        ];
      }
    } else {
      const activeData =
        selectedOrderType === "GREY YARN"
          ? greyYarnSuppliers?.data
          : selectedOrderType === "DYED YARN"
            ? dyedYarnSuppliers?.data
            : selectedOrderType === "GREY FABRIC"
              ? greyFabricSuppliers?.data
              : selectedOrderType === "DYED FABRIC"
                ? dyedFabricSuppliers?.data
                : selectedOrderType === "ACCESSORY"
                  ? accessorySuppliers?.data
                  : [];
      if (activeData?.length) {
        suppliers = activeData.map((r) => r.supplier).filter(Boolean);
      }
    }

    // Always add ALL at the top so "Others" click works
    return ["ALL", ...suppliers];
  }, [
    localPoType,
    selectedOrderType,
    generalSupplierListRes,
    greyYarnSuppliers,
    dyedYarnSuppliers,
    greyFabricSuppliers,
    dyedFabricSuppliers,
    accessorySuppliers,
  ]);

  // ── data queries ─────────────────────────────────────────────────────────
  // "ALL" passes through to backend which handles: (SUPPLIER = '${supplier}' OR '${supplier}' = 'ALL')
  const skip = !selectedYear || !selectedCompCode || !selectedSupplier;
  const qParams = {
    params: {
      selectedYear,
      companyName: selectedCompCode,
      supplier: selectedSupplier,
    },
  };

  const {
    data: generalRes,
    isLoading: l0,
    isFetching: f0,
  } = useGetSupplierDelayedgeneralTableQuery(qParams, { skip });
  const {
    data: greyYarnRes,
    isLoading: l1,
    isFetching: f1,
  } = useGetSupplierDelayedGreyYarnTableQuery(qParams, { skip });
  const {
    data: dyedYarnRes,
    isLoading: l2,
    isFetching: f2,
  } = useGetSupplierDelayedDyedYarnTableQuery(qParams, { skip });
  const {
    data: greyFabricRes,
    isLoading: l3,
    isFetching: f3,
  } = useGetSupplierDelayedGreyFabricTableQuery(qParams, { skip });
  const {
    data: dyedFabricRes,
    isLoading: l4,
    isFetching: f4,
  } = useGetSupplierDelayedDyedFabricTableQuery(qParams, { skip });
  const {
    data: accessoryRes,
    isLoading: l5,
    isFetching: f5,
  } = useGetSupplierDelayedAccessoryTableQuery(qParams, { skip });

  // ── raw data ──────────────────────────────────────────────────────────────
  const raw0 = useMemo(
    () => (Array.isArray(generalRes?.data) ? generalRes.data : []),
    [generalRes],
  );
  const raw1 = useMemo(
    () => (Array.isArray(greyYarnRes?.data) ? greyYarnRes.data : []),
    [greyYarnRes],
  );
  const raw2 = useMemo(
    () => (Array.isArray(dyedYarnRes?.data) ? dyedYarnRes.data : []),
    [dyedYarnRes],
  );
  const raw3 = useMemo(
    () => (Array.isArray(greyFabricRes?.data) ? greyFabricRes.data : []),
    [greyFabricRes],
  );
  const raw4 = useMemo(
    () => (Array.isArray(dyedFabricRes?.data) ? dyedFabricRes.data : []),
    [dyedFabricRes],
  );
  const raw5 = useMemo(
    () => (Array.isArray(accessoryRes?.data) ? accessoryRes.data : []),
    [accessoryRes],
  );

  // ── text filter helper ────────────────────────────────────────────────────
  const textMatch = (row, key, val) =>
    !val || (row[key]?.toLowerCase() || "").includes(val.toLowerCase());

  // ── filtered data ─────────────────────────────────────────────────────────
  const fd0 = useMemo(
    () =>
      raw0.filter(
        (r) =>
          textMatch(r, "supplier", search.supplier) &&
          textMatch(r, "docId", search.docId),
      ),
    [raw0, search],
  );

  const fd1 = useMemo(
    () =>
      raw1.filter(
        (r) =>
          textMatch(r, "supplier", greyYarnSearch.supplier) &&
          textMatch(r, "docId", greyYarnSearch.docId),
      ),
    [raw1, greyYarnSearch],
  );

  const fd2 = useMemo(
    () =>
      raw2.filter(
        (r) =>
          textMatch(r, "supplier", dyedYarnSearch.supplier) &&
          textMatch(r, "docId", dyedYarnSearch.docId),
      ),
    [raw2, dyedYarnSearch],
  );

  const fd3 = useMemo(
    () =>
      raw3.filter(
        (r) =>
          textMatch(r, "supplier", greyFabricSearch.supplier) &&
          textMatch(r, "docId", greyFabricSearch.docId),
      ),
    [raw3, greyFabricSearch],
  );

  const fd4 = useMemo(
    () =>
      raw4.filter(
        (r) =>
          textMatch(r, "supplier", dyedFabricSearch.supplier) &&
          textMatch(r, "docId", dyedFabricSearch.docId),
      ),
    [raw4, dyedFabricSearch],
  );

  const fd5 = useMemo(
    () =>
      raw5.filter(
        (r) =>
          textMatch(r, "supplier", accessorySearch.supplier) &&
          textMatch(r, "docId", accessorySearch.docId),
      ),
    [raw5, accessorySearch],
  );

  // ── totals ────────────────────────────────────────────────────────────────
  const tot0 = useMemo(
    () => fd0.reduce((s, r) => s + Number(r.days || 0), 0),
    [fd0],
  );
  const tot1 = useMemo(
    () => fd1.reduce((s, r) => s + Number(r.days || 0), 0),
    [fd1],
  );
  const tot2 = useMemo(
    () => fd2.reduce((s, r) => s + Number(r.days || 0), 0),
    [fd2],
  );
  const tot3 = useMemo(
    () => fd3.reduce((s, r) => s + Number(r.days || 0), 0),
    [fd3],
  );
  const tot4 = useMemo(
    () => fd4.reduce((s, r) => s + Number(r.days || 0), 0),
    [fd4],
  );
  const tot5 = useMemo(
    () => fd5.reduce((s, r) => s + Number(r.days || 0), 0),
    [fd5],
  );

  const displayTotal =
    localPoType === "General"
      ? tot0
      : selectedOrderType === "GREY YARN"
        ? tot1
        : selectedOrderType === "DYED YARN"
          ? tot2
          : selectedOrderType === "GREY FABRIC"
            ? tot3
            : selectedOrderType === "DYED FABRIC"
              ? tot4
              : selectedOrderType === "ACCESSORY"
                ? tot5
                : 0;

  // ── paginated records ─────────────────────────────────────────────────────
  const paginate = (data, page) =>
    data.slice((page - 1) * RECORDS, page * RECORDS);
  const totalPg = (data) => Math.ceil(data.length / RECORDS) || 1;

  const cr0 = paginate(fd0, page0);
  const tp0 = totalPg(fd0);
  const cr1 = paginate(fd1, page1);
  const tp1 = totalPg(fd1);
  const cr2 = paginate(fd2, page2);
  const tp2 = totalPg(fd2);
  const cr3 = paginate(fd3, page3);
  const tp3 = totalPg(fd3);
  const cr4 = paginate(fd4, page4);
  const tp4 = totalPg(fd4);
  const cr5 = paginate(fd5, page5);
  const tp5 = totalPg(fd5);

  // ── loading / empty rows ──────────────────────────────────────────────────
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

  // ── excel export ──────────────────────────────────────────────────────────
  const buildExcel = async (data, label, fileName) => {
    if (!data.length) {
      alert("No data");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Supplier Delay Report");

    const columns = [
      { header: "S.No", key: "sno", width: 8 },
      { header: "Supplier", key: "supplier", width: 70 },
      { header: "Doc No", key: "docId", width: 24 },
      { header: "Doc Date", key: "docDate", width: 16 },
      { header: "Due Date", key: "dueDate", width: 16 },
      { header: "Delivery Date", key: "grnDate", width: 16 },
      { header: "Delayed Days", key: "days", width: 14 },
    ];
    ws.columns = columns;

    ws.insertRow(1, [`Supplier Delay Report — ${label}`]);
    ws.mergeCells(`A1:G1`);
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
      dynamicField: "Supplier",
      // show "All Suppliers" in Excel when ALL is selected
      dynamicValue:
        selectedSupplier === "ALL" ? "All Suppliers" : selectedSupplier,
      secondDynamicField: "Po Type",
      seconddynamicValue: localPoType,
      ...(localPoType === "Order" && {
        thirdDynamicField: "Raw Material",
        thirdDynamicValue: selectedOrderType,
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

    data.forEach((r, i) => {
      ws.addRow({
        sno: i + 1,
        supplier: r.supplier,
        docId: r.docId,
        docDate: fmtDate(r.docDate),
        dueDate: fmtDate(r.dueDate),
        grnDate: fmtDate(r.grnDate),
        days: Number(r.days || 0),
      });
    });

    ws.eachRow((row, rn) => {
      if (rn <= 3) return;
      row.height = 22;
      row.eachCell((cell, cn) => {
        const key = columns[cn - 1]?.key;
        cell.alignment = {
          horizontal:
            key === "sno" ? "center" : key === "days" ? "right" : "left",
          vertical: "middle",
          indent: 1,
        };
        // Red bold font for Delayed Days column
        if (key === "days") {
          cell.font = { bold: true, color: { argb: "FFCC0000" } };
        }
      });
    });

    const totalDays = data.reduce((s, r) => s + Number(r.days || 0), 0);
    const totalRow = ws.addRow({
      sno: "",
      supplier: "",
      docId: "",
      docDate: "",
      dueDate: "TOTAL",
      grnDate: "",
      days: totalDays,
    });
    totalRow.height = 24;
    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = { vertical: "middle", horizontal: "center", indent: 1 };
    });

    ws.views = [{ state: "frozen", ySplit: 3 }];
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      fileName,
    );
  };

  const downloadSelected =
    localPoType === "General"
      ? () => buildExcel(fd0, "General", "Supplier_Delay_General.xlsx")
      : selectedOrderType === "GREY YARN"
        ? () => buildExcel(fd1, "Grey Yarn", "Supplier_Delay_GreyYarn.xlsx")
        : selectedOrderType === "DYED YARN"
          ? () => buildExcel(fd2, "Dyed Yarn", "Supplier_Delay_DyedYarn.xlsx")
          : selectedOrderType === "GREY FABRIC"
            ? () =>
                buildExcel(fd3, "Grey Fabric", "Supplier_Delay_GreyFabric.xlsx")
            : selectedOrderType === "DYED FABRIC"
              ? () =>
                  buildExcel(
                    fd4,
                    "Dyed Fabric",
                    "Supplier_Delay_DyedFabric.xlsx",
                  )
              : selectedOrderType === "ACCESSORY"
                ? () =>
                    buildExcel(
                      fd5,
                      "Accessory",
                      "Supplier_Delay_Accessory.xlsx",
                    )
                : null;

  // ── shared th style ───────────────────────────────────────────────────────
  const TH = ({ children, cls = "" }) => (
    <th className={`border p-1 text-center ${cls}`}>{children}</th>
  );

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1470px] h-[630px] p-4 rounded-xl relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase">
            Supplier PO Delay Delivery –{" "}
            <span className="text-blue-600">{selectedCompCode || ""}</span>
          </h2>

          <div className="flex gap-2 items-center">
            <div className="bg-gray-300 rounded-lg shadow-2xl flex gap-x-2 gap-1 p-2 flex-wrap">
              {/* PO Type buttons */}
              {["General", "Order"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setLocalPoType(t);
                    resetAllPages();
                  }}
                  className={`px-3 py-0.5 text-[11px] font-semibold rounded-full shadow-md transition-all
                    ${localPoType === t ? "bg-blue-600 text-white scale-105" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
                    focus:outline-none focus:ring-2 focus:ring-blue-400`}
                >
                  {t}
                </button>
              ))}

              {/* Year */}
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setSelectedSupplier("");
                  resetAllPages();
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
                value={selectedCompCode || ""}
                onChange={(e) => {
                  setSelectedCompCode(e.target.value);
                  setSelectedSupplier("");
                  resetAllPages();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-24"
              >
                <option value="">Select Company</option>
                {/* {companyList?.data?.map((item) => (
                  <option key={item.COMPCODE} value={item.COMPCODE}>{item.COMPCODE}</option>
                ))} */}
                <option value="JKC">JKC</option>
              </select>

              {/* Order Type — only when Order */}
              {localPoType === "Order" && (
                <select
                  value={selectedOrderType}
                  onChange={(e) => {
                    setSelectedOrderType(e.target.value);
                    resetAllPages();
                  }}
                  className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-32"
                >
                  {ORDER_TYPES.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )}

              {/* Supplier — ALL always at top, then individual suppliers */}
              <select
                value={selectedSupplier}
                onChange={(e) => {
                  setSelectedSupplier(e.target.value);
                  resetAllPages();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-96"
              >
                <option value="">Select Supplier</option>
                {localSupplierOptions.map((m) => (
                  <option key={m} value={m}>
                    {/* Show "ALL (Others)" when it's the ALL option so user understands why it's pre-selected */}
                    {m === "ALL" ? "ALL (Others)" : m}
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
        <p className="text-xs font-semibold text-gray-600">
          Total Delayed Days:{" "}
          <span className="text-red-600">{displayTotal}</span>
        </p>

        {/* SEARCH + EXCEL */}
        <div className="flex justify-between items-start mt-2">
          {localPoType === "General" ? (
            <SearchBar
              keys={["supplier", "docId"]}
              state={search}
              setState={setSearch}
            />
          ) : selectedOrderType === "GREY YARN" ? (
            <SearchBar
              keys={["supplier", "docId"]}
              state={greyYarnSearch}
              setState={setGreyYarnSearch}
            />
          ) : selectedOrderType === "DYED YARN" ? (
            <SearchBar
              keys={["supplier", "docId"]}
              state={dyedYarnSearch}
              setState={setDyedYarnSearch}
            />
          ) : selectedOrderType === "GREY FABRIC" ? (
            <SearchBar
              keys={["supplier", "docId"]}
              state={greyFabricSearch}
              setState={setGreyFabricSearch}
            />
          ) : selectedOrderType === "DYED FABRIC" ? (
            <SearchBar
              keys={["supplier", "docId"]}
              state={dyedFabricSearch}
              setState={setDyedFabricSearch}
            />
          ) : selectedOrderType === "ACCESSORY" ? (
            <SearchBar
              keys={["supplier", "docId"]}
              state={accessorySearch}
              setState={setAccessorySearch}
            />
          ) : null}

          <div className="flex gap-x-2 items-center">
            <button
              onClick={downloadSelected}
              disabled={!downloadSelected}
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
            className="overflow-x-auto h-[470px] border border-gray-300"
            style={{ border: "1px solid gray", borderRadius: "16px" }}
          >
            {/* ── GENERAL ── */}
            {localPoType === "General" && (
              <table className="w-full border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                  <tr>
                    <TH cls="w-4">S.No</TH>
                    <TH cls="w-40">Supplier</TH>
                    <TH cls="w-24">Doc No</TH>
                    <TH cls="w-[38px]">Doc Date</TH>
                    <TH cls="w-[38px]">Due Date</TH>
                    <TH cls="w-[38px]">Delivery Date</TH>
                    <TH cls="w-16">Delayed Days</TH>
                  </tr>
                </thead>
                <tbody>
                  {l0 || f0 ? (
                    <LoadingRow cols={7} />
                  ) : cr0.length === 0 ? (
                    <EmptyRow cols={7} />
                  ) : (
                    cr0.map((row, i) => (
                      <tr
                        key={i}
                        className="text-gray-800 bg-white even:bg-gray-100"
                      >
                        <td className="border p-1 text-center">
                          {(page0 - 1) * RECORDS + i + 1}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.dueDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.grnDate)}
                        </td>
                        <td className="border p-1 pr-2 text-right font-semibold text-red-600">
                          {row.days}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* ── GREY YARN ── */}
            {localPoType === "Order" && selectedOrderType === "GREY YARN" && (
              <table className="w-full border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0">
                  <tr>
                    <TH cls="w-4">S.No</TH>
                    <TH cls="w-40">Supplier</TH>
                    <TH cls="w-24">Doc No</TH>
                    <TH cls="w-[48px]">Doc Date</TH>
                    <TH cls="w-[48px]">Due Date</TH>
                    <TH cls="w-[48px]">Delivery Date</TH>
                    <TH cls="w-16">Delayed Days</TH>
                  </tr>
                </thead>
                <tbody>
                  {l1 || f1 ? (
                    <LoadingRow cols={7} />
                  ) : cr1.length === 0 ? (
                    <EmptyRow cols={7} />
                  ) : (
                    cr1.map((row, i) => (
                      <tr
                        key={i}
                        className="text-gray-800 bg-white even:bg-gray-100"
                      >
                        <td className="border p-1 text-center">
                          {(page1 - 1) * RECORDS + i + 1}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.dueDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.grnDate)}
                        </td>
                        <td className="border p-1 pr-2 text-right font-semibold text-red-600">
                          {row.days}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* ── DYED YARN ── */}
            {localPoType === "Order" && selectedOrderType === "DYED YARN" && (
              <table className="w-full border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0">
                  <tr>
                    <TH cls="w-4">S.No</TH>
                    <TH cls="w-40">Supplier</TH>
                    <TH cls="w-24">Doc No</TH>
                    <TH cls="w-[48px]">Doc Date</TH>
                    <TH cls="w-[48px]">Due Date</TH>
                    <TH cls="w-[48px]">Delivery Date</TH>
                    <TH cls="w-16">Delayed Days</TH>
                  </tr>
                </thead>
                <tbody>
                  {l2 || f2 ? (
                    <LoadingRow cols={7} />
                  ) : cr2.length === 0 ? (
                    <EmptyRow cols={7} />
                  ) : (
                    cr2.map((row, i) => (
                      <tr
                        key={i}
                        className="text-gray-800 bg-white even:bg-gray-100"
                      >
                        <td className="border p-1 text-center">
                          {(page2 - 1) * RECORDS + i + 1}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.dueDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.grnDate)}
                        </td>
                        <td className="border p-1 pr-2 text-right font-semibold text-red-600">
                          {row.days}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* ── GREY FABRIC ── */}
            {localPoType === "Order" && selectedOrderType === "GREY FABRIC" && (
              <table className="w-full border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0">
                  <tr>
                    <TH cls="w-4">S.No</TH>
                    <TH cls="w-40">Supplier</TH>
                    <TH cls="w-24">Doc No</TH>
                    <TH cls="w-[48px]">Doc Date</TH>
                    <TH cls="w-[48px]">Due Date</TH>
                    <TH cls="w-[48px]">Delivery Date</TH>
                    <TH cls="w-16">Delayed Days</TH>
                  </tr>
                </thead>
                <tbody>
                  {l3 || f3 ? (
                    <LoadingRow cols={7} />
                  ) : cr3.length === 0 ? (
                    <EmptyRow cols={7} />
                  ) : (
                    cr3.map((row, i) => (
                      <tr
                        key={i}
                        className="text-gray-800 bg-white even:bg-gray-100"
                      >
                        <td className="border p-1 text-center">
                          {(page3 - 1) * RECORDS + i + 1}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.dueDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.grnDate)}
                        </td>
                        <td className="border p-1 pr-2 text-right font-semibold text-red-600">
                          {row.days}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* ── DYED FABRIC ── */}
            {localPoType === "Order" && selectedOrderType === "DYED FABRIC" && (
              <table className="w-full border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0">
                  <tr>
                    <TH cls="w-4">S.No</TH>
                    <TH cls="w-40">Supplier</TH>
                    <TH cls="w-24">Doc No</TH>
                    <TH cls="w-[48px]">Doc Date</TH>
                    <TH cls="w-[48px]">Due Date</TH>
                    <TH cls="w-[48px]">Delivery Date</TH>
                    <TH cls="w-16">Delayed Days</TH>
                  </tr>
                </thead>
                <tbody>
                  {l4 || f4 ? (
                    <LoadingRow cols={7} />
                  ) : cr4.length === 0 ? (
                    <EmptyRow cols={7} />
                  ) : (
                    cr4.map((row, i) => (
                      <tr
                        key={i}
                        className="text-gray-800 bg-white even:bg-gray-100"
                      >
                        <td className="border p-1 text-center">
                          {(page4 - 1) * RECORDS + i + 1}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.dueDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.grnDate)}
                        </td>
                        <td className="border p-1 pr-2 text-right font-semibold text-red-600">
                          {row.days}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* ── ACCESSORY ── */}
            {localPoType === "Order" && selectedOrderType === "ACCESSORY" && (
              <table className="w-full border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0">
                  <tr>
                    <TH cls="w-4">S.No</TH>
                    <TH cls="w-40">Supplier</TH>
                    <TH cls="w-24">Doc No</TH>
                    <TH cls="w-[48px]">Doc Date</TH>
                    <TH cls="w-[48px]">Due Date</TH>
                    <TH cls="w-[48px]">Delivery Date</TH>
                    <TH cls="w-16">Delayed Days</TH>
                  </tr>
                </thead>
                <tbody>
                  {l5 || f5 ? (
                    <LoadingRow cols={7} />
                  ) : cr5.length === 0 ? (
                    <EmptyRow cols={7} />
                  ) : (
                    cr5.map((row, i) => (
                      <tr
                        key={i}
                        className="text-gray-800 bg-white even:bg-gray-100"
                      >
                        <td className="border p-1 text-center">
                          {(page5 - 1) * RECORDS + i + 1}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.dueDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.grnDate)}
                        </td>
                        <td className="border p-1 pr-2 text-right font-semibold text-red-600">
                          {row.days}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* PAGINATION */}
        {localPoType === "General" && (
          <Pagination page={page0} total={tp0} setPage={setPage0} />
        )}
        {localPoType === "Order" && selectedOrderType === "GREY YARN" && (
          <Pagination page={page1} total={tp1} setPage={setPage1} />
        )}
        {localPoType === "Order" && selectedOrderType === "DYED YARN" && (
          <Pagination page={page2} total={tp2} setPage={setPage2} />
        )}
        {localPoType === "Order" && selectedOrderType === "GREY FABRIC" && (
          <Pagination page={page3} total={tp3} setPage={setPage3} />
        )}
        {localPoType === "Order" && selectedOrderType === "DYED FABRIC" && (
          <Pagination page={page4} total={tp4} setPage={setPage4} />
        )}
        {localPoType === "Order" && selectedOrderType === "ACCESSORY" && (
          <Pagination page={page5} total={tp5} setPage={setPage5} />
        )}
      </div>
    </div>
  );
};

export default SupplierDelayTable;

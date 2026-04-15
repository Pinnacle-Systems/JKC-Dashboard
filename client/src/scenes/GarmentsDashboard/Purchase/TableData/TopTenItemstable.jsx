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
  useGetTopTenItemGeneralTableQuery,
  useGetTopTenItemGreyYarnTableQuery,
  useGetTopTenItemDyedYarnTableQuery,
  useGetTopTenItemGreyFabricTableQuery,
  useGetTopTenItemDyedFabricTableQuery,
  useGetTopTenItemAccessoryTableQuery,
  useGetTopTenItemListGreyYarnTableQuery,
  useGetTopTenItemListDyedYarnTableQuery,
  useGetTopTenItemListDyedFabricTableQuery,
  useGetTopTenItemListGreyFabricTableQuery,
  useGetTopTenItemListAccessoryTableQuery,
} from "../../../../redux/service/purchaseServiceTable";
import {
  useGetTopTenItemsCombinedQuery,
  useGetTopTenItemsPurchaseGeneralQuery,
  useGetTopTenItemsQuery,
} from "../../../../redux/service/purchaseService";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  addInsightsRowTurnOver,
  formatQtyByUOM,
  getExcelQtyFormatByUOM,
} from "../../../../utils/hleper";
import SpinLoader from "../../../../utils/spinLoader";
import moment from "moment";

const ORDER_TYPES = [
  { label: "GREY YARN", value: "GREY YARN" },
  { label: "DYED YARN", value: "DYED YARN" },
  { label: "GREY FABRIC", value: "GREY FABRIC" },
  { label: "DYED FABRIC", value: "DYED FABRIC" },
  { label: "ACCESSORY", value: "ACCESSORY" },
];

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

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const TopTenItemstable = ({
  poType,
  selectedCompCode,
  setSelectedCompCode,
  companyList,
  item, // ← instead of supplier
  finYr,
  closeTable,
  setSelectedYear,
  selectedYear,
  initialOrderType,
  itemOptions, // ← instead of supplierOptions
}) => {
  const [localPoType, setLocalPoType] = useState(poType || "General");
  const [selectedItem, setSelectedItem] = useState(item || "");
  const [selectedOrderType, setSelectedOrderType] = useState(
    initialOrderType || "GREY YARN",
  );

  useEffect(() => {
    setSelectedItem(item);
  }, [item]);

  // search states
  const [search, setSearch] = useState({});
  const [greyYarnSearch, setGreyYarnSearch] = useState({});
  const [dyedYarnSearch, setDyedYarnSearch] = useState({});
  const [greyFabricSearch, setGreyFabricSearch] = useState({});
  const [dyedFabricSearch, setDyedFabricSearch] = useState({});
  const [accessorySearch, setAccessorySearch] = useState({});

  const defaultRange = { min: 0, max: Infinity };
  const [range0, setRange0] = useState(defaultRange);
  const [range1, setRange1] = useState(defaultRange);
  const [range2, setRange2] = useState(defaultRange);
  const [range3, setRange3] = useState(defaultRange);
  const [range4, setRange4] = useState(defaultRange);
  const [range5, setRange5] = useState(defaultRange);

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

  // ── Item list queries for dropdown (Order type) ───────────────────────────
  const { data: greyYarnItems } = useGetTopTenItemListGreyYarnTableQuery(
    localPoType === "Order" &&
      selectedOrderType === "GREY YARN" &&
      selectedYear &&
      selectedCompCode
      ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
      : skipToken,
  );
  const { data: dyedYarnItems } = useGetTopTenItemListDyedYarnTableQuery(
    localPoType === "Order" &&
      selectedOrderType === "DYED YARN" &&
      selectedYear &&
      selectedCompCode
      ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
      : skipToken,
  );
  const { data: greyFabricItems } = useGetTopTenItemListGreyFabricTableQuery(
    localPoType === "Order" &&
      selectedOrderType === "GREY FABRIC" &&
      selectedYear &&
      selectedCompCode
      ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
      : skipToken,
  );
  const { data: dyedFabricItems } = useGetTopTenItemListDyedFabricTableQuery(
    localPoType === "Order" &&
      selectedOrderType === "DYED FABRIC" &&
      selectedYear &&
      selectedCompCode
      ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
      : skipToken,
  );
  const { data: accessoryItems } = useGetTopTenItemListAccessoryTableQuery(
    localPoType === "Order" &&
      selectedOrderType === "ACCESSORY" &&
      selectedYear &&
      selectedCompCode
      ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
      : skipToken,
  );

  // ── Item options for General dropdown ─────────────────────────────────────
  const combinedQ = useGetTopTenItemsCombinedQuery(
    selectedYear && selectedCompCode
      ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
      : skipToken,
  );
  const generalQ = useGetTopTenItemsPurchaseGeneralQuery(
    selectedYear && selectedCompCode
      ? { params: { finYear: selectedYear, companyName: selectedCompCode } }
      : skipToken,
  );
  const { data: generalItemResponse } = poType === "All" ? combinedQ : generalQ;

  const localItemOptions = useMemo(() => {
    if (localPoType === "General") {
      if (!generalItemResponse?.data) return [];
      return [...generalItemResponse.data]
        .sort((a, b) => (b.TOTAL_VAL ?? b.VAL) - (a.TOTAL_VAL ?? a.VAL))
        .map((i) => i.ITEM)
        .filter((v, i, a) => v && a.indexOf(v) === i);
    }
    // Order — pick right item list
    const activeData =
      selectedOrderType === "GREY YARN"
        ? greyYarnItems?.data
        : selectedOrderType === "DYED YARN"
          ? dyedYarnItems?.data
          : selectedOrderType === "GREY FABRIC"
            ? greyFabricItems?.data
            : selectedOrderType === "DYED FABRIC"
              ? dyedFabricItems?.data
              : selectedOrderType === "ACCESSORY"
                ? accessoryItems?.data
                : [];

    if (!activeData?.length) return [];
    return activeData.map((r) => r.item || r.ITEM).filter(Boolean);
  }, [
    localPoType,
    selectedOrderType,
    generalItemResponse,
    greyYarnItems,
    dyedYarnItems,
    greyFabricItems,
    dyedFabricItems,
    accessoryItems,
  ]);

  // ── Table data queries ────────────────────────────────────────────────────
  const skip = !selectedYear || !selectedCompCode || !selectedItem;
  const qParams = {
    params: { selectedYear, companyName: selectedCompCode, item: selectedItem },
  };

  const {
    data: generalRes,
    isLoading: l0,
    isFetching: f0,
  } = useGetTopTenItemGeneralTableQuery(qParams, { skip });
  const {
    data: greyYarnRes,
    isLoading: l1,
    isFetching: f1,
  } = useGetTopTenItemGreyYarnTableQuery(qParams, { skip });
  const {
    data: dyedYarnRes,
    isLoading: l2,
    isFetching: f2,
  } = useGetTopTenItemDyedYarnTableQuery(qParams, { skip });
  const {
    data: greyFabricRes,
    isLoading: l3,
    isFetching: f3,
  } = useGetTopTenItemGreyFabricTableQuery(qParams, { skip });
  const {
    data: dyedFabricRes,
    isLoading: l4,
    isFetching: f4,
  } = useGetTopTenItemDyedFabricTableQuery(qParams, { skip });
  const {
    data: accessoryRes,
    isLoading: l5,
    isFetching: f5,
  } = useGetTopTenItemAccessoryTableQuery(qParams, { skip });

  // ── Raw data ──────────────────────────────────────────────────────────────
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

  // ── Helpers ───────────────────────────────────────────────────────────────
  const textMatch = (row, key, val) =>
    !val || (row[key]?.toLowerCase() || "").includes(val.toLowerCase());
  const amtFilter = (row, range) => {
    const v = Number(row.amount || 0);
    return v >= range.min && (range.max === Infinity || v <= range.max);
  };

  // ── Filtered data ─────────────────────────────────────────────────────────
  const fd0 = useMemo(
    () =>
      raw0.filter(
        (r) =>
          textMatch(r, "docId", search.docId) &&
          textMatch(r, "itemGroup", search.itemGroup) &&
          textMatch(r, "item", search.itemName) &&
          textMatch(r, "supplier", search.supplier) &&
          amtFilter(r, range0),
      ),
    [raw0, search, range0],
  );

  const fd1 = useMemo(
    () =>
      raw1.filter(
        (r) =>
          textMatch(r, "docId", greyYarnSearch.docId) &&
          textMatch(r, "yarnName", greyYarnSearch.yarnName) &&
          textMatch(r, "orderNo", greyYarnSearch.orderNo) &&
          textMatch(r, "supplier", greyYarnSearch.supplier) &&
          textMatch(r, "color", greyYarnSearch.color) &&
          amtFilter(r, range1),
      ),
    [raw1, greyYarnSearch, range1],
  );

  const fd2 = useMemo(
    () =>
      raw2.filter(
        (r) =>
          textMatch(r, "docId", dyedYarnSearch.docId) &&
          textMatch(r, "yarnName", dyedYarnSearch.yarnName) &&
          textMatch(r, "orderNo", dyedYarnSearch.orderNo) &&
          textMatch(r, "supplier", dyedYarnSearch.supplier) &&
          textMatch(r, "color", dyedYarnSearch.color) &&
          amtFilter(r, range2),
      ),
    [raw2, dyedYarnSearch, range2],
  );

  const fd3 = useMemo(
    () =>
      raw3.filter(
        (r) =>
          textMatch(r, "docId", greyFabricSearch.docId) &&
          textMatch(r, "fabricName", greyFabricSearch.fabricName) &&
          textMatch(r, "orderNo", greyFabricSearch.orderNo) &&
          textMatch(r, "supplier", greyFabricSearch.supplier) &&
          textMatch(r, "color", greyFabricSearch.color) &&
          amtFilter(r, range3),
      ),
    [raw3, greyFabricSearch, range3],
  );

  const fd4 = useMemo(
    () =>
      raw4.filter(
        (r) =>
          textMatch(r, "docId", dyedFabricSearch.docId) &&
          textMatch(r, "fabricName", dyedFabricSearch.fabricName) &&
          textMatch(r, "orderNo", dyedFabricSearch.orderNo) &&
          textMatch(r, "supplier", dyedFabricSearch.supplier) &&
          textMatch(r, "color", dyedFabricSearch.color) &&
          amtFilter(r, range4),
      ),
    [raw4, dyedFabricSearch, range4],
  );

  const fd5 = useMemo(
    () =>
      raw5.filter(
        (r) =>
          textMatch(r, "docId", accessorySearch.docId) &&
          textMatch(r, "orderNo", accessorySearch.orderNo) &&
          textMatch(r, "supplier", accessorySearch.supplier) &&
          textMatch(r, "accessItemName", accessorySearch.accessItemName) &&
          textMatch(r, "accessSize", accessorySearch.accessSize) &&
          amtFilter(r, range5),
      ),
    [raw5, accessorySearch, range5],
  );

  // ── Totals ────────────────────────────────────────────────────────────────
  const tot0 = useMemo(
    () => fd0.reduce((s, r) => s + Number(r.amount || 0), 0),
    [fd0],
  );
  const tot1 = useMemo(
    () => fd1.reduce((s, r) => s + Number(r.amount || 0), 0),
    [fd1],
  );
  const tot2 = useMemo(
    () => fd2.reduce((s, r) => s + Number(r.amount || 0), 0),
    [fd2],
  );
  const tot3 = useMemo(
    () => fd3.reduce((s, r) => s + Number(r.amount || 0), 0),
    [fd3],
  );
  const tot4 = useMemo(
    () => fd4.reduce((s, r) => s + Number(r.amount || 0), 0),
    [fd4],
  );
  const tot5 = useMemo(
    () => fd5.reduce((s, r) => s + Number(r.amount || 0), 0),
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

  // ── Pagination helpers ────────────────────────────────────────────────────
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

  // ── UI helpers ────────────────────────────────────────────────────────────
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
  const TH = ({ children, cls = "" }) => (
    <th className={`border p-1 text-center ${cls}`}>{children}</th>
  );

  // ── Excel ─────────────────────────────────────────────────────────────────
  const buildExcel = async (data, columns, sheetMapper, fileName) => {
    if (!data.length) {
      alert("No data");
      return;
    }
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Top Ten Items Report");
    ws.columns = columns;

    ws.insertRow(1, ["Top Ten Items Report"]);
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
      dynamicField: "Po Type",
      dynamicValue: localPoType,
      secondDynamicField: "Item",
      seconddynamicValue: selectedItem,
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
      const row = ws.addRow(sheetMapper(r, i));
      if (r.uom) row.getCell("qty").numFmt = getExcelQtyFormatByUOM(r.uom);
    });

    const rateColIdx = columns.findIndex((c) => c.key === "rate") + 1;
    const amountColIdx = columns.findIndex((c) => c.key === "amount") + 1;
    const uomColIdx = columns.findIndex((c) => c.key === "uom") + 1;

    ws.eachRow((row, rn) => {
      if (rn <= 3) return;
      row.height = 22;
      row.eachCell((cell, cn) => {
        const key = columns[cn - 1]?.key;
        cell.alignment = {
          horizontal: ["qty", "rate", "amount", "price", "gsm"].includes(key)
            ? "right"
            : "left",
          vertical: "middle",
          indent: 1,
        };
      });
    });

    const totalRate = data.reduce(
      (s, r) => s + Number(r.rate || r.price || 0),
      0,
    );
    const totalAmount = data.reduce((s, r) => s + Number(r.amount || 0), 0);
    const totalRowObj = {};
    columns.forEach((c) => {
      totalRowObj[c.key] = "";
    });
    if (uomColIdx > 0) totalRowObj[columns[uomColIdx - 1].key] = "TOTAL";
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
        horizontal:
          cn === rateColIdx || cn === amountColIdx ? "right" : "center",
        indent: 1,
      };
    });

    ws.getColumn("docDate").numFmt = "dd-mm-yyyy";
    if (rateColIdx > 0) ws.getColumn("rate").numFmt = "₹ #,##,##0.00";
    if (amountColIdx > 0) ws.getColumn("amount").numFmt = "₹ #,##,##0.00";
    ws.views = [{ state: "frozen", ySplit: 3 }];
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      fileName,
    );
  };

  const dlGeneral = () =>
    buildExcel(
      fd0,
      [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Item Name", key: "item", width: 80 },
        { header: "Doc No", key: "docNo", width: 24 },
        { header: "Doc Date", key: "docDate", width: 16 },
        { header: "Supplier", key: "supplier", width: 60 },
        { header: "Item Group", key: "itemGroup", width: 20 },
        { header: "Qty", key: "qty", width: 14 },
        { header: "UOM", key: "uom", width: 14 },
        { header: "Rate", key: "rate", width: 18 },
        { header: "Amount", key: "amount", width: 20 },
      ],
      (r, i) => ({
        sno: i + 1,
        item: r.item,
        docNo: r.docId,
        docDate: fmtDate(r.docDate),
        supplier: r.supplier,
        itemGroup: r.itemGroup,
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.rate || 0),
        amount: Number(r.amount || 0),
      }),
      "Top_Ten_Items_General.xlsx",
    );

  const dlGreyYarn = () =>
    buildExcel(
      fd1,
      [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Yarn", key: "yarn", width: 60 },
        { header: "Doc No", key: "docNo", width: 24 },
        { header: "Doc Date", key: "docDate", width: 16 },
        { header: "Supplier", key: "supplier", width: 60 },
        { header: "Order No", key: "orderNo", width: 25 },
        { header: "Color", key: "color", width: 25 },
        { header: "Qty", key: "qty", width: 14 },
        { header: "UOM", key: "uom", width: 14 },
        { header: "Rate", key: "rate", width: 18 },
        { header: "Amount", key: "amount", width: 20 },
      ],
      (r, i) => ({
        sno: i + 1,
        yarn: r.yarnName,
        docNo: r.docId,
        docDate: fmtDate(r.docDate),
        supplier: r.supplier,
        orderNo: r.orderNo,
        color: r.color,
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.price || 0),
        amount: Number(r.amount || 0),
      }),
      "Top_Ten_Items_GreyYarn.xlsx",
    );

  const dlDyedYarn = () =>
    buildExcel(
      fd2,
      [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Yarn", key: "yarn", width: 60 },
        { header: "Doc No", key: "docNo", width: 24 },
        { header: "Doc Date", key: "docDate", width: 16 },
        { header: "Supplier", key: "supplier", width: 60 },
        { header: "Order No", key: "orderNo", width: 25 },
        { header: "Color", key: "color", width: 25 },
        { header: "Qty", key: "qty", width: 14 },
        { header: "UOM", key: "uom", width: 14 },
        { header: "Rate", key: "rate", width: 18 },
        { header: "Amount", key: "amount", width: 20 },
      ],
      (r, i) => ({
        sno: i + 1,
        yarn: r.yarnName,
        docNo: r.docId,
        docDate: fmtDate(r.docDate),
        supplier: r.supplier,
        orderNo: r.orderNo,
        color: r.color,
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.price || 0),
        amount: Number(r.amount || 0),
      }),
      "Top_Ten_Items_DyedYarn.xlsx",
    );

  const dlGreyFabric = () =>
    buildExcel(
      fd3,
      [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Fabric Name", key: "fabric", width: 90 },
        { header: "Doc No", key: "docNo", width: 24 },
        { header: "Doc Date", key: "docDate", width: 16 },
        { header: "Supplier", key: "supplier", width: 60 },
        { header: "Order No", key: "orderNo", width: 25 },
        { header: "Color", key: "color", width: 25 },
        { header: "Design", key: "design", width: 25 },
        { header: "GSM", key: "gsm", width: 15 },
        { header: "Qty", key: "qty", width: 14 },
        { header: "UOM", key: "uom", width: 14 },
        { header: "Rate", key: "rate", width: 18 },
        { header: "Amount", key: "amount", width: 20 },
      ],
      (r, i) => ({
        sno: i + 1,
        fabric: r.fabricName,
        docNo: r.docId,
        docDate: fmtDate(r.docDate),
        supplier: r.supplier,
        orderNo: r.orderNo,
        color: r.color,
        design: r.design,
        gsm: !isNaN(Number(r.gsm)) ? Number(r.gsm) : "N/A",
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.price || 0),
        amount: Number(r.amount || 0),
      }),
      "Top_Ten_Items_GreyFabric.xlsx",
    );

  const dlDyedFabric = () =>
    buildExcel(
      fd4,
      [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Fabric Name", key: "fabric", width: 90 },
        { header: "Doc No", key: "docNo", width: 24 },
        { header: "Doc Date", key: "docDate", width: 16 },
        { header: "Supplier", key: "supplier", width: 60 },
        { header: "Order No", key: "orderNo", width: 25 },
        { header: "Color", key: "color", width: 25 },
        { header: "Design", key: "design", width: 25 },
        { header: "GSM", key: "gsm", width: 15 },
        { header: "Qty", key: "qty", width: 14 },
        { header: "UOM", key: "uom", width: 14 },
        { header: "Rate", key: "rate", width: 18 },
        { header: "Amount", key: "amount", width: 20 },
      ],
      (r, i) => ({
        sno: i + 1,
        fabric: r.fabricName,
        docNo: r.docId,
        docDate: fmtDate(r.docDate),
        supplier: r.supplier,
        orderNo: r.orderNo,
        color: r.color,
        design: r.design,
        gsm: !isNaN(Number(r.gsm)) ? Number(r.gsm) : "N/A",
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.price || 0),
        amount: Number(r.amount || 0),
      }),
      "Top_Ten_Items_DyedFabric.xlsx",
    );

  const dlAccessory = () =>
    buildExcel(
      fd5,
      [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Acc. Item Name", key: "accessItemDesc", width: 72 },
        { header: "Doc No", key: "docNo", width: 24 },
        { header: "Doc Date", key: "docDate", width: 16 },
        { header: "Supplier", key: "supplier", width: 60 },
        { header: "Order No", key: "orderNo", width: 28 },
        { header: "Acc. Group Name", key: "accessGroupName", width: 32 },
        { header: "Acc. Item Group Name", key: "accessItemName", width: 40 },
        { header: "Size", key: "accessSize", width: 20 },
        { header: "Qty", key: "qty", width: 14 },
        { header: "UOM", key: "uom", width: 14 },
        { header: "Rate", key: "rate", width: 18 },
        { header: "Amount", key: "amount", width: 20 },
      ],
      (r, i) => ({
        sno: i + 1,
        accessItemDesc: r.accessItemDesc,
        docNo: r.docId,
        docDate: fmtDate(r.docDate),
        supplier: r.supplier,
        orderNo: r.orderNo,
        accessGroupName: r.accessGroupName,
        accessItemName: r.accessItemName,
        accessSize: r.accessSize,
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.price || 0),
        amount: Number(r.amount || 0),
      }),
      "Top_Ten_Items_Accessory.xlsx",
    );

  const downloadSelected =
    localPoType === "General"
      ? dlGeneral
      : selectedOrderType === "GREY YARN"
        ? dlGreyYarn
        : selectedOrderType === "DYED YARN"
          ? dlDyedYarn
          : selectedOrderType === "GREY FABRIC"
            ? dlGreyFabric
            : selectedOrderType === "DYED FABRIC"
              ? dlDyedFabric
              : selectedOrderType === "ACCESSORY"
                ? dlAccessory
                : null;

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1470px] h-[630px] p-4 rounded-xl relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase">
            Top Ten Items –{" "}
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
                  setSelectedItem("");
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
                  setSelectedItem("");
                  resetAllPages();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-24"
              >
                <option value="">Select Company</option>
                {/* {companyList?.data?.map((c) => (
                  <option key={c.COMPCODE} value={c.COMPCODE}>{c.COMPCODE}</option>
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

              {/* Item dropdown — replaces Supplier */}
              <select
                value={selectedItem}
                onChange={(e) => {
                  setSelectedItem(e.target.value);
                  resetAllPages();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-96"
              >
                <option value="">Select Item</option>
                {localItemOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
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
          Total Amount: {INR(displayTotal)}
        </p>

        {/* SEARCH + RANGE + EXCEL */}
        <div className="flex justify-between items-start mt-2">
          {localPoType === "General" ? (
            <SearchBar
              keys={["docId", "supplier", "itemGroup", "itemName"]}
              state={search}
              setState={setSearch}
            />
          ) : selectedOrderType === "GREY YARN" ? (
            <SearchBar
              keys={["docId", "orderNo", "supplier", "yarnName", "color"]}
              state={greyYarnSearch}
              setState={setGreyYarnSearch}
            />
          ) : selectedOrderType === "DYED YARN" ? (
            <SearchBar
              keys={["docId", "orderNo", "supplier", "yarnName", "color"]}
              state={dyedYarnSearch}
              setState={setDyedYarnSearch}
            />
          ) : selectedOrderType === "GREY FABRIC" ? (
            <SearchBar
              keys={["docId", "orderNo", "supplier", "fabricName", "color"]}
              state={greyFabricSearch}
              setState={setGreyFabricSearch}
            />
          ) : selectedOrderType === "DYED FABRIC" ? (
            <SearchBar
              keys={["docId", "orderNo", "supplier", "fabricName", "color"]}
              state={dyedFabricSearch}
              setState={setDyedFabricSearch}
            />
          ) : selectedOrderType === "ACCESSORY" ? (
            <SearchBar
              keys={[
                "docId",
                "orderNo",
                "supplier",
                "accessItemName",
                "accessSize",
              ]}
              state={accessorySearch}
              setState={setAccessorySearch}
            />
          ) : null}

          <div className="flex gap-x-2 items-center">
            {localPoType === "General" && (
              <RangeFilter range={range0} setRange={setRange0} />
            )}
            {localPoType === "Order" && selectedOrderType === "GREY YARN" && (
              <RangeFilter range={range1} setRange={setRange1} />
            )}
            {localPoType === "Order" && selectedOrderType === "DYED YARN" && (
              <RangeFilter range={range2} setRange={setRange2} />
            )}
            {localPoType === "Order" && selectedOrderType === "GREY FABRIC" && (
              <RangeFilter range={range3} setRange={setRange3} />
            )}
            {localPoType === "Order" && selectedOrderType === "DYED FABRIC" && (
              <RangeFilter range={range4} setRange={setRange4} />
            )}
            {localPoType === "Order" && selectedOrderType === "ACCESSORY" && (
              <RangeFilter range={range5} setRange={setRange5} />
            )}
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
            {/* GENERAL */}
            {localPoType === "General" && (
              <table className="w-full border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                  <tr>
                    <TH cls="w-4">S.No</TH>
                    <TH cls="w-52">Item Name</TH>
                    <TH cls="w-16">Doc No</TH>
                    <TH cls="w-[38px]">Doc Date</TH>
                    <TH cls="w-36">Supplier</TH>
                    <TH cls="w-12">Item Group</TH>
                    <TH cls="w-8">Qty</TH>
                    <TH cls="w-8">UOM</TH>
                    <TH cls="w-12">Rate</TH>
                    <TH cls="w-12">Amount</TH>
                  </tr>
                </thead>
                <tbody>
                  {l0 || f0 ? (
                    <LoadingRow cols={10} />
                  ) : cr0.length === 0 ? (
                    <EmptyRow cols={10} />
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
                          {row.item}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.itemGroup}
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
            )}

            {/* GREY YARN */}
            {localPoType === "Order" && selectedOrderType === "GREY YARN" && (
              <table className="w-[1720px] border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0">
                  <tr>
                    <TH cls="w-4">S.No</TH>
                    <TH cls="w-72">Yarn Name</TH>
                    <TH cls="w-24">Doc No</TH>
                    <TH cls="w-[48px]">Doc Date</TH>
                    <TH cls="w-44">Supplier</TH>
                    <TH cls="w-24">Order No</TH>
                    <TH cls="w-20">Color</TH>
                    <TH cls="w-12">Qty</TH>
                    <TH cls="w-8">UOM</TH>
                    <TH cls="w-12">Rate</TH>
                    <TH cls="w-12">Amount</TH>
                  </tr>
                </thead>
                <tbody>
                  {l1 || f1 ? (
                    <LoadingRow cols={11} />
                  ) : cr1.length === 0 ? (
                    <EmptyRow cols={11} />
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
                          {row.yarnName}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.orderNo}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.color}
                        </td>
                        <td className="border p-1 pr-2 text-right">
                          {formatQtyByUOM(row.qty, row.uom)}
                        </td>
                        <td className="border p-1 pl-2 text-left">{row.uom}</td>
                        <td className="border p-1 pr-2 text-right">
                          {INR(row.price)}
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

            {/* DYED YARN */}
            {localPoType === "Order" && selectedOrderType === "DYED YARN" && (
              <table className="w-[1620px] border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0">
                  <tr>
                    <TH cls="w-4">S.No</TH>
                    <TH cls="w-72">Yarn Name</TH>
                    <TH cls="w-20">Doc No</TH>
                    <TH cls="w-[48px]">Doc Date</TH>
                    <TH cls="w-36">Supplier</TH>
                    <TH cls="w-20">Order No</TH>
                    <TH cls="w-20">Color</TH>
                    <TH cls="w-8">Qty</TH>
                    <TH cls="w-8">UOM</TH>
                    <TH cls="w-12">Rate</TH>
                    <TH cls="w-12">Amount</TH>
                  </tr>
                </thead>
                <tbody>
                  {l2 || f2 ? (
                    <LoadingRow cols={11} />
                  ) : cr2.length === 0 ? (
                    <EmptyRow cols={11} />
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
                          {row.yarnName}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.orderNo}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.color}
                        </td>
                        <td className="border p-1 pr-2 text-right">
                          {formatQtyByUOM(row.qty, row.uom)}
                        </td>
                        <td className="border p-1 pl-2 text-left">{row.uom}</td>
                        <td className="border p-1 pr-2 text-right">
                          {INR(row.price)}
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

            {/* GREY FABRIC */}
            {localPoType === "Order" && selectedOrderType === "GREY FABRIC" && (
              <table className="w-[1700px] border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0">
                  <tr>
                    <TH cls="w-4">S.No</TH>
                    <TH cls="w-80">Fabric Name</TH>
                    <TH cls="w-24">Doc No</TH>
                    <TH cls="w-16">Doc Date</TH>
                    <TH cls="w-36">Supplier</TH>
                    <TH cls="w-24">Order No</TH>
                    <TH cls="w-20">Color</TH>
                    <TH cls="w-20">Design</TH>
                    <TH cls="w-12">GSM</TH>
                    <TH cls="w-12">Qty</TH>
                    <TH cls="w-8">UOM</TH>
                    <TH cls="w-12">Rate</TH>
                    <TH cls="w-16">Amount</TH>
                  </tr>
                </thead>
                <tbody>
                  {l3 || f3 ? (
                    <LoadingRow cols={13} />
                  ) : cr3.length === 0 ? (
                    <EmptyRow cols={13} />
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
                          {row.fabricName}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.orderNo}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.color}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.design}
                        </td>
                        <td className="border p-1 pr-2 text-right">
                          {!isNaN(Number(row.gsm))
                            ? Number(row.gsm).toFixed(3)
                            : "N/A"}
                        </td>
                        <td className="border p-1 pr-2 text-right">
                          {formatQtyByUOM(row.qty, row.uom)}
                        </td>
                        <td className="border p-1 pl-2 text-left">{row.uom}</td>
                        <td className="border p-1 pr-2 text-right">
                          {INR(row.price)}
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

            {/* DYED FABRIC */}
            {localPoType === "Order" && selectedOrderType === "DYED FABRIC" && (
              <table className="w-[1700px] border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0">
                  <tr>
                    <TH cls="w-4">S.No</TH>
                    <TH cls="w-80">Fabric Name</TH>
                    <TH cls="w-24">Doc No</TH>
                    <TH cls="w-16">Doc Date</TH>
                    <TH cls="w-36">Supplier</TH>
                    <TH cls="w-24">Order No</TH>
                    <TH cls="w-20">Color</TH>
                    <TH cls="w-20">Design</TH>
                    <TH cls="w-12">GSM</TH>
                    <TH cls="w-12">Qty</TH>
                    <TH cls="w-8">UOM</TH>
                    <TH cls="w-12">Rate</TH>
                    <TH cls="w-16">Amount</TH>
                  </tr>
                </thead>
                <tbody>
                  {l4 || f4 ? (
                    <LoadingRow cols={13} />
                  ) : cr4.length === 0 ? (
                    <EmptyRow cols={13} />
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
                          {row.fabricName}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.orderNo}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.color}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.design}
                        </td>
                        <td className="border p-1 pr-2 text-right">
                          {!isNaN(Number(row.gsm))
                            ? Number(row.gsm).toFixed(3)
                            : "N/A"}
                        </td>
                        <td className="border p-1 pr-2 text-right">
                          {formatQtyByUOM(row.qty, row.uom)}
                        </td>
                        <td className="border p-1 pl-2 text-left">{row.uom}</td>
                        <td className="border p-1 pr-2 text-right">
                          {INR(row.price)}
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

            {/* ACCESSORY */}
            {localPoType === "Order" && selectedOrderType === "ACCESSORY" && (
              <table className="w-[1970px] border-collapse text-[11px] table-fixed">
                <thead className="bg-gray-100 text-gray-800 sticky top-0">
                  <tr>
                    <TH cls="w-8">S.No</TH>
                    <TH cls="w-72">Acc. Item Name</TH>
                    <TH cls="w-[110px]">Doc No</TH>
                    <TH cls="w-16">Doc Date</TH>
                    <TH cls="w-64">Supplier</TH>
                    <TH cls="w-28">Order No</TH>
                    <TH cls="w-32">Acc. Group</TH>
                    <TH cls="w-40">Acc. Item Group</TH>
                    <TH cls="w-20">Size</TH>
                    <TH cls="w-12">Qty</TH>
                    <TH cls="w-12">UOM</TH>
                    <TH cls="w-12">Rate</TH>
                    <TH cls="w-16">Amount</TH>
                  </tr>
                </thead>
                <tbody>
                  {l5 || f5 ? (
                    <LoadingRow cols={13} />
                  ) : cr5.length === 0 ? (
                    <EmptyRow cols={13} />
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
                          {row.accessItemDesc}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {fmtDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.orderNo}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.accessGroupName}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.accessItemName}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.accessSize}
                        </td>
                        <td className="border p-1 pr-2 text-right">
                          {formatQtyByUOM(row.qty, row.uom)}
                        </td>
                        <td className="border p-1 pl-2 text-left">{row.uom}</td>
                        <td className="border p-1 pr-2 text-right">
                          {INR(row.price)}
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

export default TopTenItemstable;

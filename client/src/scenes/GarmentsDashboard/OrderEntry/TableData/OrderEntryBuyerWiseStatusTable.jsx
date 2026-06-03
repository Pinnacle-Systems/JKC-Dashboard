// import { useState, useMemo } from "react";
// import {
//   FaTimes,
//   FaChevronLeft,
//   FaChevronRight,
//   FaStepBackward,
//   FaStepForward,
//   FaSearch,
// } from "react-icons/fa";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";
// import {
//   useGetOrderEntryBuyerWiseStatusTableQuery,
//   useGetOrderEntryBuyerWiseStatusStyleTableQuery,
// } from "../../../../redux/service/OrderEntry";
// import {
//   addInsightsRowTurnOver,
//   formatQtyByUOM,
//   getExcelQtyFormatByUOM,
// } from "../../../../utils/hleper";

// const RECORDS = 34;

// // Replace the existing INR function with a parameterized version
// const fmt = (v, d = 2) =>
//   new Intl.NumberFormat("en-IN", {
//     maximumFractionDigits: d,
//     minimumFractionDigits: d,
//   }).format(v || 0);

// const INR = (v) => fmt(v, 2);

// /* ── Pagination ── */
// const Pagination = ({ page, total, setPage }) => (
//   <div
//     className="flex justify-end items-center mt-4 space-x-2 text-[11px]"
//     style={{ position: "absolute", bottom: "5px", right: "0px" }}
//   >
//     <button
//       onClick={() => setPage(1)}
//       disabled={page === 1}
//       className={`p-2 rounded-md ${page === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}
//     >
//       <FaStepBackward size={16} />
//     </button>
//     <button
//       onClick={() => setPage((p) => Math.max(p - 1, 1))}
//       disabled={page === 1}
//       className={`p-2 rounded-md ${page === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}
//     >
//       <FaChevronLeft size={16} />
//     </button>
//     <span className="text-xs font-semibold px-3">
//       Page {page} of {total || 1}
//     </span>
//     <button
//       onClick={() => setPage((p) => Math.min(p + 1, total))}
//       disabled={page === total || !total}
//       className={`p-2 rounded-md ${page === total || !total ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}
//     >
//       <FaChevronRight size={16} />
//     </button>
//     <button
//       onClick={() => setPage(total)}
//       disabled={page === total || !total}
//       className={`p-2 rounded-md ${page === total || !total ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}
//     >
//       <FaStepForward size={16} />
//     </button>
//   </div>
// );

// /* ── SearchBar ── */
// const SearchBar = ({ keys, state, setState }) => (
//   <div className="flex gap-x-4 mb-3">
//     {keys.map((key) => (
//       <div key={key} className="relative">
//         <input
//           type="text"
//           placeholder={`Search ${key}...`}
//           value={state[key] || ""}
//           onChange={(e) => setState({ ...state, [key]: e.target.value })}
//           className="w-full h-6 p-1 pl-8 text-gray-900 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
//         />
//         <FaSearch className="absolute left-2 top-1.5 text-gray-500 text-sm" />
//       </div>
//     ))}
//   </div>
// );

// /* ── TH ── */
// const TH = ({ children, cls = "" }) => (
//   <th className={`border p-1 text-center ${cls}`}>{children}</th>
// );

// /* ── Numeric cell ── */
// const NumCell = ({ val, decimals = 2 }) => (
//   <td className="border p-1 pr-2 text-right">
//     {val != null ? (
//       fmt(val, decimals)
//     ) : (
//       <span className="text-gray-300">—</span>
//     )}
//   </td>
// );

// /* ── Main ── */
// const OrderEntryBuyerWiseStatusTable = ({
//   finYear,
//   compCode,
//   finYr,
//   closeTable,
//   buyerCode,
//   buyerCodes: buyerCodesProp,
// }) => {
//   const [selectedYear, setSelectedYear] = useState(finYear);
//   const [selectedComp, setSelectedComp] = useState(compCode);
//   const [selectedBuyer, setSelectedBuyer] = useState(buyerCode || "ALL");
//   const [page, setPage] = useState(1);

//   const [search, setSearch] = useState({
//     ORDERNO: "",
//     BUYERNAME: "",
//     BUYERPONO: "",
//     STYLE: "",
//   });

//   const resetPage = () => setPage(1);
//   const resetSearch = () =>
//     setSearch({ ORDERNO: "", BUYERNAME: "", BUYERPONO: "", STYLE: "" });

//   const buyerCodes = buyerCodesProp?.length ? buyerCodesProp : ["ALL"];
//   const skip = !selectedYear || !selectedComp;

//   /* ── Fetch ── */
//   const {
//     data: ioRes,
//     isLoading,
//     isFetching,
//   } = useGetOrderEntryBuyerWiseStatusTableQuery(
//     {
//       params: {
//         finYear: selectedYear,
//         companyName: selectedComp,
//         buyerCode: selectedBuyer,
//       },
//     },
//     { skip },
//   );

//   const rawData = useMemo(
//     () => (Array.isArray(ioRes?.data) ? ioRes.data : []),
//     [ioRes],
//   );

//   /* ── Filter ── */
//   const textMatch = (row, field, val) =>
//     !val ||
//     String(row[field] ?? "")
//       .toLowerCase()
//       .includes(val.toLowerCase());

//   const filtered = useMemo(
//     () =>
//       rawData.filter(
//         (r) =>
//           textMatch(r, "ORDERNO", search.ORDERNO) &&
//           textMatch(r, "BUYERNAME", search.BUYERNAME) &&
//           textMatch(r, "BUYERPONO", search.BUYERPONO) &&
//           textMatch(r, "STYLE", search.STYLE),
//       ),
//     [rawData, search],
//   );

//   const NUM_FIELDS = [
//     "ORDERQTY",
//     "PRODQTY",
//     "DYERECQTY",
//     "INBAL",
//     "CUTTING",
//     "SEWING",
//     "POWERTABLE",
//     "SINGER",
//     "CHECKING",
//     "PACKING",
//     "BOX",
//   ];

//   const totals = useMemo(() => {
//     const t = {};
//     NUM_FIELDS.forEach((f) => {
//       t[f] = filtered.reduce((sum, r) => sum + Number(r[f] || 0), 0);
//     });
//     return t;
//   }, [filtered]);

//   /* ── Pagination ── */
//   const totalPages = Math.ceil(filtered.length / RECORDS) || 1;
//   const currentRows = filtered.slice((page - 1) * RECORDS, page * RECORDS);

//   const LoadingRow = ({ cols }) => (
//     <tr>
//       <td colSpan={cols} className="text-center py-10 text-gray-400 text-xs">
//         Loading...
//       </td>
//     </tr>
//   );
//   const EmptyRow = ({ cols }) => (
//     <tr>
//       <td colSpan={cols} className="text-center py-10 text-gray-500 text-xs">
//         No data found
//       </td>
//     </tr>
//   );

//   /* ── Excel ── */
//   const handleExport = async () => {
//     if (!filtered.length) {
//       alert("No data");
//       return;
//     }

//     const wb = new ExcelJS.Workbook();
//     const ws = wb.addWorksheet("Order Entry Status");

//     const columns = [
//       { header: "S.No", key: "sno", width: 6 },
//       { header: "Order No", key: "ORDERNO", width: 30 },
//       { header: "Buyer Name", key: "BUYERNAME", width: 44 },
//       { header: "BPO No", key: "BUYERPONO", width: 30 },
//       { header: "Style", key: "STYLE", width: 25 },
//       { header: "Uom", key: "UOM", width: 20 },
//       { header: "Pack Type", key: "PACKTYPE", width: 20 },
//       { header: "Order Qty", key: "ORDERQTY", width: 16 },
//       { header: "Production Qty", key: "PRODQTY", width: 18 },
//       { header: "Fabric Inhouse Qty", key: "DYERECQTY", width: 20 },
//       { header: "Fabric Balance Qty", key: "INBAL", width: 20 },
//       { header: "Cutting", key: "CUTTING", width: 16 },
//       { header: "Sewing", key: "SEWING", width: 16 },
//       { header: "Power Table", key: "POWERTABLE", width: 16 },
//       { header: "Singer", key: "SINGER", width: 16 },
//       { header: "Checking", key: "CHECKING", width: 16 },
//       { header: "Packing", key: "PACKING", width: 16 },
//       { header: "Box", key: "BOX", width: 16 },
//     ];

//     const NUM_FIELDS_EXCEL = [
//       "ORDERQTY",
//       "PRODQTY",
//       "DYERECQTY",
//       "INBAL",
//       "CUTTING",
//       "SEWING",
//       "POWERTABLE",
//       "SINGER",
//       "CHECKING",
//       "PACKING",
//       "BOX",
//     ];
//     const numKeys = new Set(NUM_FIELDS_EXCEL);

//     ws.columns = columns;
//     const mergeEnd = String.fromCharCode(64 + columns.length);

//     // ── Row 1: Title ──
//     ws.insertRow(1, [`Order Entry Buyer Wise Status`]);
//     ws.mergeCells(`A1:${mergeEnd}1`);
//     const tc = ws.getCell("A1");
//     tc.font = { bold: true, size: 14, color: { argb: "FF000000" } };
//     tc.alignment = { horizontal: "center", vertical: "middle" };
//     ws.getRow(1).height = 30;

//     // ── Row 2: Insights ──
//     addInsightsRowTurnOver({
//       worksheet: ws,
//       startRow: 2,
//       totalColumns: 4,
//       selectedYear,
//       localCompany: selectedComp,
//       dynamicField: "Buyer Code",
//       dynamicValue: selectedBuyer,
//     });

//     // ── Row 3: Headers ──
//     const hr = ws.getRow(3);
//     hr.height = 26;
//     hr.eachCell((cell) => {
//       cell.font = { bold: true };
//       cell.alignment = { horizontal: "center", vertical: "middle" };
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "FFD9D9D9" },
//       };
//       cell.border = {
//         top: { style: "thin" },
//         bottom: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//       };
//     });

//     // ── Data rows + per-row UOM-aware formatting ──
//     filtered.forEach((r, i) => {
//       const uom = r.ORDERUOM;
//       const excelFmt = getExcelQtyFormatByUOM(uom); // ← UOM-aware format

//       const dataRow = ws.addRow({
//         sno: i + 1,
//         ORDERNO: r.ORDERNO,
//         BUYERNAME: r.BUYERNAME,
//         BUYERPONO: r.BUYERPONO,
//         STYLE: r.STYLE,
//         UOM: uom,
//         PACKTYPE: r.ORDERPACKTYPE,
//         ORDERQTY: Number(r.ORDERQTY || 0),
//         PRODQTY: Number(r.PRODQTY || 0),
//         DYERECQTY: Number(r.DYERECQTY || 0),
//         INBAL: Number(r.INBAL || 0),
//         CUTTING: r.CUTTING != null ? Number(r.CUTTING) : null,
//         SEWING: r.SEWING != null ? Number(r.SEWING) : null,
//         POWERTABLE: r.POWERTABLE != null ? Number(r.POWERTABLE) : null,
//         SINGER: r.SINGER != null ? Number(r.SINGER) : null,
//         CHECKING: r.CHECKING != null ? Number(r.CHECKING) : null,
//         PACKING: r.PACKING != null ? Number(r.PACKING) : null,
//         BOX: r.BOX != null ? Number(r.BOX) : null,
//       });

//       dataRow.height = 22;

//       dataRow.eachCell((cell, cn) => {
//         const key = columns[cn - 1]?.key;
//         const isNum = numKeys.has(key);

//         cell.alignment = {
//           horizontal: key === "sno" ? "center" : isNum ? "right" : "left",
//           vertical: "middle",
//           indent: 1,
//         };

//         if (isNum) {
//           if (cell.value === null || cell.value === undefined) {
//             cell.value = null;
//           } else {
//             // ← DYERECQTY and INBAL always 3 decimals regardless of UOM
//             const alwaysThree = key === "DYERECQTY" || key === "INBAL";
//             cell.numFmt = alwaysThree ? "#,##,##0.000" : excelFmt;
//           }
//         }
//       });
//     });

//     // ── Totals row ──
//     // For totals we pick the most common UOM in the filtered set as the format

//     // ── Totals row ──
//     // Remove the dominantUOM logic entirely
//     const totalRow = ws.addRow({
//       sno: "",
//       ORDERNO: "",
//       BUYERNAME: "",
//       BUYERPONO: "",
//       STYLE: "",
//       UOM: "",
//       PACKTYPE: "TOTAL",
//       ...Object.fromEntries(NUM_FIELDS_EXCEL.map((f) => [f, totals[f] ?? 0])),
//     });
//     totalRow.height = 24;
//     totalRow.eachCell((cell, cn) => {
//       const key = columns[cn - 1]?.key;
//       const isNum = numKeys.has(key);
//       cell.font = { bold: true };
//       cell.border = { top: { style: "thin" } };
//       cell.alignment = {
//         horizontal: isNum ? "right" : "center",
//         vertical: "middle",
//         indent: 1,
//       };
//       if (isNum) cell.numFmt = "#,##,##0.000"; // ← always 3 decimals for totals
//     });

//     ws.views = [{ state: "frozen", ySplit: 3 }];
//     const buf = await wb.xlsx.writeBuffer();
//     saveAs(
//       new Blob([buf], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       }),
//       `OrderEntry_BuyerWise_${selectedBuyer}_${selectedYear}.xlsx`,
//     );
//   };

//   /* ── Render ── */
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
//       <div className="bg-white w-[1500px] h-[650px] p-4 rounded-xl relative">
//         {/* HEADER */}
//         <div className="flex justify-between items-center">
//           <h2 className="font-bold uppercase">
//             Order Entry Buyer Wise Status –{" "}
//             <span className="text-blue-600">{selectedComp}</span>
//           </h2>
//           <div className="flex gap-2 items-center">
//             <div className="bg-gray-300 rounded-lg shadow-2xl flex gap-x-2 gap-1 p-2 flex-wrap items-center">
//               {/* Year */}
//               <select
//                 value={selectedYear}
//                 onChange={(e) => {
//                   setSelectedYear(e.target.value);
//                   resetPage();
//                 }}
//                 className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-24"
//               >
//                 <option value="" disabled>
//                   Select Year
//                 </option>
//                 {(finYr?.data || []).map((item) => (
//                   <option key={item.finYear} value={item.finYear}>
//                     {item.finYear}
//                   </option>
//                 ))}
//               </select>

//               {/* Company */}
//               <select
//                 value={selectedComp}
//                 onChange={(e) => {
//                   setSelectedComp(e.target.value);
//                   resetPage();
//                 }}
//                 className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-24"
//               >
//                 <option value="JKC">JKC</option>
//                 {/* <option value="PSS">PSS</option> */}
//               </select>

//               {/* Buyer */}
//               <select
//                 value={selectedBuyer}
//                 onChange={(e) => {
//                   setSelectedBuyer(e.target.value);
//                   resetPage();
//                 }}
//                 className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-28"
//               >
//                 {buyerCodes.map((code) => (
//                   <option key={code} value={code}>
//                     {code}
//                   </option>
//                 ))}
//               </select>

//               {/* Excel */}
//               <button
//                 onClick={handleExport}
//                 className="p-0 rounded-full shadow-md hover:brightness-110 transition-all duration-300"
//                 title="Download Excel"
//               >
//                 <img
//                   src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
//                   alt="Excel"
//                   className="w-7 h-7 rounded-lg"
//                 />
//               </button>
//             </div>
//             <button className="text-red-600" onClick={closeTable}>
//               <FaTimes size={18} />
//             </button>
//           </div>
//         </div>

//         {/* RECORD COUNT & TOTALS */}
//         <div className="flex gap-6 mt-0.5 flex-wrap">
//           <p className="text-xs font-semibold text-gray-600">
//             Total Records:{" "}
//             <span className="text-blue-600">{filtered.length}</span>
//           </p>
//           <p className="text-xs font-semibold text-gray-600">
//             Order Qty:{" "}
//             <span className="text-green-600">{fmt(totals.ORDERQTY, 3)}</span>
//           </p>
//         </div>

//         {/* SEARCH */}
//         <div className="flex justify-between items-start mt-2">
//           <SearchBar
//             keys={["ORDERNO", "BUYERNAME", "BUYERPONO", "STYLE"]}
//             state={search}
//             setState={(val) => {
//               setSearch(val);
//               resetPage();
//             }}
//           />
//         </div>

//         {/* TABLE */}
//         <div
//           className="overflow-x-auto border border-gray-300"
//           style={{
//             height: "480px",
//             border: "1px solid gray",
//             borderRadius: "16px",
//           }}
//         >
//           <table
//             className="w-full border-collapse text-[11px] table-fixed"
//             style={{ minWidth: "2150px" }}
//           >
//             <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
//               <tr>
//                 <TH cls="w-8">S.No</TH>
//                 <TH cls="w-40">Order No</TH>
//                 <TH cls="w-44">Buyer Name</TH>
//                 <TH cls="w-36">BPO No</TH>
//                 <TH cls="w-32">Style</TH>
//                 <TH cls="w-28">Uom</TH>
//                 <TH cls="w-28">Pack Type</TH>
//                 <TH cls="w-32">Order Qty</TH>
//                 <TH cls="w-36">Production Qty</TH>
//                 <TH cls="w-32">Fabric Inhouse Qty</TH>
//                 <TH cls="w-32">Fabric Balance Qty</TH>
//                 <TH cls="w-20">Cutting</TH>
//                 <TH cls="w-24">Power Table</TH>
//                 <TH cls="w-20">Singer</TH>
//                 <TH cls="w-20">Sewing</TH>
//                 <TH cls="w-20">Checking</TH>
//                 <TH cls="w-20">Packing</TH>
//                 <TH cls="w-20">Box</TH>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading || isFetching ? (
//                 <LoadingRow cols={13} />
//               ) : currentRows.length === 0 ? (
//                 <EmptyRow cols={13} />
//               ) : (
//                 currentRows.map((row, i) => (
//                   <tr
//                     key={i}
//                     className="text-gray-800 bg-white even:bg-gray-100 hover:bg-blue-50 transition-colors"
//                   >
//                     <td className="border p-1 text-center text-gray-500">
//                       {(page - 1) * RECORDS + i + 1}
//                     </td>
//                     <td className="border p-1 pl-2">{row.ORDERNO}</td>
//                     <td className="border p-1 pl-2">{row.BUYERNAME}</td>
//                     <td className="border p-1 pl-2 break-words">
//                       {row.BUYERPONO}
//                     </td>
//                     <td className="border p-1 pl-2">{row.STYLE}</td>
//                     <td className="border p-1 pl-2">{row.ORDERUOM}</td>
//                     <td className="border p-1 pl-2">{row.ORDERPACKTYPE}</td>
//                     <td className="border p-1 pr-2 text-right">
//                       {formatQtyByUOM(row.ORDERQTY, row.ORDERUOM)}
//                     </td>
//                     {/* <NumCell val={row.ORDERQTY} decimals={3} /> */}
//                     <td className="border p-1 pr-2 text-right">
//                       {formatQtyByUOM(row.PRODQTY, row.ORDERUOM)}
//                     </td>
//                     {/* <NumCell val={row.PRODQTY} decimals={3} /> */}
//                     {/* <td className="border p-1 pr-2 text-right">
//                       {formatQtyByUOM(row.DYERECQTY, row.ORDERUOM)}
//                     </td> */}
//                     <NumCell val={row.DYERECQTY} decimals={3} />
//                     {/* <td className="border p-1 pr-2 text-right">
//                       {formatQtyByUOM(row.INBAL, row.ORDERUOM)}
//                     </td> */}
//                     <NumCell val={row.INBAL} decimals={3} />

//                     <td className="border p-1 pr-2 text-right">
//                       {formatQtyByUOM(row.CUTTING, row.ORDERUOM)}
//                     </td>
//                     {/* <NumCell val={row.CUTTING} decimals={3} /> */}
//                     <td className="border p-1 pr-2 text-right">
//                       {formatQtyByUOM(row.POWERTABLE, row.ORDERUOM)}
//                     </td>
//                     {/* <NumCell val={row.POWERTABLE} decimals={3} /> */}
//                     <td className="border p-1 pr-2 text-right">
//                       {formatQtyByUOM(row.SINGER, row.ORDERUOM)}
//                     </td>
//                     {/* <NumCell val={row.SINGER} decimals={3} /> */}
//                     <td className="border p-1 pr-2 text-right">
//                       {formatQtyByUOM(row.SEWING, row.ORDERUOM)}
//                     </td>
//                     {/* <NumCell val={row.SEWING} decimals={3} /> */}
//                     <td className="border p-1 pr-2 text-right">
//                       {formatQtyByUOM(row.CHECKING, row.ORDERUOM)}
//                     </td>
//                     {/* <NumCell val={row.CHECKING} decimals={3} /> */}
//                     <td className="border p-1 pr-2 text-right">
//                       {formatQtyByUOM(row.PACKING, row.ORDERUOM)}
//                     </td>
//                     {/* <NumCell val={row.PACKING} decimals={3} /> */}
//                     <td className="border p-1 pr-2 text-right">
//                       {formatQtyByUOM(row.BOX, row.ORDERUOM)}
//                     </td>
//                     {/* <NumCell val={row.BOX} /> */}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         <Pagination page={page} total={totalPages} setPage={setPage} />
//       </div>
//     </div>
//   );
// };

// export default OrderEntryBuyerWiseStatusTable;
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
import {
  useGetOrderEntryBuyerWiseStatusTableQuery,
  useGetOrderEntryBuyerWiseStatusStyleTableQuery,
} from "../../../../redux/service/OrderEntry";
import {
  addInsightsRowTurnOver,
  formatQtyByUOM,
  getExcelQtyFormatByUOM,
} from "../../../../utils/hleper";

const RECORDS = 34;

const fmt = (v, d = 2) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: d,
    minimumFractionDigits: d,
  }).format(v || 0);

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

/* ── Numeric cell ── */
const NumCell = ({ val, decimals = 2 }) => (
  <td className="border p-1 pr-2 text-right">
    {val != null ? (
      fmt(val, decimals)
    ) : (
      <span className="text-gray-300">—</span>
    )}
  </td>
);

/* ── Style Details Modal ── */
const StyleDetailsModal = ({ data, selectedRow, onClose }) => {
  const rows = Array.isArray(data?.data) ? data.data : [];

  const cols = [
    { key: "STYLEITEM", label: "Style Name", cls: "w-52 text-left" },

    { key: "CUTTING", label: "Cutting", cls: "w-24" },
    { key: "SEWING", label: "Sewing", cls: "w-24" },
    { key: "POWERTABLE", label: "Power Table", cls: "w-24" },
    { key: "SINGER", label: "Singer", cls: "w-24" },
    { key: "CHECKING", label: "Checking", cls: "w-24" },
    { key: "PACKING", label: "Packing", cls: "w-24" },
    { key: "BOX", label: "Box", cls: "w-20" },
  ];

  const numKeys = new Set([
    "CUTTING",
    "SEWING",
    "POWERTABLE",
    "SINGER",
    "CHECKING",
    "PACKING",
    "BOX",
  ]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[10000] flex justify-center items-center">
      <div className="bg-white w-[1100px] h-[540px] overflow-hidden p-4 rounded-xl relative flex flex-col">
        {/* ── Modal Header ── */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="font-bold uppercase text-sm text-gray-800">
              Style Details —{" "}
              <span className="text-blue-600">{selectedRow?.ORDERNO}</span>
            </h2>
            {/* Summary chips next to order no */}
            <span className="text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
              Order Qty: {selectedRow?.ORDERQTY}
            </span>
            <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
              Production Qty: {selectedRow?.PRODQTY}
            </span>
          </div>
          <button onClick={onClose} className="text-red-600 hover:text-red-800">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Record count */}
        <p className="text-xs font-semibold text-gray-600 mb-1">
          Total Records: <span className="text-blue-600">{rows.length}</span>
        </p>

        {/* ── Table ── */}
        <div
          className="overflow-auto border border-gray-300 flex-1"
          style={{ borderRadius: "12px" }}
        >
          <table className="w-full border-collapse text-[11px] table-fixed">
            <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
              <tr>
                <TH cls="w-8">S.No</TH>
                {cols.map((c) => (
                  <TH key={c.key} cls={c.cls}>
                    {c.label}
                  </TH>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={cols.length + 1}
                    className="text-center py-10 text-gray-500 text-xs"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr
                    key={i}
                    className="text-gray-800 bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors"
                  >
                    <td className="border p-1 text-center text-gray-500">
                      {i + 1}
                    </td>
                    {cols.map((c) =>
                      numKeys.has(c.key) ? (
                        <td key={c.key} className="border p-1 pr-2 text-right">
                          {row[c.key] != null ? (
                            row[c.key]
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      ) : (
                        <td key={c.key} className="border p-1 pl-2 text-left">
                          {row[c.key] ?? ""}
                        </td>
                      ),
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ── Main ── */
const OrderEntryBuyerWiseStatusTable = ({
  finYear,
  compCode,
  finYr,
  closeTable,
  buyerCode,
  buyerCodes: buyerCodesProp,
}) => {
  const [selectedYear, setSelectedYear] = useState(finYear);
  const [selectedComp, setSelectedComp] = useState(compCode);
  const [selectedBuyer, setSelectedBuyer] = useState(buyerCode || "ALL");
  const [page, setPage] = useState(1);

  // ── NEW: track clicked row (needs orderNo + summary qty for modal header) ──
  const [selectedRow, setSelectedRow] = useState(null); // { ORDERNO, ORDERQTY, PRODQTY }

  const [search, setSearch] = useState({
    ORDERNO: "",
    BUYERNAME: "",
    BUYERPONO: "",
    STYLE: "",
  });

  const resetPage = () => setPage(1);
  const resetSearch = () =>
    setSearch({ ORDERNO: "", BUYERNAME: "", BUYERPONO: "", STYLE: "" });

  const buyerCodes = buyerCodesProp?.length ? buyerCodesProp : ["ALL"];
  const skip = !selectedYear || !selectedComp;

  /* ── Fetch main table ── */
  const {
    data: ioRes,
    isLoading,
    isFetching,
  } = useGetOrderEntryBuyerWiseStatusTableQuery(
    {
      params: {
        finYear: selectedYear,
        companyName: selectedComp,
        buyerCode: selectedBuyer,
      },
    },
    { skip },
  );

  /* ── NEW: Fetch style details (skips until a row is clicked) ── */
  const { data: styleDetails } = useGetOrderEntryBuyerWiseStatusStyleTableQuery(
    { params: { orderNo: selectedRow?.ORDERNO } },
    { skip: !selectedRow?.ORDERNO },
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
          textMatch(r, "ORDERNO", search.ORDERNO) &&
          textMatch(r, "BUYERNAME", search.BUYERNAME) &&
          textMatch(r, "BUYERPONO", search.BUYERPONO) &&
          textMatch(r, "STYLE", search.STYLE),
      ),
    [rawData, search],
  );

  const NUM_FIELDS = [
    "ORDERQTY",
    "PRODQTY",
    "DYERECQTY",
    "INBAL",
    "CUTTING",
    "SEWING",
    "POWERTABLE",
    "SINGER",
    "CHECKING",
    "PACKING",
    "BOX",
  ];

  const totals = useMemo(() => {
    const t = {};
    NUM_FIELDS.forEach((f) => {
      t[f] = filtered.reduce((sum, r) => sum + Number(r[f] || 0), 0);
    });
    return t;
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

  /* ── Excel (unchanged) ── */
  const handleExport = async () => {
    if (!filtered.length) {
      alert("No data");
      return;
    }
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Order Entry Status");
    const columns = [
      { header: "S.No", key: "sno", width: 6 },
      { header: "Order No", key: "ORDERNO", width: 30 },
      { header: "Buyer Name", key: "BUYERNAME", width: 44 },
      { header: "BPO No", key: "BUYERPONO", width: 30 },
      { header: "Style", key: "STYLE", width: 25 },
      { header: "Uom", key: "UOM", width: 20 },
      { header: "Pack Type", key: "PACKTYPE", width: 20 },
      { header: "Order Qty", key: "ORDERQTY", width: 16 },
      { header: "Production Qty", key: "PRODQTY", width: 18 },
      { header: "Fabric Inhouse Qty", key: "DYERECQTY", width: 20 },
      { header: "Fabric Balance Qty", key: "INBAL", width: 20 },
      { header: "Cutting", key: "CUTTING", width: 16 },
      { header: "Sewing", key: "SEWING", width: 16 },
      { header: "Power Table", key: "POWERTABLE", width: 16 },
      { header: "Singer", key: "SINGER", width: 16 },
      { header: "Checking", key: "CHECKING", width: 16 },
      { header: "Packing", key: "PACKING", width: 16 },
      { header: "Box", key: "BOX", width: 16 },
    ];
    const NUM_FIELDS_EXCEL = [
      "ORDERQTY",
      "PRODQTY",
      "DYERECQTY",
      "INBAL",
      "CUTTING",
      "SEWING",
      "POWERTABLE",
      "SINGER",
      "CHECKING",
      "PACKING",
      "BOX",
    ];
    const numKeys = new Set(NUM_FIELDS_EXCEL);
    ws.columns = columns;
    const mergeEnd = String.fromCharCode(64 + columns.length);
    ws.insertRow(1, [`Order Entry Buyer Wise Status`]);
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
      const uom = r.ORDERUOM;
      const excelFmt = getExcelQtyFormatByUOM(uom);
      const dataRow = ws.addRow({
        sno: i + 1,
        ORDERNO: r.ORDERNO,
        BUYERNAME: r.BUYERNAME,
        BUYERPONO: r.BUYERPONO,
        STYLE: r.STYLE,
        UOM: uom,
        PACKTYPE: r.ORDERPACKTYPE,
        ORDERQTY: Number(r.ORDERQTY || 0),
        PRODQTY: Number(r.PRODQTY || 0),
        DYERECQTY: Number(r.DYERECQTY || 0),
        INBAL: Number(r.INBAL || 0),
        CUTTING: r.CUTTING != null ? Number(r.CUTTING) : null,
        SEWING: r.SEWING != null ? Number(r.SEWING) : null,
        POWERTABLE: r.POWERTABLE != null ? Number(r.POWERTABLE) : null,
        SINGER: r.SINGER != null ? Number(r.SINGER) : null,
        CHECKING: r.CHECKING != null ? Number(r.CHECKING) : null,
        PACKING: r.PACKING != null ? Number(r.PACKING) : null,
        BOX: r.BOX != null ? Number(r.BOX) : null,
      });
      dataRow.height = 22;
      dataRow.eachCell((cell, cn) => {
        const key = columns[cn - 1]?.key;
        const isNum = numKeys.has(key);
        cell.alignment = {
          horizontal: key === "sno" ? "center" : isNum ? "right" : "left",
          vertical: "middle",
          indent: 1,
        };
        if (isNum) {
          if (cell.value === null || cell.value === undefined) {
            cell.value = null;
          } else {
            const alwaysThree = key === "DYERECQTY" || key === "INBAL";
            cell.numFmt = alwaysThree ? "#,##,##0.000" : excelFmt;
          }
        }
      });
    });
    const totalRow = ws.addRow({
      sno: "",
      ORDERNO: "",
      BUYERNAME: "",
      BUYERPONO: "",
      STYLE: "",
      UOM: "",
      PACKTYPE: "TOTAL",
      ...Object.fromEntries(NUM_FIELDS_EXCEL.map((f) => [f, totals[f] ?? 0])),
    });
    totalRow.height = 24;
    totalRow.eachCell((cell, cn) => {
      const key = columns[cn - 1]?.key;
      const isNum = numKeys.has(key);
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        horizontal: isNum ? "right" : "center",
        vertical: "middle",
        indent: 1,
      };
      if (isNum) cell.numFmt = "#,##,##0.000";
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
      <div className="bg-white w-[1500px] h-[650px] p-4 rounded-xl relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase">
            Order Entry Buyer Wise Status –{" "}
            <span className="text-blue-600">{selectedComp}</span>
          </h2>
          <div className="flex gap-2 items-center">
            <div className="bg-gray-300 rounded-lg shadow-2xl flex gap-x-2 gap-1 p-2 flex-wrap items-center">
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
        <div className="flex gap-6 mt-0.5 flex-wrap">
          <p className="text-xs font-semibold text-gray-600">
            Total Records:{" "}
            <span className="text-blue-600">{filtered.length}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Order Qty:{" "}
            <span className="text-green-600">{fmt(totals.ORDERQTY, 3)}</span>
          </p>
        </div>

        {/* SEARCH */}
        <div className="flex justify-between items-start mt-2">
          <SearchBar
            keys={["ORDERNO", "BUYERNAME", "BUYERPONO", "STYLE"]}
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
          style={{
            height: "480px",
            border: "1px solid gray",
            borderRadius: "16px",
          }}
        >
          <table
            className="w-full border-collapse text-[11px] table-fixed"
            style={{ minWidth: "2150px" }}
          >
            <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
              <tr>
                <TH cls="w-8">S.No</TH>
                <TH cls="w-40">Order No</TH>
                <TH cls="w-44">Buyer Name</TH>
                <TH cls="w-36">BPO No</TH>
                <TH cls="w-32">Style</TH>
                <TH cls="w-28">Uom</TH>
                <TH cls="w-28">Pack Type</TH>
                <TH cls="w-32">Order Qty</TH>
                <TH cls="w-36">Production Qty</TH>
                <TH cls="w-32">Fabric Inhouse Qty</TH>
                <TH cls="w-32">Fabric Balance Qty</TH>
                <TH cls="w-20">Cutting</TH>
                <TH cls="w-24">Power Table</TH>
                <TH cls="w-20">Singer</TH>
                <TH cls="w-20">Sewing</TH>
                <TH cls="w-20">Checking</TH>
                <TH cls="w-20">Packing</TH>
                <TH cls="w-20">Box</TH>
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <LoadingRow cols={18} />
              ) : currentRows.length === 0 ? (
                <EmptyRow cols={18} />
              ) : (
                currentRows.map((row, i) => (
                  <tr
                    key={i}
                    // ── NEW: click stores the whole row for modal header summary ──
                    onClick={() =>
                      setSelectedRow({
                        ORDERNO: row.ORDERNO,
                        ORDERQTY: row.ORDERQTY,
                        PRODQTY: row.PRODQTY,
                      })
                    }
                    className="text-gray-800 bg-white even:bg-gray-100 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <td className="border p-1 text-center text-gray-500">
                      {(page - 1) * RECORDS + i + 1}
                    </td>
                    <td className="border p-1 pl-2">{row.ORDERNO}</td>
                    <td className="border p-1 pl-2">{row.BUYERNAME}</td>
                    <td className="border p-1 pl-2 break-words">
                      {row.BUYERPONO}
                    </td>
                    <td className="border p-1 pl-2">{row.STYLE}</td>
                    <td className="border p-1 pl-2">{row.ORDERUOM}</td>
                    <td className="border p-1 pl-2">{row.ORDERPACKTYPE}</td>
                    <td className="border p-1 pr-2 text-right">
                      {formatQtyByUOM(row.ORDERQTY, row.ORDERUOM)}
                    </td>
                    <td className="border p-1 pr-2 text-right">
                      {formatQtyByUOM(row.PRODQTY, row.ORDERUOM)}
                    </td>
                    <NumCell val={row.DYERECQTY} decimals={3} />
                    <NumCell val={row.INBAL} decimals={3} />
                    <td className="border p-1 pr-2 text-right">
                      {formatQtyByUOM(row.CUTTING, row.ORDERUOM)}
                    </td>
                    <td className="border p-1 pr-2 text-right">
                      {formatQtyByUOM(row.POWERTABLE, row.ORDERUOM)}
                    </td>
                    <td className="border p-1 pr-2 text-right">
                      {formatQtyByUOM(row.SINGER, row.ORDERUOM)}
                    </td>
                    <td className="border p-1 pr-2 text-right">
                      {formatQtyByUOM(row.SEWING, row.ORDERUOM)}
                    </td>
                    <td className="border p-1 pr-2 text-right">
                      {formatQtyByUOM(row.CHECKING, row.ORDERUOM)}
                    </td>
                    <td className="border p-1 pr-2 text-right">
                      {formatQtyByUOM(row.PACKING, row.ORDERUOM)}
                    </td>
                    <td className="border p-1 pr-2 text-right">
                      {formatQtyByUOM(row.BOX, row.ORDERUOM)}
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

      {/* ── NEW: Style Details Modal ── */}
      {styleDetails && selectedRow && (
        <StyleDetailsModal
          data={styleDetails}
          selectedRow={selectedRow}
          onClose={() => setSelectedRow(null)}
        />
      )}
    </div>
  );
};

export default OrderEntryBuyerWiseStatusTable;

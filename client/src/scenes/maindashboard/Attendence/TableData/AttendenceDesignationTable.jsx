import { useState, useMemo } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaStepBackward,
  FaStepForward,
  FaSearch,
} from "react-icons/fa";
import { FaBirthdayCake } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  useGetAttendenceDesignationTableQuery,
  useGetDesignationQuery,
} from "../../../../redux/service/attendenceReport";
import { addInsightsRowTurnOver } from "../../../../utils/hleper";
import moment from "moment";

const RECORDS = 34;
const fmtDate = (d) => (d ? moment(d).format("DD-MM-YYYY") : "");
const fmtDOB = (d) => (d ? moment(d).format("DD-MM-YYYY") : "");

const today = moment();
const isBirthday = (dob) => {
  if (!dob) return false;
  const d = moment(dob);
  return d.date() === today.date() && d.month() === today.month();
};

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

const SearchBar = ({ keys, state, setState }) => (
  <div className="flex gap-x-4 mb-3 flex-wrap">
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

const statusColor = {
  PRESENT: "text-green-600",
  ONDUTY: "text-blue-600",
  ABSENT: "text-red-600",
  WEEKOFF: "text-gray-500",
};
const StatusBadge = ({ status }) => (
  <span className={`font-semibold ${statusColor[status] || "text-gray-700"}`}>
    {status}
  </span>
);

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

const STATUS_OPTIONS = ["ALL", "PRESENT", "ONDUTY", "ABSENT", "WEEKOFF"];
const GENDER_OPTIONS = ["ALL", "MALE", "FEMALE"];

const COLUMNS = [
  { header: "S.No", key: "sno", width: 6, align: "center" },
  { header: "ID Card", key: "IDCARD", width: 16, align: "left" },
  { header: "Name", key: "FNAME", width: 44, align: "left" },
  { header: "Gender", key: "GENDER", width: 16, align: "left" },
  { header: "DOB", key: "DOB", width: 18, align: "left" },
  { header: "Emp Type", key: "EMPTYPE", width: 18, align: "left" },
  { header: "Department", key: "DEPARTMENT", width: 24, align: "left" },
  { header: "Designation", key: "DESIGNATION", width: 24, align: "left" },
  { header: "Disability", key: "DISABILITY", width: 18, align: "left" },
  { header: "In Date", key: "INDATE", width: 16, align: "left" },
  { header: "In Time", key: "INTIME", width: 14, align: "left" },
  { header: "Lunch Out", key: "LOUTIME", width: 14, align: "left" },
  { header: "Lunch In", key: "LINTIME", width: 14, align: "left" },
  { header: "Out Date", key: "OUTDATE", width: 16, align: "left" },
  { header: "Out Time", key: "OUTTIME", width: 14, align: "left" },
  { header: "OT (hrs)", key: "OTH", width: 12, align: "right" },
  { header: "Shift Count", key: "SHIFTCNT", width: 14, align: "right" },
  { header: "Status", key: "STATUS", width: 14, align: "left" },
];

const AttendenceDesignationTable = ({
  compCode,
  date,
  designation: designationProp, // ✅ from bar click
  statusFilter: statusFilterProp,
  closeTable,
}) => {
  const [selectedComp, setSelectedComp] = useState(compCode || "");
  const [selectedDate, setSelectedDate] = useState(date || "");
  const [selectedGender, setSelectedGender] = useState("ALL");

  const [selectedStatus, setSelectedStatus] = useState(
    statusFilterProp || "ALL",
  );
  const [selectedDesignation, setSelectedDesignation] = useState(
    designationProp || "ALL",
  ); // ✅ replaces gender
  console.log(designationProp, selectedDesignation, "designationProp");
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState({
    fname: "",
    idcard: "",
    department: "",
    designation: "",
  });

  const resetPage = () => setPage(1);
  const skip = !selectedComp || !selectedDate;

  const {
    data: apiRes,
    isLoading,
    isFetching,
  } = useGetAttendenceDesignationTableQuery(
    {
      params: {
        company: selectedComp,
        date: selectedDate,
        statusFilter: selectedStatus,
      },
    },
    { skip },
  );

  const { data: designation } = useGetDesignationQuery({ params: {} });
  const designationData = useMemo(
    () => (Array.isArray(designation?.data) ? designation.data : []),
    [designation],
  );
  console.log(designationData, "designationData");

  const rawData = useMemo(
    () => (Array.isArray(apiRes?.data) ? apiRes.data : []),
    [apiRes],
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
          (selectedGender === "ALL" ||
            (r.GENDER || "").toUpperCase() === selectedGender.toUpperCase()) &&
          (selectedDesignation === "ALL" ||
            (r.DESIGNATION || "").toUpperCase() ===
              selectedDesignation.toUpperCase()) &&
          textMatch(r, "FNAME", search.fname) &&
          textMatch(r, "IDCARD", search.idcard) &&
          textMatch(r, "DEPARTMENT", search.department) &&
          textMatch(r, "DESIGNATION", search.designation),
      ),
    [rawData, search, selectedDesignation, selectedGender],
  );

  const counts = useMemo(() => {
    const c = { PRESENT: 0, ONDUTY: 0, ABSENT: 0, WEEKOFF: 0 };
    filtered.forEach((r) => {
      if (r.STATUS in c) c[r.STATUS]++;
    });
    return c;
  }, [filtered]);

  const totalPages = Math.ceil(filtered.length / RECORDS) || 1;
  const currentRows = filtered.slice((page - 1) * RECORDS, page * RECORDS);
  const STATUS_EXCEL_COLORS = {
    PRESENT: "FF16A34A", // green-600
    ONDUTY: "FF2563EB", // blue-600
    ABSENT: "FFDC2626", // red-600
    WEEKOFF: "FF6B7280", // gray-500
  };
  const handleExport = async () => {
    if (!filtered.length) {
      alert("No data");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Attendance Designation ");

    ws.columns = COLUMNS.map((c) => ({
      header: c.header,
      key: c.key,
      width: c.width,
    }));

    const colCount = COLUMNS.length;
    const mergeEnd = String.fromCharCode(64 + colCount);

    ws.insertRow(1, ["Attendance Designation Wise Report"]);
    ws.mergeCells(`A1:${mergeEnd}1`);
    const tc = ws.getCell("A1");
    tc.font = { bold: true, size: 14, color: { argb: "FF000000" } };
    tc.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 30;

    addInsightsRowTurnOver({
      worksheet: ws,
      startRow: 2,
      totalColumns: colCount,
      selectedYear: selectedDate,
      localCompany: selectedComp,
      dynamicField: "Status",
      dynamicValue: selectedStatus,
      secondDynamicField: "Designation",
      seconddynamicValue: selectedDesignation,
      thirdDynamicField: "Gender",
      thirdDynamicValue: selectedGender,
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
      const birthday = isBirthday(r.DOB);
      ws.addRow({
        sno: i + 1,
        IDCARD: r.IDCARD,
        FNAME: r.FNAME,
        GENDER: r.GENDER,
        DOB: fmtDOB(r.DOB) + (birthday ? " 🎂" : ""),
        EMPTYPE: r.EMPTYPE,
        DEPARTMENT: r.DEPARTMENT,
        DESIGNATION: r.DESIGNATION,
        DISABILITY: r.DISABILITY,
        INDATE: fmtDate(r.INDATE),
        INTIME: r.INTIME,
        LOUTIME: r.LOUTIME,
        LINTIME: r.LINTIME,
        OUTDATE: fmtDate(r.OUTDATE),
        OUTTIME: r.OUTTIME,
        OTH: Number(r.OTH || 0).toFixed(2),
        SHIFTCNT: Number(r.SHIFTCNT || 0),
        STATUS: r.STATUS,
      });
    });

    ws.eachRow((row, rn) => {
      if (rn <= 3) return;
      row.height = 22;
      row.eachCell((cell, cn) => {
        const col = COLUMNS[cn - 1];
        if (!col) return;
        cell.alignment = {
          horizontal: col.align,
          vertical: "middle",
          indent: col.align === "left" ? 1 : 0,
        };
        // Birthday highlight
        if (col.key === "DOB" && String(cell.value || "").includes("🎂")) {
          cell.font = { color: { argb: "FFD6337E" }, bold: true };
        }
        if (col.key === "OTH" || col.key === "SHIFTCNT") {
          cell.numFmt = "#,##0.00";
        }
        // ✅ Status color
        if (col.key === "STATUS") {
          const color =
            STATUS_EXCEL_COLORS[String(cell.value || "").toUpperCase()];
          if (color) {
            cell.font = { color: { argb: color }, bold: true };
          }
        }
      });
    });

    ws.views = [{ state: "frozen", ySplit: 3 }];
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      // ✅ filename uses designation instead of gender
      `Attendance_${selectedStatus}_${selectedDesignation}_${selectedComp}_${selectedDate}.xlsx`,
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1360px] h-[630px] p-4 rounded-xl relative">
        {/* ── HEADER ── */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase text-sm">
            Attendance Designation Wise –{" "}
            <span className="text-blue-600">{selectedComp}</span>
            {/* ✅ show clicked designation in title */}
            {selectedDesignation && selectedDesignation !== "ALL" && (
              <>
                {" "}
                | <span className="text-purple-600">{selectedDesignation}</span>
              </>
            )}
          </h2>

          <div className="flex gap-2 items-center">
            <div className="bg-gray-300 rounded-lg shadow-2xl flex gap-x-2 p-2 flex-wrap items-center">
              {/* Company */}
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

              {/* Date */}
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600"
              />

              {/* Status */}
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-28"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s === "ALL" ? "All Status" : s}
                  </option>
                ))}
              </select>

              {/* ✅ Designation dropdown (replaces Gender) */}
              <select
                value={selectedDesignation}
                onChange={(e) => {
                  setSelectedDesignation(e.target.value);
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-44"
              >
                <option value="ALL">All</option>
                {designationData.map((d) => (
                  <option key={d.DESIGNATION} value={d.DESIGNATION}>
                    {d.DESIGNATION}
                  </option>
                ))}
              </select>

              {/* Gender */}
              <div className="flex items-center gap-2">
                {GENDER_OPTIONS.map((gender) => (
                  <button
                    key={gender}
                    onClick={() => {
                      setSelectedGender(gender);
                      resetPage();
                    }}
                    className={`flex items-center gap-2 px-4 py-1.5 text-[10px] font-semibold  rounded-full shadow-md transition-all ${
                      selectedGender === gender
                        ? "bg-blue-600 text-white scale-105"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>

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

        {/* ── COUNTS ── */}
        <div className="flex gap-6 mt-0.5 flex-wrap">
          <p className="text-xs font-semibold text-gray-600">
            Total: <span className="text-blue-600">{filtered.length}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Present: <span className="text-green-600">{counts.PRESENT}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            On Duty: <span className="text-blue-600">{counts.ONDUTY}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Absent: <span className="text-red-600">{counts.ABSENT}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Week Off: <span className="text-gray-500">{counts.WEEKOFF}</span>
          </p>
        </div>

        {/* ── SEARCH ── */}
        <div className="flex justify-between items-start mt-2">
          <SearchBar
            keys={["fname", "idcard", "department", "designation"]}
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
          style={{
            height: "460px",
            border: "1px solid gray",
            borderRadius: "16px",
          }}
        >
          <table className="w-[1900px] border-collapse text-[11px] table-fixed">
            <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
              <tr>
                <TH cls="w-8">S.No</TH>
                <TH cls="w-32">ID Card</TH>
                <TH cls="w-60">Name</TH>
                <TH cls="w-16">Gender</TH>
                <TH cls="w-24">DOB</TH>
                <TH cls="w-24">Emp Type</TH>
                <TH cls="w-32">Department</TH>
                <TH cls="w-32">Designation</TH>
                <TH cls="w-28">Disability</TH>
                <TH cls="w-20">In Date</TH>
                <TH cls="w-20">In Time</TH>
                <TH cls="w-20">Lunch Out</TH>
                <TH cls="w-20">Lunch In</TH>
                <TH cls="w-20">Out Date</TH>
                <TH cls="w-20">Out Time</TH>
                <TH cls="w-16">OT (hrs)</TH>
                <TH cls="w-20">Shift Count</TH>
                <TH cls="w-20">Status</TH>
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <LoadingRow cols={18} />
              ) : currentRows.length === 0 ? (
                <EmptyRow cols={18} />
              ) : (
                currentRows.map((row, i) => {
                  const birthday = isBirthday(row.DOB);
                  return (
                    <tr
                      key={i}
                      className="text-gray-800 bg-white even:bg-gray-100 hover:bg-blue-50 transition-colors"
                    >
                      <td className="border p-1 text-center text-gray-500">
                        {(page - 1) * RECORDS + i + 1}
                      </td>
                      <td className="border p-1 pl-2">{row.IDCARD}</td>
                      <td className="border p-1 pl-2">{row.FNAME}</td>
                      <td className="border p-1 pl-2">{row.GENDER}</td>
                      <td className="border p-1 pl-2">
                        <span
                          className={
                            birthday ? "text-sky-600 font-semibold" : ""
                          }
                        >
                          {fmtDOB(row.DOB)}
                        </span>
                        {birthday && (
                          <FaBirthdayCake
                            className="inline ml-1 text-pink-500"
                            size={11}
                            title="Happy Birthday!"
                          />
                        )}
                      </td>
                      <td className="border p-1 pl-2">{row.EMPTYPE}</td>
                      <td className="border p-1 pl-2">{row.DEPARTMENT}</td>
                      <td className="border p-1 pl-2">{row.DESIGNATION}</td>
                      <td className="border p-1 pl-2">{row.DISABILITY}</td>
                      <td className="border p-1 pl-2">{fmtDate(row.INDATE)}</td>
                      <td className="border p-1 pl-2">{row.INTIME}</td>
                      <td className="border p-1 pl-2">{row.LOUTIME}</td>
                      <td className="border p-1 pl-2">{row.LINTIME}</td>
                      <td className="border p-1 pl-2">
                        {fmtDate(row.OUTDATE)}
                      </td>
                      <td className="border p-1 pl-2">{row.OUTTIME}</td>
                      <td className="border p-1 pr-2 text-right">
                        {Number(row.OTH || 0).toFixed(2)}
                      </td>
                      <td className="border p-1 pr-2 text-right">
                        {Number(row.SHIFTCNT || 0)}
                      </td>
                      <td className="border p-1 pl-2">
                        <StatusBadge status={row.STATUS} />
                      </td>
                    </tr>
                  );
                })
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

export default AttendenceDesignationTable;

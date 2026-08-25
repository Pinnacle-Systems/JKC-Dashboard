import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, useTheme, Box } from "@mui/material";
import {
  useGetOrderEntryShipmentBuyerListQuery,
  useGetOrderEntryShipmentReportQuery,
} from "../../../redux/service/shipmentStatus";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { addInsightsRowTurnOver } from "../../../utils/hleper";

/* ── Format ISO date to DD/MM/YYYY without timezone shift ── */
const formatDate = (val) => {
  if (!val) return "";
  if (typeof val === "string" && /^\d{2}-[A-Za-z]{3}-\d{4}$/.test(val))
    return val;
  const datePart = typeof val === "string" ? val.split("T")[0] : null;
  if (!datePart) return "";
  const [y, m, d] = datePart.split("-");
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
};

const thStyle = (width, sticky = false) => ({
  border: "1px solid #cbd5e1",
  padding: "5px 8px",
  textAlign: "center",
  fontWeight: 700,
  fontSize: 11,
  whiteSpace: "nowrap",
  minWidth: width,
  background: "#bfdbfe",
  position: "sticky",
  top: 0,
  zIndex: sticky ? 3 : 2,
  ...(sticky && {
    left: 0,
    background: "#93c5fd",
  }),
});

const tdStyle = (align, sticky = false) => ({
  border: "1px solid #e2e8f0",
  padding: "5px 8px",
  textAlign: align,
  fontSize: 11,
  whiteSpace: "nowrap",
  ...(sticky && {
    position: "sticky",
    left: 0,
    zIndex: 1,
    background: "#f1f5f9",
    fontWeight: 600,
  }),
});

const ShipmentStatusReport = ({ companyName, finYear, selectedMonth }) => {
  const theme = useTheme();
  const [selectedBuyer, setSelectedBuyer] = useState("ALL");
  const initialMonth = selectedMonth ? selectedMonth.split(" ")[0] : "";
  const [month, setMonth] = useState(initialMonth);
  const [shipmentStatus, setShipmentStatus] = useState("NOT SHIPPED");

  useEffect(() => {
    setMonth(initialMonth);
  }, [selectedMonth, initialMonth]);

  /* ── Fetch ── */
  const { data: buyerDropdown } = useGetOrderEntryShipmentBuyerListQuery(
    { params: { finYear } },
    { skip: !finYear },
  );

  const { data: response, isLoading } = useGetOrderEntryShipmentReportQuery(
    { params: { finYear, selectedBuyer, month, shipmentStatus } },
    { skip: !selectedBuyer },
  );

  const tableData = response?.data || [];

  const columns = [
    { label: "S.No", key: "SNO", align: "center", width: "20px" },

    { label: "Order No", key: "ORDERNO", align: "left", width: "200px" },
    {
      label: "Order Date",
      key: "ORDERDATE",
      align: "center",
      width: "100px",
      isDate: true,
    },
    { label: "Buyer Name", key: "BUYERNAME", align: "left", width: "300px" },

    { label: "Style Ref", key: "STYLEREFNO", align: "left", width: "100px" },
    { label: "Color", key: "COLOR5", align: "left", width: "300px" },
    { label: "Order Qty", key: "ORDERQTY", align: "right", width: "150px" },
    { label: "BPO No", key: "BPONO", align: "right", width: "100px" },
    { label: "Buyer Price", key: "BUYERPRICE", align: "right", width: "80px" },
    { label: "Currency", key: "CURRNAME", align: "left", width: "80px" },
    { label: "Conv Value", key: "CURCONVVALUE", align: "right", width: "80px" },
    { label: "Amount (INR)", key: "INR", align: "right", width: "100px" },
    { label: "Amount (USD)", key: "USD", align: "right", width: "100px" },
    {
      label: "Tot Prod Qty",
      key: "TOTPRODQTY",
      align: "right",
      width: "100px",
    },

    {
      label: "Ship Date",
      key: "SHIPDATE1",
      align: "center",
      width: "100px",
      isDate: true,
    },
    {
      label: "Shipment Status",
      key: "PRODPACK",
      align: "left",
      width: "90px",
    },
  ];

  const handleExport = async () => {
    if (!tableData.length) {
      alert("No data to export");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Shipment Status");

    const excelCols = columns.map((col) => ({
      header: col.label,
      key: col.key,
      width: Math.max(15, parseInt(col.width) / 7),
    }));

    ws.columns = excelCols;
    const mergeEnd = String.fromCharCode(64 + excelCols.length);

    ws.insertRow(1, ["Shipment Status Report"]);
    if (excelCols.length > 1) {
      ws.mergeCells(`A1:${mergeEnd}1`);
    }
    const tc = ws.getCell("A1");
    tc.font = { bold: true, size: 13 };
    tc.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 28;

    addInsightsRowTurnOver({
      worksheet: ws,
      startRow: 2,
      totalColumns: 4,
      selectedYear: finYear,
      localCompany: "JKC",
      dynamicField: "Buyer",
      dynamicValue: selectedBuyer,
      secondDynamicField: "Month",
      seconddynamicValue: month || "ALL",
      thirdDynamicField: "Shipping Status",
      thirdDynamicValue: shipmentStatus,
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

    tableData.forEach((row, rIdx) => {
      const rowData = {};
      columns.forEach((col) => {
        let val = row[col.key];
        if (col.key === "SNO") val = rIdx + 1;
        if (col.isDate) val = formatDate(val);
        if (col.key === "PRODPACK") {
          val = val === "YES" ? "SHIPPED" : val === "NO" ? "NOT SHIPPED" : val;
        }
        rowData[col.key] = val;
      });

      const newRow = ws.addRow(rowData);
      newRow.eachCell((cell, cn) => {
        const colDef = columns[cn - 1];
        cell.alignment = {
          vertical: "middle",
          horizontal: colDef ? colDef.align : "left",
          indent: colDef && (colDef.align === "left" || colDef.align === "right") ? 1 : 0,
        };
        
        if (colDef && colDef.key === "INR") {
          cell.numFmt = '"₹"#,##0.00';
        } else if (colDef && colDef.key === "USD") {
          cell.numFmt = '"$"#,##0.00';
        } else if (typeof cell.value === "number") {
          cell.numFmt = '#,##0.00';
        }
        
        if (colDef && colDef.key === "PRODPACK") {
          if (cell.value === "SHIPPED") {
            cell.font = { color: { argb: "FF16A34A" }, bold: true };
          } else if (cell.value === "NOT SHIPPED") {
            cell.font = { color: { argb: "FFDC2626" }, bold: true };
          }
        }

        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    ws.views = [{ state: "frozen", ySplit: 3 }];
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `ShipmentStatus_${finYear}_${selectedBuyer}.xlsx`,
    );
  };

  return (
    <Card
      sx={{
        mt: 1,
        ml: 1,
        borderRadius: 3,
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
      }}
    >
      <CardHeader
        title="Shipment Status Report"
        titleTypographyProps={{ sx: { fontSize: ".95rem", fontWeight: 700 } }}
        action={
          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-40"
            >
              <option value="">Select Month</option>
              <option value="ALL">ALL</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={selectedBuyer}
              onChange={(e) => setSelectedBuyer(e.target.value)}
              className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-52"
            >
              <option value="">Select Buyer</option>
              <option value="ALL">ALL</option>
              {buyerDropdown?.data?.map((item) => (
                <option key={item.buyerName} value={item.buyerName}>
                  {item.buyerName}
                </option>
              ))}
            </select>

            <select
              value={shipmentStatus}
              onChange={(e) => setShipmentStatus(e.target.value)}
              className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-32"
            >
              <option value="">Select</option>
              {["ALL", "NOT SHIPPED", "SHIPPED"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {!isLoading && tableData.length > 0 && (
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
          </div>
        }
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />

      <CardContent sx={{ p: 1 }}>
        {isLoading ? (
          <Box sx={{ textAlign: "center", py: 8, height: "440px" }}>
            Loading...
          </Box>
        ) : tableData.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: "text.secondary",
              fontSize: 13,
              height: "440px",
            }}
          >
            No data found.
          </Box>
        ) : (
          <Box
            sx={{
              overflowX: "auto",
              overflowY: "auto",
              height: "440px",
              mb: 2,
              border: "1px solid #e2e8f0",
              borderRadius: 2,
            }}
          >
            <table
              style={{
                borderCollapse: "collapse",
                fontSize: 11,
                width: "max-content",
                minWidth: "100%",
              }}
            >
              <thead>
                <tr>
                  {columns.map((col, idx) => (
                    <th key={col.key} style={thStyle(col.width, false)}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    style={{
                      background: rIdx % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    {columns.map((col, cIdx) => {
                      let val = row[col.key];
                      if (col.key === "SNO") val = rIdx + 1;
                      else if (col.isDate) val = formatDate(val);
                      else if (col.key === "PRODPACK") {
                        val =
                          val === "YES"
                            ? "SHIPPED"
                            : val === "NO"
                              ? "NOT SHIPPED"
                              : val;
                      } else if (typeof val === "number") {
                        if (col.key === "INR") {
                          val = val.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 2,
                          });
                        } else if (col.key === "USD") {
                          val = val.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 2,
                          });
                        } else {
                          val = val.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          });
                        }
                      }
                      return (
                        <td
                          key={col.key}
                          style={{
                            ...tdStyle(col.align, false),
                            color:
                              col.key === "PRODPACK" && val === "SHIPPED"
                                ? "#16a34a"
                                : col.key === "PRODPACK" &&
                                    val === "NOT SHIPPED"
                                  ? "#dc2626"
                                  : "inherit",
                            fontWeight: col.key === "PRODPACK" ? 700 : 500,
                          }}
                        >
                          {val || ""}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ShipmentStatusReport;

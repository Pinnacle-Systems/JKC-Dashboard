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
  useGetGeneralYearQuery,
  useGetGreyYarnTableQuery,
  useGetDyedYarnTableQuery,
  useGetGreyFabricTableQuery,
  useGetDyedFabricTableQuery,
  useGetAccessoryTableQuery,
} from "../../../../redux/service/purchaseServiceTable";

import {
  addInsightsRowTurnOver,
  formatQtyByUOM,
  getExcelQtyFormatByUOM,
} from "../../../../utils/hleper";
import SpinLoader from "../../../../utils/spinLoader";
import moment from "moment";
import { useSelector } from "react-redux";
// import FinYear from "../../../../components/FinYear";
const YearWiseTable = ({
  year,
  poType = "General",
  companyList,
  finYr,
  closeTable,
  filterBuyerList,
  valOptions,
  type,
}) => {
  const { filterBuyer: companyName } = useSelector(
    (state) => state.dashboardFilters,
  );

  const [selectedYear, setSelectedYear] = useState(year || "");
  const [localCompany, setLocalCompany] = useState(companyName || "ALL");
  const [localPoType, setLocalPoType] = useState(poType || "General");
  const [selectedOrderType, setSelectedOrdertype] = useState(type || "");
  const [search, setSearch] = useState({});
  const [greyYarnsearch, setGreyYarnSearch] = useState({});
  const [dyedYarnsearch, setDyedYarnSearch] = useState({});
  const [greyFabricsearch, setGreyFabricSearch] = useState({});
  const [dyedFabricsearch, setDyedFabricSearch] = useState({});
  const [accessorysearch, setAccessorySearch] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [greyYarnCurrentPage, setGreyYarnCurrentPage] = useState(1);
  const [dyedYarnCurrentPage, setDyedYarnCurrentPage] = useState(1);
  const [greyFabricCurrentPage, setGreyFabricCurrentPage] = useState(1);
  const [dyedFabricCurrentPage, setDyedFabricCurrentPage] = useState(1);
  const [accessoryCurrentPage, setAccessoryCurrentPage] = useState(1);
  const recordsPerPage = 34;
  console.log(poType, localPoType, "type");
  console.log(valOptions, "valOptions");

  const [netpayRange, setNetpayRange] = useState({
    min: 0,
    max: Infinity,
  });
  const [netpayRange1, setNetpayRange1] = useState({
    min: 0,
    max: Infinity,
  });
  const [netpayRange2, setNetpayRange2] = useState({
    min: 0,
    max: Infinity,
  });
  const [netpayRange3, setNetpayRange3] = useState({
    min: 0,
    max: Infinity,
  });
  const [netpayRange4, setNetpayRange4] = useState({
    min: 0,
    max: Infinity,
  });
  const [netpayRange5, setNetpayRange5] = useState({
    min: 0,
    max: Infinity,
  });

  // ✅ API CALL INSIDE TABLE
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetGeneralYearQuery(
    {
      params: { selectedYear, companyName: localCompany },
    },
    { skip: !selectedYear || !companyName },
  );

  const {
    data: greyYarn,
    isLoading: greyYarnLoading,
    isFetching: greyYarnFetching,
  } = useGetGreyYarnTableQuery(
    {
      params: { selectedYear, companyName: localCompany },
    },
    { skip: !selectedYear || !companyName },
  );

  const {
    data: dyedYarn,
    isLoading: dyedYarnLoading,
    isFetching: dyedYarnFetching,
  } = useGetDyedYarnTableQuery(
    {
      params: { selectedYear, companyName: localCompany },
    },
    { skip: !selectedYear || !companyName },
  );

  const {
    data: greyFabric,
    isLoading: greyFabricLoading,
    isFetching: greyFabricFetching,
  } = useGetGreyFabricTableQuery(
    {
      params: { selectedYear, companyName: localCompany },
    },
    { skip: !selectedYear || !companyName },
  );

  const {
    data: dyedFabric,
    isLoading: dyedFabricLoading,
    isFetching: dyedFabricFetching,
  } = useGetDyedFabricTableQuery(
    {
      params: { selectedYear, companyName: localCompany },
    },
    { skip: !selectedYear || !companyName },
  );

  const {
    data: accessory,
    isLoading: accessoryLoading,
    isFetching: accessoryFetching,
  } = useGetAccessoryTableQuery(
    {
      params: { selectedYear, companyName: localCompany },
    },
    { skip: !selectedYear || !companyName },
  );

  const rawData = useMemo(() => {
    return Array.isArray(response?.data) ? response.data : [];
  }, [response?.data]);

  const greyYarnrawData = useMemo(() => {
    return Array.isArray(greyYarn?.data) ? greyYarn.data : [];
  }, [greyYarn?.data]);
  const dyedYarnrawData = useMemo(() => {
    return Array.isArray(dyedYarn?.data) ? dyedYarn.data : [];
  }, [dyedYarn?.data]);
  const greyFabricrawData = useMemo(() => {
    return Array.isArray(greyFabric?.data) ? greyFabric.data : [];
  }, [greyFabric?.data]);
  const dyedFabricrawData = useMemo(() => {
    return Array.isArray(dyedFabric?.data) ? dyedFabric.data : [];
  }, [dyedFabric?.data]);
  const accessoryrawData = useMemo(() => {
    return Array.isArray(accessory?.data) ? accessory.data : [];
  }, [accessory?.data]);

  // ✅ FILTERING
  const filteredData = useMemo(() => {
    return rawData.filter((row) => {
      // 🔹 Customer dropdown filter

      // 🔹 Search filter (month search)
      if (search.docId) {
        const rowdocId = row.docId?.toLowerCase() || "";
        if (!rowdocId.includes(search.docId.toLowerCase())) {
          return false;
        }
      }

      if (search.itemGroup) {
        const rowItemGroup = row.itemGroup?.toLowerCase() || "";
        if (!rowItemGroup.includes(search.itemGroup.toLowerCase())) {
          return false;
        }
      }

      if (search.itemName) {
        const rowitemName = row.item?.toLowerCase() || "";
        if (!rowitemName.includes(search.itemName.toLowerCase())) {
          return false;
        }
      }
      if (search.supplier) {
        const rowsupplier = row.supplier?.toLowerCase() || "";
        if (!rowsupplier.includes(search.supplier.toLowerCase())) {
          return false;
        }
      }

      // 🔹 Min / Max Turnover filter
      const value = Number(row.amount || 0);

      if (value < netpayRange.min) return false;
      if (netpayRange.max !== Infinity && value > netpayRange.max) return false;

      return true;
    });
  }, [rawData, search, netpayRange]);

  const greyYarnfilteredData = useMemo(() => {
    return greyYarnrawData.filter((row) => {
      // 🔹 Customer dropdown filter

      // 🔹 Search filter (month search)
      if (greyYarnsearch.docId) {
        const rowdocId = row.docId?.toLowerCase() || "";
        if (!rowdocId.includes(greyYarnsearch.docId.toLowerCase())) {
          return false;
        }
      }

      if (greyYarnsearch.yarnName) {
        const rowyarnName = row.yarnName?.toLowerCase() || "";
        if (!rowyarnName.includes(greyYarnsearch.yarnName.toLowerCase())) {
          return false;
        }
      }

      if (greyYarnsearch.orderNo) {
        const roworderNo = row.orderNo?.toLowerCase() || "";
        if (!roworderNo.includes(greyYarnsearch.orderNo.toLowerCase())) {
          return false;
        }
      }
      if (greyYarnsearch.supplier) {
        const rowsupplier = row.supplier?.toLowerCase() || "";
        if (!rowsupplier.includes(greyYarnsearch.supplier.toLowerCase())) {
          return false;
        }
      }
      if (greyYarnsearch.color) {
        const rowcolor = row.color?.toLowerCase() || "";
        if (!rowcolor.includes(greyYarnsearch.color.toLowerCase())) {
          return false;
        }
      }

      // 🔹 Min / Max Turnover filter
      const value = Number(row.amount || 0);

      if (value < netpayRange1.min) return false;
      if (netpayRange1.max !== Infinity && value > netpayRange1.max)
        return false;

      return true;
    });
  }, [greyYarnrawData, greyYarnsearch, netpayRange1]);

  const dyedYarnfilteredData = useMemo(() => {
    return dyedYarnrawData.filter((row) => {
      // 🔹 Customer dropdown filter

      // 🔹 Search filter (month search)
      if (dyedYarnsearch.docId) {
        const rowdocId = row.docId?.toLowerCase() || "";
        if (!rowdocId.includes(dyedYarnsearch.docId.toLowerCase())) {
          return false;
        }
      }

      if (dyedYarnsearch.yarnName) {
        const rowyarnName = row.yarnName?.toLowerCase() || "";
        if (!rowyarnName.includes(dyedYarnsearch.yarnName.toLowerCase())) {
          return false;
        }
      }

      if (dyedYarnsearch.orderNo) {
        const roworderNo = row.orderNo?.toLowerCase() || "";
        if (!roworderNo.includes(dyedYarnsearch.orderNo.toLowerCase())) {
          return false;
        }
      }
      if (dyedYarnsearch.supplier) {
        const rowsupplier = row.supplier?.toLowerCase() || "";
        if (!rowsupplier.includes(dyedYarnsearch.supplier.toLowerCase())) {
          return false;
        }
      }
      if (dyedYarnsearch.color) {
        const rowcolor = row.color?.toLowerCase() || "";
        if (!rowcolor.includes(dyedYarnsearch.color.toLowerCase())) {
          return false;
        }
      }

      // 🔹 Min / Max Turnover filter
      const value = Number(row.amount || 0);

      if (value < netpayRange2.min) return false;
      if (netpayRange2.max !== Infinity && value > netpayRange2.max)
        return false;

      return true;
    });
  }, [dyedYarnrawData, dyedYarnsearch, netpayRange2]);

  const greyFabricfilteredData = useMemo(() => {
    return greyFabricrawData.filter((row) => {
      // 🔹 Customer dropdown filter

      // 🔹 Search filter (month search)
      if (greyFabricsearch.docId) {
        const rowdocId = row.docId?.toLowerCase() || "";
        if (!rowdocId.includes(greyFabricsearch.docId.toLowerCase())) {
          return false;
        }
      }

      if (greyFabricsearch.fabricName) {
        const rowfabricName = row.fabricName?.toLowerCase() || "";
        if (
          !rowfabricName.includes(greyFabricsearch.fabricName.toLowerCase())
        ) {
          return false;
        }
      }

      if (greyFabricsearch.orderNo) {
        const roworderNo = row.orderNo?.toLowerCase() || "";
        if (!roworderNo.includes(greyFabricsearch.orderNo.toLowerCase())) {
          return false;
        }
      }
      if (greyFabricsearch.supplier) {
        const rowsupplier = row.supplier?.toLowerCase() || "";
        if (!rowsupplier.includes(greyFabricsearch.supplier.toLowerCase())) {
          return false;
        }
      }
      if (greyFabricsearch.color) {
        const rowcolor = row.color?.toLowerCase() || "";
        if (!rowcolor.includes(greyFabricsearch.color.toLowerCase())) {
          return false;
        }
      }

      // 🔹 Min / Max Turnover filter
      const value = Number(row.amount || 0);

      if (value < netpayRange3.min) return false;
      if (netpayRange3.max !== Infinity && value > netpayRange3.max)
        return false;

      return true;
    });
  }, [greyFabricrawData, greyFabricsearch, netpayRange3]);

  const dyedFabricfilteredData = useMemo(() => {
    return dyedFabricrawData.filter((row) => {
      // 🔹 Customer dropdown filter

      // 🔹 Search filter (month search)
      if (dyedFabricsearch.docId) {
        const rowdocId = row.docId?.toLowerCase() || "";
        if (!rowdocId.includes(dyedFabricsearch.docId.toLowerCase())) {
          return false;
        }
      }

      if (dyedFabricsearch.fabricName) {
        const rowfabricName = row.fabricName?.toLowerCase() || "";
        if (
          !rowfabricName.includes(dyedFabricsearch.fabricName.toLowerCase())
        ) {
          return false;
        }
      }

      if (dyedFabricsearch.orderNo) {
        const roworderNo = row.orderNo?.toLowerCase() || "";
        if (!roworderNo.includes(dyedFabricsearch.orderNo.toLowerCase())) {
          return false;
        }
      }
      if (dyedFabricsearch.supplier) {
        const rowsupplier = row.supplier?.toLowerCase() || "";
        if (!rowsupplier.includes(dyedFabricsearch.supplier.toLowerCase())) {
          return false;
        }
      }
      if (dyedFabricsearch.color) {
        const rowcolor = row.color?.toLowerCase() || "";
        if (!rowcolor.includes(dyedFabricsearch.color.toLowerCase())) {
          return false;
        }
      }

      // 🔹 Min / Max Turnover filter
      const value = Number(row.amount || 0);

      if (value < netpayRange4.min) return false;
      if (netpayRange4.max !== Infinity && value > netpayRange4.max)
        return false;

      return true;
    });
  }, [dyedFabricrawData, dyedFabricsearch, netpayRange4]);

  const accessoryfilteredData = useMemo(() => {
    return accessoryrawData.filter((row) => {
      // 🔹 Customer dropdown filter

      // 🔹 Search filter (month search)
      if (accessorysearch.docId) {
        const rowdocId = row.docId?.toLowerCase() || "";
        if (!rowdocId.includes(accessorysearch.docId.toLowerCase())) {
          return false;
        }
      }

      if (accessorysearch.accessGroupName) {
        const rowaccessGroupName = row.accessGroupName?.toLowerCase() || "";
        if (
          !rowaccessGroupName.includes(
            accessorysearch.accessGroupName.toLowerCase(),
          )
        ) {
          return false;
        }
      }
      if (accessorysearch.accessItemName) {
        const rowaccessItemName = row.accessItemName?.toLowerCase() || "";
        if (
          !rowaccessItemName.includes(
            accessorysearch.accessItemName.toLowerCase(),
          )
        ) {
          return false;
        }
      }
      if (accessorysearch.accessItemDesc) {
        const rowaccessItemDesc = row.accessItemDesc?.toLowerCase() || "";
        if (
          !rowaccessItemDesc.includes(
            accessorysearch.accessItemDesc.toLowerCase(),
          )
        ) {
          return false;
        }
      }
      if (accessorysearch.accessAliasName) {
        const rowaccessAliasName = row.accessAliasName?.toLowerCase() || "";
        if (
          !rowaccessAliasName.includes(
            accessorysearch.accessAliasName.toLowerCase(),
          )
        ) {
          return false;
        }
      }

      if (accessorysearch.orderNo) {
        const roworderNo = row.orderNo?.toLowerCase() || "";
        if (!roworderNo.includes(accessorysearch.orderNo.toLowerCase())) {
          return false;
        }
      }
      if (accessorysearch.supplier) {
        const rowsupplier = row.supplier?.toLowerCase() || "";
        if (!rowsupplier.includes(accessorysearch.supplier.toLowerCase())) {
          return false;
        }
      }
      if (accessorysearch.accessSize) {
        const rowsupplier = row.accessSize?.toLowerCase() || "";
        if (!rowsupplier.includes(accessorysearch.accessSize.toLowerCase())) {
          return false;
        }
      }

      // 🔹 Min / Max Turnover filter
      const value = Number(row.amount || 0);

      if (value < netpayRange5.min) return false;
      if (netpayRange5.max !== Infinity && value > netpayRange5.max)
        return false;

      return true;
    });
  }, [accessoryrawData, accessorysearch, netpayRange5]);

  useEffect(() => {
    setSelectedYear(year || "");
    setCurrentPage(1);
    setGreyYarnCurrentPage(1);
    setDyedYarnCurrentPage(1);
    setGreyFabricCurrentPage(1);
    setDyedFabricCurrentPage(1);
    setAccessoryCurrentPage(1);
  }, [year]);

  useEffect(() => {
    setLocalCompany(companyName || "");
  }, [companyName]);
  useEffect(() => {
    setSelectedOrdertype(type || "");
  }, [type]);
  useEffect(() => {
    setCurrentPage(1);
    setGreyYarnCurrentPage(1);
    setDyedYarnCurrentPage(1);
    setGreyFabricCurrentPage(1);
    setDyedFabricCurrentPage(1);
    setAccessoryCurrentPage(1);
  }, [localPoType]);

  // ✅ TOTAL
  const totalAmount = useMemo(
    () => filteredData.reduce((sum, r) => sum + Number(r.amount || 0), 0),
    [filteredData],
  );

  const greyYarnTotalAmount = useMemo(
    () =>
      greyYarnfilteredData.reduce((sum, r) => sum + Number(r.amount || 0), 0),
    [greyYarnfilteredData],
  );
  const dyedYarnTotalAmount = useMemo(
    () =>
      dyedYarnfilteredData.reduce((sum, r) => sum + Number(r.amount || 0), 0),
    [dyedYarnfilteredData],
  );
  const greyFabricotalAmount = useMemo(
    () =>
      greyFabricfilteredData.reduce((sum, r) => sum + Number(r.amount || 0), 0),
    [greyFabricfilteredData],
  );
  const dyedFabricTotalAmount = useMemo(
    () =>
      dyedFabricfilteredData.reduce((sum, r) => sum + Number(r.amount || 0), 0),
    [dyedFabricfilteredData],
  );
  const accessoryTotalAmount = useMemo(
    () =>
      accessoryfilteredData.reduce((sum, r) => sum + Number(r.amount || 0), 0),
    [accessoryfilteredData],
  );

  const displayTotal =
    localPoType === "General"
      ? totalAmount
      : localPoType === "Order" && selectedOrderType === "GREY YARN"
        ? greyYarnTotalAmount
        : localPoType === "Order" && selectedOrderType === "DYED YARN"
          ? dyedYarnTotalAmount
          : localPoType === "Order" && selectedOrderType === "GREY FABRIC"
            ? greyFabricotalAmount
            : localPoType === "Order" && selectedOrderType === "DYED FABRIC"
              ? dyedFabricTotalAmount
              : localPoType === "Order" && selectedOrderType === "ACCESSORY"
                ? accessoryTotalAmount
                : "";

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const greyYarntotalPages = Math.ceil(
    greyYarnfilteredData.length / recordsPerPage,
  );
  const dyedYarntotalPages = Math.ceil(
    dyedYarnfilteredData.length / recordsPerPage,
  );
  const greyFabrictotalPages = Math.ceil(
    greyFabricfilteredData.length / recordsPerPage,
  );
  const dyedFabrictotalPages = Math.ceil(
    dyedFabricfilteredData.length / recordsPerPage,
  );
  const accessorytotalPages = Math.ceil(
    accessoryfilteredData.length / recordsPerPage,
  );

  const currentRecords = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  );
  const currentRecordsGreyYarnfilteredData = greyYarnfilteredData.slice(
    (greyYarnCurrentPage - 1) * recordsPerPage,
    greyYarnCurrentPage * recordsPerPage,
  );
  const currentRecordsDyedYarnfilteredData = dyedYarnfilteredData.slice(
    (dyedYarnCurrentPage - 1) * recordsPerPage,
    dyedYarnCurrentPage * recordsPerPage,
  );
  const currentRecordsGreyFabricfilteredData = greyFabricfilteredData.slice(
    (greyFabricCurrentPage - 1) * recordsPerPage,
    greyFabricCurrentPage * recordsPerPage,
  );
  const currentRecordsDyedFabricfilteredData = dyedFabricfilteredData.slice(
    (dyedFabricCurrentPage - 1) * recordsPerPage,
    dyedFabricCurrentPage * recordsPerPage,
  );
  const currentRecordsAccessoryfilteredData = accessoryfilteredData.slice(
    (accessoryCurrentPage - 1) * recordsPerPage,
    accessoryCurrentPage * recordsPerPage,
  );

  const formateDate = (date) => {
    if (!date) return;

    return moment(date).format("DD-MM-YYYY");
  };

  // ✅ EXCEL EXPORT
  const downloadExcel = async () => {
    if (!filteredData.length) {
      alert("No data");
      return;
    }

    const totalRate = filteredData.reduce(
      (sum, r) => sum + Number(r.rate || 0),
      0,
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Year Wise Purchase Report");

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 8 },
      { header: "Doc No", key: "docNo", width: 24 },
      { header: "Supplier", key: "supplier", width: 60 },
      { header: "Doc Date", key: "docDate", width: 16 },
      { header: "Item Group", key: "itemGroup", width: 20 },
      { header: "Item Name", key: "item", width: 80 },

      { header: "Qty", key: "qty", width: 14 },
      { header: "UOM", key: "uom", width: 14 },
      { header: "Rate", key: "rate", width: 18 },
      { header: "Amount", key: "amount", width: 20 },
    ];

    // Title
    worksheet.insertRow(1, ["Year Wise Purchase Report"]);
    worksheet.mergeCells("A1:J1");
    const titleCell = worksheet.getCell("A1");
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(1).height = 30;

    // Insights row
    addInsightsRowTurnOver({
      worksheet,
      startRow: 2,
      totalColumns: 3,
      selectedYear,
      localCompany,
      dynamicField: "PO Type",
      dynamicValue: localPoType,
    });

    // Header formatting
    const headerRow = worksheet.getRow(3);
    headerRow.height = 26;
    headerRow.eachCell((cell) => {
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

    // Add data rows
    filteredData.forEach((r, index) => {
      const row = worksheet.addRow({
        sno: index + 1,
        docNo: r.docId,
        docDate: formateDate(r.docDate),
        itemGroup: r.itemGroup,
        item: r.item,
        supplier: r.supplier,
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.rate || 0),
        amount: Number(r.amount || 0),
      });
      row.getCell("qty").numFmt = getExcelQtyFormatByUOM(r.uom);
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 3) return;
      row.height = 22;
      [
        "sno",
        "docNo",
        "docDate",
        "itemGroup",
        "item",
        "supplier",
        "qty",
        "uom",
        "rate",
        "amount",
      ].forEach((key, i) => {
        const cell = row.getCell(i + 1);
        if (["qty", "rate", "amount"].includes(key)) {
          cell.alignment = {
            horizontal: "right",
            vertical: "middle",
            indent: 1,
          };
        } else {
          cell.alignment = {
            horizontal: "left",
            vertical: "middle",
            indent: 1,
          };
        }
      });
    });

    // Total row
    const totalRow = worksheet.addRow({
      sno: "",
      docNo: "",
      docDate: "",
      itemGroup: "",
      item: "",
      supplier: "",
      qty: "",
      uom: "Total",
      rate: totalRate,
      amount: totalAmount,
    });

    totalRow.height = 24;
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 9 || colNumber === 10 ? "right" : "center",
      };
    });

    worksheet.getColumn("docDate").numFmt = "dd-mm-yyyy";
    worksheet.getColumn("rate").numFmt = "₹ #,##,##0.00";
    worksheet.getColumn("amount").numFmt = "₹ #,##,##0.00";

    // Freeze headers
    worksheet.views = [{ state: "frozen", ySplit: 3 }];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Year Wise Purchase Report.xlsx",
    );
  };

  const downloadGreyYarnExcel = async () => {
    if (!greyYarnfilteredData.length) {
      alert("No data");
      return;
    }

    const totalRate = greyYarnfilteredData.reduce(
      (sum, r) => sum + Number(r.price || 0),
      0,
    );

    const totalAmount = greyYarnfilteredData.reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0,
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Year Wise Purchase Report");

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 8 },
      { header: "Doc No", key: "docNo", width: 24 },
      { header: "Doc Date", key: "docDate", width: 16 },
      { header: "Order No", key: "orderNo", width: 25 },
      { header: "Supplier", key: "supplier", width: 60 },
      { header: "Yarn Name", key: "yarn", width: 50 },

      { header: "Color", key: "color", width: 25 },
      { header: "Qty", key: "qty", width: 15 },
      { header: "UOM", key: "uom", width: 14 },
      { header: "Rate", key: "rate", width: 18 },
      { header: "Amount", key: "amount", width: 20 },
    ];

    // Title
    worksheet.insertRow(1, ["Year Wise Purchase Report"]);
    worksheet.mergeCells("A1:K1");
    const titleCell = worksheet.getCell("A1");
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(1).height = 30;

    addInsightsRowTurnOver({
      worksheet,
      startRow: 2,
      totalColumns: 3,
      selectedYear,
      localCompany,
      dynamicField: "PO Type",
      dynamicValue: localPoType,
      secondDynamicField: "Raw Material",
      seconddynamicValue: selectedOrderType,
    });

    // Header formatting
    const headerRow = worksheet.getRow(3);
    headerRow.height = 26;
    headerRow.eachCell((cell) => {
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
    greyYarnfilteredData.forEach((r, index) => {
      const row = worksheet.addRow({
        sno: index + 1,
        docNo: r.docId,
        docDate: formateDate(r.docDate),
        yarn: r.yarnName,
        orderNo: r.orderNo,
        supplier: r.supplier,
        color: r.color,
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.price || 0),
        amount: Number(r.amount || 0),
      });

      row.getCell("qty").numFmt = getExcelQtyFormatByUOM(r.uom);
    });

    // Alignment
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 2) return;

      row.height = 22;

      [
        "sno",
        "docNo",
        "docDate",
        "yarn",
        "orderNo",
        "supplier",
        "color",
        "qty",
        "uom",
        "rate",
        "amount",
      ].forEach((key, i) => {
        const cell = row.getCell(i + 1);

        if (["qty", "rate", "amount"].includes(key)) {
          cell.alignment = {
            horizontal: "right",
            vertical: "middle",
            indent: 1,
          };
        } else {
          cell.alignment = {
            horizontal: "left",
            vertical: "middle",
            indent: 1,
          };
        }
      });
    });

    // Total rowindent: 1,
    const totalRow = worksheet.addRow({
      sno: "",
      docNo: "",
      docDate: "",
      yarn: "",
      orderNo: "",
      supplier: "",
      color: "",
      qty: "",
      uom: "Total",
      rate: totalRate,
      amount: totalAmount,
    });

    totalRow.height = 24;
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 10 || colNumber === 11 ? "right" : "center",
      };
    });

    // Formats
    worksheet.getColumn("docDate").numFmt = "dd-mm-yyyy";
    worksheet.getColumn("rate").numFmt = "₹ #,##,##0.00";
    worksheet.getColumn("amount").numFmt = "₹ #,##,##0.00";

    // Freeze header
    worksheet.views = [{ state: "frozen", ySplit: 3 }];

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Year Wise Purchase Report.xlsx",
    );
  };
  const downloadDyedYarnExcel = async () => {
    if (!dyedYarnfilteredData.length) {
      alert("No data");
      return;
    }

    const totalRate = dyedYarnfilteredData.reduce(
      (sum, r) => sum + Number(r.price || 0),
      0,
    );

    const totalAmount = dyedYarnfilteredData.reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0,
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Year Wise Purchase Report");

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 8 },
      { header: "Doc No", key: "docNo", width: 24 },
      { header: "Doc Date", key: "docDate", width: 16 },
      { header: "Order No", key: "orderNo", width: 25 },
      { header: "Supplier", key: "supplier", width: 60 },
      { header: "Yarn Name", key: "yarn", width: 50 },

      { header: "Color", key: "color", width: 25 },
      { header: "Qty", key: "qty", width: 15 },
      { header: "UOM", key: "uom", width: 14 },
      { header: "Rate", key: "rate", width: 18 },
      { header: "Amount", key: "amount", width: 20 },
    ];

    // Title
    worksheet.insertRow(1, ["Year Wise Purchase Report"]);
    worksheet.mergeCells("A1:K1");
    const titleCell = worksheet.getCell("A1");
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(1).height = 30;

    addInsightsRowTurnOver({
      worksheet,
      startRow: 2,
      totalColumns: 3,
      selectedYear,
      localCompany,
      dynamicField: "PO Type",
      dynamicValue: localPoType,
      secondDynamicField: "Raw Material",
      seconddynamicValue: selectedOrderType,
    });

    // Header formatting
    const headerRow = worksheet.getRow(3);
    headerRow.height = 26;
    headerRow.eachCell((cell) => {
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
    dyedYarnfilteredData.forEach((r, index) => {
      const row = worksheet.addRow({
        sno: index + 1,
        docNo: r.docId,
        docDate: formateDate(r.docDate),
        yarn: r.yarnName,
        orderNo: r.orderNo,
        supplier: r.supplier,
        color: r.color,
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.price || 0),
        amount: Number(r.amount || 0),
      });

      row.getCell("qty").numFmt = getExcelQtyFormatByUOM(r.uom);
    });

    // Alignment
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 2) return;

      row.height = 22;

      [
        "sno",
        "docNo",
        "docDate",
        "yarn",
        "orderNo",
        "supplier",
        "color",
        "qty",
        "uom",
        "rate",
        "amount",
      ].forEach((key, i) => {
        const cell = row.getCell(i + 1);

        if (["qty", "rate", "amount"].includes(key)) {
          cell.alignment = {
            horizontal: "right",
            vertical: "middle",
            indent: 1,
          };
        } else {
          cell.alignment = {
            horizontal: "left",
            vertical: "middle",
            indent: 1,
          };
        }
      });
    });

    // Total rowindent: 1,
    const totalRow = worksheet.addRow({
      sno: "",
      docNo: "",
      docDate: "",
      yarn: "",
      orderNo: "",
      supplier: "",
      color: "",
      qty: "",
      uom: "Total",
      rate: totalRate,
      amount: totalAmount,
    });

    totalRow.height = 24;
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 10 || colNumber === 11 ? "right" : "center",
      };
    });

    // Formats
    worksheet.getColumn("docDate").numFmt = "dd-mm-yyyy";
    worksheet.getColumn("rate").numFmt = "₹ #,##,##0.00";
    worksheet.getColumn("amount").numFmt = "₹ #,##,##0.00";

    // Freeze header
    worksheet.views = [{ state: "frozen", ySplit: 3 }];

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Year Wise Purchase Report.xlsx",
    );
  };

  const downloadGreyFabricExcel = async () => {
    if (!greyFabricfilteredData.length) {
      alert("No data");
      return;
    }

    const totalRate = greyFabricfilteredData.reduce(
      (sum, r) => sum + Number(r.price || 0),
      0,
    );

    const totalAmount = greyFabricfilteredData.reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0,
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Year Wise Purchase Report");

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 8 },
      { header: "Doc No", key: "docNo", width: 24 },
      { header: "Doc Date", key: "docDate", width: 16 },
      { header: "Order No", key: "orderNo", width: 25 },
      { header: "Supplier", key: "supplier", width: 60 },
      { header: "Fabric Name", key: "fabric", width: 90 },

      { header: "Color", key: "color", width: 25 },
      { header: "Design", key: "design", width: 25 },
      { header: "GSM", key: "gsm", width: 15 },
      { header: "Qty", key: "qty", width: 16 },
      { header: "UOM", key: "uom", width: 14 },
      { header: "Rate", key: "rate", width: 18 },
      { header: "Amount", key: "amount", width: 20 },
    ];

    // Title
    worksheet.insertRow(1, ["Year Wise Purchase Report"]);
    worksheet.mergeCells("A1:M1");
    const titleCell = worksheet.getCell("A1");
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(1).height = 30;

    // Insights
    addInsightsRowTurnOver({
      worksheet,
      startRow: 2,
      totalColumns: 3,
      selectedYear,
      localCompany,
      dynamicField: "PO Type",
      dynamicValue: localPoType,
      secondDynamicField: "Raw Material",
      seconddynamicValue: selectedOrderType,
    });

    // Header formatting
    const headerRow = worksheet.getRow(3);
    headerRow.height = 26;
    headerRow.eachCell((cell) => {
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
    greyFabricfilteredData.forEach((r, index) => {
      const row = worksheet.addRow({
        sno: index + 1,
        docNo: r.docId,
        docDate: formateDate(r.docDate),
        fabric: r.fabricName,
        orderNo: r.orderNo,
        supplier: r.supplier,
        color: r.color,
        design: r.design,
        gsm:
          r.gsm !== null && r.gsm !== undefined && !isNaN(Number(r.gsm))
            ? Number(r.gsm)
            : "N/A",
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.price || 0),
        amount: Number(r.amount || 0),
      });

      row.getCell("qty").numFmt = getExcelQtyFormatByUOM(r.uom);
      const gsmCell = row.getCell("gsm");
      if (typeof gsmCell.value === "number") {
        gsmCell.numFmt = "0.000";
      }
    });

    // Alignment
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 3) return;

      row.height = 22;

      [
        "sno",
        "docNo",
        "docDate",
        "fabric",
        "orderNo",
        "supplier",
        "color",
        "design",
        "gsm",
        "qty",
        "uom",
        "rate",
        "amount",
      ].forEach((key, i) => {
        const cell = row.getCell(i + 1);

        if (["gsm", "qty", "rate", "amount"].includes(key)) {
          cell.alignment = {
            horizontal: "right",
            vertical: "middle",
            indent: 1,
          };
        } else {
          cell.alignment = {
            horizontal: "left",
            vertical: "middle",
            indent: 1,
          };
        }
      });
    });

    // Total row
    const totalRow = worksheet.addRow({
      sno: "",
      docNo: "",
      docDate: "",
      fabric: "",
      orderNo: "",
      supplier: "",
      color: "",
      design: "",
      gsm: "",
      qty: "",
      uom: "Total",
      rate: totalRate,
      amount: totalAmount,
    });

    totalRow.height = 24;
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 12 || colNumber === 13 ? "right" : "center",
      };
    });

    // Formats
    worksheet.getColumn("docDate").numFmt = "dd-mm-yyyy";
    worksheet.getColumn("rate").numFmt = "₹ #,##,##0.00";
    worksheet.getColumn("amount").numFmt = "₹ #,##,##0.00";

    // Freeze header
    worksheet.views = [{ state: "frozen", ySplit: 3 }];

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Year Wise Purchase Report.xlsx",
    );
  };
  const downloadDyedFabricExcel = async () => {
    if (!dyedFabricfilteredData.length) {
      alert("No data");
      return;
    }

    const totalRate = dyedFabricfilteredData.reduce(
      (sum, r) => sum + Number(r.price || 0),
      0,
    );

    const totalAmount = dyedFabricfilteredData.reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0,
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Year Wise Purchase Report");

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 8 },
      { header: "Doc No", key: "docNo", width: 24 },
      { header: "Doc Date", key: "docDate", width: 16 },
      { header: "Order No", key: "orderNo", width: 25 },
      { header: "Supplier", key: "supplier", width: 60 },
      { header: "Fabric Name", key: "fabric", width: 90 },

      { header: "Color", key: "color", width: 25 },
      { header: "Design", key: "design", width: 25 },
      { header: "GSM", key: "gsm", width: 15 },
      { header: "Qty", key: "qty", width: 16 },
      { header: "UOM", key: "uom", width: 14 },
      { header: "Rate", key: "rate", width: 18 },
      { header: "Amount", key: "amount", width: 20 },
    ];

    // Title
    worksheet.insertRow(1, ["Year Wise Purchase Report"]);
    worksheet.mergeCells("A1:M1");
    const titleCell = worksheet.getCell("A1");
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(1).height = 30;

    // Insights
    addInsightsRowTurnOver({
      worksheet,
      startRow: 2,
      totalColumns: 3,
      selectedYear,
      localCompany,
      dynamicField: "PO Type",
      dynamicValue: localPoType,
      secondDynamicField: "Raw Material",
      seconddynamicValue: selectedOrderType,
    });

    // Header formatting
    const headerRow = worksheet.getRow(3);
    headerRow.height = 26;
    headerRow.eachCell((cell) => {
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
    dyedFabricfilteredData.forEach((r, index) => {
      const row = worksheet.addRow({
        sno: index + 1,
        docNo: r.docId,
        docDate: formateDate(r.docDate),
        fabric: r.fabricName,
        orderNo: r.orderNo,
        supplier: r.supplier,
        color: r.color,
        design: r.design,
        gsm:
          r.gsm !== null && r.gsm !== undefined && !isNaN(Number(r.gsm))
            ? Number(r.gsm)
            : "N/A",
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.price || 0),
        amount: Number(r.amount || 0),
      });

      row.getCell("qty").numFmt = getExcelQtyFormatByUOM(r.uom);
      const gsmCell = row.getCell("gsm");
      if (typeof gsmCell.value === "number") {
        gsmCell.numFmt = "0.000";
      }
    });

    // Alignment
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 3) return;

      row.height = 22;

      [
        "sno",
        "docNo",
        "docDate",
        "fabric",
        "orderNo",
        "supplier",
        "color",
        "design",
        "gsm",
        "qty",
        "uom",
        "rate",
        "amount",
      ].forEach((key, i) => {
        const cell = row.getCell(i + 1);

        if (["gsm", "qty", "rate", "amount"].includes(key)) {
          cell.alignment = {
            horizontal: "right",
            vertical: "middle",
            indent: 1,
          };
        } else {
          cell.alignment = {
            horizontal: "left",
            vertical: "middle",
            indent: 1,
          };
        }
      });
    });

    // Total row
    const totalRow = worksheet.addRow({
      sno: "",
      docNo: "",
      docDate: "",
      fabric: "",
      orderNo: "",
      supplier: "",
      color: "",
      design: "",
      gsm: "",
      qty: "",
      uom: "Total",
      rate: totalRate,
      amount: totalAmount,
    });

    totalRow.height = 24;
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 12 || colNumber === 13 ? "right" : "center",
      };
    });

    // Formats
    worksheet.getColumn("docDate").numFmt = "dd-mm-yyyy";
    worksheet.getColumn("rate").numFmt = "₹ #,##,##0.00";
    worksheet.getColumn("amount").numFmt = "₹ #,##,##0.00";

    // Freeze header
    worksheet.views = [{ state: "frozen", ySplit: 3 }];

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Year Wise Purchase Report.xlsx",
    );
  };

  const downloadAccessoryExcel = async () => {
    if (!accessoryfilteredData.length) {
      alert("No data");
      return;
    }

    const totalRate = accessoryfilteredData.reduce(
      (sum, r) => sum + Number(r.price || 0),
      0,
    );

    const totalAmount = accessoryfilteredData.reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0,
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Year Wise Purchase Report");

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 8 },
      { header: "Doc No", key: "docNo", width: 24 },
      { header: "Doc Date", key: "docDate", width: 16 },
      { header: "Order No", key: "orderNo", width: 28 },
      { header: "Supplier", key: "supplier", width: 96 },
      { header: "Accessory Group Name", key: "accessGroupName", width: 32 },
      { header: "Accessory Item Group Name", key: "accessItemName", width: 40 },
      { header: "Accessory Item Name", key: "accessItemDesc", width: 72 },
      { header: "Size", key: "accessSize", width: 20 },
      { header: "Qty", key: "qty", width: 12 },
      { header: "UOM", key: "uom", width: 12 },
      { header: "Rate", key: "rate", width: 16 },
      { header: "Amount", key: "amount", width: 20 },
    ];

    // Title
    worksheet.insertRow(1, ["Year Wise Purchase Report"]);
    worksheet.mergeCells("A1:M1");
    const titleCell = worksheet.getCell("A1");
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(1).height = 30;

    // Insights (optional)
    addInsightsRowTurnOver({
      worksheet,
      startRow: 2,
      totalColumns: 3,
      selectedYear,
      localCompany,
      dynamicField: "PO Type",
      dynamicValue: localPoType,
      secondDynamicField: "Raw Material",
      seconddynamicValue: selectedOrderType,
    });

    // Header formatting
    const headerRow = worksheet.getRow(3);
    headerRow.height = 26;
    headerRow.eachCell((cell) => {
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
    accessoryfilteredData.forEach((r, index) => {
      const row = worksheet.addRow({
        sno: index + 1,
        docNo: r.docId,
        docDate: formateDate(r.docDate),
        orderNo: r.orderNo,
        supplier: r.supplier,
        accessGroupName: r.accessGroupName,
        accessItemName: r.accessItemName,
        accessItemDesc: r.accessItemDesc,
        accessSize: r.accessSize,
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.price || 0),
        amount: Number(r.amount || 0),
      });

      row.getCell("qty").numFmt = getExcelQtyFormatByUOM(r.uom);
    });

    // Alignment
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 3) return;

      row.height = 22;

      [
        "sno",
        "docNo",
        "docDate",
        "orderNo",
        "supplier",
        "accessGroupName",
        "accessItemName",
        "accessItemDesc",
        "accessSize",
        "qty",
        "uom",
        "rate",
        "amount",
      ].forEach((key, i) => {
        const cell = row.getCell(i + 1);

        if (["qty", "rate", "amount"].includes(key)) {
          cell.alignment = {
            horizontal: "right",
            vertical: "middle",
            indent: 1,
          };
        } else {
          cell.alignment = {
            horizontal: "left",
            vertical: "middle",
            indent: 1,
          };
        }
      });
    });

    // Total row
    const totalRow = worksheet.addRow({
      sno: "",
      docNo: "",
      docDate: "",
      orderNo: "",
      supplier: "",
      accessGroupName: "",
      accessItemName: "",
      accessItemDesc: "",
      accessSize: "",
      qty: "",
      uom: "Total",
      rate: totalRate,
      amount: totalAmount,
    });

    totalRow.height = 24;
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 12 || colNumber === 13 ? "right" : "center",
      };
    });

    // Formats
    worksheet.getColumn("docDate").numFmt = "dd-mm-yyyy";
    worksheet.getColumn("rate").numFmt = "₹ #,##,##0.00";
    worksheet.getColumn("amount").numFmt = "₹ #,##,##0.00";

    // Freeze header
    worksheet.views = [{ state: "frozen", ySplit: 3 }];

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Year Wise Purchase Report.xlsx",
    );
  };

  const downloadExcelSelected =
    localPoType === "General"
      ? downloadExcel
      : localPoType === "Order" && selectedOrderType === "GREY YARN"
        ? downloadGreyYarnExcel
        : localPoType === "Order" && selectedOrderType === "DYED YARN"
          ? downloadDyedYarnExcel
          : localPoType === "Order" && selectedOrderType === "GREY FABRIC"
            ? downloadGreyFabricExcel
            : localPoType === "Order" && selectedOrderType === "DYED FABRIC"
              ? downloadDyedFabricExcel
              : localPoType === "Order" && selectedOrderType === "ACCESSORY"
                ? downloadAccessoryExcel
                : null;

  const purchaseTypeOptions = [
    { label: "GREY YARN", value: "GREY YARN" },
    { label: "DYED YARN", value: "DYED YARN" },
    { label: "GREY FABRIC", value: "GREY FABRIC" },
    { label: "DYED FABRIC", value: "DYED FABRIC" },
    { label: "ACCESSORY", value: "ACCESSORY" },
  ];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1470px] h-[630px] p-4 rounded-xl relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase">
            Year Wise Purchase Report -{" "}
            <span className="text-blue-600 ">{localCompany || ""}</span>
          </h2>

          <div className="flex gap-2 items-center">
            <div className="bg-gray-300  rounded-lg shadow-2xl flex gap-x-4 gap-1 p-2">
              <button
                onClick={() => setLocalPoType("General")}
                className={`w-20 text-center flex items-center justify-center gap-2 px-3 py-0.5 text-[11px] font-semibold rounded-full shadow-md transition-all 
                  ${
                    localPoType === "General"
                      ? "bg-blue-600 text-white scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-400`}
              >
                General
              </button>

              <button
                onClick={() => setLocalPoType("Order")}
                className={`w-16 text-center flex items-center justify-center gap-2 px-3 py-0.5 text-[11px] font-semibold rounded-full shadow-md transition-all 
                  ${
                    localPoType === "Order"
                      ? "bg-blue-600 text-white scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-400`}
              >
                Order
              </button>

              <div className="w-24">
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setCurrentPage(1);
                    setGreyYarnCurrentPage(1);
                    setDyedYarnCurrentPage(1);
                    setGreyFabricCurrentPage(1);
                    setDyedFabricCurrentPage(1);
                    setAccessoryCurrentPage(1);
                  }}
                  className="w-full px-2 py-1 text-xs border-2 rounded-md border-blue-600 transition-all duration-200"
                >
                  <option value="">Select Year</option>
                  {(finYr?.data || []).map((item) => (
                    <option key={item.finYear} value={item.finYear}>
                      {item.finYear}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-28">
                <select
                  value={localCompany || ""}
                  onChange={(e) => {
                    setLocalCompany(e.target.value);
                    setCurrentPage(1);
                    setGreyYarnCurrentPage(1);
                    setDyedYarnCurrentPage(1);
                    setGreyFabricCurrentPage(1);
                    setDyedFabricCurrentPage(1);
                    setAccessoryCurrentPage(1);
                  }}
                  className="w-full px-2 py-1 text-xs border-2 rounded-md border-blue-600 transition-all duration-200"
                >
                  <option value="">Select Company</option>
                  {/* {companyList?.data?.map((item) => (
                    <option key={item.COMPCODE} value={item.COMPCODE}>
                      {item.COMPCODE}
                    </option>
                  ))} */}
                  <option value="JKC">JKC</option>
                </select>
              </div>
              {localPoType === "Order" ? (
                <>
                  <div className="w-32">
                    <select
                      value={selectedOrderType || ""}
                      onChange={(e) => {
                        setSelectedOrdertype(e.target.value);
                        setCurrentPage(1);
                        setGreyYarnCurrentPage(1);
                        setDyedYarnCurrentPage(1);
                      }}
                      className="w-full px-2 py-1 text-xs border-2 rounded-md border-blue-600 transition-all duration-200"
                    >
                      <option value="">Select</option>
                      {purchaseTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            <button className="text-red-600" onClick={closeTable}>
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* TOTAL */}
        <p className="text-xs font-semibold  text-gray-600">
          Total Amount :{" "}
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(displayTotal)}
        </p>

        {/* SEARCH */}

        <div className="flex justify-between items-start mt-2">
          <div className="flex gap-x-4 mb-3">
            {localPoType === "General" ? (
              <>
                {["docId", "supplier", "itemGroup", "itemName"].map((key) => (
                  <div key={key} className="relative">
                    <input
                      type="text"
                      placeholder={`Search ${key}...`}
                      value={search[key] || ""}
                      onChange={(e) =>
                        setSearch({ ...search, [key]: e.target.value })
                      }
                      className="w-full h-6 p-1 pl-8 text-gray-900 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                    />
                    <FaSearch className="absolute left-2 top-1.5 text-gray-500 text-sm" />
                  </div>
                ))}
              </>
            ) : localPoType === "Order" && selectedOrderType === "GREY YARN" ? (
              <>
                {["docId", "orderNo", "supplier", "yarnName", "color"].map(
                  (key) => (
                    <div key={key} className="relative">
                      <input
                        type="text"
                        placeholder={`Search ${key}...`}
                        value={greyYarnsearch[key] || ""}
                        onChange={(e) =>
                          setGreyYarnSearch({
                            ...greyYarnsearch,
                            [key]: e.target.value,
                          })
                        }
                        className="w-full h-6 p-1 pl-8 text-gray-900 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                      />
                      <FaSearch className="absolute left-2 top-1.5 text-gray-500 text-sm" />
                    </div>
                  ),
                )}
              </>
            ) : localPoType === "Order" && selectedOrderType === "DYED YARN" ? (
              <>
                {["docId", "orderNo", "supplier", "yarnName", "color"].map(
                  (key) => (
                    <div key={key} className="relative">
                      <input
                        type="text"
                        placeholder={`Search ${key}...`}
                        value={dyedYarnsearch[key] || ""}
                        onChange={(e) =>
                          setDyedYarnSearch({
                            ...dyedYarnsearch,
                            [key]: e.target.value,
                          })
                        }
                        className="w-full h-6 p-1 pl-8 text-gray-900 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                      />
                      <FaSearch className="absolute left-2 top-1.5 text-gray-500 text-sm" />
                    </div>
                  ),
                )}
              </>
            ) : localPoType === "Order" &&
              selectedOrderType === "GREY FABRIC" ? (
              <>
                {["docId", "orderNo", "supplier", "fabricName", "color"].map(
                  (key) => (
                    <div key={key} className="relative">
                      <input
                        type="text"
                        placeholder={`Search ${key}...`}
                        value={greyFabricsearch[key] || ""}
                        onChange={(e) =>
                          setGreyFabricSearch({
                            ...greyFabricsearch,
                            [key]: e.target.value,
                          })
                        }
                        className="w-full h-6 p-1 pl-8 text-gray-900 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                      />
                      <FaSearch className="absolute left-2 top-1.5 text-gray-500 text-sm" />
                    </div>
                  ),
                )}
              </>
            ) : localPoType === "Order" &&
              selectedOrderType === "DYED FABRIC" ? (
              <>
                {["docId", "orderNo", "supplier", "fabricName", "color"].map(
                  (key) => (
                    <div key={key} className="relative">
                      <input
                        type="text"
                        placeholder={`Search ${key}...`}
                        value={dyedFabricsearch[key] || ""}
                        onChange={(e) =>
                          setDyedFabricSearch({
                            ...dyedFabricsearch,
                            [key]: e.target.value,
                          })
                        }
                        className="w-full h-6 p-1 pl-8 text-gray-900 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                      />
                      <FaSearch className="absolute left-2 top-1.5 text-gray-500 text-sm" />
                    </div>
                  ),
                )}
              </>
            ) : localPoType === "Order" && selectedOrderType === "ACCESSORY" ? (
              <>
                {[
                  "docId",
                  "orderNo",
                  "supplier",

                  "accessItemName",

                  "accessSize",
                ].map((key) => (
                  <div key={key} className="relative">
                    <input
                      type="text"
                      placeholder={`Search ${key}...`}
                      value={accessorysearch[key] || ""}
                      onChange={(e) =>
                        setAccessorySearch({
                          ...accessorysearch,
                          [key]: e.target.value,
                        })
                      }
                      className="w-full h-6 p-1 pl-8 text-gray-900 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                    />
                    <FaSearch className="absolute left-2 top-1.5 text-gray-500 text-sm" />
                  </div>
                ))}
              </>
            ) : (
              ""
            )}
          </div>
          <div className=" flex gap-x-2">
            <div className="flex items-center text-[12px]">
              <span className="text-gray-500">Min amount : </span>
              {localPoType === "General" ? (
                <>
                  <input
                    type="text"
                    value={netpayRange.min}
                    onChange={(e) =>
                      setNetpayRange({
                        ...netpayRange,
                        min: Number(e.target.value),
                      })
                    }
                    className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </>
              ) : localPoType === "Order" &&
                selectedOrderType === "GREY YARN" ? (
                <>
                  <input
                    type="text"
                    value={netpayRange1.min}
                    onChange={(e) =>
                      setNetpayRange1({
                        ...netpayRange1,
                        min: Number(e.target.value),
                      })
                    }
                    className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </>
              ) : localPoType === "Order" &&
                selectedOrderType === "DYED YARN" ? (
                <>
                  <input
                    type="text"
                    value={netpayRange2.min}
                    onChange={(e) =>
                      setNetpayRange2({
                        ...netpayRange2,
                        min: Number(e.target.value),
                      })
                    }
                    className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </>
              ) : localPoType === "Order" &&
                selectedOrderType === "GREY FABRIC" ? (
                <>
                  <input
                    type="text"
                    value={netpayRange3.min}
                    onChange={(e) =>
                      setNetpayRange3({
                        ...netpayRange3,
                        min: Number(e.target.value),
                      })
                    }
                    className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </>
              ) : localPoType === "Order" &&
                selectedOrderType === "DYED FABRIC" ? (
                <>
                  <input
                    type="text"
                    value={netpayRange4.min}
                    onChange={(e) =>
                      setNetpayRange4({
                        ...netpayRange4,
                        min: Number(e.target.value),
                      })
                    }
                    className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </>
              ) : localPoType === "Order" &&
                selectedOrderType === "ACCESSORY" ? (
                <>
                  <input
                    type="text"
                    value={netpayRange5.min}
                    onChange={(e) =>
                      setNetpayRange5({
                        ...netpayRange5,
                        min: Number(e.target.value),
                      })
                    }
                    className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </>
              ) : (
                ""
              )}
            </div>

            <div className="flex items-center  text-[12px]">
              <span className="text-gray-500">Max amount : </span>
              {localPoType === "General" ? (
                <>
                  <input
                    type="text"
                    value={netpayRange.max === Infinity ? "" : netpayRange.max}
                    onChange={(e) => {
                      const val = e.target.value;

                      setNetpayRange({
                        ...netpayRange,
                        max: val === "" ? Infinity : Number(val),
                      });
                    }}
                    className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </>
              ) : localPoType === "Order" &&
                selectedOrderType === "GREY YARN" ? (
                <>
                  <input
                    type="text"
                    value={
                      netpayRange1.max === Infinity ? "" : netpayRange1.max
                    }
                    onChange={(e) => {
                      const val = e.target.value;

                      setNetpayRange1({
                        ...netpayRange1,
                        max: val === "" ? Infinity : Number(val),
                      });
                    }}
                    className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </>
              ) : localPoType === "Order" &&
                selectedOrderType === "DYED YARN" ? (
                <>
                  <input
                    type="text"
                    value={
                      netpayRange2.max === Infinity ? "" : netpayRange2.max
                    }
                    onChange={(e) => {
                      const val = e.target.value;

                      setNetpayRange2({
                        ...netpayRange2,
                        max: val === "" ? Infinity : Number(val),
                      });
                    }}
                    className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </>
              ) : localPoType === "Order" &&
                selectedOrderType === "GREY FABRIC" ? (
                <>
                  <input
                    type="text"
                    value={
                      netpayRange3.max === Infinity ? "" : netpayRange3.max
                    }
                    onChange={(e) => {
                      const val = e.target.value;

                      setNetpayRange3({
                        ...netpayRange3,
                        max: val === "" ? Infinity : Number(val),
                      });
                    }}
                    className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </>
              ) : localPoType === "Order" &&
                selectedOrderType === "DYED FABRIC" ? (
                <>
                  <input
                    type="text"
                    value={
                      netpayRange4.max === Infinity ? "" : netpayRange4.max
                    }
                    onChange={(e) => {
                      const val = e.target.value;

                      setNetpayRange4({
                        ...netpayRange4,
                        max: val === "" ? Infinity : Number(val),
                      });
                    }}
                    className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </>
              ) : localPoType === "Order" &&
                selectedOrderType === "ACCESSORY" ? (
                <>
                  <input
                    type="text"
                    value={
                      netpayRange5.max === Infinity ? "" : netpayRange5.max
                    }
                    onChange={(e) => {
                      const val = e.target.value;

                      setNetpayRange5({
                        ...netpayRange5,
                        max: val === "" ? Infinity : Number(val),
                      });
                    }}
                    className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </>
              ) : (
                ""
              )}
            </div>
            <button
              onClick={downloadExcelSelected}
              disabled={!downloadExcelSelected}
              className="p-0 rounded-full shadow-md hover:brightness-110 transition-all duration-300"
              title="Download Excel"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
                alt="Download Excel"
                className="w-7 h-7 rounded-lg"
              />
            </button>
          </div>
        </div>
        {/* TABLE */}
        <div className="grid  gap-4">
          <div
            className="overflow-x-auto h-[470px]  border border-gray-300"
            style={{ border: "1px solid gray", borderRadius: "16px" }}
          >
            {localPoType === "General" ? (
              <>
                <table className="w-full border-collapse text-[11px] table-fixed">
                  <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                    <tr>
                      <th className="border p-1 text-center w-4">S.No</th>
                      {/* <th className="border p-1 text-center w-8">Year</th> */}
                      <th className="border p-1 text-center w-16">Doc No</th>
                      <th className="border p-1 text-center w-[38px]">
                        Doc Date
                      </th>
                      <th className="border p-1 text-center w-36">Supplier</th>
                      <th className="border p-1 text-center w-12">
                        Item Group
                      </th>
                      <th className="border p-1 text-center w-52">Item Name</th>

                      <th className="border p-1 text-center w-8">Qty</th>
                      <th className="border p-1 text-center w-8">UOM</th>
                      <th className="border p-1 text-center w-8">Rate</th>
                      <th className="border p-1 text-center w-12">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading || isFetching ? (
                      <tr>
                        <td colSpan={10} className=" text-center">
                          <div className="flex justify-center items-center pointer-events-none">
                            <SpinLoader />
                          </div>
                        </td>
                      </tr>
                    ) : currentRecords.length === 0 ? (
                      <tr>
                        <td
                          colSpan={10}
                          className="text-center py-6 text-gray-500 border-b-0"
                        >
                          No data found
                        </td>
                      </tr>
                    ) : (
                      currentRecords?.map((row, index) => {
                        const globalIndex = index; // 0–16
                        const serialNo =
                          (currentPage - 1) * recordsPerPage + globalIndex + 1;

                        return (
                          <tr
                            key={index}
                            className="text-gray-800 bg-white even:bg-gray-100"
                          >
                            <td className="border p-1 text-center">
                              {serialNo}
                            </td>
                            {/* <td className="border p-1 pl-2 text-left">
                          {row.finYear}
                        </td> */}
                            <td className="border p-1 pl-2 text-left">
                              {row.docId}
                            </td>

                            <td className="border p-1 pl-2 text-left ">
                              {formateDate(row.docDate)}
                            </td>
                            <td className="border p-1 pr-2 text-left">
                              {row.supplier}
                            </td>
                            <td className="border p-1 pl-2 text-left ">
                              {row.itemGroup}
                            </td>
                            <td className="border p-1 pr-2 text-left">
                              {row.item}
                            </td>

                            <td className="border p-1 pr-2 text-right">
                              {" "}
                              {formatQtyByUOM(row.qty, row.uom)}
                            </td>
                            <td className="border p-1 pl-2 text-left">
                              {row.uom}
                            </td>

                            {/* <td className="border p-1 pr-2 text-right">{row.rate}</td> */}

                            <td className="border p-1 pr-2 text-right  ">
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(row.rate)}
                            </td>
                            <td className="border p-1 pr-2 text-right text-sky-700 ">
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(row.amount)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </>
            ) : localPoType === "Order" && selectedOrderType === "GREY YARN" ? (
              <>
                <table className="w-[1800px] overflow-x-auto border-collapse text-[11px] table-fixed">
                  <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                    <tr>
                      <th className="border p-1 text-center w-4">S.No</th>
                      {/* <th className="border p-1 text-center w-8">Year</th> */}
                      <th className="border p-1 text-center w-24">Doc No</th>
                      <th className="border p-1 text-center w-[50px]">
                        Doc Date
                      </th>
                      <th className="border p-1 text-center w-24">Order No</th>
                      <th className="border p-1 text-center w-60">Supplier</th>
                      <th className="border p-1 text-center w-72">Yarn Name</th>

                      <th className="border p-1 text-center w-20">Color</th>
                      <th className="border p-1 text-center w-12">Qty</th>
                      <th className="border p-1 text-center w-8">UOM</th>
                      <th className="border p-1 text-center w-12">Rate</th>
                      <th className="border p-1 text-center w-12">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {greyYarnLoading || greyYarnFetching ? (
                      <tr>
                        <td colSpan={11} className=" text-center">
                          <div className="flex justify-center items-center pointer-events-none">
                            <SpinLoader />
                          </div>
                        </td>
                      </tr>
                    ) : currentRecordsGreyYarnfilteredData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={11}
                          className="text-center py-6 text-gray-500 border-b-0"
                        >
                          No data found
                        </td>
                      </tr>
                    ) : (
                      currentRecordsGreyYarnfilteredData?.map((row, index) => {
                        const globalIndex = index; // 0–16
                        const serialNo =
                          (greyYarnCurrentPage - 1) * recordsPerPage +
                          globalIndex +
                          1;

                        return (
                          <tr
                            key={index}
                            className="text-gray-800 bg-white even:bg-gray-100"
                          >
                            <td className="border p-1 text-center">
                              {serialNo}
                            </td>
                            {/* <td className="border p-1 pl-2 text-left">
                          {row.finYear}
                        </td> */}
                            <td className="border p-1 pl-2 text-left">
                              {row.docId}
                            </td>

                            <td className="border p-1 pl-2 text-left ">
                              {formateDate(row.docDate)}
                            </td>
                            <td className="border p-1 pr-2 text-left">
                              {row.orderNo}
                            </td>
                            <td className="border p-1 pr-2 text-left">
                              {row.supplier}
                            </td>
                            <td className="border p-1 pl-2 text-left ">
                              {row.yarnName}
                            </td>

                            <td className="border p-1 pr-2 text-left">
                              {row.color}
                            </td>
                            <td className="border p-1 pr-2 text-right">
                              {" "}
                              {formatQtyByUOM(row.qty, row.uom)}
                            </td>
                            <td className="border p-1 pl-2 text-left">
                              {row.uom}
                            </td>

                            {/* <td className="border p-1 pr-2 text-right">{row.rate}</td> */}

                            <td className="border p-1 pr-2 text-right  ">
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(row.price)}
                            </td>
                            <td className="border p-1 pr-2 text-right text-sky-700 ">
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(row.amount)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </>
            ) : localPoType === "Order" && selectedOrderType === "DYED YARN" ? (
              <>
                <table className="w-[1620px] overflow-x-auto border-collapse text-[11px] table-fixed">
                  <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                    <tr>
                      <th className="border p-1 text-center w-4">S.No</th>
                      {/* <th className="border p-1 text-center w-8">Year</th> */}
                      <th className="border p-1 text-center w-20">Doc No</th>
                      <th className="border p-1 text-center w-[48px]">
                        Doc Date
                      </th>
                      <th className="border p-1 text-center w-20">Order No</th>
                      <th className="border p-1 text-center w-44">Supplier</th>
                      <th className="border p-1 text-center w-72">Yarn</th>

                      <th className="border p-1 text-center w-20">Color</th>
                      <th className="border p-1 text-center w-8">Qty</th>
                      <th className="border p-1 text-center w-8">UOM</th>
                      <th className="border p-1 text-center w-8">Rate</th>
                      <th className="border p-1 text-center w-12">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dyedYarnLoading || dyedYarnFetching ? (
                      <tr>
                        <td colSpan={11} className=" text-center">
                          <div className="flex justify-center items-center pointer-events-none">
                            <SpinLoader />
                          </div>
                        </td>
                      </tr>
                    ) : currentRecordsDyedYarnfilteredData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={11}
                          className="text-center py-6 text-gray-500 border-b-0"
                        >
                          No data found
                        </td>
                      </tr>
                    ) : (
                      currentRecordsDyedYarnfilteredData?.map((row, index) => {
                        const globalIndex = index; // 0–16
                        const serialNo =
                          (dyedYarnCurrentPage - 1) * recordsPerPage +
                          globalIndex +
                          1;

                        return (
                          <tr
                            key={index}
                            className="text-gray-800 bg-white even:bg-gray-100"
                          >
                            <td className="border p-1 text-center">
                              {serialNo}
                            </td>
                            {/* <td className="border p-1 pl-2 text-left">
                          {row.finYear}
                        </td> */}
                            <td className="border p-1 pl-2 text-left">
                              {row.docId}
                            </td>

                            <td className="border p-1 pl-2 text-left ">
                              {formateDate(row.docDate)}
                            </td>
                            <td className="border p-1 pr-2 text-left">
                              {row.orderNo}
                            </td>
                            <td className="border p-1 pr-2 text-left">
                              {row.supplier}
                            </td>
                            <td className="border p-1 pl-2 text-left ">
                              {row.yarnName}
                            </td>

                            <td className="border p-1 pr-2 text-left">
                              {row.color}
                            </td>
                            <td className="border p-1 pr-2 text-right">
                              {" "}
                              {formatQtyByUOM(row.qty, row.uom)}
                            </td>
                            <td className="border p-1 pl-2 text-left">
                              {row.uom}
                            </td>

                            {/* <td className="border p-1 pr-2 text-right">{row.rate}</td> */}

                            <td className="border p-1 pr-2 text-right  ">
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(row.price)}
                            </td>
                            <td className="border p-1 pr-2 text-right text-sky-700 ">
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(row.amount)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </>
            ) : localPoType === "Order" &&
              selectedOrderType === "GREY FABRIC" ? (
              <>
                <table className="w-[1700px] overflow-x-auto border-collapse text-[11px] table-fixed">
                  <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                    <tr>
                      <th className="border p-1 text-center w-4">S.No</th>
                      {/* <th className="border p-1 text-center w-8">Year</th> */}
                      <th className="border p-1 text-center w-24">Doc No</th>
                      <th className="border p-1 text-center w-16">Doc Date</th>
                      <th className="border p-1 text-center w-24">Order No</th>
                      <th className="border p-1 text-center w-44">Supplier</th>
                      <th className="border p-1 text-center w-80">
                        Fabric Name
                      </th>

                      <th className="border p-1 text-center w-20">Color</th>
                      <th className="border p-1 text-center w-20">Design</th>
                      <th className="border p-1 text-center w-12">GSM</th>
                      <th className="border p-1 text-center w-12">Qty</th>
                      <th className="border p-1 text-center w-8">UOM</th>
                      <th className="border p-1 text-center w-12">Rate</th>
                      <th className="border p-1 text-center w-16">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {greyFabricLoading || greyFabricFetching ? (
                      <tr>
                        <td colSpan={11} className=" text-center">
                          <div className="flex justify-center items-center pointer-events-none">
                            <SpinLoader />
                          </div>
                        </td>
                      </tr>
                    ) : currentRecordsGreyFabricfilteredData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={11}
                          className="text-center py-6 text-gray-500 border-b-0"
                        >
                          No data found
                        </td>
                      </tr>
                    ) : (
                      currentRecordsGreyFabricfilteredData?.map(
                        (row, index) => {
                          const globalIndex = index; // 0–16
                          const serialNo =
                            (greyFabricCurrentPage - 1) * recordsPerPage +
                            globalIndex +
                            1;

                          return (
                            <tr
                              key={index}
                              className="text-gray-800 bg-white even:bg-gray-100"
                            >
                              <td className="border p-1 text-center">
                                {serialNo}
                              </td>
                              {/* <td className="border p-1 pl-2 text-left">
                          {row.finYear}
                        </td> */}
                              <td className="border p-1 pl-2 text-left">
                                {row.docId}
                              </td>

                              <td className="border p-1 pl-2 text-left ">
                                {formateDate(row.docDate)}
                              </td>
                              <td className="border p-1 pr-2 text-left">
                                {row.orderNo}
                              </td>
                              <td className="border p-1 pr-2 text-left">
                                {row.supplier}
                              </td>
                              <td className="border p-1 pl-2 text-left ">
                                {row.fabricName}
                              </td>

                              <td className="border p-1 pr-2 text-left">
                                {row.color}
                              </td>
                              <td className="border p-1 pr-2 text-left">
                                {row.design}
                              </td>
                              <td className="border p-1 pr-2 text-right">
                                {row.gsm !== null &&
                                row.gsm !== undefined &&
                                !isNaN(Number(row.gsm))
                                  ? Number(row.gsm).toFixed(3)
                                  : "N/A"}
                              </td>
                              <td className="border p-1 pr-2 text-right">
                                {" "}
                                {formatQtyByUOM(row.qty, row.uom)}
                              </td>
                              <td className="border p-1 pl-2 text-left">
                                {row.uom}
                              </td>

                              {/* <td className="border p-1 pr-2 text-right">{row.rate}</td> */}

                              <td className="border p-1 pr-2 text-right  ">
                                {new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                }).format(row.price)}
                              </td>
                              <td className="border p-1 pr-2 text-right text-sky-700 ">
                                {new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                }).format(row.amount)}
                              </td>
                            </tr>
                          );
                        },
                      )
                    )}
                  </tbody>
                </table>
              </>
            ) : localPoType === "Order" &&
              selectedOrderType === "DYED FABRIC" ? (
              <>
                <table className="w-[1700px] overflow-x-auto border-collapse text-[11px] table-fixed">
                  <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                    <tr>
                      <th className="border p-1 text-center w-4">S.No</th>
                      {/* <th className="border p-1 text-center w-8">Year</th> */}
                      <th className="border p-1 text-center w-24">Doc No</th>
                      <th className="border p-1 text-center w-16">Doc Date</th>
                      <th className="border p-1 text-center w-24">Order No</th>
                      <th className="border p-1 text-center w-44">Supplier</th>
                      <th className="border p-1 text-center w-80">
                        Fabric Name
                      </th>

                      <th className="border p-1 text-center w-20">Color</th>
                      <th className="border p-1 text-center w-20">Design</th>
                      <th className="border p-1 text-center w-12">GSM</th>
                      <th className="border p-1 text-center w-12">Qty</th>
                      <th className="border p-1 text-center w-8">UOM</th>
                      <th className="border p-1 text-center w-12">Rate</th>
                      <th className="border p-1 text-center w-16">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dyedFabricLoading || dyedFabricFetching ? (
                      <tr>
                        <td colSpan={11} className=" text-center">
                          <div className="flex justify-center items-center pointer-events-none">
                            <SpinLoader />
                          </div>
                        </td>
                      </tr>
                    ) : currentRecordsDyedFabricfilteredData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={11}
                          className="text-center py-6 text-gray-500 border-b-0"
                        >
                          No data found
                        </td>
                      </tr>
                    ) : (
                      currentRecordsDyedFabricfilteredData?.map(
                        (row, index) => {
                          const globalIndex = index; // 0–16
                          const serialNo =
                            (dyedFabricCurrentPage - 1) * recordsPerPage +
                            globalIndex +
                            1;

                          return (
                            <tr
                              key={index}
                              className="text-gray-800 bg-white even:bg-gray-100"
                            >
                              <td className="border p-1 text-center">
                                {serialNo}
                              </td>
                              {/* <td className="border p-1 pl-2 text-left">
                          {row.finYear}
                        </td> */}
                              <td className="border p-1 pl-2 text-left">
                                {row.docId}
                              </td>

                              <td className="border p-1 pl-2 text-left ">
                                {formateDate(row.docDate)}
                              </td>
                              <td className="border p-1 pr-2 text-left">
                                {row.orderNo}
                              </td>
                              <td className="border p-1 pr-2 text-left">
                                {row.supplier}
                              </td>
                              <td className="border p-1 pl-2 text-left ">
                                {row.fabricName}
                              </td>

                              <td className="border p-1 pr-2 text-left">
                                {row.color}
                              </td>
                              <td className="border p-1 pr-2 text-left">
                                {row.design}
                              </td>
                              <td className="border p-1 pr-2 text-right">
                                {row.gsm !== null &&
                                row.gsm !== undefined &&
                                !isNaN(Number(row.gsm))
                                  ? Number(row.gsm).toFixed(3)
                                  : "N/A"}
                              </td>
                              <td className="border p-1 pr-2 text-right">
                                {" "}
                                {formatQtyByUOM(row.qty, row.uom)}
                              </td>
                              <td className="border p-1 pl-2 text-left">
                                {row.uom}
                              </td>

                              {/* <td className="border p-1 pr-2 text-right">{row.rate}</td> */}

                              <td className="border p-1 pr-2 text-right  ">
                                {new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                }).format(row.price)}
                              </td>
                              <td className="border p-1 pr-2 text-right text-sky-700 ">
                                {new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                }).format(row.amount)}
                              </td>
                            </tr>
                          );
                        },
                      )
                    )}
                  </tbody>
                </table>
              </>
            ) : localPoType === "Order" && selectedOrderType === "ACCESSORY" ? (
              <>
                <table className="w-[1970px] overflow-x-auto border-collapse text-[11px] table-fixed">
                  <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                    <tr>
                      <th className="border p-1 text-center w-8">S.No</th>
                      {/* <th className="border p-1 text-center w-8">Year</th> */}
                      <th className="border p-1 text-center w-[110px]">
                        Doc No
                      </th>
                      <th className="border p-1 text-center w-16">Doc Date</th>

                      <th className="border p-1 text-center w-28">Order No</th>
                      <th className="border p-1 text-center w-96">Supplier</th>
                      <th className="border p-1 text-center w-32">
                        Accessory Group Name
                      </th>
                      <th className="border p-1 text-center w-40">
                        Accessory Item Group Name
                      </th>
                      <th className="border p-1 text-center w-72">
                        Accessory Item Name
                      </th>
                      <th className="border p-1 text-center w-20">Size</th>
                      <th className="border p-1 text-center w-12">Qty</th>
                      <th className="border p-1 text-center w-12">UOM</th>
                      <th className="border p-1 text-center w-12">Rate</th>
                      <th className="border p-1 text-center w-16">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessoryLoading || accessoryFetching ? (
                      <tr>
                        <td colSpan={11} className=" text-center">
                          <div className="flex justify-center items-center pointer-events-none">
                            <SpinLoader />
                          </div>
                        </td>
                      </tr>
                    ) : currentRecordsAccessoryfilteredData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={11}
                          className="text-center py-6 text-gray-500 border-b-0"
                        >
                          No data found
                        </td>
                      </tr>
                    ) : (
                      currentRecordsAccessoryfilteredData?.map((row, index) => {
                        const globalIndex = index; // 0–16
                        const serialNo =
                          (accessoryCurrentPage - 1) * recordsPerPage +
                          globalIndex +
                          1;

                        return (
                          <tr
                            key={index}
                            className="text-gray-800 bg-white even:bg-gray-100"
                          >
                            <td className="border p-1 text-center">
                              {serialNo}
                            </td>
                            {/* <td className="border p-1 pl-2 text-left">
                          {row.finYear}
                        </td> */}
                            <td className="border p-1 pl-2 text-left">
                              {row.docId}
                            </td>

                            <td className="border p-1 pl-2 text-left ">
                              {formateDate(row.docDate)}
                            </td>

                            <td className="border p-1 pr-2 text-left">
                              {row.orderNo}
                            </td>
                            <td className="border p-1 pr-2 text-left">
                              {row.supplier}
                            </td>
                            <td className="border p-1 pr-2 text-left">
                              {row.accessGroupName}
                            </td>
                            <td className="border p-1 pr-2 text-left">
                              {row.accessItemName}
                            </td>
                            <td className="border p-1 pr-2 text-left">
                              {row.accessItemDesc}
                            </td>
                            <td className="border p-1 pr-2 text-left">
                              {row.accessSize}
                            </td>
                            <td className="border p-1 pr-2 text-right">
                              {" "}
                              {formatQtyByUOM(row.qty, row.uom)}
                            </td>
                            <td className="border p-1 pl-2 text-left">
                              {row.uom}
                            </td>

                            {/* <td className="border p-1 pr-2 text-right">{row.rate}</td> */}

                            <td className="border p-1 pr-2 text-right  ">
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(row.price)}
                            </td>
                            <td className="border p-1 pr-2 text-right text-sky-700 ">
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(row.amount)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* PAGINATION */}

        {localPoType === "General" ? (
          <>
            <div>
              <div
                className="flex justify-end items-center mt-4 space-x-2 text-[11px] "
                style={{ position: "absolute", bottom: "5px", right: "0px" }}
              >
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaStepBackward size={16} />
                </button>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaChevronLeft size={16} />
                </button>

                <span className="text-xs font-semibold px-3">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaChevronRight size={16} />
                </button>

                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaStepForward size={16} />
                </button>
              </div>
            </div>
          </>
        ) : localPoType === "Order" && selectedOrderType === "GREY YARN" ? (
          <>
            <div>
              <div
                className="flex justify-end items-center mt-4 space-x-2 text-[11px] "
                style={{ position: "absolute", bottom: "5px", right: "0px" }}
              >
                <button
                  onClick={() => setGreyYarnCurrentPage(1)}
                  disabled={greyYarnCurrentPage === 1}
                  className={`p-2 rounded-md ${
                    greyYarnCurrentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaStepBackward size={16} />
                </button>

                <button
                  onClick={() =>
                    setGreyYarnCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={greyYarnCurrentPage === 1}
                  className={`p-2 rounded-md ${
                    greyYarnCurrentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaChevronLeft size={16} />
                </button>

                <span className="text-xs font-semibold px-3">
                  Page {greyYarnCurrentPage} of {greyYarntotalPages}
                </span>

                <button
                  onClick={() =>
                    setGreyYarnCurrentPage((prev) =>
                      Math.min(prev + 1, greyYarntotalPages),
                    )
                  }
                  disabled={greyYarnCurrentPage === greyYarntotalPages}
                  className={`p-2 rounded-md ${
                    greyYarnCurrentPage === greyYarntotalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaChevronRight size={16} />
                </button>

                <button
                  onClick={() => setGreyYarnCurrentPage(greyYarntotalPages)}
                  disabled={greyYarnCurrentPage === greyYarntotalPages}
                  className={`p-2 rounded-md ${
                    greyYarnCurrentPage === greyYarntotalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaStepForward size={16} />
                </button>
              </div>
            </div>
          </>
        ) : localPoType === "Order" && selectedOrderType === "DYED YARN" ? (
          <>
            <div>
              <div
                className="flex justify-end items-center mt-4 space-x-2 text-[11px] "
                style={{ position: "absolute", bottom: "5px", right: "0px" }}
              >
                <button
                  onClick={() => setDyedYarnCurrentPage(1)}
                  disabled={dyedYarnCurrentPage === 1}
                  className={`p-2 rounded-md ${
                    dyedYarnCurrentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaStepBackward size={16} />
                </button>

                <button
                  onClick={() =>
                    setDyedYarnCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={dyedYarnCurrentPage === 1}
                  className={`p-2 rounded-md ${
                    dyedYarnCurrentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaChevronLeft size={16} />
                </button>

                <span className="text-xs font-semibold px-3">
                  Page {dyedYarnCurrentPage} of {dyedYarntotalPages}
                </span>

                <button
                  onClick={() =>
                    setDyedYarnCurrentPage((prev) =>
                      Math.min(prev + 1, dyedYarntotalPages),
                    )
                  }
                  disabled={dyedYarnCurrentPage === dyedYarntotalPages}
                  className={`p-2 rounded-md ${
                    dyedYarnCurrentPage === dyedYarntotalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaChevronRight size={16} />
                </button>

                <button
                  onClick={() => setDyedYarnCurrentPage(dyedYarntotalPages)}
                  disabled={dyedYarnCurrentPage === dyedYarntotalPages}
                  className={`p-2 rounded-md ${
                    dyedYarnCurrentPage === dyedYarntotalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaStepForward size={16} />
                </button>
              </div>
            </div>
          </>
        ) : localPoType === "Order" && selectedOrderType === "GREY FABRIC" ? (
          <>
            <div>
              <div
                className="flex justify-end items-center mt-4 space-x-2 text-[11px] "
                style={{ position: "absolute", bottom: "5px", right: "0px" }}
              >
                <button
                  onClick={() => setGreyFabricCurrentPage(1)}
                  disabled={greyFabricCurrentPage === 1}
                  className={`p-2 rounded-md ${
                    greyFabricCurrentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaStepBackward size={16} />
                </button>

                <button
                  onClick={() =>
                    setGreyFabricCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={greyFabricCurrentPage === 1}
                  className={`p-2 rounded-md ${
                    greyFabricCurrentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaChevronLeft size={16} />
                </button>

                <span className="text-xs font-semibold px-3">
                  Page {greyFabricCurrentPage} of {greyFabrictotalPages}
                </span>

                <button
                  onClick={() =>
                    setGreyFabricCurrentPage((prev) =>
                      Math.min(prev + 1, greyFabrictotalPages),
                    )
                  }
                  disabled={greyFabricCurrentPage === greyFabrictotalPages}
                  className={`p-2 rounded-md ${
                    greyFabricCurrentPage === greyFabrictotalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaChevronRight size={16} />
                </button>

                <button
                  onClick={() => setGreyFabricCurrentPage(greyFabrictotalPages)}
                  disabled={greyFabricCurrentPage === greyFabrictotalPages}
                  className={`p-2 rounded-md ${
                    greyFabricCurrentPage === greyFabrictotalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaStepForward size={16} />
                </button>
              </div>
            </div>
          </>
        ) : localPoType === "Order" && selectedOrderType === "DYED FABRIC" ? (
          <>
            <div>
              <div
                className="flex justify-end items-center mt-4 space-x-2 text-[11px] "
                style={{ position: "absolute", bottom: "5px", right: "0px" }}
              >
                <button
                  onClick={() => setDyedFabricCurrentPage(1)}
                  disabled={dyedFabricCurrentPage === 1}
                  className={`p-2 rounded-md ${
                    dyedFabricCurrentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaStepBackward size={16} />
                </button>

                <button
                  onClick={() =>
                    setDyedFabricCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={dyedFabricCurrentPage === 1}
                  className={`p-2 rounded-md ${
                    dyedFabricCurrentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaChevronLeft size={16} />
                </button>

                <span className="text-xs font-semibold px-3">
                  Page {dyedFabricCurrentPage} of {dyedFabrictotalPages}
                </span>

                <button
                  onClick={() =>
                    setDyedFabricCurrentPage((prev) =>
                      Math.min(prev + 1, dyedFabrictotalPages),
                    )
                  }
                  disabled={dyedFabricCurrentPage === dyedFabrictotalPages}
                  className={`p-2 rounded-md ${
                    dyedFabricCurrentPage === dyedFabrictotalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaChevronRight size={16} />
                </button>

                <button
                  onClick={() => setDyedFabricCurrentPage(dyedFabrictotalPages)}
                  disabled={dyedFabricCurrentPage === dyedFabrictotalPages}
                  className={`p-2 rounded-md ${
                    dyedFabricCurrentPage === dyedFabrictotalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaStepForward size={16} />
                </button>
              </div>
            </div>
          </>
        ) : localPoType === "Order" && selectedOrderType === "ACCESSORY" ? (
          <>
            <div>
              <div
                className="flex justify-end items-center mt-4 space-x-2 text-[11px] "
                style={{ position: "absolute", bottom: "5px", right: "0px" }}
              >
                <button
                  onClick={() => setAccessoryCurrentPage(1)}
                  disabled={accessoryCurrentPage === 1}
                  className={`p-2 rounded-md ${
                    accessoryCurrentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaStepBackward size={16} />
                </button>

                <button
                  onClick={() =>
                    setAccessoryCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={accessoryCurrentPage === 1}
                  className={`p-2 rounded-md ${
                    accessoryCurrentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaChevronLeft size={16} />
                </button>

                <span className="text-xs font-semibold px-3">
                  Page {accessoryCurrentPage} of {accessorytotalPages}
                </span>

                <button
                  onClick={() =>
                    setAccessoryCurrentPage((prev) =>
                      Math.min(prev + 1, accessorytotalPages),
                    )
                  }
                  disabled={accessoryCurrentPage === accessorytotalPages}
                  className={`p-2 rounded-md ${
                    accessoryCurrentPage === accessorytotalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaChevronRight size={16} />
                </button>

                <button
                  onClick={() => setAccessoryCurrentPage(accessorytotalPages)}
                  disabled={accessoryCurrentPage === accessorytotalPages}
                  className={`p-2 rounded-md ${
                    accessoryCurrentPage === accessorytotalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-gray-200"
                  }`}
                >
                  <FaStepForward size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default YearWiseTable;

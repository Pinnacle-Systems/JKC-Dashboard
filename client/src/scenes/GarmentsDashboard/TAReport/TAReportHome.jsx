import { Box, Grid, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import {
  setSelectedYear,
  setFilterBuyer,
} from "../../../redux/features/dashboardFiltersSlice";
import { useGetCompanyQuery } from "../../../redux/service/purchaseService";
import { useEffect, useRef, useState } from "react";
import TAReportStatus from "./TAReportStatus";
import TAMdReportStatus from "./TAMdReportStatus";

const REPORT_TYPES = {
  TA_REPORT: "ta_report",
  TA_MD_REPORT: "ta_md_report",
};

const TAReportHome = ({ filterBuyerList, reportType: initialReportType }) => {
  const dispatch = useDispatch();
  const buyerRef = useRef();
  // Redux state
  const { selectedYear, filterBuyer, finYr, poType } = useSelector(
    (state) => state.dashboardFilters,
  );
  const [focusBuyer, setFocusBuyer] = useState(false);
  const [reportType, setReportType] = useState(
    initialReportType || REPORT_TYPES.TA_REPORT,
  );
  const { data: companyList } = useGetCompanyQuery(
    { params: { selectedYear } },
    { skip: !selectedYear },
  );
  console.log(selectedYear, filterBuyer, "checking");

  useEffect(() => {
    setFocusBuyer(true);
    return () => setFocusBuyer(false);
  }, []); // runs when page/tab is entered

  useEffect(() => {
    if (initialReportType) {
      setReportType(initialReportType);
    }
  }, [initialReportType]);

  return (
    <>
      {/* Header and Filters */}
      <div
        className="mt-2"
        style={{
          position: "sticky",
          top: 30,
          zIndex: 50,
          backgroundColor: "white",
        }}
      >
        <Grid
          container
          spacing={0}
          // alignItems="center"
          justifyContent="space-between"
          sx={{
            backgroundColor: "white",
            color: "black",
            p: 0.5,
            borderBottom: "1px solid #afafaf",
            borderTop: "1px solid #afafaf",
          }}
        >
          {/* LEFT TITLE */}
          <Grid item md={5}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, textAlign: "start", pt: 0.5, ml: 1 }}
            >
              Overview of T&A Delay Report - {filterBuyer}
            </Typography>
          </Grid>

          {/* RIGHT FILTERS GROUP */}
          <Grid
            item
            md={7}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 2, // space between button group & selects
              pt: 0.5,
              pb: 0.4,
            }}
          >
            {/* 🟡 DROPDOWNS */}
            <Box sx={{ display: "flex", gap: 1.5 }}>
              {/* REPORT TYPE */}
              {/* <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600"
              >
                <option value={REPORT_TYPES.TA_REPORT}>T&A Report</option>
                <option value={REPORT_TYPES.TA_MD_REPORT}>T&A MD Report</option>
              </select> */}
              <div className="flex gap-2">
                {[
                  {
                    label: "T&A Report",
                    value: REPORT_TYPES.TA_REPORT,
                  },
                  {
                    label: "T&A MD Report",
                    value: REPORT_TYPES.TA_MD_REPORT,
                  },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setReportType(item.value)}
                    className={`px-3 py-1 text-[11px] font-semibold rounded-full shadow-md transition-all
        ${
          reportType === item.value
            ? "bg-blue-500 text-white scale-105"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }
        focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* YEAR */}
              <select
                value={selectedYear || ""}
                onChange={(e) => dispatch(setSelectedYear(e.target.value))}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600"
              >
                <option value="">Select Year</option>
                {(finYr?.data || []).map((item) => (
                  <option key={item.finYear} value={item.finYear}>
                    {item.finYear}
                  </option>
                ))}
              </select>

              {/* COMPANY */}
              <select
                ref={buyerRef}
                value={filterBuyer || ""}
                onChange={(e) => dispatch(setFilterBuyer(e.target.value))}
                autoFocus={focusBuyer}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600"
              >
                <option value="">Select Company</option>
                {/* {companyList?.data.map((item) => (
                  <option key={item.COMPCODE} value={item.COMPCODE}>
                    {item.COMPCODE}
                  </option>
                ))} */}
                <option value="JKC">JKC</option>
                {/* <option value="PSS">PSS</option> */}
              </select>
            </Box>
          </Grid>
        </Grid>
      </div>

      {/* Child Components */}

      <Grid container className="">
        {reportType === REPORT_TYPES.TA_REPORT && (
          <Grid item xs={12} md={12}>
            <TAReportStatus
              key={filterBuyer}
              companyName={filterBuyer}
              finYear={selectedYear}
              finYr={finYr}
              poType={poType}
              companyList={companyList}
              filterBuyerList={filterBuyerList}
            />
          </Grid>
        )}
        {reportType === REPORT_TYPES.TA_MD_REPORT && (
          <Grid item xs={12} md={12}>
            <TAMdReportStatus
              key={filterBuyer}
              companyName={filterBuyer}
              finYear={selectedYear}
              finYr={finYr}
              poType={poType}
              companyList={companyList}
              filterBuyerList={filterBuyerList}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default TAReportHome;

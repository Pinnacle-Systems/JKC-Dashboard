import { Box, Grid, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import {
  setSelectedYear,
  setFilterBuyer,
} from "../../../redux/features/dashboardFiltersSlice";
import { useGetCompanyQuery } from "../../../redux/service/purchaseService";
import { useEffect, useRef, useState } from "react";
import AttendenceReport from "./AttendenceReport";
import AttendenceDesignationWise from "./AttendenceDesignationWise";

const AttendenceHome = ({ filterBuyerList, tabData }) => {
  const dispatch = useDispatch();
  const buyerRef = useRef();
  // Redux state
  const { selectedYear, filterBuyer, finYr, poType } = useSelector(
    (state) => state.dashboardFilters,
  );
  const [focusBuyer, setFocusBuyer] = useState(false);
  const { data: companyList } = useGetCompanyQuery(
    { params: { selectedYear } },
    { skip: !selectedYear },
  );

  const [date, setDate] = useState(
    tabData?.date || new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    if (tabData?.date) {
      setDate(tabData.date);
    }
  }, [tabData?.date]);

  console.log(selectedYear, filterBuyer, "checking");

  useEffect(() => {
    setFocusBuyer(true);

    return () => setFocusBuyer(false);
  }, []); // runs when page/tab is entered

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
              Overview of Attendence - {filterBuyer}
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
              </select>
              {/* DATE */}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600"
              />
            </Box>
          </Grid>
        </Grid>
      </div>

      {/* Child Components */}

      <Grid container className="">
        <Grid item xs={12} md={12}>
          <AttendenceReport
            key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear}
            finYr={finYr}
            poType={poType}
            companyList={companyList}
            filterBuyerList={filterBuyerList}
            date={date}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <AttendenceDesignationWise
            key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear}
            finYr={finYr}
            poType={poType}
            companyList={companyList}
            filterBuyerList={filterBuyerList}
            date={date}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default AttendenceHome;

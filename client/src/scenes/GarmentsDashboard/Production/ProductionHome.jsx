import { Box, Grid, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import {
  setSelectedYear,
  setFilterBuyer,
} from "../../../redux/features/dashboardFiltersSlice";
import { useGetCompanyQuery } from "../../../redux/service/purchaseService";
import { useEffect, useRef, useState } from "react";
import ProductionStatus from "./ProductionStatus";

const ProductionHome = ({ filterBuyerList }) => {
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
              Overview of Production - {filterBuyer}
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
                <option value="PSS">PSS</option>
                {/* <option value="PSS">PSS</option> */}
              </select>
            </Box>
          </Grid>
        </Grid>
      </div>

      {/* Child Components */}

      <Grid container className="">
        <Grid item xs={12} md={12}>
          <ProductionStatus
            key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear}
            finYr={finYr}
            poType={poType}
            companyList={companyList}
            filterBuyerList={filterBuyerList}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ProductionHome;
